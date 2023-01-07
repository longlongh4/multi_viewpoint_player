function setStatus(message) {
  console.log(message);
}

const canvas = document.getElementById("player").transferControlToOffscreen();
const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});
worker.addEventListener("message", setStatus);

worker.postMessage(["init", canvas], [canvas]);

let pressedFlag = false;
let pressedXPosition = 0;
let tmpCameraIndex = 5;
let currentPlayerIndex = 5;

document.addEventListener("mousedown", (event) => {
  pressedXPosition = event.clientX;
  pressedFlag = true;
  worker.postMessage(["mousedown", null]);
});
document.addEventListener("mouseup", (event) => {
  pressedFlag = false;
  currentPlayerIndex = tmpCameraIndex;
  worker.postMessage(["mouseup", null]);
});

document.addEventListener("mousemove", (event) => {
  if (pressedFlag) {
    tmpCameraIndex =
      Math.round((event.clientX - pressedXPosition) / 30) + currentPlayerIndex;
    if (tmpCameraIndex > 8) {
      tmpCameraIndex = 8;
    } else if (tmpCameraIndex < 0) {
      tmpCameraIndex = 0;
    }
    worker.postMessage(["switchplayer", tmpCameraIndex]);
  }
});
