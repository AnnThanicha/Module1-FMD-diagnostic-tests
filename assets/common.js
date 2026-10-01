/* Shared helpers for every page. Classic script: top-level names are shared with the section scripts. */
/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const f1=x=>isFinite(x)?(x*100).toFixed(1)+'%':'n/a';
const nf=x=>Math.round(x).toLocaleString('en-US');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function wilson(k,n){if(!n)return[0,1];const z=1.96,p=k/n,z2=z*z,d=1+z2/n,c=(p+z2/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z2/(4*n*n))/d;return[Math.max(0,c-h),Math.min(1,c+h)];}
const meas=c=>({se:c.tp/(c.tp+c.fn),sp:c.tn/(c.tn+c.fp),ppv:c.tp/(c.tp+c.fp),npv:c.tn/(c.tn+c.fn)});
const fromRates=(se,sp,p,N)=>{const inf=N*p;return{tp:inf*se,fn:inf*(1-se),fp:(N-inf)*(1-sp),tn:(N-inf)*sp};};
const pv=(se,sp,p)=>{const a=se*p,b=(1-sp)*(1-p),c=(1-se)*p,d=sp*(1-p);return{ppv:a/(a+b),npv:d/(c+d)};};
const kpi=(a,b,c)=>`<div class="kpi"><span>${a}</span><b>${b}</b><em>${c||''}</em></div>`;
function ttHTML(c,l){
  const t={tp:Math.round(c.tp),fp:Math.round(c.fp),fn:Math.round(c.fn),tn:Math.round(c.tn)};
  return `<div class="tt" role="table" aria-label="2 by 2 table"><div class="h"></div><div class="h">${l.c1}</div><div class="h">${l.c2}</div><div class="h">Total</div>
  <div class="h">${l.r1}</div><div class="c tp">${nf(t.tp)}<small>TRUE POSITIVE</small></div><div class="c fp">${nf(t.fp)}<small>FALSE POSITIVE</small></div><div class="tot">${nf(t.tp+t.fp)}</div>
  <div class="h">${l.r2}</div><div class="c fn">${nf(t.fn)}<small>FALSE NEGATIVE</small></div><div class="c tn">${nf(t.tn)}<small>TRUE NEGATIVE</small></div><div class="tot">${nf(t.fn+t.tn)}</div>
  <div class="h">Total</div><div class="tot">${nf(t.tp+t.fn)}</div><div class="tot">${nf(t.fp+t.tn)}</div><div class="tot">${nf(t.tp+t.fp+t.fn+t.tn)}</div></div>`;
}
const setv=(id,v)=>{const el=$('#'+id);el.value=v;el.dispatchEvent(new Event('input'));};
function chips(host,fn){$$('button',host).forEach(b=>b.addEventListener('click',()=>{$$('button',host).forEach(x=>x.setAttribute('aria-pressed',x===b));fn(b);}));}
const unpress=host=>$$('button',host).forEach(x=>x.setAttribute('aria-pressed','false'));

/* ---------- generic line chart with hover crosshair ---------- */
function lineChart(host,c){
  const W=680,H=300,m={l:48,r:18,t:16,b:46},iw=W-m.l-m.r,ih=H-m.t-m.b;
  const tx=c.log?Math.log10:(v=>v),inv=c.log?(v=>Math.pow(10,v)):(v=>v),x0=tx(c.x0),x1=tx(c.x1);
  const X=v=>m.l+(tx(v)-x0)/(x1-x0)*iw,Y=v=>m.t+ih-(v-c.y0)/(c.y1-c.y0)*ih;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.aria}">`;
  c.yt.forEach(t=>{s+=`<line class="grid" x1="${m.l}" x2="${W-m.r}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${m.l-8}" y="${Y(t)+4}" text-anchor="end">${t}</text>`;});
  c.xt.forEach(t=>{s+=`<line class="axis" x1="${X(t)}" x2="${X(t)}" y1="${m.t+ih}" y2="${m.t+ih+4}"/><text x="${X(t)}" y="${m.t+ih+18}" text-anchor="middle">${t}</text>`;});
  s+=`<line class="axis" x1="${m.l}" x2="${W-m.r}" y1="${m.t+ih}" y2="${m.t+ih}"/>`;
  s+=`<text x="${m.l+iw/2}" y="${H-6}" text-anchor="middle">${c.xl}</text><text transform="rotate(-90)" x="${-(m.t+ih/2)}" y="13" text-anchor="middle">${c.yl}</text>`;
  if(c.ref)s+=`<line class="ref" x1="${m.l}" x2="${W-m.r}" y1="${Y(c.ref.y)}" y2="${Y(c.ref.y)}" stroke-dasharray="4 4"/><text x="${W-m.r}" y="${Y(c.ref.y)-5}" text-anchor="end">${c.ref.l}</text>`;
  const n=c.n||120,a0=tx(c.xs0!=null?c.xs0:c.x0),xs=Array.from({length:n+1},(_,i)=>inv(a0+(x1-a0)*i/n));
  c.series.forEach(se=>{let d='',pen=false;xs.forEach(v=>{const y=se.f(v);if(!isFinite(y)){pen=false;return;}d+=(pen?'L':'M')+X(v).toFixed(1)+' '+Y(y).toFixed(1);pen=true;});s+=`<path class="ln l${se.cls}" d="${d}"/>`;});
  c.series.forEach(se=>{const y=se.f(c.mark);if(isFinite(y))s+=`<circle class="f${se.cls} ring" cx="${X(c.mark)}" cy="${Y(y)}" r="5"/>`;});
  s+=`<g class="hv" style="display:none"><line class="axis" y1="${m.t}" y2="${m.t+ih}"/>${c.series.map(se=>`<circle class="f${se.cls} ring" r="5"/>`).join('')}</g><rect x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent" style="cursor:crosshair"/></svg><div class="tip" hidden></div>`;
  host.innerHTML=s;
  const svg=$('svg',host),hv=$('.hv',host),tip=$('.tip',host),circ=$$('circle',hv),ln=$('line',hv);
  const show=ev=>{const r=svg.getBoundingClientRect(),px=(ev.clientX-r.left)/r.width*W;let v=inv(x0+(px-m.l)/iw*(x1-x0));v=clamp(v,c.xs0!=null?c.xs0:c.x0,c.x1);if(c.snap)v=Math.round(v);
    const ys=c.series.map(se=>se.f(v));hv.style.display='';ln.setAttribute('x1',X(v));ln.setAttribute('x2',X(v));
    circ.forEach((e,i)=>{if(isFinite(ys[i])){e.setAttribute('cx',X(v));e.setAttribute('cy',Y(ys[i]));e.style.display='';}else e.style.display='none';});
    tip.hidden=false;tip.innerHTML=c.tip(v,ys);const hr=host.getBoundingClientRect();let L=ev.clientX-hr.left+host.scrollLeft+14;
    if(L+tip.offsetWidth>host.clientWidth+host.scrollLeft-4)L=ev.clientX-hr.left+host.scrollLeft-tip.offsetWidth-14;tip.style.left=Math.max(4,L)+'px';tip.style.top='10px';};
  const rect=$('rect',svg);rect.addEventListener('pointermove',show);rect.addEventListener('pointerdown',show);rect.addEventListener('pointerleave',()=>{hv.style.display='none';tip.hidden=true;});
}

/* ---------- quiz engines ---------- */
function quiz(host,items,o){
  const src=items;let first=0,answered=0;
  const head=o?`<div class="step"><span class="tag ${o.cls||'a'}">${o.tag}</span><h3>${o.title}</h3></div>`:'';
  items=items.map((it,i)=>{const r=(i*2+1)%it.o.length;return{q:it.q,o:it.o.slice(r).concat(it.o.slice(0,r))};});
  host.innerHTML=head+items.map((it,i)=>`<div class="scard"><h3>${it.q}</h3><div class="opts">${it.o.map((x,j)=>`<button class="opt" type="button">${x[0]}</button>`).join('')}</div><div class="why" hidden></div></div>`).join('')+'<div class="score"></div>'+(o&&o.reset?'<div class="controls"><button class="ghost" type="button" data-qreset>Reset quiz</button></div>':'');
  const sc=$('.score',host),upd=()=>{sc.textContent=`${answered} of ${items.length} answered · ${first} correct on first try`;};upd();
  $$('.scard',host).forEach((card,i)=>{let tries=0,done=false;$$('.opt',card).forEach((b,j)=>b.addEventListener('click',()=>{if(done)return;tries++;const x=items[i].o[j],w=$('.why',card);w.hidden=false;w.innerHTML=(x[1]?'<b>Correct.</b> ':'<b>Not quite.</b> ')+x[2];
    if(x[1]){b.classList.add('right');done=true;answered++;if(tries===1)first++;$$('.opt',card).forEach(y=>y.disabled=true);upd();}else{b.classList.add('wrong');b.disabled=true;}}));});
  if(o&&o.reset)$('[data-qreset]',host).addEventListener('click',()=>quiz(host,src,o));
}
function multi(host,c){
  host.innerHTML=`<div class="scard"><div class="step"><span class="tag a">${c.tag}</span><h3>${c.title}</h3></div><div class="opts">${c.items.map(it=>`<button class="opt" type="button" aria-pressed="false">${it.t}</button>`).join('')}</div><div class="controls"><button class="btn" type="button">Check selection</button><span class="score"></span></div></div>`;
  const bs=$$('.opt',host),go=$('.btn',host),sc=$('.score',host);let locked=false;
  bs.forEach(b=>b.addEventListener('click',()=>{if(locked)return;const on=!b.classList.contains('pick');b.classList.toggle('pick',on);b.setAttribute('aria-pressed',on);}));
  go.addEventListener('click',()=>{
    if(locked){locked=false;bs.forEach(b=>{b.className='opt';b.setAttribute('aria-pressed','false');const s=$('small',b);if(s)s.remove();});sc.textContent='';go.textContent='Check selection';return;}
    locked=true;let good=0;
    bs.forEach((b,i)=>{const it=c.items[i],sel=b.classList.contains('pick'),ok=sel===it.ok;if(ok)good++;b.classList.remove('pick');b.classList.add(ok?'right':'wrong');
      const lab=it.ok?(sel?'Genuine limitation. ':'Missed: this is a genuine limitation. '):(sel?'Not a limitation. ':'Correctly left out. ');
      b.insertAdjacentHTML('beforeend',`<small style="display:block;margin-top:4px;color:var(--muted)"><b>${lab}</b>${it.why}</small>`);});
    sc.textContent=`${good} of ${c.items.length} judged correctly`;go.textContent='Reset';
  });
}
function wireChecks(){
  $$('[data-check]').forEach(btn=>btn.addEventListener('click',()=>{
    const box=$('#'+btn.dataset.check);let ok=0,tot=0;
    $$('input[data-ans]',box).forEach(inp=>{tot++;const fb=inp.parentElement.querySelector('.fb'),raw=inp.value.trim();
      if(raw===''){fb.textContent='enter a value';fb.className='fb no';return;}
      const good=Math.abs(parseFloat(raw)-parseFloat(inp.dataset.ans))<=parseFloat(inp.dataset.tol||0);
      if(good){ok++;fb.textContent='✓ '+inp.dataset.ans;fb.className='fb ok';}else{fb.textContent='✗ not yet';fb.className='fb no';}});
    if(btn.dataset.check==='chk21'){const all=ok===tot;$('#r21').textContent=all?'All four correct.':'Not yet. Ambiguous ELISA sera count as negative.';
      $('#tt21').innerHTML=all?ttHTML({tp:20,fp:0,fn:1,tn:11},{r1:'LFA positive',r2:'LFA negative',c1:'ELISA positive',c2:'ELISA negative or ambiguous'}):'';}
    if(btn.dataset.check==='chk22')$('#n22').hidden=ok!==tot;
  }));
}

/* ---------- progress ---------- */
var SECS=['basics','lo1','lo2','lo3','lo4','lo5'];
function initProgress(){
  let done=new Set();try{done=new Set(JSON.parse(store.get('fmd-done')||'[]'))}catch(e){}
  const paint=()=>{$$('.donebtn').forEach(b=>{const on=done.has(b.dataset.sec);b.setAttribute('aria-pressed',on);b.textContent=on?'Done ✓':'Mark done';});
    $$('#nav a[data-s]').forEach(a=>a.classList.toggle('done',done.has(a.dataset.s)));$('#prog').textContent=`${done.size} / ${SECS.length}`;};
  $$('.donebtn').forEach(b=>b.addEventListener('click',()=>{const s=b.dataset.sec;done.has(s)?done.delete(s):done.add(s);store.set('fmd-done',JSON.stringify([...done]));paint();}));paint();
}


