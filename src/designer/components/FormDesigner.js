import React, {useRef} from "react";
import Generator, {
    defaultCommonSettings,
    defaultGlobalSettings,
    defaultSettings,
} from 'fr-generator';
import {Button, Col, Input, Row} from "antd";

const NewWidget = ({value = 0, onChange}) => {
    return <Input/>
};

const cascade = {
    type: "object",
    properties: {
        case3: {
            title: "列表/显示不同组件",
            type: "object",
            properties: {
                ruleList: {
                    title: "球员筛选",
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            attr: {
                                title: "标准",
                                type: "string",
                                widget: "select",
                                enum: [
                                    "goal",
                                    "league"
                                ],
                                enumNames: [
                                    "入球数",
                                    "所在联盟"
                                ],
                                width: "40%"
                            },
                            relation: {
                                title: "关系",
                                type: "string",
                                enum: [
                                    ">",
                                    "<",
                                    "="
                                ],
                                widget: "select",
                                hidden: "{{rootValue.attr === 'league'}}",
                                width: "20%"
                            },
                            goal: {
                                title: "入球数",
                                type: "string",
                                rules: [
                                    {
                                        pattern: "^[0-9]+$",
                                        message: "输入正确得分"
                                    }
                                ],
                                hidden: "{{rootValue.attr === 'league'}}",
                                width: "40%"
                            },
                            league: {
                                title: "名称",
                                type: "string",
                                enum: [
                                    "a",
                                    "b",
                                    "c"
                                ],
                                enumNames: [
                                    "西甲",
                                    "英超",
                                    "中超"
                                ],
                                widget: "select",
                                hidden: "{{rootValue.attr !== 'league'}}",
                                width: "40%"
                            }
                        }
                    }
                }
            }
        }
    }
}

const amountSchema = {
    title: "金额范围",
    type: "array",
    items: {
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
    }
};
const singleSchema = {
    title: "单行输入",
    type: "array",
    items: {
        type: "object",
        properties: {
            current: {
                title: "当前字段",
                type: "string",
                widget: "select",
                enum: [
                    "field",
                ],
                enumNames: [
                    "字段名",
                ],
                hidden: false,
                width: "30%",
                labelWidth: 159
            },
            relation: {
                title: "",
                type: "string",
                enum: [
                    "=",
                    ">",
                    "<",
                    ">=",
                    "<=",
                ],
                widget: "select",
                hidden: false,
                width: "30%",
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
                type: "string",
                width: "40%",
                labelWidth: 80,
            },
        }
    }
};

const dateSchema =
    {
        type: "object",
        properties: {
            dateRange: {
                title: "日期范围",
                type: "range",
                format: "dateTime",
                props: {
                    placeholder: [
                        "开始时间",
                        "结束时间"
                    ]
                }
            }
        },
        labelWidth: 120,
        displayType: "row"
    };


const FormDesigner = ({schema, saveSchema}) => {
    debugger;
    // console.log(defaultSettings);
    // console.log(defaultCommonSettings);
    // console.log(defaultGlobalSettings)
    const genRef = useRef();

    const handleOk = () => {
        const value = genRef.current && genRef.current.getValue();
        console.log(value);
        saveSchema(value);
    };

    return <div style={{height: '80vh'}}>
        <Generator
            defaultValue={schema}
            ref={genRef}
            widgets={{NewWidget}}
            hideId
            settings={[
                {
                    title: '基础组件',
                    widgets: [
                        {
                            text: '单行文本判断',
                            name: 'single',
                            schema: {
                                ...singleSchema
                            }
                        },
                        {
                            text: '金额判断',
                            name: 'amount',
                            schema: {
                                ...amountSchema
                            }
                        },
                        {
                            text: '日期选择',
                            name: 'date',
                            schema: {
                                ...dateSchema
                            }
                        }
                    ],
                },
            ]}
            commonSettings={{
                description: {
                    title: '自定义共通用的入参',
                    type: 'string',
                },
            }}
        />
        <Row>
        </Row>
        <Col span={24}> </Col>
        <Row>
            <Col span={10}></Col>
            <Col span={10}></Col>
            <Col span={4}>
                <Button type={"primary"} onClick={handleOk}>保存</Button>
            </Col>
        </Row>
    </div>

}

export default FormDesigner;