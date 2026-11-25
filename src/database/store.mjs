import {emptyState,validateState,applyAction} from './model.mjs';
const DB_NAME='dnd-companion';const STORE='state';const KEY='root';
export function openDatabase(factory=globalThis.indexedDB){
 return new Promise((resolve,reject)=>{
 if(!factory){reject(new Error('Local database is unavailable on this device.'));return;}
 const request=factory.open(DB_NAME,1);let blocked=false;
 request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};
 request.onerror=()=>reject(request.error??new Error('Unable to open local database.'));
 request.onblocked=()=>{blocked=true;reject(new Error('Close other app tabs and reopen. Database upgrade blocked.'));};
 request.onsuccess=()=>{const db=request.result;if(blocked){db.close();return;}db.onversionchange=()=>db.close();resolve(db);};
 });
}
export function readState(db){return new Promise((resolve,reject)=>{
 const tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).get(KEY);let state;
 req.onsuccess=()=>{try{state=validateState(req.result===undefined?emptyState():req.result);}catch(e){reject(e);}};
 tx.oncomplete=()=>{if(state)resolve(state);};tx.onerror=tx.onabort=()=>reject(tx.error??new Error('Unable to read local data.'));
 });}
export function writeAction(db,action,expectedRevision){return new Promise((resolve,reject)=>{
 const tx=db.transaction(STORE,'readwrite');const store=tx.objectStore(STORE);const req=store.get(KEY);let next,error;
 req.onsuccess=()=>{try{const current=validateState(req.result===undefined?emptyState():req.result);if(current.revision!==expectedRevision)throw new Error('Data changed in another tab. Reopen this screen and try again.');next=applyAction(current,action);store.put(next,KEY);}catch(e){error=e;tx.abort();}};
 tx.oncomplete=()=>resolve(next);tx.onabort=tx.onerror=()=>reject(error??tx.error??new Error('Could not save changes. Previous data was preserved.'));
 });}
