import {blankState,validateImport} from '../domain/workshop.js';
const KEY='adso-taller-v1';
export const repository={load(){try{const raw=localStorage.getItem(KEY);return raw?validateImport(JSON.parse(raw)):blankState();}catch{return blankState();}},save(state){localStorage.setItem(KEY,JSON.stringify(state));}};
export function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
