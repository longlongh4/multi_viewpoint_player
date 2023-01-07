function setStatus(message) {
  console.log(message);
}

const canvas = document.getElementById("player").transferControlToOffscreen();
const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});
worker.addEventListener("message", setStatus);

worker.postMessage(["init", canvas], [canvas]);

document.addEventListener("mousedown", (event) => {
  worker.postMessage(["mousedown", null]);
});
document.addEventListener("mouseup", (event) => {
  worker.postMessage(["mouseup", null]);
});
