export const SIDES=Object.freeze([4,6,8,10,12,20,100]);
export const MODES=Object.freeze(['normal','advantage','disadvantage','critical']);
export function parseFormula(input){
 if(typeof input!=='string'||input.length>100)throw new Error('Enter a formula of up to 100 characters.');
 const text=input.replace(/\s+/g,'').toLowerCase();if(!text)throw new Error('Enter a dice formula.');
 const tokens=text.match(/[+-]?(?:\d*d\d+|\d+)/g);if(!tokens||tokens.join('')!==text||tokens.slice(1).some(t=>!['+','-'].includes(t[0])))throw new Error('Use a formula such as 2d6+4 or d20+5.');
 let count=0,modifier=0;const terms=[];
 for(const token of tokens){const sign=token.startsWith('-')?-1:1;const body=token.replace(/^[+-]/,'');if(body.includes('d')){const [n,s]=body.split('d');const quantity=n===''?1:Number(n),sides=Number(s);if(!SIDES.includes(sides)||!Number.isInteger(quantity)||quantity<1||quantity>50)throw new Error('Use 1–50 standard dice per term.');count+=quantity;terms.push({quantity,sides,sign});}else{const value=Number(body);if(!Number.isSafeInteger(value)||value>1000)throw new Error('Modifier must be at most 1000 per term.');modifier+=sign*value;}}
 if(count<1||count>50||Math.abs(modifier)>1000)throw new Error('Use 1–50 dice and a modifier between −1000 and +1000.');
 return {formula:terms.map((t,i)=>(t.sign<0?'-':i?'+':'')+t.quantity+'d'+t.sides).join('')+(modifier?(modifier>0?'+':'')+modifier:''),terms,modifier,count};
}
export function secureDie(sides,cryptoSource=globalThis.crypto){if(!SIDES.includes(sides)||!cryptoSource?.getRandomValues)throw new Error('Secure dice randomness unavailable.');const limit=4294967296-(4294967296%sides);const a=new Uint32Array(1);do{cryptoSource.getRandomValues(a);}while(a[0]>=limit);return a[0]%sides+1;}
export function rollFormula(input,mode='normal',die=secureDie){
 const p=parseFormula(input);if(!MODES.includes(mode))throw new Error('Unknown roll mode.');
 if(['advantage','disadvantage'].includes(mode)&&(p.terms.length!==1||p.terms[0].quantity!==1||p.terms[0].sides!==20||p.terms[0].sign!==1))throw new Error('Advantage and disadvantage require exactly one positive d20 plus a modifier.');
 if(mode==='critical'&&(p.count>25||p.terms.some(t=>t.sign<0)))throw new Error('Critical damage requires positive dice terms and at most 25 base dice.');
 const groups=p.terms.map(t=>{const quantity=['advantage','disadvantage'].includes(mode)?2:mode==='critical'?t.quantity*2:t.quantity;const rolls=Array.from({length:quantity},()=>{const v=die(t.sides);if(!Number.isInteger(v)||v<1||v>t.sides)throw new Error('Invalid die result.');return v;});const kept=mode==='advantage'?[Math.max(...rolls)]:mode==='disadvantage'?[Math.min(...rolls)]:rolls.slice();return {sides:t.sides,sign:t.sign,rolls,kept};});
 return {formula:p.formula,mode,groups,modifier:p.modifier,total:groups.reduce((sum,g)=>sum+g.sign*g.kept.reduce((a,b)=>a+b,0),p.modifier)};
}
export function validResult(r){try{if(!r||!Array.isArray(r.groups)||!Number.isSafeInteger(r.total))return false;const values=r.groups.flatMap(g=>g.rolls);let i=0;const expected=rollFormula(r.formula,r.mode,()=>values[i++]);return i===values.length&&JSON.stringify(expected)===JSON.stringify({formula:r.formula,mode:r.mode,groups:r.groups,modifier:r.modifier,total:r.total});}catch{return false;}}
export function formatRoll(r){return [r.label+' — '+r.formula+' ('+r.mode+')',...r.groups.map(g=>(g.sign<0?'-':'')+'d'+g.sides+': ['+g.rolls.join(', ')+']'+(g.kept.length!==g.rolls.length?' kept '+g.kept.join(', '):'')),'Modifier: '+(r.modifier>=0?'+':'')+r.modifier,'Total: '+r.total].join('\n');}
export function formatGroup(rows,campaign,character){return ['D&D Roll Results',campaign?'Campaign: '+campaign:'',character?'Character: '+character:'',...rows.map(formatRoll)].filter(Boolean).join('\n\n');}
