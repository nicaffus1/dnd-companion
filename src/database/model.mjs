export const SCHEMA_VERSION=1;
export const emptyState=()=>({schemaVersion:1,revision:0,campaigns:[],characters:[],activeCampaignId:null,activeCharacterId:null});
const fail=m=>{throw new Error(m)};
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(x);
const name=x=>typeof x==='string'&&x.trim().length>0&&x.length<=100;
const rules=x=>x==='2014'||x==='2024';
const fields=(x,keys)=>object(x)&&Object.keys(x).every(k=>keys.includes(k))&&keys.every(k=>Object.hasOwn(x,k));
export function validateState(s){
 if(!fields(s,['schemaVersion','revision','campaigns','characters','activeCampaignId','activeCharacterId'])||s.schemaVersion!==1||!Number.isSafeInteger(s.revision)||s.revision<0||s.revision>=Number.MAX_SAFE_INTEGER)fail('Unsupported or invalid data schema.');
 if(!Array.isArray(s.campaigns)||!Array.isArray(s.characters)||s.campaigns.length>10000||s.characters.length>10000)fail('Invalid record collections.');
 const campaignIds=new Set(),characterIds=new Set();
 for(const c of s.campaigns){if(!fields(c,['id','name','ruleset','createdAt'])||!id(c.id)||!name(c.name)||!rules(c.ruleset)||!Number.isSafeInteger(c.createdAt)||c.createdAt<0||campaignIds.has(c.id))fail('Invalid or duplicate campaign.');campaignIds.add(c.id);}
 for(const c of s.characters){if(!fields(c,['id','campaignId','name','createdAt'])||!id(c.id)||!name(c.name)||!campaignIds.has(c.campaignId)||!Number.isSafeInteger(c.createdAt)||c.createdAt<0||characterIds.has(c.id))fail('Invalid, duplicate or orphaned character.');characterIds.add(c.id);}
 if(s.activeCampaignId!==null&&!campaignIds.has(s.activeCampaignId))fail('Active campaign not found.');
 if(s.activeCharacterId!==null&&!s.characters.some(c=>c.id===s.activeCharacterId&&c.campaignId===s.activeCampaignId))fail('Active character does not belong to active campaign.');
 return s;
}
export function applyAction(s,a){
 validateState(s);const next=structuredClone(s);
 switch(a.type){
 case 'campaign.add':next.campaigns.push({id:a.id,name:a.name.trim(),ruleset:a.ruleset,createdAt:a.createdAt});next.activeCampaignId=a.id;next.activeCharacterId=null;break;
 case 'campaign.select':if(!next.campaigns.some(c=>c.id===a.id))fail('Campaign not found.');next.activeCampaignId=a.id;next.activeCharacterId=next.characters.find(c=>c.campaignId===a.id)?.id??null;break;
 case 'campaign.rename':{const c=next.campaigns.find(c=>c.id===a.id);if(!c)fail('Campaign not found.');c.name=a.name.trim();break;}
 case 'character.add':if(!next.activeCampaignId)fail('Select a campaign first.');next.characters.push({id:a.id,campaignId:next.activeCampaignId,name:a.name.trim(),createdAt:a.createdAt});next.activeCharacterId=a.id;break;
 case 'character.select':if(!next.characters.some(c=>c.id===a.id&&c.campaignId===next.activeCampaignId))fail('Character not found in this campaign.');next.activeCharacterId=a.id;break;
 case 'character.rename':{const c=next.characters.find(c=>c.id===a.id&&c.campaignId===next.activeCampaignId);if(!c)fail('Character not found.');c.name=a.name.trim();break;}
 case 'restore':{const restored=structuredClone(validateState(a.state));restored.revision=s.revision+1;return validateState(restored);}
 default:fail('Unknown data operation.');
 }
 next.revision++;return validateState(next);
}
export function encodeBackup(s){return JSON.stringify({format:'dnd-companion-backup',schemaVersion:1,exportedAt:new Date().toISOString(),data:validateState(s)},null,2);}
export function decodeBackup(text){if(typeof text!=='string'||text.length>5000000)fail('Backup exceeds 5 MB.');let b;try{b=JSON.parse(text)}catch{fail('Not a valid JSON backup.')}if(!fields(b,['format','schemaVersion','exportedAt','data'])||b.format!=='dnd-companion-backup'||b.schemaVersion!==1||typeof b.exportedAt!=='string'||!Number.isFinite(Date.parse(b.exportedAt)))fail('Unsupported backup format.');return validateState(b.data);}
