import styles from "./index.module.less";
import {Button, Input, Popover, Switch,} from "antd";
import React, {useContext, useEffect, useState} from "react";
import DefaultDetail from "./DefaultDetail";
import LangContext, {SchemaContext} from "../../util/context";
import FormRender, {useForm} from 'form-render';
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";

let nextId = 0;
let nextFormId = 0;
let nextGroupId = 0;

const ConditionGroup = ({value, deleteGroup, schema, form, updateGroup}) => {
    const {conditionFroms = [], groupId} = value;
    const addConditionForm = (targetSchema) => {
        let newProperties = {};
        let index = ++nextId;
        for (const [key, val] of Object.entries(targetSchema.properties)) {
            newProperties = {
                ...newProperties,
                [key + (index)]: val,
            }
        }
        updateGroup(groupId, [...conditionFroms, {...targetSchema, formId: ++nextFormId, properties: newProperties}])
    }

    const deleteForm = (value) => {
        const filtered = conditionFroms.filter(e => e.formId !== value.formId);
        updateGroup(groupId, [...filtered])
    }

    const popContent = (schema) => {
        if (schema?.schema?.properties) {
            const {properties} = schema.schema;
            let keys = Object.keys(properties);
            return <>
                {keys.map((value, index, _) => {
                    const targetSchema = properties[value];
                    return <Button type={"link"} key={index}
                                   onClick={() => addConditionForm(targetSchema)}>{value}</Button>
                })}
            </>
        } else {
            return <div>请自定义审批表单</div>
        }
    }

    return <div className={styles.conditionGroup} key={groupId}>
        <div className={styles.groupHeader}>
            <span className={styles.groupName}>条件组{groupId}</span>
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
                conditionFroms.map((value, index, _) => {
                    return <div className={styles.formContent} key={index}>
                        <FormRender schema={value} form={form}/>
                        <Button
                            style={{
                                position: 'relative',
                                top: -32,
                                left: 600
                            }}
                            type={"link"}
                            onClick={() => deleteForm(value)}
                        >
                            <DeleteOutlined/>
                        </Button>
                    </div>
                })}
        </div>
    </div>;
}

const ConditionGroupList = ({model, form, schema, onChange}) => {
    const {conditionGroups = [], conditionGroupValues = {}} = model;

    useEffect(() => {
       form.setValues(conditionGroupValues);
    })

    const addConditionGroup = () => {
        onChange('conditionGroups', [...conditionGroups, {groupId: ++nextGroupId}])
        const values = form.getValues();
        onChange('conditionGroupValues', values);
    }

    const updateGroup = (updatedGroupId, conditionFroms) => {
        conditionGroups.forEach((value) => {
            if (value.groupId === updatedGroupId) {
                value.conditionFroms = conditionFroms;
            }
        });
        onChange('conditionGroups', [...conditionGroups]);
        const values = form.getValues();
        onChange('conditionGroupValues', values)
    }

    const deleteGroup = (value) => {
        const filtered = conditionGroups.filter(e => e.groupId !== value.groupId)
        onChange('conditionGroups', [...filtered]);
        const values = form.getValues();
        onChange('conditionGroupValues', values)
    }
    return <>
        <div className={styles.panelRow}>
            <Button onClick={addConditionGroup} type={"primary"}>添加条件组</Button>
        </div>
        {conditionGroups
            .map((groupValue, index, _) => {
                return <>
                    <ConditionGroup
                        key={groupValue.groupId}
                        value={groupValue}
                        deleteGroup={deleteGroup}
                        schema={schema}
                        form={form}
                        updateGroup={updateGroup}
                    />
                </>
            })}
    </>
}


const FlowDetail = ({
                        model, onChange, readOnly = false,
                    }) => {
    const {i18n} = useContext(LangContext);
    const title = i18n['sequenceFlow'];
    const form = useForm();
    const schema = useContext(SchemaContext);

    const updateConditionGroupValues = () => {
        const values = form.getValues();
        onChange('conditionGroupValues', values);
    }

    return (
        <div data-clazz={model.clazz} onBlur={updateConditionGroupValues}>
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
                <ConditionGroupList model={model} form={form} schema={schema} onChange={onChange}/>
                {/*<div className={styles.panelRow}>*/}
                {/*    <Checkbox onChange={(e) => onChange('reverse', e.target.checked)}*/}
                {/*              disabled={readOnly}*/}
                {/*              checked={!!model.reverse}>{i18n['sequenceFlow.reverse']}</Checkbox>*/}
                {/*</div>*/}
            </div>
            <Button onClick={() => {
                let values = form.getValues();
                console.log(values);
            }
            }>submit</Button>
        </div>
    )
};

export default FlowDetail;
