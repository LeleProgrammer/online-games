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
let toMark=6;
let toRemove=6;
let selectX=-1;
let selectY=-1;

function randint(l,r) {
    return Math.floor(Math.random()*(r-l+1))+l;
}

function newGame() {
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

newGame();