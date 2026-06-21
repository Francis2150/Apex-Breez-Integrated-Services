(function() {
    /* =============================================
       STORAGE KEY & STATE
    ============================================= */
    var SKEY = 'apex_ngo_data';
    var secFromDir = -1;

    // Mapping from director field names to secretary field data-f attributes
    var DIR_TO_SEC_MAP = {
        first_name: 'sec_first_name',
        middle_name: 'sec_middle_name',
        surname: 'sec_surname',
        former_name: 'sec_former_name',
        dob: 'sec_dob',
        pob: 'sec_pob',
        nationality: 'sec_nationality',
        occupation: 'sec_occupation',
        contact1: 'sec_contact1',
        contact2: 'sec_contact2',
        email: 'sec_email',
        tin: 'sec_tin',
        ghana_card: 'sec_ghana_card',
        res_gps: 'sec_res_gps',
        res_landmark: 'sec_res_landmark',
        res_house_no: 'sec_res_house_no',
        res_street: 'sec_res_street',
        res_city: 'sec_res_city',
        res_town: 'sec_res_town',
        res_district: 'sec_res_district',
        res_region: 'sec_res_region',
        res_country: 'sec_res_country'
    };

    /* =============================================
       MOBILE NAVIGATION
    ============================================= */
    var toggle = document.getElementById('mobileToggle');
    var nav = document.getElementById('mainNav');
    var overlay = document.getElementById('navOverlay');
    if (toggle && nav && overlay) {
        function openNav() { nav.classList.add('open'); toggle.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
        function closeNav() { nav.classList.remove('open'); toggle.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = ''; }
        toggle.addEventListener('click', function(e) { e.stopPropagation(); nav.classList.contains('open') ? closeNav() : openNav(); });
        overlay.addEventListener('click', closeNav);
        nav.querySelectorAll('a').forEach(function(l) { l.addEventListener('click', function() { if (window.innerWidth <= 991) closeNav(); }); });
        document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); toggle.focus(); } });
        window.addEventListener('resize', function() { if (window.innerWidth > 991) closeNav(); });
    }

    /* =============================================
       FIELD DEFINITIONS
    ============================================= */
    function dirFields() {
        return ['first_name','middle_name','surname','former_name','dob','pob','nationality','occupation','contact1','contact2','email','tin','ghana_card','res_gps','res_landmark','res_house_no','res_street','res_city','res_town','res_district','res_region','res_country'];
    }
    var dirLabels = {
        first_name:'First Name *', middle_name:'Middle Name', surname:'Surname *',
        former_name:'Former Name', dob:'Date of Birth *', pob:'Place of Birth',
        nationality:'Nationality *', occupation:'Occupation', contact1:'Contact 1 *',
        contact2:'Contact 2', email:'Email *', tin:'TIN', ghana_card:'Ghana Card *',
        res_gps:'GPS', res_landmark:'Landmark', res_house_no:'House No.',
        res_street:'Street', res_city:'City', res_town:'Town',
        res_district:'District', res_region:'Region', res_country:'Country'
    };

    function subFields() {
        return ['first_name','middle_name','surname','former_name','dob','pob','nationality','occupation','contact1','contact2','email','tin','ghana_card','res_gps','res_landmark','res_house_no','res_street','res_city','res_town','res_district','res_region'];
    }
    var subLabels = {
        first_name:'First Name *', middle_name:'Middle Name', surname:'Surname *',
        former_name:'Former Name', dob:'Date of Birth *', pob:'Place of Birth',
        nationality:'Nationality *', occupation:'Occupation', contact1:'Contact 1 *',
        contact2:'Contact 2', email:'Email *', tin:'TIN', ghana_card:'Ghana Card *',
        res_gps:'GPS', res_landmark:'Landmark', res_house_no:'House No.',
        res_street:'Street', res_city:'City', res_town:'Town',
        res_district:'District', res_region:'Region'
    };

    /* =============================================
       HTML BUILDERS
    ============================================= */

    // Build a director card
    function dirHTML(i, d) {
        d = d || {};
        var f = dirFields();
        var fullSpan = ['res_country','nationality'];
        var h = '<div class="dyn-card" data-type="director" data-index="' + i + '">';
        h += '<div class="dyn-card-header"><h3><i class="fa fa-user-tie"></i> Director ' + (i + 1) + '</h3>';
        h += '<button type="button" class="remove-dyn-btn" data-action="remove" ' + (i === 0 ? 'style="display:none"' : '') + '>&times;</button></div>';
        h += '<div class="role-checks">';
        h += '<label class="role-check-label"><input type="checkbox" class="is-sub-cb" data-role="sub" ' + (d.is_subscriber ? 'checked' : '') + '> <span>Is also a Subscriber</span></label>';
        h += '<div class="vote-box" style="display:' + (d.is_subscriber ? 'block' : 'none') + '"><label>Voting Rights</label><select class="vote-rights-select"><option value="Yes"' + (d.voting_rights === 'Yes' ? ' selected' : '') + '>Yes</option><option value="No"' + (d.voting_rights === 'No' ? ' selected' : '') + '>No</option></select></div>';
        h += '<label class="role-check-label"><input type="checkbox" class="is-sec-cb" data-role="sec" ' + (d.is_secretary ? 'checked' : '') + '> <span>Is also the Secretary</span></label>';
        h += '</div><div class="form-grid form-grid-2">';
        var types = { dob: 'date' };
        f.forEach(function(k) {
            var req = dirLabels[k].indexOf('*') > -1;
            var lbl = dirLabels[k].replace('*','').trim();
            var full = lbl + (req ? ' <span class="req">*</span>' : '');
            var val = (d[k] !== undefined && d[k] !== null) ? d[k] : '';
            if (k === 'nationality' && !val) val = 'Ghanaian';
            if (k === 'res_country' && !val) val = 'Ghana';
            var span = fullSpan.indexOf(k) > -1 ? 'style="grid-column:1/-1"' : '';
            h += '<div class="form-group" ' + span + '><label>' + full + '</label>';
            h += '<input type="' + (types[k] || 'text') + '" class="form-control dyn-field" data-f="' + k + '" value="' + escAttr(val) + '" ' + (req ? 'required' : '') + '>';
            if (req) h += '<span class="field-error"><i class="fa fa-exclamation-circle"></i> <span>' + lbl + ' is required</span></span>';
            h += '</div>';
        });
        h += '</div></div>';
        return h;
    }

    // Build a subscriber card
    // linked: -1 = manual, >=0 = linked director index
    function subHTML(i, d, linked) {
        d = d || {};
        linked = (linked !== undefined && linked !== null) ? linked : -1;
        var f = subFields();
        var isLinked = linked >= 0;
        var h = '<div class="dyn-card" data-type="subscriber" data-index="' + i + '" data-linked="' + linked + '">';
        if (isLinked) h += '<div class="synced-badge"><i class="fa fa-link"></i> Auto-filled from Director ' + (linked + 1) + '</div>';
        h += '<div class="dyn-card-header"><h3><i class="fa fa-file-signature"></i> Subscriber ' + (i + 1) + '</h3>';
        h += '<button type="button" class="remove-dyn-btn" data-action="remove" ' + (i === 0 ? 'style="display:none"' : '') + '>&times;</button></div>';
        h += '<div class="form-grid form-grid-2">';
        var types = { dob: 'date' };
        var ro = isLinked ? ' readonly' : '';
        var roClass = isLinked ? ' auto-filled' : '';
        f.forEach(function(k) {
            var req = subLabels[k].indexOf('*') > -1;
            var lbl = subLabels[k].replace('*','').trim();
            var full = lbl + (req ? ' <span class="req">*</span>' : '');
            var val = (d[k] !== undefined && d[k] !== null) ? d[k] : '';
            if (k === 'nationality' && !val) val = 'Ghanaian';
            h += '<div class="form-group"><label>' + full + '</label>';
            h += '<input type="' + (types[k] || 'text') + '" class="form-control dyn-field' + roClass + '" data-f="' + k + '" value="' + escAttr(val) + '" ' + (req ? 'required' : '') + ro + '>';
            // Only show inline error for non-linked required fields
            if (req && !isLinked) h += '<span class="field-error"><i class="fa fa-exclamation-circle"></i> <span>' + lbl + ' is required</span></span>';
            h += '</div>';
        });
        h += '</div></div>';
        return h;
    }

    // Escape HTML attribute values
    function escAttr(v) {
        return String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    /* =============================================
       HELPERS
    ============================================= */

    // Safely append HTML string to a container
    function appendHTML(container, html) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        while (wrapper.firstElementChild) {
            container.appendChild(wrapper.firstElementChild);
        }
    }

    // Read all dyn-field values from a card into an object
    function getCardData(card) {
        var data = {};
        card.querySelectorAll('.dyn-field').forEach(function(inp) {
            data[inp.dataset.f] = inp.value;
        });
        return data;
    }

    // Write object values into a card's dyn-fields
    function setCardData(card, data) {
        card.querySelectorAll('.dyn-field').forEach(function(inp) {
            var k = inp.dataset.f;
            if (data[k] !== undefined && data[k] !== null) {
                inp.value = data[k];
            }
        });
    }

    // Re-number cards in a container after removal
    function reindexCards(containerId) {
        var cards = document.querySelectorAll('#' + containerId + ' .dyn-card');
        cards.forEach(function(c, i) {
            c.dataset.index = i;
            var h3 = c.querySelector('h3');
            var type = c.dataset.type;
            var icon = type === 'director' ? 'user-tie' : 'file-signature';
            var label = type === 'director' ? 'Director' : 'Subscriber';
            h3.innerHTML = '<i class="fa fa-' + icon + '"></i> ' + label + ' ' + (i + 1);
            var rmBtn = c.querySelector('.remove-dyn-btn');
            if (rmBtn) rmBtn.style.display = i === 0 ? 'none' : '';
        });
    }

    /* =============================================
       TOAST NOTIFICATIONS
    ============================================= */
    var toastTimer = null;
    function showToast(msg, type) {
        type = type || 'success';
        var el = document.getElementById('toast');
        el.className = 'toast ' + type;
        el.innerHTML = '<i class="fa fa-' + (type === 'success' ? 'check-circle' : 'exclamation-triangle') + '"></i> ' + msg;
        clearTimeout(toastTimer);
        // Force reflow for re-triggering animation
        void el.offsetWidth;
        el.classList.add('show');
        toastTimer = setTimeout(function() { el.classList.remove('show'); }, 3500);
    }

    /* =============================================
       SECRETARY LOGIC (LLC Pattern)
       Fields stay visible. When linked, director
       data is copied in and fields become read-only.
       Qualification field remains always editable.
    ============================================= */
    function applySecState() {
        var note = document.getElementById('secNote');
        var noteText = document.getElementById('secNoteText');
        // All secretary fields that can be auto-filled from a director
        var secFieldKeys = Object.keys(DIR_TO_SEC_MAP);

        if (secFromDir >= 0) {
            var dirCard = document.querySelector('.dyn-card[data-type="director"][data-index="' + secFromDir + '"]');
            if (dirCard) {
                var dirData = getCardData(dirCard);
                secFieldKeys.forEach(function(dirKey) {
                    var secF = DIR_TO_SEC_MAP[dirKey];
                    var inp = document.querySelector('.static-field[data-f="' + secF + '"]');
                    if (inp) {
                        inp.value = dirData[dirKey] || '';
                        inp.readOnly = true;
                        inp.classList.add('auto-filled');
                    }
                });
            }
            // Show note
            note.style.display = 'flex';
            noteText.textContent = 'Secretary information is auto-filled from Director ' + (secFromDir + 1) + '. The Qualification field below can still be edited.';
            // Clear any error states on auto-filled secretary fields
            document.querySelectorAll('#secFields .form-group').forEach(function(g) {
                g.classList.remove('has-error', 'shake');
                var err = g.querySelector('.field-error');
                if (err) err.style.display = 'none';
            });
        } else {
            // Make all auto-fillable secretary fields editable again
            // Keep their current values so user doesn't lose data
            secFieldKeys.forEach(function(dirKey) {
                var secF = DIR_TO_SEC_MAP[dirKey];
                var inp = document.querySelector('.static-field[data-f="' + secF + '"]');
                if (inp) {
                    inp.readOnly = false;
                    inp.classList.remove('auto-filled');
                }
            });
            note.style.display = 'none';
        }
    }

    // Real-time sync: when a director field changes and that director
    // is the secretary, update the corresponding secretary field
    function syncDirectorToSecretary(dirIdx) {
        if (secFromDir !== dirIdx) return;
        var dirCard = document.querySelector('.dyn-card[data-type="director"][data-index="' + dirIdx + '"]');
        if (!dirCard) return;
        var dirData = getCardData(dirCard);
        Object.keys(DIR_TO_SEC_MAP).forEach(function(dirKey) {
            var secF = DIR_TO_SEC_MAP[dirKey];
            var inp = document.querySelector('.static-field[data-f="' + secF + '"]');
            if (inp) inp.value = dirData[dirKey] || '';
        });
    }

    // Handle secretary checkbox toggle on a director
    function handleSecCheck(dirIdx, isChecked) {
        if (isChecked) {
            secFromDir = dirIdx;
            // Disable all other secretary checkboxes
            document.querySelectorAll('.is-sec-cb').forEach(function(cb, i) {
                if (i !== dirIdx) {
                    cb.checked = false;
                    cb.disabled = true;
                    cb.closest('.role-check-label').style.opacity = '0.4';
                }
            });
        } else {
            secFromDir = -1;
            // Re-enable all secretary checkboxes
            document.querySelectorAll('.is-sec-cb').forEach(function(cb) {
                cb.disabled = false;
                cb.closest('.role-check-label').style.opacity = '1';
            });
        }
        applySecState();
        save();
    }

    /* =============================================
       SUBSCRIBER LOGIC (LLC Rebuild Pattern)
       Slot-based mapping: Director N -> Subscriber N.
       Linked subscribers always come first in order,
       then manual subscribers follow.
    ============================================= */

    // Rebuild the entire subscribers section.
    // 1. Collect all current manual subscriber data (data-linked="-1")
    // 2. Clear container
    // 3. For each director (in order), if "Is also a Subscriber" is
    //    checked, create a linked subscriber card at the next position
    // 4. Append manual subscribers after linked ones
    // 5. If nothing exists, create one empty manual subscriber
    function rebuildSubscribers() {
        var sc = document.getElementById('subscribersContainer');

        // Step 1: preserve manual subscriber data before clearing
        var manualSubs = [];
        sc.querySelectorAll('.dyn-card').forEach(function(card) {
            var linked = parseInt(card.dataset.linked);
            if (isNaN(linked) || linked < 0) {
                manualSubs.push(getCardData(card));
            }
        });

        // Step 2: clear
        sc.innerHTML = '';
        var idx = 0;

        // Step 3: linked subscribers in director order
        var dirCards = document.querySelectorAll('#directorsContainer .dyn-card');
        dirCards.forEach(function(dirCard, dirIdx) {
            var cb = dirCard.querySelector('.is-sub-cb');
            if (cb && cb.checked) {
                var dirData = getCardData(dirCard);
                appendHTML(sc, subHTML(idx, dirData, dirIdx));
                idx++;
            }
        });

        // Step 4: manual subscribers
        manualSubs.forEach(function(msd) {
            appendHTML(sc, subHTML(idx, msd, -1));
            idx++;
        });

        // Step 5: ensure at least one subscriber exists
        if (idx === 0) {
            appendHTML(sc, subHTML(0, {}, -1));
        }
    }

    // Real-time sync: when a director field changes and that director
    // is a subscriber, update the linked subscriber card's fields
    function syncDirectorToSubscriber(dirIdx) {
        var dirCard = document.querySelector('.dyn-card[data-type="director"][data-index="' + dirIdx + '"]');
        if (!dirCard) return;
        var cb = dirCard.querySelector('.is-sub-cb');
        if (!cb || !cb.checked) return;

        var dirData = getCardData(dirCard);
        var subCard = document.querySelector('.dyn-card[data-type="subscriber"][data-linked="' + dirIdx + '"]');
        if (subCard) {
            setCardData(subCard, dirData);
        }
    }

    // Handle subscriber checkbox toggle on a director
    function handleSubCheck(dirIdx, isChecked) {
        var card = document.querySelector('.dyn-card[data-type="director"][data-index="' + dirIdx + '"]');
        var voteBox = card.querySelector('.vote-box');
        voteBox.style.display = isChecked ? 'block' : 'none';
        rebuildSubscribers();
        save();
    }

    /* =============================================
       ADD / REMOVE
    ============================================= */
    function addDirector() {
        var c = document.getElementById('directorsContainer');
        var n = c.querySelectorAll('.dyn-card').length;
        appendHTML(c, dirHTML(n));
        attachListeners();
        save();
    }

    function addManualSubscriber() {
        var c = document.getElementById('subscribersContainer');
        var n = c.querySelectorAll('.dyn-card').length;
        appendHTML(c, subHTML(n, {}, -1));
        attachListeners();
        save();
    }

    function removeDyn(btn) {
        if (!confirm('Remove this section?')) return;
        var card = btn.closest('.dyn-card');
        var type = card.dataset.type;
        var idx = parseInt(card.dataset.index);

        card.remove();

        if (type === 'director') {
            // Handle secretary link
            if (secFromDir === idx) {
                secFromDir = -1;
                applySecState();
                document.querySelectorAll('.is-sec-cb').forEach(function(cb) {
                    cb.disabled = false;
                    cb.closest('.role-check-label').style.opacity = '1';
                });
            } else if (secFromDir > idx) {
                secFromDir--;
            }

            // Rebuild subscribers (handles linked slot re-mapping)
            rebuildSubscribers();
            reindexCards('directorsContainer');
        } else {
            reindexCards('subscribersContainer');
        }

        attachListeners();
        save();
    }

    // Global references for HTML onclick attributes
    window.addDirector = addDirector;
    window.addSubscriber = addManualSubscriber;

    /* =============================================
       PERSISTENCE: SAVE & RESTORE
    ============================================= */
    function save() {
        var data = {
            static: {},
            directors: [],
            sec_from_director: secFromDir,
            secretary: {},
            manual_subscribers: []
        };

        // Save all static fields (org info, office details) — skip secretary fields
        document.querySelectorAll('.static-field').forEach(function(inp) {
            var key = inp.dataset.f;
            if (key && key.indexOf('sec_') !== 0) {
                data.static[key] = inp.value;
            }
        });

        // Save directors
        document.querySelectorAll('#directorsContainer .dyn-card').forEach(function(card) {
            var d = getCardData(card);
            d.is_subscriber = card.querySelector('.is-sub-cb').checked;
            d.is_secretary = card.querySelector('.is-sec-cb').checked;
            d.voting_rights = card.querySelector('.vote-rights-select').value || '';
            data.directors.push(d);
        });

        // Save secretary manual data only if not linked
        if (secFromDir < 0) {
            document.querySelectorAll('#secFields .static-field').forEach(function(inp) {
                var key = inp.dataset.f.replace('sec_', '');
                data.secretary[key] = inp.value;
            });
        }

        // Save ONLY manual (unlinked) subscribers
        document.querySelectorAll('#subscribersContainer .dyn-card').forEach(function(card) {
            var linked = parseInt(card.dataset.linked);
            if (isNaN(linked) || linked < 0) {
                data.manual_subscribers.push(getCardData(card));
            }
        });

        try { localStorage.setItem(SKEY, JSON.stringify(data)); } catch(e) {}
    }

    function restore() {
        var saved = null;
        try { saved = JSON.parse(localStorage.getItem(SKEY)); } catch(e) {}

        if (!saved || !saved.directors || saved.directors.length === 0) {
            // No saved data — start fresh
            appendHTML(document.getElementById('directorsContainer'), dirHTML(0));
            rebuildSubscribers();
            return;
        }

        // Restore static fields
        if (saved.static) {
            Object.keys(saved.static).forEach(function(k) {
                var inp = document.querySelector('.static-field[data-f="' + k + '"]');
                if (inp) inp.value = saved.static[k] || '';
            });
        }

        // Restore directors
        var dc = document.getElementById('directorsContainer');
        dc.innerHTML = '';
        saved.directors.forEach(function(dd, i) {
            appendHTML(dc, dirHTML(i, dd));
        });

        // Restore secretary state
        if (saved.sec_from_director >= 0) {
            secFromDir = saved.sec_from_director;
            // Check/disable secretary checkboxes accordingly
            document.querySelectorAll('.is-sec-cb').forEach(function(cb, i) {
                if (i === secFromDir) {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                    cb.disabled = true;
                    cb.closest('.role-check-label').style.opacity = '0.4';
                }
            });
        } else {
            secFromDir = -1;
        }
        applySecState();

        // Restore manual secretary data if not linked
        if (saved.sec_from_director < 0 && saved.secretary) {
            Object.keys(saved.secretary).forEach(function(k) {
                var inp = document.querySelector('.static-field[data-f="sec_' + k + '"]');
                if (inp) inp.value = saved.secretary[k] || '';
            });
        }

        // Rebuild subscribers: linked from directors + manual from saved
        rebuildSubscribers();

        // Now fill in the manual subscriber data into the correct cards
        if (saved.manual_subscribers && saved.manual_subscribers.length > 0) {
            // Count how many linked subscribers were created
            var linkedCount = 0;
            document.querySelectorAll('#directorsContainer .dyn-card').forEach(function(c) {
                if (c.querySelector('.is-sub-cb').checked) linkedCount++;
            });
            var subCards = document.querySelectorAll('#subscribersContainer .dyn-card');
            saved.manual_subscribers.forEach(function(msd, i) {
                var targetCard = subCards[linkedCount + i];
                if (targetCard) setCardData(targetCard, msd);
            });
        }
    }

    /* =============================================
       VALIDATION
    ============================================= */
    function validateForm() {
        var valid = true;
        var firstError = null;

        // Clear all previous errors
        document.querySelectorAll('.form-group').forEach(function(g) {
            g.classList.remove('has-error', 'shake');
            var err = g.querySelector('.field-error');
            if (err) err.style.display = 'none';
        });

        // Validate static required fields
        document.querySelectorAll('.static-field[required]').forEach(function(inp) {
            // Skip secretary fields if linked to a director
            if (secFromDir >= 0 && inp.dataset.f && inp.dataset.f.indexOf('sec_') === 0) return;
            if (!inp.value.trim()) {
                markError(inp);
                valid = false;
                if (!firstError) firstError = inp;
            }
            // Email format check
            if (inp.type === 'email' && inp.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
                markError(inp);
                valid = false;
                if (!firstError) firstError = inp;
            }
        });

        // Validate director required fields
        document.querySelectorAll('#directorsContainer .dyn-card').forEach(function(card) {
            card.querySelectorAll('.dyn-field[required]').forEach(function(inp) {
                if (!inp.value.trim()) {
                    markError(inp);
                    valid = false;
                    if (!firstError) firstError = inp;
                }
                if (inp.type === 'email' && inp.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
                    markError(inp);
                    valid = false;
                    if (!firstError) firstError = inp;
                }
            });
        });

        // Validate manual (unlinked) subscriber required fields
        document.querySelectorAll('#subscribersContainer .dyn-card').forEach(function(card) {
            var linked = parseInt(card.dataset.linked);
            if (!isNaN(linked) && linked >= 0) return; // Skip linked subscribers
            card.querySelectorAll('.dyn-field[required]').forEach(function(inp) {
                if (!inp.value.trim()) {
                    markError(inp);
                    valid = false;
                    if (!firstError) firstError = inp;
                }
                if (inp.type === 'email' && inp.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
                    markError(inp);
                    valid = false;
                    if (!firstError) firstError = inp;
                }
            });
        });

        // Scroll to first error
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }

        return valid;
    }

    function markError(inp) {
        var group = inp.closest('.form-group');
        if (!group) return;
        group.classList.add('has-error', 'shake');
        var err = group.querySelector('.field-error');
        if (err) err.style.display = 'block';
        // Remove shake after animation
        setTimeout(function() { group.classList.remove('shake'); }, 500);
    }

    /* =============================================
       EVENT LISTENERS
    ============================================= */
    function attachListeners() {
        // Remove buttons (event delegation on containers)
        document.getElementById('directorsContainer').addEventListener('click', function(e) {
            var btn = e.target.closest('[data-action="remove"]');
            if (btn) removeDyn(btn);
        });
        document.getElementById('subscribersContainer').addEventListener('click', function(e) {
            var btn = e.target.closest('[data-action="remove"]');
            if (btn) removeDyn(btn);
        });

        // Director role checkboxes
        document.querySelectorAll('#directorsContainer .is-sub-cb').forEach(function(cb) {
            // Remove old listeners by cloning (simple approach)
            var newCb = cb.cloneNode(true);
            cb.parentNode.replaceChild(newCb, cb);
            newCb.addEventListener('change', function() {
                var dirIdx = parseInt(this.closest('.dyn-card').dataset.index);
                handleSubCheck(dirIdx, this.checked);
            });
        });
        document.querySelectorAll('#directorsContainer .is-sec-cb').forEach(function(cb) {
            var newCb = cb.cloneNode(true);
            cb.parentNode.replaceChild(newCb, cb);
            newCb.addEventListener('change', function() {
                var dirIdx = parseInt(this.closest('.dyn-card').dataset.index);
                handleSecCheck(dirIdx, this.checked);
            });
        });

        // Voting rights selects
        document.querySelectorAll('.vote-rights-select').forEach(function(sel) {
            var newSel = sel.cloneNode(true);
            sel.parentNode.replaceChild(newSel, sel);
            newSel.addEventListener('change', function() {
                save();
            });
        });

        // Director dyn-fields: real-time sync + save
        document.querySelectorAll('#directorsContainer .dyn-field').forEach(function(inp) {
            var newInp = inp.cloneNode(true);
            inp.parentNode.replaceChild(newInp, inp);
            newInp.addEventListener('input', function() {
                var dirIdx = parseInt(this.closest('.dyn-card').dataset.index);
                syncDirectorToSecretary(dirIdx);
                syncDirectorToSubscriber(dirIdx);
                save();
            });
        });

        // Subscriber dyn-fields: save (only manual ones are editable)
        document.querySelectorAll('#subscribersContainer .dyn-field').forEach(function(inp) {
            if (inp.readOnly) return; // Skip linked/read-only fields
            var newInp = inp.cloneNode(true);
            inp.parentNode.replaceChild(newInp, inp);
            newInp.addEventListener('input', function() {
                save();
            });
        });

        // Static fields (org info, office details, secretary)
        document.querySelectorAll('.static-field').forEach(function(inp) {
            if (inp.readOnly) return;
            // Only add listener once — use a flag
            if (inp._listenerAttached) return;
            inp._listenerAttached = true;
            inp.addEventListener('input', function() {
                save();
            });
            inp.addEventListener('change', function() {
                save();
            });
        });
    }

    /* =============================================
       RESET BUTTON
       Clears localStorage and resets the entire form
       to its initial empty state.
    ============================================= */
    document.getElementById('resetBtn').addEventListener('click', function() {
        if (!confirm('Are you sure you want to reset the entire form? All data will be lost.')) return;

        // Clear persisted data
        try { localStorage.removeItem(SKEY); } catch(e) {}

        // Reset state
        secFromDir = -1;

        // Clear dynamic containers
        document.getElementById('directorsContainer').innerHTML = '';
        document.getElementById('subscribersContainer').innerHTML = '';

        // Reset all static fields to defaults
        document.querySelectorAll('.static-field').forEach(function(inp) {
            inp.readOnly = false;
            inp.classList.remove('auto-filled');
            // Keep default values for nationality/country
            if (inp.dataset.f === 'sec_nationality') { inp.value = 'Ghanaian'; return; }
            if (inp.dataset.f === 'sec_res_country') { inp.value = 'Ghana'; return; }
            inp.value = '';
        });

        // Rebuild initial cards
        appendHTML(document.getElementById('directorsContainer'), dirHTML(0));
        rebuildSubscribers();

        // Reset secretary state
        document.querySelectorAll('.is-sec-cb').forEach(function(cb) {
            cb.disabled = false;
            cb.closest('.role-check-label').style.opacity = '1';
        });
        applySecState();

        // Clear all error states
        document.querySelectorAll('.form-group').forEach(function(g) {
            g.classList.remove('has-error', 'shake');
            var err = g.querySelector('.field-error');
            if (err) err.style.display = 'none';
        });

        attachListeners();
        showToast('Form has been reset successfully.', 'success');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* =============================================
       FORM SUBMIT
    ============================================= */
    document.getElementById('ngoForm').addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fill in all required fields before submitting.', 'error');
            return;
        }

        var data = collectFormData();
        var btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

        fetch('https://elevater247.com/abms/api/submit-ngo.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function(r) {
            if (!r.ok) return r.json().then(function(e) { throw new Error(e.message || 'Server error'); });
            return r.json();
        })
        .then(function(r) {
            if (r.status === 'success') {
                showToast('Registration submitted successfully! Ref: ' + r.data.submission_ref, 'success');

                // Clear saved data
                try { localStorage.removeItem(SKEY); } catch(e) {}

                // Reset state
                secFromDir = -1;

                // Clear dynamic containers
                document.getElementById('directorsContainer').innerHTML = '';
                document.getElementById('subscribersContainer').innerHTML = '';

                // Rebuild initial empty cards
                appendHTML(document.getElementById('directorsContainer'), dirHTML(0));
                rebuildSubscribers();

                // Reset all static fields
                document.querySelectorAll('.static-field').forEach(function(inp) {
                    inp.readOnly = false;
                    inp.classList.remove('auto-filled');
                    if (inp.dataset.f === 'sec_nationality') { inp.value = 'Ghanaian'; return; }
                    if (inp.dataset.f === 'sec_res_country') { inp.value = 'Ghana'; return; }
                    inp.value = '';
                });

                // Re-enable all secretary checkboxes
                document.querySelectorAll('.is-sec-cb').forEach(function(cb) {
                    cb.disabled = false;
                    cb.closest('.role-check-label').style.opacity = '1';
                });
                applySecState();

                // Clear all error states
                document.querySelectorAll('.form-group').forEach(function(g) {
                    g.classList.remove('has-error', 'shake');
                });
                document.querySelectorAll('.field-error').forEach(function(e) {
                    e.style.display = 'none';
                });

                attachListeners();
            } else {
                showToast(r.message || 'Something went wrong.', 'error');
            }
        })
        .catch(function(err) {
            showToast(err.message || 'Network error. Check your connection.', 'error');
        })
        .finally(function() {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Registration';
        });
    });

    /* =============================================
       COLLECT FORM DATA (Structured for PHP)
    ============================================= */
    function collectFormData() {
        var data = { org: {}, office: {}, directors: [], secretary: {}, subscribers: [] };

        // Organization info fields
        var orgKeys = [
            'org_name','presented_by','presenter_tin','activities','employees'
        ];

        // Office detail fields
        var officeKeys = [
            'off_gps','off_landmark','off_building_no','off_town','off_street',
            'off_city','off_district','off_region','off_postal_no','off_postal_town',
            'off_postal_region','off_contact1','off_contact2','off_email'
        ];

        // Write org fields into data.org
        orgKeys.forEach(function(k) {
            var inp = document.querySelector('.static-field[data-f="' + k + '"]');
            if (inp) data.org[k] = inp.value;
        });

        // Write office fields into data.office — strip the "off_" prefix
        officeKeys.forEach(function(k) {
            var inp = document.querySelector('.static-field[data-f="' + k + '"]');
            if (inp) data.office[k.replace('off_', '')] = inp.value;
        });

        // Directors
        document.querySelectorAll('#directorsContainer .dyn-card').forEach(function(card) {
            var d = getCardData(card);
            d.is_subscriber = card.querySelector('.is-sub-cb').checked;
            d.is_secretary = card.querySelector('.is-sec-cb').checked;
            d.voting_rights = card.querySelector('.vote-rights-select').value || '';
            data.directors.push(d);
        });

        // Secretary
        document.querySelectorAll('#secFields .static-field').forEach(function(inp) {
            var key = inp.dataset.f.replace('sec_', '');
            data.secretary[key] = inp.value;
        });
        data.secretary._linked_to_director = secFromDir;

        // Subscribers
        document.querySelectorAll('#subscribersContainer .dyn-card').forEach(function(card) {
            var s = getCardData(card);
            s._linked_to_director = parseInt(card.dataset.linked);
            data.subscribers.push(s);
        });

        return data;
    }

    /* =============================================
       INITIALIZATION
    ============================================= */
    restore();
    attachListeners();

})();