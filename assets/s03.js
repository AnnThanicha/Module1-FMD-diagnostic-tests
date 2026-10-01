/* Section 03: testing strategy */
/* ---------- 0. target explorer ---------- */
const TESTS=[['rrt','rRT-PCR','Viral RNA in epithelium, vesicular fluid, oropharyngeal (OP) fluid or serum'],['lamp','RT-LAMP','Viral RNA, amplified at one temperature in a water bath or heating block'],['vi','Virus isolation','Live virus grown in cell culture or unweaned mice'],['ag','Antigen ELISA','Viral antigen and serotype in epithelial suspension or vesicular fluid'],['lfd','Antigen lateral flow device (strip test)','Viral antigen, pen-side'],['seq','VP1 sequencing','Nucleotide sequence of the VP1 gene, a region linked to serotype and antigenic change'],['sp','SP antibody tests (VNT, SPCE, LPBE)','Serotype-specific antibody from vaccination or infection'],['nsp','NSP antibody tests (3ABC ELISA, strip, EITB)','Antibody to non-structural proteins, produced by infection']];
const QS=[
 {q:'Is FMD virus present now (suspected clinical case)?',n:'Take-away: sample epithelium or vesicular fluid and send it to an authorised laboratory. A negative antigen ELISA or virus isolation does not rule out FMD. Antigen ELISA is positive in only about 70–80% of epithelial suspensions that contain virus, and virus isolation can take up to 4 days.',r:{
  rrt:['y','Fast and sensitive. As effective for first detection as virus isolation plus antigen ELISA. But no single assay detects every isolate, because of primer mismatches, and it does not give the serotype.'],
  lamp:['p','Simple, under an hour, result read by eye. But not yet extensively evaluated as a replacement for current methods.'],
  vi:['y','Confirms live virus. But it can take up to 4 days, and some FMDVs do not grow in a given cell type, so no growth does not rule out virus. Needs a high-containment laboratory.'],
  ag:['y','Works on epithelial suspension or vesicular fluid and gives the serotype. Misses some samples that contain virus, so a negative needs follow-up by virus isolation or RT-PCR.'],
  lfd:['p','Pen-side, so no wait for shipping. At least as sensitive as antigen ELISA on the epithelial suspensions tested. But the 2012 Manual notes no validation dossier had reached the OIE. Confirm in an authorised laboratory.'],
  seq:['n','Describes virus that is already detected. It is not a first-line test for a suspect case.'],
  sp:['n','Antibody appears later and cannot separate vaccinated from infected animals.'],
  nsp:['p','Shows past or present infection. Useful in mild cases without lesions, but does not prove the animal is shedding now.']}},
 {q:'Which serotype or strain is it?',n:'Take-away: the serotype cannot be read from signs, and serotypes do not cross-protect. Type the virus in the laboratory, because the result decides which vaccine to use.',r:{
  rrt:['p','Detects virus. The two common TaqMan assays do not tell serotypes apart. Serotype comes from serotyping primers or sequencing.'],
  lamp:['n','Described as a detection assay, not a typing test.'],
  vi:['p','Gives an isolate that can then be typed by ELISA or sequenced.'],
  ag:['y','Wells coated with antisera to each of the seven serotypes identify the serotype.'],
  lfd:['n','Detects antigen but does not give the serotype. Strips that give the serotype are still in research.'],
  seq:['y','The VP1 sequence gives the serotype and strain, and is used to trace where an outbreak came from.'],
  sp:['n','Serotype-specific, but it describes the host response, not the circulating strain.'],
  nsp:['n','NSPs are highly conserved, so NSP antibody is not serotype specific.']}},
 {q:'Was this animal ever infected, even if it was vaccinated?',n:'Take-away: NSP antibody is the tool for this question. Read it at herd level. Some vaccinated animals that are later infected stay NSP-negative, and unpurified vaccine given repeatedly can cause false positives.',r:{
  rrt:['n','Only detects virus while it is present.'],
  lamp:['n','Only detects virus while it is present.'],
  vi:['n','Only detects live virus while it is present.'],
  ag:['n','Only detects antigen while it is present.'],
  lfd:['n','Only detects antigen while it is present.'],
  seq:['n','Needs virus or RNA, so it cannot show past infection.'],
  sp:['n','Vaccination raises the same antibodies as infection, so SP tests cannot separate them.'],
  nsp:['y','NSP antibody indicates infection irrespective of vaccination status. Impure vaccine in repeatedly vaccinated animals may cause misclassification, and some vaccinated carriers are NSP-negative.']}},
 {q:'Did vaccination produce protective antibody?',n:'Take-away: SP antibody shows a response, not proof of protection. Protection can be limited even against the same serotype, so cut-offs must come from vaccine potency experience.',r:{
  rrt:['n','Not a measure of immunity.'],
  lamp:['n','Not a measure of immunity.'],
  vi:['n','Not a measure of immunity.'],
  ag:['n','Not a measure of immunity.'],
  lfd:['n','Not a measure of immunity.'],
  seq:['n','Not a measure of immunity.'],
  sp:['y','Serotype-specific. VNT is the gold standard and is prescribed for trade certification, but it is slower, more variable and needs high-containment facilities. ELISAs are faster and can use inactivated antigen.'],
  nsp:['n','NSP antibody marks infection, not vaccine response.']}},
 {q:'Is a recovered animal still a carrier?',n:'Take-away: carriers have virus in the throat more than 28 days after infection and look normal. Up to 50% of infected animals can become carriers. In cattle this usually lasts under 6 months, rarely up to 3 years. No antibody test can separate carriers from other animals that have antibody, so sample throat fluid.',r:{
  rrt:['y','On OP fluid from a probang cup. Viral RNA or live virus can persist in the oropharynx.'],
  lamp:['n','Not described for carrier testing in these sources.'],
  vi:['y','Live virus can be recovered from OP fluid.'],
  ag:['n','Insufficiently sensitive for direct testing of OP samples.'],
  lfd:['n','Insufficiently sensitive for direct testing of OP samples.'],
  seq:['n','Describes virus once it is recovered. It is not a carrier screen.'],
  sp:['n','Antibody does not show whether virus persists.'],
  nsp:['p','A positive raises suspicion, but some carriers do not make NSP antibody. OP sampling then looks for the virus.']}},
 {q:'Does the vaccine match the field virus?',n:'Take-away: serotypes do not cross-protect, and variants within a serotype can differ. Animal challenge tests (PD50) are costly and slow, so laboratories compare the field virus with vaccine strains by serology and sequence.',r:{
  rrt:['n','Detects virus only. It gives no match information.'],
  lamp:['n','Detects virus only. It gives no match information.'],
  vi:['p','Gives the field isolate that other tests compare with the vaccine strain.'],
  ag:['p','Gives the serotype, but not how close the strain is to the vaccine strain.'],
  lfd:['n','Detects antigen only. It gives no match information.'],
  seq:['p','Shows how far the field virus has drifted from the vaccine strain. It does not by itself prove protection.'],
  sp:['y','Compare the field virus with the vaccine strain using hyperimmune serum (r1 value). In VNT, r1 of 0.3 or more suggests a close relationship and good protection. Below 0.3, the vaccine is unlikely to protect.'],
  nsp:['n','NSP antibody does not describe the strain.']}},
 {q:'Do I need a result at the farm?',n:'Take-away: shipping and poor-quality samples can delay diagnosis. Pen-side tests aim to give an early answer at the site of a suspected outbreak. Confirm the result in an authorised laboratory.',r:{
  rrt:['p','Portable machines exist, but they need expensive, fragile instruments and precise thermocycling.'],
  lamp:['p','Inexpensive tools, under an hour, visual read-out. But not yet extensively evaluated.'],
  vi:['n','Needs cell culture, up to 4 days and a high-containment laboratory.'],
  ag:['n','A laboratory test. Needs plates, antisera and laboratory equipment.'],
  lfd:['y','Made for use at the site of a suspected outbreak. At least as sensitive as antigen ELISA on the epithelial suspensions tested. Does not give the serotype.'],
  seq:['n','A laboratory test.'],
  sp:['n','Shows antibody, not a current case.'],
  nsp:['n','Shows past infection, not a current case.']}}];
let selectQ=()=>{};
function initExplorer(){
  const host=$('#qChips');host.innerHTML=QS.map((q,i)=>`<button class="chip" type="button" aria-pressed="${i===0}">${q.q}</button>`).join('');
  const rk={y:0,p:1,n:2},tg={y:'<span class="tag ok">Fits</span>',p:'<span class="tag w">Partly</span>',n:'<span class="tag x">No</span>'};
  const draw=i=>{const q=QS[i];$('#qOut').innerHTML=TESTS.map(t=>({t,v:q.r[t[0]]})).sort((a,b)=>rk[a.v[0]]-rk[b.v[0]]).map(o=>`<tr><td><b>${o.t[1]}</b></td><td>${o.t[2]}</td><td>${tg[o.v[0]]}</td><td>${o.v[1]}</td></tr>`).join('');$('#qNote').textContent=q.n;};
  draw(0);chips(host,b=>draw($$('button',host).indexOf(b)));
  selectQ=i=>{unpress(host);$$('button',host)[i].setAttribute('aria-pressed','true');draw(i);};
}

function initStrat(){
  quiz($('#q41'),[{q:'Which test would you consider first for broad screening, and which for confirmation?',o:[['A for screening, B for confirmation.',true,'A misses fewer infected animals (98% sensitivity). B produces far fewer false positives (99.5% specificity), so it is better at settling the positives A raises. This is subject to validation, the testing algorithm and the consequences of error.'],['B for screening, A for confirmation.',false,'B would miss 15% of infected animals at the first step, and A would send many false positives to confirmation.'],['The numbers alone cannot decide, so pick either.',false,'Sensitivity and specificity are exactly what separate the two jobs. Purpose and error costs then finish the decision.']]}]);
  quiz($('#q42'),[
   {q:'Farmers report drooling cattle with blisters on the tongue and between the claws. Two animals have unruptured vesicles. You need to confirm FMD and identify the serotype quickly. What do you collect and test first?',o:[['Epithelium or vesicular fluid, tested by antigen ELISA and rRT-PCR.',true,'The Manual names epithelium from an unruptured or freshly ruptured vesicle as the tissue of choice. Antigen ELISA identifies the serotype, and rRT-PCR is about as sensitive as virus isolation. Ship under secure conditions to an authorised laboratory.'],['Serum for an NSP antibody strip.',false,'Antibody lags behind infection and gives no serotype. In acute vesicular disease, detect the virus.'],['Serum for virus neutralisation.',false,'VNT measures serotype-specific antibody, takes 2–3 days and answers immunity and trade questions, not first-line acute confirmation.']]},
   {q:'A dairy herd in a vaccinated area has no lesions, but a neighbouring herd is confirmed. You need to know which cows have been infected, irrespective of vaccination. Which serology fits?',o:[['NSP antibody screening (3ABC ELISA), with a confirmatory NSP test on positives.',true,'NSP antibody indicates infection whether or not the animal was vaccinated. The Manual describes retesting positives with EITB or a second NSP ELISA, accounting for the dependence between the two tests.'],['SP antibody tests (VNT, SPCE, LPBE).',false,'Vaccination and infection both raise structural-protein antibody, so SP tests cannot separate them.'],['Antigen ELISA on serum.',false,'Antigen ELISA is suited to epithelial suspensions, vesicular fluids and culture supernatants, not to finding past infection in serum.']]},
   {q:'A breeder wants to export cattle. Which antibody tests does the Terrestrial Manual prescribe for international trade?',o:[['The SP tests: VNT, SPCE and LPBE.',true,'These are serotype-specific and prescribed for trade. NSP ELISA is not prescribed for trade, though it is a valuable adjunct when the serotype in the country of origin is unknown.'],['The NSP strip alone.',false,'The Manual reported that no validation dossier for lateral flow devices had reached the OIE, and NSP tests are not the prescribed trade tests.'],['Any test with sensitivity above 95%.',false,'Prescription depends on validation for the purpose, not on a single performance number.']]},
   {q:'After a vaccination campaign, the programme manager asks whether the vaccine produced protective antibody in the herd. Which test type answers this?',o:[['Serotype-specific SP antibody tests, with cut-offs from vaccine potency experience.',true,'The Manual lists demonstrating vaccine efficacy as a purpose of SP serology. Cut-off titres for protection must come from potency results with the relevant vaccine and species.'],['NSP ELISA, where positive means protected.',false,'NSP antibody marks infection. A good vaccine should not raise it.'],['rRT-PCR on blood.',false,'PCR looks for virus, not for immunity.']]},
   {q:'A remote area has no laboratory within a day of travel, and you must decide quickly on movement restriction for a herd with suspicious lesions. What is a sensible use of a pen-side antigen lateral flow device?',o:[['As a rapid adjunct on vesicular epithelium or fluid, with confirmation in an authorised laboratory.',true,'It buys time for the restriction decision. The Manual noted no OIE validation dossier for these devices at that time, so laboratory confirmation stays in the pathway.'],['As a replacement for laboratory confirmation, because it is fast.',false,'Speed does not replace validation. A negative pen-side result in a suspicious herd should not close the case.'],['On OP fluid to find carriers.',false,'The Manual says lateral flow devices and antigen ELISA are insufficiently sensitive for direct examination of OP samples.']]}
  ],{tag:'Task 3.4',title:'Match the test to the FMD decision',cls:'v',reset:true});
}

initExplorer();initStrat();
