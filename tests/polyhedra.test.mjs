import {test} from 'node:test';import assert from 'node:assert/strict';import {polyhedron,settleQuaternion,physicalDice} from '../src/chamber/polyhedra.mjs';import {Vector3} from 'three';
for(const n of [4,6,8,10,12,20])test('d'+n+' physical faces and upward result',()=>{const faces=polyhedron(n);assert.equal(faces.length,n);assert.deepEqual(faces.map(f=>f.value).sort((a,b)=>a-b),Array.from({length:n},(_,i)=>i+1));for(const f of faces){assert.ok(f.normal.clone().applyQuaternion(settleQuaternion(f)).distanceTo(new Vector3(0,1,0))<1e-6);assert.equal(f.vertices.length,n===6||n===10?4:n===12?5:3);}});
test('percentile pairs reconstruct all values',()=>{for(let i=1;i<=100;i++){const [a,b]=physicalDice(100,i);assert.equal(Number(a.label)+Number(b.label)||100,i);}});

for(const n of [6,8,10,12,20])test('d'+n+' opposite faces are complementary',()=>{const f=polyhedron(n);for(const a of f){const b=f.find(b=>a.normal.dot(b.normal)<-.99999);assert.ok(b);assert.equal(a.value+b.value,n+1);}});
