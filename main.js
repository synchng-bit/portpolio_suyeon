(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide'),dots=$('#dots'),bar=$('#bar');
/* 1920×1080 무대 스케일 */
const fit=()=>document.documentElement.style.setProperty('--s',Math.min(innerWidth/1920,innerHeight/1080));
fit();addEventListener('resize',fit);
/* 도트 내비 + 진입 애니메이션 */
slides.forEach(s=>{const a=document.createElement('a');a.href='#'+s.id;a.dataset.t=s.dataset.title;a.setAttribute('aria-label',s.dataset.title);dots.append(a)});
const de=$$('a',dots);let cur=0;
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');cur=slides.indexOf(e.target);
    de.forEach((d,i)=>d.classList.toggle('on',i===cur));bar.style.width=((cur+1)/slides.length*100)+'%'}
}),{threshold:.5});
slides.forEach(s=>io.observe(s));
/* 키보드 */
const go=i=>slides[Math.max(0,Math.min(slides.length-1,i))].scrollIntoView({behavior:'smooth'});
addEventListener('keydown',e=>{
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(cur+1)}
  if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(cur-1)}
  if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1);
});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));
})();
/* 03 필름스트립: 드래그 · 휠 · 가장자리 호버 이동 + 관성 */
(()=>{
const st=document.getElementById('strip');if(!st)return;
const tr=st.querySelector('.track'),W=()=>parseFloat(tr.style.width)-1920;
let x=-182.85,tx=x,drag=false,sx=0,sx0=0,hover=false,mx=0,last=0,vel=0,moved=false;
const sc=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--s'))||1;
const clamp=v=>Math.max(-W(),Math.min(0,v));
st.addEventListener('pointerdown',e=>{drag=true;moved=false;sx=e.clientX;sx0=tx;st.classList.add('drag');st.setPointerCapture(e.pointerId)});
st.addEventListener('pointermove',e=>{const r=st.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;
  if(drag){const dx=(e.clientX-sx)/sc();if(Math.abs(dx)>3)moved=true;tx=clamp(sx0+dx)}});
const up=()=>{drag=false;st.classList.remove('drag')};
st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
st.addEventListener('mouseenter',()=>hover=true);st.addEventListener('mouseleave',()=>{hover=false});
st.addEventListener('wheel',e=>{const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:(e.shiftKey?e.deltaY:0);
  if(d){e.preventDefault();tx=clamp(tx-d/sc())}},{passive:false});
const loop=()=>{
  if(!drag&&hover){const edge=.18;if(mx<edge)tx=clamp(tx+(edge-mx)/edge*14);else if(mx>1-edge)tx=clamp(tx-(mx-(1-edge))/edge*14)}
  x+=(tx-x)*.12;tr.style.transform=`translate3d(${x.toFixed(2)}px,0,0)`;requestAnimationFrame(loop)};
loop();
})();
/* 커스텀 커서 */
(()=>{
if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
const root=document.documentElement,c=document.createElement('div'),d=document.createElement('div');
c.className='cur';c.innerHTML='<i><b></b></i>';d.className='cur-dot';document.body.append(c,d);root.classList.add('cc');
const lab=c.querySelector('b');let x=-100,y=-100,cx=x,cy=y,shown=false;
addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;if(!shown){cx=x;cy=y;shown=true;c.classList.add('on');d.classList.add('on')}
  d.style.transform=`translate(${x}px,${y}px)`;
},{passive:true});
addEventListener('pointerdown',()=>c.classList.add('down'));addEventListener('pointerup',()=>c.classList.remove('down'));
document.addEventListener('mouseleave',()=>{c.classList.remove('on');d.classList.remove('on');shown=false});
const tick=()=>{cx+=(x-cx)*.16;cy+=(y-cy)*.16;c.style.transform=`translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`;requestAnimationFrame(tick)};tick();
})();

/* LINK ON 3D 틸트 */
(()=>{
if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
const max=12,sel='#s5 .shot.d3,#s6 .shot';
document.addEventListener('pointermove',e=>{
  const el=e.target.closest&&e.target.closest(sel);if(!el)return;
  const r=el.getBoundingClientRect(),nx=((e.clientX-r.left)/r.width)*2-1,ny=((e.clientY-r.top)/r.height)*2-1;
  el.style.setProperty('--ry',(nx*max).toFixed(2)+'deg');el.style.setProperty('--rx',(-ny*max).toFixed(2)+'deg');
},{passive:true});
document.addEventListener('pointerout',e=>{const el=e.target.closest&&e.target.closest(sel);if(el&&!el.contains(e.relatedTarget)){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')}});
})();
