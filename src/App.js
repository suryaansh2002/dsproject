import './App.css';
import { useState, useEffect } from 'react';
function App() {
  const [bits, setBits] = useState(0)
  const [numNodes, setNumNodes] = useState(0)
  const [bool1, setBool1] = useState(false)
  const [nodes, setNodes] = useState([])
  const [ft,setFT]=useState({})
  const [key, setKey]=useState()
  const [init, setInit]=useState()
  const [resultArr, setResultArr]=useState([])
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
    console.log(obj)
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
  }

  const startSearch = () => {
    var tempArr=[];
    tempArr.push(init)

    var n = init;
    if(n<key){
    while(n<key){
      var flag = 0
      var ftArr=ft[n];
      if(n===Math.max.apply(null, nodes) && key>n){
        n=ftArr[0];
        tempArr.push(n);
        break;
      }

      if(ftArr[0]>key){
        n=ftArr[0];
        tempArr.push(n);
        break;
      }

      for(var i=0; i<ftArr.length-1; i++){
        if((ftArr[i]<key && ftArr[i+1]>key) || (ftArr[i]>ftArr[i+1])){
          n=ftArr[i]
          tempArr.push(n)
          flag=1
          break;
        }
      }

      if(ftArr[ftArr.length-1]<key && flag===0){
        n=ftArr[ftArr.length-1]
        tempArr.push(n)
        continue;
      }


    }
  }
  else{
    while(n>key){
      var ftArr=ft[n];
      var flag1 = 0

      if(key<Math.min.apply(null, nodes) && ftArr.includes(Math.min.apply(null, nodes))){
        tempArr.push(Math.min.apply(null, nodes))
        break;
      }

      for(var i=0; i<ftArr.length; i++){
        if(ftArr[i]<=key){
          n=ftArr[i]
          tempArr.push(n)
          flag1=1
          break;
        }
      }

      if(flag1===0){
        n = Math.max.apply(null, ftArr)
        tempArr.push(n)
      }

    }
    while(n<key){
      var flag = 0
      var ftArr=ft[n];
      if(n===Math.max.apply(null, nodes) && key>n){
        n=ftArr[0];
        tempArr.push(n);
        break;
      }

      if(ftArr[0]>key){
        n=ftArr[0];
        tempArr.push(n);
        break;
      }

      for(var i=0; i<ftArr.length-1; i++){
        if((ftArr[i]<key && ftArr[i+1]>key) || (ftArr[i]>ftArr[i+1])){
          n=ftArr[i]
          tempArr.push(n)
          flag=1
          break;
        }
      }

      if(ftArr[ftArr.length-1]<key && flag===0){
        n=ftArr[ftArr.length-1]
        tempArr.push(n)
        continue;
      }
    }
  }
    console.log(tempArr)
    setResultArr(tempArr)
  }

  return (
    <div className="App">
      <div>Enter no. of bits in address space(m):
        <input type='number' disabled={bool1} onChange={(e) => setBits(Number(e.target.value))} />
        <button onClick={() => setBool1(true)}>Submit</button>
      </div>
      {bool1 &&
        <div>
          You can have nodes with IDs from 0 to {Math.pow(2, bits) - 1}. Enter number of nodes:
          <input type='number' onChange={(e) => setNumNodes(Number(e.target.value))}></input>
          <button onClick={() => calcNodes()}>Submit</button>
        </div>
      }
      <div>
        {
          nodes.length > 0 && ft && <>
            <div>Nodes in ring are:</div>
            <ul>
              {
                nodes.map((item) => (
                  <li>{item}</li>
                ))
              }
            </ul>
            <div>
              <div>Finger Tables for the nodes are: </div>
              <ul>
              {
                nodes.map((item) => (
                  <li>{item}: [
                    {ft[item].map((key)=>(
                      <> {key} </>
                    ))}
                  ]</li>
                ))
              }
                </ul>
            </div>
            <div>
              <label>Enter the node which is searching for the key:</label>
              <input type='number' placeholder='Enter node' onChange={(e)=>setInit(Number(e.target.value))}></input>
            </div>
            <div>
              <label>Enter the key you want to search for:</label>
              <input type='number' placeholder='Enter Key' onChange={(e)=>setKey(Number(e.target.value))}></input>
            </div>
            <div>
              <button onClick={()=>startSearch()}>Start Search</button>
            </div>
          </>
        }
      </div>
      <div>
        {resultArr.length>0 && <>
          <div>Key: <b>{key}</b> found with node: <b>{resultArr[resultArr.length-1]}</b></div>
          <div>Path Followed:</div>
          <div>{resultArr.map((item)=><>{item} </>)}</div>
        </>}
      </div>
    </div>
  );
}

export default App;