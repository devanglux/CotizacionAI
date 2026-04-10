let currentStep = 1;
let formData = { origin: '', rubro: '', habilidades: [], channels: [] };

const items = {
    origin: [
        {id:'Facebook', label:'Facebook', icon:'🌐'}, {id:'Instagram', label:'Instagram', icon:'📸'},
        {id:'LinkedIn', label:'LinkedIn', icon:'💼'}, {id:'Recomendación', label:'Recomendación', icon:'🤝'}
    ],
    rubros: [
        {id:'Comida', label:'Comida', icon:'🍴'}, {id:'Salud', label:'Salud', icon:'⚕️'},
        {id:'Ventas', label:'Ventas', icon:'🛍️'}, {id:'Servicios', label:'Servicios', icon:'💼'},
        {id:'Otro', label:'Otro', icon:'✨'}
    ]
};

window.onload = () => {
    emailjs.init(FORM_CONFIG.integrations.emailjs_public_key);
    renderCards('origin-grid', items.origin, 'origin');
};

function renderCards(containerId, data, field, multi = false) {
    const grid = document.getElementById(containerId);
    if(!grid) return;
    grid.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<span class="card-icon">${item.icon}</span><span class="card-label">${item.label}</span>`;
        card.onclick = () => {
            if(!multi) {
                grid.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                formData[field] = item.id;
            } else {
                if(formData[field].includes(item.id)) formData[field] = formData[field].filter(i => i !== item.id);
                else formData[field].push(item.id);
            }
            card.classList.toggle('selected');
        };
        grid.appendChild(card);
    });
}

function validateStep(step) {
    const stepEl = document.getElementById(`step-${step}`);
    const inputs = stepEl.querySelectorAll('input[required], select[required]');
    let valid = true;

    inputs.forEach(input => {
        const error = input.parentElement.querySelector('.error-msg');
        if(!input.value.trim()) {
            input.classList.add('input-error');
            error.innerText = "Este campo es obligatorio.";
            valid = false;
        } else {
            input.classList.remove('input-error');
            error.innerText = "";
            formData[input.id] = input.value;
        }
    });

    if(step === 1 && !formData.origin) {
        document.getElementById('origin-error').innerText = "Selecciona una opción de origen.";
        valid = false;
    }

    if(valid) {
        if(step === 1) renderStep2();
        else if(step === 2) renderStep3();
        // ... continuar con el flujo
    }
}

function renderStep2() {
    document.getElementById('step-1').style.display = 'none';
    const container = document.getElementById('dynamic-steps');
    container.innerHTML = `
        <div class="form-step" id="step-2">
            <h2 class="step-title">2. Tu Rubro</h2>
            <div class="field-group">
                <label>¿A qué se dedica tu negocio?</label>
                <div class="cards-grid" id="rubro-grid"></div>
                <span class="error-msg" id="rubro-error"></span>
            </div>
            <button type="button" class="neon-button" onclick="validateStep(2)">Continuar</button>
        </div>
    `;
    renderCards('rubro-grid', items.rubros, 'rubro');
    updateProgress(2);
}

function updateProgress(step) {
    currentStep = step;
    document.getElementById('progress-fill').style.width = (step / 5 * 100) + "%";
    document.getElementById('progress-text').innerText = `Paso ${step} de 5`;
}

async function submitFinalForm() {
    // Recoger datos finales y enviar a Google Sheets + EmailJS
    // (Usa la lógica de fetch y emailjs.send previa)
}