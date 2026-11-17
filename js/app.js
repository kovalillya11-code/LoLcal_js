const $ = id => document.getElementById(id);
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const load = (key, def) => {
  const v = localStorage.getItem(key);
  return v === null ? def : JSON.parse(v);
};
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 1 гравця
const showGreeting = () => {
  const name = load('name', '');
  $('greeting').textContent = name ? `Привіт, ${name}!` : '';
};
$('helloBtn').onclick = () => {
  const name = $('nameInput').value.trim();
  if (!name) return;
  save('name', name);
  showGreeting();
};
showGreeting();

// 2 пароль
$('saveSecretBtn').onclick = () => {
  const word = $('secretInput').value.trim();
  const saved = load('secret', null);
  if (saved !== null && word === saved) {
    $('secretMsg').textContent = 'Доступ дозволено!';
  } else {
    save('secret', word);
    $('secretMsg').textContent = 'Секрет збережено.';
  }
};

// 3 Монетки
let coins = load('coins', 0);
const showCoins = () => $('coinsText').textContent = `У вас ${coins} монет`;
$('coinBtn').onclick = () => {
  coins++;
  save('coins', coins);
  showCoins();
};
showCoins();

// 4 персонажа
const showHero = () => {
  const hero = load('hero', '');
  $('heroText').textContent = hero ? `Ваш герой: ${hero}` : '';
};
document.querySelectorAll('.hero').forEach(btn => {
  btn.onclick = () => {
    save('hero', btn.dataset.hero);
    showHero();
  };
});
showHero();

// 5 Колір фону
const applyColor = color => document.body.style.backgroundColor = color;
applyColor(load('bgColor', '#ffffff'));
document.querySelectorAll('.color').forEach(btn => {
  btn.onclick = () => {
    save('bgColor', btn.dataset.color);
    applyColor(btn.dataset.color);
  };
});

// 6 холодильник
$('note').value = load('note', '');
$('attachBtn').onclick = () => save('note', $('note').value);
$('clearNoteBtn').onclick = () => {
  localStorage.removeItem('note');
  $('note').value = '';
};

// 7 гравця
let player = load('player', { name: 'Олексій', level: 1 });
save('player', player);
const showPlayer = () => {
  $('profile').textContent = `Ім'я: ${player.name}, рівень: ${player.level}`;
};
$('levelUpBtn').onclick = () => {
  player.level++;
  save('player', player);
  showPlayer();
};
showPlayer();

// 8 Інвентар
let inventory = load('inventory', []);
const showInventory = () => {
  const list = $('inventory');
  list.innerHTML = '';
  inventory.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
};
document.querySelectorAll('.item').forEach(btn => {
  btn.onclick = () => {
    inventory.push(btn.dataset.item);
    save('inventory', inventory);
    showInventory();
  };
});
showInventory();

// 9 клік
let target9 = rand(1, 10);
let clicks9 = 0;
$('bestClick').textContent = load('bestClick', '-');
const numBox = $('numButtons');
for (let n = 1; n <= 10; n++) {
  const btn = document.createElement('button');
  btn.textContent = n;
  btn.onclick = () => {
    clicks9++;
    if (n === target9) {
      const best = load('bestClick', null);
      let msg = `Перемога за ${clicks9} спроб!`;
      if (best === null || clicks9 < best) {
        save('bestClick', clicks9);
        $('bestClick').textContent = clicks9;
        msg += ' Новий рекорд!';
      }
      $('clickMsg').textContent = msg;
      target9 = rand(1, 10);
      clicks9 = 0;
    } else {
      $('clickMsg').textContent = 'Не вгадали, спробуйте ще!';
    }
  };
  numBox.appendChild(btn);
}

// 10 Гаряче - Холодно
const LEVELS = {
  easy: { name: 'Легкий', max: 50, limit: null, hotFrac: 0 },
  medium: { name: 'Середній', max: 100, limit: null, hotFrac: 0.1 },
  hard: { name: 'Важкий', max: 500, limit: 12, hotFrac: 0.05 },
  death: { name: 'Смерть', max: 5000, limit: 10, hotFrac: 0.02 },
};

let currentLevel = load('level', 'easy');
let secret10 = 0;
let tries10 = 0;
let bestScore = null;
let gameOver = false;

function showAttempts() {
  const cfg = LEVELS[currentLevel];
  $('attemptsLeft').textContent = cfg.limit
    ? `Залишилось спроб: ${cfg.limit - tries10}`
    : 'Спроби необмежені';
}

function startGame() {
  const cfg = LEVELS[currentLevel];
  $('rangeText').textContent = `Вгадайте число від 1 до ${cfg.max}`;
  $('guessInput').placeholder = `1–${cfg.max}`;
  secret10 = rand(1, cfg.max);
  tries10 = 0;
  gameOver = false;
  bestScore = load('bestScore_' + currentLevel, null);
  $('bestScore').textContent = bestScore ?? '-';
  $('guessInput').max = cfg.max;
  $('guessInput').value = '';
  $('hotMsg').textContent = '';
  showAttempts();
}

$('level').value = currentLevel;
$('level').onchange = () => {
  currentLevel = $('level').value;
  save('level', currentLevel);
  startGame();
};
$('newGameBtn').onclick = startGame;

$('guessBtn').onclick = () => {
  if (gameOver) return;
  const cfg = LEVELS[currentLevel];
  const guess = Number($('guessInput').value);
  if (!guess || guess < 1 || guess > cfg.max) return;
  tries10++;
  showAttempts();

  if (guess === secret10) {
    let msg = `Вгадали за ${tries10} спроб!`;
    if (bestScore === null || tries10 < bestScore) {
      bestScore = tries10;
      save('bestScore_' + currentLevel, bestScore);
      msg += ' Новий рекорд';
    }
    startGame();
    $('bestScore').textContent = bestScore;
    $('hotMsg').textContent = msg;
    return;
  }

  if (cfg.limit && tries10 >= cfg.limit) {
    gameOver = true;
    $('hotMsg').innerHTML = `<span id="loseText">Програли!</span> Число було ${secret10}`;
    return;
  }

  const hotZone = Math.round(cfg.max * cfg.hotFrac);
  const isHot = cfg.hotFrac > 0 && Math.abs(guess - secret10) <= hotZone;
  const direction = guess < secret10 ? 'Більше' : 'Менше';
  if (cfg.hotFrac > 0) {
    $('hotMsg').textContent = (isHot ? 'Гаряче! ' : 'Холодно... ') + direction;
  } else {
    $('hotMsg').textContent = direction;
  }
};

startGame();

// 11 
const RPS_NAMES = { rock: '🗻 Камінь', scissors: '✂ Ножиці', paper: '📄 Папір' };
const RPS_BEATS = { rock: 'scissors', scissors: 'paper', paper: 'rock' };

let rpsScore = load('rpsScore', { wins: 0, losses: 0, draws: 0 });

const showRpsScore = () => {
  $('rpsWins').textContent = rpsScore.wins;
  $('rpsLosses').textContent = rpsScore.losses;
  $('rpsDraws').textContent = rpsScore.draws;
};

document.querySelectorAll('.rps').forEach(btn => {
  btn.onclick = () => {
    const player = btn.dataset.choice;
    const keys = Object.keys(RPS_NAMES);
    const computer = keys[rand(0, keys.length - 1)];

    $('rpsPlayer').textContent = RPS_NAMES[player];
    $('rpsComputer').textContent = RPS_NAMES[computer];

    if (player === computer) {
      rpsScore.draws++;
      $('rpsResult').textContent = 'Нічия!';
    } else if (RPS_BEATS[player] === computer) {
      rpsScore.wins++;
      $('rpsResult').textContent = 'Ви перемогли!';
    } else {
      rpsScore.losses++;
      $('rpsResult').textContent = 'Комп\'ютер переміг.';
    }

    save('rpsScore', rpsScore);
    showRpsScore();
  };
});

showRpsScore();