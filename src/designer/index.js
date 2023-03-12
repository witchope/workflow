import React, {Component, useState} from 'react';
import styles from './index.module.less';
import G6 from '@antv/g6/src';
import {getShapeName} from './util/clazz'
import locale from './locales';
import Command from './plugins/command'
import Toolbar from './plugins/toolbar'
import AddItemPanel from './plugins/addItemPanel'
import CanvasPanel from './plugins/canvasPanel'
import {exportXML} from "./util/bpmn";
import LangContext, {SchemaContext} from "./util/context";
import DetailPanel from "./components/DetailPanel";
import ItemPanel from "./components/ItemPanel";
import ToolbarPanel from "./components/ToolbarPanel";
import registerShape from './shape'
import registerBehavior from './behavior'
import convertDto from "./util/converter";
import {Drawer, Modal} from "antd";

registerShape(G6);
registerBehavior(G6);

class Designer extends Component {
    constructor(props) {
        super(props);
        this.pageRef = React.createRef();
        this.toolbarRef = React.createRef();
        this.itemPanelRef = React.createRef();
        this.detailPanelRef = React.createRef();
        this.resizeFunc = () => {
        };
        this.state = {
            selectedModel: {},
            processModel: {
                id: '',
                name: '',
                clazz: 'process',
                dataObjs: [],
                signalDefs: [],
                messageDefs: [],
            },
            open: false,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data) {
            if (this.graph) {
                this.graph.changeData(this.initShape(this.props.data));
                this.graph.setMode(this.props.mode);
                this.graph.emit('canvas:click');
                if (this.cmdPlugin) {
                    this.cmdPlugin.initPlugin(this.graph);
                }
                if (this.props.isView) {
                    this.graph.fitView(5)
                }
            }
        }
    }

    componentDidMount() {
        const {isView, mode} = this.props;
        const height = this.props.height - 1;
        const width = this.pageRef.current.offsetWidth;
        let plugins = [];
        if (!isView) {
            this.cmdPlugin = new Command();
            const toolbar = new Toolbar({container: this.toolbarRef.current});
            const addItemPanel = new AddItemPanel({container: this.itemPanelRef.current});
            const canvasPanel = new CanvasPanel({container: this.pageRef.current});
            plugins = [this.cmdPlugin, toolbar, addItemPanel, canvasPanel];
        }
        this.graph = new G6.Graph({
            plugins: plugins,
            container: this.pageRef.current,
            height: height,
            width: width,
            modes: {
                default: ['drag-canvas', 'clickSelected'],
                view: [],
                edit: ['drag-canvas', 'hoverNodeActived', 'hoverAnchorActived', 'dragNode', 'dragEdge',
                    'dragPanelItemAddNode', 'clickSelected', 'deleteItem', 'itemAlign', 'dragPoint'],
            },
            defaultEdge: {
                shape: 'flow-polyline-round',
            },
        });
        this.graph.saveXML = (createFile = true) => exportXML(this.graph.save(), this.state.processModel, createFile);
        this.graph.saveJSON = () => this.saveJOSN(this.graph.save());
        if (isView) {
            this.graph.setMode("view");
        } else {
            this.graph.setMode(mode);
        }
        this.graph.data(this.props.data ? this.initShape(this.props.data) : {nodes: [], edges: []});
        this.graph.render();
        if (isView && this.props.data && this.props.data.nodes) {
            this.graph.fitView(5)
        }
        this.initEvents();
    }

    saveJOSN(json) {
        const out = convertDto(json);

        if (this.props.id) {
            out.processId = this.props.id;
        }

        const url = "/approval/saveProcess";
        const header = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(out)
        };

        const response = fetch(url, header)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status === 500) {
                    Modal.error({
                        title: data.message
                    })
                    return
                }
                Modal.success({title: '保存成功'});
                this.props.updateId(data.data);
            })

    }

    initShape(data) {
        if (data && data.nodes) {
            return {
                nodes: data.nodes.map(node => {
                    return {
                        shape: getShapeName(node.clazz),
                        ...node,
                    }
                }),
                edges: data.edges
            }
        }
        return data;
    }

    initEvents() {
        this.graph.on('afteritemselected', (items) => {
            if (items && items.length > 0) {
                let item = this.graph.findById(items[0]);
                if (!item) {
                    item = this.getNodeInSubProcess(items[0])
                }
                this.setState({selectedModel: {...item.getModel()}, open: true});
            } else {
                this.setState({selectedModel: this.state.processModel, open: true});
            }
        });
        const page = this.pageRef.current;
        const graph = this.graph;
        const height = this.props.height - 1;
        this.resizeFunc = () => {
            graph.changeSize(page.offsetWidth, height);
        };
        window.addEventListener("resize", this.resizeFunc);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeFunc);
        this.graph.getNodes().forEach(node => {
            node.getKeyShape().stopAnimate();
        });
    }

    onItemCfgChange(key, value) {
        const items = this.graph.get('selectedItems');
        if (items && items.length > 0) {
            let item = this.graph.findById(items[0]);
            if (!item) {
                item = this.getNodeInSubProcess(items[0])
            }
            if (this.graph.executeCommand) {
                this.graph.executeCommand('update', {
                    itemId: items[0],
                    updateModel: {[key]: value}
                });
            } else {
                this.graph.updateItem(item, {[key]: value});
            }
            this.setState({selectedModel: {...item.getModel()}});
        } else {
            const canvasModel = {...this.state.processModel, [key]: value};
            this.setState({selectedModel: canvasModel});
            this.setState({processModel: canvasModel});
        }
    }

    getNodeInSubProcess(itemId) {
        const subProcess = this.graph.find('node', (node) => {
            if (node.get('model')) {
                const clazz = node.get('model').clazz;
                if (clazz === 'subProcess') {
                    const containerGroup = node.getContainer();
                    const subGroup = containerGroup.subGroup;
                    const item = subGroup.findById(itemId);
                    return subGroup.contain(item);
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
        if (subProcess) {
            const group = subProcess.getContainer();
            return group.getItem(subProcess, itemId);
        }
        return null;
    }

    onClose = () => {
        this.setState({...this.state, open: false});
    };

    render() {
        const height = this.props.height;
        const {isView, mode, users, groups, lang} = this.props;
        const {selectedModel, processModel, open} = this.state;
        const {signalDefs, messageDefs} = processModel;
        const i18n = locale[lang.toLowerCase()];
        const readOnly = mode !== "edit";

        return (
            <LangContext.Provider value={{i18n, lang}}>
                <div className={styles.root}>
                    {!isView && <ToolbarPanel ref={this.toolbarRef}/>}
                    <div>
                        {!isView && <ItemPanel ref={this.itemPanelRef} height={height}/>}
                        <div ref={this.pageRef} className={styles.canvasPanel}
                             style={{height, width: isView ? '100%' : '70%', borderBottom: isView ? 0 : null}}/>
                    </div>
                    <Drawer
                        title={i18n[selectedModel.clazz] ? i18n[selectedModel.clazz] : '模块配置'}
                        width={720}
                        placement="right"
                        onClose={this.onClose}
                        open={open}
                        bodyStyle={{paddingBottom: 80}}
                    >
                        {!isView && <DetailPanel ref={this.detailPanelRef}
                                                 height={height}
                                                 model={selectedModel}
                                                 readOnly={readOnly}
                                                 users={users}
                                                 groups={groups}
                                                 signalDefs={signalDefs}
                                                 messageDefs={messageDefs}
                                                 onChange={(key, val) => {
                                                     this.onItemCfgChange(key, val)
                                                 }}/>
                        }
                    </Drawer>
                </div>
            </LangContext.Provider>
        );
    }
}

Designer.defaultProps = {
    height: 500,
    isView: false,
    mode: 'edit',
    lang: 'zh',
};

export default Designer;
