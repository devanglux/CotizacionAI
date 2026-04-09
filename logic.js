
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



