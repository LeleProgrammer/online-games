/*
 * Copyright (C) 2026 Lele
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

let SIZE=6;
let board=[];
let locked=[];
let solution=[];
let markRight=[];
let markDown=[];
let markCnt=0;
let toRemove=0;
let selectX=-1;
let selectY=-1;
let done=false;
let startTime=performance.now();
let timerEvent=null;

function randint(l,r) {
    return Math.floor(Math.random()*(r-l+1))+l;
}

function newGame() {
    startTime=performance.now();
    done=false;
    board=[];
    markRight=[];
    markDown=[];
    locked=[];
    selectX=-1;
    selectY=-1;
    for (let i=0;i<SIZE;++i) {
        board.push([]);
        markRight.push([]);
        markDown.push([]);
        locked.push([]);
        for (let j=0;j<SIZE;++j) {
            board[i].push((i+j)&1);
            markRight[i].push(-1);
            markDown[i].push(-1);
            locked[i].push(1);
        }
    }
    for (let i=1;i<SIZE;++i) {
        let ok=false;
        if (i<=2) ok=true;
        else if (board[i][0]===board[i-2][0] && board[i][0]==board[i-3][0]) ok=false;
        else ok=true;
        if (ok===false) continue;
        if (randint(0,1)===1) for (let j=0;j<SIZE;++j) [board[i][j],board[i-1][j]]=[board[i-1][j],board[i][j]];
    }
    for (let i=1;i<SIZE;++i) {
        let ok=false;
        if (i<=2) ok=true;
        else if (board[0][i]===board[0][i-2] && board[0][i]===board[0][i-3]) ok=false;
        else ok=true;
        if (ok===false) continue;
        if (randint(0,1)===1) for (let j=0;j<SIZE;++j) [board[j][i],board[j][i-1]]=[board[j][i-1],board[j][i]];
    }
    solution=[];
    for (let i=0;i<SIZE;++i) {
        solution.push([]);
        for (let j=0;j<SIZE;++j) solution[i].push(board[i][j]);
    }
    let available=[]
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) {
        if (i!==SIZE-1) available.push([i,j,"down"]);
        if (j!==SIZE-1) available.push([i,j,"right"]);
    }
    for (let g=1;g<=markCnt;++g) {
        let pos=randint(0,available.length-1);
        let i=available[pos][0];
        let j=available[pos][1];
        let d=available[pos][2];
        if (d==="down") { // Down
            if (solution[i][j]===solution[i+1][j]) markDown[i][j]=0;
            else markDown[i][j]=1;
        } else if (d==="right") { // Right
            if (solution[i][j]===solution[i][j+1]) markRight[i][j]=0;
            else markRight[i][j]=1;
        }
        available.splice(pos,1);
    }
    available=[]
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) available.push([i,j]);
    for (let g=1;g<=toRemove;++g) {
        let pos=randint(0,available.length-1);
        let i=available[pos][0];
        let j=available[pos][1];
        locked[i][j]=0;
        board[i][j]=-1;
        available.splice(pos,1);
    }
    renderGrid();
    if (timerEvent) clearInterval(timerEvent);
    let timer=document.getElementById("timer");
    timerEvent=setInterval(()=>{
        const elapsed=(performance.now()-startTime)/1000;
        timer.textContent=elapsed.toFixed(2);
    },30);
}

function renderGrid() {
    const container=document.getElementById("binairoGrid");
    container.innerHTML="";
    container.style.gridTemplateColumns="1fr";
    for (let i=0;i<SIZE;++i) {
        const rowDiv=document.createElement("div");
        rowDiv.className="grid-row";
        for (let j=0;j<SIZE;++j) {
            const cell=createCell(i,j);
            rowDiv.appendChild(cell);
            if (j<SIZE-1) {
                const conn=createHorizontalConnector(i,j);
                rowDiv.appendChild(conn);
            }
        }
        container.appendChild(rowDiv);
        if (i<SIZE-1) {
            const rowDiv=document.createElement("div");
            rowDiv.className="vertical-connectors";
            for (let j=0;j<SIZE;++j) {
                const conn=createVerticalConnector(i,j);
                rowDiv.appendChild(conn);
                if (j<SIZE-1) {
                    const space=document.createElement("div");
                    space.className="spacer";
                    rowDiv.appendChild(space);
                }
            }
            container.appendChild(rowDiv)
        }
    }
    // auto scale board
    setTimeout(()=>{
        const wrapper=document.querySelector(".binairo-wrapper");
        const grid=document.getElementById("binairoGrid");
        const containerWidth=wrapper.clientWidth;
        const baseCellSize=52;
        const connWidth=baseCellSize*0.55;
        const boardWidth=SIZE*baseCellSize+(SIZE-1)*connWidth+20;
        if (boardWidth>containerWidth) {
            const scale=containerWidth/boardWidth*0.95;
            const newCellSize=52*scale;
            grid.style.setProperty("--cell-size",`${newCellSize}px`);
        } else {
            grid.style.setProperty("--cell-size","52px");
        }
    },10);
}

function selectCell(i,j) {
    if (selectX===i && selectY===j) {
        selectX=-1;
        selectY=-1;
    } else if (locked[i][j]===0) {
        selectX=i;
        selectY=j;
    } else {
        selectX=-1;
        selectY=-1;
    }
    renderGrid();
}

function createCell(i,j) {
    const cell=document.createElement("div");
    cell.className="cell";
    const value=board[i][j];
    if (value===1) {
        cell.textContent="⚫";
        cell.classList.add("black");
    } else if (value===0) {
        cell.textContent="⚪";
        cell.classList.add("white");
    } else {
        cell.textContent="";
        cell.classList.add("empty");
    }
    if (locked[i][j]===1) cell.classList.add("locked");
    if (selectX===i && selectY===j) {
        cell.classList.add("selected");
    }
    cell.addEventListener("click",(e)=>{
        e.stopPropagation();
        selectCell(i,j);
    });
    return cell;
}

function createHorizontalConnector(i,j) {
    const conn=document.createElement("div");
    conn.className="horizontal-connector";
    const mark=markRight[i][j];
    if (mark===0) {
        conn.textContent="=";
        conn.classList.add("equal");
    } else if (mark===1) {
        conn.textContent='X';
        conn.classList.add("cross");
    } else {
        conn.textContent="";
        conn.classList.add("empty");
    }
    return conn;
}

function createVerticalConnector(i,j) {
    const conn=document.createElement("div");
    conn.className="vertical-connector";
    const mark=markDown[i][j];
    if (mark===0) {
        conn.textContent="=";
        conn.classList.add("equal");
    } else if (mark===1) {
        conn.textContent='X';
        conn.classList.add("cross");
    } else {
        conn.textContent="";
        conn.classList.add("empty");
    }
    return conn;
}

function showMessage(msg) {
    const div=document.getElementById("message");
    div.textContent=msg;
}

function clearMessage() {
    const div=document.getElementById("message");
    div.textContent="";
}

function setValue(value) {
    if (done) return;
    if (selectX===-1 || selectY===-1) {
        showMessage("请先选择一个格子");
        return;
    }
    if (locked[selectX][selectY]===1) {
        showMessage("你无法修改这个格子");
        return;
    }
    if (board[selectX][selectY]===value) {
        board[selectX][selectY]=-1;
        showMessage("已删除");
    } else {
        board[selectX][selectY]=value;
        showMessage(`已填入 ${value===0?'⚪ 白子':'⚫ 黑子'}`);
    }
    renderGrid();
    if (checkVictory()) {
        showMessage("🎉 You Win! 🎉");
        done=true;
        if (timerEvent) clearInterval(timerEvent);
        timerEvent=null;
    }
}

function clearValue() {
    if (done) return;
    if (selectX===-1 || selectY===-1) {
        showMessage("请先选择一个格子");
        return;
    }
    if (locked[selectX][selectY]===1) {
        showMessage("你无法修改这个格子");
        return;
    }
    if (board[selectX][selectY]===-1) return;
    board[selectX][selectY]=-1;
    showMessage("已删除");
    renderGrid();
}

function checkVictory() {
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) if (board[i][j]===-1) return false;
    for (let i=0;i<SIZE;++i) {
        let count=0;
        for (let j=0;j<SIZE;++j) if (board[i][j]===0) count++;
        if (count*2!==SIZE) return false;
    }
    for (let j=0;j<SIZE;++j) {
        let count=0;
        for (let i=0;i<SIZE;++i) if (board[i][j]===0) count++;
        if (count*2!==SIZE) return false;
    }
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE-2;++j) if (board[i][j]===board[i][j+1] && board[i][j]===board[i][j+2]) return false;
    for (let j=0;j<SIZE;++j) for (let i=0;i<SIZE-2;++i) if (board[i][j]===board[i+1][j] && board[i][j]===board[i+2][j]) return false;
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) {
        if (i<SIZE-1) { // down
            if (markDown[i][j]===0 && board[i][j]!==board[i+1][j]) return false;
            if (markDown[i][j]===1 && board[i][j]===board[i+1][j]) return false;
        }
        if (j<SIZE-1) { // right
            if (markRight[i][j]===0 && board[i][j]!==board[i][j+1]) return false;
            if (markRight[i][j]===1 && board[i][j]===board[i][j+1]) return false;
        }
    }
    return true;
}

function bindActions() {
    const blackBtn=document.querySelector("[data-action='black']");
    const whiteBtn=document.querySelector("[data-action='white']");
    const clearBtn=document.querySelector("[data-action='clear']");
    const newBtn=document.getElementById("newGameBtn");
    blackBtn.addEventListener("click",()=>setValue(1));
    whiteBtn.addEventListener("click",()=>setValue(0));
    clearBtn.addEventListener("click",clearValue);
    newBtn.addEventListener("click",newGame);
    document.addEventListener("keydown",function(event) {
        const key=event.key;
        if (key==="0" || key==="NumPad0") {
            setValue(0);
            event.preventDefault();
        } else if (key==="1" || key==="NumPad1") {
            setValue(1);
            event.preventDefault();
        } else if (key==="Backspace" || key==="Delete") {
            clearValue();
            event.preventDefault();
        }
    });
    window.addEventListener("resize",()=>{
        renderGrid;
    });
}

const label=document.getElementById("difficulty");
const params=new URLSearchParams(window.location.search);
const diff=params.get("diff");
let size=params.get("size");

if (size!=="6" && size!=="10" && size!=="14" && size!=="20") {
    size="6";
}

SIZE=parseInt(size);

if (size==="6") {
    if (diff==="easy") {
        label.textContent="简单";
        toRemove=randint(13,15);
        markCnt=4;
    } else if (diff==="medium") {
        label.textContent="中等";
        toRemove=randint(21,23);
        markCnt=7;
    } else if (diff==="hard") {
        label.textContent="困难";
        toRemove=randint(31,33);
        markCnt=10;
    } else {
        label.textContent="简单";
        toRemove=randint(13,15);
        markCnt=4;
    }
} else if (size==="10") {
    if (diff==="easy") {
        label.textContent="简单";
        toRemove=randint(36,42);
        markCnt=11;
    } else if (diff==="medium") {
        label.textContent="中等";
        toRemove=randint(59,65);
        markCnt=20;
    } else if (diff==="hard") {
        label.textContent="困难";
        toRemove=randint(86,92);
        markCnt=28;
    } else {
        label.textContent="简单";
        toRemove=randint(36,42);
        markCnt=11;
    }
} else if (size==="14") {
    if (diff==="easy") {
        label.textContent="简单";
        toRemove=randint(70,80);
        markCnt=21;
    } else if (diff==="medium") {
        label.textContent="中等";
        toRemove=randint(116,126);
        markCnt=39;
    } else if (diff==="hard") {
        label.textContent="困难";
        toRemove=randint(170,180);
        markCnt=55;
    } else {
        label.textContent="简单";
        toRemove=randint(70,80);
        markCnt=21;
    }
} else {
    if (diff==="easy") {
        label.textContent="简单";
        toRemove=randint(140,160);
        markCnt=42;
    } else if (diff==="medium") {
        label.textContent="中等";
        toRemove=randint(232,252);
        markCnt=78;
    } else if (diff==="hard") {
        label.textContent="困难";
        toRemove=randint(340,360);
        markCnt=110;
    } else {
        label.textContent="简单";
        toRemove=randint(140,160);
        markCnt=42;
    }
}

newGame();
bindActions();