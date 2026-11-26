import test from 'node:test';
import assert from 'node:assert/strict';
import {SIDES,secureDie,rollFormula,validResult} from '../src/features/dice/engine.mjs';
import {executePreset,STARTERS} from '../src/chamber/presets.mjs';
import {rerollRow} from '../src/chamber/advanced.mjs';
for(const sides of SIDES){
 test('secure d'+sides+' rejects out-of-range random words',()=>{const limit=2**32-(2**32%sides);let calls=0;const values=limit<2**32?[limit,limit-1]:[limit-1];const source={getRandomValues(a){a[0]=values[calls++];return a;}};assert.equal(secureDie(sides,source),sides);assert.equal(calls,values.length);});
 test('secure d'+sides+' distribution smoke test',()=>{const n=sides*200,counts=Array(sides).fill(0);for(let i=0;i<n;i++){const v=secureDie(sides);assert.ok(v>=1&&v<=sides);counts[v-1]++;}for(const count of counts)assert.ok(Math.abs(count-200)<100,'unexpected frequency '+count);});
}
test('maximum dice and signed formula arithmetic',()=>{const r=rollFormula('25d100-25d4+1000','normal',s=>s);assert.equal(r.total,3400);assert.ok(validResult(r));assert.equal(rollFormula('25d100-1000','critical',s=>s).total,4000);});
test('all advantage and disadvantage outcome pairs',()=>{for(let a=1;a<=20;a++)for(let b=1;b<=20;b++)for(const mode of ['advantage','disadvantage']){let i=0;const r=rollFormula('d20+5',mode,()=>[a,b][i++]);assert.equal(r.total,5+(mode==='advantage'?Math.max(a,b):Math.min(a,b)));assert.ok(validResult(r));}});
test('preset reroll preserves independent rows',()=>{const r=executePreset(STARTERS[0],()=>1);const next=rerollRow(r,0,0,0,()=>20);assert.equal(next[0].total,25);assert.deepEqual(next.slice(1),r.slice(1));});
