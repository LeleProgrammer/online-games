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

let board=[
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
];

const base=[
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,1,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8]
];

let defa=[];

let solution=[];
let selectX=-1;
let selectY=-1;
let done=false;
let deleteTotal=1;

let timer=null;
let startTime=performance.now();

const table=document.getElementById("sudokuTable");
const messageDiv=document.getElementById("message");

function checkValid(x,y,v) {
    for (let i=0;i<9;++i) if (board[i][y]===v || board[x][i]===v) return false;
    const bx=Math.floor(x/3)*3;
    const by=Math.floor(y/3)*3;
    for (let i=0;i<3;++i) for (let j=0;j<3;++j) if (board[bx+i][by+j]===v) return false;
    return true;
}

function checkWin() {
    for (let i=0;i<9;++i) for (let j=0;j<9;++j) if (board[i][j]===0) return false;
    return true;
}

function clearHighlights() {
    const cells=document.querySelectorAll(".sudoku-cell");
    cells.forEach(cell=>{
        cell.classList.remove("selected");
    });
}

function highlight(x,y) {
    clearHighlights();
    if (x===-1) return;
    const cells=document.querySelectorAll(".sudoku-cell");
    let cur=0;
    for (let i=0;i<9;++i) for (let j=0;j<9;++j) {
        if (x==i && y==j) {
            cells[cur].classList.add("selected");
            break;
        }
        cur++;
    }
}

function selectCell(x,y) {
    if (selectX===x && selectY===y) {
        selectX=-1;
        selectY=-1;
        highlight(-1,-1);
        return;
    }
    if (done) return;
    if (defa[x][y]===1) return;
    selectX=x;
    selectY=y;
    highlight(selectX,selectY)
}

function renderGrid() {
    table.innerHTML="";
    for (let i=0;i<9;++i) {
        const tr=document.createElement("tr");
        for (let j=0;j<9;++j) {
            const td=document.createElement("td");
            const cell=document.createElement("div");
            cell.className="sudoku-cell";
            const value=board[i][j];
            if (value!==0) cell.textContent=value;
            else cell.textContent="";
            if (defa[i][j]===1) cell.classList.add("prefilled");
            else cell.classList.add("user");
            cell.addEventListener("click",(function(x,y) {
                return function() { selectCell(x,y); };
            })(i,j));
            td.appendChild(cell);
            tr.appendChild(td)
        }
        table.appendChild(tr);
    }
    if (selectX!==-1 && selectY!==-1) highlightAffected(selectX,selectY);
}

function setNumber(num) {
    if (done) return;
    if (selectX===-1 || selectY===-1) {
        messageDiv.textContent="👉 请先选择一个格子";
        return;
    }
    if (defa[selectX][selectY]===1) {
        messageDiv.textContent="❌ 此格子不能被修改";
        return;
    }
    const las=board[selectX][selectY];
    board[selectX][selectY]=0;
    if (!checkValid(selectX,selectY,num)) {
        board[selectX][selectY]=las;
        messageDiv.textContent="❌ 该数字与现有数字冲突";
        renderGrid();
        return;
    }
    board[selectX][selectY]=num
    messageDiv.textContent="✔️ 操作完成"
    if (checkWin()) {
        messageDiv.textContent="🎉 恭喜通关"
        done=true;
        if (timer) clearInterval(timer);
        timer=null;
    }
    selectX=-1;
    selectY=-1
    renderGrid();
}

function deleteNumber() {
    if (done) return;
    if (selectX===-1 || selectY===-1) {
        messageDiv.textContent="👉 请先选择一个格子";
        return;
    }
    if (defa[selectX][selectY]===1) {
        messageDiv.textContent="❌ 此格子不能被删除";
        return;
    }
    board[selectX][selectY]=0;
    messageDiv.textContent="✔️ 已清除";
    renderGrid();
}

function randint(l,r) {
    return Math.floor(Math.random()*(r-l+1))+l;
}

function shuffle() {
    let step=randint(500,1000);
    for (let _=1;_<=step;++_) {
        let a=randint(0,2);
        let b=randint(0,2);
        let x=randint(0,2);
        a+=x*3;
        b+=x*3;
        if (randint(0,1)===0) [solution[a],solution[b]]=[solution[b],solution[a]]
        else for (let i=0;i<9;++i) [solution[i][a],solution[i][b]]=[solution[i][b],solution[i][a]];
    }
}

function newGame() {
    board=[]
    solution=[]
    defa=[]
    for (let i=0;i<9;++i) {
        defa.push([]);
        board.push([]);
        solution.push([]);
        for (let j=0;j<9;++j) {
            defa[i].push(1);
            board[i].push(0);
            solution[i].push(0);
        }
    }
    for (let i=0;i<9;++i) for (let j=0;j<9;++j) solution[i][j]=base[i][j];
    shuffle();
    for (let i=0;i<9;++i) for (let j=0;j<9;++j) board[i][j]=solution[i][j];
    let available=[]
    for (let i=0;i<9;++i) for (let j=0;j<9;++j) available.push([i,j]);
    for (let _=1;_<=deleteTotal;++_) {
        g=randint(0,available.length-1);
        const x=available[g][0];
        const y=available[g][1];
        defa[x][y]=0;
        available.splice(g,1);
        board[x][y]=0;
    }
    selectX=-1;
    selectY=-1;
    done=false;
    messageDiv.innerHTML="";
    renderGrid();
    if (timer) clearInterval(timer);
    startTime=performance.now();
    timerElement=document.getElementById("timer");
    timer=setInterval(()=>{
        const now=performance.now();
        const elapsed=(now-startTime)/1000;
        timerElement.textContent=elapsed.toFixed(2);
    },30);
}

function init() {
    newGame();
    const panel=document.getElementById("numberPanel");
    panel.innerHTML="";
    for (let i=1;i<=9;++i) {
        const btn=document.createElement("button");
        btn.textContent=i;
        btn.classList.add("num-btn");
        btn.addEventListener("click",(function(num) {
            return function() { setNumber(num); };
        })(i));
        panel.appendChild(btn);
    }
    const delBtn=document.createElement("button");
    delBtn.textContent="⌫";
    delBtn.classList.add("num-btn","delete");
    delBtn.addEventListener("click",deleteNumber);
    panel.appendChild(delBtn);
    const newBtn=document.getElementById("newGameBtn");
    newBtn.addEventListener("click",newGame);
    window.addEventListener("keydown",function(e) {
        if (done) return;
        const key=e.key;
        if (key>="1" && key<="9") {
            setNumber(parseInt(key));
            e.preventDefault();
        } else if (key==="Delete" || key=="Backspace") {
            deleteNumber();
            e.preventDefault();
        }
    })
}

const label=document.getElementById("difficultyLabel");
const params=new URLSearchParams(window.location.search);
const diff=params.get("diff");
if (diff==="easy") {
    label.textContent="简单";
    deleteTotal=randint(20,30);
} else if (diff==="medium") {
    label.textContent="中等";
    deleteTotal=randint(45,50);
} else if (diff==="hard") {
    label.textContent="困难";
    deleteTotal=randint(55,60);
} else if (diff==="expert") {
    label.textContent="大师";
    deleteTotal=randint(65,66);
} else {
    label.textContent="简单";
    // deleteTotal=randint(20,30);
    deleteTotal=1;
}

init();