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
let markPercentage=30; // [0,100]

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
}