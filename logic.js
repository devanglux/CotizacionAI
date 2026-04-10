let formData = { origin: '' };

function selectCard(field, value, el) {
    el.parentElement.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    formData[field] = value;
    // Limpiar error si selecciona
    document.getElementById(`err-${field}`).innerText = "";
}

function nextStep(step) {
    let isValid = true;
    
    // Validar nombre del negocio
    const bizInput = document.getElementById('biz_name');
    if (!bizInput.value.trim()) {
        document.getElementById('err-biz_name').innerText = "El nombre del negocio es obligatorio.";
        bizInput.classList.add('input-error');
        isValid = false;
    } else {
        bizInput.classList.remove('input-error');
        document.getElementById('err-biz_name').innerText = "";
    }

    // Validar Card de Origen
    if (!formData.origin) {
        document.getElementById('err-origin').innerText = "Por favor selecciona una opción.";
        isValid = false;
    }

    if (isValid) {
        // Lógica para pasar al siguiente div
        document.getElementById('step-1').classList.remove('active');
        document.getElementById('step-1').style.display = 'none';
        
        // Aquí llamarías a la función que renderiza el paso 2
        console.log("Avanzando al paso 2...", formData);
    }
}