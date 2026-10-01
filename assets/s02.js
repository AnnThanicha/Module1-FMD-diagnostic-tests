/* Section 02: reference standards */
/* ---------- dataset viewer ---------- */
function initDS(){
  const F=()=>{const p=$('#dsProv').value,l=$('#dsLfa').value,e=$('#dsE').value;
    const rows=D.filter(r=>(p==='all'||r[2]===p)&&(l==='any'||r[3]===+l)&&(e==='any'||r[5]===e));
    $('#dsBody').innerHTML=rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${r[3]?'pos':''}">${r[3]?'+':'−'}</td><td class="n">${r[4].toFixed(2)}</td><td>${RD[r[5]]}</td></tr>`).join('');
    $('#dsCount').textContent=`${rows.length} of ${D.length} sera`;};
  ['dsProv','dsLfa','dsE'].forEach(id=>$('#'+id).addEventListener('change',F));F();
  const btn=$('#csvBtn'),csv=()=>'serum,breed,province,lfa,elisa_percent,elisa_reading\n'+D.map(r=>[r[0],r[1],r[2],r[3]?'positive':'negative',r[4],RD[r[5]].toLowerCase()].join(',')).join('\n');
  btn.addEventListener('click',async()=>{const box=$('#csvBox');box.value=csv();
    try{await navigator.clipboard.writeText(box.value);btn.textContent='Copied';setTimeout(()=>{btn.textContent='Copy dataset as CSV';},1600);}catch(e){box.hidden=false;box.select();btn.textContent='Select and copy below';}});
}




function initQ1(){
  quiz($('#q1'),[
   {q:'The paper reports LFA sensitivity of 95.2% (20 of 21). Which sentence is correct?',o:[['The strip was positive in 20 of the 21 sera that the ELISA called positive.',true,'The denominator is ELISA-positive sera, not confirmed-infected animals.'],['The strip detects 95.2% of FMD-infected cattle.',false,'Infection status was never established independently of the ELISA.'],['95.2% of strip-positive cattle are infected.',false,'That describes PPV. It starts from the strip result, not from the reference status.']]},
   {q:'Every ambiguous ELISA serum was LFA-negative, and the authors grouped ambiguous with negative. What does that choice do?',o:[['It fixes a decision about the reference\'s grey zone. Counting them as positive would give 4 false negatives and sensitivity of 83.3%.',true,'The strip is unchanged. The reference decision moved.'],['Nothing, because ambiguous results cannot affect sensitivity.',false,'They change the reference-positive group, which is the denominator of sensitivity.'],['It improves the strip\'s true performance.',false,'It changes the measured agreement, not the strip.']]},
   {q:'Which addition would most strengthen the reference for this comparison?',o:[['Independent confirmation of infection status (for example rRT-PCR or probang sampling), or a statistical model that does not assume a perfect reference.',true,'Either approach stops the ELISA from being the only judge.'],['Running the same ELISA again on the same sera.',false,'Repeating the same test does not fix systematic error.'],['Calling the ELISA a gold standard in the methods.',false,'Naming a test does not make it trustworthy.']]},
   {q:'A colleague says: "Se 95.2% and Sp 100%, so the strip is a gold standard." Your reply?',o:[['No. Those numbers describe agreement with the ELISA in 32 stored sera, and specificity rests on 11 negatives. A gold standard needs a trustworthy reference, not high numbers.',true,'High sensitivity and specificity alone do not make a test a gold standard.'],['Yes. Above 95% on both is enough.',false,'No threshold on Se and Sp defines a gold standard.'],['Only if a larger sample is tested.',false,'A larger sample narrows uncertainty but does not make a test a gold standard.']]},
   {q:'For FMD, why might the NSP reference itself be wrong for an individual animal?',o:[['Repeatedly vaccinated animals may show NSP antibody if the vaccine is impure, and some vaccinated animals that later became carriers may be NSP-negative.',true,'The OIE Manual notes both: impure vaccine can cause misclassification, and experimental evidence shows some vaccinated-then-challenged persistently infected cattle are missed by some NSP tests.'],['NSP antibody is present in every vaccinated animal.',false,'Inactivated vaccines mainly carry structural proteins.'],['NSP antibody appears the moment an animal is exposed.',false,'Antibody takes time to appear, so early infection can be missed.']]}
  ],{tag:'Task 2.3',title:'Check your understanding',cls:'a'});
}

initDS();initQ1();
