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
let solution=[];
let markRight=[];
let markDown=[];
let markPercentage=15; // [0,100]
let selectX=-1;
let selectY=-1;

function randint(l,r) {
    return Math.floor(Math.random()*(r-l+1))+l;
}

function newGame() {
    board=[];
    markRight=[];
    markDown=[];
    for (let i=0;i<SIZE;++i) {
        board.push([]);
        markRight.push([]);
        markDown.push([]);
        for (let j=0;j<SIZE;++j) {
            board[i].push((i+j)&1);
            markRight[i].push(-1);
            markDown[i].push(-1);
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
    for (let i=0;i<SIZE;++i) for (let j=0;j<SIZE;++j) {
        if (i!==SIZE-1) { // Down
            if (randint(1,100)<=markPercentage) {
                if (solution[i][j]===solution[i+1][j]) markDown[i][j]=0;
                else markDown[i][j]=1;
            }
        }
        if (j!==SIZE-1) { // Right
            if (randint(1,100)<=markPercentage) {
                if (solution[i][j]===solution[i][j+1]) markRight[i][j]=0;
                else markRight[i][j]=1;
            }
        }
    }
    renderGrid();
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
                    space.style.width="30px";
                    space.style.height="30px";
                    if (window.innerWidth<=600) space.style.width="24px";
                    if (window.innerWidth<=480) space.style.width="20px";
                    space.style.backgroundColor="#2c3e50";
                    rowDiv.appendChild(space);
                }
            }
            container.appendChild(rowDiv)
        }
    }
}

function selectCell(i,j) {
    ;
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
    }
    if (selectX===i && selectY===j) {
        cell.classList.append("selected");
    }
    cell.addEventListener("click",(e)=>{
        e.stopPropagation();
        selectCell(i,j);
    })
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

newGame();