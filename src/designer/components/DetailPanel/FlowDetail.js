import styles from "./index.module.less";
import {Checkbox, Collapse, Input,} from "antd";
import React, {useContext} from "react";
import DefaultDetail from "./DefaultDetail";
import LangContext from "../../util/context";
import FormRender, {useForm} from 'form-render';

const schema = {
    type: 'object',
    properties: {
        input1: {
            title: '简单输入框',
            type: 'string',
            required: true,
        },
        select1: {
            title: '单选',
            type: 'string',
            enum: ['a', 'b', 'c'],
            enumNames: ['早', '中', '晚'],
        },
    },
};

const {Panel} = Collapse;
const FlowDetail = ({model, onChange, readOnly = false,}) => {
    const {i18n} = useContext(LangContext);
    const title = i18n['sequenceFlow'];
    const form = useForm();
    return (
        <div data-clazz={model.clazz}>

            <div className={styles.panelTitle}>{title}</div>
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
                <div className={styles.panelRow}>
                    <Checkbox onChange={(e) => onChange('reverse', e.target.checked)}
                              disabled={readOnly}
                              checked={!!model.reverse}>{i18n['sequenceFlow.reverse']}</Checkbox>
                </div>
                <Collapse defaultActiveKey={['1']} onChange={onChange}>
                    <Panel header="This is panel header 1" key="1">
                        <FormRender schema={schema} form={form}/>
                    </Panel>
                    <Panel header="This is panel header 2" key="2">
                        <p>text2</p>
                    </Panel>
                    <Panel header="This is panel header 3" key="3">
                        <p>text3</p>
                    </Panel>
                </Collapse>
            </div>
        </div>
    )
};

export default FlowDetail;
