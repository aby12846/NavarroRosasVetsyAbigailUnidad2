/**
 * VetSalud - Lógica del formulario de opiniones y experiencias
 * - Validación de campos en tiempo de envío
 * - Almacenamiento local en localStorage
 * - Renderizado seguro usando DOM (evita vulnerabilidades XSS)
 * - Funcionalidad para eliminar opiniones guardadas
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-opinion');
    const inputNombre = document.getElementById('nombre');
    const selectMascota = document.getElementById('mascota');
    const textareaOpinion = document.getElementById('opinion');
    const listaOpiniones = document.getElementById('opiniones-lista');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    // Mensajes de error de validación
    const errorNombre = document.getElementById('error-nombre');
    const errorMascota = document.getElementById('error-mascota');
    const errorOpinion = document.getElementById('error-opinion');

    // Clave para localStorage
    const STORAGE_KEY = 'vetsalud_opiniones';

    // Cargar opiniones predeterminadas de demostración si localStorage está vacío por primera vez
    const opinionesEjemplo = [
        {
            id: 'ejemplo-1',
            nombre: 'María López',
            mascota: 'perro',
            opinion: 'La sección de prevención sobre vacunas me ayudó mucho a entender el esquema para mi cachorro Toby. ¡Excelente iniciativa!',
            fecha: '08/10/2026',
            esEjemplo: true
        },
        {
            id: 'ejemplo-2',
            nombre: 'Carlos Ramírez',
            mascota: 'gato',
            opinion: 'Mi gata Luna solía beber muy poca agua. Gracias a los consejos de cuidados compré una fuente de agua y ahora está mucho más hidratada.',
            fecha: '09/10/2026',
            esEjemplo: true
        }
    ];

    // Obtener opiniones guardadas
    function obtenerOpinionesGuardadas() {
        const datos = localStorage.getItem(STORAGE_KEY);
        if (!datos) {
            // Inicializar con ejemplos
            localStorage.setItem(STORAGE_KEY, JSON.stringify(opinionesEjemplo));
            return opinionesEjemplo;
        }
        try {
            return JSON.parse(datos);
        } catch (e) {
            console.error('Error al leer localStorage:', e);
            return opinionesEjemplo;
        }
    }

    // Guardar lista en localStorage
    function guardarOpiniones(opiniones) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(opiniones));
    }

    // Renderizar opiniones en el DOM de forma segura
    function renderizarOpiniones() {
        const opiniones = obtenerOpinionesGuardadas();

        // Limpiar lista actual
        listaOpiniones.innerHTML = '';

        if (opiniones.length === 0) {
            if (mensajeVacio) mensajeVacio.style.display = 'block';
            return;
        }

        if (mensajeVacio) mensajeVacio.style.display = 'none';

        opiniones.forEach(op => {
            // Crear elementos DOM de manera segura (textContent evita XSS)
            const tarjeta = document.createElement('article');
            tarjeta.className = 'tarjeta-opinion';

            // Cabecera: Autor e Insignia Mascota
            const cabecera = document.createElement('div');
            cabecera.className = 'opinion-cabecera';

            const autor = document.createElement('span');
            autor.className = 'opinion-autor';
            autor.textContent = op.nombre;

            const insignia = document.createElement('span');
            insignia.className = 'insignia';

            let iconoMascota = '🐾';
            let textoMascota = 'Mascota';

            if (op.mascota === 'perro') {
                insignia.classList.add('insignia-perro');
                iconoMascota = '🐶';
                textoMascota = 'Perro';
            } else if (op.mascota === 'gato') {
                insignia.classList.add('insignia-gato');
                iconoMascota = '🐱';
                textoMascota = 'Gato';
            } else {
                insignia.classList.add('insignia-prevencion');
                iconoMascota = '🐾';
                textoMascota = 'Otra mascota';
            }
            insignia.textContent = `${iconoMascota} ${textoMascota}`;

            cabecera.appendChild(autor);
            cabecera.appendChild(insignia);

            // Cuerpo: Texto de la opinión
            const texto = document.createElement('p');
            texto.className = 'opinion-texto';
            texto.textContent = op.opinion;

            // Pie: Fecha y Botón Eliminar
            const pie = document.createElement('div');
            pie.className = 'opinion-pie';

            const fecha = document.createElement('span');
            fecha.className = 'opinion-fecha';
            fecha.textContent = op.fecha;

            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'boton-eliminar';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.setAttribute('aria-label', `Eliminar opinión de ${op.nombre}`);
            btnEliminar.addEventListener('click', function () {
                eliminarOpinion(op.id);
            });

            pie.appendChild(fecha);
            pie.appendChild(btnEliminar);

            tarjeta.appendChild(cabecera);
            tarjeta.appendChild(texto);
            tarjeta.appendChild(pie);

            listaOpiniones.appendChild(tarjeta);
        });
    }

    // Eliminar una opinión por su ID
    function eliminarOpinion(id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta opinión guardada?')) {
            let opiniones = obtenerOpinionesGuardadas();
            opiniones = opiniones.filter(op => op.id !== id);
            guardarOpiniones(opiniones);
            renderizarOpiniones();
        }
    }

    // Limpiar errores visuales
    function limpiarErrores() {
        if (errorNombre) errorNombre.style.display = 'none';
        if (errorMascota) errorMascota.style.display = 'none';
        if (errorOpinion) errorOpinion.style.display = 'none';
    }

    // Manejar envío del formulario
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            limpiarErrores();

            let esValido = true;

            const nombreVal = inputNombre.value.trim();
            const mascotaVal = selectMascota.value;
            const opinionVal = textareaOpinion.value.trim();

            // Validar Nombre
            if (nombreVal.length < 2) {
                if (errorNombre) {
                    errorNombre.textContent = 'Por favor ingresa un nombre válido (mínimo 2 caracteres).';
                    errorNombre.style.display = 'block';
                }
                esValido = false;
            }

            // Validar Mascota
            if (!mascotaVal) {
                if (errorMascota) {
                    errorMascota.textContent = 'Por favor selecciona el tipo de mascota.';
                    errorMascota.style.display = 'block';
                }
                esValido = false;
            }

            // Validar Opinión
            if (opinionVal.length < 10) {
                if (errorOpinion) {
                    errorOpinion.textContent = 'La opinión debe contener al menos 10 caracteres explicativos.';
                    errorOpinion.style.display = 'block';
                }
                esValido = false;
            }

            if (!esValido) return;

            // Formatear fecha actual
            const hoy = new Date();
            const fechaFormateada = hoy.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            // Crear objeto de nueva opinión
            const nuevaOpinion = {
                id: 'op-' + Date.now(),
                nombre: nombreVal,
                mascota: mascotaVal,
                opinion: opinionVal,
                fecha: fechaFormateada,
                esEjemplo: false
            };

            // Guardar y actualizar
            const opiniones = obtenerOpinionesGuardadas();
            opiniones.unshift(nuevaOpinion); // Agregar al inicio
            guardarOpiniones(opiniones);

            // Limpiar formulario y renderizar
            form.reset();
            renderizarOpiniones();

            // Scroll suave a la lista de opiniones
            listaOpiniones.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Cargar opiniones al iniciar
    renderizarOpiniones();
});
