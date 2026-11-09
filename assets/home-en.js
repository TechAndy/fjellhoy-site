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
      assistants:['Quotes and projects','Customers and calendar','Invoices and money'],
      day:['Morning brief with today\'s site visits and quotes that are waiting','A draft quote for the customer, based on a similar job. You approve it before it is sent','A reminder for overdue invoices is ready, but it does not go out without your yes','A warning the day before a materials deadline or an agreed start'],
      skip:['Writing quotes late in the evening','Forgetting that the customer asked for a price','Noticing an unpaid invoice too late'],
      inTitle:'trades and construction'
    },
    regnskap:{
      assistants:['Deadlines and deliveries','Client file','Hours and invoices'],
      day:['Morning brief with this week\'s deadlines and clients waiting for a reply','Draft replies to ordinary questions. You read them before anything is sent','The time records are gathered for the invoice. Nothing is sent without your yes','A warning when a voucher is missing before a delivery deadline'],
      skip:['Searching for the previous reply to the same client','Keeping the delivery deadlines in your head','Starting every client letter from a blank page'],
      inTitle:'accounting and advice'
    },
    helse:{
      assistants:['Appointment book','Enquiries','Settlements and invoices'],
      day:['Morning brief with today\'s appointments and enquiries that are waiting','A draft reply about the appointment and the practical questions. You approve it before it is sent','The settlement papers are ready. Nothing is sent or paid without your yes','A warning when an appointment is empty or a settlement deadline is getting close'],
      skip:['Answering the same practical questions','Noticing a gap in the appointment book too late','Gathering the settlement papers by hand'],
      inTitle:'health and therapy'
    },
    butikk:{
      assistants:['Customers and orders','Suppliers and stock','Invoices and reminders'],
      day:['Morning brief with orders waiting for a reply and items running low','A draft reply about delivery and returns. You approve it before it is sent','Supplier invoices are checked against the previous price. You approve them before anything is paid','A warning when an order or a campaign deadline should be dealt with'],
      skip:['Answering the same questions about delivery','Noticing a price increase from the supplier too late','Writing the reminders from a blank page'],
      inTitle:'shops and online retail'
    },
    eiendom:{
      assistants:['Tenants and enquiries','Contract and deadlines','Rent and invoices'],
      day:['Morning brief with enquiries from tenants and deadlines in the contracts','A draft reply about practical matters. Nothing is sent without your yes','Rent demands are ready. Nothing is sent until you have said yes','A warning before a contract deadline, a viewing or a rent adjustment'],
      skip:['Searching through old email when a tenant asks','Forgetting a deadline in the tenancy agreement','Checking every claim against the previous amount by hand'],
      inTitle:'property and lettings'
    },
    konsulent:{
      assistants:['Quotes and engagements','Meetings and follow-up','Hours and invoices'],
      day:['Morning brief with today\'s meetings and quotes that have gone quiet','A draft follow-up after the meeting. You read it before it is sent','The time records are gathered. The invoice is not sent without your yes','A warning when a quote or a delivery is getting close to its deadline'],
      skip:['Writing the meeting note from memory','Forgetting to follow up a quote','Reconstructing the hours when the invoice has to be made'],
      inTitle:'consulting and IT'
    },
    restaurant:{
      assistants:['Shifts and calendar','Suppliers and goods in','Invoices and guests'],
      day:['Morning brief with shifts, deliveries and what is urgent today','A draft reply to a table booking. You approve it before it is sent','Supplier invoices are compared with the previous ones. Nothing is paid without your yes','A warning when a shift is open or an order should go out'],
      skip:['Answering bookings between shifts','Noticing a change in the price of ingredients too late','Keeping the rota and the deliveries in your head'],
      inTitle:'restaurants and catering'
    },
    annet:{
      assistants:['Inbox and priorities','Follow-up and deadlines','Invoices and money'],
      day:['Morning brief with only what needs you','Drafts of ordinary replies. You approve them before anything is sent','Invoices are checked against earlier amounts and laid out ready. Nothing is paid without your yes','A warning when a deadline is getting close'],
      skip:['Starting the day in a full inbox','Writing the same replies again','Noticing an overdue invoice too late'],
      inTitle:'another industry'
    }
  };
  const groups={
    borettslag:{
      assistants:['Board meetings and the agenda','Resident enquiries','Invoices and suppliers'],
      day:['Morning brief with enquiries waiting for a reply','A draft reply to residents. You approve it before anything is sent','Invoices are compared with the previous one from the same supplier. You approve them before anything is paid','A warning before a deadline, a general meeting or a board meeting'],
      skip:['Sorting the board email by hand','Writing the agenda from a blank page','Approving an invoice without seeing the difference'],
      inTitle:'housing co-op or condominium'
    },
    forening:{
      assistants:['Member enquiries','Meetings and the annual meeting','Fees and money'],
      day:['Morning brief with enquiries from members and matters that are waiting','A draft reply. You approve it before anything is sent','Fees and invoices are ready. Nothing is sent or paid without your yes','A warning before the annual meeting, an application deadline or a board meeting'],
      skip:['Sorting the members\' email by hand','Starting the notice and the agenda from a blank page','Following up fees without an overview'],
      inTitle:'association or organisation'
    }
  };
  const roleAddon={
    leder:{assistant:'Morning brief',day:'A short morning brief with only what needs a yes from you',skip:'Spending the morning finding out what is urgent',inTitle:'Managing director'},
    selger:{assistant:'Quote follow-up',day:'A draft follow-up of quotes that have gone quiet. Nothing is sent without your yes',skip:'Forgetting a quote that was never followed up',inTitle:'Sales'},
    kontor:{assistant:'Document archive',day:'Attachments are suggested in order. Nothing is moved or deleted until you have seen it',skip:'Tidying the inbox and the archive by hand',inTitle:'Office and administration'},
    styreleder:{assistant:'Follow-up between meetings',day:'Matters left over from the last meeting are gathered in a draft',skip:'Remembering loose ends between meetings',inTitle:'Chair'},
    styremedlem:{assistant:'Reading for the meeting',day:'A short draft of what you should read before the meeting',skip:'Searching through long threads the evening before the meeting',inTitle:'Board member'},
    forretning:{assistant:'Minutes and deadlines',day:'A draft of the minutes and the follow-up points. Nothing is sent out without your yes',skip:'Writing the minutes from a blank page after the meeting',inTitle:'Business manager'}
  };
  const scenes={
    'handverk|leder':{
      day:['Liquidity for the coming weeks, from amounts outstanding and bills that are coming in.','The margin on the customer\' bathroom job, checked against similar jobs.','A reminder draft for an overdue invoice. VAT at the business client and the certificate are included.'],
      skip:['Working out liquidity for the coming weeks by hand','Noticing the weak margin on the customer\' job too late','Writing the reminder, and keeping VAT and the certificate in mind'],
    },
    'handverk|selger':{
      day:['Research before the meeting with the customer: the history and the open matters.','Open quotes in order. the customer is followed up first.','A draft quote for the customer, built on last year\'s bathroom job.'],
      skip:['Searching through the customer\' history just before the meeting','Guessing which quote should be followed up first','Writing the quote for the customer from a blank page'],
    },
    'handverk|kontor':{
      day:['Invoices are reconciled against orders. The difference from the plumbing firm is flagged.','A draft follow-up for the customer and the supplier. Nothing is sent yet.','the business client\'s file is gathered from your accounting system.'],
      skip:['Reconciling the invoice against the order by hand','Writing the follow-up to the customer and the supplier from a blank page','Searching out the papers for the business client'],
    },
    'handverk|enk':{
      day:['Simple liquidity: amounts outstanding and next week\'s bills.','The hours on the customer\' bathroom job are gathered. The invoice is a draft.','The VAT deadline and the follow-up to the customer. You say yes yourself.'],
      skip:['Working out liquidity between jobs','Gathering hours for the invoice late in the evening','Forgetting the VAT deadline and the follow-up with the customer'],
    },
    'regnskap|leder':{
      day:['Weekly figures: turnover, order book and the difference from the budget.','A meeting brief before the building client, with the history, open matters and an agenda.','The a-melding payroll report and VAT are flagged. the business client has the deadline on the list.'],
      skip:['Fetching the key figures from several places','Meeting the building client without the history and the open matters','Keeping the a-melding payroll report and VAT in your head'],
    },
    'regnskap|selger':{
      day:['Research before the meeting with the property company: earlier engagements and open matters.','Pipeline: three quotes are open, set in order.','A draft quote for the building client, built on the previous similar engagement.'],
      skip:['Going to see the property company without the earlier engagements','Losing the order of the open quotes','Writing the quote without looking at a similar engagement'],
    },
    'regnskap|kontor':{
      day:['Vouchers reconciled against hours and engagements. The difference at the building client is flagged.','A draft of the client follow-up. the building client is missing one voucher.','The delivery for the business client is ready from your accounting system.'],
      skip:['Reconciling the vouchers against the hours by hand','Writing the reminder for the missing voucher from the building client from a blank page','Gathering the delivery for the business client yourself'],
    },
    'regnskap|enk':{
      day:['Simple liquidity before next week\'s bills.','The hours on the engagement for the building client are ready for the invoice.','The tax deadline and the follow-up. The draft is not sent until you say yes.'],
      skip:['Working out liquidity between engagements','Gathering hours for the invoice by hand','Noticing the tax deadline too late'],
    },
    'helse|leder':{
      day:['Liquidity for the coming weeks, from outstanding settlements and regular bills.','A meeting brief before the appointment with the customer: the history, open matters and an agenda.','Insurance and authorisation have a deadline. the customer\' unanswered enquiry is included.'],
      skip:['Setting up liquidity between appointments','Going to see the customer without the open matters','Noticing the deadline for insurance and authorisation too late'],
    },
    'helse|selger':{
      day:['Research before the conversation with the customer: the history and the open question.','Follow-up of enquiries that have gone quiet, in order.','A draft quote for a programme, built on a similar course of treatment. Not sent.'],
      skip:['Searching through the customer\' history before the conversation','Forgetting enquiries that have gone quiet','Writing the quote from a blank page'],
    },
    'helse|kontor':{
      day:['Settlements reconciled against hours. The difference for the customer is flagged.','A draft follow-up of the unanswered appointment. Nothing is sent without your yes.','The papers for the business client are gathered from your accounting system.'],
      skip:['Reconciling the settlement against the hours by hand','Writing the follow-up to the customer from a blank page','Gathering the papers for the business client yourself'],
    },
    'helse|enk':{
      day:['Simple liquidity from outstanding settlements.','The hours and the settlement for the customer are ready for the invoice.','The VAT deadline and the follow-up of the appointment. The draft is waiting for you.'],
      skip:['Working out liquidity between appointments','Gathering the settlement for the invoice by hand','Forgetting VAT and the follow-up to the customer'],
    },
    'butikk|leder':{
      day:['The price change at the plumbing firm is flagged against the previous agreement.','The margin on completed orders is off. Three orders are marked.','Liquidity next week, and the VAT deadline at the business client.'],
      skip:['Only noticing the price change from the plumbing firm afterwards','Checking the margin on completed orders by hand','Working out next week and the VAT deadline yourself'],
    },
    'butikk|selger':{
      day:['Research before the conversation with the customer about the delivery.','Open quotes in order. the building client has been waiting the longest.','A draft quote built on a similar order. You read it before it is sent.'],
      skip:['Going to see the customer without the delivery history','Following up open quotes in a random order','Writing the quote without a similar order'],
    },
    'butikk|kontor':{
      day:['Invoices reconciled against orders. the plumbing firm is flagged on the exception list.','A draft of the supplier follow-up and a reply to the customer about the return.','the business client\'s file is ready from your accounting system.'],
      skip:['Reconciling the invoice against the order by hand','Writing the supplier follow-up from a blank page','Searching out the vouchers for the business client'],
    },
    'butikk|enk':{
      day:['Simple liquidity: amounts outstanding and next week\'s stock purchases.','A quote for the customer, built on a similar order.','The VAT deadline and the follow-up of the order. Nothing is sent yet.'],
      skip:['Working out liquidity and stock purchases by hand','Writing the quote for the customer from a blank page','Forgetting the VAT deadline'],
    },
    'eiendom|leder':{
      day:['Liquidity from outstanding rent and bills over the coming weeks.','The contract from the property company has points that differ from the usual terms.','The enquiry from the customer has had no reply. The insurance deadline is flagged.'],
      skip:['Working out liquidity from rent and bills by hand','Reading the contract without seeing the differences','Forgetting the customer\' enquiry and the insurance deadline'],
    },
    'eiendom|selger':{
      day:['Research before the viewing with the customer: the history and the open questions.','Unanswered quotes are set in order for follow-up.','A draft quote for the property company, built on the previous engagement.'],
      skip:['Going to a viewing without the customer\' history','Forgetting quotes that never got a reply','Writing the quote for the property company from a blank page'],
    },
    'eiendom|kontor':{
      day:['Claims reconciled against agreements. The difference at the customer is flagged.','A draft follow-up of the property company. Nothing is sent yet.','The papers for the business client are gathered from your accounting system.'],
      skip:['Reconciling the claims against the agreements by hand','Writing the follow-up to the property company from a blank page','Gathering the papers for the business client yourself'],
    },
    'eiendom|enk':{
      day:['Simple liquidity from rent that is still outstanding.','A quote for the customer on the practical work. A draft, not sent.','The contract deadline and the tax deadline. The follow-up is waiting for you.'],
      skip:['Working out liquidity from the rent by hand','Writing the quote for the customer from a blank page','Forgetting the contract deadline and the tax'],
    },
    'konsulent|leder':{
      day:['This week\'s figures: turnover, order book and the difference from the budget.','A meeting brief before the customer, with the history, open matters and an agenda.','The quote for the building client has had no reply. VAT at the business client is included.'],
      skip:['Fetching the key figures from several places before the week starts','Meeting the customer without the history and an agenda','Leaving the quote for the building client sitting there'],
    },
    'konsulent|selger':{
      day:['Research before the meeting with the customer: earlier engagements and open matters.','A pipeline of open quotes in order. the building client first.','A draft quote built on a similar engagement. You read it before it is sent.'],
      skip:['Going to see the customer without the earlier engagements','Losing the view of the open quotes','Writing the quote from a blank page'],
    },
    'konsulent|kontor':{
      day:['Invoices reconciled against hours. The difference on the building client is flagged.','A draft follow-up after the meeting with the customer.','The time records for the business client are pulled from your accounting system.'],
      skip:['Reconciling the invoice against the hours by hand','Writing the follow-up to the customer from a blank page','Reconstructing the hours for the business client'],
    },
    'konsulent|enk':{
      day:['Simple liquidity before next week\'s bills.','The hours for the customer are ready. The invoice is a draft.','The VAT deadline, and the quote for the building client has had no reply.'],
      skip:['Working out liquidity between engagements','Gathering hours for the invoice late in the evening','Forgetting VAT and the quote for the building client'],
    },
    'restaurant|leder':{
      day:['The price change at the plumbing firm, and liquidity before next week\'s bills.','The margin on the completed event for the customer differs from similar ones.','Insurance and VAT have a deadline. the business client is on the list.'],
      skip:['Noticing the price change from the plumbing firm too late','Checking the margin on the customer\' event by hand','Keeping insurance and VAT in your head'],
    },
    'restaurant|selger':{
      day:['Research before the enquiry from the customer about an event.','Open enquiries in order. the building client has been waiting the longest.','A draft quote for the event, built on a similar event.'],
      skip:['Answering the customer without seeing the earlier event','Following up enquiries in a random order','Writing the quote from a blank page'],
    },
    'restaurant|kontor':{
      day:['The supplier invoice is reconciled against the delivery note. the plumbing firm differs.','A draft follow-up of the supplier and a reply to the customer.','the business client\'s file is gathered from your accounting system.'],
      skip:['Reconciling the invoice against the delivery note by hand','Writing the follow-up from a blank page','Gathering the vouchers for the business client yourself'],
    },
    'restaurant|enk':{
      day:['Simple liquidity before next week\'s stock purchases.','A quote for an event for the customer, built on a similar one.','The VAT deadline and the follow-up. The draft is not sent until you say yes.'],
      skip:['Working out liquidity and stock purchases by hand','Writing the quote for the event from a blank page','Forgetting the VAT deadline'],
    },
    'annet|leder':{
      day:['Liquidity for the coming weeks, from amounts outstanding and bills that are coming in.','A meeting brief before the customer, with the history, open matters and an agenda.','A short note on a tender, and the deadline for VAT and the a-melding payroll report.'],
      skip:['Working out the liquidity by hand','Going to see the customer without the open matters','Weighing a tender and the deadlines from a blank page'],
    },
    'annet|selger':{
      day:['Research before the meeting with the customer: the history and the open matters.','Pipeline: open quotes set in order.','A draft quote for the building client, built on a similar job.'],
      skip:['Searching through the history just before the meeting','Guessing the order of the open quotes','Writing the quote for the building client from a blank page'],
    },
    'annet|kontor':{
      day:['Invoices reconciled against the supporting documents. The exception list is ready.','A draft of the customer and supplier follow-up. Nothing is sent yet.','the business client\'s file is ready from your accounting system.'],
      skip:['Reconciling the invoice against the supporting documents by hand','Writing the follow-up from a blank page','Searching out the business client\'s file'],
    },
    'annet|enk':{
      day:['Simple liquidity: amounts outstanding and next week\'s bills.','A quote for the customer. The hours are gathered for the invoice.','The VAT deadline and customer follow-up. Nothing goes out until you approve it.'],
      skip:['Working out liquidity between jobs','Writing the quote and gathering the hours by hand','Forgetting VAT and the follow-up'],
    },
    'borettslag|styreleder':{
      day:['The invoice from the plumbing firm is checked against the earlier price and the agreement.','The agenda and the notice are ready. A draft reply to the resident.','The decisions from the last meeting, and two quotes from tradespeople, are compared.'],
      skip:['Checking the invoice against the agreement and the previous price by hand','Writing the agenda, the notice and the reply to the resident from a blank page','Comparing quotes and following decisions without an overview'],
    },
    'borettslag|styremedlem':{
      day:['Reading before the meeting: the invoice from the plumbing firm, with the difference from the agreement.','A draft reply to the resident. Nothing is sent without your yes.','Decisions from the last meeting that are still open, gathered for you.'],
      skip:['Reading the invoice and the agreement the evening before the meeting','Writing the reply to the resident from a blank page','Searching for decisions that were never followed up'],
    },
    'borettslag|forretning':{
      day:['The invoice from the plumbing firm against the earlier price and the agreement. The difference is flagged.','Two quotes from tradespeople are compared. What sets them apart is marked.','The maintenance plan and the deadlines, plus the notice as a draft.'],
      skip:['Checking the invoice against the agreement by hand','Comparing the quotes without a note of what differs','Keeping the maintenance plan and the notice in your head'],
    },
    'forening|styreleder':{
      day:['The invoice from the plumbing firm is checked against the agreement and the previous price.','The agenda and the notice for the board meeting are ready. A draft reply to the resident.','The decisions from the last meeting, and fees that are still outstanding.'],
      skip:['Checking the invoice against the agreement by hand','Writing the agenda and the reply to the resident from a blank page','Following decisions and fees without an overview'],
    },
    'forening|styremedlem':{
      day:['Reading before the meeting, with the difference on the invoice from the plumbing firm.','A draft reply to the resident about the annual meeting.','Decisions from the last meeting that are still open.'],
      skip:['Searching through the papers the evening before the meeting','Writing the reply to the resident about the annual meeting from a blank page','Going to the meeting without knowing which decisions are still open'],
    },
    'forening|forretning':{
      day:['The invoice from the plumbing firm against the agreement. The difference is flagged.','Two quotes are compared before they go to the board.','Maintenance and the application deadline, plus the notice for the annual meeting as a draft.'],
      skip:['Checking the invoice against the agreement by hand','Comparing the quotes without a note of what differs','Starting the notice and the deadlines from a blank page'],
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
        if(!turn.user)d.append(el('span','div-tag','Routine'));
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
        col.append(el('p','bot-name','Your assistant'));
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
          r1.append(el('b',null,'To'),el('span',null,turn.mail.to));
          const r2=el('p','mail-row');
          r2.append(el('b',null,'Subject'),el('span',null,turn.mail.sub));
          mail.append(r1,r2,el('p',null,turn.mail.body));
          mailActions=el('div','chat-actions');
          mailActions.append(el('span','cbtn cbtn-ghost','Edit'),sendBtn=el('span','cbtn cbtn-go','Send'));
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
          mailActions.replaceChildren(el('span','cbtn cbtn-sent','✓ Sent'));
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
            col.append(el('p','bot-name','Your assistant'));
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
      "t": "07:30 · Morning brief (standing routine)",
      "work": [
        "Gathered 4 items for today"
      ],
      "say": "Good morning. Here is your day:",
      "points": [
        "Invoice 1042 to the customer is overdue.",
        "The VAT return has to be filed this week.",
        "the plumbing firm is checked against the agreement.",
        "Tight liquidity over the coming weeks."
      ]
    },
    {
      "t": "08:10",
      "user": "Start with the reminder to the customer.",
      "work": [
        "Wrote a draft for the customer"
      ],
      "say": "The reminder draft for invoice 1042 is ready. Nothing goes out until you press Send.",
      "mail": {
        "to": "the customer",
        "sub": "Invoice overdue",
        "body": "Hi. This is a reminder about invoice 1042 for the bathroom job, which was due on 10 October. Let me know if anything is unclear. Best regards",
        "draft": true
      }
    },
    {
      "t": "08:50",
      "user": "Add that she can split the payment in two.",
      "work": [
        "Updated the draft"
      ],
      "say": "Updated. It goes out when you press Send.",
      "mail": {
        "to": "the customer",
        "sub": "Invoice overdue",
        "body": "Hi. This is a reminder about invoice 1042 for the bathroom job, which was due on 10 October. The amount can be split in two. Let me know if anything is unclear. Best regards"
      }
    },
    {
      "t": "10:40",
      "work": [
        "Prepared the basis for the VAT return"
      ],
      "say": "The basis for the VAT return is ready. You approve it before it is filed.",
      "file": "VAT_october.xlsx"
    },
    {
      "t": "12:15",
      "work": [
        "Compared it with 3 earlier invoices"
      ],
      "say": "The invoice from the plumbing firm is higher than last time, and one term differs from the agreement.",
      "ask": {
        "q": "Shall I set it aside?",
        "opts": [
          "Yes, show the difference",
          "Wait until tomorrow"
        ],
        "pick": 0,
        "after": "All right. It will sit there until you have seen it."
      }
    },
    {
      "t": "14:30",
      "user": "Which bills can wait?",
      "work": [
        "Compared it with bills that are coming in"
      ],
      "say": "the plumbing firm can wait until you have seen the difference. The office rent can wait until Friday. The VAT return cannot wait.",
      "file": "Liquidity_week43.xlsx"
    },
    {
      "t": "16:20",
      "linger": true,
      "work": [
        "Looked at this week's reminders"
      ],
      "say": "I can see you send payment reminders by hand several times a week.",
      "ask": {
        "q": "Would you like me to set up a separate routine that follows up overdue invoices?",
        "opts": [
          "Yes, set it up",
          "Not now"
        ],
        "pick": 0,
        "after": "All right. I will set it up, and you will see the drafts before anything is sent."
      }
    }
  ];
  const dayTurns = {
    "handverk|leder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 11 emails",
          "Pulled the outstanding amounts"
        ],
        "say": "Three invoices are overdue. The bill from the plumbing firm is due over the coming weeks.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:15",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with bills that are coming in"
        ],
        "say": "The week is tight before VAT at the business client. Nothing has been paid."
      },
      {
        "t": "12:10",
        "user": "What about the margin on the customer's bathroom job?",
        "work": [
          "Compared it with 3 similar bathroom jobs"
        ],
        "say": "the customer's bathroom job sits below the three. One point stands out."
      },
      {
        "t": "14:20",
        "work": [
          "Found 1 overdue invoice"
        ],
        "say": "the building client has an invoice that is overdue.",
        "ask": {
          "q": "Shall I remind the building client?",
          "opts": [
            "Yes, draft the reminder",
            "Wait a week"
          ],
          "pick": 0,
          "after": "I am writing the draft. It is not sent until you have read it."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Drafted a reminder",
          "Noted the certificate this week"
        ],
        "say": "Here is the draft. The certificate is noted beside it. Nothing is sent until you press Send.",
        "mail": {
          "to": "the building client",
          "sub": "Reminder",
          "body": "Hello. This is a reminder about invoice 1048, which was due on 3 October. Let me know if anything is unclear. Best regards"
        }
      }
    ],
    "handverk|selger": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 8 emails",
          "Pulled the history on the customer"
        ],
        "say": "Before the meeting: bathroom and service in the history, and one quote that is still open."
      },
      {
        "t": "09:05",
        "user": "Prepare me for the meeting with the customer.",
        "work": [
          "Gathered 2 open matters"
        ],
        "say": "Two matters are open. I have put them at the top. Nothing has been sent."
      },
      {
        "t": "12:10",
        "work": [
          "Put 3 quotes in order"
        ],
        "say": "the customer has been waiting the longest. Then the building client, then the property company.",
        "ask": {
          "q": "Shall I follow up with the customer first?",
          "opts": [
            "Yes, draft it",
            "Take the building client first"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you say yes."
        }
      },
      {
        "t": "15:40",
        "user": "Draft a quote for the customer based on last year's bathroom job.",
        "work": [
          "Read last year's bathroom job"
        ],
        "say": "The quote is built on that job. Read it before you press Send.",
        "file": "Quote_the_customer.pdf",
        "mail": {
          "to": "the customer",
          "sub": "Quote, bathroom",
          "body": "Hi. Here is the quote for the bathroom, built on the job we did last year. Tell me if you want anything adjusted before we go further. Best regards"
        }
      }
    ],
    "handverk|kontor": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 12 emails",
          "Reconciled 6 invoices against the orders"
        ],
        "say": "The invoice from the plumbing firm does not match the order. The one from the customer does."
      },
      {
        "t": "10:05",
        "user": "What is the difference?",
        "work": [
          "Compared it with 2 orders"
        ],
        "say": "One point at the plumbing firm differs. Two items you should see before anything is paid.",
        "ask": {
          "q": "Shall I set it aside?",
          "opts": [
            "Yes, show the difference",
            "Take that one forward"
          ],
          "pick": 0,
          "after": "It will sit there until you have seen it. Nothing has been paid."
        }
      },
      {
        "t": "13:30",
        "work": [
          "Wrote a draft for the customer"
        ],
        "say": "Follow-up to the customer, with a copy to the supplier. Nothing is sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Order follow-up",
          "body": "Hi. I am writing about the order. We are under way, and I will send a short status when the next part is ready. Let me know if anything is urgent. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the vouchers"
        ],
        "say": "the business client's file is gathered. The difference is attached.",
        "file": "File_business_client.pdf"
      }
    ],
    "handverk|enk": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Pulled the outstanding amounts"
        ],
        "say": "Two invoices are outstanding. The bill from the plumbing firm is due next week.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:40",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with next week's bills"
        ],
        "say": "Next week is tight. Look at the overview before you pay anything."
      },
      {
        "t": "12:30",
        "user": "Gather the hours on the customer's bathroom job.",
        "work": [
          "Gathered the hours from 4 days"
        ],
        "say": "The hours are gathered. The invoice is a draft, and it is not sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Invoice, bathroom job",
          "body": "Hi. Here is the invoice for the hours on the bathroom job. Tell me if something does not match, and I will correct it. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Checked 2 deadlines"
        ],
        "say": "The VAT deadline for this period is getting close. The follow-up to the customer has not been sent.",
        "ask": {
          "q": "Shall I remind the customer?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 1,
          "after": "All right. I will wait, and mention it again in a week."
        }
      }
    ],
    "regnskap|leder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 9 emails",
          "Pulled this week's figures"
        ],
        "say": "Turnover so far is in. The order book is 4 engagements, and one figure differs from the budget.",
        "file": "Figures_week43.xlsx"
      },
      {
        "t": "09:20",
        "user": "What is different?",
        "work": [
          "Compared it with the budget"
        ],
        "say": "One figure sits away from the budget. The rest follows the week.",
        "ask": {
          "q": "Shall I include the difference in the meeting brief?",
          "opts": [
            "Yes, include it",
            "Leave it"
          ],
          "pick": 0,
          "after": "It is included. Nothing in the figures has been changed."
        }
      },
      {
        "t": "11:50",
        "user": "Prepare me for the meeting with the building client.",
        "work": [
          "Pulled the history",
          "Found 2 open matters"
        ],
        "say": "The history, two open matters and a suggested agenda are ready.",
        "file": "Brief_building_client.pdf"
      },
      {
        "t": "16:30",
        "work": [
          "Checked the a-melding payroll report and VAT"
        ],
        "say": "The a-melding payroll report and VAT for this period are flagged. The draft notice to the business client is not sent until you press Send.",
        "mail": {
          "to": "the business client",
          "sub": "Deadlines this period",
          "body": "Hi. The a-melding payroll report and VAT are due this period. Both are on the list. Let me know if anything should be moved."
        }
      }
    ],
    "regnskap|selger": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 7 emails",
          "Pulled the earlier engagements"
        ],
        "say": "Before the meeting with the property company: three earlier engagements and two open matters."
      },
      {
        "t": "11:10",
        "user": "Prepare me for the meeting with the property company at 13:00.",
        "work": [
          "Gathered the history and the open matters"
        ],
        "say": "The brief is ready: the history, the open matters and what you should ask about.",
        "file": "Brief_property_company.pdf"
      },
      {
        "t": "14:05",
        "work": [
          "Put 3 quotes in order"
        ],
        "say": "Three quotes are open. the property company is first, then two others.",
        "ask": {
          "q": "Shall I follow up the property company first?",
          "opts": [
            "Yes, draft it",
            "Wait until after the meeting"
          ],
          "pick": 1,
          "after": "All right. I will wait until after the meeting, and I will not send anything."
        }
      },
      {
        "t": "16:40",
        "user": "Draft a quote for the building client, like the previous engagement.",
        "work": [
          "Read the previous similar engagement"
        ],
        "say": "The draft is built on that engagement. Read it before you press Send.",
        "mail": {
          "to": "the building client",
          "sub": "Quote",
          "body": "Hello. Here is the quote, built on the previous engagement with you. Tell me if anything should change. Best regards"
        }
      }
    ],
    "regnskap|kontor": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Reconciled 8 vouchers against the hours"
        ],
        "say": "The vouchers are checked against the hours and the engagements. the building client has one difference."
      },
      {
        "t": "10:15",
        "user": "Vis meg avviket.",
        "work": [
          "Compared it with 2 engagements"
        ],
        "say": "One voucher at the building client is missing. The others match.",
        "ask": {
          "q": "Shall I ask for the voucher?",
          "opts": [
            "Yes, draft it",
            "I will take that one myself"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you have read it."
        }
      },
      {
        "t": "13:20",
        "work": [
          "Wrote a draft for the building client"
        ],
        "say": "They are missing one voucher. Nothing is sent until you press Send.",
        "mail": {
          "to": "the building client",
          "sub": "A voucher is missing",
          "body": "Hello. We are missing one voucher on the engagement. Could you send it, so the papers are complete? Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the delivery"
        ],
        "say": "The delivery for the business client is ready. The difference is attached.",
        "file": "Delivery_business_client.pdf"
      }
    ],
    "regnskap|enk": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Pulled the outstanding amounts"
        ],
        "say": "Two invoices are outstanding, and next week's bills are included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:35",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with next week's bills"
        ],
        "say": "Next week is tight. Nothing has been paid."
      },
      {
        "t": "12:45",
        "user": "Gather the hours for the building client.",
        "work": [
          "Gathered the hours from 5 days"
        ],
        "say": "The hours are ready for the invoice. The draft is not sent until you press Send.",
        "mail": {
          "to": "the building client",
          "sub": "Hours for this period",
          "body": "Hello. Here are the hours on the engagement for this period. Tell me if anything should be corrected before it is invoiced. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Checked the tax deadline"
        ],
        "say": "The tax deadline is getting close. The follow-up is ready, but it has not been sent.",
        "ask": {
          "q": "Shall I write the follow-up?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 0,
          "after": "The draft is ready. It is not sent until you say yes."
        }
      }
    ],
    "helse|leder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 10 emails",
          "Pulled outstanding settlements"
        ],
        "say": "Three settlements are outstanding. The regular bills over the coming weeks are in the overview.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "10:40",
        "user": "Prepare me for the appointment with the customer.",
        "work": [
          "Pulled the history",
          "Found 2 open matters"
        ],
        "say": "The history, two open matters and a suggested agenda are ready.",
        "file": "Brief_the_customer.pdf"
      },
      {
        "t": "13:10",
        "work": [
          "Checked 2 deadlines"
        ],
        "say": "Insurance and authorisation are due this period. the customer's enquiry is still unanswered.",
        "ask": {
          "q": "Shall I reply to the customer?",
          "opts": [
            "Yes, draft it",
            "Wait until after the appointment"
          ],
          "pick": 1,
          "after": "All right. I will wait until after the appointment, and I will not send anything."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Wrote a draft for the customer"
        ],
        "say": "The draft after the appointment is ready. Nothing is sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Follow-up after the appointment",
          "body": "Hi. Thank you for today. Here is a short summary of what we agreed, so you have it in one place. Let me know if anything should change. Best regards"
        }
      }
    ],
    "helse|selger": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 6 emails",
          "Pulled the history on the customer"
        ],
        "say": "Before the conversation: the history is gathered, and one question is still open."
      },
      {
        "t": "09:50",
        "user": "Prepare me for the conversation with the customer.",
        "work": [
          "Gathered 1 open question"
        ],
        "say": "The question is at the top, with a short history underneath. Nothing has been sent."
      },
      {
        "t": "12:30",
        "work": [
          "Put 3 messages in order"
        ],
        "say": "Three enquiries have gone quiet. the customer has been waiting the longest.",
        "ask": {
          "q": "Shall I follow up with the customer first?",
          "opts": [
            "Yes, draft it",
            "Take the next one first"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you say yes."
        }
      },
      {
        "t": "15:55",
        "user": "Draft a quote for a programme, like the similar course of treatment.",
        "work": [
          "Read 1 similar course of treatment"
        ],
        "say": "The quote is built on that course of treatment. Read it before you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Quote for a programme",
          "body": "Hi. Here is a proposal for a programme, built on a similar course of treatment. Tell me if it fits, or if anything should be adjusted. Best regards"
        }
      }
    ],
    "helse|kontor": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Reconciled 5 settlements against the hours"
        ],
        "say": "The settlements are checked against the hours. the customer has one difference."
      },
      {
        "t": "10:25",
        "user": "Vis meg avviket.",
        "work": [
          "Compared it with the hours"
        ],
        "say": "One settlement for the customer does not match the hours. The others are in order.",
        "ask": {
          "q": "Shall I set it aside?",
          "opts": [
            "Yes, show the difference",
            "Take it forward"
          ],
          "pick": 0,
          "after": "It will sit there until you have seen it. Nothing has been sent."
        }
      },
      {
        "t": "13:40",
        "work": [
          "Wrote a draft about the unanswered appointment"
        ],
        "say": "A draft for the unanswered appointment. Nothing is sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "An appointment still waiting",
          "body": "Hi. You have an appointment that is still unanswered. Tell me if it suits you, or if we should find a new time. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the supporting papers"
        ],
        "say": "The papers for the business client are gathered. The difference is attached.",
        "file": "Papers_business_client.pdf"
      }
    ],
    "helse|enk": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Pulled outstanding settlements"
        ],
        "say": "Two settlements are outstanding. The overview for next week is included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:25",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with the regular bills"
        ],
        "say": "Next week works, but look at the settlements before you pay anything."
      },
      {
        "t": "12:15",
        "user": "Gather the hours and the settlement for the customer.",
        "work": [
          "Gathered the hours from 3 days"
        ],
        "say": "The hours and the settlement for the customer are ready. The invoice is not sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Settlement",
          "body": "Hi. Here is the settlement for the hours. Tell me if something does not match, and I will correct it before it goes further. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Checked the VAT deadline"
        ],
        "say": "The VAT deadline is getting close. The follow-up of the appointment is waiting for you.",
        "ask": {
          "q": "Shall I write the follow-up?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 0,
          "after": "The draft is ready. It is not sent until you say yes."
        }
      }
    ],
    "butikk|leder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 13 emails",
          "Compared it with the previous agreement"
        ],
        "say": "the plumbing firm has changed the price against the previous agreement. I have not paid anything."
      },
      {
        "t": "10:00",
        "work": [
          "Checked the margin on 3 orders"
        ],
        "say": "Three completed orders stand out on margin. They are marked.",
        "ask": {
          "q": "Shall I set the order differences aside?",
          "opts": [
            "Yes, show them",
            "Take them this evening"
          ],
          "pick": 0,
          "after": "They are ready. Nothing in the orders has been changed."
        }
      },
      {
        "t": "13:05",
        "user": "How does the liquidity look?",
        "work": [
          "Pulled the outstanding amounts"
        ],
        "say": "Next week is tight. The VAT deadline at the business client is included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "16:30",
        "work": [
          "Drafted a notice for the business client"
        ],
        "say": "A draft about the VAT deadline. Nothing is sent until you press Send.",
        "mail": {
          "to": "the business client",
          "sub": "VAT deadline",
          "body": "Hi. The VAT deadline is on the list this period. Let me know if you want me to set aside time for it."
        }
      }
    ],
    "butikk|selger": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 5 emails",
          "Pulled the delivery for the customer"
        ],
        "say": "Before the conversation with the customer: the delivery and one open question are gathered."
      },
      {
        "t": "09:40",
        "user": "Prepare me for the conversation with the customer about the delivery.",
        "work": [
          "Gathered 1 open question"
        ],
        "say": "The question about the delivery is at the top. Nothing has been sent."
      },
      {
        "t": "12:20",
        "work": [
          "Put 3 quotes in order"
        ],
        "say": "the building client has been waiting the longest. the customer is second.",
        "ask": {
          "q": "Shall I follow up the building client first?",
          "opts": [
            "Yes, draft it",
            "Start with the customer"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you say yes."
        }
      },
      {
        "t": "15:30",
        "user": "Draft a quote built on a similar order.",
        "work": [
          "Read 1 similar order"
        ],
        "say": "The quote is built on that order. Read it before you press Send.",
        "mail": {
          "to": "the building client",
          "sub": "Quote",
          "body": "Hello. Here is the quote, built on a similar order. Tell me if anything should change. Best regards"
        }
      }
    ],
    "butikk|kontor": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Reconciled 7 invoices against the orders"
        ],
        "say": "The invoices are checked against the orders. the plumbing firm is on the exception list."
      },
      {
        "t": "10:35",
        "user": "What is different?",
        "work": [
          "Compared it with 2 orders"
        ],
        "say": "One point at the plumbing firm does not match. The rest is in order.",
        "ask": {
          "q": "Shall I set the difference aside?",
          "opts": [
            "Yes, show the difference",
            "Take it forward"
          ],
          "pick": 0,
          "after": "It will sit there until you have seen it. Nothing has been paid."
        }
      },
      {
        "t": "13:15",
        "work": [
          "Wrote a draft about the return"
        ],
        "say": "A reply to the customer about the return, and a note to the supplier. Nothing is sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Return",
          "body": "Hi. I am writing about the return. It is noted with us. Let me know if anything is urgent, and I will take that first. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the file"
        ],
        "say": "the business client's file is ready. The difference is attached.",
        "file": "File_business_client.pdf"
      }
    ],
    "butikk|enk": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Pulled the outstanding amounts"
        ],
        "say": "Two invoices are outstanding. Next week's stock purchase is included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:30",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with next week's stock purchases"
        ],
        "say": "Next week is tight before the stock purchase. Nothing has been paid."
      },
      {
        "t": "12:40",
        "user": "Draft a quote for the customer, like the similar order.",
        "work": [
          "Read 1 similar order"
        ],
        "say": "The quote is built on that order. It is not sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Quote",
          "body": "Hi. Here is the quote, built on a similar order. Tell me if you want anything adjusted. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Checked the VAT deadline"
        ],
        "say": "The VAT deadline is getting close, and the order for the customer has not been followed up.",
        "ask": {
          "q": "Shall I follow up the order?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 0,
          "after": "The draft is ready. It is not sent until you say yes."
        }
      }
    ],
    "eiendom|leder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 8 emails",
          "Pulled outstanding rent"
        ],
        "say": "Two rent payments are outstanding. The bills over the coming weeks are included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "10:20",
        "work": [
          "Read the contract from the property company",
          "Compared it with the usual terms"
        ],
        "say": "Two points in the contract differ from the usual terms.",
        "ask": {
          "q": "Shall I set the differences aside?",
          "opts": [
            "Yes, show the differences",
            "Wait until tomorrow"
          ],
          "pick": 0,
          "after": "They will sit there until you have read them. Nothing has been signed."
        }
      },
      {
        "t": "13:00",
        "user": "Has the customer's enquiry been answered?",
        "work": [
          "Read the thread with the customer"
        ],
        "say": "No. It is still unanswered. The insurance deadline is flagged as well."
      },
      {
        "t": "16:30",
        "work": [
          "Wrote a draft for the customer"
        ],
        "say": "The draft is ready. Nothing is sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Your enquiry",
          "body": "Hi. Thank you for the enquiry. I have looked at it, and here is a short reply so you have it in one place. Let me know if anything is missing. Best regards"
        }
      }
    ],
    "eiendom|selger": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 4 emails",
          "Pulled the history before the viewing"
        ],
        "say": "Before the viewing with the customer: the history and two open questions are gathered."
      },
      {
        "t": "09:15",
        "user": "Prepare me for the viewing with the customer.",
        "work": [
          "Gathered 2 open questions"
        ],
        "say": "The questions are at the top. Nothing has been sent to the customer."
      },
      {
        "t": "12:25",
        "work": [
          "Put 3 unanswered quotes in order"
        ],
        "say": "Three quotes are unanswered. the property company has been waiting the longest.",
        "ask": {
          "q": "Shall I follow up the property company first?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you say yes."
        }
      },
      {
        "t": "16:10",
        "user": "Draft a quote for the property company, like the previous engagement.",
        "work": [
          "Read the previous engagement"
        ],
        "say": "The quote is built on that engagement. Read it before you press Send.",
        "mail": {
          "to": "the property company",
          "sub": "Quote",
          "body": "Hello. Here is the quote for the engagement, built on the previous one we did for you. Tell me if anything should change. Best regards"
        }
      }
    ],
    "eiendom|kontor": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Reconciled 4 claims against the agreements"
        ],
        "say": "The claims are checked against the agreements. the customer has one difference."
      },
      {
        "t": "10:45",
        "user": "What does not match?",
        "work": [
          "Compared it with the agreement"
        ],
        "say": "One claim for the customer differs from the agreement. The others match.",
        "ask": {
          "q": "Shall I set it aside?",
          "opts": [
            "Yes, show the difference",
            "Take it forward"
          ],
          "pick": 0,
          "after": "It will sit there until you have seen it. Nothing has been sent."
        }
      },
      {
        "t": "13:35",
        "work": [
          "Wrote a draft for the property company"
        ],
        "say": "The follow-up is a draft. Nothing is sent until you press Send.",
        "mail": {
          "to": "the property company",
          "sub": "Follow-up",
          "body": "Hello. I am writing about the agreement. One claim looks different from what it says there. Let me know if you see the same thing. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the supporting papers"
        ],
        "say": "The papers for the business client are gathered. The difference is attached.",
        "file": "Papers_business_client.pdf"
      }
    ],
    "eiendom|enk": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Pulled rent that is still outstanding"
        ],
        "say": "Two rent payments are outstanding. Next week is in the overview.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:50",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with bills that are coming in"
        ],
        "say": "The week works, but look at the rent that is outstanding before you pay anything."
      },
      {
        "t": "12:35",
        "user": "Draft a quote for the customer on the practical work.",
        "work": [
          "Read the enquiry"
        ],
        "say": "The draft is ready, and it has not been sent. Read it before you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Quote, practical work",
          "body": "Hi. Here is a quote for the practical work around the property. Tell me if anything should be included or left out. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Checked 2 deadlines"
        ],
        "say": "The contract deadline and the tax deadline are getting close. The follow-up is waiting for you.",
        "ask": {
          "q": "Shall I write the follow-up?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 1,
          "after": "All right. I will wait a week, and I will not send anything."
        }
      }
    ],
    "konsulent|leder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 9 emails",
          "Pulled this week's figures"
        ],
        "say": "Turnover and the order book are in. One figure differs from the budget.",
        "file": "Figures_week43.xlsx"
      },
      {
        "t": "10:30",
        "user": "Prepare me for the meeting with the customer.",
        "work": [
          "Pulled the history",
          "Found 2 open matters"
        ],
        "say": "The history, two open matters and a suggested agenda are ready.",
        "file": "Brief_the_customer.pdf"
      },
      {
        "t": "13:25",
        "work": [
          "Found 1 quote with no reply"
        ],
        "say": "The quote for the building client is still unanswered. VAT at the business client is on the list.",
        "ask": {
          "q": "Shall I remind the building client?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you have read it."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Drafted a reminder"
        ],
        "say": "The reminder is ready. Nothing is sent until you press Send.",
        "mail": {
          "to": "the building client",
          "sub": "The quote",
          "body": "Hello. The quote is still unanswered with you. Tell me if you want to go ahead, or if it should be updated. Best regards"
        }
      }
    ],
    "konsulent|selger": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 6 emails",
          "Pulled earlier work for the customer"
        ],
        "say": "Before the meeting with the customer: two earlier engagements and one open matter."
      },
      {
        "t": "09:35",
        "user": "Prepare me for the meeting with the customer.",
        "work": [
          "Gathered 1 open matter"
        ],
        "say": "The matter and the history are ready. Nothing has been sent."
      },
      {
        "t": "12:15",
        "work": [
          "Put 3 quotes in order"
        ],
        "say": "the building client is first in the pipeline. Two others have been waiting for less time.",
        "ask": {
          "q": "Shall I follow up the building client first?",
          "opts": [
            "Yes, draft it",
            "Start with the customer"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you say yes."
        }
      },
      {
        "t": "15:45",
        "user": "Draft a quote built on the similar engagement.",
        "work": [
          "Read 1 similar engagement"
        ],
        "say": "The quote is built on that engagement. Read it before you press Send.",
        "mail": {
          "to": "the building client",
          "sub": "Quote",
          "body": "Hello. Here is the quote, built on a similar engagement. Tell me if anything should change. Best regards"
        }
      }
    ],
    "konsulent|kontor": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Reconciled 6 invoices against the hours"
        ],
        "say": "The invoices are checked against the hours. the building client has one difference."
      },
      {
        "t": "10:10",
        "user": "Vis meg avviket.",
        "work": [
          "Compared it with the timesheets"
        ],
        "say": "One point does not match the hours. The rest is in order.",
        "ask": {
          "q": "Shall I set it aside?",
          "opts": [
            "Yes, show the difference",
            "Take it forward"
          ],
          "pick": 0,
          "after": "It will sit there until you have seen it. Nothing has been sent."
        }
      },
      {
        "t": "13:50",
        "work": [
          "Drafted the follow-up after the meeting"
        ],
        "say": "A draft after the meeting with the customer. Nothing is sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "After the meeting",
          "body": "Hi. Thank you for the meeting. Here is a short follow-up of what we talked about. Let me know if anything should be corrected. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the time records from the accounting system"
        ],
        "say": "The time records for the business client are ready.",
        "file": "Hours_business_client.xlsx"
      }
    ],
    "konsulent|enk": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Pulled the outstanding amounts"
        ],
        "say": "Two invoices are outstanding. Next week's bills are included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:40",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with next week's bills"
        ],
        "say": "Next week is tight. Nothing has been paid."
      },
      {
        "t": "12:20",
        "user": "Can you gather the hours for the customer?",
        "work": [
          "Gathered the hours from 4 days"
        ],
        "say": "The hours for the customer are ready. The invoice is a draft, and it is not sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Hours for this period",
          "body": "Hi. Here are the hours for this period. Tell me if something does not match, and I will correct it before it is invoiced. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Checked the VAT deadline",
          "Found 1 quote with no reply"
        ],
        "say": "The VAT deadline is getting close, and the quote for the building client is still unanswered.",
        "ask": {
          "q": "Shall I send a reminder about the quote?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 0,
          "after": "The draft is ready. It is not sent until you say yes."
        }
      }
    ],
    "restaurant|leder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 8 emails",
          "Compared the price with the previous agreement"
        ],
        "say": "the plumbing firm has changed the price. The liquidity before next week's bills is in the sheet.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "11:05",
        "work": [
          "Compared the event with 3 similar ones"
        ],
        "say": "The margin on the event for the customer stands out from the three.",
        "ask": {
          "q": "Shall I set the difference aside?",
          "opts": [
            "Yes, show the difference",
            "Take it this evening"
          ],
          "pick": 0,
          "after": "It is ready. Nothing has been changed."
        }
      },
      {
        "t": "14:10",
        "user": "What about insurance and VAT?",
        "work": [
          "Checked 2 deadlines"
        ],
        "say": "Both are due this period. the business client is on the list."
      },
      {
        "t": "16:30",
        "work": [
          "Drafted a notice"
        ],
        "say": "The draft is ready. Nothing is sent until you press Send.",
        "mail": {
          "to": "the business client",
          "sub": "Insurance and VAT",
          "body": "Hi. Insurance and VAT are due this period. Both are on the list. Let me know if anything should be taken first."
        }
      }
    ],
    "restaurant|selger": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 5 emails",
          "Pulled the earlier event"
        ],
        "say": "The enquiry from the customer about an event has been read, with one similar event beside it."
      },
      {
        "t": "10:15",
        "user": "Prepare me for the enquiry from the customer.",
        "work": [
          "Gathered 1 similar event"
        ],
        "say": "A short history and the similar event are ready. Nothing has been sent."
      },
      {
        "t": "12:40",
        "work": [
          "Put 3 enquiries in order"
        ],
        "say": "the building client has been waiting the longest. the customer is second.",
        "ask": {
          "q": "Shall I reply to the building client first?",
          "opts": [
            "Yes, draft it",
            "Start with the customer"
          ],
          "pick": 1,
          "after": "All right. The customer first. The draft is not sent until you say yes."
        }
      },
      {
        "t": "15:20",
        "user": "Draft a quote for the event, like the similar one.",
        "work": [
          "Read the similar event"
        ],
        "say": "The quote is built on that event. Read it before you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Quote, event",
          "body": "Hi. Here is a quote for the event, built on a similar event. Tell me if anything should be adjusted. Best regards"
        }
      }
    ],
    "restaurant|kontor": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Reconciled 4 invoices against the delivery note"
        ],
        "say": "The supplier invoices are checked. the plumbing firm differs from the delivery note."
      },
      {
        "t": "10:30",
        "user": "What is different?",
        "work": [
          "Compared it with 2 delivery notes"
        ],
        "say": "One point at the plumbing firm does not match. The rest is in order.",
        "ask": {
          "q": "Shall I ask the supplier?",
          "opts": [
            "Yes, draft it",
            "I will take that one myself"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you have read it."
        }
      },
      {
        "t": "13:45",
        "work": [
          "Wrote a draft for the supplier"
        ],
        "say": "A draft to the plumbing firm, and a short reply to the customer, is waiting. Nothing is sent until you press Send.",
        "mail": {
          "to": "the plumbing firm",
          "sub": "Delivery note",
          "body": "Hello. The invoice does not match the delivery note on one point. Could you look at it before we go further? Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the file"
        ],
        "say": "the business client's file is gathered. The difference is attached.",
        "file": "File_business_client.pdf"
      }
    ],
    "restaurant|enk": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Pulled the outstanding amounts"
        ],
        "say": "One invoice is outstanding. Next week's stock purchase is included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:20",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with next week's stock purchases"
        ],
        "say": "Next week is tight before the stock purchase. Nothing has been paid."
      },
      {
        "t": "12:50",
        "user": "Draft a quote for an event for the customer, like the similar one.",
        "work": [
          "Read 1 similar event"
        ],
        "say": "The quote is built on that event. It is not sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Quote, event",
          "body": "Hi. Here is the quote for the event. Tell me if anything should change. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Checked the VAT deadline"
        ],
        "say": "The VAT deadline is getting close. The follow-up has not been sent.",
        "ask": {
          "q": "Shall I write the follow-up?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 0,
          "after": "The draft is ready. It is not sent until you say yes."
        }
      }
    ],
    "annet|leder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 10 emails",
          "Pulled the outstanding amounts"
        ],
        "say": "Three invoices are outstanding. The bills over the coming weeks are included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "10:15",
        "user": "Prepare me for the meeting with the customer.",
        "work": [
          "Pulled the history",
          "Found 2 open matters"
        ],
        "say": "The history, two open matters and a suggested agenda are ready.",
        "file": "Brief_the_customer.pdf"
      },
      {
        "t": "13:30",
        "work": [
          "Read the tender note",
          "Checked 2 deadlines"
        ],
        "say": "A short note on the tender is ready. VAT and the a-melding payroll report have a deadline.",
        "ask": {
          "q": "Shall I put the tender on the list this evening?",
          "opts": [
            "Yes, include it",
            "Wait until tomorrow"
          ],
          "pick": 0,
          "after": "It will be in the evening note. Nothing has been filed."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Drafted a notice for the business client"
        ],
        "say": "A draft about the deadlines. Nothing is sent until you press Send.",
        "mail": {
          "to": "the business client",
          "sub": "VAT and the a-melding",
          "body": "Hi. VAT and the a-melding payroll report have a deadline this period. Both are on the list. Let me know if anything should be taken first."
        }
      }
    ],
    "annet|selger": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 6 emails",
          "Pulled the history on the customer"
        ],
        "say": "Before the meeting: the history and two open matters are gathered."
      },
      {
        "t": "09:25",
        "user": "Prepare me for the meeting with the customer.",
        "work": [
          "Gathered 2 open matters"
        ],
        "say": "The matters are at the top. Nothing has been sent."
      },
      {
        "t": "12:05",
        "work": [
          "Put 3 quotes in order"
        ],
        "say": "Three quotes are open. the customer has been waiting the longest, then the building client.",
        "ask": {
          "q": "Shall I follow up with the customer first?",
          "opts": [
            "Yes, draft it",
            "Take the building client first"
          ],
          "pick": 0,
          "after": "The draft is coming. It is not sent until you say yes."
        }
      },
      {
        "t": "16:15",
        "user": "Draft a quote for the building client, like the similar job.",
        "work": [
          "Read 1 similar job"
        ],
        "say": "The quote is built on that job. Read it before you press Send.",
        "mail": {
          "to": "the building client",
          "sub": "Quote",
          "body": "Hello. Here is the quote, built on a similar job. Tell me if anything should change. Best regards"
        }
      }
    ],
    "annet|kontor": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Reconciled 5 invoices against the supporting documents"
        ],
        "say": "The invoices are checked. The exception list has two items, one of them from the plumbing firm."
      },
      {
        "t": "10:40",
        "user": "Show me the list.",
        "work": [
          "Compared it with 3 sets of supporting documents"
        ],
        "say": "Two items you should see before anything is paid. The rest matches.",
        "ask": {
          "q": "Shall I set the differences aside?",
          "opts": [
            "Yes, show the differences",
            "Take them forward"
          ],
          "pick": 0,
          "after": "They will sit there until you have seen them. Nothing has been paid."
        }
      },
      {
        "t": "13:25",
        "work": [
          "Wrote a draft for the customer and the supplier"
        ],
        "say": "Follow-up to the customer and the supplier. Nothing is sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Follow-up",
          "body": "Hi. I am writing about the matter. Here is a short follow-up, so you have it in one place. Let me know if anything is missing. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the file"
        ],
        "say": "the business client's file is ready. The differences are attached.",
        "file": "File_business_client.pdf"
      }
    ],
    "annet|enk": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Pulled the outstanding amounts"
        ],
        "say": "Two invoices are outstanding. Next week's bills are included.",
        "file": "Liquidity_week43.xlsx"
      },
      {
        "t": "09:45",
        "user": "How does the liquidity look?",
        "work": [
          "Compared it with next week's bills"
        ],
        "say": "Next week is tight. Nothing has been paid."
      },
      {
        "t": "12:25",
        "user": "Draft a quote for the customer, and gather the hours.",
        "work": [
          "Gathered the hours from 3 days",
          "Read the previous job"
        ],
        "say": "The quote and the hours are gathered. The invoice is a draft, and it is not sent until you press Send.",
        "mail": {
          "to": "the customer",
          "sub": "Quote and hours",
          "body": "Hi. Here is the quote, and the hours are gathered underneath. Tell me if anything should be corrected before it is invoiced. Best regards"
        }
      },
      {
        "t": "16:30",
        "work": [
          "Checked the VAT deadline"
        ],
        "say": "The VAT deadline is getting close. The customer follow-up has not been sent.",
        "ask": {
          "q": "Shall I write the follow-up?",
          "opts": [
            "Yes, draft it",
            "Wait a week"
          ],
          "pick": 0,
          "after": "The draft is ready. It is not sent until you say yes."
        }
      }
    ],
    "borettslag|styreleder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 9 emails",
          "Compared it with 4 earlier invoices"
        ],
        "say": "The invoice from the plumbing firm is higher than last time, and one point differs from the agreement.",
        "ask": {
          "q": "Shall I take it to the board meeting?",
          "opts": [
            "Yes, put it on the agenda",
            "Set it aside"
          ],
          "pick": 0,
          "after": "It is included. Nothing has been paid."
        }
      },
      {
        "t": "10:20",
        "user": "Draft the agenda for the board meeting.",
        "work": [
          "Pulled the items from the last meeting"
        ],
        "say": "The notice and the agenda are ready. Decisions that are still open are included.",
        "file": "Agenda_boardmeeting.pdf"
      },
      {
        "t": "13:40",
        "work": [
          "Compared 2 quotes"
        ],
        "say": "the plumbing firm and the building client are set side by side. What sets them apart is marked. Nothing has been ordered.",
        "file": "Quote_comparison.pdf"
      },
      {
        "t": "16:30",
        "user": "Write a reply to the resident.",
        "work": [
          "Read the thread with the resident"
        ],
        "say": "The draft is here. Nothing is sent until you press Send.",
        "mail": {
          "to": "the resident",
          "sub": "The board meeting",
          "body": "Hi. The invoice from the plumbing firm is on the agenda for the next board meeting. Tell me if you want anything else beforehand."
        }
      }
    ],
    "borettslag|styremedlem": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 6 emails",
          "Compared the invoice with the agreement"
        ],
        "say": "The reading for the meeting is ready. The invoice from the plumbing firm differs from the agreement.",
        "file": "Reading_boardmeeting.pdf"
      },
      {
        "t": "11:00",
        "user": "What should I read first?",
        "work": [
          "Marked 1 difference"
        ],
        "say": "Start with the difference on the invoice. The rest can wait.",
        "ask": {
          "q": "Shall I put the difference at the top?",
          "opts": [
            "Yes, put it at the top",
            "Show it all the same"
          ],
          "pick": 0,
          "after": "The difference is at the top. Nothing has been paid."
        }
      },
      {
        "t": "14:15",
        "user": "Write a reply to the resident.",
        "work": [
          "Read the thread with the resident"
        ],
        "say": "The draft is ready. Nothing is sent until you press Send.",
        "mail": {
          "to": "the resident",
          "sub": "Before the meeting",
          "body": "Hi. I have read the matter. The difference on the invoice from the plumbing firm looks like what we should take first. Tell me if you see it differently."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the decisions from the last meeting"
        ],
        "say": "Three decisions from the last meeting are still open. They are gathered for you.",
        "file": "Decisions_open.pdf"
      }
    ],
    "borettslag|forretning": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 11 emails",
          "Compared it with the earlier price and the agreement"
        ],
        "say": "The invoice from the plumbing firm is higher than last time, and one point differs from the agreement.",
        "ask": {
          "q": "Shall I flag it for the board?",
          "opts": [
            "Yes, flag the difference",
            "Set it aside"
          ],
          "pick": 0,
          "after": "It is flagged. Nothing has been paid."
        }
      },
      {
        "t": "11:30",
        "work": [
          "Compared 2 quotes from tradespeople"
        ],
        "say": "the plumbing firm and the building client are compared. What sets them apart is marked. Nothing has been ordered.",
        "file": "Quote_comparison.pdf"
      },
      {
        "t": "14:00",
        "user": "What sets the quotes apart?",
        "work": [
          "Read both quotes"
        ],
        "say": "Price and one term set them apart. The rest is the same. The board has to see it before anything is ordered."
      },
      {
        "t": "16:30",
        "work": [
          "Checked the maintenance plan",
          "Drafted the notice"
        ],
        "say": "The deadlines in the maintenance plan are included. The notice is a draft, and it is not sent until you press Send.",
        "mail": {
          "to": "the resident",
          "sub": "Notice of the board meeting",
          "body": "Hi. The notice and the agenda for the board meeting are attached. The deadlines in the maintenance plan are included. Tell me if anything is missing."
        }
      }
    ],
    "forening|styreleder": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 7 emails",
          "Compared it with the previous price and the agreement"
        ],
        "say": "The invoice from the plumbing firm is checked. One point differs from the agreement and from the previous price.",
        "ask": {
          "q": "Shall I take it to the board meeting?",
          "opts": [
            "Yes, put it on the agenda",
            "Set it aside"
          ],
          "pick": 0,
          "after": "It is included. Nothing has been paid."
        }
      },
      {
        "t": "10:40",
        "user": "Draft the agenda and the notice.",
        "work": [
          "Pulled the items from the last meeting"
        ],
        "say": "The agenda and the notice for the board meeting are ready. Fees that are outstanding are a separate item.",
        "file": "Agenda_boardmeeting.pdf"
      },
      {
        "t": "13:20",
        "work": [
          "Found 4 members with fees outstanding"
        ],
        "say": "Four members have fees outstanding. No reminder has gone out."
      },
      {
        "t": "16:30",
        "user": "Write a reply to the resident.",
        "work": [
          "Read the thread with the resident"
        ],
        "say": "The draft reply is ready. Nothing is sent until you press Send.",
        "mail": {
          "to": "the resident",
          "sub": "The board meeting",
          "body": "Hi. The matter is on the board meeting, and fees that are outstanding are a separate item. Tell me if you want anything else before the meeting."
        }
      }
    ],
    "forening|styremedlem": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 5 emails",
          "Compared the invoice with the agreement"
        ],
        "say": "The reading is ready. The invoice from the plumbing firm differs from the agreement.",
        "file": "Reading_boardmeeting.pdf"
      },
      {
        "t": "11:15",
        "user": "What should I read first?",
        "work": [
          "Marked 1 difference"
        ],
        "say": "Start with the difference. The rest of the reading can wait until this evening.",
        "ask": {
          "q": "Shall I put the difference at the top?",
          "opts": [
            "Yes, put it at the top",
            "Show it all the same"
          ],
          "pick": 0,
          "after": "The difference is at the top. Nothing has been paid."
        }
      },
      {
        "t": "14:30",
        "user": "Write a reply about the annual meeting.",
        "work": [
          "Read the thread with the resident"
        ],
        "say": "The draft about the annual meeting is ready. Nothing is sent until you press Send.",
        "mail": {
          "to": "the resident",
          "sub": "The annual meeting",
          "body": "Hi. The annual meeting is on the agenda. We should take the difference on the invoice from the plumbing firm first. Tell me if you see it differently."
        }
      },
      {
        "t": "16:30",
        "work": [
          "Pulled the decisions from the last meeting"
        ],
        "say": "Two decisions from the last meeting are still open.",
        "file": "Decisions_open.pdf"
      }
    ],
    "forening|forretning": [
      {
        "t": "07:00 · Morning report (standing routine)",
        "work": [
          "Read 8 emails",
          "Compared the invoice with the agreement"
        ],
        "say": "The invoice from the plumbing firm differs from the agreement on one point.",
        "ask": {
          "q": "Shall I flag it for the board?",
          "opts": [
            "Yes, flag the difference",
            "Set it aside"
          ],
          "pick": 0,
          "after": "It is flagged. Nothing has been paid."
        }
      },
      {
        "t": "11:45",
        "work": [
          "Compared 2 quotes"
        ],
        "say": "Two quotes are set side by side before they go to the board. What sets them apart is marked. Nothing has been ordered.",
        "file": "Quote_comparison.pdf"
      },
      {
        "t": "14:20",
        "user": "What sets them apart?",
        "work": [
          "Read both quotes"
        ],
        "say": "Price and one term set them apart. The rest is the same."
      },
      {
        "t": "16:30",
        "work": [
          "Checked the application deadline",
          "Drafted the notice for the annual meeting"
        ],
        "say": "Maintenance and the application deadline are included. The notice is a draft, and it is not sent until you press Send.",
        "mail": {
          "to": "the resident",
          "sub": "Notice of the annual meeting",
          "body": "Hi. The notice for the annual meeting is attached. Maintenance and the application deadline are included. Tell me if anything is missing."
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
    const role=board?pick(stepRolleStyre):(enk?{value:'leder',label:'Managing director or owner'}:pick(stepRolleBedrift));
    const base=board?groups[type.value]:industries[bransje.value];
    const addon=roleAddon[enk?'leder':role.value];
    const assistants=base.assistants.includes(addon.assistant)?base.assistants.slice(0,4):base.assistants.concat(addon.assistant).slice(0,4);
    const sceneKey=board?`${type.value}|${role.value}`:`${bransje.value}|${enk?'enk':role.value}`;
    const scene=scenes[sceneKey];
    const day=scene.day;
    const skip=scene.skip;
    const title=enk?`Example setup: sole proprietorship in ${base.inTitle}`:`Example setup: ${addon.inTitle} in ${base.inTitle}`;
    document.getElementById('setup-title').textContent=title;
    fill(document.getElementById('setup-assistants'),assistants);
    fill(document.getElementById('setup-day'),day);
    fill(document.getElementById('setup-skip'),skip);
    document.getElementById('setup-live').hidden=false;
    const subject=enk?`Free call – ${type.label}, ${bransje.label}`:(bransje?`Free call – ${type.label}, ${bransje.label}, ${role.label}`:`Free call – ${type.label}, ${role.label}`);
    const lines=['Hi Andreas,','','I would like a free call about this example setup.','',`Type: ${type.label}`];
    if(bransje)lines.push(`Industry: ${bransje.label}`);
    if(!enk)lines.push(`Role: ${role.label}`);
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
