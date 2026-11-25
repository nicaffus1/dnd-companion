export type Ruleset='2014'|'2024';
export interface Campaign{id:string;name:string;ruleset:Ruleset;createdAt:number}
export interface Character{id:string;campaignId:string;name:string;createdAt:number}
export interface AppData{schemaVersion:3;revision:number;campaigns:Campaign[];characters:Character[];activeCampaignId:string|null;activeCharacterId:string|null;rolls:RollRecord[];presets:RollPreset[];customContent:ContentEntry[];profiles:MechanicsProfile[]}
export type RollMode='normal'|'advantage'|'disadvantage'|'critical';
export interface RollResult{formula:string;mode:RollMode;groups:{sides:number;sign:number;rolls:number[];kept:number[]}[];modifier:number;total:number}
export interface RollRecord extends RollResult{id:string;campaignId:string;characterId:string|null;createdAt:number;label:string}
export interface RollPreset{id:string;campaignId:string;characterId:string|null;label:string;formula:string;mode:RollMode}
export interface ContentEntry{id:string;edition:Ruleset;category:string;name:string;description:string;mechanics:Record<string,string|number>;source:string}
export interface MechanicsProfile{characterId:string;level:number;abilities:Record<string,number>;skills:Record<string,number>;saves:Record<string,number>}
export type DataAction={type:'content.add';entries:ContentEntry[]}|{type:'profile.save';profile:MechanicsProfile}|{type:'roll.add';roll:RollRecord}|{type:'roll.remove';ids:string[]}|{type:'preset.add';preset:RollPreset}|{type:'preset.remove';id:string}|{type:'campaign.add';id:string;name:string;ruleset:Ruleset;createdAt:number}|{type:'character.add';id:string;name:string;createdAt:number}|{type:'campaign.select'|'character.select';id:string}|{type:'campaign.rename'|'character.rename';id:string;name:string}|{type:'restore';state:AppData};
