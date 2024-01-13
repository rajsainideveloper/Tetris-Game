rendarBlocks();
let levelDownBtn = document.getElementById("levelDown");
let levelUpBtn = document.getElementById("levelUp");
let startBtn = document.getElementById("strtBtn");

let boll = document.createElement("div");
boll.classList.add("boll");

let colLimit = 2;
let isGameStarted = false;
let ID = null;
let speed = 1000;
let level = 1;
const data = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
];

let c1_Limit = 9,
    c2_Limit = 9,
    c3_Limit = 9;

let currentCol = 1; //0,1,2
let currentRow = 0; //0,1,2...9

let currentColor;
let currentColLimit = c2_Limit;
let currentRowLimit = 2;

let score = 0;

const startGame = () => {
    if (!isGameStarted) {
        isGameStarted = true;
        startBtn.disabled = true;
        levelDownBtn.disabled = true;
        levelUpBtn.disabled = true;

        initBoll();
    }
};

const initBoll = () => {
    currentCol = 1;
    currentColor = getColor();
    boll.style.backgroundColor = `${currentColor}`;
    renderBoll();
    ID = setInterval(dropBoll, speed);
};

const renderBoll = () => {
    getCurrentBox().appendChild(boll);
};


const dropBoll = () => {
    if (currentColLimit == currentRow) {
        clearInterval(ID);
        ID = null;
        getCurrentBox().removeChild(boll);
        setData(currentRow, currentCol, currentColor);
        let simType = checkSimilar();
        console.table(data);
        update_col_limit(); // update the column limit inwhich boll droppped.
        setCurrentColLimit();

        
        let fixBoll = document.createElement("div");
        fixBoll.classList.add("boll");
        
        if(simType == 12 || simType == 1 || simType == 2){
            if (currentCol == 0) {
                c1_Limit++;
            } else if (currentCol == 1) {
                c2_Limit++;
            } else if (currentCol == 2) {
                c3_Limit++;
            }
        }
        
        if(simType == 12 || simType == 1 || simType == 2){
            document.getElementById(`${currentColLimit + 1}${currentCol}`).appendChild(fixBoll);
            fixBoll.style.backgroundColor = `${currentColor}`;
        }
                
        currentRow = 0; // to drop boll from top
        currentCol = 1; // to drop boll from center
        setCurrentColLimit(); // reassign current column limit;
        renderGameThroughData();
        if (isGameStarted && c1_Limit >= 0 && c2_Limit >= 0 && c3_Limit >= 0) {
            initBoll();
        } else {
            isGameStarted = false;
            alert(`Game Over! You scored ${score}`);
            window.location.reload();
        }
        return;
    }
    renderGameThroughData();
    renderBoll();
    currentRow++;
    renderBoll();
};

const getColor = () => {
    let color = ["green", "purple","Yellow", "skyblue"];
    return color[Math.floor(Math.random() * 10) % color.length];
};

const setData = (x, y, clr) => {
    data[x][(x, y)] = { color: clr };
};

const update_col_limit = () => {
    if (currentCol == 0) c1_Limit--;
    if (currentCol == 1) c2_Limit--;
    if (currentCol == 2) c3_Limit--;
};

const getCurrentBox = () => {
    return document.getElementById(`${currentRow}${currentCol}`);
};

const setCurrentColLimit = () => {
    if (currentCol == 0) {
        currentColLimit = c1_Limit;
    }
    if (currentCol == 1) {
        currentColLimit = c2_Limit;
    }
    if (currentCol == 2) {
        currentColLimit = c3_Limit;
    }
};

window.onkeydown = (e) => {
    switch (e.key) {
        case "ArrowLeft":
            goLeft();
            break;
        case "ArrowRight":
            goRight();
            break;
        case "ArrowDown":
            goDown();
            break;
    }
};

const isFreeSpace = (x, y) => {
    if (data[x][(x, y)]) return false;
    else return true;
};

const checkSimilar = () => {
    // let ishorizontal = false;
    
    if (horizontalSimilar(currentCol) && verticleSimilar(currentRow)) {
        score += 5;
        console.log("both similar");
        //for horizontal similar
        data.splice(currentRow, 1);
        data.unshift([false, false, false]);
        c1_Limit++; // colmn limit will increase by one.
        c2_Limit++;
        c3_Limit++;
        update_col_limit();
        setCurrentColLimit();
        //for verticle similar
        data[currentRow][(currentRow, currentCol)] = false;
        data[currentRow + 1][(currentRow + 1, currentCol)] = false;
        data[currentRow + 2][(currentRow + 2, currentCol)] = false;
        if (currentCol == 0) {
            c1_Limit += 3;
        } else if (currentCol == 1) {
            c2_Limit += 3;
        } else if (currentCol == 2) {
            c3_Limit += 3;
        }
        update_col_limit();
        setCurrentColLimit();
        return 12;
    } else if (horizontalSimilar(currentCol)) {
        score += 3;
        data.splice(currentRow, 1);
        data.unshift([false, false, false]);
        c1_Limit++; // colmn limit will increase by one.
        c2_Limit++;
        c3_Limit++;
        document.getElementById("score").innerHTML = score;
        update_col_limit();
        setCurrentColLimit();
        return 1;
    } else if (verticleSimilar(currentRow)) {
        score += 3;
        data[currentRow][(currentRow, currentCol)] = false;
        data[currentRow + 1][(currentRow + 1, currentCol)] = false;
        data[currentRow + 2][(currentRow + 2, currentCol)] = false;

        document.getElementById("score").innerHTML = score;
        if (currentCol == 0) {
            c1_Limit += 3;
        } else if (currentCol == 1) {
            c2_Limit += 3;
        } else if (currentCol == 2) {
            c3_Limit += 3;
        }
        update_col_limit();
        setCurrentColLimit();
        return 2;
    }
    return 0;
};

const horizontalSimilar = (col) => {
    let matched = false;
    if (
        col == 0 &&
        isSimilar(currentRow, col + 1) &&
        isSimilar(currentRow, col + 2)
    ) {
        matched = true;
    } else if (
        col == 1 &&
        isSimilar(currentRow, col - 1) &&
        isSimilar(currentRow, col + 1)
    ) {
        matched = true;
    } else if (
        col == 2 &&
        isSimilar(currentRow, col - 1) &&
        isSimilar(currentRow, col - 2)
    ) {
        matched = true;
    }
    return matched;
};

const verticleSimilar = (row) => {
    if (
        row <= 7 &&
        isSimilar(row + 1, currentCol) &&
        isSimilar(row + 2, currentCol)
    ) {
        return true;
    }
    return false;
};

const isSimilar = (x, y) => {
    if (data[x][(x, y)].color === currentColor) return true;
    else return false;
};

const renderGameThroughData = () => {
    rendarBlocks();
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 3; j++) {
            if (data[i][(i, j)].color) {
                let fixBoll = document.createElement("div");
                fixBoll.classList.add("boll");
                fixBoll.style.backgroundColor = `${data[i][(i, j)].color}`;
                document.getElementById(`${i}${j}`).appendChild(fixBoll);
            }
        }
    }
};

function rendarBlocks() {
    let container = document.querySelector(".container");
    container.innerHTML = "";
    //clear the container and rendar default state
    let output = "";
    for (i = 0; i < 10; i++) {
        let op = `<div class="row">`;
        for (j = 0; j < 3; j++) {
            op += `<div class="col" id="${i}${j}"></div>`;
        }
        op += "</div>";
        output += op;
    }
    container.innerHTML = output;
}

function goLeft() {
    if (
        isGameStarted &&
        currentCol > 0 &&
        isFreeSpace(currentRow, currentCol - 1)
    ) {
        currentCol--;
        setCurrentColLimit();
        renderBoll();
    }
}

function goRight() {
    if (
        isGameStarted &&
        currentCol < 2 &&
        isFreeSpace(currentRow, currentCol + 1)
    ) {
        currentCol++;
        setCurrentColLimit();
        renderBoll();
    }
}

function goDown() {
    if (isGameStarted && currentRow < currentColLimit) {
        currentRow++;
        renderBoll();
    }
}
document.getElementById("level").innerHTML = level;

function levelUp() {
    if (!isGameStarted) {
        if (speed >= 200) {
            speed -= 100;
            level++;
        }
        document.getElementById("level").innerHTML = level;
    }
}

function levelDown() {
    if (!isGameStarted) {
        if (speed <= 900) {
            speed += 100;
            level--;
        }
        document.getElementById("level").innerHTML = level;
    }
}
