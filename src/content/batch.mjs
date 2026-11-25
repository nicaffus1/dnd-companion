import {PACK_BYTES,PACK_ENTRIES,DESCRIPTION_LENGTH,checkBytes} from './limits.mjs';
const map={classes:'class',subclasses:'subclass',races:'species',subraces:'subrace',backgrounds:'background',spells:'spell',feats:'feature',weapons:'weapon',armor:'armor',items:'equipment',magicItems:'magic item',invocations:'invocation',monsters:'monster',languages:'language',selectionGroup:'selection group'};
const desc={class:'classDescription',subclass:'subclassDescription',species:'raceDescription',subrace:'subraceDescription',background:'backgroundDescription',spell:'officialDescription',feature:'featureDescription',monster:'monsterDescription'};
export function batchEntries(p,edition='2014'){
 if(!['2014','2024'].includes(edition)||!p||typeof p!=='object'||Array.isArray(p)||!Object.keys(map).some(k=>Array.isArray(p[k])&&p[k].length))throw Error('Unrecognized batch format.');
 const entries=[];const seen=new Set();
 for(const [key,category] of Object.entries(map)){if(p[key]===undefined)continue;if(!Array.isArray(p[key]))throw Error('Invalid batch category '+key);for(const raw of p[key]){
 if(!raw||typeof raw.name!=='string'||!raw.name.trim()||raw.name.length>100)throw Error('Invalid batch entry in '+key);
 const parent=String(raw.className??raw.raceName??'');const book=String(raw.source?.book??'');const identity=JSON.stringify([edition,key,raw.name,parent,book]);let hash=2166136261;for(let i=0;i<identity.length;i++)hash=Math.imul(hash^identity.charCodeAt(i),16777619);const id='custom-batch-'+edition+'-'+key+'-'+(hash>>>0).toString(36);if(seen.has(id))continue;seen.add(id);
 const description=String(raw[desc[category]]??raw.additionalInformation??raw.content??'').slice(0,DESCRIPTION_LENGTH);
 const mechanics={batch:JSON.stringify(raw),book,sourceType:String(raw.source?.sourceType??'unknown')};
 if(raw.className)mechanics.className=String(raw.className);if(raw.raceName)mechanics.raceName=String(raw.raceName);if(Number.isInteger(raw.level))mechanics.level=raw.level;if([6,8,10,12].includes(raw.hitDice))mechanics.hitDie=raw.hitDice;
 entries.push({id,edition,category:category==='feature'&&raw.type==='feat'?'feat':category,name:raw.name.trim(),description,mechanics,source:'Custom'});
 if(entries.length>PACK_ENTRIES)throw Error('Too many batch entries.');
 }}
 return entries;
}
export function rawEntry(x){try{return JSON.parse(x?.mechanics?.batch??'{}');}catch{return {};}}
export function importBatch(text,edition){checkBytes(text,PACK_BYTES,'Pack');return batchEntries(JSON.parse(text),edition);}
