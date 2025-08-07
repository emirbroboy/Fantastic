const btn = document.getElementById('playBTN')
const mp3 = document.getElementById('mp3')
const progressbar = document.querySelector('.progress_container')
const progress = document.querySelector('.progress')
btn.addEventListener('click' , () => {
    if (btn.classList.contains('play')) {
    
        icon.setAttribute('d', 'M6 4h4v16H6zM14 4h4v16h-4z'); 
        btn.classList.remove('play');
        btn.classList.add('pause');
        mp3.play();
    } else {
        
        icon.setAttribute('d', 'M8 5v14l11-7z'); 
        btn.classList.remove('pause');
        btn.classList.add('play');
        mp3.pause();
    }
    
})
mp3.addEventListener('ended', () => {
    btn.textContent = "▶";
    btn.classList.remove("pause");
    btn.classList.add("play");
});
mp3.addEventListener('timeupdate', () => {
    const percent = (mp3.currentTime / mp3.duration) * 100
    progress.style.width = `${percent}%`
});
progressbar.addEventListener('click', (e) => {
    const rect = progressbar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newTime = (x / rect.width) * mp3.duration
    mp3.currentTime = newTime
})
const lines = [
  { start: 0.000, end: 27.090, text: "Fantastic music playing" },
  { start: 27.090, end: 30.130, text: "Ooh" },
  { start: 30.130, end: 33.057, text: "(Ball, Ball, Ball ing, ing)" },
  { start: 33.057, end: 37.339, text: "(Ball, Ball, Ball ing, ing)" },
  { start: 37.339, end: 42.089, text: "Ooh" },
  { start: 42.089, end: 44.890, text: "(Ball, Ball, Ball ing, ing)" },
  { start: 44.890, end: 48.723, text: "(Ball, Ball, Ball ing, ing)" },
  { start: 48.723, end: 50.410, text: "Yeah" },
  { start: 50.410, end: 52.617, text: 'My granny called, she said, "Travvy, you work too hard' },
  { start: 52.617, end: 53.893, text: "I'm worried you forget about me\"" },
  { start: 53.893, end: 57.108, text: "(Ball, Ball, Ball)" },
  { start: 57.108, end: 60.000, text: "I'm falling in and out of clouds, don't worry, I'ma get it, Granny, uh" }
];
const lyricsContainer = document.getElementById(`lyric_container`);
const lyrics = document.getElementById(`lyrics_text`);
const textIn = document.getElementById('text_in');

let lastIndex = -1;
let lastAddedIndex = -1;
let lastTime = 0;

mp3.addEventListener('timeupdate', () => {
    const currentTime = mp3.currentTime;
    const currentIndex = lines.findIndex(line => currentTime >= line.start && currentTime <= line.end);

    // Если перемотка назад или вперед слишком далеко — сброс
    if (
        currentTime < lastTime ||                  // перемотка назад
        currentIndex < lastIndex ||                // возвращаемся к более ранней строке
        currentIndex > lastAddedIndex + 1          // перемотка вперед через много строк
    ) {
        textIn.innerHTML = '';
        lastIndex = -1;
        lastAddedIndex = -1;

        if (currentIndex !== -1) {
            const nextLines = lines.slice(currentIndex, currentIndex + 3);
            nextLines.forEach((line, i) => {
                const div = document.createElement('div');
                div.textContent = line.text;
                div.classList.add('line', i === 0 ? 'current' : 'next');
                textIn.appendChild(div);
            });
            lastIndex = currentIndex;
            lastAddedIndex = currentIndex + 2;
        }

        lastTime = currentTime;
        return;
    }

    lastTime = currentTime;

    if (currentIndex === -1 || currentIndex === lastIndex) return;
    lastIndex = currentIndex;

    const existingLines = Array.from(textIn.children);

    // Если строк нет (например, после сброса), просто добавляем начальные 3
    if (existingLines.length === 0) {
        const nextLines = lines.slice(currentIndex, currentIndex + 3);
        nextLines.forEach((line, i) => {
            const div = document.createElement('div');
            div.textContent = line.text;
            div.classList.add('line', i === 0 ? 'current' : 'next');
            textIn.appendChild(div);
        });
        lastAddedIndex = currentIndex + 2;
        return;
    }

    // Анимация ухода вверх первой строки
    const firstLine = existingLines[0];
    if (firstLine) {
        firstLine.classList.add('exit');
    }

    setTimeout(() => {
        if (firstLine) firstLine.remove();

        // Обновляем классы: первая — current, остальные — next
        const updated = Array.from(textIn.children);
        updated.forEach((line, i) => {
            line.classList.remove('current', 'next');
            line.classList.add(i === 0 ? 'current' : 'next');
        });
    }, 400);

    // Добавляем следующую строку снизу
    const nextIndex = lastAddedIndex + 1;
    if (nextIndex < lines.length) {
        const div = document.createElement('div');
        div.textContent = lines[nextIndex].text;
        div.classList.add('line', 'next');
        textIn.appendChild(div);
        lastAddedIndex = nextIndex;
    }
});




