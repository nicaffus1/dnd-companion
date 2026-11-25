import {useState} from 'react';
import {Plus,BookOpen,UserRound,ChevronDown,Pencil} from 'lucide-react';
import type {AppData,DataAction,Ruleset} from '../../database/types';
type Props={data:AppData;busy:boolean;save:(a:DataAction)=>Promise<boolean>};
export function CampaignPanel({data,busy,save}:Props){
 const [mode,setMode]=useState<'campaign'|'character'|'renameCampaign'|'renameCharacter'|null>(null);const [name,setName]=useState('');const [ruleset,setRuleset]=useState<Ruleset>('2024');
 const campaign=data.campaigns.find(c=>c.id===data.activeCampaignId);const character=data.characters.find(c=>c.id===data.activeCharacterId);
 const start=(m:typeof mode,n='')=>{setName(n);setMode(m);};
 const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!name.trim()||busy)return;let action:DataAction;switch(mode){
 case 'campaign':action={type:'campaign.add',id:crypto.randomUUID(),name,ruleset,createdAt:Date.now()};break;
 case 'character':action={type:'character.add',id:crypto.randomUUID(),name,createdAt:Date.now()};break;
 case 'renameCampaign':if(!campaign)return;action={type:'campaign.rename',id:campaign.id,name};break;
 case 'renameCharacter':if(!character)return;action={type:'character.rename',id:character.id,name};break;
 default:return;}if(await save(action)){setMode(null);setName('');}};
 return <section className="data-panel" aria-label="Active campaign and character">
 <div className="panel-heading"><BookOpen size={19}/><h2>Campaign</h2><button className="small-button" disabled={busy} onClick={()=>start('campaign')}><Plus size={16}/> New</button></div>
 {data.campaigns.length>0?<><label className="sr-only" htmlFor="campaign-select">Active campaign</label><div className="select-row"><select id="campaign-select" value={data.activeCampaignId??''} disabled={busy} onChange={e=>{setMode(null);void save({type:'campaign.select',id:e.target.value});}}>{!data.activeCampaignId&&<option value="" disabled>Select campaign</option>}{data.campaigns.map(c=><option key={c.id} value={c.id}>{c.name} · {c.ruleset}</option>)}</select>{campaign&&<button className="icon-button" aria-label="Rename campaign" disabled={busy} onClick={()=>start('renameCampaign',campaign.name)}><Pencil size={18}/></button>}</div></>:<p className="muted">Create your first campaign to get started.</p>}
 {campaign&&<><div className="panel-heading character-heading"><UserRound size={19}/><h2>Character</h2><button className="small-button" disabled={busy} onClick={()=>start('character')}><Plus size={16}/> New</button></div>
 {data.characters.some(c=>c.campaignId===campaign.id)?<div className="select-row"><label htmlFor="character-select" className="sr-only">Active character</label><select id="character-select" value={data.activeCharacterId??''} disabled={busy} onChange={e=>{setMode(null);void save({type:'character.select',id:e.target.value});}}>{!data.activeCharacterId&&<option value="" disabled>Select character</option>}{data.characters.filter(c=>c.campaignId===campaign.id).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>{character&&<button className="icon-button" aria-label="Rename character" disabled={busy} onClick={()=>start('renameCharacter',character.name)}><Pencil size={18}/></button>}</div>:<p className="muted">Add a character record now; the guided builder arrives in Phase 6.</p>}</>}
 {mode&&<form className="data-form" onSubmit={submit}><h3>{mode==='campaign'?'New campaign':mode==='character'?'New character':mode==='renameCampaign'?'Rename campaign':'Rename character'}</h3><label htmlFor="record-name">Name</label><input id="record-name" value={name} maxLength={100} required onChange={e=>setName(e.target.value)} placeholder={mode==='campaign'?'Campaign name':'Name'}/>{mode==='campaign'&&<><label htmlFor="ruleset">D&D ruleset</label><select id="ruleset" value={ruleset} onChange={e=>setRuleset(e.target.value as Ruleset)}><option value="2024">2024 revised 5e</option><option value="2014">2014 legacy 5e</option></select><small>Ruleset is fixed when created to protect future character calculations.</small></>}<div className="form-actions"><button type="button" className="secondary" disabled={busy} onClick={()=>setMode(null)}>Cancel</button><button className="primary" disabled={busy||!name.trim()} type="submit">{busy?'Saving…':'Save'}</button></div></form>}
 </section>;
}
