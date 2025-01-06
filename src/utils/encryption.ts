const getEncryptionKey = () => {
  // In a real app, this should be a secure key management system
  // For demo purposes, we're using a fixed key
  return new TextEncoder().encode('your-32-byte-secret-key-here-12345');
};

export const encryptText = async (text: string): Promise<{ encryptedText: string; iv: string }> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey(
    'raw',
    getEncryptionKey(),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encodedText = new TextEncoder().encode(text);
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedText
  );

  const encryptedText = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  const ivString = btoa(String.fromCharCode(...iv));

  return { encryptedText, iv: ivString };
};

export const decryptText = async (encryptedText: string, iv: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    getEncryptionKey(),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(Array.from(atob(iv), c => c.charCodeAt(0))) },
    key,
    new Uint8Array(Array.from(atob(encryptedText), c => c.charCodeAt(0)))
  );

  return new TextDecoder().decode(decryptedBuffer);
};