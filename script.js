(() => {
    // منع تشغيل نفس السكربت أكثر من مرة
    if (document.documentElement.dataset.catchGameLoaded === 'true') {
        return;
    }

    document.documentElement.dataset.catchGameLoaded = 'true';

    function initGame() {
        const gameContainer = document.querySelector('.game-container');
        const basket = document.getElementById('basket');
        const scoreDisplay = document.getElementById('score');
        const livesDisplay = document.getElementById('lives');
        const gameMessage = document.getElementById('game-message');
        const startBtn = document.getElementById('start-btn');

        // التأكد إن عناصر اللعبة موجودة
        if (
            !gameContainer ||
            !basket ||
            !scoreDisplay ||
            !livesDisplay ||
            !gameMessage ||
            !startBtn
        ) {
            console.error('Game elements are missing from HTML.');
            return;
        }

        let score = 0;
        let lives = 3;
        let basketX = 170;
        let isPlaying = false;
        let gameInterval = null;
        let itemTimer = null;

        // =========================
        // تحريك السلة بالكيبورد
        // =========================
        document.addEventListener('keydown', (e) => {
            if (!isPlaying) return;

            const containerWidth = gameContainer.clientWidth;
            const basketWidth = basket.offsetWidth;
            const maxX = containerWidth - basketWidth;

            if (e.key === 'ArrowLeft') {
                basketX -= 25;
            }

            if (e.key === 'ArrowRight') {
                basketX += 25;
            }

            basketX = Math.max(0, Math.min(basketX, maxX));

            basket.style.left = basketX + 'px';
        });

        // =========================
        // زر بدء اللعبة
        // =========================
        startBtn.addEventListener('click', startGame);

        function startGame() {
            // إيقاف أي لعبة قديمة
            clearInterval(itemTimer);
            clearInterval(gameInterval);

            gameMessage.style.display = 'none';

            score = 0;
            lives = 3;
            basketX = 170;
            isPlaying = true;

            scoreDisplay.textContent = score;
            livesDisplay.textContent = '❤️❤️❤️';

            basket.style.left = basketX + 'px';

            // تنظيف العناصر القديمة
            document
                .querySelectorAll('.falling-item')
                .forEach(item => item.remove());

            // بدء اللعبة
            itemTimer = setInterval(spawnItem, 800);
            gameInterval = setInterval(updateGame, 20);
        }

        // =========================
        // إنشاء النجوم والصخور
        // =========================
        function spawnItem() {
            if (!isPlaying) return;

            const item = document.createElement('div');
            item.classList.add('falling-item');

            const isRock = Math.random() < 0.3;

            item.textContent = isRock ? '🪨' : '⭐';
            item.dataset.type = isRock ? 'rock' : 'star';

            const maxX = gameContainer.clientWidth - 40;
            const randomX = Math.floor(Math.random() * Math.max(maxX, 1));

            item.style.left = randomX + 'px';

            const duration = Math.random() * 1.5 + 1.5;

            item.style.animationDuration = duration + 's';

            gameContainer.appendChild(item);

            setTimeout(() => {
                if (item.parentNode) {
                    item.remove();
                }
            }, duration * 1000);
        }

        // =========================
        // تحديث اللعبة
        // =========================
        function updateGame() {
            if (!isPlaying) return;

            const fallingItems =
                document.querySelectorAll('.falling-item');

            const basketRect = basket.getBoundingClientRect();

            fallingItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();

                const collision =
                    itemRect.bottom >= basketRect.top &&
                    itemRect.top <= basketRect.bottom &&
                    itemRect.right >= basketRect.left &&
                    itemRect.left <= basketRect.right;

                if (!collision) return;

                const type = item.dataset.type;

                item.remove();

                if (type === 'star') {
                    score += 10;
                    scoreDisplay.textContent = score;
                } else {
                    lives--;

                    updateLivesDisplay();

                    if (lives <= 0) {
                        endGame();
                    }
                }
            });
        }

        // =========================
        // تحديث القلوب
        // =========================
        function updateLivesDisplay() {
            let hearts = '';

            for (let i = 0; i < lives; i++) {
                hearts += '❤️';
            }

            livesDisplay.textContent = hearts;
        }

        // =========================
        // نهاية اللعبة
        // =========================
        function endGame() {
            isPlaying = false;

            clearInterval(itemTimer);
            clearInterval(gameInterval);

            itemTimer = null;
            gameInterval = null;

            gameMessage.style.display = 'flex';

            const title = gameMessage.querySelector('h1');
            const message = gameMessage.querySelector('p');

            if (title) {
                title.textContent = 'انتهت اللعبة! 🎮';
            }

            if (message) {
                message.textContent = `جيبت مجموع نقاط: ${score}`;
            }

            startBtn.textContent = 'العب مرة أخرى';
        }
    }

    // تشغيل اللعبة بعد تحميل الـHTML
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame, {
            once: true
        });
    } else {
        initGame();
    }
})();