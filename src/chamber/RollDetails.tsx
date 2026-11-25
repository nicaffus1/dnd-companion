import {natural} from './advanced.mjs';
import {rollFormula} from '../features/dice/engine.mjs';
type Result=ReturnType<typeof rollFormula>;
export function RollDetails({result,onReroll}:{result:Result;onReroll:(group:number,index:number)=>void}){const n=natural(result);return <div className="roll-inspector">{n&&<span className={'natural natural-'+n}>Natural {n}</span>}{result.groups.map((g,i)=><div className="die-inspector" key={i}><small>d{g.sides}</small>{g.rolls.map((v,j)=><button key={j} aria-label={'Reroll d'+g.sides+' die '+(j+1)+' (currently '+v+')'} onClick={()=>onReroll(i,j)}>{v}<span aria-hidden="true">↻</span></button>)}{g.kept.length!==g.rolls.length&&<small>Kept {g.kept.join(', ')}</small>}</div>)}</div>}
