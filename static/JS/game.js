var game = (function(client){

    const canvas = document.getElementById('game1');
    const context = canvas.getContext('2d');
    const blockSize = 64;
    const numRows = 13;
    const numCols = 21;
    var board = []
    const nombre = localStorage.getItem("valorInput");
    var stompClient = null;
    var loser = null;
    var dataplayer = {};
    var colors = ['red', 'blue', 'yellow', 'black']
    var datos = {};

    function board2(){
        client.getBoard(tablero);
        getName();
        getPlayers();
    }

    function boardAgain(){
        client.getBoard(tablero);
        getPlayers()
    }

    function getName(){
        let name = localStorage.getItem("valorInput");
        client.putNamePlayer(name);
    }

var tablero = function(data){
    board = [];
    for (let row = 0; row < numRows; row++){
        let fila = []
        for (let col = 0; col < numCols; col++){
            let index = "["+ col.toString()+", "+row.toString()+"]"
            if (row === 0 || col === 0 || row === 12 || col === 20){
                fila.push("0");
            } else if (data[index].status === "EMPTY"){
                fila.push("");
            } else if (data[index].status === "PLAYER"){
                fila.push("1");
            } else if (data[index].status === "BOMB"){
                fila.push("2");
            } else if (data[index].status === "BOMBPLAYER"){
                fila.push("3");
            } else if (data[index].status === "DEAD"){
                fila.push("4");
            }
        }
        board.push(fila);
    }
    getPlayers();
    dibujarTablero();
}

function dibujarTablero(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    let names = Object.keys(datos)
    for (let i = 0; i < board.length; i++){
        for (let j = 0; j < board[i].length; j++){
            if(board[i][j] === "0"){
                context.fillStyle = 'black';
                context.fillRect(blockSize*j, blockSize*i, blockSize, blockSize);
                context.fillStyle = 'white';
                context.fillRect(blockSize*j, blockSize*i, blockSize - 2, blockSize - 2);
                context.fillStyle = '#a9a9a9';
                context.fillRect((blockSize*j) + 2, (blockSize*i)+2, blockSize - 4, blockSize - 4);
            }
            else if(board[i][j] === "1") {
                context.beginPath();
                context.arc((j+0.5)*blockSize, (i+0.5)*blockSize, blockSize/2.5, 0, 2*Math.PI);
                if (names.length === 0){
                    context.fillStyle = 'white';
                    context.fill();
                } else {
                    for (let k = 0; k < names.length; k++){
                        if (datos[names[k]].x === j && datos[names[k]].y === i){
                            context.fillStyle = datos[names[k]].color;
                            context.fill();
                            break;
                        }
                    }
                }

            }
            else if(board[i][j] === "2") {
                context.beginPath();
                context.arc((j+0.5)*blockSize, (i+0.5)*blockSize, blockSize/4, 0, 2*Math.PI);
                context.fillStyle = 'black';
                context.fill();
                context.beginPath();
                context.arc((j+0.5)*blockSize, (i+0.5)*blockSize, blockSize/8, 0, 2*Math.PI);
                context.fillStyle = 'red';
                context.fill();
            }
            else if(board[i][j] === "3") {
                context.beginPath();
                context.arc((j+0.5)*blockSize, (i+0.5)*blockSize, blockSize/2.5, 0, 2*Math.PI);
                context.fillStyle = 'white';
                context.fill();
                context.beginPath();
                context.arc((j+0.5)*blockSize, (i+0.5)*blockSize, blockSize/4, 0, 2*Math.PI);
                context.fillStyle = 'black';
                context.fill();
                context.beginPath();
                context.arc((j+0.5)*blockSize, (i+0.5)*blockSize, blockSize/8, 0, 2*Math.PI);
                context.fillStyle = 'red';
                context.fill();
            }
            else if(board[i][j] === "4") {
                context.beginPath();
                context.arc((j+0.5)*blockSize, (i+0.5)*blockSize, blockSize/2.5, 0, 2*Math.PI);
                context.fillStyle = 'red';
                context.fill();
            }
        }
    }
}

    function getPlayers(){
        client.getPlayers(players)
    }

    var x = "";
    var y = "";

    var players = function(data){
        x = data[nombre].x;
        y = data[nombre].y;
        datos = data;
    }

document.addEventListener('keydown', function(e) {
    // left arrow key
    if (e.code === "ArrowLeft") {
        let movement = {
            player : nombre,
            movement : "Left"
        };
        client.putPlayerMovement(movement);
        publishBoard();
    }
    // up arrow key
    else if (e.code === "ArrowUp") {
        let movement = {
            player : nombre,
            movement : "Up"
        };
        client.putPlayerMovement(movement);
        publishBoard();
    }
    // right arrow key
    else if (e.code === "ArrowRight") {
        let movement = {
            player : nombre,
            movement : "Right"
            }
        client.putPlayerMovement(movement);
        publishBoard();
    }
    // down arrow key
    else if (e.code === "ArrowDown") {
        let movement = {
            player : nombre,
            movement : "Down"
        };
        client.putPlayerMovement(movement);
        publishBoard();
    }
    // space key
    else if (e.code === "Space") {
        let movement = {
            player : nombre,
            movement : "Bomb"
        };
        client.putPlayerMovement(movement);
        publishBoard();
    }
});

var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/board', function (eventbody) {
                var abc = JSON.parse(eventbody.body);
                console.log(abc.length)
                if (abc.length === 1){
                    alert("Ganador:" + abc)
                }
                boardAgain();
            });
        });
    };

    var publishBoard = function(){
         stompClient.send("/topic/board", {}, JSON.stringify(Object.keys(datos)));
    }

return{
    init: function () {
        board2();
        connectAndSubscribe();
    },

    board2:board2,
    boardAgain:boardAgain,
    connectAndSubscribe
};

})(client);