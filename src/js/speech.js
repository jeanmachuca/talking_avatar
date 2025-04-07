import { 
    speechRecognition,
    speaking,
    listening,
    mouthInterval,
    lastWordTime,
    lastCharTime,
    averageWordDuration,
    voices,
    setSpeaking,
    isSpeaking,
    setListening,
    isListening,
    setMouthInterval,
    getMouthInterval,
    updateWordTime,
    updateCharTime,
    setVoices,
    getVoices
} from './state.js';

export const speechSynthesis = window.speechSynthesis;

// Initialize voices when they are loaded
speechSynthesis.onvoiceschanged = () => {
    setVoices(speechSynthesis.getVoices());
};

export function getSelectedVoice() {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    
    if (selectedLanguage === 'en') {
        return getVoices().find(voice => voice.name.includes('Aaron'));
    } else {
        return getVoices().find(voice => voice.name.includes('Google español'));
    }
}

export function cleanMarkdown(text) {
    // Remove markdown formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic
        .replace(/`(.*?)`/g, '$1')       // Remove inline code
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links, keep text
        .replace(/#{1,6}\s/g, '')        // Remove headers
        .replace(/>\s(.*)/g, '$1')       // Remove blockquotes
        .replace(/\n\s*[-*+]\s/g, '\n')  // Remove list markers
        .replace(/\n\s*\d+\.\s/g, '\n')  // Remove numbered lists
        .replace(/\n{3,}/g, '\n\n')      // Normalize multiple newlines
        .trim();
}

export function animateMouth() {
    const avatar = document.getElementById('avatar');
    avatar.classList.toggle('talking');
}

export function updateMouthAnimation() {
    if (!isSpeaking()) return;
    clearInterval(getMouthInterval());
    setMouthInterval(setInterval(animateMouth, 100));
}

export function stopMouthAnimation() {
    clearInterval(getMouthInterval());
    const avatar = document.getElementById('avatar');
    avatar.classList.remove('talking');
}

export function stopSpeaking() {
    setSpeaking(false);
    document.getElementById('speakButton').disabled = false;
    stopMouthAnimation();
}

export function stop() {
    // Cancel all pending utterances
    speechSynthesis.cancel();
    
    // Reset speaking state
    stopSpeaking();
    
    // Clear any pending timeouts
    const pendingUtterances = speechSynthesis.getVoices().filter(voice => 
        voice.utterance && voice.utterance.onend
    );
    
    pendingUtterances.forEach(voice => {
        if (voice.utterance) {
            voice.utterance.onend = null;
        }
    });
}

export function speak() {
    if (isSpeaking()) return;
    
    const text = document.getElementById('textToSpeak').value;
    if (text) {
        setSpeaking(true);
        const cleanText = cleanMarkdown(text);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Set the selected voice
        const selectedVoice = getSelectedVoice();
        const isSpanish = document.querySelector('input[name="language"]:checked').value === 'es';
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
            
            // Adjust rate for better synchronization and readability
            utterance.rate = isSpanish ? 0.85 : 0.9;
            utterance.pitch = isSpanish ? 0.9 : 1.0;
        }
        
        // Split long text into chunks if needed
        if (cleanText.length > 200) {
            const chunkSize = isSpanish ? 80 : 200;
            const chunks = cleanText.match(new RegExp(`.{1,${chunkSize}}(?=\\s|$)`, 'g')) || [];
            let currentChunk = 0;
            let isSpeaking = true;
            
            utterance.onend = () => {
                if (!isSpeaking) return;
                
                currentChunk++;
                if (currentChunk < chunks.length) {
                    setTimeout(() => {
                        if (!isSpeaking) return;
                        
                        const nextUtterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
                        nextUtterance.voice = selectedVoice;
                        nextUtterance.lang = selectedVoice.lang;
                        nextUtterance.rate = isSpanish ? 0.85 : 0.9;
                        nextUtterance.pitch = isSpanish ? 0.9 : 1.0;
                        
                        nextUtterance.onerror = (event) => {
                            if (event.error === 'interrupted') {
                                // Ignore interruption errors when stopping
                                return;
                            }
                            console.error('Chunk speech synthesis error:', event);
                        };
                        
                        nextUtterance.onend = utterance.onend;
                        speechSynthesis.speak(nextUtterance);
                    }, isSpanish ? 500 : 100);
                } else {
                    stopSpeaking();
                }
            };
        } else {
            utterance.onend = () => {
                stopSpeaking();
            };
        }
        
        utterance.onstart = () => {
            document.getElementById('speakButton').disabled = true;
            updateMouthAnimation();
        };

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                updateMouthAnimation();
            }
        };

        utterance.onpause = () => {
            stopMouthAnimation();
        };

        utterance.onresume = () => {
            updateMouthAnimation();
        };

        utterance.onerror = (event) => {
            if (event.error === 'interrupted') {
                // Ignore interruption errors when stopping
                return;
            }
            console.error('Speech synthesis error:', event);
            stopSpeaking();
        };

        speechSynthesis.speak(utterance);
    }
} 