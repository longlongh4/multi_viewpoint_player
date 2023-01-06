export function joinBuffer(uint8array1, uint8array2) {
  let mergedArray = new Uint8Array(uint8array1.length + uint8array2.length);
  mergedArray.set(uint8array1);
  mergedArray.set(uint8array2, uint8array1.length);
  return mergedArray;
}
