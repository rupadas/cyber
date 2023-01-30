
let dictionary = {}
let graphData = [];
function myFunction() {
    const editor1 = document.getElementById('editor1')
    dictionary = editor1.json_value
    dictionaryToTree(dictionary, 0, 0, null);
    let order = graphData.sort((a, b) => a.level - b.level)
    document.getElementById("nodes").value = JSON.stringify(order);
    let g = groupBy(graphData, "level")
    let r = Object.keys(g).map(x => g[x].map(y => y.name)).filter((_, i) => i >= 1).reverse()
    document.getElementById("backward").value = JSON.stringify(r);
    genrateGraph(order)
    dictionary = {}
    graphData = [];
}

function genrateGraph(order) {
    var G = new jsnx.Graph()
    G.addNodesFrom(order.map(x => {
        return [x.name, { lavel: x.level, color: 'white' }]
    }))
    let e = order.map((x => {
        return [x.name, x.parentName || 'root']
    }))
    G.addEdgesFrom(e)
    jsnx.draw(G, {
        element: '#canvas',
        withLabels: true,
        nodeStyle: {
            fill: (d) => d.data.color
        }
    })
}

function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        const curGroup = acc[key] ?? [];

        return { ...acc, [key]: [...curGroup, obj] };
    }, {});
}

function dictionaryToTree(dictionary, level = 0, parentlevel = 0, parentName = null) {
    const keys = (Array.isArray(dictionary)) ? dictionary : Object.keys(dictionary);
    keys.forEach((x) => {
        if (typeof x === 'object') {
            dictionaryToTree(x, level, parentlevel, parentName);
        } else {
            graphData.push({ name: x, level: parentlevel + 1, parentlevel, parentName });
            if (typeof dictionary[x] === 'string') {
                parentlevel++;
                graphData.push({ name: dictionary[x], level: parentlevel + 1, parentName: x });
            }
        }
        if (Array.isArray(dictionary[x]) || typeof dictionary[x] === 'object') {
            dictionaryToTree(dictionary[x], level, parentlevel + 1, x);
        }
    });
}



