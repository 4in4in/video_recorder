// const socket = io('https://mycandidate.onti.actcognitive.org', { path: '/interview_client/socket.io' }); /// запуск на сервере
const socket = io('/'); /// локальный запуск

const videoElement = document.getElementById('main-video');
const constraints = { video: true, audio: true };

const currentTimestamp = new Date().valueOf().toString();

function getVideoStream() {
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => { 
                videoElement.srcObject = stream;
                videoElement.addEventListener('loadedmetadata', () => {
                    videoElement.play();
                    recordVideo(stream);
                });
            })
            .catch((error) => {
                console.log(error);
                alert('Устройство видеозаписи недоступно');
            });
    }
}

function recordVideo (stream) {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(CHUNK_TIME);

    mediaRecorder.ondataavailable = function(e) {
        if (e.data && e.data.size > 0) {
            const filename = CANDIDATE_ID + ' ' + currentTimestamp;
            socket.emit('recorded-chunk', {
                filename: filename,
                chunk: e.data
            });
        }
    }
}