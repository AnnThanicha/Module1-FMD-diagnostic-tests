/* Section 00: triad, need, SP vs NSP */
/* ---------- 0. story: triad, impact, jobs, DIVA herd ---------- */
const TRI={
 host:{t:'Host: who can get it',ul:['Cloven-hoofed animals: cattle, pigs, sheep, goats, buffalo, yaks and wild species. African buffalo are the reservoir of the SAT serotypes.','Cattle are most sensitive to airborne virus and show clear signs. Pigs need a much higher dose to be infected but shed very large amounts. Sheep and goats can be mild or silent.','In naive herds nearly every animal gets sick. Adult deaths are about 1–5%, but young animals die far more often (20% or more).','After recovery, 15–50% of cattle carry virus in the throat for over 28 days, usually up to 6 months. Pigs do not become carriers.'],link:'Silent infections and carriers mean clinical inspection misses animals. You need laboratory tests, and for carriers a throat (probang) sample.'},
 agent:{t:'Agent: the virus',ul:['FMD virus, genus <i>Aphthovirus</i>, family Picornaviridae.','Seven serotypes: O, A, C, SAT 1, SAT 2, SAT 3, Asia 1. Immunity to one does not protect against another. Serotype C has not been reported since 2004.','Many strains circulate within each serotype. The 2022 Indonesian virus was O/ME-SA/Ind-2001e (<a href="https://dx.doi.org/10.54203/scil.2024.wvj5" target="_blank" rel="noopener">Jauhari et al. 2024</a>).','Incubation in cattle is about 2–14 days, and the WOAH Code uses 14 days. Some animals shed virus up to 4 days before signs.','The virus is inactivated by heat above 50 °C and by pH below 6 or above 9.'],link:'The strain decides which vaccine works, so you need a test that gives the serotype. NSP antibody tests do not, because NSPs are shared by all serotypes.'},
 env:{t:'Environment: how it moves',ul:['Direct contact, and airborne spread over short to long distances depending on weather. WOAH gives up to 60 km overland and 300 km over sea in temperate conditions.','Hands, clothing, vehicles and equipment carry it. So do untreated meat and milk, semen, and moving livestock.','It persists on fodder and in the environment for up to a month when cool and moist, but only days to 1–2 weeks at 20 °C or above.','Indonesia 2022: imported cattle from non-FMD-free countries were the strongly assumed source. Movement limits were announced around the Eid al-Adha trade peak.'],link:'Movement spreads virus faster than a central laboratory can report. Fast, pen-side tests and clear sampling plans matter.'}
};
function initTriad(){
  const nodes=$$('#triSvg .nd');
  const draw=k=>{nodes.forEach(n=>n.setAttribute('aria-pressed',n.dataset.k===k));const d=TRI[k];
    $('#triOut').innerHTML=`<h4>${d.t}</h4><ul class="kl">${d.ul.map(x=>`<li>${x}</li>`).join('')}</ul><p class="note"><b>Diagnostic link.</b> ${d.link}</p>`;};
  nodes.forEach(n=>{n.addEventListener('click',()=>draw(n.dataset.k));n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();draw(n.dataset.k);}});});
  draw('host');
}
const HERD=[[1,'vac'],[2,'naive'],[3,'inf'],[4,'vac'],[5,'vinf'],[6,'vac'],[7,'naive'],[8,'vinf0'],[9,'vac'],[10,'naive'],[11,'inf'],[12,'vac']];
const HTRUTH={naive:['Never vaccinated, never infected','v'],vac:['Vaccinated only','a'],inf:['Infected, not vaccinated','x'],vinf:['Vaccinated, then infected','w'],vinf0:['Vaccinated, then infected','w']};
function initHerd(){
  const crude=false,sp=true,nsp=true;let checked=false,dec={};
  const spRes=h=>h!=='naive';
  const nspRes=(h,i)=>h==='inf'||h==='vinf'||(crude&&h==='vac'&&(i===0||i===5));
  const truth=h=>h==='naive'?'none':(h==='vac'?'vac':'inf');
  const reading=(h,i)=>nspRes(h,i)?'inf':(spRes(h)?'vac':'none');
  const OPT=[['none','Neither'],['vac','Vaccinated'],['inf','Infected']];
  const NAME={none:'Neither vaccinated nor infected',vac:'Vaccinated only',inf:'Infected'};
  const why=(h,i)=>{
    if(h==='naive')return 'SP negative and NSP negative. No antibody to the virus shell and none to NSP, so this cow was never vaccinated and never infected.';
    if(h==='vac')return 'SP positive and NSP negative. Antibody to the shell only, which is the pattern after vaccination.';
    if(h==='inf')return 'SP positive and NSP positive. Infection makes antibody to both the shell and NSP, so NSP positive points to infection.';
    if(h==='vinf')return 'SP positive and NSP positive. This cow was vaccinated and then infected. NSP antibody shows infection whether or not the animal was vaccinated.';
    return 'Tricky case. SP positive and NSP negative reads as vaccinated only, but this cow was vaccinated and then infected. Little virus replicated, so it made no NSP antibody. The NSP test missed it. Use herd-level results and virus detection.';
  };
  const decided=()=>HERD.filter(([n])=>dec[n]).length;
  const ready=()=>sp&&nsp;
  const draw=()=>{
    $('#herd').innerHTML=HERD.map(([n,h])=>{
      const i=n-1,r=(on,res)=>`<span class="rs ${on&&res?'p':''}">${on?(res?'+':'−'):'?'}</span>`;
      const ok=checked&&dec[n]===truth(h);
      const btns=OPT.map(([k,l])=>{
        let c='dc';
        if(checked){if(k===truth(h))c+=' right';else if(dec[n]===k)c+=' wrong';}
        return `<button type="button" class="${c}" data-n="${n}" data-k="${k}" aria-pressed="${dec[n]===k}" ${(!ready()||checked)?'disabled':''}>${l}</button>`;}).join('');
      return `<div class="an ${checked?(ok?'ok':'bad'):''}"><b>Cow ${n}${checked?(ok?' ✓':' ✗'):''}</b><div class="rr"><span class="rs">SP</span>${r(sp,spRes(h))}<span class="rs">NSP</span>${r(nsp,nspRes(h,i))}</div><div class="dg" role="group" aria-label="Your decision for cow ${n}">${btns}</div></div>`;}).join('');
    $$('#herd .dc').forEach(b=>b.addEventListener('click',()=>{if(checked||!ready())return;dec[+b.dataset.n]=b.dataset.k;draw();}));
    const all=decided()===12;
    $('#checkH').disabled=!(ready()&&all&&!checked);
    let o='';
    if(!checked){o+=`<p class="note"><b>${decided()} of 12 decided.</b> ${all?'Press Check my answers.':'Choose for every cow, then press Check my answers.'}</p>`;}
    if(sp&&!checked){const k=HERD.filter(([n,h])=>spRes(h)).length;o+=`<p class="note"><b>SP test:</b> ${k} of 12 positive. Vaccinated and infected animals look the same here, so the SP test alone cannot say who is infected.</p>`;}
    if(checked){
      const sc=HERD.filter(([n,h])=>dec[n]===truth(h)).length,best=HERD.filter(([n,h])=>reading(h,n-1)===truth(h)).length;
      o+=`<div class="callout" style="border-left-color:var(--accent);background:var(--accent-soft)"><b>You got ${sc} of 12.</b> Even a perfect reading of these two tests gives ${best} of 12, because ${12-best} cow${12-best===1?'':'s'} ${12-best===1?'gives':'give'} a misleading pattern. Those are marked Tricky below.</div>`;
      o+=`<div class="tw"><table class="labt"><thead><tr><th>Cow</th><th>SP / NSP</th><th>Your call</th><th>Answer</th><th>Why</th></tr></thead><tbody>${HERD.map(([n,h])=>{const i=n-1,ok=dec[n]===truth(h);
        return `<tr><td><b>${n}</b></td><td>${spRes(h)?'+':'−'} / ${nspRes(h,i)?'+':'−'}</td><td>${NAME[dec[n]]} <span class="tag ${ok?'ok':'x'}">${ok?'Right':'Not right'}</span></td><td><span class="tag ${HTRUTH[h][1]}">${HTRUTH[h][0]}</span></td><td>${why(h,i)}</td></tr>`;}).join('')}</tbody></table></div>`;
      const fl=HERD.filter(([n,h])=>nspRes(h,n-1)),tp=fl.filter(([n,h])=>truth(h)==='inf').length,fp=fl.length-tp,inf=HERD.filter(([n,h])=>truth(h)==='inf').length,ms=inf-tp;
      o+=`<div class="kpis" style="grid-template-columns:repeat(4,1fr)">${kpi('NSP positive',fl.length+' of 12','flagged as infected')}${kpi('Truly infected',tp,'of '+fl.length+' flagged')}${kpi('False alarms',fp,'none here')}${kpi('Missed',ms,'infected but NSP-negative')}</div><p class="note">Among the ${inf} infected animals the NSP test found ${tp} (sensitivity ${f1(tp/inf)}). Of the ${fl.length} it flagged, ${tp} were infected (positive predictive value ${f1(tp/fl.length)}). ${ms?'The missed animal was vaccinated before it was infected.':''}</p>`;
    }
    $('#herdOut').innerHTML=o;};
  const reset=()=>{checked=false;dec={};draw();};
  $('#checkH').addEventListener('click',()=>{if(ready()&&decided()===12){checked=true;draw();const t=$('#herdOut');if(t&&t.scrollIntoView)t.scrollIntoView({block:'nearest',behavior:'smooth'});}});
  $('#resetH').addEventListener('click',reset);
  draw();
}

initTriad();initHerd();
