/**
 * @type {HTMLCanvasElement}
 * 最終更新日 : 23/5/7
 * 作成者 : sny
 * プログラムの概要 : 一筆書きゲームの制御
 */


//マップのデータを値渡しでコピーする関数
function copyArray2d(array2d){
    return array2d.map(function(arr){
        return arr.slice();
    });
}

//初期化する関数
function init(){
    map = copyArray2d(stageMapArray[stage]); //ステージのマップデータをコピー
    now = findStartPosition(stage); //ステージデータから初期位置を取得
    track = [[-1, -1]]; //移動履歴を記録する配列を初期化
    track.push(now); //初期位置を移動履歴に追加　　
    isStageClear = false;
    //ステージに合わせてマスの大きさを指定
    if(stage == 9) boxSize = 20;
    else boxSize = 50;
}

//マップデータから開始位置を見つける関数
function findStartPosition(n){
    for(let i=0; i<stageMapArray[n].length; i++){
        for(let j=0; j<stageMapArray[n][0].length; j++){
            if(stageMapArray[n][i][j] == 1){
                return [j, i];
            }
        }
    }
}

//マスと現在位置を描画する関数
function drawRec(x, y, s){
    //マスを描画
    ctx.strokeStyle = "black"; //マスの枠の色を黒に
    let c; //使用する色
    if(map[y][x] == 0) c = "white"; //移動していないマスは白に
    else if(map[y][x] == 1) c = "green"; //初期位置は緑に
    else if(map[y][x] == -1) c = "red"; //ゴールは赤に
    else if(map[y][x] == 2) c = "rgb(0, 250, 154)"; //移動したマスは薄緑に
    else if(map[y][x] == 3) c = "gray"; //壁（移動できないマス）は灰色に
    ctx.fillStyle = c;
    ctx.fillRect(x*s, y*s, s, s); //マスの中身を描画
    ctx.strokeRect(x*s, y*s, s, s); //マスの枠を描画

    //現在位置を円として描画
    if(now[0] == x && now[1] == y){
        ctx.fillStyle = "blue"; //色を青に
        ctx.beginPath(); //パスの開始
        ctx.arc(x*s+s/2, y*s+s/2, s*3/8, 0, Math.PI*2, true); //円を描く
        ctx.fill(); //塗りつぶす
    }
}

//移動関数
function move(x, y){
    let tmp = now.slice(); //現在位置をコピー
    tmp[0] += x; tmp[1] += y; //仮移動
    //仮移動後の座標がマップ内にいれば処理をおこなう
    if(0 <= tmp[0] && tmp[0] < map[0].length && 0 <= tmp[1] && tmp[1] < map.length){
        let pre = now.slice(); //現在位置をコピー
        tx = track[track.length-2]; //ひとつ前の座標（移動履歴）を取得

        //ひとつ前のマス（移動履歴）に移動した場合
        if(tx[0] == tmp[0] && tx[1] == tmp[1]){
            map[pre[1]][pre[0]] = stageMapArray[stage][pre[1]][pre[0]]; //マップデータを更新
            track.pop(); //最後の移動履歴を削除
            now = tmp; //現在位置を更新
        }//まだ通っていないマスに移動した場合
        else if(map[tmp[1]][tmp[0]] == 0){
            map[tmp[1]][tmp[0]] = 2; //マップデータを更新
            track.push(tmp); //移動履歴を追加
            now = tmp; //現在位置を更新
        }//ゴールに移動した場合
        else if(map[tmp[1]][tmp[0]] == -1){
            track.push(tmp); //移動履歴を追加
            now = tmp; //現在位置を更新
            //クリア条件を達成した場合
            if(judge()){
                //ステージクリア
                stageClear();
            }
        }//初期位置に移動した場合
        else if(map[tmp[1]][tmp[0]] == 1){
            init(); //初期化
        }
    }
}

//ステージをクリアしたときに行われる関数
function stageClear(){
    console.log("clear!");
    isStageClear = true;
    //ボタンのテキストをステージに合わせて変更
    if(stage == stageMapArray.length-1) nb.textContent = "NEXT!!";
    else nb.textContent = "GO TO NEXT STAGE!!";
    nb.style.display = "inline"; //ボタンを見えるようにする
}

//クリアしたか判定する関数
function judge(){
    let clear = true;
    //すべてのマスを確認し移動していないマスがないか確認
    for(let i=0; i<map[0].length; i++){
        for(let j=0; j<map.length; j++){
            if(map[j][i] == 0){
                clear = false;
                return clear;
            }
        }
    }
    return clear;
}

//コンソールに現在のマップを出力する関数（デバッグ用）
function pirntMap(){
    for(let i=0; i<stageMapArray[stage].length; i++){
        let x = "";
        for(let j=0; j<stageMapArray[stage][0].length; j++){
            x += stageMapArray[stage][i][j] + " ";
        }
        console.log(x);
    }
}

//描画関数
function draw(){
    if(isAllClaer){//最終ステージをクリアした場合
        //リザルト画面を描画
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 400, 400);
        ctx.font = '48px serif';
        ctx.fillStyle = "black";
        ctx.fillText('THANK YOU FOR PLAYING!!', 0, 200, 400);
        ctx.font = '26px serif';
        ctx.fillText('CREATED BY sny', 100, 350);
    }else{
        //マスを描画
        for(let i=0; i<map.length; i++){
            for(let j=0; j<map[0].length; j++){
                drawRec(j, i, boxSize);
            }
        }
        
        //移動履歴を描画
        ctx.strokeStyle = "blue";
        for(let i=2; i<track.length; i++){
            ctx.beginPath(); //パスの開始
            ctx.moveTo(track[i-1][0]*boxSize+boxSize/2, track[i-1][1]*boxSize+boxSize/2);
            ctx.lineTo(track[i][0]*boxSize+boxSize/2, track[i][1]*boxSize+boxSize/2);
            ctx.closePath(); //パスを閉じる
            ctx.stroke(); //線を描画
        }
        if(isStageClear){//ステージをクリアしたとき
            //STAGE CLEAR!!と表示
            ctx.font = '48px serif';
            ctx.fillStyle = "black";
            ctx.fillText('STAGE CLEAR!!', 10, 220);
        }
    }
}

//htmlファイルからidを取得
const canvas = document.getElementById('can');
const ctx = canvas.getContext('2d');
const nb = document.getElementById('nextButton');
const st = document.getElementById('stageText');

//マップデータの配列
//1: start, 0:point not passed, 2:point passed, 3:wall, -1:goal
const stageMapArray = Array(10);

//ステージ0
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

//ステージ1
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

//ステージ2
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

//ステージ3
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

//ステージ4
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

//ステージ5
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

//ステージ6
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

//ステージ7
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

//ステージ8
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

//ステージ9
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

let boxSize = 50; //マスの大きさ
let map; //現在のマップ
let now; //現在の座標
let stage = 0; //現在のステージ
let track = []; //移動履歴:(x, y)を要素として持つ
let isStageClear = false; //ステージをクリアしたか
let isAllClaer = false; //最終ステージをクリアしたか

init(); //始めのステージを読み込み初期化
draw(); //描画
st.textContent = "STAGE : "+(stage+1); //ステージ数を表示

//キーが押されたときに呼び出される関数
document.addEventListener("keydown", (event) => {
    if(!isStageClear){//ステージをクリアしていない時は移動の入力を受け付ける
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
        draw(); //描画
        console.log(event.key);
    }else{//ステージをクリアしているときはEnterキーで次に進む
        if(event.key === "Enter" && isStageClear == true){
            //最終ステージをクリアしたとき
            if(stage == stageMapArray.length-1){
                isAllClaer = true;
                nb.style.display = "none"; //ボタンを見えなくする
                draw(); //リザルト画面の描画
            }//最終ステージ以外のステージをクリアしたとき
            else{
                stage++; //次のステージへ
                st.textContent = "STAGE : "+(stage+1); //テキストを変更
                nb.style.display = "none"; //ボタンを見えなくする
                init(); //次のステージを読み込み初期化
                draw(); //描画
            }
        }
    }
});

//ボタンが押されたときに呼び出される関数
//次に進む
nb.onclick = function(){
    //最終ステージをクリアしたとき
    if(stage == stageMapArray.length-1){
        isAllClaer = true;
        nb.style.display = "none"; //ボタンを見えなくする
        draw(); //リザルト画面の描画
    }//最終ステージ以外のステージをクリアしたとき
    else{
        stage++; //次のステージへ
        st.textContent = "STAGE : "+(stage+1); //テキストを変更
        nb.style.display = "none"; // ボタンを見えなくする
        init(); //次のステージを読み込み初期化
        draw(); //描画
    }
}