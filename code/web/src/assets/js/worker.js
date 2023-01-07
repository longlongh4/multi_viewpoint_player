const utils = require("./utils");
const Canvas2DRenderer = require("./renderer").Canvas2DRenderer;
const parseHeader = require("./parse_header").parseHeader;

let context = {
  mediaUrl: "http://localhost:8080/out.mvv",
  headerSize: 0,
  mvvIndex: null,
  renderer: null,
  players: [],
  currentPlayerIndex: 3,
};

let timer = {
  elapsed: 0,
};

class Player {
  constructor(cameraIndex) {
    this.cameraIndex = cameraIndex;
    this.camera = context.mvvIndex.cameras[cameraIndex];
    this.fetchControl = new AbortController();
    this.decodedFrames = [];
    this.decoder = null;
  }

  // secondIndex: start at which second in time
  async loadCamera(secondIndex) {
    let decodedFrames = this.decodedFrames;
    this.decoder = new VideoDecoder({
      output(frame) {
        decodedFrames.push(frame);
        requestAnimationFrame(renderAnimationFrame);
      },
      error(e) {
        console.log(e);
      },
    });
    this.decoder.configure({
      codec: "av01.0.01M.08",
      codedWidth: 854,
      codedHeight: 480,
    });
    let cameraStartOffset = (cameraIndex, secondIndex) => {
      let camera = context.mvvIndex.cameras[cameraIndex];
      return (
        camera.frames[secondIndex * camera.framerate].offset +
        context.headerSize
      );
    };

    let byteRange =
      this.cameraIndex === context.mvvIndex.camera_count - 1
        ? `${cameraStartOffset(this.cameraIndex, secondIndex)}-`
        : `${cameraStartOffset(this.cameraIndex, secondIndex)}-${
            cameraStartOffset(this.cameraIndex + 1, 0) - 1
          }`;
    let response = await fetch(context.mediaUrl, {
      headers: {
        range: byteRange,
      },
      signal: this.fetchControl.signal,
    });
    let pendingFrames = this.camera.frames.slice(
      secondIndex * this.camera.framerate
    );
    const reader = response.body.getReader();
    let result = await reader.read();
    let buffer = new Uint8Array();
    while (!result.done) {
      buffer = utils.joinBuffer(buffer, result.value);
      buffer = this.decodeFramesFromBuffer(pendingFrames, buffer);
      result = await reader.read();
    }
  }

  decodeFramesFromBuffer(pendingFrames, buffer) {
    let offset = 0;
    while (
      pendingFrames.length > 0 &&
      pendingFrames[0].size + offset <= buffer.length
    ) {
      const frame = pendingFrames.shift();
      if (frame.keyframe) {
        this.decoder.flush();
      }
      const encodedVideoChunk = new EncodedVideoChunk({
        type: frame.keyframe ? "key" : "delta",
        timestamp: (frame.timestamp / 24) * 1000,
        duration: (1 / 24) * 1000,
        data: buffer.slice(offset, offset + frame.size),
      });
      this.decoder.decode(encodedVideoChunk);
      offset += frame.size;
    }
    if (pendingFrames.length === 0) {
      this.decoder.flush();
    }
    return buffer.slice(offset);
  }
}

let lastRenderedFrame = {
  cameraIndex: -1,
  timestamp: -1,
};

function renderAnimationFrame() {
  let decodedFrames = context.players[context.currentPlayerIndex].decodedFrames;
  if (decodedFrames.length > 0) {
    for (let i = 0; i < 9; i++) {
      const tmpDecodedFrames = context.players[i].decodedFrames;
      while (
        tmpDecodedFrames.length > 0 &&
        tmpDecodedFrames[0].timestamp <= timer.elapsed - 41.6
      ) {
        const frame = tmpDecodedFrames.shift();
        frame.close();
      }
    }

    if (
      decodedFrames.length > 0 &&
      decodedFrames[0].timestamp <= timer.elapsed
    ) {
      const frame = decodedFrames[0];
      if (
        lastRenderedFrame.cameraIndex === context.currentPlayerIndex &&
        lastRenderedFrame.timestamp === frame.timestamp
      ) {
      } else {
        lastRenderedFrame = {
          cameraIndex: context.currentPlayerIndex,
          timestamp: frame.timestamp,
        };
        context.renderer.draw(frame);
      }
    }
    requestAnimationFrame(renderAnimationFrame);
  }
}

self.addEventListener("message", (message) => {
  let [command, value] = message.data;
  switch (command) {
    case "init":
      let canvas = value;
      context.renderer = new Canvas2DRenderer(canvas);
      parseHeader(context.mediaUrl).then(([size, index]) => {
        context.headerSize = size;
        context.mvvIndex = index;
        for (let i = 0; i < 9; i++) {
          let player = new Player(i);
          context.players.push(player);
          player.loadCamera(0);
        }
      });
      break;
    case "switchplayer":
      context.currentPlayerIndex = value;
      break;
    case "update":
      timer.elapsed = value;
      break;
    default:
      break;
  }
});
