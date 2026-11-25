export const PACK_BYTES=25_000_000;
export const BACKUP_BYTES=150_000_000;
export const PACK_ENTRIES=10_000;
export const CUSTOM_ENTRIES=30_000;
export const DESCRIPTION_LENGTH=40_000;
// Cap total encoded custom data as well as individual packs to leave room for backups.
export const CUSTOM_BYTES=75_000_000;
export function byteLength(text){return new TextEncoder().encode(text).length;}
export function checkBytes(text,max,label){if(typeof text!=='string'||text.length>max||byteLength(text)>max)throw Error(label+' exceeds '+max/1_000_000+' MB.');}
