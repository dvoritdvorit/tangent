let tileSize = 100;
let gridResolutionX, gridResolutionY;
let drawGridToggle = true;
let tiles;
let modulesA = [];
let modulesB = [];
let modulesC = [];
let modulesD = [];
let activeModuleSet = 'A'; // Current mode: A, B, C, or D
let eraseMode = false; // Track if we're in erase mode

function preload() {
    // Load all 16 SVG modules for each set (00-15)
    for (let i = 0; i < 16; i++) {
        let num = nf(i, 2);
        modulesA[i] = loadImage('data/A_' + num + '.svg');
        modulesB[i] = loadImage('data/B_' + num + '.svg');
        modulesC[i] = loadImage('data/C_' + num + '.svg');
        modulesD[i] = loadImage('data/D_' + num + '.svg');
    }
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');
    cursor(CROSS);
    
    gridResolutionX = Math.floor(width / tileSize) + 2;
    gridResolutionY = Math.floor(height / tileSize) + 2;
    
    // Initialize 2D array with module types
    tiles = [];
    for (let i = 0; i < gridResolutionX; i++) {
        tiles[i] = [];
        for (let j = 0; j < gridResolutionY; j++) {
            tiles[i][j] = '0'; // '0' means empty, 'A'/'B'/'C'/'D' for filled
        }
    }
}

function draw() {
    background(246, 246, 234); // linen
    
    // Check if Option/Alt key is held (for erase)
    eraseMode = keyIsDown(ALT);
    
    if (mouseIsPressed) {
        if (eraseMode) {
            unsetTile();
        } else {
            setTile();
        }
    }
    
    if (drawGridToggle) drawGrid();
    drawModules();
    
    // Show legend in corner
    drawModeIndicator();
}

function setTile() {
    let gridX = Math.floor(mouseX / tileSize) + 1;
    gridX = constrain(gridX, 1, gridResolutionX - 2);
    let gridY = Math.floor(mouseY / tileSize) + 1;
    gridY = constrain(gridY, 1, gridResolutionY - 2);
    tiles[gridX][gridY] = activeModuleSet;
}

function unsetTile() {
    let gridX = Math.floor(mouseX / tileSize) + 1;
    gridX = constrain(gridX, 1, gridResolutionX - 2);
    let gridY = Math.floor(mouseY / tileSize) + 1;
    gridY = constrain(gridY, 1, gridResolutionY - 2);
    tiles[gridX][gridY] = '0';
}

function drawGrid() {
    stroke(0, 0, 0, 50);
    strokeWeight(0.5);
    noFill();
    rectMode(CENTER);
    
    for (let gridY = 0; gridY < gridResolutionY; gridY++) {
        for (let gridX = 0; gridX < gridResolutionX; gridX++) {
            let posX = tileSize * gridX - tileSize / 2;
            let posY = tileSize * gridY - tileSize / 2;
            rect(posX, posY, tileSize, tileSize);
        }
    }
}

function drawModules() {
    imageMode(CENTER);
    
    for (let gridY = 1; gridY < gridResolutionY - 1; gridY++) {
        for (let gridX = 1; gridX < gridResolutionX - 1; gridX++) {
            let currentTile = tiles[gridX][gridY];
            
            if (currentTile !== '0') {
                // Check neighbors to determine which module (0-15)
                let binaryResult = '';
                
                // North
                binaryResult += tiles[gridX][gridY - 1] !== '0' ? '1' : '0';
                // West
                binaryResult += tiles[gridX - 1][gridY] !== '0' ? '1' : '0';
                // South
                binaryResult += tiles[gridX][gridY + 1] !== '0' ? '1' : '0';
                // East
                binaryResult += tiles[gridX + 1][gridY] !== '0' ? '1' : '0';
                
                // Convert binary to decimal (0-15)
                let moduleIndex = parseInt(binaryResult, 2);
                
                let posX = tileSize * gridX - tileSize / 2;
                let posY = tileSize * gridY - tileSize / 2;
                
                // Draw the appropriate SVG module based on tile type
                switch(currentTile) {
                    case 'A':
                        image(modulesA[moduleIndex], posX, posY, tileSize, tileSize);
                        break;
                    case 'B':
                        image(modulesB[moduleIndex], posX, posY, tileSize, tileSize);
                        break;
                    case 'C':
                        image(modulesC[moduleIndex], posX, posY, tileSize, tileSize);
                        break;
                    case 'D':
                        image(modulesD[moduleIndex], posX, posY, tileSize, tileSize);
                        break;
                }
            }
        }
    }
}

function drawModeIndicator() {
    // Show full legend in top-left
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    textFont('Arial Narrow');
    
    let y = 30;
    let x = width - 160;
    let lineHeight = 20;
    
    // MODE section with highlighting
    fill(0, 0, 0);
    text('MODE:', x, y);
    y += lineHeight;
    
    // Highlight current mode in oxblood
    if (activeModuleSet === 'A') fill(75, 34, 52);
    else fill(0, 0, 0);
    text('1 — Round', x, y);
    y += lineHeight;
    
    if (activeModuleSet === 'B') fill(75, 34, 52);
    else fill(0, 0, 0);
    text('2 — Round Twist', x, y);
    y += lineHeight;
    
    if (activeModuleSet === 'C') fill(75, 34, 52);
    else fill(0, 0, 0);
    text('3 — Sharp', x, y);
    y += lineHeight;
    
    if (activeModuleSet === 'D') fill(75, 34, 52);
    else fill(0, 0, 0);
    text('4 — Sharp Twist', x, y);
    y += lineHeight + 10;
    
    // Controls section
    fill(0, 0, 0);
    text('Draw — Drag', x, y);
    y += lineHeight;
    text('Erase — Option + Drag', x, y);
    y += lineHeight;
    text('G — Show Grid', x, y);
    y += lineHeight;
    text('C — Clear', x, y);
}

function keyPressed() {
    // Toggle grid
    if (key === 'g' || key === 'G') {
        drawGridToggle = !drawGridToggle;
    }
    
    // Clear canvas
    if (key === 'c' || key === 'C' || keyCode === BACKSPACE || keyCode === DELETE) {
        for (let i = 0; i < gridResolutionX; i++) {
            for (let j = 0; j < gridResolutionY; j++) {
                tiles[i][j] = '0';
            }
        }
    }
    
    // Switch module sets
    if (key === '1') activeModuleSet = 'A';
    if (key === '2') activeModuleSet = 'B';
    if (key === '3') activeModuleSet = 'C';
    if (key === '4') activeModuleSet = 'D';
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    gridResolutionX = Math.floor(width / tileSize) + 2;
    gridResolutionY = Math.floor(height / tileSize) + 2;
}