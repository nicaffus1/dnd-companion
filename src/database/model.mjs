import {BACKUP_BYTES,CUSTOM_ENTRIES,CUSTOM_BYTES,checkBytes} from '../content/limits.mjs';
import {validResult,parseFormula,MODES} from '../features/dice/engine.mjs';
import {validateCustom} from '../content/catalog.mjs';
import {validateProfile} from '../content/profile.mjs';
import {validateBuild,reviewBuild} from '../content/builder.mjs';
import {validateSheet,sheetContext,normalizeSheet} from '../content/sheet.mjs';
import {validateInventory,initialInventory,rechargeInventory} from '../content/inventory.mjs';
export const SCHEMA_VERSION=6;
export const emptyState=()=>({schemaVersion:6,inventories:[],sheets:[],copyQueue:[],builds:[],customContent:[],profiles:[],revision:0,campaigns:[],characters:[],activeCampaignId:null,activeCharacterId:null,rolls:[],presets:[]});
const fail=m=>{throw new Error(m)};
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(x);
const name=x=>typeof x==='string'&&x.trim().length>0&&x.length<=100;
const rules=x=>x==='2014'||x==='2024';
const fields=(x,keys)=>object(x)&&Object.keys(x).every(k=>keys.includes(k))&&keys.every(k=>Object.hasOwn(x,k));
export function validateState(s){
 if(s?.schemaVersion===1&&fields(s,['schemaVersion','revision','campaigns','characters','activeCampaignId','activeCharacterId']))s={...s,schemaVersion:2,rolls:[],presets:[]};
 if(s?.schemaVersion===2&&fields(s,['schemaVersion','revision','campaigns','characters','activeCampaignId','activeCharacterId','rolls','presets']))s={...s,schemaVersion:3,customContent:[],profiles:[]};
 if(s?.schemaVersion===3&&fields(s,['schemaVersion','revision','campaigns','characters','activeCampaignId','activeCharacterId','rolls','presets','customContent','profiles']))s={...s,schemaVersion:4,builds:[]};
 if(s?.schemaVersion===4&&fields(s,['schemaVersion','revision','campaigns','characters','activeCampaignId','activeCharacterId','rolls','presets','customContent','profiles','builds']))s={...s,schemaVersion:5,sheets:[],copyQueue:[]};
 if(s?.schemaVersion===5&&fields(s,['schemaVersion','revision','campaigns','characters','activeCampaignId','activeCharacterId','rolls','presets','customContent','profiles','builds','sheets','copyQueue']))s={...s,schemaVersion:6,inventories:[]};
 if(!fields(s,['schemaVersion','revision','campaigns','characters','activeCampaignId','activeCharacterId','rolls','presets','customContent','profiles','builds','sheets','copyQueue','inventories'])||s.schemaVersion!==6||!Number.isSafeInteger(s.revision)||s.revision<0||s.revision>=Number.MAX_SAFE_INTEGER)fail('Unsupported or invalid data schema.');
 if(!Array.isArray(s.campaigns)||!Array.isArray(s.characters)||s.campaigns.length>10000||s.characters.length>10000)fail('Invalid record collections.');
 const campaignIds=new Set(),characterIds=new Set();
 for(const c of s.campaigns){if(!fields(c,['id','name','ruleset','createdAt'])||!id(c.id)||!name(c.name)||!rules(c.ruleset)||!Number.isSafeInteger(c.createdAt)||c.createdAt<0||campaignIds.has(c.id))fail('Invalid or duplicate campaign.');campaignIds.add(c.id);}
 for(const c of s.characters){if(!fields(c,['id','campaignId','name','createdAt'])||!id(c.id)||!name(c.name)||!campaignIds.has(c.campaignId)||!Number.isSafeInteger(c.createdAt)||c.createdAt<0||characterIds.has(c.id))fail('Invalid, duplicate or orphaned character.');characterIds.add(c.id);}
 if(s.activeCampaignId!==null&&!campaignIds.has(s.activeCampaignId))fail('Active campaign not found.');
 if(s.activeCharacterId!==null&&!s.characters.some(c=>c.id===s.activeCharacterId&&c.campaignId===s.activeCampaignId))fail('Active character does not belong to active campaign.');
 if(!Array.isArray(s.rolls)||s.rolls.length>3000||!Array.isArray(s.presets)||s.presets.length>300)fail('Invalid dice collections.');
 const scoped=x=>campaignIds.has(x.campaignId)&&(x.characterId===null||s.characters.some(c=>c.id===x.characterId&&c.campaignId===x.campaignId));
 const rollIds=new Set(),presetIds=new Set();
 for(const r of s.rolls){if(!fields(r,['id','campaignId','characterId','createdAt','label','formula','mode','groups','modifier','total'])||!id(r.id)||rollIds.has(r.id)||!scoped(r)||!name(r.label)||!Number.isSafeInteger(r.createdAt)||r.createdAt<0||!validResult(r))fail('Invalid roll history.');rollIds.add(r.id);}
 for(const p of s.presets){if(!fields(p,['id','campaignId','characterId','label','formula','mode'])||!id(p.id)||presetIds.has(p.id)||!scoped(p)||!name(p.label)||!MODES.includes(p.mode))fail('Invalid roll preset.');try{parseFormula(p.formula);}catch{fail('Invalid preset formula.');}presetIds.add(p.id);}
 if(!Array.isArray(s.customContent)||s.customContent.length>CUSTOM_ENTRIES||!Array.isArray(s.profiles)||s.profiles.length>s.characters.length)fail('Invalid content or profiles.');const contentIds=new Set(),profileIds=new Set();for(const c of s.customContent){validateCustom(c);if(contentIds.has(c.id))fail('Duplicate content ID.');contentIds.add(c.id);}for(const p of s.profiles){validateProfile(p);if(!characterIds.has(p.characterId)||profileIds.has(p.characterId))fail('Invalid profile reference.');profileIds.add(p.characterId);}
 if(!Array.isArray(s.builds)||s.builds.length>s.characters.length)fail('Invalid builds.');const buildIds=new Set();for(const b of s.builds){validateBuild(b);validateProfile(b.profile);if(!characterIds.has(b.characterId)||buildIds.has(b.characterId))fail('Invalid build reference.');buildIds.add(b.characterId);}
 if(!Array.isArray(s.sheets)||s.sheets.length>s.characters.length||!Array.isArray(s.copyQueue)||new Set(s.copyQueue).size!==s.copyQueue.length||!s.copyQueue.every(i=>rollIds.has(i)))fail('Invalid sheet or copy queue.');const sheetIds=new Set();for(const sh of s.sheets){validateSheet(sh);if(!profileIds.has(sh.characterId)||sheetIds.has(sh.characterId))fail('Invalid sheet reference.');sheetIds.add(sh.characterId);}
 if(!Array.isArray(s.inventories)||s.inventories.length>s.characters.length)fail('Invalid inventories.');const invIds=new Set();for(const v of s.inventories){validateInventory(v);if(!characterIds.has(v.characterId)||invIds.has(v.characterId))fail('Invalid inventory reference.');invIds.add(v.characterId);}
 return s;
}
export function applyAction(s,a){
 s=validateState(s);const next=structuredClone(s);
 switch(a.type){
 case 'campaign.add':next.campaigns.push({id:a.id,name:a.name.trim(),ruleset:a.ruleset,createdAt:a.createdAt});next.activeCampaignId=a.id;next.activeCharacterId=null;break;
 case 'campaign.select':if(!next.campaigns.some(c=>c.id===a.id))fail('Campaign not found.');next.activeCampaignId=a.id;next.activeCharacterId=next.characters.find(c=>c.campaignId===a.id)?.id??null;break;
 case 'campaign.rename':{const c=next.campaigns.find(c=>c.id===a.id);if(!c)fail('Campaign not found.');c.name=a.name.trim();break;}
 case 'character.add':if(!next.activeCampaignId)fail('Select a campaign first.');next.characters.push({id:a.id,campaignId:next.activeCampaignId,name:a.name.trim(),createdAt:a.createdAt});next.activeCharacterId=a.id;break;
 case 'character.select':if(!next.characters.some(c=>c.id===a.id&&c.campaignId===next.activeCampaignId))fail('Character not found in this campaign.');next.activeCharacterId=a.id;break;
 case 'character.rename':{const c=next.characters.find(c=>c.id===a.id&&c.campaignId===next.activeCampaignId);if(!c)fail('Character not found.');c.name=a.name.trim();break;}
 case 'roll.add':{const r=a.roll;if(r.campaignId!==next.activeCampaignId||r.characterId!==next.activeCharacterId)fail('Roll scope changed.');if(next.rolls.length>=3000)fail('Roll history is full. Export and remove old rolls first.');next.rolls.push(r);next.copyQueue.push(r.id);break;}
 case 'roll.remove':next.rolls=next.rolls.filter(r=>!(a.ids.includes(r.id)&&r.campaignId===next.activeCampaignId&&r.characterId===next.activeCharacterId));next.copyQueue=next.copyQueue.filter(id=>next.rolls.some(r=>r.id===id));break;
 case 'copy.select':{const allowed=new Set(next.rolls.filter(r=>r.campaignId===next.activeCampaignId&&r.characterId===next.activeCharacterId).map(r=>r.id));if(!Array.isArray(a.ids)||!a.ids.every(i=>allowed.has(i)))fail('Invalid copy selection.');next.copyQueue=[...next.copyQueue.filter(i=>!allowed.has(i)),...new Set(a.ids)];break;}
 case 'inventory.save':{const v=validateInventory(a.inventory);if(v.characterId!==next.activeCharacterId)fail('Character changed.');next.inventories=next.inventories.filter(x=>x.characterId!==v.characterId);next.inventories.push(v);break;}
 case 'sheet.save':{const sh=validateSheet(a.sheet);if(sh.characterId!==next.activeCharacterId)fail('Character changed.');const ctx=sheetContext(next,sh.characterId);if(!ctx)fail('Save character profile first.');next.sheets=next.sheets.filter(x=>x.characterId!==sh.characterId);next.sheets.push(normalizeSheet(ctx,sh));if(a.rest==='short'||a.rest==='long'){const v=next.inventories.find(x=>x.characterId===sh.characterId)??initialInventory(next,sh.characterId);next.inventories=next.inventories.filter(x=>x.characterId!==sh.characterId);next.inventories.push(rechargeInventory(v,a.rest));}break;}
 case 'preset.add':if(a.preset.campaignId!==next.activeCampaignId||a.preset.characterId!==next.activeCharacterId)fail('Preset scope changed.');next.presets.push(a.preset);break;
 case 'preset.remove':next.presets=next.presets.filter(p=>!(p.id===a.id&&p.campaignId===next.activeCampaignId&&p.characterId===next.activeCharacterId));break;
 case 'content.add':{next.customContent=next.customContent.concat(a.entries);checkBytes(JSON.stringify(next.customContent),CUSTOM_BYTES,'Combined custom content');break;}
 case 'build.save':{const b=validateBuild(a.build);validateProfile(b.profile);if(b.characterId!==next.activeCharacterId)fail('Character changed.');if(a.finish){const edition=next.campaigns.find(c=>c.id===next.activeCampaignId).ruleset;const warnings=reviewBuild(b,next,edition);if(warnings.length&&!b.override)fail(warnings.join(' '));next.profiles=next.profiles.filter(p=>p.characterId!==b.characterId);next.profiles.push(b.profile);}next.builds=next.builds.filter(x=>x.characterId!==b.characterId);next.builds.push({...b,complete:!!a.finish});if(a.finish){const existing=next.inventories.find(x=>x.characterId===b.characterId);if(!existing){next.inventories.push(initialInventory(next,b.characterId));}else if(!existing.startingTransferred){const starting=initialInventory(next,b.characterId);existing.items.push(...starting.items);existing.startingTransferred=true;}}break;}
 case 'profile.save':if(a.profile.characterId!==next.activeCharacterId)fail('Character changed.');next.profiles=next.profiles.filter(p=>p.characterId!==a.profile.characterId);next.profiles.push(a.profile);break;
 case 'restore':{const restored=structuredClone(validateState(a.state));restored.revision=s.revision+1;return validateState(restored);}
 default:fail('Unknown data operation.');
 }
 next.revision++;return validateState(next);
}
export function encodeBackup(s){const text=JSON.stringify({format:'dnd-companion-backup',schemaVersion:6,exportedAt:new Date().toISOString(),data:validateState(s)});checkBytes(text,BACKUP_BYTES,'Backup');return text;}
export function decodeBackup(text){checkBytes(text,BACKUP_BYTES,'Backup');let b;try{b=JSON.parse(text)}catch{fail('Not a valid JSON backup.')}if(!fields(b,['format','schemaVersion','exportedAt','data'])||b.format!=='dnd-companion-backup'||![1,2,3,4,5,6].includes(b.schemaVersion)||b.data?.schemaVersion!==b.schemaVersion||typeof b.exportedAt!=='string'||!Number.isFinite(Date.parse(b.exportedAt)))fail('Unsupported backup format.');const state=validateState(b.data);checkBytes(JSON.stringify(state.customContent),CUSTOM_BYTES,'Combined custom content');return state;}
