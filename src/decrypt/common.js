
export const FLAC_HEADER = [0x66, 0x4c, 0x61, 0x43];
export const MP3_HEADER = [0x49, 0x44, 0x33];
export const OGG_HEADER = [0x4f, 0x67, 0x67, 0x53];
export const M4A_HEADER = [0x66, 0x74, 0x79, 0x70];
export const WMA_HEADER = [
0x30, 0x26, 0xb2, 0x75, 0x8e, 0x66, 0xcf, 0x11,
0xa6, 0xd9, 0x00, 0xaa, 0x00, 0x62, 0xce, 0x6c,
];
export const WAV_HEADER = [0x52, 0x49, 0x46, 0x46];
export const AAC_HEADER = [0xff, 0xf1];
export const DFF_HEADER = [0x46, 0x52, 0x4d, 0x38];
export const AudioMimeType={
        mp3: 'audio/mpeg',
        flac: 'audio/flac',
        m4a: 'audio/mp4',
        ogg: 'audio/ogg',
        wma: 'audio/x-ms-wma',
        wav: 'audio/x-wav',
        dff: 'audio/x-dff',
    };
export function BytesHasPrefix(data, prefix){
    if (prefix.length > data.length) return false;
    return prefix.every((val, idx) => {
        return val === data[idx];
    });
}
export  function SniffAudioExt(data, fallback_ext = 'mp3'){
    if (BytesHasPrefix(data, MP3_HEADER)) return 'mp3';
    if (BytesHasPrefix(data, FLAC_HEADER)) return 'flac';
    if (BytesHasPrefix(data, OGG_HEADER)) return 'ogg';
    if (data.length >= 4 + M4A_HEADER.length && BytesHasPrefix(data.slice(4), M4A_HEADER)) return 'm4a';
    if (BytesHasPrefix(data, WAV_HEADER)) return 'wav';
    if (BytesHasPrefix(data, WMA_HEADER)) return 'wma';
    if (BytesHasPrefix(data, AAC_HEADER)) return 'aac';
    if (BytesHasPrefix(data, DFF_HEADER)) return 'dff';
    return fallback_ext;
}