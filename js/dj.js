(() => {
    const $ = id => document.getElementById(id);

    $('favInput').value = localStorage.getItem('favorite') || '';
    const showFav = () => {
        const fav = localStorage.getItem('favorite');
        $('favResult').textContent = fav ? `Твій вибір: ${fav}` : '';
    };
    $('favSave').onclick = () => {
        const value = $('favInput').value.trim();
        if (!value) return;
        localStorage.setItem('favorite', value);
        showFav();
    };
    showFav();

    let energy = Number(localStorage.getItem('energy') ?? 100);
    const showEnergy = () => {
        $('energyValue').textContent = energy;
        localStorage.setItem('energy', energy);
    };
    $('energySpend').onclick = () => {
        energy = Math.max(0, energy - 10);
        showEnergy();
    };
    $('energyRestore').onclick = () => {
        energy = 100;
        showEnergy();
    };
    showEnergy();

    let shopPlayer = JSON.parse(localStorage.getItem('shopPlayer')) || { coins: 50, skin: 'Звичайний' };
    const saveShop = () => {
        localStorage.setItem('shopPlayer', JSON.stringify(shopPlayer));
        $('shopCoins').textContent = shopPlayer.coins;
        $('shopSkin').textContent = shopPlayer.skin;
    };
    $('buySkin').onclick = () => {
        if (shopPlayer.skin === 'Золотий') {
            alert('Золотий скін уже куплено');
            return;
        }
        if (shopPlayer.coins < 30) {
            alert('Недостатньо монет');
            return;
        }
        shopPlayer.coins -= 30;
        shopPlayer.skin = 'Золотий';
        saveShop();
    };
    saveShop();

    const SECRET_WORD = 'космос';
    let wrongGuesses = JSON.parse(localStorage.getItem('wrongGuesses')) || [];
    const showWrong = () => {
        $('wrongList').innerHTML = '';
        wrongGuesses.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            $('wrongList').appendChild(li);
        });
    };
    $('wrongBtn').onclick = () => {
        const word = $('wrongInput').value.trim().toLowerCase();
        if (!word) return;
        if (word === SECRET_WORD) {
            $('wrongMsg').textContent = 'Вгадали!';
        } else {
            wrongGuesses.push(word);
            localStorage.setItem('wrongGuesses', JSON.stringify(wrongGuesses));
            $('wrongMsg').textContent = 'Не вгадали, спробуйте ще';
            showWrong();
        }
        $('wrongInput').value = '';
    };
    showWrong();

    let secret = Math.floor(Math.random() * 20) + 1;
    let attempts = 0;
    const showRecord = () => {
        $('rangeRecord').textContent = localStorage.getItem('guessRecord') ?? '-';
    };
    $('rangeGuess').onclick = () => {
        const guess = Number($('rangeInput').value);
        if (!guess || guess < 1 || guess > 20) {
            $('rangeMsg').textContent = 'Введіть число від 1 до 20';
            return;
        }
        attempts++;
        $('rangeAttempts').textContent = attempts;

        if (guess === secret) {
            const record = localStorage.getItem('guessRecord');
            $('rangeMsg').textContent = `Вгадали за ${attempts} спроб!`;
            if (record === null || attempts < Number(record)) {
                const hadRecord = record !== null;
                localStorage.setItem('guessRecord', attempts);
                showRecord();
                if (hadRecord) {
                    $('rangeMsg').textContent += ` Новий рекорд: ${attempts} спроб!`;
                }
            }
        } else {
            $('rangeMsg').textContent = guess < secret ? 'Більше' : 'Менше';
        }
    };
    $('rangeNew').onclick = () => {
        secret = Math.floor(Math.random() * 20) + 1;
        attempts = 0;
        $('rangeAttempts').textContent = 0;
        $('rangeMsg').textContent = '';
        $('rangeInput').value = '';
    };
    showRecord();
})();