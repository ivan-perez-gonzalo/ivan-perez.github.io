document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Opcional: Cerrar menú si fuera móvil (no implementado en este CSS básico)
            // const navLinks = document.querySelector('.nav-links');
            // if (navLinks.classList.contains('active')) {
            //     navLinks.classList.remove('active');
            // }
        });
    });

    // Añadir clase 'active' al enlace de navegación actual
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavMenu() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80; // Ajusta 80px para el header fijo
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    }
    document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('scroll', highlightNavMenu);
    highlightNavMenu(); // Llamar al cargar para resaltar la sección inicial

    // 1. Definición de los 10 propósitos
    const goals = [
        { id: 'gym', title: '💪 Ir al Gimnasio', target: 200 },
        { id: 'run', title: '🏃 Salir a Correr', target: 50 },
        { id: 'books', title: '📚 Leer Libros', target: 12 },
        { id: 'water', title: '💧 Beber 2L Agua', target: 365 },
        { id: 'meditate', title: '🧘 Meditar', target: 100 },
        { id: 'code', title: '💻 Aprender Código', target: 150 },
        { id: 'travel', title: '✈️ Viajes/Excursiones', target: 6 },
        { id: 'savings', title: '💰 Ahorro Mensual', target: 12 },
        { id: 'healthy', title: '🥗 Comer Sano', target: 250 },
        { id: 'digital-detox', title: '📵 Desconexión Móvil', target: 300 }
    ];

    const container = document.getElementById('counters-container');

    // 2. Función para cargar datos de localStorage o iniciar en 0
    function getProgress(id) {
        return parseInt(localStorage.getItem('goal_' + id)) || 0;
    }

    // 3. Función para guardar datos
    function saveProgress(id, value) {
        localStorage.setItem('goal_' + id, value);
    }

    // 4. Función para crear las tarjetas en el HTML
    function renderCounters() {
        container.innerHTML = ''; // Limpiar
        goals.forEach(goal => {
            const current = getProgress(goal.id);
            const percentage = Math.min((current / goal.target) * 100, 100);

            const card = document.createElement('div');
            card.className = 'counter-card';
            card.innerHTML = `
                <h3>${goal.title}</h3>
                <span class="counter-value" id="val-${goal.id}">${current} / ${goal.target}</span>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" id="bar-${goal.id}" style="width: ${percentage}%"></div>
                </div>
            `;

            // Evento de clic para incrementar
            card.addEventListener('click', () => {
                let count = getProgress(goal.id);
                if (count < goal.target) {
                    count++;
                    saveProgress(goal.id, count);
                    updateUI(goal.id, count, goal.target);
                }
            });

            container.appendChild(card);
        });
    }

    // 5. Función para actualizar la interfaz sin recargar todo
    function updateUI(id, current, target) {
        document.getElementById(`val-${id}`).innerText = `${current} / ${target}`;
        const percentage = Math.min((current / target) * 100, 100);
        document.getElementById(`bar-${id}`).style.width = `${percentage}%`;
    }

    // Botón de Reinicio
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('¿Seguro que quieres reiniciar todos tus propósitos a cero?')) {
            goals.forEach(goal => localStorage.removeItem('goal_' + goal.id));
            renderCounters();
        }
    });

    renderCounters();

});
