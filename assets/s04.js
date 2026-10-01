/* Section 04: surveillance and timing */
/* ---------- 5. surveillance ---------- */
function initSurv(){
  quiz($('#q51'),[
   {q:'A dairy cooperative records each month the percentage of cows with positive NSP results and plots the trend. This is:',o:[['Monitoring: repeated measurement of a health indicator.',true,'Nothing in the description links the numbers to a defined action.'],['Surveillance: collection, analysis and action.',false,'Surveillance connects data to decisions, such as thresholds that trigger investigation. That link is missing here.'],['Proof of freedom from infection.',false,'Repeated measurement in the same herd does not demonstrate freedom.']]},
   {q:'A regional programme collects vesicular-disease reports, analyses increases, and investigates when an alert threshold is reached. This is:',o:[['Surveillance: collection, analysis, interpretation and communication connected to action.',true,'The alert threshold and investigation are the link to decisions.'],['Monitoring only.',false,'Monitoring measures repeatedly but does not by itself trigger action.'],['A single diagnostic test.',false,'It is a system that may use several tests.']]},
   {q:'A random survey is designed so that it would detect FMD with 95% probability if at least 5% of animals were infected. All results are negative. What can you say?',o:[['Infection at or above that level is unlikely, but lower-level infection is not excluded.',true,'The design probability describes detection of infection at the design prevalence. It is not the probability that the herd is free.'],['The herd is proven free of FMD.',false,'A negative survey never proves zero infection.'],['There is a 95% probability the herd is completely free.',false,'This is the classic misreading of the design calculation.']]}
  ],{tag:'Task 4.1',title:'Monitoring, surveillance and freedom',cls:'v',reset:true});
  /* freedom calculator */
  const g=id=>$('#'+id);let quiet=false;
  function fd(){
    const dp=+g('fdP').value/100,se=+g('fdS').value/100,n=+g('fdN').value,q=dp*se;
    g('fdPO').textContent=(dp*100).toFixed(1)+'%';g('fdSO').textContent=(se*100).toFixed(1)+'%';g('fdNO').textContent=n;
    const P=x=>(1-Math.pow(1-q,x))*100,need=t=>Math.ceil(Math.log(1-t)/Math.log(1-q));
    lineChart(g('fdChart'),{aria:'Probability of detecting infection against number of animals sampled',x0:1,x1:300,y0:0,y1:100,xt:[1,50,100,150,200,250,300],yt:[0,20,40,60,80,100],xl:'Animals sampled (n)',yl:'Probability of at least one positive (%)',n:299,snap:true,
      ref:{y:95,l:'95%'},series:[{cls:1,f:P}],mark:n,tip:(x,ys)=>`n = <b>${x}</b><br>Detection probability <b>${ys[0].toFixed(1)}%</b>`});
    g('fdK').innerHTML=kpi('Chance to detect, n = '+n,P(n).toFixed(1)+'%','if infection is at design prevalence')+kpi('Chance of missing it',(100-P(n)).toFixed(1)+'%','')+kpi('Smallest n for 95%',need(.95),'')+kpi('Smallest n for 99%',need(.99),'');
    g('fdTxt').innerHTML=`At these settings: n = 10 gives <b>${P(10).toFixed(1)}%</b>, n = 30 gives <b>${P(30).toFixed(1)}%</b>, n = 65 gives <b>${P(65).toFixed(2)}%</b>, n = 100 gives <b>${P(100).toFixed(1)}%</b>. Exactly 95% is first reached at n = ${need(.95)} for these settings.`;
  }
  ['fdP','fdS','fdN'].forEach(id=>g(id).addEventListener('input',()=>{fd();}));
  fd();

  /* timing */
  function tm(){
    const d=+g('tmD').value,w=+g('tmW').value;g('tmDO').textContent='day '+d;g('tmWO').textContent='day '+w;
    const W=680,H=130,ml=20,mr=20,iw=W-ml-mr,X=v=>ml+v/45*iw;
    let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Timeline from exposure to day 45 showing when the test becomes informative">`;
    s+=`<rect x="${X(0)}" y="30" width="${X(w)-X(0)}" height="34" style="fill:var(--warn-soft)"/><rect x="${X(w)}" y="30" width="${X(45)-X(w)}" height="34" style="fill:var(--good-soft)"/>`;
    s+=`<text x="${X(w/2)}" y="51" text-anchor="middle" class="lbl">${w>=8?'not yet detectable':''}</text><text x="${X((w+45)/2)}" y="51" text-anchor="middle" class="lbl">test informative</text>`;
    for(let t=0;t<=45;t+=5)s+=`<line class="axis" x1="${X(t)}" x2="${X(t)}" y1="64" y2="68"/><text x="${X(t)}" y="82" text-anchor="middle">${t}</text>`;
    s+=`<line class="axis" x1="${X(0)}" x2="${X(45)}" y1="64" y2="64"/><text x="${X(22.5)}" y="122" text-anchor="middle">Days after exposure</text>`;
    s+=`<circle cx="${X(0)}" cy="47" r="6" style="fill:var(--accent)" class="ring"/><text x="${X(0)+8}" y="20" text-anchor="start" class="lbl">Exposed</text>`;
    s+=`<circle cx="${X(d)}" cy="47" r="7" class="f2 ring"/><text x="${clamp(X(d),60,W-60)}" y="20" text-anchor="middle" class="lbl">${d===0?'':'Sampled day '+d}</text></svg>`;
    g('tmSvg').innerHTML=s;
    g('tmTxt').innerHTML=d<w?`<b>A negative result on day ${d} cannot exclude recent infection.</b> Under this assumption the antibody test becomes informative from day ${w}. Sample again later, or use a test that detects virus.`:`<b>Day ${d} falls inside the assumed informative window.</b> A negative now carries more weight, but it still depends on the sensitivity of the test.`;
  }
  ['tmD','tmW'].forEach(id=>g(id).addEventListener('input',tm));tm();
}

initSurv();
