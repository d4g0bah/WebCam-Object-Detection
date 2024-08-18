const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusElement = document.getElementById('status');

let model;

async function setupWebcam() {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    resolve(video);
                };
            })
            .catch(error => {
                reject(error);
            });
    });
}

async function loadModel() {
    model = await cocoSsd.load();
    statusElement.textContent = 'Model loaded. Detecting objects...';
}

async function detectObjects() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const predictions = await model.detect(canvas);

    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = '#00FFFF';
        ctx.font = '18px Arial';
        ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, x, y > 20 ? y - 5 : y + 20);
    });

    requestAnimationFrame(detectObjects);
}

async function run() {
    await setupWebcam();
    await loadModel();
    detectObjects();
}

run();
