document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const playButton = document.getElementById('play-button');
    const soundButton = document.getElementById('sound-button');
    const exitButton = document.getElementById('exit-button');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const eatSound = document.getElementById('eat-sound');
    const gameOverSound = document.getElementById('gameover-sound');

    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let direction = 'right';
    let score = 0;
    let isGameOver = false;
    let gameInterval;
    let isSoundOn = true;

    // --- Controles da Tela Inicial ---

    playButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        startGame();
    });

    soundButton.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        soundButton.textContent = `Sound: ${isSoundOn ? 'ON' : 'OFF'}`;
        eatSound.muted = !isSoundOn;
        gameOverSound.muted = !isSoundOn;
    });

    exitButton.addEventListener('click', () => {
        // Em um navegador, não podemos fechar a aba, então apenas voltamos à tela inicial.
        if (confirm("Tem certeza que deseja sair para a tela inicial?")) {
            gameScreen.style.display = 'none';
            startScreen.style.display = 'block';
            if (gameInterval) {
                clearInterval(gameInterval);
            }
        }
    });

    // --- Lógica do Jogo ---

    function startGame() {
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        score = 0;
        scoreElement.textContent = score;
        isGameOver = false;
        generateFood();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 150); // Aumenta a velocidade
    }

    function gameLoop() {
        if (isGameOver) {
            clearInterval(gameInterval);
            if (isSoundOn) gameOverSound.play();
            alert(`Fim de Jogo! Sua pontuação foi: ${score}. Pressione OK para jogar novamente.`);
            startGame();
            return;
        }

        update();
        draw();
    }

    function update() {
        const head = { ...snake[0] }; // Copia a cabeça da cobra

        // Move a cabeça na direção atual
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Verifica colisão com as paredes
        if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
            isGameOver = true;
            return;
        }

        // Verifica colisão com o próprio corpo
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                isGameOver = true;
                return;
            }
        }

        snake.unshift(head); // Adiciona a nova cabeça

        // Verifica se comeu a comida
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            if (isSoundOn) eatSound.play();
            generateFood();
        } else {
            snake.pop(); // Remove a cauda se não comeu
        }
    }

    function draw() {
        // Limpa o canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenha a cobra
        ctx.fillStyle = '#00ff00';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        // Desenha a comida
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
        // Garante que a comida não apareça em cima da cobra
        for (const segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                break;
            }
        }
    }

    // --- Controles do Teclado ---

    document.addEventListener('keydown', e => {
        const key = e.key;
        if (key === 'ArrowUp' && direction !== 'down') direction = 'up';
        if (key === 'ArrowDown' && direction !== 'up') direction = 'down';
        if (key === 'ArrowLeft' && direction !== 'right') direction = 'left';
        if (key === 'ArrowRight' && direction !== 'left') direction = 'right';
    });
});