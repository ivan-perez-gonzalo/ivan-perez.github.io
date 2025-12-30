document.addEventListener('DOMContentLoaded', () => {
    // === 1. LÓGICA DE NAVEGACIÓN Y SCROLL ===
    
    // Smooth scrolling para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Añadir clase 'active' al enlace de navegación actual
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavMenu() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80; // Ajusta 80px para el header fijo
            if (window.scrollY >= sectionTop) {
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

    window.addEventListener('scroll', highlightNavMenu);
    highlightNavMenu(); // Llamar al cargar para resaltar la sección inicial


// === 2. LÓGICA DE LOS CONTADORES CIRCULARES (PROPÓSITOS 2026) ===

    // Definición de los 10 propósitos
    const goals = [
        { id: 'gym', title: '💪 Gimnasio', target: 200 },
        { id: 'run', title: '🏃 Correr', target: 50 },
        { id: 'books', title: '📚 Leer Libros', target: 12 },
        { id: 'water', title: '💧 2L Agua', target: 365 },
        { id: 'meditate', title: '🧘 Meditar', target: 100 },
        { id: 'code', title: '💻 Código', target: 150 },
        { id: 'travel', title: '✈️ Viajes', target: 6 },
        { id: 'savings', title: '💰 Ahorro', target: 12 },
        { id: 'healthy', title: '🥗 Comer Sano', target: 250 },
        { id: 'digital-detox', title: '📵 Desconexión', target: 300 }
    ];

    const container = document.getElementById('counters-container');

    // --- Constantes para el cálculo del círculo SVG ---
    // Radio del círculo (debe coincidir con el 'r' en el HTML de abajo)
    const radius = 65; 
    // Circunferencia = 2 * pi * radio
    const circumference = 2 * Math.PI * radius;


    // Funciones de localStorage (igual que antes)
    function getProgress(id) {
        return parseInt(localStorage.getItem('goal_' + id)) || 0;
    }

    function saveProgress(id, value) {
        localStorage.setItem('goal_' + id, value);
    }

    // --- Nueva función para crear las tarjetas circulares ---
    function renderCounters() {
        if (!container) return;
        
        container.innerHTML = ''; // Limpiar
        goals.forEach(goal => {
            const current = getProgress(goal.id);

            const card = document.createElement('div');
            card.className = 'counter-card';

            // Aquí generamos el SVG. Fíjate en las etiquetas <circle>
            card.innerHTML = `
                <div class="circular-progress-container">
                    <svg class="progress-ring-svg" width="150" height="150" viewBox="0 0 150 150">
                        <circle class="progress-ring-circle-bg"
                            cx="75" cy="75" r="${radius}"></circle>
                        <circle class="progress-ring-circle" id="circle-${goal.id}"
                            cx="75" cy="75" r="${radius}"
                            style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};">
                        </circle>
                    </svg>
                    <div class="counter-text-content">
                        <h3>${goal.title}</h3>
                        <span class="counter-value" id="val-${goal.id}">${current} / ${goal.target}</span>
                    </div>
                </div>
            `;

            // Evento clic
            card.addEventListener('click', () => {
                let count = getProgress(goal.id);
                if (count < goal.target) {
                    count++;
                    saveProgress(goal.id, count);
                    updateUI(goal.id, count, goal.target);
                }
            });

            container.appendChild(card);
            // Actualizamos la UI inicial para que se pinte el círculo al cargar
            updateUI(goal.id, current, goal.target);
        });
    }

    // --- Nueva función para animar el círculo ---
    function updateUI(id, current, target) {
        const textElement = document.getElementById(`val-${id}`);
        const circleElement = document.getElementById(`circle-${id}`);
        
        if (textElement) textElement.innerText = `${current} / ${target}`;
        
        if (circleElement) {
            // Calcular el porcentaje (máximo 1, que es el 100%)
            const progressDecimal = Math.min(current / target, 1);
            
            // Calcular el "offset".
            // Si offset = circunferencia, el círculo está vacío.
            // Si offset = 0, el círculo está lleno.
            const offset = circumference - (progressDecimal * circumference);
            
            // Aplicar el nuevo offset para que el CSS lo anime
            circleElement.style.strokeDashoffset = offset;

            // Opcional: Cambiar color al completar (verde al llegar al final)
            if (current >= target) {
                 circleElement.style.stroke = '#28a745'; // Verde éxito
            }
        }
    }

    // Botón Reset (igual que antes)
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres reiniciar todos tus propósitos a cero?')) {
                goals.forEach(goal => localStorage.removeItem('goal_' + goal.id));
                renderCounters();
            }
        });
    }

    // Arrancar
    renderCounters();

});
