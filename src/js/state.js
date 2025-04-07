/**
 * Shared state between modules
 * @type {Object}
 */

/**
 * Current mode of the application ('echo' or 'chat')
 * @type {string}
 */
export let currentMode = 'echo';

/**
 * Whether the avatar is currently speaking
 * @type {boolean}
 */
export let speaking = false;

/**
 * Whether the application is currently listening
 * @type {boolean}
 */
export let listening = false;

/**
 * Interval ID for mouth animation
 * @type {number|null}
 */
export let mouthInterval = null;

/**
 * Timestamp of the last word spoken
 * @type {number}
 */
export let lastWordTime = 0;

/**
 * Timestamp of the last character spoken
 * @type {number}
 */
export let lastCharTime = 0;

/**
 * Average duration of a word in milliseconds
 * @type {number}
 */
export let averageWordDuration = 250;

/**
 * Available speech synthesis voices
 * @type {Array<SpeechSynthesisVoice>}
 */
export let voices = [];

/**
 * Speech recognition instance
 * @type {SpeechRecognition|null}
 */
export let speechRecognition = null;

/**
 * Initializes speech recognition
 * @returns {boolean} True if initialization was successful, false otherwise
 */
export function initializeSpeechRecognition() {
    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognition = new SpeechRecognition();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
        return true;
    } catch (e) {
        console.error('Speech recognition not supported:', e);
        return false;
    }
}

/**
 * Sets up speech recognition event handlers
 * @param {Function} onStart - Callback when recognition starts
 * @param {Function} onResult - Callback when recognition produces a result
 * @param {Function} onError - Callback when recognition encounters an error
 * @param {Function} onEnd - Callback when recognition ends
 */
export function setupSpeechRecognitionHandlers(onStart, onResult, onError, onEnd) {
    if (!speechRecognition) return;
    
    speechRecognition.onstart = onStart;
    speechRecognition.onresult = onResult;
    speechRecognition.onerror = onError;
    speechRecognition.onend = onEnd;
}

/**
 * Starts speech recognition
 * @param {string} language - The language code to use (e.g., 'en-US' or 'es-ES')
 * @returns {boolean} True if started successfully, false otherwise
 */
export function startSpeechRecognition(language) {
    if (!speechRecognition) return false;
    
    try {
        speechRecognition.lang = language;
        speechRecognition.start();
        return true;
    } catch (e) {
        console.error('Speech recognition start error:', e);
        return false;
    }
}

/**
 * Stops speech recognition
 * @returns {boolean} True if stopped successfully, false otherwise
 */
export function stopSpeechRecognition() {
    if (!speechRecognition) return false;
    
    try {
        speechRecognition.stop();
        return true;
    } catch (e) {
        console.error('Speech recognition stop error:', e);
        return false;
    }
}

/**
 * Sets the current mode of the application
 * @param {string} mode - The mode to set ('echo' or 'chat')
 */
export function setCurrentMode(mode) {
    currentMode = mode;
}

/**
 * Gets the current mode of the application
 * @returns {string} The current mode ('echo' or 'chat')
 */
export function getCurrentMode() {
    return currentMode;
}

/**
 * Sets the speaking state
 * @param {boolean} value - Whether the avatar is currently speaking
 */
export function setSpeaking(value) {
    speaking = value;
}

/**
 * Checks if the avatar is currently speaking
 * @returns {boolean} True if the avatar is speaking, false otherwise
 */
export function isSpeaking() {
    return speaking;
}

/**
 * Sets the listening state
 * @param {boolean} value - Whether the application is currently listening
 */
export function setListening(value) {
    listening = value;
}

/**
 * Checks if the application is currently listening
 * @returns {boolean} True if the application is listening, false otherwise
 */
export function isListening() {
    return listening;
}

/**
 * Sets the mouth animation interval
 * @param {number} interval - The interval ID for the mouth animation
 */
export function setMouthInterval(interval) {
    mouthInterval = interval;
}

/**
 * Gets the mouth animation interval
 * @returns {number} The interval ID for the mouth animation
 */
export function getMouthInterval() {
    return mouthInterval;
}

/**
 * Updates the last word time to the current timestamp
 */
export function updateWordTime() {
    lastWordTime = Date.now();
}

/**
 * Updates the last character time to the current timestamp
 */
export function updateCharTime() {
    lastCharTime = Date.now();
}

/**
 * Sets the available voices
 * @param {Array<SpeechSynthesisVoice>} newVoices - The array of available voices
 */
export function setVoices(newVoices) {
    voices = newVoices;
}

/**
 * Gets the available voices
 * @returns {Array<SpeechSynthesisVoice>} The array of available voices
 */
export function getVoices() {
    return voices;
} 