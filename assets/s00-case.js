/* Section 00 case exercises: FMD in Indonesia, 2022. Facts from Kedang et al. 2025 (BMC Vet Res 21:180) and Susila et al. 2023 (J Appl Anim Res 51:487). */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ---------- Exercise 0.1: build the triad ---------- */
const TRI_CORNERS={host:'Host',agent:'Agent',env:'Environment'};
const TRI_CARDS=[
 {id:1,c:'host',s:'Cattle: 96.4% of animals',t:'Cattle made up 96.4% of the 308,148 animals affected in Java in 2022 and 2023. Buffalo were 1.8%, goats 0.8% and sheep 1.0%.',w:'Cattle and buffalo were the most affected species. The species affected is a host factor.'},
 {id:2,c:'host',s:'No vaccination since 1985',t:'Indonesia stopped FMD vaccination after 1985 and had been free since 1986. The herds had no immunity.',w:'Immunity belongs to the host. A naive population with no vaccine protection let the disease spread fast.'},
 {id:3,c:'host',s:'Goats and sheep: mild signs',t:'Goats and sheep often show mild or no signs, and few were reported as cases. They could move virus without being noticed.',w:'Differences between species in signs are host factors. Silent infection in small ruminants can cause under-reporting and might spread virus over long distances.'},
 {id:4,c:'host',s:'Large cattle population',t:'Subdistricts with more cattle had higher odds of an outbreak. A ten-fold increase in cattle raised the odds 3.41 times.',w:'More susceptible animals mean more chances of contact. Here population size is treated as a host factor.'},
 {id:5,c:'agent',s:'FMDV serotype O, Ind-2001e',t:'The virus was serotype O, topotype ME-SA, lineage Ind-2001e.',w:'The causative virus and its type are the agent.'},
 {id:6,c:'agent',s:'Same virus in many places',t:'26 viruses from Aceh, Java, Kalimantan and West Nusa Tenggara were 99.6% identical in the VP1 gene.',w:'A near-identical virus in many places points to one introduction that then spread. This describes the agent.'},
 {id:7,c:'agent',s:'Virus in lesions, saliva, blood',t:'Virus was found in swabs of oral and foot lesions, in saliva and in blood plasma of sick cattle and goats.',w:'The agent is shed in lesions and saliva, so contact with sick animals is a source of infection.'},
 {id:8,c:'env',s:'Livestock markets',t:'Subdistricts with a livestock market had 2.59 times higher odds of an outbreak.',w:'Markets bring animals from many places together. Place, trade and management are environment factors.'},
 {id:9,c:'env',s:'Slaughterhouses',t:'Subdistricts with a slaughterhouse had 1.46 times higher odds of an outbreak.',w:'Slaughterhouses draw animals from many places and can spread virus through handling and cross-contamination. This is an environment factor.'},
 {id:10,c:'env',s:'Eid al-Adha trade, May to July',t:'Animal movement before Eid al-Adha may have helped the spread. 12 of 16 clusters occurred from May to July.',w:'Season, trade and animal movement are environment and management factors.'},
 {id:11,c:'env',s:'Rainfall',t:'Subdistricts with higher annual rainfall had lower odds of an outbreak than those with under 2,000 mm.',w:'Climate is an environment factor.'},
 {id:12,c:'env',s:'Late response, no vaccine stock',t:'Movement restrictions began in early May and mass vaccination in late June. Vaccine had to be imported, and few people had ever seen FMD.',w:'Control measures, resources and awareness make up the setting around the animals. They are environment factors.'},
 {id:13,c:'env',s:'Illegal live-animal trade (possible)',t:'How the virus entered is not confirmed. One possibility is illegal trade of live animals from endemic areas in Southeast Asia.',w:'Movement of animals across borders is an environment factor. It is a possible route, not a proven source.'}
];
function initTriadExercise(){
  const host=$('#exTriBoard');if(!host)return;
  let place={},own=[],checked=false;
  const order=TRI_CARDS.map(c=>c.id).sort((a,b)=>((a*7)%13)-((b*7)%13));
  const zoneHTML=k=>{
    const chips=TRI_CARDS.filter(c=>place[c.id]===k).map(c=>{
      const cls=checked?(c.c===k?'ok':'bad'):'';
      return `<button type="button" class="zc ${cls}" data-id="${c.id}" ${checked?'disabled':''} title="${checked?'':'Click to move back'}">${esc(c.s)}${checked&&c.c!==k?' → '+TRI_CORNERS[c.c]:''}</button>`;}).join('')
      +own.filter(o=>o.k===k).map(o=>`<span class="zc own">${esc(o.t)}</span>`).join('');
    return `<div class="zone z-${k}"><h4>${TRI_CORNERS[k]}</h4><div class="zl">${chips||'<span class="muted">Empty</span>'}</div></div>`;};
  const draw=()=>{
    host.innerHTML=`<svg class="tlines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="50" y1="14" x2="22" y2="86"/><line x1="50" y1="14" x2="78" y2="86"/><line x1="22" y1="86" x2="78" y2="86"/></svg>${zoneHTML('agent')}${zoneHTML('host')}${zoneHTML('env')}`;
    $$('.zc[data-id]',host).forEach(b=>b.addEventListener('click',()=>{if(checked)return;delete place[b.dataset.id];draw();}));
    const left=order.filter(id=>!place[id]);
    $('#exTriCards').innerHTML=left.length?left.map(id=>{const c=TRI_CARDS.find(x=>x.id===id);
      return `<div class="fc"><p>${esc(c.t)}</p><div class="fb" role="group" aria-label="Place this factor">${Object.keys(TRI_CORNERS).map(k=>`<button type="button" class="dc" data-id="${id}" data-k="${k}">${TRI_CORNERS[k]}</button>`).join('')}</div></div>`;}).join('')
      :(checked?'':'<p class="note"><b>All 13 factors placed.</b> Add your own factor if you like, then press Check my triad.</p>');
    $$('#exTriCards .dc').forEach(b=>b.addEventListener('click',()=>{place[b.dataset.id]=b.dataset.k;draw();}));
    $('#exTriCheck').disabled=checked||left.length>0;
    $('#exTriCount').textContent=`${TRI_CARDS.length-left.length} of ${TRI_CARDS.length} placed`;
    let o='';
    if(checked){
      const ok=TRI_CARDS.filter(c=>place[c.id]===c.c).length;
      o+=`<div class="callout" style="border-left-color:var(--accent);background:var(--accent-soft)"><b>${ok} of ${TRI_CARDS.length} in the right corner.</b> Putting it together: a highly infectious virus (agent) met naive cattle (host) in a setting of busy markets, animal movement and a late response (environment). Break any one corner and the spread slows.</div>`;
      o+=`<div class="tw"><table class="labt"><thead><tr><th>Factor</th><th>Your corner</th><th>Answer</th><th>Why</th></tr></thead><tbody>${TRI_CARDS.map(c=>{const g=place[c.id]===c.c;
        return `<tr><td><b>${esc(c.s)}</b></td><td>${TRI_CORNERS[place[c.id]]} <span class="tag ${g?'ok':'x'}">${g?'Right':'Not right'}</span></td><td>${TRI_CORNERS[c.c]}</td><td>${esc(c.w)}</td></tr>`;}).join('')}</tbody></table></div>`;
      if(own.length)o+=`<p class="note"><b>Your own factors.</b> ${own.map(x=>`${esc(x.t)} (${TRI_CORNERS[x.k]})`).join('; ')}. Not graded. Ask yourself how each one links to the outbreak and what you could do about it.</p>`;
      o+=`<p class="note">Some factors can sit in more than one corner. Cattle population, for example, can be read as host or as environment. What matters is that you can explain your choice.</p>`;
    }
    $('#exTriOut').innerHTML=o;
  };
  $('#exTriOwnAdd').addEventListener('click',()=>{const t=$('#exTriOwn').value.trim();if(!t||checked)return;own.push({t,k:$('#exTriOwnK').value});$('#exTriOwn').value='';draw();});
  $('#exTriCheck').addEventListener('click',()=>{checked=true;draw();$('#exTriOut').scrollIntoView({block:'nearest',behavior:'smooth'});});
  $('#exTriReset').addEventListener('click',()=>{place={};own=[];checked=false;draw();});
  draw();
}

/* ---------- Exercise 0.2: sampling and test plan ---------- */
const PLAN=[
 {k:'who',h:'1. Which animals do you sample?',o:[
  {t:'Several sick animals with fever and fresh vesicles',ok:1,w:'Animals in the acute stage carry the most virus. Fresh or just-ruptured vesicles are the best source.'},
  {t:'Animals from different pens or age groups, and goats or sheep with lesions',ok:1,w:'Representative samples give a better picture of the farm. Goats and sheep may show only mild signs, so look closely.'},
  {t:'Animals with old, healed lesions only',ok:0,w:'Virus is hard to find in old lesions. If only recovered animals are available, throat (oesophageal–pharyngeal) fluid taken with a probang cup is the alternative.'},
  {t:'Healthy-looking animals only',ok:0,w:'For a suspect case, start with animals that show signs. Healthy-looking contacts are useful later, when you screen the herd.'},
  {t:'Only the first animal the farmer noticed',ok:0,w:'One animal can miss the infection and says little about how far it has spread. Submit representative samples.'}]},
 {k:'what',h:'2. Which samples do you collect?',o:[
  {t:'Epithelium or fluid from an unruptured or just-ruptured vesicle (tongue, mouth lining, feet)',ok:1,w:'This is the tissue of choice. Take about 1 g if you can.'},
  {t:'Swab of mouth lesions and saliva',ok:1,w:'Easy to collect in the field. Oral swabs made up 23 of the 26 samples in the first outbreak study.'},
  {t:'Swab of a foot or coronary band lesion',ok:1,w:'Useful when the feet have vesicles. One of the 26 samples in the first outbreak study was a foot swab.'},
  {t:'Blood, to test plasma or serum for virus',ok:1,w:'An alternative source of virus, useful when no lesion is available. Two plasma samples were used in the first outbreak study. Take it in addition to lesion samples.'},
  {t:'Throat fluid with a probang cup',ok:0,w:'This is for recovered animals or carrier checks, when lesion tissue is not available. It is not needed when fresh vesicles are present.'},
  {t:'Serum, to test for antibody only',ok:0,w:'Antibody appears later and does not show virus now, so it cannot confirm a new suspect case on its own.'}]},
 {k:'test',h:'3. Which tests do you request to keep the response on time?',o:[
  {t:'rRT-PCR on the lesion swabs or tissue',ok:1,w:'Detects viral RNA directly in clinical samples, with no cell culture. Indonesian laboratories used rRT-PCR on the 3D gene. In the first outbreak about 92% of animals with clinical signs tested positive (data not shown in the paper).'},
  {t:'Antigen lateral flow device on the farm',ok:1,w:'Gives an early signal without waiting for shipping. Confirm the result in an authorised laboratory, because a negative strip does not rule out FMD.'},
  {t:'Antigen ELISA with serotyping',ok:1,w:'Gives the serotype. But it is positive in only about 70–80% of epithelial suspensions that contain virus, so a negative needs follow-up by RT-PCR or virus isolation.'},
  {t:'VP1 sequencing, once a sample is positive',ok:1,w:'Sequencing the VP1 gene directly from clinical samples gave serotype O, lineage Ind-2001e, and helps trace the source.'},
  {t:'Virus isolation in cell culture as the first test',ok:0,w:'Too slow for first-line use. It can take up to 4 days, some viruses fail to grow, and it needs a high-containment laboratory.'},
  {t:'NSP antibody ELISA',ok:0,w:'Shows past infection, and antibody appears days after infection. Herds were unvaccinated, so a positive would point to infection, but it cannot confirm a new case quickly.'},
  {t:'Virus neutralisation test (SP antibody)',ok:0,w:'The gold standard for antibody, but slow, variable, and it needs cell culture and high containment. It does not detect virus now.'}]}
];
function initPlanExercise(){
  const host=$('#exPlan');if(!host)return;
  let checked=false;
  host.innerHTML=PLAN.map(q=>`<fieldset class="pq" data-k="${q.k}"><legend>${q.h}</legend>${q.o.map((x,i)=>`<label class="po"><input type="checkbox" data-q="${q.k}" data-i="${i}"><span class="pt">${esc(x.t)}</span><span class="pw" hidden></span></label>`).join('')}<p class="pscore" hidden></p></fieldset>`).join('');
  $('#exPlanBtn').addEventListener('click',()=>{
    if(checked)return;checked=true;let right=0,total=0;
    PLAN.forEach(q=>{let qr=0;
      q.o.forEach((x,i)=>{
        const lab=$(`input[data-q="${q.k}"][data-i="${i}"]`,host).closest('label'),cb=$('input',lab),sel=cb.checked,good=sel===!!x.ok;
        cb.disabled=true;lab.classList.add(good?'ok':'bad');if(good)qr++;
        const v=sel&&x.ok?'Good choice. ':(!sel&&x.ok?'Missed. You should take this one. ':(sel&&!x.ok?'Not the best choice. ':'Rightly skipped. '));
        const w=$('.pw',lab);w.hidden=false;w.innerHTML=`<b>${v}</b>${esc(x.w)}`;});
      right+=qr;total+=q.o.length;
      const s=$('.pscore',$(`fieldset[data-k="${q.k}"]`,host));s.hidden=false;s.innerHTML=`<b>${qr} of ${q.o.length} choices right.</b>`;});
    $('#exPlanBtn').disabled=true;
    const mine=($('#exPlanWhy').value||'').trim();
    $('#exPlanOut').innerHTML=`<div class="callout" style="border-left-color:var(--accent);background:var(--accent-soft)"><b>${right} of ${total} choices right.</b></div>
    <div class="callout" style="border-left-color:var(--good);background:var(--good-soft)"><b>Model plan</b><ul>
      <li><b>Sample:</b> several acutely sick animals from different pens, with fresh vesicles. Include goats or sheep that show lesions.</li>
      <li><b>Collect:</b> epithelium or vesicular fluid (about 1 g), plus lesion and oral swabs, and blood for virus. Put tissue in transport medium (glycerol and phosphate buffer, pH 7.2–7.6) and keep it cold.</li>
      <li><b>Send:</b> label and pack securely, and send to an authorised laboratory, such as your Disease Investigation Centre. Change clothing and disinfect equipment before the next farm.</li>
      <li><b>Test:</b> rRT-PCR first, because it works directly on the sample and is fast. Use a lateral flow strip on the farm for an early signal if you have one. Then sequence the VP1 gene to find the serotype and lineage.</li>
      <li><b>Why this keeps the response on time:</b> virus isolation can take up to 4 days, and no growth does not rule out virus. Antibody tests are late. Report the suspect case at once and restrict movement from the farm while you wait.</li>
    </ul></div>${mine?`<p class="note"><b>Your reasons.</b> ${esc(mine)}</p>`:''}`;
    $('#exPlanOut').scrollIntoView({block:'nearest',behavior:'smooth'});
  });
  $('#exPlanReset').addEventListener('click',()=>{checked=false;$$('input',host).forEach(c=>{c.checked=false;c.disabled=false;});$$('.po',host).forEach(l=>{l.classList.remove('ok','bad');$('.pw',l).hidden=true;});$$('.pscore',host).forEach(s=>s.hidden=true);$('#exPlanBtn').disabled=false;$('#exPlanOut').innerHTML='';$('#exPlanWhy').value='';});
}
initTriadExercise();initPlanExercise();
