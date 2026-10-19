import {missingForStep,validateImport,updateSelection} from '../domain/workshop.js';
function normalize(state){for(const c of state.candidates){if(c.name.trim()&&!state.ideas.includes(c.name)&&state.ideas.length<200)state.ideas.push(c.name);}updateSelection(state);return state;}
export class WorkshopService{
 constructor(repository){this.repository=repository;this.state=normalize(repository.load());}
 save(){updateSelection(this.state);this.repository.save(this.state);}
 addItem(list){if(!['problems','ideas','project.features'].includes(list))throw Error('Lista inválida.');const items=list==='project.features'?this.state.project.features:this.state[list];if(items.length>=200)return false;items.push('');this.state.completed=this.state.completed.filter(i=>i!==({'problems':0,'ideas':1,'project.features':3}[list]));this.save();return true;}
 removeItem(list,index){if(!['problems','ideas','project.features'].includes(list))return;const minimum=list==='ideas'?10:5,items=list==='project.features'?this.state.project.features:this.state[list];if(!Number.isInteger(index)||index<minimum||index>=items.length)return;const [removed]=items.splice(index,1);if(list==='ideas'&&!this.state.ideas.includes(removed)){this.state.candidates.forEach(c=>{if(c.name===removed)c.name='';});this.state.completed=this.state.completed.filter(i=>i!==2);}this.save();}
 complete(){const warning=missingForStep(this.state,this.state.step);if(warning)return warning;if(!this.state.completed.includes(this.state.step))this.state.completed.push(this.state.step);this.save();return '';}
 import(text){const next=normalize(validateImport(JSON.parse(text)));this.repository.save(next);this.state=next;}
}
