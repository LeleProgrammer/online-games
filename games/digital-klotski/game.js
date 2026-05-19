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

function getSize() {
    const params=new URLSearchParams(window.location.search);
    const size=parseInt(params.get("size"));
    if (size>=3 && size<=12) return size;
    else if (size===16) return size;
    else if (size===20) return size;
    else return 3;
}

const SIZE=getSize();
let tiles=[];
let movecnt=0;
let done=false;
let x0=0,y0=0;
let fontSize=0;

const gridContainer=document.getElementById("puzzleGrid");
const moveSpan=document.getElementById("moveCount");
const shuffleButton=document.getElementById("shuffleBtn");
const messageDiv=document.getElementById("message");

function randint(l,r) {
    return Math.floor(Math.random()*(r-l+1))+l;
}

function init() {
    fontSize=0;
    tiles=[];
    let g=1;
    for (let i=0;i<SIZE;++i) {
        tiles.push([]);
        for (let j=0;j<SIZE;++j) {
            tiles[i].push(g);
            g++;
            if (g===SIZE*SIZE) g=0;
        }
    }
    x0=y0=SIZE-1
    movecnt=0;
    done=false;
    moveSpan.textContent=movecnt;
    messageDiv.textContent="";
    renderGrid();
}

function shuffle() {
    if (done) return;
    let step=randint(SIZE*SIZE*20,SIZE*SIZE*40);
    for (let i=1;i<=step;++i) {
        let available=[]
        if (x0>0) available.push([x0-1,y0]);
        if (y0>0) available.push([x0,y0-1]);
        if (x0<SIZE-1) available.push([x0+1,y0]);
        if (y0<SIZE-1) available.push([x0,y0+1]);
        let nex=available[randint(0,available.length-1)];
        [tiles[x0][y0],tiles[nex[0]][nex[1]]]=[tiles[nex[0]][nex[1]],tiles[x0][y0]];
        [x0,y0]=[nex[0],nex[1]];
    }
    movecnt=0;
    done=false;
    moveSpan.textContent=movecnt;
    messageDiv.textContent="";
    renderGrid();
}

function checkWin() {
    let g=1;
    for (let i=0;i<SIZE;++i) {
        for (let j=0;j<SIZE;++j) {
            if (tiles[i][j]!==g) return false;
            g+=1
            if (g===SIZE*SIZE) g=0;
        }
    }
    return true;
}

function tryMove(x,y) {
    if (done) return false;
    if (Math.abs(x-x0)+Math.abs(y-y0)!=1) return false;
    [tiles[x0][y0],tiles[x][y]]=[tiles[x][y],tiles[x0][y0]];
    [x0,y0]=[x,y];
    movecnt++;
    moveSpan.textContent=movecnt;
    renderGrid();
    if (checkWin()) {
        done=true;
        messageDiv.textContent="🎉 You Win! 🎉";
    }
    return true;
}

function calculateFontSize() {
    const tiles=document.querySelectorAll(".tile:not(.empty)");
    if (tiles.length===0) return;
    const tileWidth=tiles[0].offsetWidth;
    fontSize=tileWidth*0.4;
    tiles.forEach(tile=>{
        tile.style.fontSize=fontSize+"px";
    });
}

function renderGrid() {
    gridContainer.style.gridTemplateColumns=`repeat(${SIZE},1fr)`;
    gridContainer.innerHTML="";
    for (let i=0;i<tiles.length;++i) {
        for (let j=0;j<tiles[i].length;++j) {
            const val=tiles[i][j];
            const tile=document.createElement("div");
            tile.classList.add("tile");
            if (val===0) {
                tile.classList.add("empty");
                tile.textContent="";
            } else {
                tile.textContent=val;
            }
            tile.style.fontSize=fontSize+"px";
            tile.addEventListener("click",(function(x,y) {
                return function() { tryMove(x,y); };
            })(i,j));
            gridContainer.appendChild(tile);
        }
    }
    if (fontSize===0) setTimeout(calculateFontSize,50);
}

window.addEventListener("resize",()=>{
    fontSize=0;
    setTimeout(()=>{
        if (gridContainer.children.length>0) {
            calculateFontSize();
        }
    },50);
});

document.addEventListener("keydown",function(event) {
    if (done) return;
    let targetX=x0;
    let targetY=y0;
    switch (event.key) {
        case "w":
            targetX=x0+1;
            targetY=y0;
            break;
        case "s":
            targetX=x0-1;
            targetY=y0;
            break;
        case "a":
            targetX=x0;
            targetY=y0+1;
            break;
        case "d":
            targetX=x0;
            targetY=y0-1;
            break;
        default:
            return;
    }
    if (targetX>=0 && targetX<SIZE && targetY>=0 && targetY<SIZE) {
        tryMove(targetX,targetY);
    }
});

function restart() {
    init();
    shuffle();
}

shuffleButton.addEventListener("click",()=>{
    restart();
});

restart();