// --- script.js (Cleaned) ---

const audioPlayer = document.getElementById('audioPlayer');
const playlistElement = document.getElementById('playlist');
const addFilesInput = document.getElementById('addFilesInput');
const addMusicBtn = document.getElementById('addMusicBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const progressBarContainer = document.getElementById('progress-bar-container');
const currentSongTitle = document.getElementById('currentSongTitle');
const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');

let playlist = [];
let currentSongIndex = -1;
let isPlaying = false;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function updateCurrentSongTitle(title) {
    currentSongTitle.textContent = title || "No song selected";
}

function updatePlaylistActiveClass() {
    const listItems = playlistElement.getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        if (i === currentSongIndex) {
            listItems[i].classList.add('active');
        } else {
            listItems[i].classList.remove('active');
        }
    }
}

function loadAndPlaySong(index) {
    if (index >= 0 && index < playlist.length) {
        currentSongIndex = index;
        const songFile = playlist[currentSongIndex];
        audioPlayer.src = URL.createObjectURL(songFile);
        audioPlayer.play();
        isPlaying = true;
        updatePlayPauseButton();
        updateCurrentSongTitle(songFile.name);
        updatePlaylistActiveClass();
    } else {
        stopMusic();
        updateCurrentSongTitle("No song selected");
        updatePlaylistActiveClass();
    }
}

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        if (currentSongIndex === -1 && playlist.length > 0) {
            loadAndPlaySong(0);
        } else if (audioPlayer.src) {
            audioPlayer.play();
        } else if (playlist.length > 0) {
            loadAndPlaySong(0);
        }
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function playPreviousSong() {
    if (playlist.length === 0) return;

    if (audioPlayer.currentTime < 3 && currentSongIndex > 0) {
        currentSongIndex--;
    } else if (audioPlayer.currentTime >= 3) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        return;
    } else {
        currentSongIndex = playlist.length - 1;
    }
    loadAndPlaySong(currentSongIndex);
}

function playNextSong() {
    if (playlist.length === 0) return;

    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0;
    }
    loadAndPlaySong(currentSongIndex);
}

function stopMusic() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    updatePlayPauseButton();
    updateCurrentSongTitle("No song selected");
    currentTimeElement.textContent = "0:00";
    totalTimeElement.textContent = "0:00";
    progressBar.style.width = '0%';
    currentSongIndex = -1;
    updatePlaylistActiveClass();
}

addMusicBtn.addEventListener('click', () => {
    addFilesInput.click();
});

addFilesInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            playlist.push(files[i]);
            const listItem = document.createElement('li');
            listItem.textContent = files[i].name;
            listItem.addEventListener('click', () => {
                loadAndPlaySong(playlist.indexOf(files[i]));
            });
            playlistElement.appendChild(listItem);
        }
        if (currentSongIndex === -1 && playlist.length > 0) {
             loadAndPlaySong(0);
        }
    }
});

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPreviousSong);
nextBtn.addEventListener('click', playNextSong);

volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value / 100;
});

audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    if (duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
    currentTimeElement.textContent = formatTime(currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeElement.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    playNextSong();
});

progressBarContainer.addEventListener('click', (e) => {
    const clickX = e.clientX - progressBarContainer.getBoundingClientRect().left;
    const containerWidth = progressBarContainer.clientWidth;
    const seekTime = (clickX / containerWidth) * audioPlayer.duration;

    if (!isNaN(seekTime) && isFinite(seekTime)) {
        audioPlayer.currentTime = seekTime;
    }
});

audioPlayer.volume = volumeSlider.value / 100;
updatePlayPauseButton();