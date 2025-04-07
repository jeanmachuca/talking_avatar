import { cleanMarkdown } from './speech.js';
import { updateStatusText } from './ui.js';
import { TEXTS } from './constants.js';

/**
 * Configuration object for Azure OpenAI API
 * @type {Object}
 */
const config = {
    /** @type {string} */
    apiKey: localStorage.getItem('azure_openai_api_key') || '',
    /** @type {string} */
    azureResourceName: localStorage.getItem('azure_resource_name') || '',
    /** @type {string} */
    deploymentName: localStorage.getItem('deployment_name') || ''
};

/**
 * Saves the API key to local storage
 */
export function saveApiKey() {
    config.apiKey = document.getElementById('apiKey').value;
    localStorage.setItem('azure_openai_api_key', config.apiKey);
}

/**
 * Saves the Azure configuration to local storage
 */
export function saveAzureConfig() {
    config.azureResourceName = document.getElementById('azureResourceName').value;
    config.deploymentName = document.getElementById('deploymentName').value;
    localStorage.setItem('azure_resource_name', config.azureResourceName);
    localStorage.setItem('deployment_name', config.deploymentName);
}

/**
 * Checks if the API configuration is valid
 * @returns {boolean} True if configuration is valid, false otherwise
 */
function isConfigValid() {
    return config.apiKey && config.azureResourceName && config.deploymentName;
}

/**
 * Gets a chat response from the Azure OpenAI API
 * @param {string} userInput - The user's input text
 * @returns {Promise<string|null>} The AI's response or null if there was an error
 */
export async function getChatResponse(userInput) {
    if (!isConfigValid()) {
        updateStatusText('enterConfigFirst');
        return null;
    }

    const isSpanish = document.querySelector('input[name="language"]:checked').value === 'es';
    const azureEndpoint = `https://${config.azureResourceName}.openai.azure.com`;
    const apiVersion = '2024-02-15-preview';

    try {
        const response = await fetch(`${azureEndpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=${apiVersion}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': config.apiKey
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: TEXTS[isSpanish ? 'es' : 'en'].systemPrompt
                    },
                    {
                        role: "user",
                        content: userInput
                    }
                ],
                max_tokens: isSpanish ? 100 : 200,
                temperature: 0.7,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });

        if (!response.ok) {
            throw new Error(`Azure OpenAI API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = cleanMarkdown(data.choices[0].message.content);
        
        updateStatusText('aiResponseObtained');
        return aiResponse;
    } catch (error) {
        console.error('Error calling Azure OpenAI API:', error);
        updateStatusText('errorGettingResponse');
        return null;
    }
} 