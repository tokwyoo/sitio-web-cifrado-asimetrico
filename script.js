// Variables globales para almacenar las llaves
let crypt = null;
let publicKey = null;
let privateKey = null;

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', function () {
    // Event listeners para las pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabName = this.dataset.tab;
            showTab(tabName, this);
        });
    });

    // Inicializar el objeto JSEncrypt
    crypt = new JSEncrypt({ default_key_size: 2048 });
});

// Cambiar entre pestañas
function showTab(tabName, clickedTab) {
    // Ocultar todos los contenidos
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Remover clase activa de todas las pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Mostrar contenido seleccionado
    document.getElementById(tabName).classList.add('active');
    clickedTab.classList.add('active');

    // Limpiar resultados y mensajes
    hideResults();
    hideMessage();
}

// Generar par de llaves
function generateKeyPair() {
    try {
        // Generar las llaves
        crypt.getKey();

        // Obtener las llaves
        publicKey = crypt.getPublicKey();
        privateKey = crypt.getPrivateKey();

        // Mostrar las llaves
        document.getElementById('publicKey').textContent = publicKey;
        document.getElementById('privateKey').textContent = privateKey;
        document.getElementById('keyResult').style.display = 'block';

        showMessage('Par de llaves generado correctamente', 'success');
    } catch (error) {
        showMessage('Error al generar las llaves: ' + error.message, 'error');
        console.error('Error al generar llaves:', error);
    }
}

// Encriptar texto
function encryptText() {
    const publicKey = document.getElementById('publicKeyToUse').value.trim();
    const text = document.getElementById('textToEncrypt').value.trim();

    if (!publicKey || !text) {
        showMessage('Ingresa la llave pública y el texto a encriptar', 'error');
        return;
    }

    try {
        // Crear un nuevo objeto para encriptar
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);

        // Encriptar el texto
        const encrypted = encrypt.encrypt(text);

        if (!encrypted) {
            throw new Error('Error al encriptar. Verifica la llave pública.');
        }

        // Mostrar el resultado
        document.getElementById('encryptedText').textContent = encrypted;
        document.getElementById('encryptResult').style.display = 'block';

        showMessage('Texto encriptado correctamente', 'success');
    } catch (error) {
        showMessage('Error al encriptar: ' + error.message, 'error');
        console.error('Error de encriptación:', error);
    }
}

// Desencriptar texto
function decryptText() {
    const privateKey = document.getElementById('privateKeyToUse').value.trim();
    const encryptedText = document.getElementById('textToDecrypt').value.trim();

    if (!privateKey || !encryptedText) {
        showMessage('Ingresa la llave privada y el texto cifrado', 'error');
        return;
    }

    try {
        // Crear un nuevo objeto para desencriptar
        const decrypt = new JSEncrypt();
        decrypt.setPrivateKey(privateKey);

        // Desencriptar el texto
        const decrypted = decrypt.decrypt(encryptedText);

        if (!decrypted) {
            throw new Error('Error al desencriptar. Verifica la llave privada y el texto cifrado.');
        }

        // Mostrar el resultado
        document.getElementById('decryptedText').textContent = decrypted;
        document.getElementById('decryptResult').style.display = 'block';

        showMessage('Texto desencriptado correctamente', 'success');
    } catch (error) {
        showMessage('Error al desencriptar: ' + error.message, 'error');
        console.error('Error de desencriptación:', error);
    }
}

// Copiar texto al portapapeles
function copyText(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;

    if (!text || text.trim() === '') {
        showMessage('No hay texto para copiar', 'error');
        return;
    }

    // Crear un elemento temporal para copiar
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);

    // Seleccionar y copiar
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Para móviles

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showMessage('¡Texto copiado al portapapeles!', 'success');
        } else {
            showMessage('Error al copiar texto', 'error');
        }
    } catch (error) {
        showMessage('Error al copiar texto', 'error');
        console.error('Error al copiar:', error);
    } finally {
        document.body.removeChild(tempInput);
    }
}

// Mostrar mensaje
function showMessage(text, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `alert ${type}`;
    messageDiv.style.display = 'block';

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

// Ocultar mensaje
function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'none';
    messageDiv.className = 'alert';
}

// Ocultar resultados
function hideResults() {
    const keyResult = document.getElementById('keyResult');
    const encryptResult = document.getElementById('encryptResult');
    const decryptResult = document.getElementById('decryptResult');

    if (keyResult) keyResult.style.display = 'none';
    if (encryptResult) encryptResult.style.display = 'none';
    if (decryptResult) decryptResult.style.display = 'none';
}