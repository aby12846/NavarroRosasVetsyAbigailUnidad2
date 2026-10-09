/**
 * VetSalud - Lógica interactiva para la página de Enfermedades Comunes
 * - Filtrado por especie (Perros / Gatos / Todas)
 * - Despliegue de información detallada ("Ver detalles")
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Alternar visualización de detalles desplegables
    const botonesDetalles = document.querySelectorAll('.btn-detalles');

    botonesDetalles.forEach(boton => {
        boton.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const contenedorDetalles = document.getElementById(targetId);

            if (contenedorDetalles) {
                const estaAbierto = contenedorDetalles.classList.contains('abierto');

                if (estaAbierto) {
                    contenedorDetalles.classList.remove('abierto');
                    this.textContent = 'Ver detalles →';
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    contenedorDetalles.classList.add('abierto');
                    this.textContent = 'Ocultar detalles ↑';
                    this.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });

    // 2. Filtro por especie (Todas, Perros, Gatos)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tarjetasEnfermedades = document.querySelectorAll('.tarjeta-enfermedad');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Cambiar clase activo entre los botones
            tabBtns.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');

            const filtro = this.getAttribute('data-filtro');

            tarjetasEnfermedades.forEach(tarjeta => {
                const especie = tarjeta.getAttribute('data-especie');

                if (filtro === 'todas' || especie === filtro) {
                    tarjeta.style.display = 'flex';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });
});
