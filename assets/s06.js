/* Section 06: pre-lab */
function initReady(){
  quiz($('#q7'),[
   {q:'Does 95% sensitivity mean a test-positive animal has a 95% probability of infection?',o:[['No. That is a predictive-value question.',true,'Sensitivity starts from infected animals. PPV starts from test-positive animals.'],['Yes.',false,'That confuses sensitivity with PPV.'],['Only in a herd with clinical signs.',false,'Even then, PPV depends on prevalence and specificity.']]},
   {q:'Se and Sp are unchanged and prevalence decreases. What happens to PPV?',o:[['PPV decreases.',true,'False positives make up a larger share of positives.'],['PPV increases.',false,'It increases when prevalence rises.'],['PPV stays the same.',false,'Only Se and Sp stay the same.']]},
   {q:'Which strategy uses an OR rule?',o:[['Parallel testing.',true,'Positive if either test is positive.'],['Serial testing.',false,'Serial testing uses the AND rule.'],['Repeated testing of one test.',false,'Repetition is not defined by an OR rule.']]},
   {q:'Do negative results from 10 sampled cattle prove herd freedom?',o:[['No. Sampling and detection probability must be considered.',true,'Ten animals with 90% sensitivity at 5% design prevalence have only a 36.9% chance of detecting infection.'],['Yes, if the test is 99% specific.',false,'Specificity is not the issue here. Sensitivity and sample size are.'],['Yes, if all ten are negative on two tests.',false,'Two tests do not fix a sample that is too small.']]},
   {q:'Can a negative result shortly after exposure exclude infection?',o:[['Not necessarily. The target may not yet be detectable.',true,'Timing relative to exposure decides whether the test can be informative.'],['Yes, a negative is a negative.',false,'A negative means the test did not detect the target.'],['Yes, if the test is a rapid strip.',false,'Format does not change biological timing.']]}
  ],{tag:'Readiness',title:'Five questions before the lab',cls:'v',reset:true});
  /* recommendation draft */
  const ta=$('#rec');ta.value=store.get('fmd-rec')||'';ta.addEventListener('input',()=>store.set('fmd-rec',ta.value));
  let cs=[];try{cs=JSON.parse(store.get('fmd-rec-c')||'[]')}catch(e){}
  $$('#recChk input').forEach((c,i)=>{c.checked=!!cs[i];c.addEventListener('change',()=>store.set('fmd-rec-c',JSON.stringify($$('#recChk input').map(x=>x.checked))));});
}

initReady();
