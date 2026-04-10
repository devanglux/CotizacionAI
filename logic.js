let currentStep = 1;
const formData = { origin: '', rubro_select: '', habilidades: [], channels: [], languages: [] };

// Datos de las Cards
const configCards = {
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
    renderCards('origin-grid', configCards.origin, 'origin');
    renderCards('rubro-grid', configCards.rubros, 'rubro_select');
};

function renderCards(containerId, items, fieldId, multi = false) {
    const grid = document.getElementById(containerId);
    if(!grid) return;
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<span class="card-icon">${item.icon}</span><span class="card-label">${item.label}</span>`;
        div.onclick = () => selectCard(fieldId, item.id, div, multi);
        grid.appendChild(div);
    });
}

function selectCard(field, value, el, multi) {
    if(!multi) {
        el.parentElement.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        formData[field] = value;
        if(field === 'rubro_select') document.getElementById('otro-container').style.display = (value === 'Otro') ? 'block' : 'none';
    } else {
        if(formData[field].includes(value)) formData[field] = formData[field].filter(v => v !== value);
        else formData[field].push(value);
    }
    el.classList.toggle('selected', !multi || formData[field].includes(value));
}

function validateAndNext(next) {
    const stepDiv = document.querySelector(`.form-step:not([style*="display: none"])`);
    const inputs = stepDiv.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    // Validar Inputs de texto
    inputs.forEach(input => {
        const errorSpan = input.parentElement.querySelector('.error-msg');
        if(!input.value.trim()) {
            input.classList.add('input-error');
            errorSpan.innerText = `El campo "${input.parentElement.querySelector('label').innerText}" es obligatorio.`;
            isValid = false;
        } else {
            input.classList.remove('input-error');
            errorSpan.innerText = "";
            formData[input.id] = input.value;
        }
    });

    // Validar Cards (Si hay grid de cards en el paso actual)
    if(currentStep === 1 && !formData.origin) {
        document.getElementById('origin-error').innerText = "Selecciona cómo supiste de nosotros.";
        isValid = false;
    }

    if(isValid) {
        if(next === 2) {
            formData.referral = document.getElementById('referral').value;
            showStep(2);
        } else if(next === 3) {
            if(!formData.rubro_select) {
                document.getElementById('rubro-error').innerText = "Selecciona tu rubro.";
                return;
            }
            renderStep3();
        } else if(next === 4) {
            renderStep4();
        } else if(next === 5) {
            renderStep5();
        }
    }
}

function showStep(s) {
    document.querySelectorAll('.form-step').forEach(d => d.style.display = 'none');
    const next = document.getElementById(`step-${s}`);
    if(next) next.style.display = 'block';
    currentStep = s;
    updateProgress();
}

// ... Las funciones renderStep3, 4 y 5 siguen la misma lógica inyectando el HTML ...
// (Para ahorrar espacio aquí, asume que inyectan los campos del Bloque Operativo, Técnico y Expectativas)