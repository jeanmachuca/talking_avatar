import { cleanMarkdown } from './speech.js';
import { updateStatusText } from './ui.js';
import { TEXTS } from './constants.js';

const config = {
    apiKey: '',
    azureResourceName: '',
    deploymentName: '',
};

export async function loadConfig() {
    if (typeof Auth !== 'undefined' && Auth.isGoogleUser() && Auth.getToken()) {
        try {
            const driveConfig = await DriveVault.getConfig();
            if (driveConfig) {
                config.apiKey = driveConfig.apiKey || '';
                config.azureResourceName = driveConfig.resourceName || '';
                config.deploymentName = driveConfig.deploymentName || '';
                populateForm();
                return;
            }
        } catch (e) {
            console.warn('Failed to load config from Drive:', e);
        }
    }

    config.apiKey = localStorage.getItem('azure_openai_api_key') || '';
    config.azureResourceName = localStorage.getItem('azure_resource_name') || '';
    config.deploymentName = localStorage.getItem('deployment_name') || '';
    populateForm();
}

function populateForm() {
    const apiKeyEl = document.getElementById('apiKey');
    const resourceEl = document.getElementById('azureResourceName');
    const deploymentEl = document.getElementById('deploymentName');
    if (apiKeyEl) apiKeyEl.value = config.apiKey;
    if (resourceEl) resourceEl.value = config.azureResourceName;
    if (deploymentEl) deploymentEl.value = config.deploymentName;
}

export async function saveApiKey() {
    config.apiKey = document.getElementById('apiKey').value;
    await persistConfig();
}

export async function saveAzureConfig() {
    config.azureResourceName = document.getElementById('azureResourceName').value;
    config.deploymentName = document.getElementById('deploymentName').value;
    await persistConfig();
}

async function persistConfig() {
    if (typeof Auth !== 'undefined' && Auth.isGoogleUser() && Auth.getToken()) {
        try {
            await DriveVault.saveConfig({
                apiKey: config.apiKey,
                resourceName: config.azureResourceName,
                deploymentName: config.deploymentName,
            });
            updateStatusText('configSaved');
            return;
        } catch (e) {
            console.warn('Failed to save config to Drive:', e);
            updateStatusText('configSaveError');
        }
    }

    localStorage.setItem('azure_openai_api_key', config.apiKey);
    localStorage.setItem('azure_resource_name', config.azureResourceName);
    localStorage.setItem('deployment_name', config.deploymentName);
    updateStatusText('configSaved');
}

export function isConfigValid() {
    return config.apiKey && config.azureResourceName && config.deploymentName;
}

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
                'api-key': config.apiKey,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: TEXTS[isSpanish ? 'es' : 'en'].systemPrompt,
                    },
                    {
                        role: 'user',
                        content: userInput,
                    },
                ],
                max_tokens: isSpanish ? 100 : 200,
                temperature: 0.7,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0,
            }),
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
