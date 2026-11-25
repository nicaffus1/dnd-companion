export const DEFAULT_COLORS=Object.freeze({body:'#238B89',ink:'#FFFFFF'});
export const BODY_COLORS=Object.freeze([['Teal','#238B89'],['Sapphire','#315EAE'],['Ruby','#AF3042'],['Emerald','#26754D'],['Amethyst','#7747AA'],['Obsidian','#25262B'],['Ivory','#E8DFC9'],['Amber','#CB8628'],['Rose','#C04F85'],['Silver','#A5ACB8']]);
export const INK_COLORS=Object.freeze([['White','#FFFFFF'],['Black','#111111'],['Gold','#D9B96C'],['Silver','#C4CAD2'],['Red','#FF6666'],['Mint','#85E3AF'],['Ice','#A5DFFF'],['Lavender','#D4B5FF']]);
export function normalizeColor(v){return typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v)?v.toUpperCase():null;}
export function contrastRatio(a,b){const lum=c=>{const n=normalizeColor(c);if(!n)return 0;return [1,3,5].map(i=>parseInt(n.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);};const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
