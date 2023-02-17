import React from "react";
import Generator, {
    defaultCommonSettings,
    defaultGlobalSettings,
    defaultSettings,
} from 'fr-generator';
import {Input} from "antd";

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

const schema = {
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


const FormDesigner = (props) => {
    console.log(defaultSettings);
    console.log(defaultCommonSettings);
    console.log(defaultGlobalSettings)

    return <div style={{height: '50vh'}}>
        <Generator
            widgets={{NewWidget}}
            settings={[
                {
                    title: '个人信息',
                    widgets: [
                        {
                            text: '计数器',
                            name: '1',
                            schema: {
                                title: '计数器',
                                type: 'number',
                                widget: 'NewWidget',
                            },
                            setting: {
                                api: {title: 'api', type: 'string'},
                            },
                        },
                        {
                            text: 'object',
                            name: 'object',
                            schema: {
                                title: '对象',
                                type: 'object',
                                properties: {},
                            },
                            setting: {},
                        },
                        {
                            text: 'array',
                            name: 'array',
                            schema: {
                                title: '数组',
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {},
                                },
                            },
                            setting: {},
                        },
                        {
                            text: 'football',
                            name: 'football',
                            schema: {
                                ...schema
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
    </div>

}

export default FormDesigner;