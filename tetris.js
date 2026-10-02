const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

context.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] !== 0) {
                arena.splice(y, 1);
                arena.unshift(new Array(arena[y].length).fill(0));
                player.score += rowCount * 10;
                rowCount *= 2;
            }
        }
    }
    scoreElement.innerText = player.score;
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0) {
                const arenaY = y + o.y;
                const arenaX = x + o.x;

                if (arenaY < 0 || arenaY >= arena.length ||
                    arenaX < 0 || arenaX >= arena[0].length) {
                    return true;
                }

                if (arena[arenaY] && arena[arenaY][arenaX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === "I") {
        return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
    } else if (type === "L") {
        return [[0, 2, 0], [0, 2, 0], [0, 2, 2]];
    } else if (type === "J") {
        return [[0, 3, 0], [0, 3, 0], [3, 3, 0]];
    } else if (type === "O") {
        return [[4, 4], [4, 4]];
    } else if (type === "Z") {
        return [[5, 5, 0], [0, 5, 5], [0, 0, 0]];
    } else if (type === "S") {
        return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    } else if (type === "T") {
        return [[0, 7, 0], [7, 7, 7], [0, 0, 0]];
    }
    return [[0]];
}

function draw(time) {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0}, time);
    drawMatrix(player.matrix, player.pos, time);
}

function drawMatrix(matrix, offset, time) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                // Liquid Glass: Translucent fill
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                
                // Liquid Glass: Lensing/Edge highlight (Animated)
                const edgeX = x + offset.x + 0.5 + Math.sin(time / 500 + x) * 0.1;
                const edgeY = y + offset.y + 0.5 + Math.cos(time / 500 + y) * 0.1;
                context.lineWidth = 0.03;
                context.strokeStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time / 1000) * 0.3})`;
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);

                // Liquid Glass: Internal glow/shine (Animated "Liquid" movement)
                const shineX = (x + offset.x + 0.5) + Math.sin(time / 1000 + x) * 0.5;
                const shineY = (y + offset.y + 0.5) + Math.cos(time / 1000 + y) * 0.5;
                const gradient = context.createRadialGradient(
                    shineX, shineY, 0,
                    x + offset.x + 0.5, y + offset.y + 0.5, 0.8
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                context.fillStyle = gradient;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);

                // Liquid Glass: Soft Ambient Lighting (Outer Glow)
                context.shadowBlur = 10;
                context.shadowColor = 'rgba(0, 0, 0, 0.5)';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.shadowBlur = 0;
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        arenaSweep();
        playerReset();
    }
    player.dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = ["T", "J", "L", "O", "Z", "S", "I"];
    const randomIndex = Math.floor(Math.random() * pieces.length);
    player.matrix = createPiece(pieces[randomIndex]);

    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        gameOver();
        return;
    }
}

function gameOver() {
    console.warn("Game Over! Resetting...");
    arena.forEach(row => row.fill(0));
    player.score = 0;
    scoreElement.innerText = player.score;
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[y][x], matrix[x][y]] = [matrix[x][y], matrix[y][x]];
        }
    }
    if (dir > 0) matrix.forEach(row => row.reverse());
    else matrix.reverse();
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 0;
    const matrix = player.matrix;
    rotate(matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += player.pos.x > 0 ? -1 : 1;
        offset += player.pos.x > 0 ? 1 : -1;
    }
}

function update(time = 0) {
    const deltaTime = time - player.lastTime;
    player.dropCounter += deltaTime;
    if (player.dropCounter > 1000) {
        playerDrop();
    }
    player.lastTime = time;
    draw(time);
    requestAnimationFrame(update);
}

const colors = [
    null,
    "rgba(255, 13, 114, 0.6)",  // #FF0D72
    "rgba(12, 194, 255, 0.6)",  // #0DC2FF
    "rgba(13, 255, 114, 0.6)",  // #0DFF72
    "rgba(245, 56, 255, 0.6)",  // #F538FF
    "rgba(255, 142, 13, 0.6)",  // #FF8E0D
    "rgba(255, 225, 56, 0.6)",  // #FFE138
    "rgba(56, 117, 255, 0.6)",  // #3877FF
];

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
    dropCounter: 0,
    dropInterval: 1000,
    lastTime: 0,
};

document.addEventListener("keydown", event => {
    if (event.keyCode === 37) playerMove(-1);
    else if (event.keyCode === 39) playerMove(1);
    else if (event.keyCode === 40) playerDrop();
    else if (event.keyCode === 38) playerRotate(1);
    else if (event.keyCode === 81) playerRotate(-1);
    else if (event.keyCode === 90) playerRotate(1);
});

playerReset();
update();