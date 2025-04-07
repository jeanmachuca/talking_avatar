import { 
    stop, 
    speak 
} from './speech.js';

import { 
    saveApiKey, 
    saveAzureConfig, 
    getChatResponse 
} from './ai.js';

import { 
    updateStatusText, 
    updateVoices, 
    updateMode, 
    toggleTheme 
} from './ui.js';

import { 
    getCurrentMode,
    speechRecognition,
    setListening,
    isListening,
    initializeSpeechRecognition,
    setupSpeechRecognitionHandlers,
    startSpeechRecognition,
    stopSpeechRecognition
} from './state.js';


// Initialize speech recognition
if (!initializeSpeechRecognition()) {
    console.warn('Speech recognition initialization failed');
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
 * Toggles the speech recognition state
 */
export function toggleListening() {
    if (!speechRecognition) {
        updateStatusText('recognitionNotSupported');
        return;
    }

    const micButton = document.getElementById('micButton');
    
    if (!isListening()) {
        // Start listening
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

                // Wait a moment before responding
                setTimeout(async () => {
                    if (getCurrentMode() === 'chat') {
                        updateStatusText('gettingAIResponse');
                        const response = await getChatResponse(transcript);
                        if (response) {
                            document.getElementById('textToSpeak').value = response;
                            speak();
                        }
                    } else {
                        // Echo mode - just repeat what was said
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

/**
 * Stops the speech recognition process
 */
function stopListening() {
    stopSpeechRecognition();
    setListening(false);
    document.getElementById('micButton').classList.remove('listening');
    updateStatusText('');
} 

// Make functions available globally
window.speak = speak;
window.stop = stop;
window.toggleListening = toggleListening;
window.updateVoices = updateVoices;
window.updateMode = updateMode;
window.toggleTheme = toggleTheme;
window.saveApiKey = saveApiKey;
window.saveAzureConfig = saveAzureConfig;
window.showSettings = showSettings;
window.hideSettings = hideSettings;

// Initialize mode on page load
document.addEventListener('DOMContentLoaded', () => {
    updateMode();
});
