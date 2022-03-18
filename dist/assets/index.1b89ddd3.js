import{o as a,c as r,r as f,n as k,F as h,p as y,a as N,b as d,d as _,e as m,f as w,g as p,h as b,m as P}from"./vendor.38ec7893.js";const $=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}};$();var g=(t,e)=>{const i=t.__vccOpts||t;for(const[n,s]of e)i[n]=s;return i};const O={props:{iNodes:{default:()=>null,type:Map},destination:{default:()=>null,type:Object},start:{default:()=>null,type:Object},cell:{default:0,type:Number},row:{default:0,type:Number},shortestPath:{default:()=>null,type:Map},nodeClicked:{default:()=>null,type:Object},nodeMousedowned:{default:()=>null,type:Object},hasFinished:{default:()=>!1,type:Boolean},inProgress:{default:()=>!1,type:Boolean}},data(){return{timeout:null}},methods:{setAdditionalClass(t){if(t===this.destination.cell&&this.row===this.destination.row)return"grid--destination";let e=this.iNodes.get(`${this.row}#${t}`);if(e.hasVisited)return"grid--visited";if(e.isObstacle)return"grid--obstacle"},clickGrid(t,e){if(this.hasFinished||this.inProgress)return;let i=window.document.getElementById(`${t}#${e}`),n=window.document.getElementById("pacman");this.nodeClicked&&this.nodeClicked.key!=`${t}#${e}`&&this.nodeClicked.type=="start"?(window.document.getElementById(this.nodeClicked.key).classList.remove("grid--clicked"),this.emitter.emit("updateStart",{row:t,cell:e}),this.emitter.emit("updateNodeClicked",null)):this.nodeClicked&&this.nodeClicked.key!=`${t}#${e}`&&this.nodeClicked.type=="destination"?(window.document.getElementById(this.nodeClicked.key).classList.remove("grid--clicked"),this.emitter.emit("updateDestination",{row:t,cell:e}),this.emitter.emit("updateNodeClicked",null)):i&&i.contains(n)?(i.classList.add("grid--clicked"),this.emitter.emit("updateNodeClicked",{key:`${t}#${e}`,type:"start"})):i&&i.classList&&i.classList.contains("grid--destination")&&(i.classList.add("grid--clicked"),this.emitter.emit("updateNodeClicked",{key:`${t}#${e}`,type:"destination"}))},mousedownGrid(t,e){this.hasFinished||this.inProgress||this.emitter.emit("updateNodeMousedowned",{row:t,cell:e})},mouseupGrid(t,e){this.hasFinished||this.inProgress||this.emitter.emit("updateNodeMousedowned",null)},mouseoverGrid(t,e){this.hasFinished||this.inProgress||this.nodeMousedowned&&this.emitter.emit("updateNodeObstacle",{row:t,cell:e})}}},v=t=>(y("data-v-7269f6f3"),t=t(),N(),t),C=["onClick","onMousedown","onMouseup","onMouseover","id"],M={key:0,id:"pacman",class:"pacman"},S=v(()=>d("div",{class:"pacman__eye"},null,-1)),G=v(()=>d("div",{class:"pacman__mouth"},null,-1)),V=[S,G],F={key:1,class:"grid--icon"};function L(t,e,i,n,s,o){return a(!0),r(h,null,f(i.cell,l=>(a(),r("div",{onClick:u=>o.clickGrid(i.row,l),onMousedown:u=>o.mousedownGrid(i.row,l),onMouseup:u=>o.mouseupGrid(i.row,l),onMouseover:u=>o.mouseoverGrid(i.row,l),key:l,id:`${i.row}#${l}`,class:k(["grid",o.setAdditionalClass(l)])},[l==i.start.cell&&i.row==i.start.row?(a(),r("div",M,V)):(a(),r("div",F))],42,C))),128)}var x=g(O,[["render",L],["__scopeId","data-v-7269f6f3"]]);const I={data(){return{step:1,iNodes:{},visitedNodes:[],gridOption:{row:20,cell:50},start:{row:10,cell:2},destination:{row:2,cell:15},nodeClicked:null,nodeMousedowned:null,shortestPath:null,hasFinished:!1,inProgress:!1}},components:{Grid:x},beforeMount(){this.initNodes()},mounted(){this.emitter.on("updateNodeClicked",e=>{this.nodeClicked=e}),this.emitter.on("updateStart",e=>{this.start=e}),this.emitter.on("updateDestination",e=>{this.destination=e}),this.emitter.on("updateNodeMousedowned",e=>{this.nodeMousedowned=e}),this.emitter.on("updateNodeObstacle",e=>{console.log(e.row,e.cell,"row cell");let i=this.iNodes.get(`${e.row}#${e.cell}`);this.iNodes.set(`${e.row}#${e.cell}`,{val:i.val,prevNode:i.prevNode,hasVisited:!1,isObstacle:!0})});let t=localStorage.getItem("skip-welcome-modal");if(console.log("emng ada?",t),!t){let e=window.document.querySelector(".modal");e.style.display="block"}},methods:{skip(){localStorage.setItem("skip-welcome-modal","skip"),this.closeModal()},closeModal(){let t=window.document.querySelector(".modal");t.style.display="none"},initNodes(){this.iNodes=new Map;for(let t=1;t<=this.gridOption.row;t++)for(let e=1;e<=this.gridOption.cell;e++){let i={val:null,prevNode:"",hasVisited:!1};this.iNodes.set(`${t}#${e}`,i)}},async execute(){this.inProgress=!0;try{await this.djikstra(),this.hasFinished=!0,this.inProgress=!1,await this.findShortestPath()}catch{this.hasFinished=!0,this.inProgress=!1,alert("cannot find the route!")}},reset(){this.initNodes(),this.hasFinished=!1},async djikstra(){let t=this.start.row,e=this.start.cell;this.iNodes.set(`${t}#${e}`,{hasVisited:!0,val:0,prevNode:null});let i=this.iNodes.get(`${t}#${e}`),n=i.val;for(let s=0;s<this.gridOption.row*this.gridOption.cell;s++){if(await this.timeout(10),t==this.destination.row&&e==this.destination.cell)return console.log("found it!!"),0;this.setUnvisitedNeighbours(t,e,n),this.iNodes.set(`${t}#${e}`,{hasVisited:!0,val:i.val,prevNode:i.prevNode});let{key:o}=this.findSmallestUnvisitedNode();i=this.iNodes.get(o),n=i.val,t=o.split("#")[0],e=o.split("#")[1]}},async findShortestPath(){this.shortestPath=null,this.shortestPath=new Map;let t=this.iNodes.get(`${this.destination.row}#${this.destination.cell}`),e=t.prevNode;if(!e){alert("cannot find the route!");return}for(this.shortestPath.set(e,1);e;)await this.timeout(10),e!=`${this.start.row}#${this.start.cell}`&&window.document.getElementById(e).classList.add("grid--path"),t=this.iNodes.get(e),e=t.prevNode,this.shortestPath.set(e,1)},timeout(t){return new Promise(e=>setTimeout(e,t))},setUnvisitedNeighbours(t,e,i){let n=Number(e)+1,s=Number(e)-1,o=Number(t)-1,l=Number(t)+1;this.updateUnvisitedNodeWithSmallestValue(t,n,Number(i)+1,`${t}#${e}`),this.updateUnvisitedNodeWithSmallestValue(t,s,Number(i)+1,`${t}#${e}`),this.updateUnvisitedNodeWithSmallestValue(o,e,Number(i)+1,`${t}#${e}`),this.updateUnvisitedNodeWithSmallestValue(l,e,Number(i)+1,`${t}#${e}`)},updateUnvisitedNodeWithSmallestValue(t,e,i,n){let s=this.iNodes.get(`${t}#${e}`);s&&!s.hasVisited&&!s.isObstacle&&t<=this.gridOption.row&&t>=1&&e>=1&&e<=this.gridOption.cell&&(s.val==null||i<s.val)&&this.iNodes.set(`${t}#${e}`,{val:i,prevNode:n,hasVisited:s.hasVisited,isObstacle:!1})},findSmallestUnvisitedNode(){let t=9999999999,e="";return this.iNodes.forEach((i,n)=>{n.indexOf("undefined")!=-1||n.indexOf("NaN")!=-1||i.val!=null&&i.val<=t&&!i.hasVisited&&!i.isObstacle&&(t=i.val,e=n)}),{val:t,key:e}}}},A={class:"header"},B=d("h3",{class:"title"},"Help Pacman! - Djikstra Algorithm",-1),E={key:1,class:"button button--default",disabled:""},U={class:"playground"},W={class:"modal"},j={class:"modal-content"},D=d("h1",null,"Pacman need your help right now!",-1),q={key:0},H={key:1},Y=d("p",null,[p("We have "),d("b",null,"Djikstra Algorithm"),p(" to help Pacman find his food faster")],-1),K=d("p",null,"You just need to click start at the navbar then Pacman can search his own path",-1),T=d("p",null,"You can move pacman position by left click the Pacman one time then left click the node where you want him to be. With that way, you can move the Pacman`s food as well",-1),z=d("p",null,"You can add obstacle by hold left click on the node you want then move your cursor. Once you think it's enough then release the left click ",-1),X=[Y,K,T,z],J={class:"modal-footer"};function Q(t,e,i,n,s,o){const l=_("Grid");return a(),r(h,null,[d("header",A,[B,!s.inProgress&&!s.hasFinished?(a(),r("button",{key:0,class:"button button--default",onClick:e[0]||(e[0]=u=>o.execute())},"Start")):s.inProgress?(a(),r("button",E,"Executing...")):!s.inProgress&&s.hasFinished?(a(),r("button",{key:2,class:"button button--default",onClick:e[1]||(e[1]=u=>o.reset())},"Reset")):m("",!0)]),d("main",null,[d("div",U,[(a(!0),r(h,null,f(s.gridOption.row,u=>(a(),r("div",{class:"row",key:u},[w(l,{ref_for:!0,ref:"grid","i-nodes":s.iNodes,"has-finished":s.hasFinished,"in-progress":s.inProgress,"shortest-path":s.shortestPath,"node-clicked":s.nodeClicked,"node-mousedowned":s.nodeMousedowned,start:s.start,destination:s.destination,cell:s.gridOption.cell,row:u},null,8,["i-nodes","has-finished","in-progress","shortest-path","node-clicked","node-mousedowned","start","destination","cell","row"])]))),128))]),d("div",W,[d("div",j,[d("button",{class:"button button--default float",onClick:e[2]||(e[2]=u=>o.closeModal())},"X"),D,s.step==1?(a(),r("p",q,"He is so hungry and he need food ASAP")):s.step==2?(a(),r("div",H,X)):m("",!0)]),d("div",J,[d("button",{class:"button button--default",onClick:e[3]||(e[3]=u=>o.skip())},"Skip"),s.step==1?(a(),r("button",{key:0,class:"button button--primary float",onClick:e[4]||(e[4]=()=>s.step+=1)},"Next")):(a(),r("button",{key:1,class:"button button--primary float",onClick:e[5]||(e[5]=u=>o.skip())},"Help Pacman!"))])])])],64)}var Z=g(I,[["render",Q]]);const R=P(),c=b(Z);c.config.globalProperties.emitter=R;c.mount("#app");console.log(c.config,"app config");