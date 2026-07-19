import { setCurrentMode, getCurrentMode } from './state.js';
import { TEXTS } from './constants.js';

export function updateStatusText(text) {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    const statusText = document.getElementById('statusText');
    statusText.textContent = TEXTS[selectedLanguage][text] || text;
}

export function updateVoices() {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    const texts = TEXTS[selectedLanguage];

    const textarea = document.getElementById('textToSpeak');
    const speakButton = document.getElementById('speakButton');
    const stopButton = document.getElementById('stopButton');

    const echoLabel = document.querySelector('label[for="echo"]');
    const chatLabel = document.querySelector('label[for="chat"]');
    const enLabel = document.querySelector('label[for="en"]');
    const esLabel = document.querySelector('label[for="es"]');
    const showSettingsLabel = document.querySelector('label[for="show-settings"]');
    const hideSettingsLabel = document.querySelector('label[for="hide-settings"]');

    textarea.placeholder = texts.placeholder;
    speakButton.textContent = texts.speakButton;
    stopButton.textContent = texts.stopButton;
    echoLabel.textContent = texts.echoMode;
    chatLabel.textContent = texts.chatMode;
    enLabel.textContent = texts.english;
    esLabel.textContent = texts.spanish;
    showSettingsLabel.textContent = texts.showSettings;
    hideSettingsLabel.textContent = texts.hideSettings;

    const currentText = textarea.value;
    if (currentText === TEXTS.en.initialMessage || currentText === TEXTS.es.initialMessage) {
        textarea.value = texts.initialMessage;
    }
}

export function showSettings() {
    const voiceControls = document.querySelector('.voice-controls');
    if (!voiceControls) return;
    voiceControls.classList.add('visible');
}

export function hideSettings() {
    const voiceControls = document.querySelector('.voice-controls');
    if (!voiceControls) return;
    voiceControls.classList.remove('visible');
}

export function updateMode() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    setCurrentMode(mode);

    if (mode === 'chat') {
        showConfigForm(typeof Auth !== 'undefined' && Auth.isGoogleUser() ? 'google' : 'guest');
    } else {
        hideConfigForm();
    }
}

export function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

export function updateAuthUI(user) {
    const display = document.getElementById('userDisplay');
    const loginContainer = document.getElementById('loginContainer');

    if (user) {
        if (user.photoURL) {
            display.innerHTML = `<img src="${user.photoURL}" width="32" height="32" class="auth-avatar" alt=""><span class="auth-name">${user.name}</span>`;
        } else {
            const initial = (user.name || '?')[0].toUpperCase();
            display.innerHTML = `<div class="auth-avatar-fallback">${initial}</div><span class="auth-name">${user.name}</span>`;
        }
        loginContainer.innerHTML = '<button class="auth-signout-btn" onclick="Auth.signOut()">Sign Out</button>';
    } else {
        display.innerHTML = '';
        loginContainer.innerHTML = '';
        Auth.renderButton('loginContainer');
    }
}

export function showConfigForm(userType) {
    const form = document.getElementById('configForm');
    const warning = document.getElementById('configWarning');
    const title = document.getElementById('configTitle');

    form.classList.remove('hidden');

    if (userType === 'guest') {
        title.textContent = 'Configure Azure OpenAI (Guest Mode)';
        warning.textContent = 'API key stored in browser localStorage. Do not use in production.';
        warning.classList.add('visible');
    } else if (typeof DriveVault !== 'undefined' && !DriveVault.isAvailable()) {
        title.textContent = 'Configure Azure OpenAI';
        warning.textContent = 'Google Drive is unavailable. API key stored in browser localStorage only.';
        warning.classList.add('visible');
    } else {
        title.textContent = 'Configure Azure OpenAI';
        warning.textContent = 'API key saved securely to your Google Drive.';
        warning.classList.remove('visible');
    }
}

export function hideConfigForm() {
    const form = document.getElementById('configForm');
    form.classList.add('hidden');
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
