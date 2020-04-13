export function convertVo(json) {
    const from = {
        tasks: [
            {
                displayName: "一级审",
                name: "一级审",
                actorRule: {approvalWay: 0, roleIds: [{id: 29}]},
                transition: {
                    displayName: "transition0",
                    name: "transition0",
                    to: "end",
                    sourceAnchor: 1,
                    targetAnchor: 2,
                },
                x: 200,
                y: 100,
                taskType: "",
                form: null,
                performType: "ANY",
                autoExecute: true
            }
        ],
        decision: null,
        displayName: "入库审批",
        name: "入库审批",
        start: {
            displayName: "入库审批",
            name: "入库审批",
            actorRule: null,
            transition: {
                displayName: "transition",
                name: "transition",
                to: "一级审",
                sourceAnchor: 3,
                targetAnchor: 2
            },
            x: 200,
            y: 10
        },
        end: {
            displayName: "结束",
            name: "end",
            actorRule: null,
            transition: null,
            x: 200,
            y: 90
        }
    };

    const nodeContainer = [];
    const edgeContainer = [];

    const {start, end, tasks} = from;
    const startNode = {
        id: start.name,
        x: start.x,
        y: start.y,
        label: start.displayName,
        clazz: 'start',
    }
    const endNode = {
        id: end.name,
        x: end.x,
        y: end.y,
        label: start.displayName,
        clazz: 'end'
    }
    const taskNodes = tasks.map((x, i) => {
        return {
            id: x.name,
            x: x.x,
            y: x.y,
            label: x.displayName,
            clazz: 'userTask',
        }
    });
    nodeContainer.push(endNode, startNode, ...taskNodes);

    const startEdge = {
        source: start.name,
        target: start.transition.to,
        sourceAnchor: start.transition.sourceAnchor,
        targetAnchor: start.transition.targetAnchor,
        clazz: 'flow'
    }

    const taskEdges = tasks.map(x => {
        const {transition} = x;
        return {
            source: x.name,
            target: transition.to,
            sourceAnchor: transition.sourceAnchor,
            targetAnchor: transition.targetAnchor,
            clazz: 'flow'
        }
    })

    edgeContainer.push(startEdge, ...taskEdges)

    const result = {
        nodes: nodeContainer,
        edges: edgeContainer,
    }

    console.log(result);
}

const convertDto = (json) => {
    debugger;
    const to = {
        nodes: [{id: 'startNode1', x: 50, y: 200, label: '', clazz: 'start',},
            {id: 'startNode2', x: 50, y: 320, label: '', clazz: 'timerStart',},
            {id: 'taskNode1', x: 200, y: 200, label: '主任审批', clazz: 'userTask',},
            {id: 'taskNode2', x: 400, y: 200, label: '经理审批', clazz: 'scriptTask',},
            {id: 'gatewayNode', x: 400, y: 320, label: '金额大于1000', clazz: 'inclusiveGateway',},
            {id: 'taskNode3', x: 400, y: 450, label: '董事长审批', clazz: 'receiveTask',},
            {id: 'catchNode1', x: 600, y: 200, label: '等待结束', clazz: 'signalCatch',},
            {id: 'endNode', x: 600, y: 320, label: '', clazz: 'end',}],
        edges: [{source: 'startNode1', target: 'taskNode1', sourceAnchor: 1, targetAnchor: 3, clazz: 'flow'},
            {source: 'startNode2', target: 'gatewayNode', sourceAnchor: 1, targetAnchor: 3, clazz: 'flow'},
            {source: 'taskNode1', target: 'catchNode1', sourceAnchor: 0, targetAnchor: 0, clazz: 'flow'},
            {source: 'taskNode1', target: 'taskNode2', sourceAnchor: 1, targetAnchor: 3, clazz: 'flow'},
            {source: 'taskNode2', target: 'gatewayNode', sourceAnchor: 1, targetAnchor: 0, clazz: 'flow'},
            {source: 'taskNode2', target: 'taskNode1', sourceAnchor: 2, targetAnchor: 2, clazz: 'flow'},
            {source: 'gatewayNode', target: 'taskNode3', sourceAnchor: 2, targetAnchor: 0, clazz: 'flow'},
            {source: 'gatewayNode', target: 'endNode', sourceAnchor: 1, targetAnchor: 2, clazz: 'flow'},
            {source: 'taskNode3', target: 'endNode', sourceAnchor: 1, targetAnchor: 1, clazz: 'flow'},
            {source: 'catchNode1', target: 'endNode', sourceAnchor: 1, targetAnchor: 0, clazz: 'flow'}]
    };

    const {nodes, edges} = json;

    let startNode = nodes.filter(x => x.clazz === 'start')[0];
    let startEdge = edges.filter(x => x.source === startNode.id)[0];

    const start = {
        displayName: startNode.label,
        name: startNode.id,
        actorRule: null,
        transition: {
            displayName: "transition",
            name: "transition",
            to: startEdge.target,
            sourceAnchor: startEdge.sourceAnchor,
            targetAnchor: startEdge.targetAnchor
        },
        x: startNode.x,
        y: startNode.y,
    };

    let endNode = nodes.filter(x => x.clazz === 'end')[0];

    const end = {
        displayName: endNode.label,
        name: endNode.id,
        x: endNode.x,
        y: endNode.y,
    }

    const tasks = nodes
        .filter(x => x.id.startsWith("task"))
        .map(x => {
            let edge = edges.filter(y => y.source === x.id)[0];
            return {
                displayName: x.label,
                name: x.id,
                actorRule: null,
                performType: "ANY",
                transition: {
                    displayName: edge.label || 'edge',
                    name: edge.label || 'edge',
                    to: edge.target,
                    sourceAnchor: edge.sourceAnchor,
                    targetAnchor: edge.targetAnchor
                },
                x: x.x,
                y: x.y,
            }
        })

    const decision = nodes
        .filter(x => x.id.startsWith("gateway"))
        .map(x => {
            let edgeNode = edges
                .filter(y => y.source === x.id)
                .map(x => {
                    return {
                        displayName: x.label || 'edge',
                        name: x.label || 'edge',
                        to: x.target,
                        sourceAnchor: x.sourceAnchor,
                        targetAnchor: x.targetAnchor
                    }
                });
            return {
                displayName: x.label,
                name: x.id,
                actorRule: null,
                transitions: edgeNode,
                x: x.x,
                y: x.y,
            }
        })

    const result = {
        name: start.name,
        displayName: start.displayName,
        start,
        decision,
        end,
        tasks
    }
    console.log(result);

}

export default convertDto;
