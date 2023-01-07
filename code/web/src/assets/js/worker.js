const utils = require("./utils");
const Canvas2DRenderer = require("./renderer").Canvas2DRenderer;
const parseHeader = require("./parse_header").parseHeader;

let headerSize = 0;
let mvvIndex = null;
let decodedFrames = [];

const mediaUrl = "http://localhost:8080/out.mvv";

let renderer = null;

function renderAnimationFrame() {
  if (decodedFrames.length > 0) {
    const frame = decodedFrames.shift();
    renderer.draw(frame);
    requestAnimationFrame(renderAnimationFrame);
  }
}
// Set up a VideoDecoer.
const decoder = new VideoDecoder({
  output(frame) {
    decodedFrames.push(frame);
    requestAnimationFrame(renderAnimationFrame);
  },
  error(e) {
    console.log(e);
  },
});

function configDecoder() {
  decoder.configure({
    codec: "av01.0.01M.08",
    codedWidth: 854,
    codedHeight: 480,
  });
}

function decodeFramesFromBuffer(pendingFrames, buffer) {
  let offset = 0;
  while (
    pendingFrames.length > 0 &&
    pendingFrames[0].size + offset <= buffer.length
  ) {
    const frame = pendingFrames.shift();
    if (frame.keyframe) {
      decoder.flush();
    }
    const encodedVideoChunk = new EncodedVideoChunk({
      type: frame.keyframe ? "key" : "delta",
      timestamp: (frame.timestamp / 24) * 1000,
      duration: (1 / 24) * 1000,
      data: buffer.slice(offset, offset + frame.size),
    });
    decoder.decode(encodedVideoChunk);
    offset += frame.size;
  }
  if (pendingFrames.length === 0) {
    decoder.flush();
  }
  return buffer.slice(offset);
}

// secondIndex: start at which second in time
async function loadCamera(cameraIndex, secondIndex) {
  console.log(mvvIndex);
  let camera = mvvIndex.cameras[cameraIndex];
  let cameraStartOffset = (cameraIndex, secondIndex) => {
    let camera = mvvIndex.cameras[cameraIndex];
    return camera.frames[secondIndex * camera.framerate].offset + headerSize;
  };
  let byteRange =
    cameraIndex === mvvIndex.camera_count - 1
      ? `${cameraStartOffset(cameraIndex, secondIndex)}-`
      : `${cameraStartOffset(cameraIndex, secondIndex)}-${
          cameraStartOffset(cameraIndex + 1, 0) - 1
        }`;
  let response = await fetch(mediaUrl, {
    headers: {
      range: byteRange,
    },
  });
  let pendingFrames = camera.frames.slice(secondIndex * camera.framerate);
  const reader = response.body.getReader();
  let result = await reader.read();
  let buffer = new Uint8Array();
  while (!result.done) {
    buffer = utils.joinBuffer(buffer, result.value);
    buffer = decodeFramesFromBuffer(pendingFrames, buffer);
    result = await reader.read();
  }
}

self.addEventListener("message", (message) => {
  let canvas = message.data;
  renderer = new Canvas2DRenderer(canvas);
  parseHeader(mediaUrl).then(([size, index]) => {
    headerSize = size;
    mvvIndex = index;
    configDecoder();
    loadCamera(0, 0);
  });
});
