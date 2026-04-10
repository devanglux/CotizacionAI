let currentStep = 1;
let formData = {};
let selectedHabilidades = [];

const rubros = [
    {id:'Comida', label:'Comida', icon:'🍴'}, {id:'Salud', label:'Salud', icon:'⚕️'},
    {id:'Ventas', label:'Ventas', icon:'🛍️'}, {id:'Servicios', label:'Servicios', icon:'💼'},
    {id:'Otro', label:'Otro', icon:'✨'}
];

const tonos = [
    {id:'Formal', label:'Formal', icon:'👔'}, {id:'Amigable', label:'Amigable', icon:'😊'},
    {id:'Relajado', label:'Relajado', icon:'😎'}
];

window.onload = () => {
    emailjs.init(FORM_CONFIG.integrations.emailjs_public_key);
    renderCards('rubro-grid', rubros, 'rubro_select');
    renderCards('tone-grid', tonos, 'ai_tone');
};

function renderCards(containerId, items, fieldId) {
    const grid = document.getElementById(containerId);
    items.forEach(item => {
        grid.innerHTML += `
            <div class="card" onclick="selectSingleCard('${fieldId}', '${item.id}', this)">
                <span class="card-icon">${item.icon}</span>
                <span class="card-label">${item.label}</span>
            </div>`;
    });
}

function selectSingleCard(field, value, el) {
    el.parentElement.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    formData[field] = value;
    if(field === 'rubro_select') {
        document.getElementById('otro-container').style.display = (value === 'Otro') ? 'block' : 'none';
    }
}

function toggleHabilidad(hab, el) {
    el.classList.toggle('selected');
    if(selectedHabilidades.includes(hab)) {
        selectedHabilidades = selectedHabilidades.filter(h => h !== hab);
    } else {
        selectedHabilidades.push(hab);
    }
    formData['habilidades'] = selectedHabilidades.join(", ");
}

function goToStep2() {
    // Guardar básicos
    formData.biz_name = document.getElementById('biz_name').value;
    formData.contact_name = document.getElementById('contact_name').value;
    formData.whatsapp = document.getElementById('whatsapp').value;
    
    document.getElementById('step-1').style.display = 'none';
    renderStep2();
    currentStep = 2;
    updateProgress();
}

function renderStep2() {
    const container = document.getElementById('dynamic-module-container');
    container.innerHTML = `
        <div class="form-step" id="step-2">
            <h3 class="step-title">2. Habilidades del Agente</h3>
            <div class="cards-grid">
                <div class="card" onclick="toggleHabilidad('Responder FAQ', this)"><span>❓</span><br>FAQ</div>
                <div class="card" onclick="toggleHabilidad('Agendar Citas', this)"><span>📅</span><br>Citas</div>
                <div class="card" onclick="toggleHabilidad('Vender', this)"><span>💰</span><br>Ventas</div>
                <div class="card" onclick="toggleHabilidad('Humano', this)"><span>👤</span><br>Humano</div>
            </div>
            <textarea id="biz_description" placeholder="Describe brevemente tu negocio..."></textarea>
            <button type="button" class="neon-button" onclick="nextToStep3()">Siguiente</button>
        </div>`;
}

function nextToStep3() {
    formData.biz_description = document.getElementById('biz_description').value;
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'block';
    currentStep = 3;
    updateProgress();
}

function updateProgress() {
    document.getElementById('progress-fill').style.width = (currentStep / 3 * 100) + "%";
    document.getElementById('progress-text').innerText = `Paso ${currentStep} de 3`;
}

async function submitForm() {
    formData.prohibited_topics = document.getElementById('prohibited_topics').value;
    const btn = document.getElementById('btn-submit');
    btn.innerText = "Enviando...";

    try {
        // GOOGLE SHEETS
        await fetch(FORM_CONFIG.integrations.google_sheets_url, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(formData)
        });

        // EMAILJS
        await emailjs.send(FORM_CONFIG.integrations.emailjs_service, FORM_CONFIG.integrations.emailjs_template, formData);

        document.getElementById('step-3').style.display = 'none';
        document.getElementById('success-screen').classList.remove('hidden-field');
    } catch (e) {
        alert("Error al enviar. Revisa tu conexión.");
    }
}