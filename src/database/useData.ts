import {useCallback,useEffect,useRef,useState} from 'react';
import {openDatabase,readState,writeAction} from './store.mjs';
import type {AppData,DataAction} from './types';
export function useData(){
 const db=useRef<IDBDatabase|null>(null);const busyRef=useRef(false);
 const [data,setData]=useState<AppData|null>(null);const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 useEffect(()=>{let live=true;let opened:IDBDatabase|null=null;(async()=>{try{opened=await openDatabase();if(!live){opened?.close();return;}db.current=opened;const state=await readState(opened);if(live)setData(state);}catch(e){if(live)setError(e instanceof Error?e.message:String(e));}})();return()=>{live=false;opened?.close();if(db.current===opened)db.current=null;};},[]);
 const save=useCallback(async(action:DataAction)=>{if(!db.current||!data||busyRef.current)return false;busyRef.current=true;setBusy(true);setError('');try{const next=await writeAction(db.current,action,data.revision);setData(next);return true;}catch(e){setError(e instanceof Error?e.message:String(e));try{if(db.current)setData(await readState(db.current));}catch{/* preserve last visible data */}return false;}finally{busyRef.current=false;setBusy(false);}},[data]);
 return {data,error,busy,save};
}
