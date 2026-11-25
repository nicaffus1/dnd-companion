import type {rollFormula} from '../features/dice/engine.mjs';
export type Row={label:string;formula:string;mode:string;type:string;autoCritical?:boolean};
export type Preset={id:string;name:string;folder:string;favorite:boolean;rows:Row[]};
export type PresetResult=ReturnType<typeof rollFormula>&{label:string;type:string;autoCritical?:boolean};
