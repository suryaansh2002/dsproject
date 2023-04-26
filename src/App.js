import "./App.css";
import { useEffect, useState } from "react";
function App() {
  const [bits, setBits] = useState(0);
  const [numNodes, setNumNodes] = useState(0);
  const [bool1, setBool1] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [ft, setFT] = useState({});
  const [key, setKey] = useState();
  const [init, setInit] = useState();
  const [resultArr, setResultArr] = useState([]);
  const [allNodes, setAllNodes] = useState([]);
  const [path, setPath] = useState("");

  const succ = (arr, element) => {
    var sol = arr[0];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] >= element) {
        sol = arr[i];
        break;
      }
    }
    return sol;
  };

  const calculateFingerTable = (arr) => {
    var obj = {};
    var max = Math.pow(2, bits) - 1;
    for (var i = 0; i < arr.length; i++) {
      var ele = arr[i];
      obj[ele] = [];
      for (var j = 0; j < bits; j++) {
        var target = (ele + Math.pow(2, j)) % max;
        obj[ele].push(succ(arr, target));
      }
    }
    setFT(obj);
  };
  const showCircle = () => {
    var angle = 360 / allNodes.length;
    var rotate = 0;
    for (var i = 1; i < allNodes.length + 1; i++) {
      var l = document.querySelector(`#circle :nth-child(${i})`);
      l.style.transform = `rotate(${rotate * 1}deg) translateX(${40 / 2
        }vw) rotate(${rotate * -1}deg)`;
      rotate = rotate + angle;
    }
    console.log(nodes);
  };

  // randomly select active nodes. create the circle and finger table
  const calcNodes = () => {
    var max = Math.pow(2, bits) - 1;
    var tempArr = [];
    for (var i = 0; i <= max; i++) {
      tempArr.push(i);
    }
    setAllNodes(tempArr);
    if (numNodes > Math.pow(2, bits)) {
      alert("Too many nodes");
      return;
    }
    var arr = [];
    while (arr.length < numNodes) {
      var r = Math.floor(Math.random() * max) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    arr.sort(function (a, b) {
      return a - b;
    });
    for (var i = 1; i < allNodes.length + 1; i++) {
      var l = document.querySelector(`#circle :nth-child(${i})`);
      if (arr.includes(i - 1)) {
        l.style.backgroundColor = "red";
      } else {
        l.style.backgroundColor = "white";
      }
    }
    setNodes(arr);
    showCircle();

    calculateFingerTable(arr);
  };

  const startSearch = () => {
    var max = Math.pow(2, bits) - 1;
    if (key > max) {
      alert("Key entered cannot exist");
      return;
    }
    if (!ft[init]) {
      alert("Please enter an active node");
      return;
    }
    var tempArr = [];
    tempArr.push(init);
    var n = init;
    // if we are searching a higher node from a lower node
    if (n < key) {
      // while we do not reach the desired node
      while (n < key) {
        var flag = 0;
        var ftArr = ft[n];
        // if we are at the largest active node and the key is greater than the largest active node, then the final destination will be the smallest active node
        if (n === Math.max.apply(null, nodes) && key > n) {
          n = ftArr[0];
          tempArr.push(n);
          break;
        }
        // for this breaking condition -> q = FTp[0] when p < k < FTp[0]
        if (ftArr[0] > key) {
          n = ftArr[0];
          tempArr.push(n);
          break;
        }
        for (var i = 0; i < ftArr.length - 1; i++) {
          // if we find the key to be between two ascending pair of values or we find a descending pair of values, go to the lower value
          if (
            (ftArr[i] < key && ftArr[i + 1] > key) ||
            ftArr[i] > ftArr[i + 1]
          ) {
            n = ftArr[i];
            tempArr.push(n);
            flag = 1;
            break;
          }
        }
        // if we did not find a node in the previous if condition (implies that the elements of the finger table are ascending) and the key is greater than every value in the finger table, go to the largest value in the finger table
        if (ftArr[ftArr.length - 1] < key && flag === 0) {
          n = ftArr[ftArr.length - 1];
          tempArr.push(n);
          continue;
        }
      }
    } 
    // if we are searching a lower node from a higher node
    else {
      while (n > key) {
        ftArr = ft[n];
        var flag1 = 0;
        // if the key is less than the minimum active node and the current node's finger table has that minimum node, then that minimum node is the final destination
        if (
          key < Math.min.apply(null, nodes) &&
          ftArr.includes(Math.min.apply(null, nodes))
        ) {
          tempArr.push(Math.min.apply(null, nodes));
          break;
        }
        for (i = 0; i < ftArr.length; i++) {
          // if we find a node such that the key is larger than it we go to that node
          if (ftArr[i] <= key) {
            n = ftArr[i];
            tempArr.push(n);
            flag1 = 1;
            break;
          }
        }
        // if the key is smaller than every node in the finger table, then go to the maximum node in the finger table
        if (flag1 === 0) {
          n = Math.max.apply(null, ftArr);
          tempArr.push(n);
        }
      }
      // now that we are again searching from lower to higher node use the previous while loop
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
          if (
            (ftArr[i] < key && ftArr[i + 1] > key) ||
            ftArr[i] > ftArr[i + 1]
          ) {
            n = ftArr[i];
            tempArr.push(n);
            flag = 1;
            break;
          }
        }
        if (ftArr[ftArr.length - 1] < key && flag === 0) {
          n = ftArr[ftArr.length - 1];
          tempArr.push(n);
          continue;
        }
      }
    }
    var s = "";
    tempArr.map((item) => {
      s += String(item) + " -> ";
    });
    s = s.slice(0, -3);
    setPath(s);
    setResultArr(tempArr);

  };

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
    arr.sort(function (a, b) {
      return a - b;
    });
    for (var i = 1; i < allNodes.length + 1; i++) {
      var l = document.querySelector(`#circle :nth-child(${i})`);
      if (arr.includes(i - 1)) {
        l.style.backgroundColor = "red";
      } else {
        l.style.backgroundColor = "white";
      }
    }
    setNodes(arr);
    calculateFingerTable(arr);
  };

  const removeNode = () => {
    var arr = nodes;
    arr.splice(Math.floor(Math.random() * arr.length), 1);
    for (var i = 1; i < allNodes.length + 1; i++) {
      var l = document.querySelector(`#circle :nth-child(${i})`);
      if (arr.includes(i - 1)) {
        l.style.backgroundColor = "red";
      } else {
        l.style.backgroundColor = "white";
      }
    }
    setNodes(arr);
    calculateFingerTable(arr);
  };

  return (
    <div className="App">
      <h2>Simulation of DHT System Using Chord Algorithm</h2>
      <div className="container1">
        <div>
          <label>Enter no. of bits in address space(m):</label>
          <input
            className="containerInput"
            type="number"
            disabled={bool1}
            onChange={(e) => setBits(Number(e.target.value))}
          />
          <button onClick={() => setBool1(true)}>Submit</button>
        </div>
        {bool1 && (
          <div>
            You can have nodes with IDs from 0 to {Math.pow(2, bits) - 1}. Enter
            number of nodes:
            <input
              className="containerInput"
              type="number"
              onChange={(e) => setNumNodes(Number(e.target.value))}
            ></input>
            <button onClick={() => calcNodes()}>Submit</button>
          </div>
        )}
      </div>
      <div>
        {nodes.length > 0 && ft && (
          <>
            <div className="container2">
              <label>Finger Tables for the nodes are: </label>
              {nodes.map((item, index) => (
                <div key={index}>
                  {item}: [
                  {ft[item].map((key, index) => (
                    <span key={index}> {key} </span>
                  ))}
                  ]
                </div>
              ))}
            </div>
            <div className="container1">
              <div>
                <label>Enter the node which is searching for the key:</label>
                <input
                  className="containerInput"
                  type="number"
                  placeholder="Enter node"
                  onChange={(e) => setInit(Number(e.target.value))}
                ></input>
              </div>
              <div>
                <label>Enter the key you want to search for:</label>
                <input
                  className="containerInput"
                  type="number"
                  placeholder="Enter Key"
                  onChange={(e) => setKey(Number(e.target.value))}
                ></input>
              </div>
              <div>
                <button onClick={() => startSearch()}>Start Search</button>
              </div>
            </div>
            <div className="container3">
              <button onClick={() => addNode()}>Add Node</button>
              <button onClick={() => removeNode()}>Remove Node</button>
            </div>
            {resultArr.length > 0 && (
              <>
                <div className="container1">
                  <div>
                    Key: <b>{key}</b> found with node:{" "}
                    <b>{resultArr[resultArr.length - 1]}</b>
                  </div>
                  <div>Path Followed: {path}</div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <ul id="circle">
        {allNodes.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;