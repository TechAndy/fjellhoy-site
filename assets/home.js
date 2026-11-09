const toggle=document.querySelector('.menu-toggle');
  const header=document.querySelector('.site-header');
  const menu=document.getElementById('mobile-menu');
  const backdrop=document.querySelector('.menu-backdrop');
  const toTop=document.querySelector('.to-top');

  const setMenu=open=>{
    header.classList.toggle('open',open);
    document.body.classList.toggle('menu-open',open);
    toggle.setAttribute('aria-expanded',open?'true':'false');
    menu.hidden=!open;
    backdrop.hidden=!open;
  };

  toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
  menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
  backdrop.addEventListener('click',()=>setMenu(false));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){setMenu(false);toggle.focus();}
  });

  const onScroll=()=>{
    header.classList.toggle('scrolled',window.scrollY>8);
    toTop.classList.toggle('is-visible',window.scrollY>400);
  };
  onScroll();
  addEventListener('scroll',onScroll,{passive:true});

  const desktop=matchMedia('(min-width:1001px)');
  const closeOnDesktop=()=>{if(desktop.matches)setMenu(false);};
  desktop.addEventListener('change',closeOnDesktop);

  document.getElementById('year').textContent=new Date().getFullYear();

  const setupForm=document.getElementById('setup-form');
  const stepBransje=document.getElementById('step-bransje');
  const stepRolleBedrift=document.getElementById('step-rolle-bedrift');
  const stepRolleStyre=document.getElementById('step-rolle-styre');
  const industries={
    handverk:{
      assistants:['Tilbud og prosjekt','Kunde og kalender','Faktura og økonomi'],
      day:['Morgenbrief med befaringer i dag og tilbud som venter','Utkast til tilbud til kunden, basert på en lignende jobb. Du godkjenner før det sendes','Purring på forfalte fakturaer ligger klar, men går ikke ut uten ditt ja','Varsel dagen før en materialfrist eller en avtalt oppstart'],
      skip:['Å skrive tilbud sent på kvelden','Å glemme kunden som ba om pris','Å oppdage en ubetalt faktura for sent'],
      inTitle:'håndverk og bygg'
    },
    regnskap:{
      assistants:['Frister og leveranser','Kundemappe','Timer og faktura'],
      day:['Morgenbrief med frister denne uken og kunder som venter svar','Utkast til svar på vanlige spørsmål. Du leser før noe sendes','Timegrunnlag er samlet til faktura. Ingenting sendes uten ditt ja','Varsel når et bilag mangler før en leveransefrist'],
      skip:['Å lete etter forrige svar til samme kunde','Å holde leveransefristene i hodet','Å starte hvert kundebrev fra blankt ark'],
      inTitle:'regnskap og rådgivning'
    },
    helse:{
      assistants:['Timebok','Henvendelser','Oppgjør og faktura'],
      day:['Morgenbrief med dagens timer og henvendelser som venter','Utkast til svar om time og praktiske spørsmål. Du godkjenner før det sendes','Oppgjørsgrunnlag er klargjort. Ingenting sendes eller betales uten ditt ja','Varsel når en time står tom eller en oppgjørsfrist nærmer seg'],
      skip:['Å svare på de samme praktiske spørsmålene','Å oppdage et hull i timeboken for sent','Å samle oppgjørsgrunnlag for hånd'],
      inTitle:'helse og terapi'
    },
    butikk:{
      assistants:['Kunde og ordre','Leverandør og lager','Faktura og purring'],
      day:['Morgenbrief med ordre som venter svar og varer som går tomme','Utkast til svar om levering og retur. Du godkjenner før det sendes','Leverandørfakturaer er sjekket mot forrige pris. Du godkjenner før noe betales','Varsel når en bestilling eller en kampanjefrist bør tas'],
      skip:['Å svare på de samme spørsmålene om levering','Å oppdage en prisøkning fra leverandøren for sent','Å skrive purringer fra blankt ark'],
      inTitle:'butikk og netthandel'
    },
    eiendom:{
      assistants:['Leietaker og henvendelser','Kontrakt og frist','Husleie og faktura'],
      day:['Morgenbrief med henvendelser fra leietakere og frister i kontraktene','Utkast til svar om praktiske forhold. Ingenting sendes uten ditt ja','Husleiekrav er lagt klare. Ingenting sendes før du har sagt ja','Varsel før en kontraktsfrist, en visning eller en regulering'],
      skip:['Å lete i gamle e-poster når en leietaker spør','Å glemme en frist i leiekontrakten','Å sjekke hvert krav mot forrige beløp for hånd'],
      inTitle:'eiendom og utleie'
    },
    konsulent:{
      assistants:['Tilbud og oppdrag','Møte og oppfølging','Timer og faktura'],
      day:['Morgenbrief med møter i dag og tilbud som har ligget stille','Utkast til oppfølging etter møtet. Du leser før det sendes','Timegrunnlag er samlet. Faktura sendes ikke uten ditt ja','Varsel når et tilbud eller en leveranse nærmer seg frist'],
      skip:['Å skrive møtenotatet fra hukommelsen','Å glemme å følge opp et tilbud','Å rekonstruere timer når fakturaen skal lages'],
      inTitle:'konsulent og IT'
    },
    restaurant:{
      assistants:['Vakt og kalender','Leverandør og varemottak','Faktura og gjester'],
      day:['Morgenbrief med vakter, leveranser og det som haster i dag','Utkast til svar på bordbestilling. Du godkjenner før det sendes','Leverandørfakturaer er sammenlignet med forrige. Ingenting betales uten ditt ja','Varsel når en vakt står åpen eller en bestilling bør ut'],
      skip:['Å svare på bestillinger mellom øktene','Å oppdage en prisendring på råvarer for sent','Å holde vaktliste og leveranser i hodet'],
      inTitle:'restaurant og servering'
    },
    annet:{
      assistants:['Innboks og prioritering','Oppfølging og frister','Faktura og økonomi'],
      day:['Morgenbrief med bare det som trenger deg','Utkast til vanlige svar. Du godkjenner før noe sendes','Fakturaer er sjekket mot tidligere beløp og lagt klare. Ingenting betales uten ditt ja','Varsel når en frist nærmer seg'],
      skip:['Å starte dagen i en full innboks','Å skrive de samme svarene om igjen','Å oppdage en forfalt faktura for sent'],
      inTitle:'en annen bransje'
    }
  };
  const groups={
    borettslag:{
      assistants:['Styremøte og saksliste','Beboerhenvendelser','Faktura og leverandør'],
      day:['Morgenbrief med henvendelser som venter svar','Utkast til svar til beboere. Du godkjenner før noe sendes','Fakturaer er sammenlignet med forrige fra samme leverandør. Du godkjenner før noe betales','Varsel før en frist, en generalforsamling eller et styremøte'],
      skip:['Å sortere styremailen for hånd','Å skrive saksliste fra blankt ark','Å godkjenne en faktura uten å se avviket'],
      inTitle:'borettslag/sameie'
    },
    forening:{
      assistants:['Medlemshenvendelser','Møter og årsmøte','Kontingent og økonomi'],
      day:['Morgenbrief med henvendelser fra medlemmer og saker som venter','Utkast til svar. Du godkjenner før noe sendes','Kontingent og fakturaer er lagt klare. Ingenting sendes eller betales uten ditt ja','Varsel før årsmøte, en søknadsfrist eller et styremøte'],
      skip:['Å sortere medlemsmailen for hånd','Å starte innkalling og saksliste fra blankt ark','Å følge opp kontingent uten oversikt'],
      inTitle:'forening/organisasjon'
    }
  };
  const roleAddon={
    leder:{assistant:'Morgenbrief',day:'Kort morgenbrief med bare det som trenger et ja fra deg',skip:'Å bruke morgenen på å finne ut hva som haster',inTitle:'Daglig leder'},
    selger:{assistant:'Tilbudsoppfølging',day:'Utkast til oppfølging av tilbud som har ligget stille. Ingenting sendes uten ditt ja',skip:'Å glemme et tilbud som aldri ble fulgt opp',inTitle:'Selger'},
    kontor:{assistant:'Dokumentarkiv',day:'Vedlegg er foreslått sortert. Ingenting flyttes eller slettes uten at du ser det',skip:'Å rydde innboks og arkiv for hånd',inTitle:'Kontor og administrasjon'},
    styreleder:{assistant:'Oppfølging mellom møtene',day:'Saker som ble liggende etter forrige møte er samlet i et utkast',skip:'Å huske løse tråder mellom møtene',inTitle:'Styreleder'},
    styremedlem:{assistant:'Lesestoff til møtet',day:'Kort utkast til det du bør lese før møtet',skip:'Å lete gjennom lange tråder kvelden før møtet',inTitle:'Styremedlem'},
    forretning:{assistant:'Referat og frister',day:'Utkast til referat og oppfølgingspunkter. Ingenting sendes ut uten ditt ja',skip:'Å skrive referatet fra blankt ark etter møtet',inTitle:'Forretningsfører'}
  };
  const scenes={
    'handverk|leder':{
      day:['Likviditet for de neste ukene, fra utestående og regninger som kommer.','Marginen på badjobben til kunden, sjekket mot lignende jobber.','Purreutkast på forfalt faktura. mva hos næringskunden og sertifikat er med.'],
      skip:['Å regne de neste ukenes likviditet for hånd','Å oppdage svak margin på jobben til kunden for sent','Å skrive purring og holde mva og sertifikat i hodet'],
    },
    'handverk|selger':{
      day:['Research før møtet med kunden: historikk og åpne saker.','Åpne tilbud i rekkefølge. kunden følges opp først.','Tilbudsutkast til kunden, bygget på badjobben i fjor.'],
      skip:['Å lete i historikken til kunden rett før møtet','Å gjette hvilket tilbud som skal følges opp først','Å skrive tilbudet til kunden fra blankt ark'],
    },
    'handverk|kontor':{
      day:['Fakturaer er avstemt mot ordre. Avvik fra rørleggerfirmaet er flagget.','Utkast til oppfølging av kunden og leverandøren. Ingenting sendes ennå.','Mappen til næringskunden er samlet fra regnskapssystemet ditt.'],
      skip:['Å avstemme faktura mot ordre for hånd','Å skrive oppfølgingen til kunden og leverandøren fra blankt ark','Å lete fram grunnlag til næringskunden'],
    },
    'handverk|enk':{
      day:['Enkel likviditet: utestående og regninger neste uke.','Timer på badjobben til kunden er samlet. Fakturaen er et utkast.','mva-frist og oppfølging til kunden. Du sier ja selv.'],
      skip:['Å regne likviditeten mellom jobbene','Å samle timer til faktura sent på kvelden','Å glemme mva-fristen og oppfølgingen til kunden'],
    },
    'regnskap|leder':{
      day:['Ukentlig nøkkeltall: omsetning, ordrereserve og avvik mot budsjett.','Møtebrief før byggkunden, med historikk, åpne saker og agenda.','A-melding og mva er flagget. næringskunden har fristen på listen.'],
      skip:['Å hente nøkkeltallene fra flere steder','Å møte byggkunden uten historikk og åpne saker','Å holde a-melding og mva i hodet'],
    },
    'regnskap|selger':{
      day:['Research før møtet med eiendomsselskapet: tidligere oppdrag og åpne saker.','Pipeline: tre tilbud ligger åpne, satt i rekkefølge.','Tilbudsutkast til byggkunden, bygget på forrige lignende oppdrag.'],
      skip:['Å møte eiendomsselskapet uten tidligere oppdrag','Å miste rekkefølgen på åpne tilbud','Å skrive tilbudet uten å se lignende oppdrag'],
    },
    'regnskap|kontor':{
      day:['Bilag avstemt mot timer og oppdrag. Avvik hos byggkunden er flagget.','Utkast til kundeoppfølging. byggkunden mangler ett bilag.','Leveransen til næringskunden er gjort klar fra regnskapssystemet ditt.'],
      skip:['Å avstemme bilag mot timer for hånd','Å purre bilaget fra byggkunden fra blankt ark','Å samle leveransen til næringskunden selv'],
    },
    'regnskap|enk':{
      day:['Enkel likviditet før neste ukes regninger.','Timer på oppdraget til byggkunden er klare til faktura.','Skattefrist og oppfølging. Utkastet sendes ikke før du sier ja.'],
      skip:['Å regne likviditeten mellom oppdrag','Å samle timer til faktura for hånd','Å oppdage skattefristen for sent'],
    },
    'helse|leder':{
      day:['Likviditet neste uker, fra utestående oppgjør og faste regninger.','Møtebrief før timen med kunden: historikk, åpne saker og agenda.','Forsikring og autorisasjon har frist. Ubesvart henvendelse fra kunden er med.'],
      skip:['Å sette opp likviditeten mellom timene','Å møte kunden uten åpne saker','Å oppdage frist på forsikring og autorisasjon for sent'],
    },
    'helse|selger':{
      day:['Research før samtalen med kunden: historikk og åpent spørsmål.','Oppfølging av henvendelser som har ligget stille, i rekkefølge.','Utkast til tilbud om opplegg, bygget på et lignende forløp. Ikke sendt.'],
      skip:['Å lete i historikken til kunden før samtalen','Å glemme henvendelser som har ligget stille','Å skrive tilbudet fra blankt ark'],
    },
    'helse|kontor':{
      day:['Oppgjør avstemt mot timer. Avvik for kunden er flagget.','Utkast til oppfølging av ubesvart time. Ingenting sendes uten ditt ja.','Grunnlag til næringskunden er samlet fra regnskapssystemet ditt.'],
      skip:['Å avstemme oppgjør mot timer for hånd','Å skrive oppfølgingen til kunden fra blankt ark','Å samle grunnlaget til næringskunden selv'],
    },
    'helse|enk':{
      day:['Enkel likviditet fra utestående oppgjør.','Timer og oppgjør for kunden er klare til faktura.','mva-frist og oppfølging av timen. Utkastet venter på deg.'],
      skip:['Å regne likviditeten mellom timene','Å samle oppgjør til faktura for hånd','Å glemme mva og oppfølgingen til kunden'],
    },
    'butikk|leder':{
      day:['Prisendring hos rørleggerfirmaet er flagget mot forrige avtale.','Marginen på avsluttede ordre avviker. Tre ordre er merket.','Likviditet neste uke, og mva-frist hos næringskunden.'],
      skip:['Å oppdage prisendringen fra rørleggerfirmaet i etterkant','Å sjekke marginen på avsluttede ordre for hånd','Å regne neste uke og mva-fristen selv'],
    },
    'butikk|selger':{
      day:['Research før samtalen med kunden om leveransen.','Åpne tilbud i rekkefølge. byggkunden har ligget lengst.','Tilbudsutkast bygget på en lignende ordre. Du leser før det sendes.'],
      skip:['Å møte kunden uten leveransehistorikken','Å følge opp åpne tilbud i tilfeldig rekkefølge','Å skrive tilbudet uten lignende ordre'],
    },
    'butikk|kontor':{
      day:['Fakturaer avstemt mot ordre. rørleggerfirmaet er flagget på avvikslisten.','Utkast til leverandøroppfølging og svar til kunden om retur.','Mappen til næringskunden er klar fra regnskapssystemet ditt.'],
      skip:['Å avstemme faktura mot ordre for hånd','Å skrive leverandøroppfølgingen fra blankt ark','Å lete fram bilag til næringskunden'],
    },
    'butikk|enk':{
      day:['Enkel likviditet: utestående og varekjøp neste uke.','Tilbud til kunden, bygget på en lignende ordre.','mva-frist og oppfølging av ordren. Ingenting sendes ennå.'],
      skip:['Å regne likviditet og varekjøp for hånd','Å skrive tilbudet til kunden fra blankt ark','Å glemme mva-fristen'],
    },
    'eiendom|leder':{
      day:['Likviditet fra utestående husleie og regninger de neste ukene.','Kontrakten fra eiendomsselskapet har punkter som avviker fra vanlige vilkår.','Forespørselen fra kunden er ubesvart. Forsikringsfrist er flagget.'],
      skip:['Å regne likviditeten fra husleie og regninger for hånd','Å lese kontrakten uten å se avvikene','Å glemme forespørselen fra kunden og forsikringsfristen'],
    },
    'eiendom|selger':{
      day:['Research før visning med kunden: historikk og åpne spørsmål.','Ubesvarte tilbud er satt i rekkefølge for oppfølging.','Tilbudsutkast til eiendomsselskapet, bygget på forrige oppdrag.'],
      skip:['Å gå på visning uten historikken til kunden','Å glemme ubesvarte tilbud','Å skrive tilbudet til eiendomsselskapet fra blankt ark'],
    },
    'eiendom|kontor':{
      day:['Krav avstemt mot avtaler. Avvik hos kunden er flagget.','Utkast til oppfølging av eiendomsselskapet. Ingenting sendes ennå.','Grunnlag til næringskunden er samlet fra regnskapssystemet ditt.'],
      skip:['Å avstemme krav mot avtaler for hånd','Å skrive oppfølgingen til eiendomsselskapet fra blankt ark','Å samle grunnlaget til næringskunden selv'],
    },
    'eiendom|enk':{
      day:['Enkel likviditet fra husleie som står ute.','Tilbud til kunden om det praktiske. Utkast, ikke sendt.','Kontraktsfrist og skattefrist. Oppfølgingen venter på deg.'],
      skip:['Å regne likviditeten fra husleie for hånd','Å skrive tilbudet til kunden fra blankt ark','Å glemme kontraktsfrist og skatt'],
    },
    'konsulent|leder':{
      day:['Nøkkeltall denne uken: omsetning, ordrereserve og avvik mot budsjett.','Møtebrief før kunden, med historikk, åpne saker og agenda.','Tilbudet til byggkunden er ubesvart. mva hos næringskunden er med.'],
      skip:['Å hente nøkkeltall fra flere steder før uken starter','Å møte kunden uten historikk og agenda','Å la tilbudet til byggkunden bli liggende'],
    },
    'konsulent|selger':{
      day:['Research før møtet med kunden: tidligere oppdrag og åpne saker.','Pipeline med åpne tilbud i rekkefølge. byggkunden først.','Tilbudsutkast bygget på et lignende oppdrag. Du leser før det sendes.'],
      skip:['Å møte kunden uten tidligere oppdrag','Å miste oversikten over åpne tilbud','Å skrive tilbudet fra blankt ark'],
    },
    'konsulent|kontor':{
      day:['Fakturaer avstemt mot timer. Avvik på byggkunden er flagget.','Utkast til oppfølging etter møtet med kunden.','Timegrunnlag til næringskunden er hentet fra regnskapssystemet ditt.'],
      skip:['Å avstemme faktura mot timer for hånd','Å skrive oppfølgingen til kunden fra blankt ark','Å rekonstruere timene til næringskunden'],
    },
    'konsulent|enk':{
      day:['Enkel likviditet før neste ukes regninger.','Timer hos kunden er klare. Fakturaen er et utkast.','mva-frist, og tilbudet til byggkunden er ubesvart.'],
      skip:['Å regne likviditeten mellom oppdrag','Å samle timer til faktura sent på kvelden','Å glemme mva og tilbudet til byggkunden'],
    },
    'restaurant|leder':{
      day:['Prisendring hos rørleggerfirmaet, og likviditet før neste ukes regninger.','Marginen på avsluttet selskap for kunden avviker fra lignende.','Forsikring og mva har frist. næringskunden står på listen.'],
      skip:['Å oppdage prisendringen fra rørleggerfirmaet for sent','Å sjekke marginen på selskapet til kunden for hånd','Å holde forsikring og mva i hodet'],
    },
    'restaurant|selger':{
      day:['Research før henvendelsen fra kunden om selskap.','Åpne forespørsler i rekkefølge. byggkunden har ventet lengst.','Tilbudsutkast til selskapet, bygget på et lignende arrangement.'],
      skip:['Å svare kunden uten å se tidligere selskap','Å følge opp forespørsler i tilfeldig rekkefølge','Å skrive tilbudet fra blankt ark'],
    },
    'restaurant|kontor':{
      day:['Leverandørfaktura avstemt mot følgeseddel. rørleggerfirmaet avviker.','Utkast til oppfølging av leverandøren og svar til kunden.','Mappen til næringskunden er samlet fra regnskapssystemet ditt.'],
      skip:['Å avstemme faktura mot følgeseddel for hånd','Å skrive oppfølgingen fra blankt ark','Å samle bilag til næringskunden selv'],
    },
    'restaurant|enk':{
      day:['Enkel likviditet før varekjøp neste uke.','Tilbud på selskap til kunden, bygget på et lignende.','mva-frist og oppfølging. Utkastet sendes ikke før du sier ja.'],
      skip:['Å regne likviditet og varekjøp for hånd','Å skrive tilbudet på selskapet fra blankt ark','Å glemme mva-fristen'],
    },
    'annet|leder':{
      day:['Likviditet neste uker, fra utestående og kommende regninger.','Møtebrief før kunden, med historikk, åpne saker og agenda.','Kort notat om et anbud, og frist for mva og a-melding.'],
      skip:['Å regne likviditeten for hånd','Å møte kunden uten åpne saker','Å vurdere anbud og frister fra blankt ark'],
    },
    'annet|selger':{
      day:['Research før møtet med kunden: historikk og åpne saker.','Pipeline: åpne tilbud satt i rekkefølge.','Tilbudsutkast til byggkunden, bygget på en lignende jobb.'],
      skip:['Å lete i historikken rett før møtet','Å gjette rekkefølgen på åpne tilbud','Å skrive tilbudet til byggkunden fra blankt ark'],
    },
    'annet|kontor':{
      day:['Fakturaer avstemt mot underlag. Avvikslisten er klar.','Utkast til kunde- og leverandøroppfølging. Ingenting sendes ennå.','Mappen til næringskunden er klar fra regnskapssystemet ditt.'],
      skip:['Å avstemme faktura mot underlag for hånd','Å skrive oppfølgingen fra blankt ark','Å lete fram mappen til næringskunden'],
    },
    'annet|enk':{
      day:['Enkel likviditet: utestående og regninger neste uke.','Tilbud til kunden. Timer er samlet til faktura.','mva-frist og kundeoppfølging. Du godkjenner før noe sendes.'],
      skip:['Å regne likviditeten mellom jobbene','Å skrive tilbud og samle timer for hånd','Å glemme mva og oppfølgingen'],
    },
    'borettslag|styreleder':{
      day:['Faktura fra rørleggerfirmaet er sjekket mot tidligere pris og avtalen.','Saksliste og innkalling ligger klare. Utkast til svar til beboeren.','Vedtak fra forrige møte, og to tilbud fra håndverkere, er sammenlignet.'],
      skip:['Å sjekke fakturaen mot avtale og forrige pris for hånd','Å skrive saksliste, innkalling og svar til beboeren fra blankt ark','Å sammenligne tilbud og følge vedtak uten oversikt'],
    },
    'borettslag|styremedlem':{
      day:['Lesestoff før møtet: fakturaen fra rørleggerfirmaet, med avvik mot avtalen.','Utkast til svar til beboeren. Ingenting sendes uten ditt ja.','Vedtak fra forrige møte som fortsatt er åpne, samlet til deg.'],
      skip:['Å lese faktura og avtale kvelden før møtet','Å skrive svaret til beboeren fra blankt ark','Å lete etter vedtak som ikke er fulgt opp'],
    },
    'borettslag|forretning':{
      day:['Faktura fra rørleggerfirmaet mot tidligere pris og avtale. Avvik er flagget.','To tilbud fra håndverkere er sammenlignet. Det som skiller er merket.','Vedlikeholdsplan og frister, pluss innkalling som utkast.'],
      skip:['Å kontrollere faktura mot avtale for hånd','Å sammenligne tilbudene uten en merknad','Å holde vedlikeholdsplanen og innkallingen i hodet'],
    },
    'forening|styreleder':{
      day:['Faktura fra rørleggerfirmaet er sjekket mot avtale og forrige pris.','Saksliste og innkalling til styremøtet er klare. Svarutkast til beboeren.','Vedtak fra forrige møte, og kontingent som står ute.'],
      skip:['Å sjekke fakturaen mot avtale for hånd','Å skrive saksliste og svar til beboeren fra blankt ark','Å følge vedtak og kontingent uten oversikt'],
    },
    'forening|styremedlem':{
      day:['Lesestoff før møtet, med avvik på fakturaen fra rørleggerfirmaet.','Utkast til svar til beboeren om årsmøtet.','Vedtak fra forrige møte som fortsatt er åpne.'],
      skip:['Å lete i saksdokumenter kvelden før møtet','Å skrive svaret til beboeren om årsmøtet fra blankt ark','Å møte uten å vite hvilke vedtak som står åpne'],
    },
    'forening|forretning':{
      day:['Faktura fra rørleggerfirmaet mot avtale. Avvik er flagget.','To tilbud er sammenlignet før de går til styret.','Vedlikehold og søknadsfrist, pluss innkalling til årsmøtet som utkast.'],
      skip:['Å kontrollere fakturaen mot avtalen for hånd','Å sammenligne tilbudene uten merknad','Å starte innkallingen og fristene fra blankt ark'],
    }
  };

  const BEAT={chip:240,type:380,work:420,say:560,react:460,sent:340,pick:900,after:460,hold:550,loop:750};
  const AIM=440;
  const TAP=320;
  const TYPE_GAP=40;
  const LINGER=1250;
  const typeMs=text=>Math.max(TYPE_GAP,String(text).length*TYPE_GAP+120);
  const readMs=value=>{
    const n=typeof value==='number'?value:String(value??'').length;
    return Math.max(1000,500+n*16);
  };
  const textLen=parts=>parts.filter(Boolean).reduce((n,s)=>n+String(s).length,0);
  const pace=(turn,reactOnce)=>{
    const plan=[];
    const push=(ms,label)=>plan.push({ms,label});
    push(BEAT.chip,'chip');
    if(turn.user){push(typeMs(turn.user),'typein');push(AIM,'aim');push(TAP,'tap');push(readMs(turn.user),'user');}
    push(BEAT.type,'type');
    for(const _line of (turn.work||[]))push(BEAT.work,'work');
    const linger=(turn.points||turn.linger)?LINGER:0;
    const sends=turn.mail&&!turn.mail.draft;
    const click=()=>{push(AIM,'aim');push(TAP,'tap');};
    if(turn.ask){
      push(readMs(textLen([turn.say,...(turn.points||[])])),'say');
      if(reactOnce)push(BEAT.react,'react');
      push(readMs(textLen([turn.ask.q,...(turn.ask.opts||[])]))+(turn.linger?LINGER:0),'ask');
      if(sends){click();push(BEAT.sent,'sent');}
      click();
      push(BEAT.pick,'pick');
      if(turn.ask.after)push(readMs(turn.ask.after),'after');
      push(BEAT.hold,'hold');
    }else if(turn.mail){
      push(readMs(textLen([turn.say,...(turn.points||[]),turn.mail.body])),'say');
      if(reactOnce)push(BEAT.react,'react');
      if(sends){click();push(BEAT.sent,'sent');}
      push(BEAT.hold,'hold');
    }else{
      push(BEAT.say,'say');
      if(reactOnce)push(BEAT.react,'react');
      const lead=BEAT.say+(reactOnce?BEAT.react:0);
      push(Math.max(200,readMs(textLen([turn.say,...(turn.points||[])]))+linger-lead),'hold');
    }
    return plan;
  };
  const chatPlayers=new Map();
  const typeTimers=new Map();
  const pointerSvg=()=>{
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 13 19');
    svg.setAttribute('width','15');
    svg.setAttribute('height','20');
    svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('fill','#fff');
    path.setAttribute('stroke','#14211f');
    path.setAttribute('stroke-width','1.15');
    path.setAttribute('stroke-linejoin','round');
    path.setAttribute('d','M1 1 L1 14.6 L4.7 11.2 L7.5 17.7 L9.7 16.8 L6.9 10.4 L11.5 10.2 Z');
    svg.append(path);
    return svg;
  };
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
  const clockOf=t=>String(t).split('·')[0].trim();
  const fileSize=name=>{let n=0;for(const c of name)n+=c.charCodeAt(0);return (16+(n%74))+' kB';};
  const fileCard=name=>{
    const card=el('div','filecard');
    const meta=el('span','file-meta');
    meta.append(el('b',null,name),el('small',null,fileSize(name)));
    card.append(el('span','file-ico'),meta);
    return card;
  };
  const settle=thread=>thread.querySelectorAll('.workline.is-run').forEach(n=>{n.classList.remove('is-run');n.classList.add('is-done');});
  const timeline=turns=>{
    const items=[];
    let reactOnce=true;
    for(const turn of turns){
      items.push(...pace(turn,reactOnce));
      if(reactOnce)reactOnce=false;
    }
    return items;
  };
  const atEnd=(turns,label)=>{
    let t=0,last=0,seen=false;
    for(const step of timeline(turns)){
      t+=step.ms;
      if(step.label===label){last=t;seen=true;}
    }
    return seen?last:t;
  };
  const chatSteps=(root,turns)=>{
    const steps=[];
    const add=(ms,label,run,skip)=>steps.push({ms,label,run,skip:!!skip});
    const field=()=>root.querySelector('.compose-text');
    const box=()=>root.querySelector('.compose-box');
    const go=()=>root.querySelector('.compose-go');
    const live=()=>!root.classList.contains('is-instant');
    const cursor=()=>{
      let p=root.querySelector('.chat-pointer');
      if(!p){p=el('span','chat-pointer');p.append(pointerSvg());root.append(p);}
      return p;
    };
    const release=()=>{
      root.querySelectorAll('.is-hot,.is-press').forEach(n=>n.classList.remove('is-hot','is-press'));
      root.querySelectorAll('.tap-ring').forEach(n=>n.remove());
      const p=root.querySelector('.chat-pointer');
      if(p)p.style.opacity='0';
    };
    const aimAt=node=>{
      if(!live()||!node)return;
      const body=root.querySelector('.chat-body');
      if(body)body.scrollTop=body.scrollHeight;
      const p=cursor();
      const bounds=root.getBoundingClientRect();
      const r=node.getBoundingClientRect();
      const pw=15,ph=20,pad=3;
      let x=r.left-bounds.left-root.clientLeft+Math.min(12,Math.max(6,r.width*0.32));
      let y=r.top-bounds.top-root.clientTop+Math.min(8,Math.max(4,r.height*0.28));
      x=Math.max(pad,Math.min(bounds.width-pw-pad,x));
      y=Math.max(pad,Math.min(bounds.height-ph-pad,y));
      if(p.style.opacity!=='1'){
        let sx=parseFloat(p.style.left),sy=parseFloat(p.style.top);
        if(!p.dataset.parked||Math.hypot((sx||0)-x,(sy||0)-y)<48){
          sx=Math.max(pad,Math.min(bounds.width-pw-pad,x-72));
          sy=Math.max(pad,Math.min(bounds.height-ph-pad,y+40));
          if(Math.hypot(sx-x,sy-y)<48){sx=Math.max(pad,x-88);sy=Math.max(pad,y-56);}
        }
        p.style.transition='none';
        p.style.left=sx+'px';
        p.style.top=sy+'px';
        p.style.opacity='0';
        void p.offsetWidth;
        p.style.transition='';
      }
      p.dataset.parked='1';
      p.style.left=x+'px';
      p.style.top=y+'px';
      p.style.opacity='1';
      node.classList.add('is-hot');
    };
    const tapAt=node=>{
      if(!live()||!node)return;
      node.classList.remove('is-hot');
      node.classList.add('is-press');
      node.querySelectorAll('.tap-ring').forEach(n=>n.remove());
      node.append(el('i','tap-ring'));
    };
    const idleCompose=()=>{
      const timer=typeTimers.get(root);
      if(timer)clearInterval(timer);
      const f=field();if(f)f.textContent='';
      box()?.classList.remove('is-typing');
    };
    let reactOnce=true;
    for(const turn of turns){
      const plan=pace(turn,reactOnce);
      const ms=()=>{
        const step=plan.shift();
        if(!step)throw new Error('chat pace');
        return step.ms;
      };
      add(ms(),'chip',thread=>{
        const d=el('p','divider');
        d.append(el('span',null,clockOf(turn.t)));
        if(!turn.user)d.append(el('span','div-tag','Rutine'));
        thread.append(d);
      });
      if(turn.user){
        add(ms(),'typein',()=>{
          const f=field();
          const b=box();
          if(!f||!b)return;
          b.classList.add('is-typing');
          if(root.classList.contains('is-instant')){f.textContent=turn.user;return;}
          f.textContent='';
          let i=0;
          const prev=typeTimers.get(root);
          if(prev)clearInterval(prev);
          const timer=setInterval(()=>{
            i+=1;
            f.textContent=turn.user.slice(0,i);
            if(i>=turn.user.length)clearInterval(timer);
          },TYPE_GAP);
          typeTimers.set(root,timer);
        },true);
        add(ms(),'aim',()=>{aimAt(go());},true);
        add(ms(),'tap',()=>{tapAt(go());},true);
        add(ms(),'user',thread=>{
          idleCompose();
          release();
          const m=el('div','msg msg-user');
          const bubble=el('div','bubble');
          bubble.append(el('p',null,turn.user));
          m.append(bubble);
          thread.append(m);
        });
      }
      const typing=el('div','msg msg-bot typing-row');
      const dots=el('div','chat-typing');
      dots.append(el('i'),el('i'),el('i'));
      typing.append(el('span','ava-sm','A'),dots);
      add(ms(),'type',thread=>{go()?.classList.remove('is-press');thread.append(typing);},true);
      for(const line of (turn.work||[])){
        add(ms(),'work',thread=>{
          settle(thread);
          const row=el('p','workline is-run');
          row.append(el('i','wico'),el('span',null,line));
          thread.append(row);
        });
      }
      let mailActions=null,sendBtn=null,choiceBox=null,host=null;
      add(ms(),'say',thread=>{
        typing.remove();
        settle(thread);
        const m=el('div','msg msg-bot');
        const col=el('div','bot-col');
        host=col;
        col.append(el('p','bot-name','Din assistent'));
        col.append(el('p','bot-text',turn.say));
        if(turn.points){
          const list=el('ul','brief');
          turn.points.forEach(point=>list.append(el('li',null,point)));
          col.append(list);
        }
        if(turn.file)col.append(fileCard(turn.file));
        if(turn.mail){
          const mail=el('div','mail');
          const r1=el('p','mail-row');
          r1.append(el('b',null,'Til'),el('span',null,turn.mail.to));
          const r2=el('p','mail-row');
          r2.append(el('b',null,'Emne'),el('span',null,turn.mail.sub));
          mail.append(r1,r2,el('p',null,turn.mail.body));
          mailActions=el('div','chat-actions');
          mailActions.append(el('span','cbtn cbtn-ghost','Endre'),sendBtn=el('span','cbtn cbtn-go','Send'));
          mail.append(mailActions);
          col.append(mail);
        }
        m.append(el('span','ava-sm','A'),col);
        thread.append(m);
      });
      if(reactOnce){
        add(ms(),'react',()=>{
          if(!host)return;
          host.insertBefore(el('span','react','👍'),host.querySelector('.filecard,.mail,.qcard'));
        });
        reactOnce=false;
      }
      if(turn.ask){
        add(ms(),'ask',()=>{
          if(!host)return;
          const q=el('div','qcard');
          q.append(el('p',null,turn.ask.q));
          choiceBox=el('div','choices');
          turn.ask.opts.forEach((opt,i)=>choiceBox.append(el('span',i===0?'choice is-primary':'choice',opt)));
          q.append(choiceBox);
          host.append(q);
        });
      }
      if(turn.mail&&!turn.mail.draft){
        add(ms(),'aim',()=>{aimAt(sendBtn);},true);
        add(ms(),'tap',()=>{tapAt(sendBtn);},true);
        add(ms(),'sent',()=>{
          release();
          mailActions.replaceChildren(el('span','cbtn cbtn-sent','✓ Sendt'));
        });
      }
      if(turn.ask){
        const chosen=()=>choiceBox&&choiceBox.children[turn.ask.pick];
        add(ms(),'aim',()=>{aimAt(chosen());},true);
        add(ms(),'tap',()=>{tapAt(chosen());},true);
        add(ms(),'pick',()=>{
          release();
          [...choiceBox.children].forEach((c,i)=>{
            const on=i===turn.ask.pick;
            c.classList.toggle('is-on',on);
            c.classList.toggle('is-off',!on);
            if(!on)c.classList.remove('is-primary');
            if(on)c.classList.add('is-primary');
          });
        });
        if(turn.ask.after){
          add(ms(),'after',thread=>{
            const m=el('div','msg msg-bot');
            const col=el('div','bot-col');
            col.append(el('p','bot-name','Din assistent'));
            col.append(el('p','bot-text',turn.ask.after));
            m.append(el('span','ava-sm','A'),col);
            thread.append(m);
          });
        }
      }
      add(ms(),'hold',()=>{});
      if(plan.length)throw new Error('unused pace');
    }
    return steps;
  };
  const stopChat=root=>{
    const stop=chatPlayers.get(root);
    if(stop)stop();
    const timer=typeTimers.get(root);
    if(timer)clearInterval(timer);
    const p=root.querySelector('.chat-pointer');
    if(p){p.style.transition='none';p.style.opacity='0';}
    root.querySelectorAll('.is-hot,.is-press').forEach(n=>n.classList.remove('is-hot','is-press'));
    root.querySelectorAll('.tap-ring').forEach(n=>n.remove());
  };
  const playChat=(root,turns)=>{
    stopChat(root);
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body=root.querySelector('.chat-body');
    const thread=root.querySelector('.thread');
    const steps=chatSteps(root,turns);
    let dead=false,timer=0;
    const scroll=()=>{body.scrollTop=body.scrollHeight;};
    const resetCompose=()=>{
      const f=root.querySelector('.compose-text');
      if(f)f.textContent='';
      root.querySelector('.compose-box')?.classList.remove('is-typing');
      root.querySelector('.compose-go')?.classList.remove('is-press','is-hot');
      const p=root.querySelector('.chat-pointer');
      if(p)p.style.opacity='0';
    };
    thread.replaceChildren();
    resetCompose();
    if(reduce){
      root.classList.add('is-instant');
      steps.forEach(s=>{if(!s.skip)s.run(thread);});
      scroll();
      const stop=()=>{dead=true;};
      chatPlayers.set(root,stop);
      return stop;
    }
    root.classList.remove('is-instant');
    const run=i=>{
      if(dead)return;
      if(i>=steps.length){
        timer=setTimeout(()=>{
          if(dead)return;
          thread.replaceChildren();
          resetCompose();
          body.scrollTop=0;
          run(0);
        },BEAT.loop);
        return;
      }
      steps[i].run(thread);
      scroll();
      timer=setTimeout(()=>run(i+1),steps[i].ms);
    };
    run(0);
    const stop=()=>{dead=true;clearTimeout(timer);};
    chatPlayers.set(root,stop);
    return stop;
  };
  const seekChat=(root,turns,ms)=>{
    stopChat(root);
    chatPlayers.set(root,()=>{});
    root.classList.add('is-instant');
    const body=root.querySelector('.chat-body');
    const thread=root.querySelector('.thread');
    const prev=body.style.scrollBehavior;
    body.style.scrollBehavior='auto';
    const f=root.querySelector('.compose-text');
    if(f)f.textContent='';
    root.querySelector('.compose-box')?.classList.remove('is-typing');
    const steps=chatSteps(root,turns);
    thread.replaceChildren();
    let start=0;
    for(const s of steps){
      if(start>=ms)break;
      s.run(thread);
      start+=s.ms;
    }
    body.scrollTop=body.scrollHeight;
    body.style.scrollBehavior=prev;
  };
  const heroTurns = [
    {
      "t": "07:30 · Morgenbrief (fast rutine)",
      "work": [
        "Samlet 4 saker for i dag"
      ],
      "say": "God morgen. Dette er dagen din:",
      "points": [
        "Faktura 1042 til kunden er forfalt.",
        "mva-meldingen må sendes denne uken.",
        "rørleggerfirmaet sjekkes mot avtalen.",
        "Stram likviditet de neste ukene."
      ]
    },
    {
      "t": "08:10",
      "user": "Ta purringen til kunden først.",
      "work": [
        "Skrev utkast til kunden"
      ],
      "say": "Purreutkastet på faktura 1042 er klart. Ingenting går ut før du trykker Send.",
      "mail": {
        "to": "kunden",
        "sub": "Faktura forfalt",
        "body": "Hei kunden. Vi minner om faktura 1042 for badjobben, som forfalt 10. oktober. Gi gjerne beskjed om noe er uklart. Hilsen oss",
        "draft": true
      }
    },
    {
      "t": "08:50",
      "user": "Legg til at hun kan dele betalingen i to.",
      "work": [
        "Oppdaterte utkastet"
      ],
      "say": "Oppdatert. Den går ut når du trykker Send.",
      "mail": {
        "to": "kunden",
        "sub": "Faktura forfalt",
        "body": "Hei kunden. Vi minner om faktura 1042 for badjobben, som forfalt 10. oktober. Beløpet kan deles i to. Gi gjerne beskjed om noe er uklart. Hilsen oss"
      }
    },
    {
      "t": "10:40",
      "work": [
        "Klargjorde grunnlaget for mva"
      ],
      "say": "Grunnlaget for mva-meldingen er klart. Du godkjenner før den sendes.",
      "file": "MVA_oktober.xlsx"
    },
    {
      "t": "12:15",
      "work": [
        "Sammenlignet med 3 tidligere fakturaer"
      ],
      "say": "Fakturaen fra rørleggerfirmaet er høyere enn sist, og ett vilkår avviker fra avtalen.",
      "ask": {
        "q": "Skal jeg legge den til side?",
        "opts": [
          "Ja, vis avviket",
          "Vent til i morgen"
        ],
        "pick": 0,
        "after": "Greit. Den blir liggende til du har sett den."
      }
    },
    {
      "t": "14:30",
      "user": "Hvilke regninger kan vente?",
      "work": [
        "Sammenlignet med regninger som kommer"
      ],
      "say": "rørleggerfirmaet kan vente til du har sett avviket. Kontorleien kan vente til fredag. mva-meldingen kan ikke vente.",
      "file": "Likviditet_uke43.xlsx"
    },
    {
      "t": "16:20",
      "linger": true,
      "work": [
        "Så på purringene denne uken"
      ],
      "say": "Jeg ser at du purrer manuelt flere ganger i uken.",
      "ask": {
        "q": "Ønsker du at jeg lager en egen bot som følger opp forfalte fakturaer automatisk?",
        "opts": [
          "Ja, lag den",
          "Ikke nå"
        ],
        "pick": 0,
        "after": "Greit. Jeg lager den, og du ser utkastene før noe sendes."
      }
    }
  ];
  const dayTurns = {
    "handverk|leder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 11 e-poster",
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "Tre fakturaer er forfalt. Regningen fra rørleggerfirmaet kommer de neste ukene.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:15",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med regninger som kommer"
        ],
        "say": "Uken er stram før mva hos næringskunden. Ingenting er betalt."
      },
      {
        "t": "12:10",
        "user": "Hva med marginen på badjobben til kunden?",
        "work": [
          "Sammenlignet med 3 lignende badjobber"
        ],
        "say": "Badjobben til kunden ligger under de tre. Ett punkt skiller seg ut."
      },
      {
        "t": "14:20",
        "work": [
          "Fant 1 forfalt faktura"
        ],
        "say": "byggkunden har en faktura som er forfalt.",
        "ask": {
          "q": "Skal jeg purre byggkunden?",
          "opts": [
            "Ja, lag purring",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Jeg skriver utkastet. Det sendes ikke før du har lest det."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Skrev purreutkast",
          "Noterte sertifikatet denne uken"
        ],
        "say": "Her er utkastet. Sertifikatet er notert ved siden av. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "byggkunden",
          "sub": "Purring",
          "body": "Hei. Vi minner om faktura 1048, som forfalt 3. oktober. Gi gjerne beskjed om noe er uklart. Hilsen oss"
        }
      }
    ],
    "handverk|selger": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 8 e-poster",
          "Hentet historikk på kunden"
        ],
        "say": "Før møtet: bad og service i historikken, og ett tilbud som fortsatt er åpent."
      },
      {
        "t": "09:05",
        "user": "Forbered meg til møtet med kunden.",
        "work": [
          "Samlet 2 åpne saker"
        ],
        "say": "To saker er åpne. Jeg har lagt dem øverst. Ingenting er sendt."
      },
      {
        "t": "12:10",
        "work": [
          "Satte 3 tilbud i rekkefølge"
        ],
        "say": "kunden har ventet lengst. Så byggkunden, deretter eiendomsselskapet.",
        "ask": {
          "q": "Skal jeg følge opp kunden først?",
          "opts": [
            "Ja, lag utkast",
            "Ta byggkunden først"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du sier ja."
        }
      },
      {
        "t": "15:40",
        "user": "Lag et tilbud til kunden basert på badjobben i fjor.",
        "work": [
          "Leste badjobben fra i fjor"
        ],
        "say": "Tilbudet er bygget på den jobben. Les det før du trykker Send.",
        "file": "Tilbud_kunden.pdf",
        "mail": {
          "to": "kunden",
          "sub": "Tilbud, bad",
          "body": "Hei kunden. Her er tilbud på badet, bygget på jobben vi gjorde i fjor. Si fra om du vil justere noe før vi går videre. Hilsen oss"
        }
      }
    ],
    "handverk|kontor": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 12 e-poster",
          "Avstemte 6 fakturaer mot ordre"
        ],
        "say": "Fakturaen fra rørleggerfirmaet stemmer ikke med ordren. Den fra kunden stemmer."
      },
      {
        "t": "10:05",
        "user": "Hva er avviket?",
        "work": [
          "Sammenlignet med 2 ordre"
        ],
        "say": "Ett punkt hos rørleggerfirmaet avviker. To poster bør du se før noe betales.",
        "ask": {
          "q": "Skal jeg legge den til side?",
          "opts": [
            "Ja, vis avviket",
            "Ta den med videre"
          ],
          "pick": 0,
          "after": "Den blir liggende til du har sett den. Ingenting er betalt."
        }
      },
      {
        "t": "13:30",
        "work": [
          "Skrev utkast til kunden"
        ],
        "say": "Oppfølging til kunden, med kopi til leverandøren. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Oppfølging av ordre",
          "body": "Hei kunden. Jeg viser til ordren. Vi er i gang, og jeg sender en kort status når neste del er klar. Gi gjerne beskjed om noe haster. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet bilag fra regnskapssystemet"
        ],
        "say": "Mappen til næringskunden er samlet. Avviket er lagt ved.",
        "file": "Mappe_naeringskunden.pdf"
      }
    ],
    "handverk|enk": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "To fakturaer står ute. Regningen fra rørleggerfirmaet kommer neste uke.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:40",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med regninger neste uke"
        ],
        "say": "Neste uke er stram. Se oversikten før du betaler noe."
      },
      {
        "t": "12:30",
        "user": "Samle timene på badjobben til kunden.",
        "work": [
          "Samlet timer fra 4 dager"
        ],
        "say": "Timene er samlet. Fakturaen er et utkast, og sendes ikke før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Faktura, badjobb",
          "body": "Hei kunden. Her er faktura for timene på badjobben. Si fra om noe ikke stemmer, så retter jeg det. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket 2 frister"
        ],
        "say": "mva-fristen denne perioden nærmer seg. Oppfølgingen til kunden er ikke sendt.",
        "ask": {
          "q": "Skal jeg minne kunden?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 1,
          "after": "Greit. Jeg venter, og sier ifra igjen om en uke."
        }
      }
    ],
    "regnskap|leder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 9 e-poster",
          "Hentet ukens tall fra regnskapssystemet"
        ],
        "say": "Omsetningen så langt er inne. Ordrereserven er 4 oppdrag, og ett tall avviker fra budsjettet.",
        "file": "Nokkeltall_uke43.xlsx"
      },
      {
        "t": "09:20",
        "user": "Hva avviker?",
        "work": [
          "Sammenlignet med budsjettet"
        ],
        "say": "Ett tall ligger unna budsjettet. Resten følger uken.",
        "ask": {
          "q": "Skal jeg ta avviket med i møtebriefen?",
          "opts": [
            "Ja, ta det med",
            "La det ligge"
          ],
          "pick": 0,
          "after": "Det blir med. Ingenting er endret i tallene."
        }
      },
      {
        "t": "11:50",
        "user": "Forbered meg til møtet med byggkunden.",
        "work": [
          "Hentet historikk",
          "Fant 2 åpne saker"
        ],
        "say": "Historikk, to åpne saker og et forslag til agenda er klare.",
        "file": "Motebrief_byggkunden.pdf"
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket a-melding og mva"
        ],
        "say": "A-melding og mva denne perioden er flagget. Varselutkastet til næringskunden sendes ikke før du trykker Send.",
        "mail": {
          "to": "næringskunden",
          "sub": "Frister denne perioden",
          "body": "Hei. A-melding og mva har frist denne perioden. Begge står på listen. Gi gjerne beskjed om noe skal flyttes."
        }
      }
    ],
    "regnskap|selger": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 7 e-poster",
          "Hentet tidligere oppdrag"
        ],
        "say": "Før møtet med eiendomsselskapet: tre tidligere oppdrag og to åpne saker."
      },
      {
        "t": "11:10",
        "user": "Forbered meg til møtet med eiendomsselskapet kl 13.",
        "work": [
          "Samlet historikk og åpne saker"
        ],
        "say": "Briefen er klar: historikk, åpne saker og det du bør spørre om.",
        "file": "Motebrief_eiendomsselskapet.pdf"
      },
      {
        "t": "14:05",
        "work": [
          "Satte 3 tilbud i rekkefølge"
        ],
        "say": "Tre tilbud ligger åpne. eiendomsselskapet står først, så to andre.",
        "ask": {
          "q": "Skal jeg følge opp eiendomsselskapet først?",
          "opts": [
            "Ja, lag utkast",
            "Vent til etter møtet"
          ],
          "pick": 1,
          "after": "Greit. Jeg venter til etter møtet, og sender ingenting."
        }
      },
      {
        "t": "16:40",
        "user": "Lag tilbud til byggkunden, som forrige oppdrag.",
        "work": [
          "Leste forrige lignende oppdrag"
        ],
        "say": "Utkastet er bygget på det oppdraget. Les det før du trykker Send.",
        "mail": {
          "to": "byggkunden",
          "sub": "Tilbud",
          "body": "Hei. Her er tilbudet, bygget på forrige oppdrag hos dere. Si fra om noe skal endres. Hilsen oss"
        }
      }
    ],
    "regnskap|kontor": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Avstemte 8 bilag mot timer"
        ],
        "say": "Bilagene er sjekket mot timer og oppdrag. byggkunden har ett avvik."
      },
      {
        "t": "10:15",
        "user": "Vis meg avviket.",
        "work": [
          "Sammenlignet med 2 oppdrag"
        ],
        "say": "Ett bilag hos byggkunden mangler. De andre stemmer.",
        "ask": {
          "q": "Skal jeg be om bilaget?",
          "opts": [
            "Ja, lag utkast",
            "Jeg tar den selv"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du har lest det."
        }
      },
      {
        "t": "13:20",
        "work": [
          "Skrev utkast til byggkunden"
        ],
        "say": "De mangler ett bilag. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "byggkunden",
          "sub": "Bilag mangler",
          "body": "Hei. Vi mangler ett bilag på oppdraget. Kan dere sende det, så blir grunnlaget komplett? Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet leveransen fra regnskapssystemet"
        ],
        "say": "Leveransen til næringskunden er klar. Avviket er lagt ved.",
        "file": "Leveranse_naeringskunden.pdf"
      }
    ],
    "regnskap|enk": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "To fakturaer står ute, og regningene neste uke er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:35",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med regninger neste uke"
        ],
        "say": "Neste uke er stram. Ingenting er betalt."
      },
      {
        "t": "12:45",
        "user": "Samle timene på byggkunden.",
        "work": [
          "Samlet timer fra 5 dager"
        ],
        "say": "Timene er klare til faktura. Utkastet sendes ikke før du trykker Send.",
        "mail": {
          "to": "byggkunden",
          "sub": "Timer denne perioden",
          "body": "Hei. Her er timene på oppdraget denne perioden. Si fra om noe skal rettes før det faktureres. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket skattefristen"
        ],
        "say": "Skattefristen nærmer seg. Oppfølgingen ligger klar, men er ikke sendt.",
        "ask": {
          "q": "Skal jeg skrive oppfølgingen?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Utkastet ligger klart. Det sendes ikke før du sier ja."
        }
      }
    ],
    "helse|leder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 10 e-poster",
          "Hentet utestående oppgjør"
        ],
        "say": "Tre oppgjør står ute. Faste regninger de neste ukene er med i oversikten.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "10:40",
        "user": "Forbered meg til timen med kunden.",
        "work": [
          "Hentet historikk",
          "Fant 2 åpne saker"
        ],
        "say": "Historikk, to åpne saker og et forslag til agenda er klare.",
        "file": "Motebrief_kunden.pdf"
      },
      {
        "t": "13:10",
        "work": [
          "Sjekket 2 frister"
        ],
        "say": "Forsikring og autorisasjon har frist denne perioden. Henvendelsen fra kunden er fortsatt ubesvart.",
        "ask": {
          "q": "Skal jeg svare kunden?",
          "opts": [
            "Ja, lag utkast",
            "Vent til etter timen"
          ],
          "pick": 1,
          "after": "Greit. Jeg venter til etter timen, og sender ingenting."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Skrev utkast til kunden"
        ],
        "say": "Utkastet etter timen er klart. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Oppfølging etter timen",
          "body": "Hei kunden. Takk for i dag. Her er en kort oppsummering av det vi avtalte, så du har det samlet. Gi gjerne beskjed om noe skal endres. Hilsen oss"
        }
      }
    ],
    "helse|selger": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 6 e-poster",
          "Hentet historikk på kunden"
        ],
        "say": "Før samtalen: historikken er samlet, og ett spørsmål er fortsatt åpent."
      },
      {
        "t": "09:50",
        "user": "Forbered meg til samtalen med kunden.",
        "work": [
          "Samlet 1 åpent spørsmål"
        ],
        "say": "Spørsmålet ligger øverst, med kort historikk under. Ingenting er sendt."
      },
      {
        "t": "12:30",
        "work": [
          "Satte 3 henvendelser i rekkefølge"
        ],
        "say": "Tre henvendelser har ligget stille. kunden har ventet lengst.",
        "ask": {
          "q": "Skal jeg følge opp kunden først?",
          "opts": [
            "Ja, lag utkast",
            "Ta den neste først"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du sier ja."
        }
      },
      {
        "t": "15:55",
        "user": "Lag et tilbud om opplegg, som det lignende forløpet.",
        "work": [
          "Leste 1 lignende forløp"
        ],
        "say": "Tilbudet er bygget på det forløpet. Les det før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Tilbud om opplegg",
          "body": "Hei kunden. Her er et forslag til opplegg, bygget på et lignende forløp. Si fra om det treffer, eller om noe skal justeres. Hilsen oss"
        }
      }
    ],
    "helse|kontor": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Avstemte 5 oppgjør mot timer"
        ],
        "say": "Oppgjørene er sjekket mot timer. kunden har ett avvik."
      },
      {
        "t": "10:25",
        "user": "Vis meg avviket.",
        "work": [
          "Sammenlignet med timene"
        ],
        "say": "Ett oppgjør for kunden stemmer ikke med timene. De andre er i orden.",
        "ask": {
          "q": "Skal jeg legge det til side?",
          "opts": [
            "Ja, vis avviket",
            "Ta det med videre"
          ],
          "pick": 0,
          "after": "Det blir liggende til du har sett det. Ingenting er sendt."
        }
      },
      {
        "t": "13:40",
        "work": [
          "Skrev utkast om ubesvart time"
        ],
        "say": "Utkast til den ubesvarte timen. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Time som venter",
          "body": "Hei kunden. Du har en time som fortsatt står ubesvart. Si fra om den passer, eller om vi skal finne et nytt tidspunkt. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet grunnlag fra regnskapssystemet"
        ],
        "say": "Grunnlaget til næringskunden er samlet. Avviket er lagt ved.",
        "file": "Grunnlag_naeringskunden.pdf"
      }
    ],
    "helse|enk": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Hentet utestående oppgjør"
        ],
        "say": "To oppgjør står ute. Oversikten for neste uke er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:25",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med faste regninger"
        ],
        "say": "Neste uke går, men se oppgjørene før du betaler noe."
      },
      {
        "t": "12:15",
        "user": "Samle timer og oppgjør for kunden.",
        "work": [
          "Samlet timer fra 3 dager"
        ],
        "say": "Timer og oppgjør for kunden er klare. Fakturaen sendes ikke før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Oppgjør",
          "body": "Hei kunden. Her er oppgjøret for timene. Si fra om noe ikke stemmer, så retter jeg det før det går videre. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket mva-fristen"
        ],
        "say": "mva-fristen nærmer seg. Oppfølgingen av timen venter på deg.",
        "ask": {
          "q": "Skal jeg skrive oppfølgingen?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Utkastet ligger klart. Det sendes ikke før du sier ja."
        }
      }
    ],
    "butikk|leder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 13 e-poster",
          "Sammenlignet med forrige avtale"
        ],
        "say": "rørleggerfirmaet har endret prisen mot forrige avtale. Jeg har ikke betalt noe."
      },
      {
        "t": "10:00",
        "work": [
          "Sjekket marginen på 3 ordre"
        ],
        "say": "Tre avsluttede ordre skiller seg ut på marginen. De er merket.",
        "ask": {
          "q": "Skal jeg legge ordreavvikene til side?",
          "opts": [
            "Ja, vis dem",
            "Ta dem i kveld"
          ],
          "pick": 0,
          "after": "De ligger klare. Ingenting er endret i ordrene."
        }
      },
      {
        "t": "13:05",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "Neste uke er stram. mva-fristen hos næringskunden er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "16:30",
        "work": [
          "Skrev varselutkast til næringskunden"
        ],
        "say": "Utkast om mva-fristen. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "næringskunden",
          "sub": "mva-frist",
          "body": "Hei. mva-fristen står på listen denne perioden. Gi gjerne beskjed om du vil at jeg setter av tid til den."
        }
      }
    ],
    "butikk|selger": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 5 e-poster",
          "Hentet leveransen til kunden"
        ],
        "say": "Før samtalen med kunden: leveransen og ett åpent spørsmål er samlet."
      },
      {
        "t": "09:40",
        "user": "Forbered meg til samtalen med kunden om leveransen.",
        "work": [
          "Samlet 1 åpent spørsmål"
        ],
        "say": "Spørsmålet om leveransen ligger øverst. Ingenting er sendt."
      },
      {
        "t": "12:20",
        "work": [
          "Satte 3 tilbud i rekkefølge"
        ],
        "say": "byggkunden har ligget lengst. kunden står som nummer to.",
        "ask": {
          "q": "Skal jeg følge opp byggkunden først?",
          "opts": [
            "Ja, lag utkast",
            "Ta kunden først"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du sier ja."
        }
      },
      {
        "t": "15:30",
        "user": "Lag et tilbud bygget på en lignende ordre.",
        "work": [
          "Leste 1 lignende ordre"
        ],
        "say": "Tilbudet er bygget på den ordren. Les det før du trykker Send.",
        "mail": {
          "to": "byggkunden",
          "sub": "Tilbud",
          "body": "Hei. Her er tilbudet, bygget på en lignende ordre. Si fra om noe skal endres. Hilsen oss"
        }
      }
    ],
    "butikk|kontor": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Avstemte 7 fakturaer mot ordre"
        ],
        "say": "Fakturaene er sjekket mot ordre. rørleggerfirmaet står på avvikslisten."
      },
      {
        "t": "10:35",
        "user": "Hva avviker?",
        "work": [
          "Sammenlignet med 2 ordre"
        ],
        "say": "Ett punkt hos rørleggerfirmaet stemmer ikke. Resten er i orden.",
        "ask": {
          "q": "Skal jeg legge avviket til side?",
          "opts": [
            "Ja, vis avviket",
            "Ta det med videre"
          ],
          "pick": 0,
          "after": "Det blir liggende til du har sett det. Ingenting er betalt."
        }
      },
      {
        "t": "13:15",
        "work": [
          "Skrev utkast om retur"
        ],
        "say": "Svar til kunden om returen, og et notat til leverandøren. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Retur",
          "body": "Hei kunden. Jeg viser til returen. Den er notert hos oss. Gi gjerne beskjed om noe haster, så tar jeg det først. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet mappen fra regnskapssystemet"
        ],
        "say": "Mappen til næringskunden er klar. Avviket er lagt ved.",
        "file": "Mappe_naeringskunden.pdf"
      }
    ],
    "butikk|enk": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "To fakturaer står ute. Varekjøpet neste uke er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:30",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med varekjøp neste uke"
        ],
        "say": "Neste uke er stram før varekjøpet. Ingenting er betalt."
      },
      {
        "t": "12:40",
        "user": "Lag et tilbud til kunden, som den lignende ordren.",
        "work": [
          "Leste 1 lignende ordre"
        ],
        "say": "Tilbudet er bygget på den ordren. Det sendes ikke før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Tilbud",
          "body": "Hei kunden. Her er tilbudet, bygget på en lignende ordre. Si fra om du vil justere noe. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket mva-fristen"
        ],
        "say": "mva-fristen nærmer seg, og ordren til kunden er ikke fulgt opp.",
        "ask": {
          "q": "Skal jeg følge opp ordren?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Utkastet ligger klart. Det sendes ikke før du sier ja."
        }
      }
    ],
    "eiendom|leder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 8 e-poster",
          "Hentet utestående husleie"
        ],
        "say": "To husleier står ute. Regningene de neste ukene er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "10:20",
        "work": [
          "Leste kontrakten fra eiendomsselskapet",
          "Sammenlignet med vanlige vilkår"
        ],
        "say": "To punkter i kontrakten avviker fra vanlige vilkår.",
        "ask": {
          "q": "Skal jeg legge avvikene til side?",
          "opts": [
            "Ja, vis avvikene",
            "Vent til i morgen"
          ],
          "pick": 0,
          "after": "De blir liggende til du har lest dem. Ingenting er signert."
        }
      },
      {
        "t": "13:00",
        "user": "Forespørselen fra kunden, er den svart?",
        "work": [
          "Leste tråden med kunden"
        ],
        "say": "Nei. Den er fortsatt ubesvart. Forsikringsfristen er også flagget."
      },
      {
        "t": "16:30",
        "work": [
          "Skrev utkast til kunden"
        ],
        "say": "Utkastet er klart. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Forespørselen din",
          "body": "Hei kunden. Takk for forespørselen. Jeg har sett på den, og her er et kort svar så du har det samlet. Gi gjerne beskjed om noe mangler. Hilsen oss"
        }
      }
    ],
    "eiendom|selger": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 4 e-poster",
          "Hentet historikk før visningen"
        ],
        "say": "Før visningen med kunden: historikk og to åpne spørsmål er samlet."
      },
      {
        "t": "09:15",
        "user": "Forbered meg til visningen med kunden.",
        "work": [
          "Samlet 2 åpne spørsmål"
        ],
        "say": "Spørsmålene ligger øverst. Ingenting er sendt til kunden."
      },
      {
        "t": "12:25",
        "work": [
          "Satte 3 ubesvarte tilbud i rekkefølge"
        ],
        "say": "Tre tilbud er ubesvart. eiendomsselskapet har ventet lengst.",
        "ask": {
          "q": "Skal jeg følge opp eiendomsselskapet først?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du sier ja."
        }
      },
      {
        "t": "16:10",
        "user": "Lag et tilbud til eiendomsselskapet, som forrige oppdrag.",
        "work": [
          "Leste forrige oppdrag"
        ],
        "say": "Tilbudet er bygget på det oppdraget. Les det før du trykker Send.",
        "mail": {
          "to": "eiendomsselskapet",
          "sub": "Tilbud",
          "body": "Hei. Her er tilbudet på oppdraget, bygget på det forrige vi gjorde for dere. Si fra om noe skal endres. Hilsen oss"
        }
      }
    ],
    "eiendom|kontor": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Avstemte 4 krav mot avtaler"
        ],
        "say": "Kravene er sjekket mot avtalene. kunden har ett avvik."
      },
      {
        "t": "10:45",
        "user": "Hva stemmer ikke?",
        "work": [
          "Sammenlignet med avtalen"
        ],
        "say": "Ett krav til kunden avviker fra avtalen. De andre stemmer.",
        "ask": {
          "q": "Skal jeg legge det til side?",
          "opts": [
            "Ja, vis avviket",
            "Ta det med videre"
          ],
          "pick": 0,
          "after": "Det blir liggende til du har sett det. Ingenting er sendt."
        }
      },
      {
        "t": "13:35",
        "work": [
          "Skrev utkast til eiendomsselskapet"
        ],
        "say": "Oppfølgingen er et utkast. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "eiendomsselskapet",
          "sub": "Oppfølging",
          "body": "Hei. Jeg viser til avtalen. Ett krav ser annerledes ut enn det som står der. Gi gjerne beskjed om dere ser det samme. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet grunnlag fra regnskapssystemet"
        ],
        "say": "Grunnlaget til næringskunden er samlet. Avviket er lagt ved.",
        "file": "Grunnlag_naeringskunden.pdf"
      }
    ],
    "eiendom|enk": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Hentet husleie som står ute"
        ],
        "say": "To husleier står ute. Neste uke er med i oversikten.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:50",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med regninger som kommer"
        ],
        "say": "Uken går, men se husleien som står ute før du betaler noe."
      },
      {
        "t": "12:35",
        "user": "Lag et tilbud til kunden om det praktiske.",
        "work": [
          "Leste forespørselen"
        ],
        "say": "Utkastet er klart, og er ikke sendt. Les det før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Tilbud, praktisk",
          "body": "Hei kunden. Her er et tilbud på det praktiske rundt boligen. Si fra om noe skal tas med eller tas ut. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket 2 frister"
        ],
        "say": "Kontraktsfristen og skattefristen nærmer seg. Oppfølgingen venter på deg.",
        "ask": {
          "q": "Skal jeg skrive oppfølgingen?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 1,
          "after": "Greit. Jeg venter en uke, og sender ingenting."
        }
      }
    ],
    "konsulent|leder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 9 e-poster",
          "Hentet ukens tall fra regnskapssystemet"
        ],
        "say": "Omsetning og ordrereserve er inne. Ett tall avviker fra budsjettet.",
        "file": "Nokkeltall_uke43.xlsx"
      },
      {
        "t": "10:30",
        "user": "Forbered meg til møtet med kunden.",
        "work": [
          "Hentet historikk",
          "Fant 2 åpne saker"
        ],
        "say": "Historikk, to åpne saker og et forslag til agenda er klare.",
        "file": "Motebrief_kunden.pdf"
      },
      {
        "t": "13:25",
        "work": [
          "Fant 1 ubesvart tilbud"
        ],
        "say": "Tilbudet til byggkunden er fortsatt ubesvart. mva hos næringskunden er med på listen.",
        "ask": {
          "q": "Skal jeg minne byggkunden?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du har lest det."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Skrev påminnelse"
        ],
        "say": "Påminnelsen er klar. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "byggkunden",
          "sub": "Tilbudet",
          "body": "Hei. Tilbudet ligger fortsatt ubesvart hos dere. Si fra om dere vil gå videre, eller om det skal oppdateres. Hilsen oss"
        }
      }
    ],
    "konsulent|selger": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 6 e-poster",
          "Hentet tidligere oppdrag hos kunden"
        ],
        "say": "Før møtet med kunden: to tidligere oppdrag og én åpen sak."
      },
      {
        "t": "09:35",
        "user": "Forbered meg til møtet med kunden.",
        "work": [
          "Samlet 1 åpen sak"
        ],
        "say": "Saken og historikken ligger klare. Ingenting er sendt."
      },
      {
        "t": "12:15",
        "work": [
          "Satte 3 tilbud i rekkefølge"
        ],
        "say": "byggkunden står først i pipelinen. To andre har ligget kortere.",
        "ask": {
          "q": "Skal jeg følge opp byggkunden først?",
          "opts": [
            "Ja, lag utkast",
            "Ta kunden først"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du sier ja."
        }
      },
      {
        "t": "15:45",
        "user": "Lag et tilbud bygget på det lignende oppdraget.",
        "work": [
          "Leste 1 lignende oppdrag"
        ],
        "say": "Tilbudet er bygget på det oppdraget. Les det før du trykker Send.",
        "mail": {
          "to": "byggkunden",
          "sub": "Tilbud",
          "body": "Hei. Her er tilbudet, bygget på et lignende oppdrag. Si fra om noe skal endres. Hilsen oss"
        }
      }
    ],
    "konsulent|kontor": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Avstemte 6 fakturaer mot timer"
        ],
        "say": "Fakturaene er sjekket mot timer. byggkunden har ett avvik."
      },
      {
        "t": "10:10",
        "user": "Vis meg avviket.",
        "work": [
          "Sammenlignet med timelistene"
        ],
        "say": "Ett punkt stemmer ikke med timene. Resten er i orden.",
        "ask": {
          "q": "Skal jeg legge det til side?",
          "opts": [
            "Ja, vis avviket",
            "Ta det med videre"
          ],
          "pick": 0,
          "after": "Det blir liggende til du har sett det. Ingenting er sendt."
        }
      },
      {
        "t": "13:50",
        "work": [
          "Skrev oppfølging etter møtet"
        ],
        "say": "Utkast etter møtet med kunden. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Etter møtet",
          "body": "Hei kunden. Takk for møtet. Her er en kort oppfølging av det vi snakket om. Gi gjerne beskjed om noe skal rettes. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet timegrunnlag fra regnskapssystemet"
        ],
        "say": "Timegrunnlaget til næringskunden er klart.",
        "file": "Timer_naeringskunden.xlsx"
      }
    ],
    "konsulent|enk": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "To fakturaer står ute. Regningene neste uke er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:40",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med regninger neste uke"
        ],
        "say": "Neste uke er stram. Ingenting er betalt."
      },
      {
        "t": "12:20",
        "user": "Kan du samle timene hos kunden?",
        "work": [
          "Samlet timer fra 4 dager"
        ],
        "say": "Timene hos kunden er klare. Fakturaen er et utkast, og sendes ikke før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Timer denne perioden",
          "body": "Hei kunden. Her er timene denne perioden. Si fra om noe ikke stemmer, så retter jeg det før det faktureres. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket mva-fristen",
          "Fant 1 ubesvart tilbud"
        ],
        "say": "mva-fristen nærmer seg, og tilbudet til byggkunden er fortsatt ubesvart.",
        "ask": {
          "q": "Skal jeg minne om tilbudet?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Utkastet ligger klart. Det sendes ikke før du sier ja."
        }
      }
    ],
    "restaurant|leder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 8 e-poster",
          "Sammenlignet prisen med forrige avtale"
        ],
        "say": "rørleggerfirmaet har endret prisen. Likviditeten før neste ukes regninger er med i arket.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "11:05",
        "work": [
          "Sammenlignet selskapet med 3 lignende"
        ],
        "say": "Marginen på selskapet for kunden skiller seg fra de tre.",
        "ask": {
          "q": "Skal jeg legge avviket til side?",
          "opts": [
            "Ja, vis avviket",
            "Ta det i kveld"
          ],
          "pick": 0,
          "after": "Det ligger klart. Ingenting er endret."
        }
      },
      {
        "t": "14:10",
        "user": "Hva med forsikring og mva?",
        "work": [
          "Sjekket 2 frister"
        ],
        "say": "Begge har frist denne perioden. næringskunden står på listen."
      },
      {
        "t": "16:30",
        "work": [
          "Skrev varselutkast"
        ],
        "say": "Utkastet er klart. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "næringskunden",
          "sub": "Forsikring og mva",
          "body": "Hei. Forsikring og mva har frist denne perioden. Begge står på listen. Gi gjerne beskjed om noe skal tas først."
        }
      }
    ],
    "restaurant|selger": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 5 e-poster",
          "Hentet tidligere selskap"
        ],
        "say": "Forespørselen fra kunden om selskap er lest, med ett lignende arrangement ved siden av."
      },
      {
        "t": "10:15",
        "user": "Forbered meg til henvendelsen fra kunden.",
        "work": [
          "Samlet 1 lignende arrangement"
        ],
        "say": "Kort historikk og det lignende selskapet ligger klare. Ingenting er sendt."
      },
      {
        "t": "12:40",
        "work": [
          "Satte 3 forespørsler i rekkefølge"
        ],
        "say": "byggkunden har ventet lengst. kunden står som nummer to.",
        "ask": {
          "q": "Skal jeg svare byggkunden først?",
          "opts": [
            "Ja, lag utkast",
            "Ta kunden først"
          ],
          "pick": 1,
          "after": "Greit. kunden først. Utkastet sendes ikke før du sier ja."
        }
      },
      {
        "t": "15:20",
        "user": "Lag tilbud på selskapet, som det lignende.",
        "work": [
          "Leste det lignende arrangementet"
        ],
        "say": "Tilbudet er bygget på det arrangementet. Les det før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Tilbud, selskap",
          "body": "Hei kunden. Her er et tilbud på selskapet, bygget på et lignende arrangement. Si fra om noe skal justeres. Hilsen oss"
        }
      }
    ],
    "restaurant|kontor": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Avstemte 4 fakturaer mot følgeseddel"
        ],
        "say": "Leverandørfakturaene er sjekket. rørleggerfirmaet avviker fra følgeseddelen."
      },
      {
        "t": "10:30",
        "user": "Hva avviker?",
        "work": [
          "Sammenlignet med 2 følgesedler"
        ],
        "say": "Ett punkt hos rørleggerfirmaet stemmer ikke. Resten er i orden.",
        "ask": {
          "q": "Skal jeg spørre leverandøren?",
          "opts": [
            "Ja, lag utkast",
            "Jeg tar den selv"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du har lest det."
        }
      },
      {
        "t": "13:45",
        "work": [
          "Skrev utkast til leverandøren"
        ],
        "say": "Utkast til rørleggerfirmaet, og et kort svar til kunden venter. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "rørleggerfirmaet",
          "sub": "Følgeseddel",
          "body": "Hei. Fakturaen stemmer ikke med følgeseddelen på ett punkt. Kan dere se på det før vi går videre? Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet mappen fra regnskapssystemet"
        ],
        "say": "Mappen til næringskunden er samlet. Avviket er lagt ved.",
        "file": "Mappe_naeringskunden.pdf"
      }
    ],
    "restaurant|enk": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "Én faktura står ute. Varekjøpet neste uke er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:20",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med varekjøp neste uke"
        ],
        "say": "Neste uke er stram før varekjøpet. Ingenting er betalt."
      },
      {
        "t": "12:50",
        "user": "Lag tilbud på selskap til kunden, som det lignende.",
        "work": [
          "Leste 1 lignende selskap"
        ],
        "say": "Tilbudet er bygget på det selskapet. Det sendes ikke før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Tilbud, selskap",
          "body": "Hei kunden. Her er tilbudet på selskapet. Si fra om noe skal endres. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket mva-fristen"
        ],
        "say": "mva-fristen nærmer seg. Oppfølgingen er ikke sendt.",
        "ask": {
          "q": "Skal jeg skrive oppfølgingen?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Utkastet ligger klart. Det sendes ikke før du sier ja."
        }
      }
    ],
    "annet|leder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 10 e-poster",
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "Tre fakturaer står ute. Regningene de neste ukene er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "10:15",
        "user": "Forbered meg til møtet med kunden.",
        "work": [
          "Hentet historikk",
          "Fant 2 åpne saker"
        ],
        "say": "Historikk, to åpne saker og et forslag til agenda er klare.",
        "file": "Motebrief_kunden.pdf"
      },
      {
        "t": "13:30",
        "work": [
          "Leste anbudsnotatet",
          "Sjekket 2 frister"
        ],
        "say": "Kort notat om anbudet er klart. mva og a-melding har frist.",
        "ask": {
          "q": "Skal jeg legge anbudet på listen i kveld?",
          "opts": [
            "Ja, ta det med",
            "Vent til i morgen"
          ],
          "pick": 0,
          "after": "Det blir med i kveldsnotatet. Ingenting er sendt inn."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Skrev varselutkast til næringskunden"
        ],
        "say": "Utkast om fristene. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "næringskunden",
          "sub": "mva og a-melding",
          "body": "Hei. mva og a-melding har frist denne perioden. Begge står på listen. Gi gjerne beskjed om noe skal tas først."
        }
      }
    ],
    "annet|selger": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 6 e-poster",
          "Hentet historikk på kunden"
        ],
        "say": "Før møtet: historikk og to åpne saker er samlet."
      },
      {
        "t": "09:25",
        "user": "Forbered meg til møtet med kunden.",
        "work": [
          "Samlet 2 åpne saker"
        ],
        "say": "Sakene ligger øverst. Ingenting er sendt."
      },
      {
        "t": "12:05",
        "work": [
          "Satte 3 tilbud i rekkefølge"
        ],
        "say": "Tre tilbud er åpne. kunden har ventet lengst, så byggkunden.",
        "ask": {
          "q": "Skal jeg følge opp kunden først?",
          "opts": [
            "Ja, lag utkast",
            "Ta byggkunden først"
          ],
          "pick": 0,
          "after": "Utkastet kommer. Det sendes ikke før du sier ja."
        }
      },
      {
        "t": "16:15",
        "user": "Lag et tilbud til byggkunden, som den lignende jobben.",
        "work": [
          "Leste 1 lignende jobb"
        ],
        "say": "Tilbudet er bygget på den jobben. Les det før du trykker Send.",
        "mail": {
          "to": "byggkunden",
          "sub": "Tilbud",
          "body": "Hei. Her er tilbudet, bygget på en lignende jobb. Si fra om noe skal endres. Hilsen oss"
        }
      }
    ],
    "annet|kontor": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Avstemte 5 fakturaer mot underlag"
        ],
        "say": "Fakturaene er sjekket. Avvikslisten har to poster, den ene fra rørleggerfirmaet."
      },
      {
        "t": "10:40",
        "user": "Vis meg listen.",
        "work": [
          "Sammenlignet med 3 underlag"
        ],
        "say": "To poster bør du se før noe betales. Resten stemmer.",
        "ask": {
          "q": "Skal jeg legge avvikene til side?",
          "opts": [
            "Ja, vis avvikene",
            "Ta dem med videre"
          ],
          "pick": 0,
          "after": "De blir liggende til du har sett dem. Ingenting er betalt."
        }
      },
      {
        "t": "13:25",
        "work": [
          "Skrev utkast til kunde og leverandør"
        ],
        "say": "Oppfølging til kunden og leverandøren. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Oppfølging",
          "body": "Hei kunden. Jeg viser til saken. Her er en kort oppfølging, så du har den samlet. Gi gjerne beskjed om noe mangler. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet mappen fra regnskapssystemet"
        ],
        "say": "Mappen til næringskunden er klar. Avvikene er lagt ved.",
        "file": "Mappe_naeringskunden.pdf"
      }
    ],
    "annet|enk": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Hentet utestående fra regnskapssystemet"
        ],
        "say": "To fakturaer står ute. Regningene neste uke er med.",
        "file": "Likviditet_uke43.xlsx"
      },
      {
        "t": "09:45",
        "user": "Hvordan ser likviditeten ut?",
        "work": [
          "Sammenlignet med regninger neste uke"
        ],
        "say": "Neste uke er stram. Ingenting er betalt."
      },
      {
        "t": "12:25",
        "user": "Lag et tilbud til kunden, og samle timene.",
        "work": [
          "Samlet timer fra 3 dager",
          "Leste forrige jobb"
        ],
        "say": "Tilbudet og timene er samlet. Fakturaen er et utkast, og sendes ikke før du trykker Send.",
        "mail": {
          "to": "kunden",
          "sub": "Tilbud og timer",
          "body": "Hei kunden. Her er tilbudet, og timene er samlet under. Si fra om noe skal rettes før det faktureres. Hilsen oss"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket mva-fristen"
        ],
        "say": "mva-fristen nærmer seg. Kundeoppfølgingen er ikke sendt.",
        "ask": {
          "q": "Skal jeg skrive oppfølgingen?",
          "opts": [
            "Ja, lag utkast",
            "Vent en uke"
          ],
          "pick": 0,
          "after": "Utkastet ligger klart. Det sendes ikke før du sier ja."
        }
      }
    ],
    "borettslag|styreleder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 9 e-poster",
          "Sammenlignet med 4 tidligere fakturaer"
        ],
        "say": "Fakturaen fra rørleggerfirmaet er høyere enn sist, og ett punkt avviker fra avtalen.",
        "ask": {
          "q": "Skal jeg ta den med på styremøtet?",
          "opts": [
            "Ja, legg den på sakslisten",
            "Legg den til side"
          ],
          "pick": 0,
          "after": "Den blir med. Ingenting er betalt."
        }
      },
      {
        "t": "10:20",
        "user": "Lag saksliste til styremøtet.",
        "work": [
          "Hentet saker fra forrige møte"
        ],
        "say": "Innkalling og saksliste er klare. Vedtak som fortsatt er åpne er med.",
        "file": "Saksliste_styremote.pdf"
      },
      {
        "t": "13:40",
        "work": [
          "Sammenlignet 2 tilbud"
        ],
        "say": "rørleggerfirmaet og byggkunden er satt ved siden av hverandre. Det som skiller er merket. Ingenting er bestilt.",
        "file": "Tilbud_sammenligning.pdf"
      },
      {
        "t": "16:30",
        "user": "Skriv et svar til beboeren.",
        "work": [
          "Leste tråden med beboeren"
        ],
        "say": "Utkastet ligger her. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "beboeren",
          "sub": "Styremøtet",
          "body": "Hei. Fakturaen fra rørleggerfirmaet er satt på sakslisten til neste styremøte. Si fra om du vil ha noe mer i forkant."
        }
      }
    ],
    "borettslag|styremedlem": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 6 e-poster",
          "Sammenlignet fakturaen med avtalen"
        ],
        "say": "Lesestoffet til møtet er klart. Fakturaen fra rørleggerfirmaet avviker fra avtalen.",
        "file": "Lesestoff_styremote.pdf"
      },
      {
        "t": "11:00",
        "user": "Hva bør jeg lese først?",
        "work": [
          "Merket 1 avvik"
        ],
        "say": "Start med avviket på fakturaen. Resten kan vente.",
        "ask": {
          "q": "Skal jeg sette avviket øverst?",
          "opts": [
            "Ja, sett det øverst",
            "Vis alt likt"
          ],
          "pick": 0,
          "after": "Avviket ligger øverst. Ingenting er betalt."
        }
      },
      {
        "t": "14:15",
        "user": "Skriv et svar til beboeren.",
        "work": [
          "Leste tråden med beboeren"
        ],
        "say": "Utkastet er klart. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "beboeren",
          "sub": "Før møtet",
          "body": "Hei. Jeg har lest saken. Avviket på fakturaen fra rørleggerfirmaet ser ut til å være det vi bør ta først. Si fra om du ser det annerledes."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet vedtak fra forrige møte"
        ],
        "say": "Tre vedtak fra forrige møte er fortsatt åpne. De ligger samlet til deg.",
        "file": "Vedtak_apne.pdf"
      }
    ],
    "borettslag|forretning": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 11 e-poster",
          "Sammenlignet med tidligere pris og avtale"
        ],
        "say": "Fakturaen fra rørleggerfirmaet er høyere enn sist, og ett punkt avviker fra avtalen.",
        "ask": {
          "q": "Skal jeg flagge den for styret?",
          "opts": [
            "Ja, flagg avviket",
            "Legg den til side"
          ],
          "pick": 0,
          "after": "Den er flagget. Ingenting er betalt."
        }
      },
      {
        "t": "11:30",
        "work": [
          "Sammenlignet 2 tilbud fra håndverkere"
        ],
        "say": "rørleggerfirmaet og byggkunden er sammenlignet. Det som skiller er merket. Ingenting er bestilt.",
        "file": "Tilbud_sammenligning.pdf"
      },
      {
        "t": "14:00",
        "user": "Hva skiller tilbudene?",
        "work": [
          "Leste begge tilbudene"
        ],
        "say": "Pris og ett vilkår skiller. Resten er likt. Styret må se det før noe bestilles."
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket vedlikeholdsplanen",
          "Skrev innkalling"
        ],
        "say": "Frister i vedlikeholdsplanen er med. Innkallingen er et utkast, og sendes ikke før du trykker Send.",
        "mail": {
          "to": "beboeren",
          "sub": "Innkalling til styremøte",
          "body": "Hei. Innkalling og saksliste til styremøtet ligger ved. Frister i vedlikeholdsplanen er tatt med. Si fra om noe mangler."
        }
      }
    ],
    "forening|styreleder": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 7 e-poster",
          "Sammenlignet med forrige pris og avtale"
        ],
        "say": "Fakturaen fra rørleggerfirmaet er sjekket. Ett punkt avviker fra avtalen og fra forrige pris.",
        "ask": {
          "q": "Skal jeg ta den med på styremøtet?",
          "opts": [
            "Ja, legg den på sakslisten",
            "Legg den til side"
          ],
          "pick": 0,
          "after": "Den blir med. Ingenting er betalt."
        }
      },
      {
        "t": "10:40",
        "user": "Lag saksliste og innkalling.",
        "work": [
          "Hentet saker fra forrige møte"
        ],
        "say": "Saksliste og innkalling til styremøtet er klare. Kontingent som står ute er et eget punkt.",
        "file": "Saksliste_styremote.pdf"
      },
      {
        "t": "13:20",
        "work": [
          "Fant 4 medlemmer med kontingent ute"
        ],
        "say": "Fire medlemmer har kontingent ute. Ingenting er purret."
      },
      {
        "t": "16:30",
        "user": "Skriv et svar til beboeren.",
        "work": [
          "Leste tråden med beboeren"
        ],
        "say": "Svarutkastet er klart. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "beboeren",
          "sub": "Styremøtet",
          "body": "Hei. Saken er med på styremøtet, og kontingent som står ute er et eget punkt. Si fra om du vil ha noe mer før møtet."
        }
      }
    ],
    "forening|styremedlem": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 5 e-poster",
          "Sammenlignet fakturaen med avtalen"
        ],
        "say": "Lesestoffet er klart. Fakturaen fra rørleggerfirmaet avviker fra avtalen.",
        "file": "Lesestoff_styremote.pdf"
      },
      {
        "t": "11:15",
        "user": "Hva bør jeg lese først?",
        "work": [
          "Merket 1 avvik"
        ],
        "say": "Start med avviket. Resten av lesestoffet kan vente til i kveld.",
        "ask": {
          "q": "Skal jeg sette avviket øverst?",
          "opts": [
            "Ja, sett det øverst",
            "Vis alt likt"
          ],
          "pick": 0,
          "after": "Avviket ligger øverst. Ingenting er betalt."
        }
      },
      {
        "t": "14:30",
        "user": "Skriv et svar til beboeren om årsmøtet.",
        "work": [
          "Leste tråden med beboeren"
        ],
        "say": "Utkastet om årsmøtet er klart. Ingenting sendes før du trykker Send.",
        "mail": {
          "to": "beboeren",
          "sub": "Årsmøtet",
          "body": "Hei. Årsmøtet står på sakslisten. Avviket på fakturaen fra rørleggerfirmaet bør vi ta først. Si fra om du ser det annerledes."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Hentet vedtak fra forrige møte"
        ],
        "say": "To vedtak fra forrige møte er fortsatt åpne.",
        "file": "Vedtak_apne.pdf"
      }
    ],
    "forening|forretning": [
      {
        "t": "07:00 · Morgenrapport (fast rutine)",
        "work": [
          "Leste 8 e-poster",
          "Sammenlignet fakturaen med avtalen"
        ],
        "say": "Fakturaen fra rørleggerfirmaet avviker fra avtalen på ett punkt.",
        "ask": {
          "q": "Skal jeg flagge den for styret?",
          "opts": [
            "Ja, flagg avviket",
            "Legg den til side"
          ],
          "pick": 0,
          "after": "Den er flagget. Ingenting er betalt."
        }
      },
      {
        "t": "11:45",
        "work": [
          "Sammenlignet 2 tilbud"
        ],
        "say": "To tilbud er satt ved siden av hverandre før de går til styret. Det som skiller er merket. Ingenting er bestilt.",
        "file": "Tilbud_sammenligning.pdf"
      },
      {
        "t": "14:20",
        "user": "Hva skiller dem?",
        "work": [
          "Leste begge tilbudene"
        ],
        "say": "Pris og ett vilkår skiller. Resten er likt."
      },
      {
        "t": "16:30",
        "work": [
          "Sjekket søknadsfristen",
          "Skrev innkalling til årsmøtet"
        ],
        "say": "Vedlikehold og søknadsfrist er med. Innkallingen er et utkast, og sendes ikke før du trykker Send.",
        "mail": {
          "to": "beboeren",
          "sub": "Innkalling til årsmøte",
          "body": "Hei. Innkalling til årsmøtet ligger ved. Vedlikehold og søknadsfrist er tatt med. Si fra om noe mangler."
        }
      }
    ]
  };

  const pick=fieldset=>{
    const input=fieldset.querySelector('input:checked');
    return {value:input.value,label:input.nextElementSibling.textContent.trim()};
  };
  const fill= (ul,items)=>{ul.replaceChildren(...items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));};
  const renderSetup=()=>{
    const type=pick(document.getElementById('step-type'));
    const board=type.value==='borettslag'||type.value==='forening';
    const enk=type.value==='enk';
    stepBransje.hidden=board;
    stepBransje.disabled=board;
    stepRolleBedrift.hidden=board||enk;
    stepRolleBedrift.disabled=board||enk;
    stepRolleStyre.hidden=!board;
    stepRolleStyre.disabled=!board;
    const bransje=board?null:pick(stepBransje);
    const role=board?pick(stepRolleStyre):(enk?{value:'leder',label:'Daglig leder/eier'}:pick(stepRolleBedrift));
    const base=board?groups[type.value]:industries[bransje.value];
    const addon=roleAddon[enk?'leder':role.value];
    const assistants=base.assistants.includes(addon.assistant)?base.assistants.slice(0,4):base.assistants.concat(addon.assistant).slice(0,4);
    const sceneKey=board?`${type.value}|${role.value}`:`${bransje.value}|${enk?'enk':role.value}`;
    const scene=scenes[sceneKey];
    const day=scene.day;
    const skip=scene.skip;
    const title=enk?`Eksempeloppsett: Enkeltpersonforetak i ${base.inTitle}`:`Eksempeloppsett: ${addon.inTitle} i ${base.inTitle}`;
    document.getElementById('setup-title').textContent=title;
    fill(document.getElementById('setup-assistants'),assistants);
    fill(document.getElementById('setup-day'),day);
    fill(document.getElementById('setup-skip'),skip);
    document.getElementById('setup-live').hidden=false;
    const subject=enk?`Gratis prat – ${type.label}, ${bransje.label}`:(bransje?`Gratis prat – ${type.label}, ${bransje.label}, ${role.label}`:`Gratis prat – ${type.label}, ${role.label}`);
    const lines=['Hei Andreas,','','Jeg vil gjerne ha en gratis prat om dette eksempeloppsettet.','',`Type: ${type.label}`];
    if(bransje)lines.push(`Bransje: ${bransje.label}`);
    if(!enk)lines.push(`Rolle: ${role.label}`);
    lines.push('',title);
    document.getElementById('setup-cta').href=`mailto:andreas@fjellhoy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    const dayChat=document.getElementById('day-chat');
    dayChat.hidden=false;
    playChat(dayChat, dayTurns[sceneKey]);
  };
  setupForm.addEventListener('change',renderSetup);
  renderSetup();
  playChat(document.getElementById('hero-chat'), heroTurns);
  window.__fjellChat={heroTurns,dayTurns,timeline,atEnd,seek:seekChat,play:playChat};
