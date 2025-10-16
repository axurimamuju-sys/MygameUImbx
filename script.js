const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = { x: 380, y: 480, w: 40, h: 40, speed: 5 };
const enemies = [];
let score = 0;
let lives = 3;
let gameRunning = false;
let interval;

document.getElementById('startBtn').onclick = startGame;
document.getElementById('pauseBtn').onclick = pauseGame;
document.getElementById('restartBtn').onclick = restartGame;

document.addEventListener('keydown', e => {
  if (e.key === 'a' || e.key === 'ArrowLeft') player.x -= player.speed;
  if (e.key === 'd' || e.key === 'ArrowRight') player.x += player.speed;
  if (e.key === 'r') restartGame();
});

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40);
  enemies.push({ x, y: -40, w: 40, h: 40, speed: 3 });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Enemies
  ctx.fillStyle = 'red';
  enemies.forEach((e, i) => {
    e.y += e.speed;
    ctx.fillRect(e.x, e.y, e.w, e.h);

    // Cek tabrakan
    if (e.y + e.h >= player.y &&
        e.x < player.x + player.w &&
        e.x + e.w > player.x) {
      enemies.splice(i, 1);
      lives--;
      updateStats();
      if (lives <= 0) gameOver();
    }

    // Hapus musuh di luar layar
    if (e.y > canvas.height) enemies.splice(i, 1);
  });

  score++;
  updateStats();
}

function updateStats() {
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = lives;
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  document.getElementById('status').textContent = 'Game Running';
  interval = setInterval(() => {
    spawnEnemy();
    update();
  }, 50);
}

function pauseGame() {
  if (!gameRunning) return;
  gameRunning = false;
  clearInterval(interval);
  document.getElementById('status').textContent = 'Paused';
}

function restartGame() {
  score = 0;
  lives = 3;
  enemies.length = 0;
  player.x = 380;
  gameRunning = false;
  clearInterval(interval);
  document.getElementById('status').textContent = 'Restarted — press Start';
  update();
}

function gameOver() {
  gameRunning = false;
  clearInterval(interval);
  document.getElementById('status').textContent = 'Game Over';
}
