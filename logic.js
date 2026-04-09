// Estado global del formulario
let currentStep = 1;
const formData = {};

// Función para avanzar pasos
function nextStep(step) {
    // Guardar datos del paso actual
    const inputs = document.querySelectorAll(`#step-${currentStep} input, #step-${currentStep} select, #step-${currentStep} textarea`);
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });

    // Ocultar paso actual
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    
    // Lógica de Ramificación dinámica
    if (step === 2) {
        const rubro = document.getElementById('rubro_select').value;
        renderDynamicModule(rubro);
    }

    // Mostrar nuevo paso
    currentStep = step;
    const nextStepDiv = document.getElementById(`step-${currentStep}`);
    if (nextStepDiv) {
        nextStepDiv.style.display = 'block';
        updateProgressBar();
    }
}

function updateProgressBar() {
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    const percentage = (currentStep / 3) * 100;
    
    fill.style.width = percentage + "%";
    text.innerText = `Paso ${currentStep} de 3`;
}

// Renderiza el módulo específico según el rubro [cite: 1, 2]
function renderDynamicModule(rubro) {
    const container = document.getElementById('dynamic-module-container');
    let html = '';

    if (['Salud', 'Belleza', 'Servicios'].includes(rubro)) {
        html = `
            <div class="form-step" id="step-2">
                <h3>Módulo de Agendamiento</h3>
                <label>¿Cómo gestionan sus citas actualmente? [cite: 19]</label>
                <select id="calendar_system">
                    <option value="Google">Google Calendar</option>
                    <option value="Calendly">Calendly</option>
                    <option value="Manual">Manual / No tenemos</option>
                </select>
                <textarea id="services_list" placeholder="¿Qué servicios principales agendará el agente?"></textarea>
                <button type="button" class="neon-button" onclick="nextStep(3)">Continuar</button>
            </div>`;
    } else if (['Comida', 'Tienda'].includes(rubro)) {
        html = `
            <div class="form-step" id="step-2">
                <h3>Módulo de Ventas</h3>
                <label>¿Tienen catálogo o menú digital? [cite: 14]</label>
                <input type="url" id="catalog_link" placeholder="Link a PDF o Menú">
                <select id="promo_freq">
                    <option value="frecuente">Tenemos promociones frecuentes [cite: 16]</option>
                    <option value="fijo">Precios fijos solamente [cite: 16]</option>
                </select>
                <button type="button" class="neon-button" onclick="nextStep(3)">Continuar</button>
            </div>`;
    } else {
        // Módulo General/Captación para otros rubros [cite: 14]
        html = `
            <div class="form-step" id="step-2">
                <h3>Módulo de Captación</h3>
                <textarea id="qualifying_questions" placeholder="¿Qué preguntas debe hacer el agente para filtrar a un cliente? [cite: 7]"></textarea>
                <button type="button" class="neon-button" onclick="nextStep(3)">Continuar</button>
            </div>`;
    }
    container.innerHTML = html;
}

// Función final de envío [cite: 17, 18]
async function submitForm() {
    const btn = document.getElementById('btn-submit');
    btn.innerText = "Enviando...";
    btn.disabled = true;

    try {
        // Enviar a Sheets y EmailJS como antes [cite: 57, 58]
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

        // OCULTAR PASO 3 Y MOSTRAR ÉXITO CON CALENDLY
        document.getElementById('step-3').style.display = 'none';
        document.getElementById('success-screen').style.display = 'block';
        document.querySelector('.progress-container').style.display = 'none';

    } catch (error) {
        alert("Hubo un error al enviar. Por favor intenta de nuevo.");
        btn.disabled = false;
        btn.innerText = "Finalizar Configuración";
    }
}