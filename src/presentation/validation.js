// Presentación de errores: las reglas del momento siguen en el dominio.
export function setupValidation(getState){
 let attempted=false,previousStep=getState().step;
 const controls=()=>[...document.querySelectorAll('[data-team], #activity [data-path], #activity [data-canvas]')];
 function isEmpty(el){
  if(el.dataset.canvas!==undefined)return !getState().sketches[Number(el.dataset.canvas)];
  return !el.value.trim();
 }
 function mark(el,invalid){
  const id=el.dataset.team?`team-${el.dataset.team}`:el.dataset.path||`canvas-${el.dataset.canvas}`;
  const messageId=`error-${id.replaceAll('.','-')}`;
  el.classList.toggle('field-invalid',invalid);
  if(invalid){
   el.setAttribute('aria-invalid','true');
   el.setAttribute('aria-describedby',messageId);
   if(!document.getElementById(messageId)){
    const message=document.createElement('span');message.id=messageId;
    message.className='field-error';message.textContent=el.dataset.canvas!==undefined?'Dibuja o carga este boceto.':'Este campo es obligatorio.';
    el.insertAdjacentElement('afterend',message);
   }
  }else{
   el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');
   document.getElementById(messageId)?.remove();
  }
 }
 function refresh(){
  if(getState().step!==previousStep){attempted=false;previousStep=getState().step;}
  if(!attempted){controls().forEach(el=>mark(el,false));return;}
  controls().forEach(el=>mark(el,isEmpty(el)));
 }
 document.addEventListener('click',event=>{
  if(!event.target.closest('#complete'))return;
  attempted=true;previousStep=getState().step;refresh();
  const first=controls().find(isEmpty);
  if(!first)return;
  event.preventDefault();event.stopImmediatePropagation();
  document.getElementById('activity-message').textContent='Completa los campos marcados en rojo para continuar.';
  first.setAttribute('tabindex',first.tagName==='CANVAS'?'0':first.getAttribute('tabindex')||'0');
  first.focus({preventScroll:true});first.scrollIntoView({behavior:'smooth',block:'center'});
 },true);
 document.addEventListener('input',refresh);
 document.addEventListener('change',()=>setTimeout(refresh,0));
 return refresh;
}
