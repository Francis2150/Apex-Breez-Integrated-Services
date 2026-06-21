(function(){
    var SKEY='apex_ngo_data';
    var secFromDir=-1;

    /* --- Mobile Nav --- */
    var toggle=document.getElementById('mobileToggle'),nav=document.getElementById('mainNav'),overlay=document.getElementById('navOverlay');
    if(toggle&&nav&&overlay){function oN(){nav.classList.add('open');toggle.classList.add('active');overlay.classList.add('active');document.body.style.overflow='hidden'}function cN(){nav.classList.remove('open');toggle.classList.remove('active');overlay.classList.remove('active');document.body.style.overflow=''}toggle.addEventListener('click',function(e){e.stopPropagation();nav.classList.contains('open')?cN():oN()});overlay.addEventListener('click',cN);nav.querySelectorAll('a').forEach(function(l){l.addEventListener('click',function(){if(window.innerWidth<=991)cN()})});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){cN();toggle.focus()}});window.addEventListener('resize',function(){if(window.innerWidth>991)cN()})}

    /* --- Director Template --- */
    function dirFields(){return['first_name','middle_name','surname','former_name','dob','pob','nationality','occupation','contact1','contact2','email','tin','ghana_card','res_gps','res_landmark','res_house_no','res_street','res_city','res_town','res_district','res_region','res_country']}
    function dirHTML(i,d){
        d=d||{};
        var f=dirFields(),h='<div class="dyn-card" data-type="director" data-index="'+i+'">';
        h+='<div class="dyn-card-header"><h3><i class="fa fa-user-tie"></i> Director '+(i+1)+'</h3>';
        h+='<button type="button" class="remove-dyn-btn" '+(i===0?'style="display:none"':'')+'>×</button></div>';
        h+='<div class="role-checks">';
        h+='<label class="role-check-label"><input type="checkbox" class="is-sub-cb" '+(d.is_subscriber?'checked':'')+'> <span>Is also a Subscriber</span></label>';
        h+='<div class="vote-box" style="display:'+(d.is_subscriber?'block':'none')+'"><label>Voting Rights</label><select><option value="Yes" '+(d.voting_rights==='Yes'?'selected':'')+'>Yes</option><option value="No" '+(d.voting_rights==='No'?'selected':'')+'>No</option></select></div>';
        h+='<label class="role-check-label"><input type="checkbox" class="is-sec-cb" '+(d.is_secretary?'checked':'')+'> <span>Is also the Secretary</span></label>';
        h+='</div><div class="form-grid form-grid-2">';
        var labels={'first_name':'First Name *','middle_name':'Middle Name','surname':'Surname *','former_name':'Former Name','dob':'Date of Birth *','pob':'Place of Birth','nationality':'Nationality *','occupation':'Occupation','contact1':'Contact 1 *','contact2':'Contact 2','email':'Email *','tin':'TIN','ghana_card':'Ghana Card *','res_gps':'GPS','res_landmark':'Landmark','res_house_no':'House No.','res_street':'Street','res_city':'City','res_town':'Town','res_district':'District','res_region':'Region','res_country':'Country'};
        var types={'dob':'date'};
        f.forEach(function(k){
            var req=labels[k].indexOf('*')>-1;
            var lbl=labels[k].replace('*','').trim();
            var full=lbl+(req?' <span class="req">*</span>':'');
            var val=d[k]||'';
            if(k==='nationality'&&!val)val='Ghanaian';
            if(k==='res_country'&&!val)val='Ghana';
            var span=(k==='res_country'||k==='nationality')?'style="grid-column:1/-1"':'';
            h+='<div class="form-group" '+span+'><label>'+full+'</label><input type="'+(types[k]||'text')+'" class="form-control dyn-field" data-f="'+k+'" value="'+val+'" '+(req?'required':'')+'></div>';
        });
        h+='</div></div>';
        return h;
    }

    /* --- Subscriber Template --- */
    function subFields(){return['first_name','middle_name','surname','former_name','dob','pob','nationality','occupation','contact1','contact2','email','tin','ghana_card','res_gps','res_landmark','res_house_no','res_street','res_city','res_town','res_district','res_region']}
    function subHTML(i,d,linked){
        d=d||{};linked=linked||-1;
        var f=subFields(),h='<div class="dyn-card" data-type="subscriber" data-index="'+i+'" data-linked="'+linked+'">';
        if(linked>=0)h+='<div class="synced-badge"><i class="fa fa-copy"></i> Auto-filled from Director '+(linked+1)+'</div>';
        h+='<div class="dyn-card-header"><h3><i class="fa fa-file-signature"></i> Subscriber '+(i+1)+'</h3>';
        h+='<button type="button" class="remove-dyn-btn" '+(i===0?'style="display:none"':'')+'>×</button></div>';
        h+='<div class="form-grid form-grid-2">';
        var labels={'first_name':'First Name *','middle_name':'Middle Name','surname':'Surname *','former_name':'Former Name','dob':'Date of Birth *','pob':'Place of Birth','nationality':'Nationality *','occupation':'Occupation','contact1':'Contact 1 *','contact2':'Contact 2','email':'Email *','tin':'TIN','ghana_card':'Ghana Card *','res_gps':'GPS','res_landmark':'Landmark','res_house_no':'House No.','res_street':'Street','res_city':'City','res_town':'Town','res_district':'District','res_region':'Region'};
        var types={'dob':'date'};
        var ro=linked>=0?'readonly':'';
        f.forEach(function(k){
            var req=labels[k].indexOf('*')>-1;
            var lbl=labels[k].replace('*','').trim();
            var full=lbl+(req?' <span class="req">*</span>':'');
            var val=d[k]||'';
            if(k==='nationality'&&!val)val='Ghanaian';
            h+='<div class="form-group"><label>'+full+'</label><input type="'+(types[k]||'text')+'" class="form-control dyn-field" data-f="'+k+'" value="'+val+'" '+(req?'required':'')+' '+ro+'></div>';
        });
        h+='</div></div>';
        return h;
    }

    /* --- Init --- */
    function init(){
        var saved=null;
        try{saved=JSON.parse(localStorage.getItem(SKEY))}catch(e){}
        if(saved&&saved.directors&&saved.directors.length>0){rebuildFromData(saved)}
        else{document.getElementById('directorsContainer').innerHTML=dirHTML(0);document.getElementById('subscribersContainer').innerHTML=subHTML(0)}
        attachListeners();
    }

    function rebuildFromData(d){
        var dc=document.getElementById('directorsContainer');dc.innerHTML='';
        d.directors.forEach(function(dd,i){dc.innerHTML+=dirHTML(i,dd)});
        if(d.sec_from_director>=0){secFromDir=d.sec_from_director;applySecState()}
        else{document.getElementById('secFields').style.display='';document.getElementById('secNote').style.display='none';if(d.secretary){Object.keys(d.secretary).forEach(function(k){var inp=document.querySelector('.static-field[data-f="sec_'+k+'"]');if(inp)inp.value=d.secretary[k]||''})}}
        var sc=document.getElementById('subscribersContainer');sc.innerHTML='';
        d.subscribers.forEach(function(sd,i){var linked=(sd._linked!==undefined)?sd._linked:-1;sc.innerHTML+=subHTML(i,sd,linked)});
    }

    /* --- Add/Remove --- */
    function addDirector(){var c=document.getElementById('directorsContainer');var n=c.querySelectorAll('.dyn-card').length;c.innerHTML+=dirHTML(n);attachListeners();save()}
    function addSubscriber(){var c=document.getElementById('subscribersContainer');var n=c.querySelectorAll('.dyn-card').length;c.innerHTML+=subHTML(n);attachListeners();save()}
    function removeDyn(btn){if(!confirm('Remove this section?'))return;btn.closest('.dyn-card').remove();reindexCards('directorsContainer');reindexCards('subscribersContainer');attachListeners();save()}
    function reindexCards(cid){document.querySelectorAll('#'+cid+' .dyn-card').forEach(function(c,i){c.dataset.index=i;var h3=c.querySelector('h3');var t=c.dataset.type;h3.innerHTML='<i class="fa fa-'+(t==='director'?'user-tie':'file-signature')+'"></i> '+(t==='director'?'Director':'Subscriber')+' '+(i+1);var rm=c.querySelector('.remove-dyn-btn');rm.style.display=i===0?'none':''})}

    /* --- Secretary Sync --- */
    function handleSecCheck(dirIdx){
        var cb=document.querySelector('.dyn-card[data-type="director"][data-index="'+dirIdx+'"] .is-sec-cb');
        if(cb.checked){secFromDir=dirIdx;document.querySelectorAll('.is-sec-cb').forEach(function(c,i){if(i!==dirIdx){c.checked=false;c.disabled=true;c.closest('.role-check-label').style.opacity='0.4'}})}
        else{secFromDir=-1;document.querySelectorAll('.is-sec-cb').forEach(function(c){c.disabled=false;c.closest('.role-check-label').style.opacity='1'})}
        applySecState();save();
    }
    function applySecState(){
        if(secFromDir>=0){document.getElementById('secFields').style.display='none';document.getElementById('secNote').style.display='flex';document.getElementById('secNoteText').textContent='Secretary information is copied from Director '+(secFromDir+1)+'.'}
        else{document.getElementById('secFields').style.display='';document.getElementById('secNote').style.display='none'}
    }

    /* --- Subscriber Sync --- */
    function handleSubCheck(dirIdx){
        var card=document.querySelector('.dyn-card[data-type="director"][data-index="'+dirIdx+'"]');
        var cb=card.querySelector('.is-sub-cb');
        var voteBox=card.querySelector('.vote-box');
        voteBox.style.display=cb.checked?'block':'none';
        if(cb.checked){
            var existing=document.querySelector('.dyn-card[data-type="subscriber"][data-linked="'+dirIdx+'"]');
            if(!existing){var dirData=getCardData(card);var sc=document.getElementById('subscribersContainer');var n=sc.querySelectorAll('.dyn-card').length;sc.innerHTML+=subHTML(n,dirData,dirIdx);attachListeners()}
            else{var dirData=getCardData(card);setCardData(existing,dirData)}
        }else{
            var existing=document.querySelector('.dyn-card[data-type="subscriber"][data-linked="'+dirIdx+'"]');
            if(existing){existing.dataset.linked='-1';var badge=existing.querySelector('.synced-badge');if(badge)badge.remove();existing.querySelectorAll('.dyn-field').forEach(function(inp){inp.readOnly=false;inp.style.background='';inp.style.color=''})}
        }
        save();
    }

    function getCardData(card){var d={};card.querySelectorAll('.dyn-field').forEach(function(inp){d[inp.dataset.f]=inp.value.trim()});return d}
    function setCardData(card,d){card.querySelectorAll('.dyn-field').forEach(function(inp){if(d[inp.dataset.f]!==undefined)inp.value=d[inp.dataset.f]})}

    /* --- Collect All Data --- */
    function collectAll(){
        var data={org:{},office:{},directors:[],secretary:{},subscribers:[],sec_from_director:secFromDir};
        document.querySelectorAll('.static-field').forEach(function(inp){
            var f=inp.dataset.f;
            if(f.startsWith('off_'))data.office[f.replace('off_','')]=inp.value.trim();
            else if(f.startsWith('sec_'))data.secretary[f.replace('sec_','')]=inp.value.trim();
            else data.org[f]=inp.value.trim();
        });
        document.querySelectorAll('#directorsContainer .dyn-card').forEach(function(card){
            var d=getCardData(card);
            d.is_subscriber=card.querySelector('.is-sub-cb').checked;
            d.is_secretary=card.querySelector('.is-sec-cb').checked;
            d.voting_rights=card.querySelector('.vote-box select').value;
            data.directors.push(d);
        });
        document.querySelectorAll('#subscribersContainer .dyn-card').forEach(function(card){
            var d=getCardData(card);
            d._linked=parseInt(card.dataset.linked);
            data.subscribers.push(d);
        });
        return data;
    }

    /* --- LocalStorage --- */
    function save(){try{localStorage.setItem(SKEY,JSON.stringify(collectAll()))}catch(e){}}
    function attachListeners(){
        document.querySelectorAll('#ngoForm input, #ngoForm select').forEach(function(inp){
            if(inp.type==='checkbox')return;
            inp.removeEventListener('input',onInput);
            inp.removeEventListener('change',onInput);
            inp.addEventListener('input',onInput);
            inp.addEventListener('change',onInput);
        });
    }
    function onInput(){
        var card=this.closest('.dyn-card');
        if(card&&card.dataset.type==='director'){
            var idx=parseInt(card.dataset.index);
            var linked=document.querySelector('.dyn-card[data-type="subscriber"][data-linked="'+idx+'"]');
            if(linked){var f=this.dataset.f;var target=linked.querySelector('.dyn-field[data-f="'+f+'"]');if(target)target.value=this.value}
        }
        save();
    }

    /* --- Reset --- */
    document.getElementById('resetBtn').addEventListener('click',function(){
        if(!confirm('Clear all fields? This cannot be undone.'))return;
        try{localStorage.removeItem(SKEY)}catch(e){}
        secFromDir=-1;
        document.getElementById('directorsContainer').innerHTML=dirHTML(0);
        document.getElementById('subscribersContainer').innerHTML=subHTML(0);
        document.getElementById('secFields').style.display='';
        document.getElementById('secNote').style.display='none';
        document.querySelectorAll('.static-field').forEach(function(inp){inp.value='';if(inp.dataset.f==='sec_nationality'||inp.dataset.f==='sec_res_country')inp.value='Ghana'});
        document.querySelectorAll('.is-sec-cb').forEach(function(c){c.disabled=false;c.closest('.role-check-label').style.opacity='1'});
        attachListeners();
    });

    /* --- Submit --- */
    document.getElementById('ngoForm').addEventListener('submit',function(e){
        e.preventDefault();
        var valid=true;
        this.querySelectorAll('[required]').forEach(function(inp){if(!inp.value.trim()){inp.style.borderColor='#fb5607';valid=false}else{inp.style.borderColor=''}});
        if(!valid){showToast('Please fill all required fields.','error');var fe=this.querySelector('[style*="border-color: rgb(251, 86, 7)"]');if(fe)fe.scrollIntoView({behavior:'smooth',block:'center'});return}
        var data=collectAll();
        var btn=document.getElementById('submitBtn');
        btn.disabled=true;btn.innerHTML='<i class="fa fa-spinner fa-spin"></i> Submitting...';
        fetch('https://elevater247.com/abms/api/submit-ngo.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
        .then(function(r){if(!r.ok)return r.json().then(function(e){throw new Error(e.message||'Server error')});return r.json()})
        .then(function(r){
            if(r.status==='success'){showToast('Registration submitted successfully! Ref: '+r.data.submission_ref,'success');try{localStorage.removeItem(SKEY)}catch(e){}document.getElementById('ngoForm').reset();secFromDir=-1;document.getElementById('directorsContainer').innerHTML=dirHTML(0);document.getElementById('subscribersContainer').innerHTML=subHTML(0);document.getElementById('secFields').style.display='';document.getElementById('secNote').style.display='none';document.querySelectorAll('.is-sec-cb').forEach(function(c){c.disabled=false;c.closest('.role-check-label').style.opacity='1'});attachListeners()}
            else{showToast(r.message||'Something went wrong.','error')}
        })
        .catch(function(err){showToast(err.message||'Network error. Check your connection.','error')})
        .finally(function(){btn.disabled=false;btn.innerHTML='<i class="fa fa-paper-plane"></i> Submit Registration'});
    });

    document.getElementById('ngoForm').addEventListener('focus',function(e){if(e.target.style)e.target.style.borderColor=''},true);

    function showToast(m,t){var el=document.getElementById('toast');el.textContent=m;el.className='toast '+t+' show';setTimeout(function(){el.classList.remove('show')},4000)}

    /* --- Event Delegation for dynamically created elements --- */
    document.getElementById('directorsContainer').addEventListener('change',function(e){
        if(e.target.classList.contains('is-sub-cb')){
            var card=e.target.closest('.dyn-card');
            var idx=parseInt(card.dataset.index);
            handleSubCheck(idx);
        }
        if(e.target.classList.contains('is-sec-cb')){
            var card=e.target.closest('.dyn-card');
            var idx=parseInt(card.dataset.index);
            handleSecCheck(idx);
        }
    });
    document.getElementById('directorsContainer').addEventListener('click',function(e){
        if(e.target.classList.contains('remove-dyn-btn')){removeDyn(e.target)}
    });
    document.getElementById('subscribersContainer').addEventListener('click',function(e){
        if(e.target.classList.contains('remove-dyn-btn')){removeDyn(e.target)}
    });
    document.getElementById('addDirectorBtn').addEventListener('click',addDirector);
    document.getElementById('addSubscriberBtn').addEventListener('click',addSubscriber);

    init();
})();
