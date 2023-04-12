import './App.css';
import { useEffect, useState } from 'react';
import { Graph } from 'react-d3-graph';

function App() {
  const [bits, setBits] = useState(0)
  const [numNodes, setNumNodes] = useState(0)
  const [bool1, setBool1] = useState(false)
  const [nodes, setNodes] = useState([])
  const [ft, setFT] = useState({})
  const [key, setKey] = useState()
  const [init, setInit] = useState()
  const [resultArr, setResultArr] = useState([])
  const [graph, setGraph] = useState({})

  useEffect((effect) => {
    console.log(graph)
  }, [graph])

  const Myconfig = {
    node: {
      color: 'white',
      size: 200,
      fontSize: 16,
      labelProperty: 'label',
      fontColor : "white"
    },
    link: {
      color: 'white',
      strokeWidth: 2,
    },
    height: 500,
    width: 800,
    d3: {
      alphaTarget: 0.05,
      gravity: -100,
    },
    layout: {
      type: 'd3Force',
      alphaTarget: 0.05,
      gravity: -100,
    },
  }

  const simulationConfig = {
    alpha: 0.5,
    alphaMin: 0.01,
    alphaDecay: 0.05,
    velocityDecay: 0.3,
    force: {
      name: 'circle',
      radius: 200,
      strength: 1,
      x: 400,
      y: 250,
    },
  };

  const createGraph = async () => {
    var x = {}
    x['nodes'] = []
    x['links'] = []
    for (var i = 0; i < Math.pow(2, bits); i++) {
      var y = { id: i, x: 400 + 200 * Math.cos((2 * Math.PI * i) / (Math.pow(2, bits+1))),
      y: 250 + 200 * Math.sin((2 * Math.PI * i) /Math.pow(2, bits+1)), }
      x['nodes'].push(y)
      y = { source: i, target: ((i + 1) % (Math.pow(2, bits))) }
      x['links'].push(y);
    }
    setGraph(x)
    console.log(x)
    console.log(graph)
  }
  const succ = (arr, element) => {
    var sol = arr[0];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] >= element) {
        sol = arr[i];
        break;
      }
    }
    return sol
  }

  const calculateFingerTable = (arr) => {
    var obj = {}
    var max = Math.pow(2, bits) - 1
    for (var i = 0; i < arr.length; i++) {
      var ele = arr[i];
      obj[ele] = [];
      for (var j = 0; j < bits; j++) {
        var target = (ele + Math.pow(2, j)) % max
        obj[ele].push(succ(arr, target))
      }
    }
    setFT(obj)
  }

  const calcNodes = () => {
    if (numNodes > (Math.pow(2, bits))) {
      alert('Too many nodes')
      return
    }
    var arr = [];
    var max = Math.pow(2, bits) - 1
    while (arr.length < numNodes) {
      var r = Math.floor(Math.random() * max) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    arr.sort(function (a, b) { return a - b })
    setNodes(arr)
    calculateFingerTable(arr)
    createGraph()
  }

  const startSearch = () => {
    var max = Math.pow(2, bits) - 1;
    if (key > max) {
      alert('Key entered cannot exist')
      return;
    }
    if (!ft[init]) {
      alert("Please enter an active node");
      return
    }
    var tempArr = [];
    tempArr.push(init)
    var n = init;
    if (n < key) {
      while (n < key) {
        var flag = 0
        var ftArr = ft[n];
        if (n === Math.max.apply(null, nodes) && key > n) {
          n = ftArr[0];
          tempArr.push(n);
          break;
        }
        if (ftArr[0] > key) {
          n = ftArr[0];
          tempArr.push(n);
          break;
        }
        for (var i = 0; i < ftArr.length - 1; i++) {
          if ((ftArr[i] < key && ftArr[i + 1] > key) || (ftArr[i] > ftArr[i + 1])) {
            n = ftArr[i]
            tempArr.push(n)
            flag = 1
            break;
          }
        }
        if (ftArr[ftArr.length - 1] < key && flag === 0) {
          n = ftArr[ftArr.length - 1]
          tempArr.push(n)
          continue;
        }
      }
    }
    else {
      while (n > key) {
        ftArr = ft[n];
        var flag1 = 0
        if (key < Math.min.apply(null, nodes) && ftArr.includes(Math.min.apply(null, nodes))) {
          tempArr.push(Math.min.apply(null, nodes))
          break;
        }
        for (i = 0; i < ftArr.length; i++) {
          if (ftArr[i] <= key) {
            n = ftArr[i]
            tempArr.push(n)
            flag1 = 1
            break;
          }
        }
        if (flag1 === 0) {
          n = Math.max.apply(null, ftArr)
          tempArr.push(n)
        }
      }
      while (n < key) {
        ftArr = ft[n];
        if (n === Math.max.apply(null, nodes) && key > n) {
          n = ftArr[0];
          tempArr.push(n);
          break;
        }
        if (ftArr[0] > key) {
          n = ftArr[0];
          tempArr.push(n);
          break;
        }
        for (i = 0; i < ftArr.length - 1; i++) {
          if ((ftArr[i] < key && ftArr[i + 1] > key) || (ftArr[i] > ftArr[i + 1])) {
            n = ftArr[i]
            tempArr.push(n)
            flag = 1
            break;
          }
        }
        if (ftArr[ftArr.length - 1] < key && flag === 0) {
          n = ftArr[ftArr.length - 1]
          tempArr.push(n)
          continue;
        }
      }
    }
    setResultArr(tempArr)
    // var x = graph['links']
    // for(i=0;i<tempArr.length-1;i++){
    //   x.push({target :tempArr[i], source:tempArr[i+1] })
    // }
    // setGraph(...graph,graph['links']=x)
  }

  const addNode = () => {
    var max = Math.pow(2, bits) - 1;
    var flag = 0;
    var arr = nodes;
    while (flag === 0) {
      var r = Math.floor(Math.random() * max) + 1;
      if (arr.indexOf(r) === -1) {
        arr.push(r);
        flag = 1;
      }
    }
    arr.sort(function (a, b) { return a - b })
    setNodes(arr)
    calculateFingerTable(arr)
  }

  const removeNode = () => {
    var arr = nodes;
    arr.splice(Math.floor(Math.random() * arr.length), 1);
    setNodes(arr);
    calculateFingerTable(arr);
  }

  return (
    <div className="App">
      <h2>Simulation of DHT System Using Chord Algorithm</h2>
      <div className='container1'>
        <div>
          <label>Enter no. of bits in address space(m):</label>
          <input className='containerInput' type='number' disabled={bool1} onChange={(e) => setBits(Number(e.target.value))} />
          <button onClick={() => setBool1(true)}>Submit</button>
        </div>
        {bool1 &&
          <div>
            You can have nodes with IDs from 0 to {Math.pow(2, bits) - 1}. Enter number of nodes:
            <input className='containerInput' type='number' onChange={(e) => setNumNodes(Number(e.target.value))}></input>
            <button onClick={() => calcNodes()}>Submit</button>
          </div>
        }

      </div>
      <div>
        {
          nodes.length > 0 && ft &&
          <>
            <div className='container2'>
              <label>Finger Tables for the nodes are: </label>
              {
                nodes.map((item, index) => (
                  <div key={index}>
                    {item}: [
                    {ft[item].map((key, index) => (
                      <span key={index}> {key} </span>
                    ))}
                    ]</div>
                ))
              }
            </div>
            <div className='container1'>
              <div>
                <label>Enter the node which is searching for the key:</label>
                <input className='containerInput' type='number' placeholder='Enter node' onChange={(e) => setInit(Number(e.target.value))}></input>
              </div>
              <div>
                <label>Enter the key you want to search for:</label>
                <input className='containerInput' type='number' placeholder='Enter Key' onChange={(e) => setKey(Number(e.target.value))}></input>
              </div>
              <div>
                <button onClick={() => startSearch()}>Start Search</button>
              </div>
            </div>
            <div className='container3'>
              <button onClick={() => addNode()}>Add Node</button>
              <button onClick={() => removeNode()}>Remove Node</button>

            </div>
            {resultArr.length > 0 && <>
              <div className='container1'>
                <div>Key: <b>{key}</b> found with node: <b>{resultArr[resultArr.length - 1]}</b></div>
                <div>Path Followed:</div>
                <div>{resultArr.map((item, index) => <span key={index}>{item} </span>)}</div>
              </div>
            </>}

          </>
        }
      </div>
      <div style={{height:"1000px"}}>
        {graph && <Graph
          id="graph-id" // id is mandatory
          data={graph}
          config={Myconfig}
          simulationOptions={simulationConfig}
        />}
      </div>
    </div>
  );
}

export default App;