function setStatus(message) {
  console.log(message);
}

const canvas = document.getElementById("player").transferControlToOffscreen();
const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});
worker.addEventListener("message", setStatus);

worker.postMessage(canvas, [canvas]);
