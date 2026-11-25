import {integer,recoveredHitDice} from '../shared/core.mjs';
export const revised=Object.freeze({id:'2024',halfCasterLevels:level=>Math.ceil(integer(level,0,20)/2),thirdCasterLevels:level=>Math.floor(integer(level,0,20)/3),recoverHitDice:(level,spent)=>recoveredHitDice(level,spent,true),exhaustion:level=>{integer(level,0,6);return {d20Penalty:-2*level,speedReduction:5*level,dead:level===6};}});
