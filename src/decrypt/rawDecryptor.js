import { AudioMimeType, SniffAudioExt } from './common'
export async function RAWDecryptor(u8a,raw_ext,detect=true){
    let ext = raw_ext;
    if (detect) {
        ext = SniffAudioExt(u8a, raw_ext);
    }
    return {data:u8a,mime:AudioMimeType[ext],ext:ext};
}