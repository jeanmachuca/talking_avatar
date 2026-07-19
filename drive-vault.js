const DriveVault = (() => {
  let cachedConfig = null;

  async function getConfig() {
    if (cachedConfig) return cachedConfig;

    const token = Auth.getToken();
    if (!token) return null;

    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${APP_CONFIG.driveFileName}'&fields=files(id,name)`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        console.warn('Drive list failed:', res.status);
        return null;
      }

      const { files } = await res.json();
      if (files.length === 0) return null;

      const content = await fetch(
        `https://www.googleapis.com/drive/v3/files/${files[0].id}?alt=media`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!content.ok) {
        console.warn('Drive read failed:', content.status);
        return null;
      }

      cachedConfig = await content.json();
      return cachedConfig;
    } catch (e) {
      console.warn('Drive vault read error:', e);
      return null;
    }
  }

  async function saveConfig(config) {
    const token = Auth.getToken();
    if (!token) throw new Error('Not authenticated');

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });

    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${APP_CONFIG.driveFileName}'&fields=files(id)`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!listRes.ok) throw new Error('Failed to list Drive files');
    const { files } = await listRes.json();

    if (files.length > 0) {
      const updateRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${files[0].id}?uploadType=media`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
          body: blob,
        }
      );
      if (!updateRes.ok) throw new Error('Failed to update Drive file');
    } else {
      const metadata = { name: APP_CONFIG.driveFileName, parents: ['appDataFolder'] };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', blob);

      const createRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );
      if (!createRes.ok) throw new Error('Failed to create Drive file');
    }

    cachedConfig = config;
  }

  function clearCache() { cachedConfig = null; }

  return { getConfig, saveConfig, clearCache };
})();
