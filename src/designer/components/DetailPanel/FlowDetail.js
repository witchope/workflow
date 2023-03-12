import styles from "./index.module.less";
import {Button, Input, Popover, Switch,} from "antd";
import React, {useContext, useState} from "react";
import DefaultDetail from "./DefaultDetail";
import LangContext, {SchemaContext} from "../../util/context";
import FormRender, {useForm} from 'form-render';
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import QueueAnim from 'rc-queue-anim';

const schema = {
    "type": "object",
    "properties": {
        "current": {
            "title": "当前金额",
            "type": "string",
            "description": "关系",
            "enum": [
                "=",
                "\u003E",
                "\u003C",
                "\u003E=",
                "\u003C="
            ],
            "widget": "select",
            "hidden": false,
            "width": "40%",
            "enumNames": [
                "=",
                ">",
                "<",
                ">=",
                "<="
            ],
            // "labelWidth": "10%"
        },
        "target": {
            "title": "金额",
            "type": "number",
            "width": "40%",
            "labelWidth": "5%",
            "description": "元"
        }
    },
}


const amountSchema = {
    type: "object",
    properties: {
        current: {
            title: "当前金额",
            type: "string",
            description: "人民币",
            enum: [
                "=",
                ">",
                "<",
                ">=",
                "<=",
            ],
            widget: "select",
            hidden: false,
            width: "40%",
            enumNames: [
                "等于",
                "大于",
                "小于",
                "大于或等于",
                "小于或等于",
            ],
            labelWidth: 159
        },
        target: {
            title: "金额",
            type: "number",
            width: "40%",
            labelWidth: 80,
            description: "元",
        },
    }
};


const ConditionGroup = ({value, deleteGroup, schema, form}) => {
    const [conditionFroms, setConditionFroms] = useState([]);
    const addConditionForm = (targetSchema) => {
        setConditionFroms([...conditionFroms, targetSchema])
    }

    const deleteForm = (value) => {
        const filtered = conditionFroms.filter(e => e !== value)
        setConditionFroms([...filtered]);
    }

    const popContent = (schema) => {
        if (schema?.schema?.properties) {
            const {properties} = schema.schema;
            let keys = Object.keys(properties);
            return <>
                {keys.map((value, index, array) => {
                    const targetSchema = properties[value];
                    return <Button type={"link"} key ={index} onClick={() => addConditionForm(targetSchema)}>{value}</Button>
                })}
            </>
        } else {
            return <div></div>
        }
    }

    return <div className={styles.conditionGroup} key={value}>
        <div className={styles.groupHeader}>
            <span className={styles.groupName}>条件组{value}</span>
            <div className={styles.groupCp}>
                <span>组内条件关系：</span>
                <span>或 <Switch size={"small"}/> 且 </span>
            </div>
            <div className={styles.groupOperation}>
                <Popover content={() => popContent(schema)} title="选择审批条件">
                    <Button type={"link"}><PlusOutlined/></Button>
                </Popover>
                <Button type={"link"} onClick={() => deleteGroup(value)}><DeleteOutlined/></Button>
            </div>
        </div>
        <div className={styles.groupContent}>
            {conditionFroms.length === 0 ?
                <span style={{paddingLeft: 200}}>点击右上角 + 为本条件组添加条件 ☝ </span> :
                conditionFroms.map((value, index, array) => {
                    return <div className={styles.formContent} key={index}>
                        <FormRender schema={value} form={form}/>
                        <Button
                            style={{
                                position: 'relative',
                                top: -35,
                                left: 450
                            }}
                            type={"link"}
                            onClick={() => deleteForm(1)}
                        >
                            <DeleteOutlined/>
                        </Button>
                    </div>
                })}
        </div>
    </div>;
}

/**
 * 条件组集合
 * @constructor
 */
const ConditionGroupList = ({form, schema}) => {
    const [conditionGroups, setConditionGroups] = useState([]);
    const addConditionGroup = () => {
        setConditionGroups([...conditionGroups, ++nextId])
    }

    const deleteGroup = (value) => {
        const filtered = conditionGroups.filter(e => e !== value)
        setConditionGroups([...filtered])
    }
    return <>
        <div className={styles.panelRow}>
            <Button onClick={addConditionGroup} type={"primary"}>添加条件组</Button>
        </div>
        <QueueAnim className="demo-content">
            {conditionGroups
                .map((value, index, _) => {
                    return <>
                        <ConditionGroup value={value} deleteGroup={deleteGroup} schema={schema} form={form}/>
                    </>
                })}
        </QueueAnim>
    </>
}

let nextId = 0;

const FlowDetail = ({
                        model, onChange, readOnly = false,
                    }) => {
    const {i18n} = useContext(LangContext);
    const title = i18n['sequenceFlow'];
    const form = useForm();
    const schema = useContext(SchemaContext);
    return (
        <div data-clazz={model.clazz}>
            {/*<div className={styles.panelTitle}>{title}</div>*/}
            <div className={styles.panelBody}>
                <DefaultDetail model={model} onChange={onChange} readOnly={readOnly}/>
                <div className={styles.panelRow}>
                    <div>{i18n['sequenceFlow.expression']}：</div>
                    <Input.TextArea style={{width: '100%', fontSize: 12}}
                                    rows={4}
                                    value={model.conditionExpression}
                                    onChange={(e) => {
                                        onChange('conditionExpression', e.target.value)
                                    }}
                                    disabled={readOnly}
                    />
                </div>
                <div className={styles.panelRow}>
                    <div>{i18n['sequenceFlow.seq']}：</div>
                    <Input style={{width: '100%', fontSize: 12}}
                           value={model.seq}
                           onChange={(e) => {
                               onChange('seq', e.target.value)
                           }}
                           disabled={readOnly}
                    />
                </div>
                <ConditionGroupList form={form} schema={schema}/>
                {/*<div className={styles.panelRow}>*/}
                {/*    <Checkbox onChange={(e) => onChange('reverse', e.target.checked)}*/}
                {/*              disabled={readOnly}*/}
                {/*              checked={!!model.reverse}>{i18n['sequenceFlow.reverse']}</Checkbox>*/}
                {/*</div>*/}
            </div>
        </div>
    )
};

export default FlowDetail;
