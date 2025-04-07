/**
 * Text constants for the application in both English and Spanish
 * @type {Object}
 */
export const TEXTS = {
    /**
     * English text constants
     * @type {Object}
     */
    en: {
        // UI Elements
        placeholder: 'Type something for the avatar to say...',
        speakButton: 'Speak',
        stopButton: 'Stop',
        echoMode: 'Echo Mode',
        chatMode: 'Chat Mode',
        english: 'English',
        spanish: 'Spanish',
        showSettings: 'Show Settings',
        hideSettings: 'Hide Settings',
        initialMessage: 'Hello! I am your talking avatar. How can I help you today?',
        
        // API Inputs
        apiKeyPlaceholder: 'Enter your Azure OpenAI API Key',
        azureResourcePlaceholder: 'Enter your Azure Resource Name',
        deploymentNamePlaceholder: 'Enter your Deployment Name',
        
        // Status Messages
        listening: 'Listening...',
        youSaid: 'You said: ',
        gettingAIResponse: 'Getting AI response...',
        aiResponseObtained: 'AI response ready',
        errorGettingResponse: 'Error getting response',
        enterConfigFirst: 'Please enter your Azure OpenAI configuration first',
        recognitionNotSupported: 'Speech recognition is not supported in this browser',
        errorStartingRecognition: 'Error starting speech recognition',
        error: 'Error: ',
        
        // System Messages
        systemPrompt: 'You are a helpful AI assistant. Keep your responses concise and friendly.'
    },
    es: {
        // UI Elements
        placeholder: 'Escribe algo para que el avatar lo diga...',
        speakButton: 'Hablar',
        stopButton: 'Detener',
        echoMode: 'Modo Eco',
        chatMode: 'Modo Chat',
        english: 'Inglés',
        spanish: 'Español',
        showSettings: 'Mostrar Configuración',
        hideSettings: 'Ocultar Configuración',
        initialMessage: '¡Hola! Soy tu avatar parlante. ¿Cómo puedo ayudarte hoy?',
        
        // API Inputs
        apiKeyPlaceholder: 'Ingresa tu clave API de Azure OpenAI',
        azureResourcePlaceholder: 'Ingresa el nombre de tu recurso de Azure',
        deploymentNamePlaceholder: 'Ingresa el nombre de tu despliegue',
        
        // Status Messages
        listening: 'Escuchando...',
        youSaid: 'Dijiste: ',
        gettingAIResponse: 'Obteniendo respuesta de IA...',
        aiResponseObtained: 'Respuesta de IA lista',
        errorGettingResponse: 'Error al obtener respuesta',
        enterConfigFirst: 'Por favor ingresa tu configuración de Azure OpenAI primero',
        recognitionNotSupported: 'El reconocimiento de voz no es compatible con este navegador',
        errorStartingRecognition: 'Error al iniciar el reconocimiento de voz',
        error: 'Error: ',
        
        // System Messages
        systemPrompt: 'Eres un asistente de IA útil. Mantén tus respuestas concisas y amigables.'
    }
}; 