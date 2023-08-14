import { AudioMimeType, SniffAudioExt,BytesHasPrefix } from './common';
import { RAWDecryptor } from './rawDecryptor';
const MagicHeader = [
    0x79, 0x65, 0x65, 0x6C, 0x69, 0x6F, 0x6E, 0x2D,
    0x6B, 0x75, 0x77, 0x6F, 0x2D, 0x74, 0x6D, 0x65,
];
const MagicHeader2 = [
    0x79, 0x65, 0x65, 0x6C, 0x69, 0x6F, 0x6E, 0x2D,
    0x6B, 0x75, 0x77, 0x6F, 0x00, 0x00, 0x00, 0x00,
];
const PreDefinedKey = 'MoOtOiTvINGwd2E6n0E1i7L5t2IoOoNk';
export async function KWMDecryptor(u8a){
    if (!BytesHasPrefix(u8a, MagicHeader) && !BytesHasPrefix(u8a, MagicHeader2)) {
        if (SniffAudioExt(u8a) === 'aac') {
          return await RAWDecryptor(u8a, 'aac', false);
        }
        return -3;
    }
    let fileKey = u8a.slice(0x18, 0x20);
    let mask = createMaskFromKey(fileKey);
    let audioData = u8a.slice(0x400);
    let lenAudioData = audioData.length;
    for (let cur = 0; cur < lenAudioData; ++cur) audioData[cur] ^= mask[cur % 0x20];
    const ext = SniffAudioExt(audioData);
    const mime = AudioMimeType[ext];
    return {data:audioData,mime:mime,ext:ext}
}
function createMaskFromKey(keyBytes) {
    let keyView = new DataView(keyBytes.buffer);
    let keyStr = keyView.getBigUint64(0, true).toString();
    let keyStrTrim = trimKey(keyStr);
    let key = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      key[i] = PreDefinedKey.charCodeAt(i) ^ keyStrTrim.charCodeAt(i);
    }
    return key;
  }
  
function trimKey(keyRaw){
    let lenRaw = keyRaw.length;
    let out = keyRaw;
    if (lenRaw > 32) {
      out = keyRaw.slice(0, 32);
    } else if (lenRaw < 32) {
      out = keyRaw.padEnd(32, keyRaw);
    }
    return out;
  }