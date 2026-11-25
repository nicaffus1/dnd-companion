export type Ruleset='2014'|'2024';
export interface Campaign{id:string;name:string;ruleset:Ruleset;createdAt:number}
export interface Character{id:string;campaignId:string;name:string;createdAt:number}
export interface AppData{schemaVersion:1;revision:number;campaigns:Campaign[];characters:Character[];activeCampaignId:string|null;activeCharacterId:string|null}
export type DataAction={type:'campaign.add';id:string;name:string;ruleset:Ruleset;createdAt:number}|{type:'character.add';id:string;name:string;createdAt:number}|{type:'campaign.select'|'character.select';id:string}|{type:'campaign.rename'|'character.rename';id:string;name:string}|{type:'restore';state:AppData};
