<script>
import Grid from './components/Grid.vue'

export default {
  data() {
    return {
      step: 1,
      iNodes: {},
      visitedNodes: [],
      gridOption: {
        row: 20,
        cell: 50
      },
      start: {
        row: 10,
        cell: 2,
      },
      destination: {
        row: 2,
        cell: 15,
      },
      nodeClicked: null,
      nodeMousedowned: null,
      shortestPath: null,
      hasFinished: false,
      inProgress: false
    }
  },
  components: {
    Grid
  },
  beforeMount() {
    this.initNodes()
  },
  mounted() {
    this.emitter.on("updateNodeClicked", node => {
      this.nodeClicked = node
    })
    this.emitter.on("updateStart", node => {
       this.start = node
     })
    this.emitter.on("updateDestination", node => {
       this.destination = node
     })
    this.emitter.on("updateNodeMousedowned", node => {
       this.nodeMousedowned = node
     })
     
    this.emitter.on("updateNodeObstacle", node => {
      console.log(node.row, node.cell, 'row cell')
      let selectedNode = this.iNodes.get(`${node.row}#${node.cell}`)
      this.iNodes.set(`${node.row}#${node.cell}`, {
        val: selectedNode.val,
        prevNode: selectedNode.prevNode,
        hasVisited: false,
        isObstacle: true
      })
     })
    
    
    let skipWelcomeModal = localStorage.getItem('skip-welcome-modal')
    console.log('emng ada?', skipWelcomeModal)
    if (!skipWelcomeModal) {
      let modal = window.document.querySelector(".modal")
      modal.style.display = "block"
    } 
  },
  methods: {
    skip() {
      localStorage.setItem('skip-welcome-modal', 'skip')
      this.closeModal()
    },
    closeModal() {
      let modal = window.document.querySelector(".modal")
      modal.style.display = "none"
    },
    initNodes() {
      this.iNodes = new Map()
      for (let j = 1; j <= this.gridOption.row; j++) {
        for (let i = 1; i <= this.gridOption.cell; i++) {
          let node = {
            val: null,
            prevNode: '',
            hasVisited: false,
          }
          this.iNodes.set(`${j}#${i}`, node)
        }
      }
    },
    async execute() {
      this.inProgress = true
      try {
        await this.djikstra()
        this.hasFinished = true
        this.inProgress = false
        await this.findShortestPath()
      } catch(err) {
        this.hasFinished = true
        this.inProgress = false
        alert('cannot find the route!')
      }
    },
    reset() {
      // location.reload()
      this.initNodes()
      this.hasFinished = false
    },
    async djikstra() {
      let currentRow = this.start.row
      let currentCell = this.start.cell

      this.iNodes.set(`${currentRow}#${currentCell}`, { hasVisited: true, val: 0, prevNode: null })
      let currentNode = this.iNodes.get(`${currentRow}#${currentCell}`)
      let currentVal = currentNode.val
      for (let i = 0; i < this.gridOption.row * this.gridOption.cell; i++) {
        await this.timeout(10)
        if (currentRow == this.destination.row && currentCell == this.destination.cell) {
          console.log('found it!!')
          return 0
        }
        // set value to unvisited neighbours
        this.setUnvisitedNeighbours(currentRow, currentCell, currentVal)
        // set current node has visited to true
        this.iNodes.set(`${currentRow}#${currentCell}`, { hasVisited: true, val: currentNode.val, prevNode: currentNode.prevNode })
        // find smallest value from unvisited node
        // ... and set it as current node
        let { key } = this.findSmallestUnvisitedNode()   
        currentNode = this.iNodes.get(key)
        currentVal = currentNode.val
        currentRow = key.split('#')[0]
        currentCell = key.split('#')[1]
      }
    },
    async findShortestPath() {
      this.shortestPath = null
      this.shortestPath = new Map()
      let destNode = this.iNodes.get(`${this.destination.row}#${this.destination.cell}`)
      let prevNode = destNode.prevNode
      if (!prevNode) {
        alert('cannot find the route!')
        return
      }
      this.shortestPath.set(prevNode, 1)
      let i = 1
      while (prevNode) {
        await this.timeout(10)
        if (prevNode != `${this.start.row}#${this.start.cell}`) {
          let component = window.document.getElementById(prevNode)
          // component.classList.remove('grid--visited')
          component.classList.add('grid--path')
        }
        
        destNode = this.iNodes.get(prevNode)
        prevNode = destNode.prevNode
        this.shortestPath.set(prevNode, 1)
        i++
      }
      // console.log(, 'window')
      // console.log(this.$refs.grid, '===shortest path===')
    },
    timeout(ms) {
      return new Promise(res => setTimeout(res,ms));
    },
    setUnvisitedNeighbours(currentRow, currentCell, currentVal) {
      let right = Number(currentCell) + 1
      let left = Number(currentCell) - 1
      let top = Number(currentRow) - 1
      let bottom = Number(currentRow) + 1
      this.updateUnvisitedNodeWithSmallestValue(currentRow, right, Number(currentVal)+1, `${currentRow}#${currentCell}`)
      this.updateUnvisitedNodeWithSmallestValue(currentRow, left, Number(currentVal)+1, `${currentRow}#${currentCell}`)
      this.updateUnvisitedNodeWithSmallestValue(top, currentCell, Number(currentVal)+1, `${currentRow}#${currentCell}`)
      this.updateUnvisitedNodeWithSmallestValue(bottom, currentCell, Number(currentVal)+1, `${currentRow}#${currentCell}`)
    },
    updateUnvisitedNodeWithSmallestValue(row, cell, newVal, prevNode) {
      let node = this.iNodes.get(`${row}#${cell}`)
      if (node && !node.hasVisited && !node.isObstacle && row <= this.gridOption.row && row >= 1 && cell >= 1 && cell <= this.gridOption.cell) {
        if (node.val == null || newVal < node.val) {
          this.iNodes.set(`${row}#${cell}`, { val: newVal, prevNode, hasVisited: node.hasVisited, isObstacle: false })
        }
      }
    },
    findSmallestUnvisitedNode() {
      let smallestVal = 9999999999
      let smallestKey = ''
      this.iNodes.forEach((obj, key) => {
        if (key.indexOf('undefined') != -1 || key.indexOf('NaN') != -1) return;
        // console.log(obj.val, key, obj.hasVisited, obj.prevNode)
        if (obj.val != null && obj.val <= smallestVal && !obj.hasVisited && !obj.isObstacle) {
          smallestVal = obj.val
          smallestKey = key
        } 
      });
      return { val: smallestVal, key: smallestKey }
    }
  },
}
</script>

<template>
  <header class="header">
    <h3 class="title">Help Pacman! - Djikstra Algorithm</h3>
    <button class="button button--default" @click="execute()" v-if="!inProgress && !hasFinished">Start</button>
    <button class="button button--default"  v-else-if="inProgress" disabled>Executing...</button>
    <button class="button button--default"  v-else-if="!inProgress && hasFinished" @click="reset()">Reset</button>
    <!-- <button @click="stop()">Stop</button> -->
  </header>

  <main>
    <div class="playground">
      <div class="row" v-for="number in gridOption.row" :key="number">
        <Grid
          ref="grid"
          :i-nodes="iNodes"
          :has-finished="hasFinished"
          :in-progress="inProgress"
          :shortest-path="shortestPath"
          :node-clicked="nodeClicked"
          :node-mousedowned="nodeMousedowned"
          :start="start"
          :destination="destination"
          :cell="gridOption.cell" 
          :row="number" />
      </div>
    </div>
    <div class="modal">
      <div class="modal-content">
        <button class="button button--default float" @click="closeModal()">X</button>
        <h1>Pacman need your help right now!</h1>
        <p v-if="step == 1">He is so hungry and he need food ASAP</p>
        <div v-else-if="step == 2">
          <p>We have <b>Djikstra Algorithm</b> to help Pacman find his food faster</p>
          <p>You just need to click start at the navbar then Pacman can search his own path</p>
          <p>You can move pacman position by left click the Pacman one time then left click the node where you want him to be. With that way, you can move the Pacman`s food as well</p>
          <p>You can add obstacle by hold left click on the node you want then move your cursor. Once you think it's enough then release the left click </p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="button button--default" @click="skip()">Skip</button>
        <button v-if="step == 1" class="button button--primary float" @click="() => step+=1">Next</button>
        <button v-else class="button button--primary float" @click="skip()">Help Pacman!</button>
      </div>
    </div>
  </main>
</template>

<style>
@import './assets/base.css';

#app {
  margin: 0;
  padding: 0;
  font-weight: normal;
  position: relative;
}

h1 {
  margin-bottom: 25px;
}

p {
  margin-bottom: 15px;
}

.title {
  margin-right: 12px;
}

.playground {
  width: 1250px;
  margin-top: 25px;
  position: absolute;
  left: 10%;

  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
}

.header {
  margin-bottom: 45px;
  padding: 0.8rem;
  background: #0984e3;
  color: #fff;  
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  display: flex;
}

.row {
  display: flex;
}

.button {
  font-family: 'Roboto', sans-serif;
  font-size: 9px;
  padding: 12px 15px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  z-index: 10000;
}
.button--default {
  color: #000;
  background-color: #fff;
}
.button--primary {
  color: #fff;
  background-color: #0984e3;
}
.button--default:disabled, .button--default:disabled:hover {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
  cursor: no-drop;
  box-shadow: none; 
}
.button--default:hover {
  background-color: #dfe6e9;
  color: #000;
  transform: translateY(-7px);
}
.button--primary:hover {
  background-color: #3BA6F7;
  box-shadow: 0px 15px 20px #9DD2FB;
  color: #fff;
  transform: translateY(-7px);
}

.modal {
  display: none;
  position: fixed; 
  padding-top: 50px;
  left: 0; 
  top: 0;
  width: 100%;
  height: 100%; 
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content, .modal-footer {
  position: relative; 
  background-color: white;
  padding: 20px; 
  margin: auto; 
  width: 40%;  
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s
}
.float {
  float: right;
}
@-webkit-keyframes animatetop {
  from {top:-300px; opacity:0} 
  to {top:0; opacity:1}
}
@keyframes animatetop {
  from {top:-300px; opacity:0}
  to {top:0; opacity:1}
}
</style>
