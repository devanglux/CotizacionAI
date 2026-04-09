
let currentStep = 1;
const formData = {};

function checkOtro(val) {
    const container = document.getElementById('otro_especificar_container');
    container.style.display = (val === 'Otro') ? 'block' : 'none';
}

function updateProgressBar() {
    const percentage = (currentStep / 3) * 100;
    document.getElementById('progress-fill').style.width = percentage + "%";
    document.getElementById('progress-text').innerText = `Paso ${currentStep} de 3`;
}

function nextStep(step) {
    const currentDiv = document.getElementById(`step-${currentStep}`) || document.getElementById('step-2');
    const inputs = currentDiv.querySelectorAll('input, select, textarea');
    inputs.forEach(input => { formData[input.id] = input.value; });

    currentDiv.style.display = 'none';

    if (step === 2) {
        const rubro = document.getElementById('rubro_select').value;
        renderDynamicModule(rubro);
    }

    currentStep = step;
    const nextDiv = document.getElementById(`step-${currentStep}`);
    if (nextDiv) nextDiv.style.display = 'block';
    updateProgressBar();
}

function renderDynamicModule(rubro) {
    const container = document.getElementById('dynamic-module-container');
    let rubroText = (rubro === 'Otro') ? document.getElementById('rubro_otro').value : rubro;
    
    let specificHTML = '';
    if (['Salud', 'Belleza', 'Servicios'].includes(rubro)) {
        specificHTML = `
            <select id="calendar_system">
                <option value="" disabled selected>¿Usas calendario digital?</option>
                <option value="Google">Google Calendar</option>
                <option value="Calendly">Calendly / Otro</option>
                <option value="No">No, agendamos manual</option>
            </select>`;
    } else if (['Comida', 'Ventas'].includes(rubro)) {
        specificHTML = `<input type="url" id="catalog_link" placeholder="Link a Catálogo o Menú">`;
    }

    container.innerHTML = `
        <div class="form-step" id="step-2">
            <h3 style="color: #BC13FE;">2. Operación (${rubroText})</h3>
            <textarea id="biz_description" placeholder="Breve descripción de tu negocio" rows="2"></textarea>
            <input type="text" id="ops_hours" placeholder="Horarios (Ej: Lun-Sab 9-7pm)">
            
            <select id="off_hours">
                <option value="Informar">IA informa horario y pide volver</option>
                <option value="Notificar">IA toma mensaje y avisa al equipo</option>
                <option value="24/7">IA responde siempre 24/7</option>
            </select>

            <select id="main_channel">
                <option value="WhatsApp">Llegarán por WhatsApp</option>
                <option value="Instagram">Instagram / Facebook</option>
                <option value="Web">Webchat</option>
            </select>

            ${specificHTML}

            <button type="button" class="neon-button" onclick="nextStep(3)">Siguiente</button>
        </div>`;
}

async function submitForm() {
    const btn = document.getElementById('btn-submit');
    btn.innerText = "Procesando...";
    btn.disabled = true;

    // Recoger datos finales paso 3
    const p3Inputs = document.getElementById('step-3').querySelectorAll('input, select, textarea');
    p3Inputs.forEach(input => { formData[input.id] = input.value; });

    try {
        await fetch(FORM_CONFIG.integrations.google_sheets_url, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(formData)
        });

        await emailjs.send(
            FORM_CONFIG.integrations.emailjs_service,
            FORM_CONFIG.integrations.emailjs_template,
            formData
        );

        document.getElementById('step-3').style.display = 'none';
        document.querySelector('.progress-container').style.display = 'none';
        document.getElementById('success-screen').style.display = 'block';

    } catch (e) {
        alert("Error de conexión. Intenta de nuevo.");
        btn.disabled = false;
        btn.innerText = "Enviar y Finalizar";
    }
}

// Configuración de Rubros con Iconos
const rubros = [
    { id: 'Comida', label: 'Restaurante', icon: '🍴' },
    { id: 'Salud', label: 'Salud/Médico', icon: '⚕️' },
    { id: 'Ventas', label: 'Tienda/Ventas', icon: '🛍️' },
    { id: 'Inmobiliaria', label: 'Real Estate', icon: '🏠' },
    { id: 'Otro', label: 'Otro', icon: '✨' }
];

// Inyectar Cards al cargar
window.onload = () => {
    const grid = document.getElementById('rubro-cards');
    rubros.forEach(r => {
        grid.innerHTML += `
            <div class="card" onclick="selectCard('rubro', '${r.id}', this)">
                <span class="card-icon">${r.icon}</span>
                <span class="card-label">${r.label}</span>
            </div>
        `;
    });
};

let selectedRubro = '';

function selectCard(type, id, element) {
    // Deseleccionar otros
    const parent = element.parentElement;
    parent.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    
    // Seleccionar actual
    element.classList.add('selected');
    
    if (type === 'rubro') {
        selectedRubro = id;
        document.getElementById('otro-input-container').style.display = (id === 'Otro') ? 'block' : 'none';
    }
}

function renderDynamicModule(rubro) {
    const container = document.getElementById('dynamic-module-container');
    
    // Ejemplo de selección múltiple con CARDS para "Qué debe hacer el agente"
    container.innerHTML = `
        <div class="form-step" id="step-2">
            <h3 class="step-title">2. ¿Qué habilidades necesita tu Agente?</h3>
            <p style="font-size: 12px; color: #8A9BB5; margin-bottom: 15px;">Selecciona todas las que apliquen (Ejemplo: Agendar citas, responder FAQ)</p>
            
            <div class="cards-grid">
                <div class="card" onclick="this.classList.toggle('selected')">
                    <span class="card-icon">📅</span><span class="card-label">Agendar Citas</span>
                </div>
                <div class="card" onclick="this.classList.toggle('selected')">
                    <span class="card-icon">💬</span><span class="card-label">Responder FAQ</span>
                </div>
                <div class="card" onclick="this.classList.toggle('selected')">
                    <span class="card-icon">🛒</span><span class="card-label">Tomar Pedidos</span>
                </div>
                <div class="card" onclick="this.classList.toggle('selected')">
                    <span class="card-icon">👤</span><span class="card-label">Pasar a Humano</span>
                </div>
            </div>

            <button type="button" class="neon-button" onclick="nextStep(3)">Último Paso</button>
        </div>
    `;
}

