
(function() {
    var STORAGE_KEY = 'apex_sole_prop_data';

    // --- Mobile Nav ---
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

    // --- Address Sync Logic ---
    var sameAddressCb = document.getElementById('sameAddress');
    var resFields = document.querySelectorAll('.res-addr');
    var bizFields = document.querySelectorAll('.biz-addr');

    function handleSyncCheckbox() {
        if (sameAddressCb.checked) {
            resFields.forEach(function(resInput, index) {
                if (bizFields[index]) {
                    bizFields[index].value = resInput.value;
                    bizFields[index].readOnly = true;
                }
            });
        } else {
            bizFields.forEach(function(bizInput) {
                bizInput.readOnly = false;
            });
        }
        saveToStorage();
    }

    sameAddressCb.addEventListener('change', handleSyncCheckbox);

    resFields.forEach(function(input) {
        input.addEventListener('input', function() {
            if (sameAddressCb.checked) handleSyncCheckbox();
            saveToStorage();
        });
    });

    // --- LocalStorage: Save ---
    function saveToStorage() {
        var data = {};
        data.sameAddress = sameAddressCb.checked;
        data.fields = {};
        var allInputs = document.querySelectorAll('#solePropForm input');
        allInputs.forEach(function(inp) {
            if (inp.type === 'checkbox') return;
            data.fields[inp.name] = inp.value;
        });
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            // Storage full or unavailable — fail silently
        }
    }

    // --- LocalStorage: Restore ---
    function restoreFromStorage() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            var data = JSON.parse(raw);

            // Restore checkbox first
            if (data.sameAddress) {
                sameAddressCb.checked = true;
            }

            // Restore field values
            if (data.fields) {
                Object.keys(data.fields).forEach(function(name) {
                    var inp = document.querySelector('#solePropForm input[name="' + name + '"]');
                    if (inp && data.fields[name]) {
                        inp.value = data.fields[name];
                    }
                });
            }

            // Apply sync state after values are restored
            if (sameAddressCb.checked) {
                handleSyncCheckbox();
            }
        } catch (e) {
            // Corrupted data — fail silently
        }
    }

    // Restore on page load
    restoreFromStorage();

    // Auto-save on every input across the whole form
    var allFormInputs = document.querySelectorAll('#solePropForm input');
    allFormInputs.forEach(function(inp) {
        if (inp.type === 'checkbox') return;
        inp.addEventListener('input', saveToStorage);
        inp.addEventListener('change', saveToStorage);
    });

    // --- Reset Button: Clear form AND storage ---
    var resetBtn = document.querySelector('.btn-reset');
    if (resetBtn) {
        // Remove the inline onclick from HTML — we handle it here
        resetBtn.removeAttribute('onclick');
        resetBtn.addEventListener('click', function() {
            if (confirm('Clear all fields? This cannot be undone.')) {
                document.getElementById('solePropForm').reset();
                sameAddressCb.checked = false;
                handleSyncCheckbox();
                try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
            }
        });
    }

        // --- Form Submission ---
    var form = document.getElementById('solePropForm');
    var submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic Validation
        var isValid = true;
        form.querySelectorAll('[required]').forEach(function(inp) {
            if (!inp.value.trim()) {
                inp.style.borderColor = '#fb5607';
                isValid = false;
            } else {
                inp.style.borderColor = '';
            }
        });

        if (!isValid) {
            showToast('Please fill in all required fields.', 'error');
            var firstError = form.querySelector('[style*="border-color: rgb(251, 86, 7)"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        var formData = new FormData(form);
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

        fetch('https://elevater247.com/abms/api/submit-sole.php', {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if (!response.ok) return response.json().then(function(err) { throw new Error(err.message || 'Server error'); });
            return response.json();
        })
        .then(function(data) {
            if (data.status === 'success') {
                showToast('Registration submitted successfully! Ref: ' + data.data.submission_ref, 'success');
                document.getElementById('solePropForm').reset();
                sameAddressCb.checked = false;
                handleSyncCheckbox();
                try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
            } else {
                showToast(data.message || 'Something went wrong.', 'error');
            }
        })
        .catch(function(error) {
            showToast(error.message || 'Network error. Please check your connection.', 'error');
        })
        .finally(function() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Registration';
        });
    });
    // Remove red border on focus
    form.querySelectorAll('input').forEach(function(inp) {
        inp.addEventListener('focus', function() {
            this.style.borderColor = '';
        });
    });

    // --- Toast Notification ---
    function showToast(message, type) {
        var toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast ' + type + ' show';
        setTimeout(function() { toast.classList.remove('show'); }, 4000);
    }
})();
