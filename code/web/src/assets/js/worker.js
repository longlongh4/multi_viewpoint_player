const Parser = require("binary-parser").Parser;
const MvvIndex = require("./mvv_index").Index;
const Pbf = require("pbf");
const utils = require("./utils");
const Canvas2DRenderer = require("./renderer").Canvas2DRenderer;

let headerSize = 0;
let mvvIndex = null;
let decodedFrames = [];

const mediaUrl = "http://127.0.0.1:8080/out.mvv";

async function parseHeader() {
  const parser = new Parser()
    .endianness("little")
    .array("magic", { type: "uint8", length: 4 })
    .uint16("version")
    .uint32("len_index_body");

  const response = await fetch(mediaUrl);
  const reader = response.body.getReader();
  let result = await reader.read();
  let buffer = new Uint8Array();
  let getFileHeader = false;
  let fileHeader = null;

  while (!result.done) {
    if (!getFileHeader) {
      fileHeader = parser.parse(result.value);
      headerSize = 10 + fileHeader.len_index_body;
      getFileHeader = true;
    }
    buffer = utils.joinBuffer(buffer, result.value);
    if (getFileHeader && buffer.length >= headerSize) {
      let pbf = new Pbf(buffer.slice(10, headerSize));
      let mvvIndex = MvvIndex.read(pbf);
      return mvvIndex;
    }
    result = await reader.read();
  }
}

let renderer = null;
let pendingFrame = null;

function renderAnimationFrame() {
  renderer.draw(pendingFrame);
}

// Set up a VideoDecoer.
const decoder = new VideoDecoder({
  output(frame) {
    pendingFrame = frame;
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
  if (pendingFrame <= 0) {
    return buffer;
  }
  // todo, scan frame list and decode from buffer
}

// secondIndex: start at which second in time
async function loadCamera(cameraIndex, secondIndex) {
  let camera = mvvIndex.cameras[cameraIndex];
  let cameraStartOffset = () => {
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
  //   const reader = response.body.getReader();
  //   let result = await reader.read();
  //   let buffer = new Uint8Array();
  //   while (!result.done) {
  //     console.log(result.value);
  //     decoder.decode(result.value);
  //     buffer = utils.joinBuffer(buffer, result.value);
  //     result = await reader.read();
  //   }
}

self.addEventListener("message", (message) => {
  let canvas = message.data;
  renderer = new Canvas2DRenderer(canvas);
  parseHeader().then((index) => {
    mvvIndex = index;
    configDecoder();
    loadCamera(0, 0);
  });
});
