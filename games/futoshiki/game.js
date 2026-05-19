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

let SIZE=4;
let board=[];
let solution=[];
let locked=[];
let markRight=[];
let markDown=[];
let randCount=100;
let toMark=0;
let toRemove=0;
let selectX=-1;
let selectY=-1;
let done=0;
let startTime=performance.now();
let timerEvent=null;

// =================== LOAD DIFFICULTIE AND SIZE ===================

const label=document.getElementById("difficulty");
const params=new URLSearchParams(window.location.search);
let diff=params.get("diff");
let size=params.get("size");

if (size!=="4" && size!=="6" && size!=="8" && size!=="9") {
    size="4";
}
if (diff!=="medium" && diff!=="hard") {
    diff="medium";
}

SIZE=parseInt(size);

if (size==="4") {
    label.textContent="4x4";
    toRemove=randint(12,15);
    toMark=randint(3,5);
} else if (size==="6") {
    if (diff==="medium") {
        label.textContent="6x6 正常";
        toRemove=randint(26,30);
        toMark=randint(16,18);
    } else {
        label.textContent="6x6 困难";
        toRemove=randint(33,36);
        toMark=randint(14,17);
    }
} else if (size==="8") {
    if (diff==="medium") {
        label.textContent="8x8 正常";
        toRemove=randint(46,53);
        toMark=randint(28,32);
    } else {
        label.textContent="8x8 困难";
        toRemove=randint(59,64);
        toMark=randint(25,30);
    }
} else {
    if (diff==="medium") {
        label.textContent="9x9 正常";
        toRemove=randint(59,68);
        toMark=randint(36,41);
    } else {
        label.textContent="9x9 困难";
        toRemove=randint(74,81);
        toMark=randint(32,38);
    }
}

// =================================================================

function randint(l,r) {
    return Math.floor(Math.random()*(r-l+1))+l;
}

function newGame() {
    done=0;
    selectX=-1;
    selectY=-1;
    board=[];
    solution=[];
    locked=[];
    markRight=[];
    markDown=[];
    for (let i=0;i<SIZE;++i) {
        board.push([]);
        locked.push([]);
        markRight.push([]);
        markDown.push([]);
        for (let j=0;j<SIZE;++j) {
            board[i].push((j+i)%SIZE+1);
            locked[i].push(1);
            markRight[i].push(0);
            markDown[i].push(0);
        }
    }
    for (let g=1;g<=randCount;++g) {
        let a=randint(0,SIZE-1);
        let b=randint(0,SIZE-1);
        if (randint(0,1)===0) for (let i=0;i<SIZE;++i) [board[i][a],board[i][b]]=[board[i][b],board[i][a]];
        else for (let i=0;i<SIZE;++i) [board[a][i],board[b][i]]=[board[b][i],board[a][i]];
    }
    for (let i=0;i<SIZE;++i) {
        solution.push([]);
        for (let j=0;j<SIZE;++j) {
            solution[i].push(board[i][j]);
        }
    }
    let available=[];
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) available.push([i,j]);
    for (let g=0;g<toRemove;++g) {
        const pos=randint(0,available.length-1);
        const i=available[pos][0];
        const j=available[pos][1];
        available.splice(pos,1);
        locked[i][j]=0;
        board[i][j]=0;
    }
    available=[];
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) {
        if (i<SIZE-1) available.push([i,j,"down"]);
        if (j<SIZE-1) available.push([i,j,"right"]);
    }
    for (let g=0;g<toMark;++g) {
        const pos=randint(0,available.length-1);
        const i=available[pos][0];
        const j=available[pos][1];
        const d=available[pos][2];
        if (d==="down") markDown[i][j]=1;
        else markRight[i][j]=1;
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
    const container=document.getElementById("futoshikiGrid");
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
            container.appendChild(rowDiv);
        }
    }
    // auto scale board
    setTimeout(()=>{
        const wrapper=document.querySelector(".futoshiki-wrapper");
        const grid=document.getElementById("futoshikiGrid");
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

function createCell(i,j) {
    const cell=document.createElement("div");
    cell.className="cell";
    const value=board[i][j];
    if (value===0) {
        cell.textContent="";
        cell.classList.add("empty");
    } else {
        cell.textContent=value;
        cell.classList.add("white");
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
        conn.textContent="";
        conn.classList.add("empty");
    } else {
        if (solution[i][j]>solution[i][j+1]) conn.textContent='>';
        else conn.textContent="<";
        conn.classList.add("detail");
    }
    return conn;
}

function createVerticalConnector(i,j) {
    const conn=document.createElement("div");
    conn.className="vertical-connector";
    const mark=markRight[i][j];
    if (mark===0) {
        conn.textContent="";
        conn.classList.add("empty");
    } else {
        if (solution[i][j]>solution[i+1][j]) conn.textContent='V';
        else conn.textContent="^";
        conn.classList.add("detail");
    }
    return conn;
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
        board[selectX][selectY]=0;
        showMessage("已删除");
    } else {
        board[selectX][selectY]=value;
        showMessage("已填入");
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
    if (board[selectX][selectY]===0) return;
    board[selectX][selectY]=0;
    showMessage("已删除");
    renderGrid();
}

function checkVictory() {
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) if (board[i][j]===0) return false;
    for (let i=0;i<SIZE;++i) {
        const st=new Set();
        for (let j=0;j<SIZE;++j) st.add(board[i][j]);
        if (st.size!==SIZE) return false;
    }
    for (let j=0;j<SIZE;++j) {
        const st=new Set();
        for (let i=0;i<SIZE;++i) st.add(board[i][j]);
        if (st.size!==SIZE) return false;
    }
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) {
        if (i<SIZE-1) {
            if (markDown[i][j]===1 && (solution[i][j]<solution[i+1][j])!==(board[i][j]<board[i+1][j])) {
                return false;
            }
        }
        if (j<SIZE-1) {
            if (markRight[i][j]===1 && (solution[i][j]<solution[i][j+1])!==(board[i][j]<board[i][j+1])) {
                return false;
            }
        }
    }
    return true;
}

const actionDiv=document.getElementById("actionDiv");

for (let i=1;i<=SIZE;++i) {
    const numBtn=document.createElement("button");
    numBtn.className="action-btn";
    numBtn.textContent=i;
    numBtn.addEventListener("click",()=>{
        setValue(i);
    });
    actionDiv.appendChild(numBtn);
}

window.addEventListener("keydown",function(e) {
    const key=e.key;
    for (let i=1;i<=SIZE;++i) {
        if (key===`${i}` || key===`NumPad${i}`) {
            setValue(i);
            e.preventDefault();
        }
    }
    if (key==="Backspace" || key==="Delete") {
        clearValue();
        e.preventDefault();
    }
    if (key==="w") {
        e.preventDefault();
        if (selectX!==-1 && selectY!==-1) {
            let x=selectX-1;
            let y=selectY;
            while (x>=0 && locked[x][y]===1) x--;
            if (x!==-1) selectX=x;
        }
    } else if (key==="s") {
        e.preventDefault();
        if (selectX!==-1 && selectY!==-1) {
            let x=selectX+1;
            let y=selectY;
            while (x<SIZE && locked[x][y]===1) x++;
            if (x!==SIZE) selectX=x;
        }
    } else if (key==="d") {
        e.preventDefault();
        if (selectX!==-1 && selectY!==-1) {
            let x=selectX;
            let y=selectY+1;
            while (y<SIZE && locked[x][y]===1) y++;
            if (y!==SIZE) selectY=y;
        }
    } else if (key==="a") {
        e.preventDefault();
        if (selectX!==-1 && selectY!==-1) {
            let x=selectX;
            let y=selectY-1;
            while (y>=0 && locked[x][y]===1) y--;
            if (y!==-1) selectY=y;
        }
    }
    renderGrid();
});

const clearBtn=document.createElement("button");
clearBtn.className="action-btn";
clearBtn.classList.add("clear-btn");
clearBtn.textContent="🗑️ 清除";
clearBtn.addEventListener("click",clearValue);
actionDiv.appendChild(clearBtn);

newGame();