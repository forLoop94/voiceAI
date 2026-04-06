import { useState, useCallback } from 'react';

export function useVoiceStatus() {
  const [status, setStatus] = useState('idle');
  const [micPermission, setMicPermission] = useState('unknown');

  // We can add logic to check mic permissions here
  const checkMicPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' });
      setMicPermission(result.state);
      
      result.onchange = () => {
        setMicPermission(result.state);
      };
    } catch (e) {
      // Browser might not support microphone permission query
      console.warn('Microphone permission query not supported', e);
    }
  }, []);

  return {
    status,
    setStatus,
    micPermission,
    setMicPermission,
    checkMicPermission
  };
}
