export function convertVo(json) {
    if (!json) return;
    const nodeContainer = [];
    const edgeContainer = [];

    const {start, end, tasks, decision} = json;
    if (!start) return;
    const startNode = {
        id: start.name || '',
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

    const gatewayNodes = decision.map(x => {
        return {
            id: x.name || '',
            x: x.x,
            y: x.y,
            label: x.displayName,
            clazz: 'inclusiveGateway',
        }
    })

    nodeContainer.push(endNode, startNode, ...taskNodes, ...gatewayNodes);

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

    const gatewayEdges = decision.flatMap(x => {
        return x.transitions.map(y => {
            return {
                source: x.name,
                target: y.to,
                sourceAnchor: y.sourceAnchor,
                targetAnchor: y.targetAnchor,
                clazz: 'flow'
            }
        })
    })

    edgeContainer.push(startEdge, ...taskEdges, ...gatewayEdges)

    const result = {
        nodes: nodeContainer,
        edges: edgeContainer,
    }

    return result;
}

const convertDto = (json) => {
    const {nodes, edges} = json;

    let startNode = nodes.filter(x => x.clazz === 'start')[0];
    let startEdge = edges.filter(x => x.source === startNode.id)[0];

    const start = {
        displayName: startNode.label || 'start',
        name: startNode.id,
        actorRule: null,
        transition: {
            displayName: "startEdge",
            name: "startEdge",
            to: startEdge.target,
            sourceAnchor: startEdge.sourceAnchor,
            targetAnchor: startEdge.targetAnchor
        },
        x: startNode.x,
        y: startNode.y,
    };

    let endNode = nodes.filter(x => x.clazz === 'end')[0];

    const end = {
        displayName: endNode.label || 'end',
        name: endNode.id,
        x: endNode.x,
        y: endNode.y,
    }

    debugger;
    const tasks = nodes
        .filter(x => x.id.startsWith("task"))
        .map((x, i) => {
            let edge = edges.filter(y => y.source === x.id)[0];
            return {
                displayName: x.label,
                name: x.id,
                actorRule: null,
                performType: "ANY",
                transition: {
                    displayName: edge.label || (`taskEdge${new Date().getMilliseconds()}`),
                    name: edge.label || (`taskEdge${new Date().getMilliseconds()}${i}`),
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
                .map((x, i) => {
                    return {
                        displayName: x.label || (`decisionEdge${new Date().getMilliseconds()}`),
                        name: x.label || (`decisionEdge${new Date().getMilliseconds()}${i}`),
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
        name: start.name + new Date().getMilliseconds(),
        displayName: start.displayName,
        start,
        decision,
        end,
        tasks
    }
    return result;
}

export default convertDto;
