import {
    stop,
    speak,
} from './speech.js';

import {
    loadConfig,
    saveApiKey,
    saveAzureConfig,
    getChatResponse,
    isConfigValid,
} from './ai.js';

import {
    updateStatusText,
    updateVoices,
    updateMode,
    toggleTheme,
    updateAuthUI,
    showConfigForm,
    hideConfigForm,
} from './ui.js';

import {
    getCurrentMode,
    speechRecognition,
    setListening,
    isListening,
    initializeSpeechRecognition,
    setupSpeechRecognitionHandlers,
    startSpeechRecognition,
    stopSpeechRecognition,
} from './state.js';

if (!initializeSpeechRecognition()) {
    console.warn('Speech recognition initialization failed');
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

export function toggleListening() {
    if (!speechRecognition) {
        updateStatusText('recognitionNotSupported');
        return;
    }

    const micButton = document.getElementById('micButton');

    if (!isListening()) {
        const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
        const languageCode = selectedLanguage === 'en' ? 'en-US' : 'es-ES';

        setupSpeechRecognitionHandlers(
            () => {
                setListening(true);
                micButton.classList.add('listening');
                updateStatusText('listening');
            },
            async (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('textToSpeak').value = transcript;
                updateStatusText('youSaid' + transcript);

                setTimeout(async () => {
                    if (getCurrentMode() === 'chat') {
                        updateStatusText('gettingAIResponse');
                        const response = await getChatResponse(transcript);
                        if (response) {
                            document.getElementById('textToSpeak').value = response;
                            speak();
                        }
                    } else {
                        speak();
                    }
                }, 1000);
            },
            (event) => {
                console.error('Speech recognition error:', event.error);
                updateStatusText('error' + event.error);
                stopListening();
            },
            () => {
                stopListening();
            }
        );

        if (!startSpeechRecognition(languageCode)) {
            updateStatusText('errorStartingRecognition');
            stopListening();
        }
    } else {
        stopListening();
    }
}

function stopListening() {
    stopSpeechRecognition();
    setListening(false);
    document.getElementById('micButton').classList.remove('listening');
    updateStatusText('');
}

async function handleAuthChange(user) {
    updateAuthUI(user);

    if (user) {
        await loadConfig();
        if (typeof DriveVault !== 'undefined' && Auth.isGoogleUser() && DriveVault.isAvailable() === false) {
            alert('Google Drive is not available. Your Azure OpenAI config will be stored in browser only (not synced across devices).');
        }
        if (getCurrentMode() === 'chat' && !isConfigValid()) {
            showConfigForm(Auth.isGoogleUser() ? 'google' : 'guest');
        } else {
            hideConfigForm();
        }
    } else {
        hideConfigForm();
        if (typeof DriveVault !== 'undefined') DriveVault.clearCache();
    }
}

window.speak = speak;
window.stop = stop;
window.toggleListening = toggleListening;
window.updateVoices = updateVoices;
window.updateMode = updateMode;
window.toggleTheme = toggleTheme;
window.saveApiKey = saveApiKey;
window.saveAzureConfig = async function () {
    await saveAzureConfig();
    hideConfigForm();
};
window.showSettings = showSettings;
window.hideSettings = hideSettings;

document.addEventListener('DOMContentLoaded', () => {
    Auth.onAuthChange(handleAuthChange);
    updateMode();
    Auth.restoreSession();
});
