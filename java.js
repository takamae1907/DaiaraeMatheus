document.addEventListener('DOMContentLoaded', () => {
    // Elementos do player
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const playIcon = playBtn.querySelector('i');

    // Elementos de informação da música
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');

    // Elementos da barra de progresso
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    // Variáveis de estado
    let isPlaying = false;
    let isFirstPlay = true; // Controla o primeiro clique

    // Função para tocar ou pausar a música
    function togglePlay() {
        // 1. Verifica se é o primeiro clique do usuário
        if (isFirstPlay) {
            const startTime = 3;
            if (startTime < audioPlayer.duration) {
                audioPlayer.currentTime = startTime;
            }
            isFirstPlay = false; // Após o primeiro clique, esta condição não será mais verdadeira
        }

        // 2. Inverte o estado de play/pause
        isPlaying = !isPlaying;

        if (isPlaying) {
            audioPlayer.play();
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        } else {
            audioPlayer.pause();
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
    }

    // Função para formatar o tempo de segundos para MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Função para atualizar a barra de progresso e o tempo
    function updateProgress() {
        const { duration, currentTime } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }

    // Função para definir o progresso ao clicar na barra
    function setProgress(event) {
        const width = this.clientWidth;
        const clickX = event.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
        
        // Se o usuário clicar na barra, consideramos que não é mais o "primeiro play"
        isFirstPlay = false; 
    }

    // Event Listeners
    playBtn.addEventListener('click', togglePlay);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);

    // Apenas atualiza a duração total quando os metadados do áudio carregam
    audioPlayer.addEventListener('loadedmetadata', () => {
        if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
            totalDurationEl.textContent = formatTime(audioPlayer.duration);
        }
    });

    // Quando a música terminar, reseta o player para o estado inicial
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        isFirstPlay = true; // Permite que, ao tocar de novo, a música comece em 3s
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    });
});