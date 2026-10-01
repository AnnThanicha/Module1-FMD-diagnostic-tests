/* Section 05: combining tests */
/* ---------- 6. combination ---------- */
function combine(a,b,k){
  const covSe=k*(Math.min(a.se,b.se)-a.se*b.se),covSp=k*(Math.min(a.sp,b.sp)-a.sp*b.sp);
  const seAnd=a.se*b.se+covSe,spPar=a.sp*b.sp+covSp;
  return{par:{se:a.se+b.se-seAnd,sp:spPar},ser:{se:seAnd,sp:a.sp+b.sp-spPar}};
}
function initComb(){
  const g=id=>$('#'+id);let quiet=false;
  function render(){
    const a={se:+g('cSeA').value/100,sp:+g('cSpA').value/100},b={se:+g('cSeB').value/100,sp:+g('cSpB').value/100},k=0,p=0.01;
    ['cSeA','cSpA','cSeB','cSpB'].forEach(id=>{g(id+'O').textContent=(+g(id).value).toFixed(1)+'%';});
    const r=combine(a,b,k),G=[['Test A',a],['Test B',b],['Parallel (OR)',r.par],['Serial (AND)',r.ser]];
    /* grouped columns */
    const W=680,H=300,m={l:46,r:16,t:24,b:46},iw=W-m.l-m.r,ih=H-m.t-m.b,Y=v=>m.t+ih-v*ih,bw=24,gw=iw/4;
    let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sensitivity and specificity of Test A, Test B, parallel and serial combinations">`;
    [0,.2,.4,.6,.8,1].forEach(t=>{s+=`<line class="grid" x1="${m.l}" x2="${W-m.r}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${m.l-8}" y="${Y(t)+4}" text-anchor="end">${Math.round(t*100)}</text>`;});
    const bar=(x,v,cls,lab)=>{const y=Y(v),h=m.t+ih-y,r=Math.min(4,h);return `<path class="${cls}" d="M${x} ${m.t+ih}V${y+r}Q${x} ${y} ${x+r} ${y}H${x+bw-r}Q${x+bw} ${y} ${x+bw} ${y+r}V${m.t+ih}Z"><title>${lab}: ${(v*100).toFixed(1)}%</title></path><text x="${x+bw/2}" y="${y-5}" text-anchor="middle" class="lbl">${(v*100).toFixed(1)}</text>`;};
    G.forEach((gr,i)=>{const cx=m.l+gw*(i+.5),x1=cx-bw-1,x2=cx+1;s+=bar(x1,gr[1].se,'f1',gr[0]+' sensitivity')+bar(x2,gr[1].sp,'f2',gr[0]+' specificity')+`<text x="${cx}" y="${m.t+ih+18}" text-anchor="middle">${gr[0]}</text>`;});
    s+=`<line class="axis" x1="${m.l}" x2="${W-m.r}" y1="${m.t+ih}" y2="${m.t+ih}"/><text transform="rotate(-90)" x="${-(m.t+ih/2)}" y="13" text-anchor="middle">Percent</text></svg>`;
    g('cChart').innerHTML=s;
    g('cTab').innerHTML=G.map(gr=>{const q=pv(gr[1].se,gr[1].sp,p);return `<tr><td>${gr[0]}</td><td class="n">${f1(gr[1].se)}</td><td class="n">${f1(gr[1].sp)}</td><td class="n">${f1(q.ppv)}</td><td class="n">${f1(q.npv)}</td></tr>`;}).join('');
    /* cascade */
    const N=10000,inf=N*p,un=N-inf,TPa=inf*a.se,FPa=un*(1-a.sp),TPs=inf*r.ser.se,FPs=un*(1-r.ser.sp);
    g('casc').innerHTML=`<div class="box"><small>Tested</small><b>${nf(N)}</b><small>${nf(inf)} infected · ${nf(un)} uninfected</small></div><div class="arr">→</div>
    <div class="box"><small>Positive on Test A (screen)</small><b>${nf(TPa+FPa)}</b><small>${nf(TPa)} true · ${nf(FPa)} false · PPV ${f1(TPa/(TPa+FPa))}</small><small><b style="font:inherit;color:var(--ink)">${nf(inf-TPa)}</b> infected animals missed here (negative on A, pathway stops)</small></div><div class="arr">→</div>
    <div class="box"><small>Also positive on Test B (confirm)</small><b>${nf(TPs+FPs)}</b><small>${nf(TPs)} true · ${nf(FPs)} false · PPV ${f1(TPs/(TPs+FPs))}</small><small><b style="font:inherit;color:var(--ink)">${nf(TPa-TPs)}</b> more infected animals lost at confirmation</small></div>`;
  }
  ['cSeA','cSpA','cSeB','cSpB'].forEach(id=>g(id).addEventListener('input',render));
  render();
  quiz($('#q6'),[
   {q:'A veterinarian uses two tests for bovine tuberculosis. In a serial testing strategy, an animal must test positive on Test 1 and then positive on Test 2 to be classified as positive. What is the main effect of this strategy on diagnostic performance?',o:[
    ['It increases both sensitivity and specificity.',false,'Requiring both tests to be positive cannot raise sensitivity. Some infected animals will test negative on one of the tests.'],
    ['It decreases sensitivity and increases specificity.',true,'Requiring both tests to be positive reduces false-positive classifications and makes the overall strategy more specific. But some truly infected animals may be missed, which reduces sensitivity.'],
    ['It increases sensitivity and decreases specificity.',false,'That is the effect of parallel testing, where either positive test is enough.'],
    ['It decreases both sensitivity and specificity.',false,'Specificity goes up, not down, because a false positive must occur on both tests.']]},
   {q:'A surveillance program uses two tests for a disease in cattle. In a parallel testing strategy, an animal is classified as positive if either Test A or Test B is positive. What is the main purpose of this approach?',o:[
    ['To ensure that only animals positive on both tests are classified as positive.',false,'That describes serial testing (AND rule).'],
    ['To maximize sensitivity and reduce missed infected animals.',true,'Calling an animal positive when either test is positive captures animals detected by either test. This generally increases sensitivity and reduces false negatives.'],
    ['To maximize specificity and reduce false-positive animals.',false,'Parallel testing does the opposite. More animals are called positive, so more false positives are likely.'],
    ['To make the two tests completely independent.',false,'The way results are combined does not change how the tests relate to each other.']]},
   {q:'A cattle disease has a highly sensitive screening test. A second test with high specificity is available for confirmation. The veterinarian first tests all animals with the screening test and then applies the second test only to animals that are positive on the first test. What testing strategy is being used?',o:[
    ['Repeated testing of the same sample.',false,'Two different tests are used, not the same test repeated.'],
    ['Parallel testing.',false,'In parallel testing, both tests are done on all animals at about the same time.'],
    ['Serial testing.',true,'This is serial testing because the second test is performed after the first, and the final classification depends on the sequential test results.'],
    ['Random testing.',false,'Animals are selected for the second test by their first result, not at random.']]},
   {q:'When two imperfect diagnostic tests are used in parallel, the overall sensitivity is generally higher than the sensitivity of either test used alone, assuming the tests provide some additional independent detection of infected animals. True or false?',o:[
    ['True.',true,'Parallel testing can capture infected animals detected by either test. The combined sensitivity can exceed that of either individual test when the tests provide additional detection.'],
    ['False.',false,'An animal missed by Test A can still be caught by Test B, so the combined sensitivity is higher.']]},
   {q:'In a herd of 1,000 cattle, a veterinarian wants to minimize the number of infected animals missed during an outbreak investigation. Two diagnostic tests are available, and the veterinarian is willing to investigate more false-positive animals. Which strategy is most appropriate?',o:[
    ['Classify every animal as negative before testing.',false,'This would miss every infected animal.'],
    ['Use only the less sensitive test.',false,'A less sensitive test misses more infected animals.'],
    ['Use the tests in parallel.',true,'Parallel testing is appropriate when minimizing false negatives is the priority, because an animal can be classified as positive when either test detects infection.'],
    ['Use the tests in series.',false,'Serial testing lowers sensitivity, so more infected animals would be missed.']]}
  ],{tag:'Task 5.3',title:'Check your reasoning',cls:'v',reset:true});
}

initComb();
