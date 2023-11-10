



/////////////Problème d'affichage de confirm 2 fois. 
///////Pause marche bien , mais fait pas pause pour la musique? ***un détail






const username = "admin";
const password = "12345";

// Function to handle form submission
document.querySelector('form').onsubmit = (e) => {
    e.preventDefault();

    let inputUser = document.querySelector('#txtUsername').value;
    let inputPass = document.querySelector('#txtPassword').value;

    let message = "";
    if (inputUser === "" || inputPass === "") {
        message = "Username and password is required";
    } else if (inputUser !== username || inputPass !== password) {
        message = "Username and Password do not match.<br>Please try again.";
    } else {
        message = "Success!<br>Have fun!";
        window.location.assign("tronGame.html");
    }
    document.querySelector('#messageDetails').innerHTML = message;
}



//////LA PARTIE DES BOUTTONS////////
var timeOutId; //Prolonger le temps
var gamePause = true;
document.getElementById("start-button").addEventListener("click", start);
document.getElementById("pause-button").addEventListener("click", pause);
document.getElementById("restart-button").addEventListener("click", restart);

function pause() {
    document.getElementById("soundtrack");
    soundtrack.pause();
    soundtrack.volume = 0.4;
    clearTimeout(timeOutId);
    gamePause = true;
}


function start() {
    gamePause = false;
    play();
}


function play() {
    document.getElementById("soundtrack").play();
    soundtrack.volume = 0.4;
    if (gamePause) return;
    advance();
    var timeoutDuration = 140 - (roundCounter * 10); // decrease timeout duration by 10ms per round
    timeOutId = setTimeout(play, timeoutDuration);
}


function restart() {
    window.location.assign("tronGame.html");
}



///////////SETTING POINTS AND COUNTERS//////////
var pointsPlayer1 = 0;
var pointsPlayer2 = 0;
var roundCounter = 0;
var colorPlayer1 = "#44CF36";
var colorPlayer2 = "#F000D0";

function partieTerminer() {

    clearTimeout(timeOutId);

    if (!lightCycle1_alive && !lightCycle2_alive) {
        alert("Égalité!");
        roundCounter -= 1;
    }

    if (lightCycle1_alive && !lightCycle2_alive) {
        alert("Joueur 1 a gagné la partie!");
        // Increase player 1's score by 1
        pointsPlayer1 += 1;
        document.querySelector('.counter.player1').textContent = pointsPlayer1;
    } else if (!lightCycle1_alive && lightCycle2_alive) {
        alert("Joueur 2 a gagné la partie!");
        // Increase player 2's score by 1
        pointsPlayer2 += 1;
        document.querySelector('.counter.player2').textContent = pointsPlayer2;
    }

    reset();
}



function reset() {
    var confirmed = confirm("Do you want to play again?");
    if (!confirmed) {
        window.location.assign("tron.html");
        return;
    }

    roundCounter += 1;
    document.querySelector('.round-counter').textContent = `Round ${roundCounter}`;

    // Clear the canvas
    C.clearRect(0, 0, canvas.width, canvas.height);

    // // Reset the grids and light cycles
    grid = create2DArray(NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL);
    grid2 = create2DArray(NUM_CELLS_HORIZONTAL2, NUM_CELLS_VERTICAL2);

    lightCycle2_x = NUM_CELLS_HORIZONTAL2 / 2;
    lightCycle2_y = NUM_CELLS_VERTICAL2 - 71;
    lightCycle2_vx = 0;
    lightCycle2_vy = 1;
    lightCycle2_alive = true;

    lightCycle1_x = NUM_CELLS_HORIZONTAL / 2;
    lightCycle1_y = NUM_CELLS_VERTICAL;
    lightCycle1_vx = 0;
    lightCycle1_vy = -1;
    lightCycle1_alive = true;


    gameEnded = false;
    redraw();
    start();
}



var canvas = document.getElementById("myCanvas");
var C = canvas.getContext("2d");
var canvas_rectangle = canvas.getBoundingClientRect();

// Creates a 2D array filled with zeros  (background)
var create2DArray = function (numColumns, numRows) {
    var array = [];
    for (var c = 0; c < numColumns; c++) {
        array.push([]);
        for (var r = 0; r < numRows; r++) {
            array[c].push(0);
        }
    }
    return array;
}



//player 1 starting down
var cellSize = 10;
var cellSize2 = 10;
var pointsPlayer1 = 0;
var pointsPlayer2 = 0;
var choicePlayer1 = "#44CF36";
var choicePlayer2 = "#F000D0";


// Current position and direction of light cycle 1
var NUM_CELLS_HORIZONTAL = canvas.width / cellSize;
var NUM_CELLS_VERTICAL = canvas.height / cellSize;
var x0 = (canvas.width - NUM_CELLS_HORIZONTAL * cellSize) / 2;
var y0 = (canvas.height - NUM_CELLS_VERTICAL * cellSize) / 2;
var grid = create2DArray(NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL);
var CELL_EMPTY = 0;
var CELL_OCCUPIED = 2;

var lightCycle1_x = NUM_CELLS_HORIZONTAL / 2;
var lightCycle1_y = NUM_CELLS_VERTICAL;
var lightCycle1_vx = 0;
var lightCycle1_vy = -1;
var lightCycle1_alive = true;


// Current position and direction of light cycle 2
var NUM_CELLS_HORIZONTAL2 = canvas.width / cellSize2;
var NUM_CELLS_VERTICAL2 = canvas.height / cellSize2;
var x02 = (canvas.width - NUM_CELLS_HORIZONTAL2 * cellSize2) / 2;
var y02 = (canvas.height - NUM_CELLS_VERTICAL2 * cellSize2) / 2;
var grid2 = create2DArray(NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL);
var CELL_EMPTY2 = 0;
var CELL_OCCUPIED2 = 2;

var lightCycle2_x = NUM_CELLS_HORIZONTAL2 / 2;
var lightCycle2_y = NUM_CELLS_VERTICAL2 - 71;
var lightCycle2_vx = 0;
var lightCycle2_vy = 1;
var lightCycle2_alive = true;

//Seperate trails
grid[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED;
grid2[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED2;



///////////PARTIE CONTROLLE DES JOUEURS////////////
//La souris
var mouseMap = document.querySelector("#myCanvas");
mouseMap.addEventListener("mousedown", function (e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;

    mouseMap.addEventListener("mouseup", function (e) {

        var mouseX1 = e.pageX;
        var mouseY1 = e.pageY;

        var delta_x = mouseX1 - mouseX;
        var delta_y = mouseY1 - mouseY;


        if (Math.abs(delta_x) > Math.abs(delta_y)) {

            //Left swing
            if (delta_x > 0) {
                lightCycle1_vy = 0;
                lightCycle1_vx = 1;
            }
            //Right swing
            else {
                lightCycle1_vy = 0;
                lightCycle1_vx = -1;
            }
        }
        //Down swing
        else if (delta_y > 0) {
            lightCycle1_vx = 0;
            lightCycle1_vy = 1;
        }
        //Up swing
        else {
            lightCycle1_vx = 0;
            lightCycle1_vy = -1;
        }

    });

});



//Player 1
function keyDownHandler(e) {
    console.log("keyCode: " + e.keyCode);
    e = e || window.event;

    if (e.keyCode === 38) { // up arrow
        lightCycle1_vx = 0;
        lightCycle1_vy = -1;
    }
    else if (e.keyCode === 40) { // down arrow
        lightCycle1_vx = 0;
        lightCycle1_vy = 1;
    }
    else if (e.keyCode === 37) { // left arrow
        lightCycle1_vy = 0;
        lightCycle1_vx = -1;
    }
    else if (e.keyCode === 39) { // right arrow
        lightCycle1_vy = 0;
        lightCycle1_vx = 1;
    }
    //Player 2
    if (e.keyCode === 87) { // W arrow
        lightCycle2_vx = 0;
        lightCycle2_vy = -1;
    }
    else if (e.keyCode === 83) { // S arrow
        lightCycle2_vx = 0;
        lightCycle2_vy = 1;
    }
    else if (e.keyCode === 65) { // A arrow
        lightCycle2_vy = 0;
        lightCycle2_vx = -1;
    }
    else if (e.keyCode === 68) { // D arrow
        lightCycle2_vy = 0;
        lightCycle2_vx = 1;
    }
}

document.onkeydown = keyDownHandler;



/////////PLAYER MOUVEMENT AND CREATION///////////
var inputPlayer1 = document.querySelector("#inputPlayer1");
inputPlayer1.addEventListener('input', function () {
    choicePlayer1 = inputPlayer1.value;
});

var inputPlayer2 = document.querySelector("#inputPlayer2");
inputPlayer2.addEventListener('input', function () {
    choicePlayer2 = inputPlayer2.value;
});


var redraw = function () {
    C.fillStyle = "#008CFF"; // THe color of the whole canvas
    C.fillRect(0, 0, canvas.width, canvas.height);


    ///PLAYER 1
    for (var i = 0; i < NUM_CELLS_HORIZONTAL; ++i) {
        for (var j = 0; j < NUM_CELLS_VERTICAL; ++j) {
            if (grid[i][j] === CELL_OCCUPIED) {
                C.fillStyle = choicePlayer1; // color of the line 
                C.fillRect(x0 + i * cellSize + 1, y0 + j * cellSize + 1, cellSize - 2, cellSize - 2);
            }
        }
    }

    //PLAYER 2
    for (var i = 0; i < NUM_CELLS_HORIZONTAL2; ++i) {
        for (var j = 0; j < NUM_CELLS_VERTICAL2; ++j) {
            if (grid2[i][j] === CELL_OCCUPIED2) {
                C.fillStyle = choicePlayer2; // color of the line
                C.fillRect(x02 + i * cellSize2 + 1, y02 + j * cellSize2 + 1, cellSize2 - 2, cellSize2 - 2);
            }
        }
    }



    // if alive its the "whitesmoke" else its "red"
    C.fillStyle = lightCycle2_alive ? "whitesmoke" : "red";
    C.fillRect(x02 + lightCycle2_x * cellSize2, y02 + lightCycle2_y * cellSize2, cellSize2, cellSize2);



    // if alive its the "black" else its "red"
    C.fillStyle = lightCycle1_alive ? "black" : "red";
    C.fillRect(x0 + lightCycle1_x * cellSize, y0 + lightCycle1_y * cellSize, cellSize, cellSize);
}




var gameEnded = false; // Cette variable est pour vérifié la collision des 2 joueurs
var advance = function () {

    // console.log("Advancing the game");
    if (lightCycle1_alive && lightCycle2_alive && !gameEnded) {
        var new1_x = lightCycle1_x + lightCycle1_vx;
        var new1_y = lightCycle1_y + lightCycle1_vy;
        var new1_x2 = lightCycle2_x + lightCycle2_vx;
        var new1_y2 = lightCycle2_y + lightCycle2_vy;

        //JOUEUR 1 les conditions
        if (new1_x < 0 || new1_x >= NUM_CELLS_HORIZONTAL
            || new1_y < 0 || new1_y >= NUM_CELLS_VERTICAL
            || grid[new1_x][new1_y] === CELL_OCCUPIED
            || grid2[new1_x][new1_y] === CELL_OCCUPIED2
        ) {
            lightCycle1_alive = false;
            gameEnded = true;
            setTimeout(partieTerminer, 500);
        } else {
            grid[new1_x][new1_y] = CELL_OCCUPIED;
            lightCycle1_x = new1_x;
            lightCycle1_y = new1_y;
        }

        //JOUEUR 2 les conditions
        if (new1_x2 < 0 || new1_x2 >= NUM_CELLS_HORIZONTAL2
            || new1_y2 < 0 || new1_y2 >= NUM_CELLS_VERTICAL2
            || grid2[new1_x2][new1_y2] === CELL_OCCUPIED2
            || grid[new1_x2][new1_y2] === CELL_OCCUPIED2
        ) {
            lightCycle2_alive = false;
            gameEnded = true;
            setTimeout(partieTerminer, 500);
        } else {
            grid2[new1_x2][new1_y2] = CELL_OCCUPIED2;
            lightCycle2_x = new1_x2;
            lightCycle2_y = new1_y2;
        }

        // Collision entre 2 joueurs (égalité)
        if (new1_x === new1_x2 && new1_y === new1_y2) {
            playerAlive1 = false;
            playerAlive2 = false;
            if (!gameEnded) {
                gameEnded = true;
            }
        }

        redraw();
    }
}