/**
 * VetSalud - Menú de navegación responsive y resaltado de página activa
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Manejo del botón hamburguesa para móviles
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function () {
            navMenu.classList.toggle('activo-mobile');
            const isExpanded = navMenu.classList.contains('activo-mobile');
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
            hamburgerBtn.setAttribute('aria-label', isExpanded ? 'Cerrar menú' : 'Abrir menú');
        });

        // Cerrar el menú al hacer clic en un enlace
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('activo-mobile');
                if (hamburgerBtn) {
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
                }
            });
        });
    }

    // 2. Resaltar visualmente la página activa en el menú
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.menu a');

    links.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Quitar cualquier clase activo previa
        link.classList.remove('activo');

        // Comparar nombre de archivo
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('activo');
            link.setAttribute('aria-current', 'page');
        }
    });
});
