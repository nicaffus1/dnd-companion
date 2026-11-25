// Pure arithmetic. No persistence, UI, or random rolls.
export function integer(n,min,max,label='value'){if(!Number.isSafeInteger(n)||n<min||n>max)throw new RangeError('Invalid '+label);return n;}
export const abilityModifier=score=>Math.floor((integer(score,1,30,'ability score')-10)/2);
export const proficiencyBonus=level=>2+Math.floor((integer(level,1,20,'level')-1)/4);
export const ABILITIES=Object.freeze(['str','dex','con','int','wis','cha']);
export const SKILLS=Object.freeze({acrobatics:'dex',animalHandling:'wis',arcana:'int',athletics:'str',deception:'cha',history:'int',insight:'wis',intimidation:'cha',investigation:'int',medicine:'wis',nature:'int',perception:'wis',performance:'cha',persuasion:'cha',religion:'int',sleightOfHand:'dex',stealth:'dex',survival:'wis'});
export function modifier(score,level,{proficiency=0,bonus=0,override}={}){
 if(![0,0.5,1,2].includes(proficiency))throw new RangeError('Invalid proficiency multiplier');
 const calculated=abilityModifier(score)+Math.floor(proficiencyBonus(level)*proficiency)+integer(bonus,-100,100,'bonus');
 return override===undefined?calculated:integer(override,-100,100,'override');
}
export function skillModifier(skill,scores,level,options={}){if(!Object.hasOwn(SKILLS,skill))throw new RangeError('Unknown skill');const ability=options.ability??SKILLS[skill];if(!ABILITIES.includes(ability))throw new RangeError('Unknown ability');return modifier(scores[ability],level,options);}
export const savingThrow=(score,level,options)=>modifier(score,level,options);
export function rollMode(advantage=false,disadvantage=false){return advantage===disadvantage?'normal':advantage?'advantage':'disadvantage';}
export function passiveScore(check,mode='normal'){integer(check,-100,100,'check modifier');if(!['normal','advantage','disadvantage'].includes(mode))throw new RangeError('Invalid roll mode');return 10+check+(mode==='advantage'?5:mode==='disadvantage'?-5:0);}
export function armorClass(dex,{category='none',base=10,dexCap=2,shield=false,bonus=0,alternative,override}={}){
 const d=abilityModifier(dex);integer(base,0,100,'armor base');integer(dexCap,0,30,'dexterity cap');if(!['none','light','medium','heavy'].includes(category))throw new RangeError('Invalid armor category');
 const value=alternative===undefined?(category==='none'?10+d:base+(category==='heavy'?0:category==='medium'?Math.min(d,dexCap):d)):integer(alternative,0,100,'alternative AC');
 return override===undefined?value+(shield?2:0)+integer(bonus,-100,100,'AC bonus'):integer(override,0,100,'AC override');
}
export const initiative=(dex,level,options)=>modifier(dex,level,options);
export function weaponModifiers(score,level,{proficient=false,attackBonus=0,damageBonus=0,addAbilityToDamage=true,attackOverride,damageOverride}={}){
 return {attack:modifier(score,level,{proficiency:proficient?1:0,bonus:attackBonus,override:attackOverride}),damage:damageOverride===undefined?(addAbilityToDamage?abilityModifier(score):0)+integer(damageBonus,-100,100,'damage bonus'):integer(damageOverride,-100,100,'damage override')};
}
export function spellcasting(score,level,{attackBonus=0,dcBonus=0,attackOverride,dcOverride}={}){const base=modifier(score,level,{proficiency:1});return {attack:attackOverride===undefined?base+integer(attackBonus,-100,100):integer(attackOverride,-100,100),dc:dcOverride===undefined?8+base+integer(dcBonus,-100,100):integer(dcOverride,0,100)};}
export const XP_THRESHOLDS=Object.freeze([0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000]);
export const xpForLevel=level=>XP_THRESHOLDS[integer(level,1,20,'level')-1];
export function levelForXP(xp){integer(xp,0,Number.MAX_SAFE_INTEGER,'XP');let level=1;for(let i=1;i<20;i++)if(xp>=XP_THRESHOLDS[i])level=i+1;return level;}
export function maxHitPoints(con,levels,{bonus=0,override}={}){
 const mod=abilityModifier(con);if(!Array.isArray(levels)||levels.length<1||levels.length>20)throw new RangeError('Invalid level history');
 let hp=0;for(let i=0;i<levels.length;i++){const {die,roll}=levels[i];if(![6,8,10,12].includes(die))throw new RangeError('Invalid hit die');const gain=i===0?die:roll===undefined?die/2+1:integer(roll,1,die,'hit die roll');hp+=Math.max(1,gain+mod);}
 return override===undefined?Math.max(1,hp+integer(bonus,-1000,1000)):integer(override,1,10000,'HP override');
}
function health(h){integer(h.max,1,10000,'maximum HP');integer(h.current,0,h.max,'current HP');integer(h.temp,0,10000,'temporary HP');return h;}
export function damage(h,amount){health(h);integer(amount,0,100000,'damage');const absorbed=Math.min(h.temp,amount);const remaining=amount-absorbed;return {...h,temp:h.temp-absorbed,current:Math.max(0,h.current-remaining),massiveDamage:remaining>0&&remaining-h.current>=h.max};}
export function heal(h,amount){health(h);return {...h,current:Math.min(h.max,h.current+integer(amount,0,100000,'healing'))};}
export function temporaryHP(h,amount,replace=false){health(h);integer(amount,0,10000,'temporary HP');return {...h,temp:replace?amount:Math.max(h.temp,amount)};}
export function carryingCapacity(str,size='medium',multiplier=1){integer(str,1,30,'Strength');const factors={tiny:0.5,small:1,medium:1,large:2,huge:4,gargantuan:8};if(!Object.hasOwn(factors,size)||!Number.isFinite(multiplier)||multiplier<=0||multiplier>100)throw new RangeError('Invalid carrying factor');return 15*str*factors[size]*multiplier;}
export function recoveredHitDice(level,spent,all){integer(level,1,20,'level');integer(spent,0,level,'spent hit dice');return Math.min(spent,all?level:Math.max(1,Math.floor(level/2)));}
