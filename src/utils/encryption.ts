const getEncryptionKey = async () => {
  // Generate a consistent key using a hash of a secret
  const encoder = new TextEncoder();
  const data = encoder.encode('your-32-byte-secret-key-here-12345');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptText = async (text: string): Promise<{ encryptedText: string; iv: string }> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getEncryptionKey();

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
  const key = await getEncryptionKey();

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(Array.from(atob(iv), c => c.charCodeAt(0))) },
    key,
    new Uint8Array(Array.from(atob(encryptedText), c => c.charCodeAt(0)))
  );

  return new TextDecoder().decode(decryptedBuffer);
};