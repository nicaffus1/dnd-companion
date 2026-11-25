import {parseFormula} from './engine.mjs';
export function simpleFormula(formula){try{const p=parseFormula(formula);if(p.terms.length!==1||p.terms[0].sign!==1)return null;return {sides:p.terms[0].sides,quantity:p.terms[0].quantity,modifier:p.modifier};}catch{return null;}}
export function buildFormula(sides,quantity,modifier){return parseFormula(quantity+'d'+sides+(modifier>0?'+'+modifier:modifier<0?String(modifier):'')).formula;}
export function appendSelection(ids,id){return ids.includes(id)?ids:[...ids,id];}
export function selectedRows(rows,ids){const selected=new Set(ids);return rows.filter(r=>selected.has(r.id)).slice().reverse();}
export function recentRows(rows){return rows.slice(0,3);}
