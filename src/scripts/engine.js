// --- Estado do Jogo (State) ---
const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        livesLeft: document.querySelector("#lives-left"),
        gameOverScreen: document.querySelector(".game-over"), 
        finalScore: document.querySelector("#final-score"), 
        restartButton: document.querySelector("#restart-button"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};

const hitSound = new Audio("./src/audios/hit.m4a");
hitSound.volume = 0.2;

// --- Funções Principais do Jogo ---

function gameOver() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    state.view.finalScore.textContent = state.values.result;
    state.view.gameOverScreen.style.display = 'flex';
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        gameOver();
    }
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (state.values.hitPosition === null) return; // Previne múltiplos acertos/erros no mesmo inimigo

            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                playSound(hitSound);
                square.classList.remove("enemy"); // Remove o inimigo imediatamente após o acerto
                state.values.hitPosition = null;
            } else {
                state.values.lives--;
                state.view.livesLeft.textContent = "x" + state.values.lives;
                playSound(missSound);
                if (state.values.lives <= 0) {
                    gameOver();
                }
            }
        });
    });
}

function initialize() {
    // Esconde a tela de Game Over
    state.view.gameOverScreen.style.display = 'none';

    // Reseta os valores
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.lives = 3;
    state.values.gameVelocity = 1000;
    
    // Atualiza a view
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.livesLeft.textContent = "x" + state.values.lives;
    
    // Inicia os processos do jogo
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}


// --- Inicialização ---
function main() {
    addListenerHitBox();
    initialize();

    state.view.restartButton.addEventListener('click', () => {
        initialize();
    });
}

main();