<script>
export default {
    props: {
        iNodes: {
            default: () => null,
            type: Map
        },
        destination: {
            default: () => null,
            type: Object
        },
        start: {
            default: () => null,
            type: Object
        },
        cell: {
            default: 0,
            type: Number
        },
        row: {
            default: 0,
            type: Number
        },
        shortestPath: {
            default: () => null,
            type: Map
        },
        nodeClicked: {
            default: () => null,
            type: Object
        },
        nodeMousedowned: {
            default: () => null,
            type: Object
        },
        hasFinished: {
            default: () => false,
            type: Boolean
        },
        inProgress: {
            default: () => false,
            type: Boolean
        }
    },
    data() {
        return {
            timeout: null,
        }
    },
    methods: {
        setAdditionalClass(cell) {
            if (cell === this.destination.cell && this.row === this.destination.row) {
                return 'grid--destination';
            }
            
            let node = this.iNodes.get(`${this.row}#${cell}`)
            if (node.hasVisited) {
                return 'grid--visited'
            }

            if (node.isObstacle) {
                return 'grid--obstacle'
            }
        },
        clickGrid(row, cell) {
            if (this.hasFinished || this.inProgress) return;
            let document = window.document.getElementById(`${row}#${cell}`)
            let pacman = window.document.getElementById('pacman')
            if (this.nodeClicked && this.nodeClicked.key != `${row}#${cell}` && this.nodeClicked.type == 'start') {
                let clickedGrid = window.document.getElementById(this.nodeClicked.key)
                clickedGrid.classList.remove('grid--clicked')
                this.emitter.emit("updateStart", { row, cell });
                this.emitter.emit("updateNodeClicked", null);
            }
            else if (this.nodeClicked && this.nodeClicked.key != `${row}#${cell}` && this.nodeClicked.type == 'destination') {
                let clickedGrid = window.document.getElementById(this.nodeClicked.key)
                clickedGrid.classList.remove('grid--clicked')
                this.emitter.emit("updateDestination", { row, cell });
                this.emitter.emit("updateNodeClicked", null);
            }
            else if (document && document.contains(pacman)) {
                document.classList.add('grid--clicked')
                this.emitter.emit("updateNodeClicked", {
                   key: `${row}#${cell}`,
                   type: 'start'
                });
            }
            else if (document && document.classList && document.classList.contains('grid--destination')) {
                document.classList.add('grid--clicked')
                this.emitter.emit("updateNodeClicked", {
                   key: `${row}#${cell}`,
                   type: 'destination'
                });
            }
        },
        mousedownGrid(row, cell) {
            if (this.hasFinished || this.inProgress) return;
            this.emitter.emit('updateNodeMousedowned', { row, cell })
        },
        mouseupGrid(row, cell) {
            if (this.hasFinished || this.inProgress) return;
            this.emitter.emit('updateNodeMousedowned', null)
        },
        mouseoverGrid(row, cell) {
            if (this.hasFinished || this.inProgress) return;
            if (this.nodeMousedowned) {
                this.emitter.emit('updateNodeObstacle', { row, cell })
            }
        }
    },
    // watch: {
    //     start: {
    //         handler(newNode) {
    //             let node = window.document.getElementById(`${newNode.row}#${newNode.cell}`)
    //             let pacman = window.document.getElementById('pacman')
    //             console.log(node, pacman, 'slsls') 
    //             node.appendChild(pacman)
    //         },
    //         deep: true
    //     }
    // }
}
</script>
<template>
    <div 
        @click="clickGrid(row, c)"
        @mousedown="mousedownGrid(row, c)"
        @mouseup="mouseupGrid(row, c)"
        @mouseover="mouseoverGrid(row, c)"
        v-for="c in cell" :key="c" :id="`${row}#${c}`"
        class="grid"
        :class="setAdditionalClass(c)">
        <div v-if="c == start.cell && row == start.row" id="pacman" class="pacman">
            <div class="pacman__eye"></div>
            <div class="pacman__mouth"></div>
        </div>
        <div v-else class="grid--icon" ></div>
    </div>
</template>
<style scoped>
.grid {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    -moz-box-shadow: 0 0 1px #74b9ff;
    -webkit-box-shadow: 0 0 1px#74b9ff;
    box-shadow: 0 0 1px #74b9ff;
}
.grid--icon {
    width: 5px;
    height: 5px;
    background: white;
    border-radius: 100%;
}
.grid:hover {
    border: 2px solid #e17055;
}
.grid--clicked {
    border: 2px solid #e17055;
}
.grid--destination .grid--icon {
    background: #eb4d4b;
    width: 25px;
    height: 25px;
}
.grid--obstacle .grid--icon {
    background: #636e72;
    width: 25px;
    height: 25px;
    border-radius: 0;
    -webkit-transition: background-color 1000ms linear;
    -moz-transition: background-color 1000ms linear;
    -o-transition: background-color 1000ms linear;
    -ms-transition: background-color 1000ms linear;
    transition: background-color 1000ms linear;

    -webkit-transition: border-radius 500ms linear;
    -moz-transition: border-radius 500ms linear;
    -o-transition: border-radius 500ms linear;
    -ms-transition: border-radius 500ms linear;
    transition: border-radius 500ms linear;
}
.grid--visited.grid--path .grid--icon {
    background: #ffeaa7;
    width: 25px;
    height: 25px;
    border-radius: 0;

    animation-name: pathColorChanged;
    animation-duration: 0.7s;
    animation-iteration-count: 1;
}
.grid--visited .grid--icon {
    background: #7ed6df;
    width: 25px;
    height: 25px;
    border-radius: 0;

    animation-name: visitedColodChanges;
    animation-duration: 0.7s;
    animation-iteration-count: 1;
}

.pacman {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background: #f2d648;
  position: relative;
}

.pacman__eye {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    top: 5px;
    right: 4px;
    background: #333333;
}

.pacman__mouth {
  background: #000;
  position: absolute;
  width: 100%;
  height: 100%;
  clip-path: polygon(86% 83%, 54% 67%, 127% 33%);   

  animation-name: eat;
  animation-duration: 0.7s;
  animation-iteration-count: infinite;
}

@keyframes eat {
  0% {
    clip-path: polygon(86% 68%, 54% 67%, 127% 33%);
  }
  25% {
    clip-path: polygon(86% 70%, 54% 67%, 127% 33%);
  }
  50% {
    clip-path: polygon(86% 75%, 54% 67%, 127% 33%);
  }
  75% {
    clip-path: polygon(86% 80%, 54% 67%, 127% 33%);
  }
  100% {
    clip-path: polygon(86% 83%, 54% 67%, 127% 33%);
  }
}

@keyframes visitedColodChanges {
  25% {
    background: #ADE4EB;
    border-radius: 80%;
    width: 12px;
  }
  50% {
    background: #FFF5D6;
    border-radius: 70%;
    width: 15px;
  }
  75% {
    background: #FFD147;
    border-radius: 50%;
    width: 20px;
  }
  90% {
    background: #5BC9D7;
    border-radius: 30%;
    width: 20px;
  }
  100% {
    background: #7ed6df;
    border-radius: 0;
    width: 25px;
  }
}

@keyframes pathColorChanged {
  0% {
      background: white;
      width: 10px;
      height: 10px;
      border-radius: 100%;
  }
  25% {
    background: #FFFAEB;
    border-radius: 80%;
    width: 12px;
  }
  50% {
    background: #8CD9E3;
    border-radius: 70%;
    width: 15px;
  }
  75% {
    background: #FFF5D6;
    border-radius: 50%;
    width: 20px;
  }
  90% {
    background: #FFF5D6;
    border-radius: 30%;
    width: 20px;
  }
  100% {
    background: #FFF5D6;
    border-radius: 0;
    width: 25px;
  }
}
</style>