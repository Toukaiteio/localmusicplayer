import { BytesHasPrefix,AudioMimeType,SniffAudioExt } from './common'
import { decryptKgmByteAtOffsetV2, decryptVprByteAtOffset } from '@jixun/kugou-crypto/dist/utils/decryptionHelper';
const VprHeader = [
    0x05, 0x28, 0xBC, 0x96, 0xE9, 0xE4, 0x5A, 0x43,
    0x91, 0xAA, 0xBD, 0xD0, 0x7A, 0xF5, 0x36, 0x31
  ]
const KgmHeader = [
    0x7C, 0xD5, 0x32, 0xEB, 0x86, 0x02, 0x7F, 0x4B,
    0xA8, 0xAF, 0xA6, 0x8E, 0x0F, 0xFF, 0x99, 0x14
  ]
export async function KGMDecryptor(u8a,raw_ext){
    if (raw_ext === 'vpr') {
      if (!BytesHasPrefix(u8a, VprHeader)) return -1;
      } else {
        if (!BytesHasPrefix(u8a, KgmHeader)) return -1;
      }
    let musicDecoded = u8a;
    let bHeaderLen = new DataView(musicDecoded.slice(0x10, 0x14).buffer);
    let headerLen = bHeaderLen.getUint32(0, true);

    let key1 = Array.from(musicDecoded.slice(0x1c, 0x2c));
    key1.push(0);

    musicDecoded = musicDecoded.slice(headerLen);
    let dataLen = musicDecoded.length;

    const decryptByte = raw_ext === 'vpr' ? decryptVprByteAtOffset : decryptKgmByteAtOffsetV2;
    for (let i = 0; i < dataLen; i++) {
      musicDecoded[i] = decryptByte(musicDecoded[i], key1, i);
    }
    const ext = SniffAudioExt(musicDecoded);
    const mime = AudioMimeType[ext];
    return {data:musicDecoded,mime:mime,ext:ext};
    // const _t_URL=URL.createObjectURL(musicBlob);
    
}