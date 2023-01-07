const Parser = require("binary-parser").Parser;
const MvvIndex = require("./mvv_index").Index;
const Pbf = require("pbf");
const utils = require("./utils");

export async function parseHeader(mediaUrl) {
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
      return [headerSize, mvvIndex];
    }
    result = await reader.read();
  }
}
