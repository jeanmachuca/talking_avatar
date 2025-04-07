import { setCurrentMode, getCurrentMode } from './state.js';
import { TEXTS } from './constants.js';

/**
 * Updates the status text displayed to the user
 * @param {string} text - The key of the text to display from the TEXTS object
 */
export function updateStatusText(text) {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    const statusText = document.getElementById('statusText');
    statusText.textContent = TEXTS[selectedLanguage][text] || text;
}

/**
 * Updates UI elements based on the selected language
 */
export function updateVoices() {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    const texts = TEXTS[selectedLanguage];
    
    // Update placeholder text based on language
    const textarea = document.getElementById('textToSpeak');
    const speakButton = document.getElementById('speakButton');
    const stopButton = document.getElementById('stopButton');
    
    // Update radio button labels
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
    
    // Update initial message if it matches either language's initial message
    const currentText = textarea.value;
    if (currentText === TEXTS.en.initialMessage || currentText === TEXTS.es.initialMessage) {
        textarea.value = texts.initialMessage;
    }
}

/**
 * Shows the settings panel
 */
export function showSettings() {
    const voiceControls = document.querySelector('.voice-controls');
    if (!voiceControls) {
        console.warn('Voice controls element not found');
        return;
    }
    voiceControls.classList.add('visible');
}

/**
 * Hides the settings panel
 */
export function hideSettings() {
    const voiceControls = document.querySelector('.voice-controls');
    if (!voiceControls) {
        console.warn('Voice controls element not found');
        return;
    }
    voiceControls.classList.remove('visible');
}

/**
 * Updates the application mode and related UI elements
 */
export function updateMode() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    setCurrentMode(mode);
    const apiKeyInput = document.getElementById('apiKeyInput');
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    const texts = TEXTS[selectedLanguage];
    
    if (mode === 'chat') {
        apiKeyInput.classList.add('visible');
        // Load saved values if they exist
        document.getElementById('apiKey').value = localStorage.getItem('azure_openai_api_key') || '';
        document.getElementById('azureResourceName').value = localStorage.getItem('azure_resource_name') || '';
        document.getElementById('deploymentName').value = localStorage.getItem('deployment_name') || '';
        
        // Update placeholders based on language
        document.getElementById('apiKey').placeholder = texts.apiKeyPlaceholder;
        document.getElementById('azureResourceName').placeholder = texts.azureResourcePlaceholder;
        document.getElementById('deploymentName').placeholder = texts.deploymentNamePlaceholder;
    } else {
        apiKeyInput.classList.remove('visible');
    }
}

/**
 * Toggles the dark mode theme and saves the preference
 */
export function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
} 