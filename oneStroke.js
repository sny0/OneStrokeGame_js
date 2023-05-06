/**
 * @type {HTMLCanvasElement}
 */

function copyArray2d(array2d){
    return array2d.map(function(arr){
        return arr.slice();
    });
}

function init(){
    map = copyArray2d(stageMapArray[stage]);
    now = findStartPosition(stage);
    track = [[-1, -1]];
    track.push(now);
    isStageClear = false;
    if(stage == 9) boxSize = 20;
    else boxSize = 50;
}

function findStartPosition(n){
    for(let i=0; i<stageMapArray[n].length; i++){
        for(let j=0; j<stageMapArray[n][0].length; j++){
            if(stageMapArray[n][i][j] == 1){
                return [j, i];
            }
        }
    }
}

function drawRec(x, y, s){
    ctx.strokeStyle = "black";
    let c;
    if(map[y][x] == 0) c = "white";
    else if(map[y][x] == 1) c = "green";
    else if(map[y][x] == -1) c = "red";
    else if(map[y][x] == 2) c = "rgb(0, 250, 154)";
    else if(map[y][x] == 3) c = "gray";
    ctx.fillStyle = c;
    ctx.fillRect(x*s, y*s, s, s);
    ctx.strokeRect(x*s, y*s, s, s);

    if(now[0] == x && now[1] == y){
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(x*s+s/2, y*s+s/2, s*3/8, 0, Math.PI*2, true);
        ctx.fill();
        //console.log("b");
    }
}

function move(x, y){
    let tmp = now.slice();
    tmp[0] += x; tmp[1] += y;
    if(0 <= tmp[0] && tmp[0] < map[0].length && 0 <= tmp[1] && tmp[1] < map.length){
        let pre = now.slice();
        tx = track[track.length-2];

        if(tx[0] == tmp[0] && tx[1] == tmp[1]){
            map[pre[1]][pre[0]] = stageMapArray[stage][pre[1]][pre[0]]
            track.pop();
            now = tmp;
        }else if(map[tmp[1]][tmp[0]] == 0){
            map[tmp[1]][tmp[0]] = 2;
            track.push(tmp);
            now = tmp;
        }else if(map[tmp[1]][tmp[0]] == -1){
            track.push(tmp);
            now = tmp;
            if(judge()){
                stageClear();
            }
        }else if(map[tmp[1]][tmp[0]] == 1){
            init();
        }
        //console.log("a");
    }
}

function stageClear(){
    console.log("clear!");
    isStageClear = true;
    if(stage == stageMapArray.length-1) nb.textContent = "NEXT!!";
    else nb.textContent = "GO TO NEXT STAGE!!";
    nb.style.display = "inline";
}

function judge(){
    let clear = true;
    for(let i=0; i<map[0].length; i++){
        for(let j=0; j<map.length; j++){
            if(map[j][i] == 0){
                clear = false;
                return clear;
            }
        }
    }
    if(now == goal) clear = false;
    return clear;
}

function pirntMap(){
    for(let i=0; i<stageMapArray[stage].length; i++){
        let = "";
        for(let j=0; j<stageMapArray[stage][0].length; j++){
            let += stageMapArray[stage][i][j] + " ";
        }
        console.log(let);
    }
}

function draw(){
    if(isAllClaer){
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 400, 400);
        ctx.font = '48px serif';
        ctx.fillStyle = "black";
        ctx.fillText('THANK YOU FOR PLAYING!!', 0, 200, 400);
        ctx.font = '26px serif';
        ctx.fillText('CREATED BY sny', 100, 350);
    }else{
        for(let i=0; i<map.length; i++){
            for(let j=0; j<map[0].length; j++){
                drawRec(j, i, boxSize);
            }
        }
        
        ctx.strokeStyle = "blue";
        for(let i=2; i<track.length; i++){
            ctx.beginPath();
            ctx.moveTo(track[i-1][0]*boxSize+boxSize/2, track[i-1][1]*boxSize+boxSize/2);
            ctx.lineTo(track[i][0]*boxSize+boxSize/2, track[i][1]*boxSize+boxSize/2);
            ctx.closePath();
            ctx.stroke();
        }
        if(isStageClear){
            ctx.font = '48px serif';
            ctx.fillStyle = "black";
            ctx.fillText('STAGE CLEAR!!', 10, 220);
        }
    }
}

const canvas = document.getElementById('can');
const ctx = canvas.getContext('2d');
const nb = document.getElementById('nextButton');
const st = document.getElementById('stageText');

//1: start, 0:point not passed, 2:point passed, 3:wall, -1:goal
const stageMapArray = Array(10);

stageMapArray[0] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 1, 0, 0, -1, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];

stageMapArray[1] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 1, 0, 0, 3, 3],
    [3, 3, 3, 0, 0, 0, 3, 3],
    [3, 3, 3, 0, 0, -1, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];


stageMapArray[2] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 1, 0, 0, 0, 3, 3],
    [3, 3, 0, 0, 0, 0, 3, 3],
    [3, 3, 0, 3, 0, 0, 3, 3],
    [3, 3, 0, 0, 0, -1, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];

stageMapArray[3] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 1, -1, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 3, 0, 0, 3, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];

stageMapArray[4] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 1, 0, 0, 0, 0, 0, 3],
    [3, 3, 0, 0, 3, 0, 0, 3],
    [3, 3, 0, 0, -1, 0, 3, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 3, 0, 3],
    [3, 0, 0, 3, 0, 0, 0, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];

stageMapArray[5] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 3, 0, 1, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 3, 0, 0, 0, 0, 0, 3],
    [3, 3, 0, 0, -1, 0, 0, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];

stageMapArray[6] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 3, 0, 0, 3, 0, 3],
    [3, -1, 0, 0, 0, 0, 1, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 3, 0, 0, 3, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];

stageMapArray[7] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 0, 0, 1, -1, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 3, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 3, 3],
    [3, 0, 0, 0, 0, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];

stageMapArray[8] =  [
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 0, 0, 3, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 3],
    [3, -1, 0, 0, 0, 0, 0, 3],
    [3, 3, 0, 0, 0, 0, 0, 3],
    [3, 1, 0, 0, 0, 0, 0, 3],
    [3, 3, 3, 3, 3, 3, 3, 3]
];

stageMapArray[9] =  [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [0, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3],
    [0, 3, 3, 3, 0, 3, 3, 0, 3, 0, 3, 3, 0, 3, 0, 3, 3, 0, 3, 3],
    [0, 3, 3, 3, 0, 3, 3, 0, 3, 0, 3, 3, 0, 3, 0, 3, 3, 0, 3, 3],
    [0, 3, 3, 3, 0, 3, 3, 0, 3, 0, 3, 3, 0, 3, 0, 3, 3, 0, 3, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3],
    [3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 3, 0, 3, 3, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 3, 3],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 3, 0, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 3, 3, 0, 0, 0, 3, 3, 0, 0, 0, 3, 0, 3, 3, 3, 0, 0],
    [0, 3, 0, 3, 3, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0, 0, 3, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 3, -1, 0],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
];

const start = [2, 2];
const goal = [2, 2];
let boxSize = 50;
let map;
let now;
let stage = 0;
let track = [];
let isStageClear = false;
let isAllClaer = false;

init();
draw();
st.textContent = "STAGE : "+(stage+1);
console.log(map[0].length);
console.log(map.length);
pirntMap();
document.addEventListener("keydown", (event) => {
    if(!isStageClear){
        if(event.key === "ArrowUp" || event.key === "w" || event.key === "W"){
            move(0, -1);
        }else if(event.key === "ArrowDown" || event.key === "s" || event.key === "S"){
            move(0, 1);
        }else if(event.key === "ArrowRight" || event.key === "d" || event.key === "D"){
            move(1, 0);
        }else if(event.key === "ArrowLeft" || event.key === "a" || event.key === "A"){
            move(-1, 0);
        }else if(event.key === "r" || event.key === "R"){
            init();
            draw();
        }
        draw();
        console.log(event.key);
        //pirntMap();
    }else{
        if(event.key === "Enter" && isStageClear == true){
            if(stage == stageMapArray.length-1){
                isAllClaer = true;
                nb.style.display = "none";
                draw();
            }else{
                stage++;
                st.textContent = "STAGE : "+(stage+1);
                nb.style.display = "none";
                init();
                draw();
            }
        }
    }
});

nb.onclick = function(){
    if(stage == stageMapArray.length-1){
        isAllClaer = true;
        nb.style.display = "none";
        draw();
    }else{
        stage++;
        st.textContent = "STAGE : "+(stage+1);
        nb.style.display = "none";
        init();
        draw();
    }
}