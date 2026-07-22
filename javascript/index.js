(function () {

    /* =============================================
       MOBILE NAVIGATION
       ============================================= */
    var toggle = document.getElementById('mobileToggle');
    var nav = document.getElementById('mainNav');
    var overlay = document.getElementById('navOverlay');

    if (toggle && nav && overlay) {

        function openNav() {
            nav.classList.add('open');
            toggle.classList.add('active');
            overlay.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeNav() {
            nav.classList.remove('open');
            toggle.classList.remove('active');
            overlay.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        /* Hamburger Toggle */
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (nav.classList.contains('open')) {
                closeNav();
            } else {
                openNav();
            }
        });

        /* Overlay Close */
        overlay.addEventListener('click', function () {
            closeNav();
        });

        /* Mobile Navigation Links — close panel on tap */
        var navLinks = nav.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function () {
                if (window.innerWidth <= 991) {
                    closeNav();
                }
            });
        }

        /* ESC Key to close */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                closeNav();
                toggle.focus();
            }
        });

        /* Reset on desktop resize */
        window.addEventListener('resize', function () {
            if (window.innerWidth > 991) {
                closeNav();
            }
        });
    }

    /* =============================================
       GO TOP BUTTON
       ============================================= */
    var goTop = document.getElementById('goTop');
    if (goTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                goTop.classList.add('visible');
            } else {
                goTop.classList.remove('visible');
            }
        });
        goTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =============================================
       HEADER SHADOW ON SCROLL
       ============================================= */
    var header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 80) {
                header.style.boxShadow = '0 4px 20px rgba(11,31,59,0.08)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

})();