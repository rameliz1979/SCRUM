export const steps = [
 {title:'Detectives de problemas',minutes:30,description:'Observa tu entorno. Cada integrante propone tres problemas; el equipo selecciona cinco que el software podría ayudar a resolver.'},
 {title:'Explosión de ideas',minutes:45,description:'Propongan al menos diez ideas de software. Escuchen todas las propuestas sin juzgarlas ni descartarlas todavía.'},
 {title:'El filtro de las ideas',minutes:40,description:'Comparen tres propuestas y voten de forma argumentada. La puntuación orienta la conversación; el equipo toma la decisión.'},
 {title:'Diseñadores de soluciones',minutes:65,description:'Dediquen 20 minutos a la ficha, 25 a los tres bocetos y 20 a las cinco necesidades del usuario y su prioridad.'},
 {title:'Feria de proyectos',minutes:60,description:'Presenten el problema, los usuarios y la solución. Repartan los 60 minutos entre los equipos e incluyan preguntas y retroalimentación.'}
];
export const blankState = () => ({version:1,step:0,completed:[],team:{name:'',cohort:'',members:''},problems:Array(5).fill(''),ideas:Array(10).fill(''),candidates:Array.from({length:3},()=>({name:'',scores:[1,1,1,1]})),selection:'',reason:'',project:{name:'',type:'Web',problem:'',users:'',solution:'',benefit:'',evidence:'',features:Array(5).fill('')},needs:Array.from({length:5},()=>({text:'',priority:'Media'})),sketches:Array(3).fill(''),feedback:'',reflection:'',checks:[]});
export const score = candidate => candidate.scores.reduce((sum,n)=>sum+Number(n),0);
export function rankedCandidates(state){return state.candidates.filter(c=>c.name.trim()).map((c,index)=>({...c,total:score(c),index})).sort((a,b)=>b.total-a.total||a.index-b.index);}
export function updateSelection(state){const ranked=rankedCandidates(state);state.selection=ranked[0]?.name||'';return ranked;}
export function missingForStep(s,index){
 const filled = a => a.every(x=>x.trim());
 if(index===0&&!filled(s.problems))return 'Registra los cinco problemas seleccionados.';
 if(index===1&&!filled(s.ideas))return 'Registra al menos diez ideas.';
 if(index===2&&(!s.candidates.every(x=>x.name.trim())||new Set(s.candidates.map(c=>c.name)).size!==3||!s.selection.trim()||!s.reason.trim()))return 'Selecciona tres ideas diferentes y justifica la decisión.';
 if(index===3&&(!['name','problem','users','solution','benefit','evidence'].every(k=>s.project[k].trim())||!filled(s.project.features)||!s.needs.every(n=>n.text.trim())||!s.sketches.every(Boolean)))return 'Completa la ficha, las cinco necesidades y los tres bocetos.';
 if(index===4&&(!s.feedback.trim()||!s.reflection.trim()))return 'Registra la retroalimentación y la reflexión grupal.';
 return '';
}
export function validateImport(s){
 const str=x=>typeof x==='string'&&x.length<=10000;
 const arr=(x,n,test)=>Array.isArray(x)&&x.length===n&&x.every(test);
 if(!s||s.version!==1||!Number.isInteger(s.step)||s.step<0||s.step>4)throw Error('Archivo de taller incompatible.');
 const list=(x,min)=>Array.isArray(x)&&x.length>=min&&x.length<=200&&x.every(str);
 if(!s.team||!['name','cohort','members'].every(k=>str(s.team[k]))||!list(s.problems,5)||!list(s.ideas,10))throw Error('Datos del equipo o ideas inválidos (máximo 200 por lista).');
 if(!arr(s.candidates,3,x=>x&&str(x.name)&&arr(x.scores,4,n=>Number.isInteger(n)&&n>=1&&n<=5)))throw Error('Matriz inválida.');
 if(!s.project||!['name','type','problem','users','solution','benefit','evidence'].every(k=>str(s.project[k]))||!['Web','Móvil','Escritorio'].includes(s.project.type)||!list(s.project.features,5))throw Error('Ficha inválida.');
 if(!arr(s.needs,5,n=>n&&str(n.text)&&['Alta','Media','Baja'].includes(n.priority))||!arr(s.sketches,3,x=>x===''||(typeof x==='string'&&x.length<2000000&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(x))))throw Error('Necesidades o bocetos inválidos.');
 if(!['selection','reason','feedback','reflection'].every(k=>str(s[k]))||!Array.isArray(s.completed)||!s.completed.every(n=>Number.isInteger(n)&&n>=0&&n<5)||!Array.isArray(s.checks)||!s.checks.every(n=>Number.isInteger(n)&&n>=0&&n<7))throw Error('Datos del taller inválidos.');
 return s;
}
