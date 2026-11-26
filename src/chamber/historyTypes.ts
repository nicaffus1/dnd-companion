import type {PresetResult} from './presetTypes';
export type HistoryEntry={id:string;time:number;kind:'quick'|'preset';action:'roll'|'reroll'|'repeat';name:string;rows:PresetResult[]};
