(function() {
    'use strict';

    document.addEventListener('paste', function(e) {
        var target = e.target;
        
        // Only intercept pastes on valid input elements
        var tagName = target.tagName.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') return;
        
        var text = (e.clipboardData || window.clipboardData).getData('text');
        
        // Only intercept if the pasted content contains tabs (tabular data).
        // Standard single-cell copies without tabs will paste normally.
        if (!text || text.indexOf('\t') === -1) return;

        // Prevent the default behavior of dumping everything into one input
        e.preventDefault();

        var form = target.closest('form');
        if (!form) return;

        // Gather all editable, visible inputs in DOM order
        var inputs = [];
        var allInputs = form.querySelectorAll('input, textarea');
        
        for (var i = 0; i < allInputs.length; i++) {
            var inp = allInputs[i];
            var type = (inp.type || '').toLowerCase();
            
            // Skip inputs that don't accept pasted text
            if (['hidden', 'checkbox', 'radio', 'button', 'submit', 'reset', 'image', 'file', 'color', 'range'].indexOf(type) !== -1) {
                continue;
            }
            
            // Skip disabled fields
            if (inp.disabled) continue;
            
            // Skip visually hidden inputs (e.g., inside collapsed/hidden sections)
            if (inp.offsetParent === null) continue;

            // Skip readonly fields to preserve linked/system data 
            // (e.g., auto-filled Secretary or Office Address fields)
            if (inp.readOnly) continue;

            inputs.push(inp);
        }

        // Find the starting index (the field the user is currently focused on)
        var startIdx = inputs.indexOf(target);
        if (startIdx === -1) return; // Fallback if target was somehow invalid

        // Parse the tabular data into a flat array of values
        // Normalize line endings for cross-browser compatibility
        var cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        var rows = cleanText.split('\n');
        
        // Excel often adds a trailing newline, resulting in an empty last row
        if (rows.length > 0 && rows[rows.length - 1].trim() === '') {
            rows.pop();
        }

        var values = [];
        for (var r = 0; r < rows.length; r++) {
            // Skip completely empty rows to maintain alignment
            if (rows[r].trim() === '') continue; 
            
            var cols = rows[r].split('\t');
            for (var c = 0; c < cols.length; c++) {
                values.push(cols[c]);
            }
        }

        if (values.length === 0) return;

        // Distribute values to inputs sequentially
        var lastFocusedIdx = startIdx;
        for (var v = 0; v < values.length; v++) {
            var currentIdx = startIdx + v;
            
            // Stop if we run out of fields to fill
            if (currentIdx >= inputs.length) break;

            var inputEl = inputs[currentIdx];
            inputEl.value = values[v];

            // Dispatch events to trigger your existing autosave/validation listeners
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            inputEl.dispatchEvent(new Event('change', { bubbles: true }));
            
            lastFocusedIdx = currentIdx;
        }

        // Focus the last populated field so the user knows where the paste ended
        inputs[lastFocusedIdx].focus();

    });

})();