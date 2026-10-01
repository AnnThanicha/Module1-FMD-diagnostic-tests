/* Section 01: diagnostic test performance (2x2 table, Se, Sp, PPV, NPV) */
const EX={tp:90,fp:45,fn:10,tn:855};
const LBL={r1:'Test positive',r2:'Test negative',c1:'Infected',c2:'Uninfected'};
/* child indexes in the .tt grid: 5 TP, 6 FP, 9 FN, 10 TN, 1 infected head, 2 uninfected head, 4 positive head, 8 negative head */
const MEAS={
  se:{name:'Sensitivity',cells:[5,9],heads:[1],f:'TP ÷ (TP + FN)',num:'90 ÷ (90 + 10)',val:EX.tp/(EX.tp+EX.fn),txt:'Start from the <b>infected</b> column: 100 animals. 90 tested positive. Sensitivity is the share of infected animals that the test finds.'},
  sp:{name:'Specificity',cells:[6,10],heads:[2],f:'TN ÷ (TN + FP)',num:'855 ÷ (855 + 45)',val:EX.tn/(EX.tn+EX.fp),txt:'Start from the <b>uninfected</b> column: 900 animals. 855 tested negative. Specificity is the share of uninfected animals that the test clears.'},
  ppv:{name:'PPV',cells:[5,6],heads:[4],f:'TP ÷ (TP + FP)',num:'90 ÷ (90 + 45)',val:EX.tp/(EX.tp+EX.fp),txt:'Start from the <b>test-positive</b> row: 135 animals. 90 are infected. PPV is the share of positive animals that are truly infected.'},
  npv:{name:'NPV',cells:[9,10],heads:[8],f:'TN ÷ (TN + FN)',num:'855 ÷ (855 + 10)',val:EX.tn/(EX.tn+EX.fn),txt:'Start from the <b>test-negative</b> row: 865 animals. 855 are uninfected. NPV is the share of negative animals that are truly uninfected.'}
};
function initTables(){
  $('#tt1').innerHTML=ttHTML(EX,LBL);
  const host=$('#tt2');host.innerHTML=ttHTML(EX,LBL);
  const cells=[...host.querySelector('.tt').children];
  function show(k){
    const m=MEAS[k];
    cells.forEach((c,i)=>{const on=m.cells.includes(i)||m.heads.includes(i);c.style.outline=on?'3px solid var(--accent)':'';c.style.outlineOffset=on?'-3px':'';c.style.opacity=(on||[0,3,7,11,12,13,14,15].includes(i))?'1':'.45';});
    $('#mK').innerHTML=kpi(m.name,f1(m.val),m.f+' = '+m.num);
    $('#mTxt').innerHTML=m.txt;
  }
  chips($('#mPick'),b=>show(b.dataset.m));
  show('se');
}
initTables();
function initPractice(){
  $('#ttP').innerHTML=ttHTML({tp:80,fp:30,fn:20,tn:270},LBL);
  $('[data-check="chk15"]').addEventListener('click',()=>{
    const ins=$$('#chk15 input'),ok=ins.filter(i=>Math.abs(parseFloat(i.value)-parseFloat(i.dataset.ans))<=parseFloat(i.dataset.tol)).length;
    $('#r15').textContent=ok===4?'All four correct.':ok+' of 4 correct. Check which row or column each measure starts from.';
  });
}
/* ---------- 3. predictive values vs prevalence ---------- */
function initPrev(){
  const g=id=>$('#'+id);
  function render(){
    const se=+g('pSe').value/100,sp=+g('pSp').value/100,p=+g('pPv').value,log=g('pLog').value==='log';
    g('pSeO').textContent=(se*100).toFixed(1)+'%';g('pSpO').textContent=(sp*100).toFixed(1)+'%';g('pPvO').textContent=p.toFixed(1)+'%';
    lineChart(g('pChart'),{aria:'PPV and NPV against prevalence',log,x0:log?0.1:0,x1:100,xs0:log?0.1:0.1,y0:0,y1:100,xt:log?[0.1,1,10,100]:[0,25,50,75,100],yt:[0,20,40,60,80,100],xl:'Prevalence (%)',yl:'Predictive value (%)',
      series:[{cls:1,f:x=>pv(se,sp,x/100).ppv*100},{cls:2,f:x=>pv(se,sp,x/100).npv*100}],mark:p,
      tip:(x,ys)=>`Prevalence <b>${x<1?x.toFixed(2):x.toFixed(1)}%</b><br>PPV <b>${ys[0].toFixed(1)}%</b> · NPV <b>${ys[1].toFixed(1)}%</b>`});
    const c=fromRates(se,sp,p/100,10000),m=meas(c);
    g('pTT').innerHTML=ttHTML(c,{r1:'Test positive',r2:'Test negative',c1:'Infected',c2:'Uninfected'});
    g('pK').innerHTML=kpi('PPV',f1(m.ppv),'per 10,000 tested')+kpi('NPV',f1(m.npv),'per 10,000 tested');
    g('pTxt').innerHTML=`At <b>${p.toFixed(1)}%</b> prevalence, <b>${nf(c.tp)}</b> of the <b>${nf(c.tp+c.fp)}</b> positives are truly infected. That leaves <b>${nf(c.fp)}</b> false positives and <b>${nf(c.fn)}</b> missed infections in 10,000 animals.`;
  }
  ['pSe','pSp','pPv','pLog'].forEach(id=>g(id).addEventListener('input',render));
  render();
}


function initQ3(){
  const host=$('#q3');
  const Q=[
   {q:'A screening test for bovine tuberculosis is evaluated against a reference test. Among 200 cattle, 50 truly have the disease and 150 do not. The screening test is positive in 45 of the diseased cattle and positive in 15 of the non-diseased cattle. What is the sensitivity of the screening test?',
    o:['95%','90%','70%','80%'],c:1,
    r:['Not from these counts. Sensitivity uses only the 50 diseased cattle.','Sensitivity = TP ÷ (TP + FN) = 45 ÷ 50 = 90%. The 15 positive non-diseased cattle are false positives. They do not enter sensitivity.','This mixes in the non-diseased cattle. Sensitivity uses only the 50 diseased cattle.','Not from these counts. 45 of 50 diseased cattle tested positive, which is 90%.']},
   {q:'A diagnostic test for canine parvovirus is evaluated in 300 dogs. Among 100 dogs that truly have parvovirus, 90 test positive. Among 200 dogs that do not have parvovirus, 180 test negative. What is the specificity of the test?',
    o:['85%','90%','95%','80%'],c:1,
    r:['Not from these counts. Specificity uses only the 200 dogs without parvovirus.','Specificity = TN ÷ (TN + FP) = 180 ÷ 200 = 90%. The sensitivity is also 90% (90 ÷ 100), but the question asks for specificity.','Not from these counts. 180 of 200 dogs without parvovirus tested negative, which is 90%.','80% would need only 160 true negatives. There were 180.']},
   {q:'A screening test for avian influenza is used in 1,000 chickens. The test produces 100 positive results. Laboratory testing shows that 80 of the positive chickens truly have avian influenza. What is the positive predictive value (PPV) of the screening test?',
    o:['80%','20%','50%','90%'],c:0,
    r:['PPV = TP ÷ (TP + FP) = 80 ÷ 100 = 80%. PPV starts from the test-positive animals.','20% is the share of positive results that are false positives (20 ÷ 100). PPV is the share that are true positives.','Not from these counts. 80 of the 100 positive chickens are truly infected.','Not from these counts. PPV = 80 ÷ 100, not 90 ÷ 100.']},
   {q:'A highly sensitive screening test for a disease in cats has a negative predictive value (NPV) of 98%. Which interpretation is most appropriate?',
    o:['98% of cats with positive test results truly have the disease','98% of cats with negative test results truly do not have the disease','98% of diseased cats test negative','98% of disease-free cats test negative'],c:1,
    r:['That describes the positive predictive value (PPV), not the NPV.','NPV = TN ÷ (TN + FN). It starts from the negative results: of the cats that test negative, 98% are truly disease-free.','That would mean most diseased cats are missed. It contradicts a highly sensitive test.','That describes specificity. NPV starts from the negative test results, not from the disease-free cats.']},
   {q:'A disease is rare in a population of cattle. A diagnostic test has high sensitivity and high specificity. Which change would generally be expected to have the greatest effect on the positive predictive value (PPV)?',
    o:['Increasing disease prevalence','Increasing the number of disease-free animals while keeping prevalence unchanged','Changing the animal identification system','Increasing the time required to perform the test'],c:0,
    r:['PPV rises as prevalence rises. At low prevalence, false positives outnumber true positives, so PPV is low.','If prevalence stays the same, the proportions of infected and uninfected animals do not change, so PPV stays the same.','Identification does not change test accuracy or prevalence, so it does not change PPV.','Test duration does not change test accuracy or prevalence, so it does not change PPV.']}
  ];
  const L='ABCD';
  function build(){
    host.innerHTML='<div class="step"><span class="tag ok">1.6 · Quiz</span><h3>Diagnostic test performance in veterinary medicine</h3></div>'
     +Q.map((it,i)=>`<div class="scard"><h3>${i+1}. ${it.q}</h3><div class="opts">${it.o.map((x,j)=>`<button class="opt" type="button"><b>${L[j]}.</b> ${x}</button>`).join('')}</div><div class="why" hidden></div></div>`).join('')
     +'<div class="controls"><span class="score"></span><button class="btn ghost" type="button" id="qReset">Reset quiz</button></div>';
    let first=0,answered=0;
    const sc=$('.score',host),upd=()=>{sc.textContent=`${answered} of ${Q.length} answered · ${first} correct on first try`;};upd();
    $$('.scard',host).forEach((card,i)=>{let tries=0,done=false;
      $$('.opt',card).forEach((b,j)=>b.addEventListener('click',()=>{
        if(done)return;tries++;const ok=j===Q[i].c,w=$('.why',card);w.hidden=false;
        w.innerHTML=(ok?'<b>Correct.</b> ':'<b>Not quite.</b> ')+Q[i].r[j]+(ok?'':' Try another answer.');
        if(ok){b.classList.add('right');done=true;answered++;if(tries===1)first++;$$('.opt',card).forEach(y=>y.disabled=true);upd();}
        else{b.classList.add('wrong');b.disabled=true;}
      }));});
    $('#qReset',host).addEventListener('click',build);
  }
  build();
}
initPractice();initPrev();initQ3();wireChecks();
