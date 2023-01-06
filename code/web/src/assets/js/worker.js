const Parser = require("binary-parser").Parser;
const MvvIndex = require("./mvv_index").Index;
const Pbf = require("pbf");
const utils = require("./utils");

async function parseHeader() {
  const parser = new Parser()
    .endianness("little")
    .array("magic", { type: "uint8", length: 4 })
    .uint16("version")
    .uint32("len_index_body");

  const response = await fetch("http://127.0.0.1:8080/out.mvv");
  const reader = response.body.getReader();
  let result = await reader.read();
  let buffer = new Uint8Array();
  let getFileHeader = false;
  let fileHeader = null;
  let headerSize = 0;
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

self.addEventListener("message", (message) => {
  parseHeader().then((mvvIndex) => console.log(mvvIndex, "===="));
});
