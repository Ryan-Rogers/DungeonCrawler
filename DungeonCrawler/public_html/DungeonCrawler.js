// Canvas
var canvas = document.querySelector("canvas");
document.body.appendChild(canvas);
var context = canvas.getContext("2d");

// Initialization
var landscape;
var background;
var square;
var timeSinceLastFrame = 0;
var mapObjects = [];
var selectedTile = {
        row: 0,
        column: 0
};
var copiedTile = 0;
var dungeonImages;
var floorImages;
var mapTiles = 
        [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

var tileWidth = 0;

// Key down
var keyDown = function(event) {
    // "Enter" pressed
    if(event.charCode === 13) {
        printMap();
    // "C" pressed
    } else if(event.charCode === 99) {
        copyTile();
    // "V" pressed
    } else if(event.charCode === 118) {
        pasteTile();
    // "S" pressed
    } else if(event.charCode === 115) {
        minusTile();
    // "W" pressed
    } else if(event.charCode === 119) {
        plusTile();
    // Unbound key pressed
    } else {
        console.log("Unused key: " + event.charCode);
    }
};

// Minus tile
function minusTile() {
    mapTiles[selectedTile.row][selectedTile.column] -= 1;
    if(mapTiles[selectedTile.row][selectedTile.column] < 0) {
        mapTiles[selectedTile.row][selectedTile.column] = 27;
    }
    requestAnimationFrame(update);
};

// Plus tile
function plusTile() {
    mapTiles[selectedTile.row][selectedTile.column] += 1;
    if(mapTiles[selectedTile.row][selectedTile.column] > 27) {
        mapTiles[selectedTile.row][selectedTile.column] = 0;
    }
    requestAnimationFrame(update);
};

// Paste tile
function pasteTile() {
    mapTiles[selectedTile.row][selectedTile.column] = copiedTile;
    requestAnimationFrame(update);
};

// Copy tile
function copyTile() {
    copiedTile = mapTiles[selectedTile.row][selectedTile.column];
};

// Mouse down
var mouseDown = function(event) {
    var previousSelectedTile = {
        row: selectedTile.row,
        column: selectedTile.column
    };
    selectedTile.row = Math.floor(event.y / tileWidth);
    selectedTile.column = Math.floor(event.x / tileWidth);
    if(selectedTile.column === previousSelectedTile.column
            && selectedTile.row === previousSelectedTile.row) {
        mapTiles[selectedTile.row][selectedTile.column] += 1;
    }
    requestAnimationFrame(update);
};

// Prints the current mapTiles to the console
function printMap() {
    console.log("[");
    for(row = 0; row < mapTiles.length; row++) {
        console.log("[" + mapTiles[row] + "],");
    }
    console.log("]");
};

// Loads the tiles
function imageLoader() {
    dungeonImages = [];
    for(index = 0; index < 13; index++) {
        dungeonImages[index] = new Image();
        dungeonImages[index].src = "tiles/dungeon/" + index + ".png";
    }
    floorImages = [];
    for(index = 0; index < 15; index++) {
        floorImages[index] = new Image();
        floorImages[index].src = "tiles/floor/" + index + ".png";
    }
};

// Takes the an image map number and returns an image
function tileNum(num) {
    if(num < 13) {
        return dungeonImages[num];
    } else if(num < 28) {
        return floorImages[num - 13];
    }
};

// Constructor for an image that can be drawn with the draw function
var sprite = function(newX, newY, newWidth, newHeight, newSource) {
    // x, y, width, height, source
    this.x = newX;
    this.y = newY;
    this.width = newWidth;
    this.height = newHeight;
    this.image = new Image();
    this.image.src = newSource;
    this.frame = 0;
    this.animation = 0;
};

// Constructor for an object that can be drawn with the draw function
var rectangle = function(newX, newY, newWidth, newHeight, newColor) {
    // x, y, width, height, color
    this.x = newX;
    this.y = newY;
    this.width = newWidth;
    this.height = newHeight;
    this.color = newColor;
 };

// Sets the landscape variable based on avaible 16:9 space
var orient = function(){
    if((window.innerWidth / 16) * 9 <= window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = (canvas.width / 16) * 9;
        landscape = false;
        console.log("Set to portrait"); // DEBUG
        tileWidth = canvas.width / 32;
    } else {
        canvas.width = (window.innerHeight / 9) * 16;
        canvas.height = window.innerHeight;
        landscape = true;
        console.log("Set to landscape"); // DEBUG
        tileWidth = canvas.width / 18;
    }
};

// Called to redraw every object in mapObjects
var update = function() {
    // x, y, width, height
    if(timeSinceLastFrame > 0) {
        timeSinceLastFrame = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "red";
        context.fillRect((selectedTile.column * tileWidth) - (tileWidth * 0.05), 
                (selectedTile.row * tileWidth) - (tileWidth * 0.05), 
                tileWidth * 1.05, tileWidth * 1.05);
        context.fillStyle = "black";
        for(row = 0; row < 18; row++) {
            for(column = 0; column < 32; column++) {
                if(mapTiles[row][column] === 0) {
                    // x, y, width, height
                    context.fillRect(column * tileWidth, row * tileWidth, 
                            tileWidth * 0.95, tileWidth * 0.95);
                } else {
                    context.drawImage(tileNum(mapTiles[row][column]), 
                            column * tileWidth, row * tileWidth, 
                            tileWidth, tileWidth);
                }
            }
        }
        for(index = 0; index < mapObjects.length; index++) {
            if(mapObjects[index] instanceof sprite) {
                // image, frameX, frameY, frameWidth, frameHeight,
                //      x, y, width, height
                context.drawImage(mapObjects[index].image,
                        mapObjects[index].frame * mapObjects[index].width,
                        mapObjects[index].animation * mapObjects[index].height,
                        mapObjects[index].width, mapObjects[index].height,
                        mapObjects[index].x, mapObjects[index].y,
                        mapObjects[index].width, mapObjects[index].height);
            } else {
                context.fillStyle = mapObjects[index].color;
                // x, y, width, height
                context.fillRect(mapObjects[index].x, mapObjects[index].y,
                        mapObjects[index].width, mapObjects[index].height);
            }
        }
    }
};

// Updates timeSinceLastFrame every 1000/60 ms
var lastFrameTimer = function() {
    setInterval(function() {
        timeSinceLastFrame += 1;
    },
    1000/60);
};
    
// At load time
window.onload = function() {
    lastFrameTimer();
    orient();
    
    square = new rectangle(50, 50, 10, 10, "yellow");
    mapObjects.push(square);
    
    // DEBUG rectangle
    var currentInterval = window.setInterval(function() {
        square.x += 10;
        requestAnimationFrame(update);
        if(square.x > canvas.width) {
            clearInterval(currentInterval);
        }
    },
    1000/60);
    
    // Map
    imageLoader();
    
    // Mouse
    canvas.addEventListener("mousedown", mouseDown);
    window.addEventListener("keypress", keyDown);
};