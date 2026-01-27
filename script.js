document.addEventListener('DOMContentLoaded', () => {
    // === 1. LÓGICA DE NAVEGACIÓN Y SCROLL ===
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

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavMenu() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
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
    highlightNavMenu();

    // === 2. LÓGICA DE LOS CONTADORES CIRCULARES (PROPÓSITOS 2026) ===
    const goals = [
        { id: 'gym', emoji: '💪', title: 'Pull', target: 75 },
        { id: 'run', emoji: '🏋️', title: 'Push', target: 75 },
        { id: 'books', emoji: '📚', title: 'Leer', target: 12 },
        { id: 'water', emoji: '🏄', title: 'Surf', target: 25 },
        { id: 'meditate', emoji: '🧘', title: 'Meditar', target: 200 },
        { id: 'code', emoji: '💻', title: 'Study', target: 150 },
        { id: 'travel', emoji: '🚴‍♂️', title: 'Bici', target: 50 },
        { id: 'savings', emoji: '📓', title: 'Diario', target: 365 },
        { id: 'healthy', emoji: '🍳', title: 'Cocinar', target: 50 },
        { id: 'digital-detox', emoji: '🤸‍♂️', title: 'Estiramientos', target: 300 }
    ];

    const container = document.getElementById('counters-container');
    
    // --- CONSTANTES PARA EL CÍRCULO ---
    // Radio del círculo. Si el viewBox es 150x150, el centro es 75,75.
    // Un radio de 65 deja 10px de margen total (5px por lado) para el grosor de la línea.
    const radius = 65;
    const circumference = 2 * Math.PI * radius;

    function getProgress(id) {
        return parseInt(localStorage.getItem('goal_' + id)) || 0;
    }

    function saveProgress(id, value) {
        localStorage.setItem('goal_' + id, value);
    }
    document.addEventListener("DOMContentLoaded", () => {
    
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        const glare = card.querySelector('.glare');

        card.addEventListener('mousemove', (e) => {
            // 1. Obtener dimensiones de la tarjeta
            const rect = card.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            // 2. Calcular posición del ratón relativa a la tarjeta
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // 3. Calcular rotación (X gira en eje Y, Y gira en eje X)
            // Multiplicamos por 15 para que el ángulo máximo sea 15 grados
            const rotateY = ((mouseX / width) - 0.5) * 15; 
            const rotateX = ((mouseY / height) - 0.5) * -15;

            // 4. Aplicar la rotación a la tarjeta
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.02)
            `;

            // 5. Mover el Brillo (Glare)
            if (glare) {
                glare.style.opacity = '1';
                // El brillo sigue al ratón
                glare.style.left = `${mouseX}px`;
                glare.style.top = `${mouseY}px`;
            }
        });

        // Cuando el ratón sale, todo vuelve a su sitio suavemente
        card.addEventListener('mouseleave', () => {
            // Quitamos la transformación (vuelve a plano)
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            
            // Ocultamos el brillo
            if (glare) {
                glare.style.opacity = '0';
            }
            
            // Añadimos una transición temporal para que el retorno sea suave
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                card.style.transition = ''; // Limpiamos la transición para el próximo movimiento
            }, 500);
        });
    });
});

// --- FUNCIÓN RENDER CORREGIDA CON CAPA EXTRA ---
    function renderCounters() {
        if (!container) return;
        container.innerHTML = ''; 
        goals.forEach(goal => {
            const current = getProgress(goal.id);

            const card = document.createElement('div');
            card.className = 'counter-card';

            card.innerHTML = `
                <div class="circular-progress-container">
                    <svg class="progress-ring-svg" width="150" height="150" viewBox="0 0 150 150">
                        <circle class="progress-ring-circle-bg" cx="75" cy="75" r="${radius}"></circle>
                        
                        <circle class="progress-ring-circle" id="circle-base-${goal.id}"
                            cx="75" cy="75" r="${radius}"
                            style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};">
                        </circle>

                        <circle class="progress-ring-circle-excess" id="circle-extra-${goal.id}"
                            cx="75" cy="75" r="${radius}"
                            style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};">
                        </circle>
                    </svg>
                    <div class="inner-content">
                        <span class="inner-emoji">${goal.emoji}</span>
                        <span class="inner-value" id="val-${goal.id}">${current} / ${goal.target}</span>
                    </div>
                </div>
                <h3>${goal.title}</h3>
            `;

            card.addEventListener('click', () => {
                let count = getProgress(goal.id);
                // Ahora permitimos que suba sin límite (quitamos el if count < target)
                count++;
                saveProgress(goal.id, count);
                updateUI(goal.id, count, goal.target);
            });

            container.appendChild(card);
            setTimeout(() => updateUI(goal.id, current, goal.target), 50);
        });
    }

    // --- FUNCIÓN UPDATE CORREGIDA PARA DOS CAPAS ---
    function updateUI(id, current, target) {
        const textElement = document.getElementById(`val-${id}`);
        const baseCircle = document.getElementById(`circle-base-${id}`);
        const extraCircle = document.getElementById(`circle-extra-${id}`);
        
        if (textElement) textElement.innerText = `${current} / ${target}`;
        
        if (baseCircle && extraCircle) {
            // Lógica para el círculo AZUL (Base)
            // Si llegamos a 200/200, el azul se queda al 100% (offset 0)
            const baseProgress = Math.min(current / target, 1);
            const baseOffset = circumference - (baseProgress * circumference);
            baseCircle.style.strokeDashoffset = baseOffset;

            // Lógica para el círculo AMARILLO (Extra)
            if (current > target) {
                // Calculamos cuánto nos hemos pasado (ej: 220 - 200 = 20)
                const extraAmount = current - target;
                // Calculamos el porcentaje del extra respecto al total original
                // Si es 220/200, el extra es 20/200 = 10% amarillo
                const extraProgress = Math.min(extraAmount / target, 1); 
                const extraOffset = circumference - (extraProgress * circumference);
                
                extraCircle.style.strokeDashoffset = extraOffset;
                baseCircle.style.stroke = '#007bff'; // Asegurar azul si hay extra
            } else {
                // Si no hay extra, el círculo amarillo está vacío
                extraCircle.style.strokeDashoffset = circumference;
            }
        }
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres reiniciar todos tus propósitos a cero?')) {
                goals.forEach(goal => localStorage.removeItem('goal_' + goal.id));
                renderCounters();
            }
        });
    }

    renderCounters();
});
