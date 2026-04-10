// --- CONFIGURACIÓN GLOBAL ---
let currentStep = 1;
let formData = { 
    origin: '', rubro_select: '', habilidades: [], channels: [], languages: [],
    ai_tone: '', msg_volume: '', behavior_off: ''
};

// --- CATÁLOGOS DE CARDS ---
const catalog = {
    origin: [
        {id:'Facebook', label:'Facebook', icon:'🌐'}, {id:'Instagram', label:'Instagram', icon:'📸'},
        {id:'LinkedIn', label:'LinkedIn', icon:'💼'}, {id:'Recomendación', label:'Recomendación', icon:'🤝'},
        {id:'Publicidad', label:'Publicidad', icon:'🚀'}
    ],
    rubros: [
        {id:'Comida', label:'Comida', icon:'🍴'}, {id:'Salud', label:'Salud', icon:'⚕️'},
        {id:'Ventas', label:'Ventas', icon:'🛍️'}, {id:'Servicios', label:'Servicios', icon:'💼'},
        {id:'Inmobiliaria', label:'Real Estate', icon:'🏠'}, {id:'Otro', label:'Otro', icon:'✨'}
    ],
    off_hours: [
        {id:'Informar', label:'Solo Informar', icon:'🕒'},
        {id:'Notificar', label:'Tomar Mensaje', icon:'📩'},
        {id:'24/7', label:'Atención 24/7', icon:'⚡'}
    ],
    habilidades: [
        {id:'FAQ', label:'Responder FAQ', icon:'❓'}, {id:'Citas', label:'Agendar Citas', icon:'📅'},
        {id:'Ventas', label:'Vender/Cotizar', icon:'💰'}, {id:'Humano', label:'Pasar a Humano', icon:'👤'}
    ]
};

// --- INICIALIZACIÓN ---
window.onload = () => {
    if(typeof emailjs !== 'undefined') emailjs.init(FORM_CONFIG.integrations.emailjs_public_key);
    renderCards('origin-grid', catalog.origin, 'origin');
};

// --- MOTOR DE RENDERIZADO ---
function renderCards(containerId, items, field, multi = false) {
    const grid = document.getElementById(containerId);
    if(!grid) return;
    grid.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = `card ${(!multi && formData[field] === item.id) || (multi && formData[field].includes(item.id)) ? 'selected' : ''}`;
        div.innerHTML = `<span class="card-icon">${item.icon}</span><span class="card-label">${item.label}</span>`;
        div.onclick = () => {
            if(!multi) {
                grid.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                formData[field] = item.id;
                div.classList.add('selected');
                if(field === 'rubro_select') document.getElementById('otro-container').style.display = (item.id === 'Otro' ? 'block' : 'none');
            } else {
                if(formData[field].includes(item.id)) {
                    formData[field] = formData[field].filter(i => i !== item.id);
                    div.classList.remove('selected');
                } else {
                    formData[field].push(item.id);
                    div.classList.add('selected');
                }
            }
            // Limpiar errores visuales al seleccionar
            const err = grid.parentElement.querySelector('.error-msg');
            if(err) err.innerText = '';
        };
        grid.appendChild(div);
    });
}

// --- VALIDADOR DE PASOS ---
function validateAndNext(next) {
    const stepDiv = document.querySelector('.form-step.active');
    const requiredInputs = stepDiv.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    // 1. Validar Inputs
    requiredInputs.forEach(input => {
        const errorSpan = input.parentElement.querySelector('.error-msg');
        if(!input.value.trim()) {
            input.classList.add('input-error');
            errorSpan.innerText = "Este campo es obligatorio.";
            isValid = false;
        } else {
            input.classList.remove('input-error');
            errorSpan.innerText = "";
            formData[input.id] = input.value;
        }
    });

    // 2. Validaciones Específicas por Paso
    if(currentStep === 1 && !formData.origin) {
        document.getElementById('origin-error').innerText = "Selecciona una opción de origen.";
        isValid = false;
    }
    
    if(currentStep === 2 && !formData.rubro_select) {
        document.getElementById('rubro-error').innerText = "Selecciona tu rubro de negocio.";
        isValid = false;
    }

    if(isValid) {
        goToStep(next);
    } else {
        // Vibración visual del botón
        const btn = stepDiv.querySelector('.neon-button');
        btn.style.animation = 'shake 0.4s';
        setTimeout(() => btn.style.animation = '', 400);
    }
}

function goToStep(s) {
    // Ocultar todos
    document.querySelectorAll('.form-step').forEach(d => {
        d.classList.remove('active');
        d.style.display = 'none';
    });

    // Mostrar el solicitado
    const nextDiv = document.getElementById(`step-${s}`);
    nextDiv.classList.add('active');
    nextDiv.style.display = 'block';
    
    currentStep = s;
    updateProgress();

    // Inyectar contenido dinámico si es necesario
    if(s === 2) renderCards('rubro-grid', catalog.rubros, 'rubro_select');
    if(s === 3) renderCards('off-grid', catalog.off_hours, 'behavior_off');
    if(s === 4) renderCards('hab-grid', catalog.habilidades, 'habilidades', true);
}

function updateProgress() {
    const fill = document.getElementById('progress-fill');
    const txt = document.getElementById('progress-text');
    fill.style.width = `${(currentStep / 5) * 100}%`;
    txt.innerText = `Paso ${currentStep} de 5`;
}