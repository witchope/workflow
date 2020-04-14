import Designer from "./designer";
import React, {Component} from "react";
import {Button, Modal, Dropdown, Menu} from 'antd'
import {GlobalOutlined} from '@ant-design/icons'
import {convertVo} from "./designer/util/converter";

class Demo extends Component {
    constructor(props) {
        super(props);
        this.wfdRef = React.createRef();
    }

    state = {
        modalVisible: false,
        selectedLang: 'zh',
        data: {},
        id: 208,
    };

    async UNSAFE_componentWillMount() {
        const {id} = this.state;
        if (id) {
            this.getRemoteData(id);

        }
    }

    getRemoteData(id) {
        const url = `/approval/queryProcessDetail?processId=208`;
        const header = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        fetch(url, header)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const resp = convertVo(data.data)
                this.setState({data: resp})
            });
    }

    langMenu = (
        <Menu onClick={(lang) => {
            this.changeLang(lang)
        }}>
            <Menu.Item key="zh">
            <span role="img">
              {"🇨🇳"}
            </span>
                {" 简体中文"}
            </Menu.Item>
            <Menu.Item key="en">
            <span role="img">
              {"🇬🇧"}
            </span>
                {" English"}
            </Menu.Item>
        </Menu>
    );

    handleModalVisible(modalVisible) {
        this.setState({modalVisible})
    }

    changeLang({key}) {
        this.setState({selectedLang: key})
    }

    render() {

        const candidateUsers = [{id: '1', name: 'Tom'}, {id: '2', name: 'Steven'}, {id: '3', name: 'Andy'}];
        const candidateGroups = [{id: '1', name: 'Manager'}, {id: '2', name: 'Security'}, {id: '3', name: 'OA'}];
        const height = 600;
        const {modalVisible, selectedLang, data: remoteData, id} = this.state;
        return (
            <div>
                <Button type="primary" style={{float: 'right', marginTop: 6, marginRight: 6}}
                        onClick={() => {
                            Modal.info({
                                title: '确定要保存',
                                onOk: () => this.wfdRef.current.graph.saveJSON()
                            })
                        }
                        }>保存</Button>
                <Button style={{float: 'right', marginTop: 6, marginRight: 6}}
                        onClick={() => this.handleModalVisible(true)}>查看流程图</Button>
                <Dropdown overlay={this.langMenu} trigger={['click']}>
                    <GlobalOutlined style={{fontSize: 18, float: 'right', marginTop: 12, marginRight: 20}}/>
                </Dropdown>
                <Designer
                    ref={this.wfdRef}
                    data={remoteData}
                    height={height}
                    mode={"edit"} users={candidateUsers}
                    groups={candidateGroups}
                    lang={selectedLang}
                    isView={false}
                    updateId={(id) => this.setState({id})}
                    id={id}
                />
                <Modal
                    title="查看流程图"
                    visible={modalVisible}
                    onCancel={() => this.handleModalVisible(false)}
                    width={800}
                    maskClosable={false}
                    footer={null}
                    destroyOnClose
                    bodyStyle={{height}}>
                    <Designer
                        data={remoteData}
                        height={height - 40}
                        isView
                    />
                </Modal>
            </div>
        );
    }
}

export default Demo;
