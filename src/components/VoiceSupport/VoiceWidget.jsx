import React, { useEffect, useState, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { useToast } from '../../hooks/useToast';
import { SkeletonLoader } from '../Loading/SkeletonLoader';
import './voicewidget.css';

function MicIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8"  y1="23" x2="16" y2="23"/>
    </svg>
  );
}

function MicOffIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8"  y1="23" x2="16" y2="23"/>
    </svg>
  );
}

export function VoiceWidget({ onStatusChange, onTranscriptUpdate }) {
  const { addToast } = useToast();

  const [isReady,       setIsReady]       = useState(false);
  const [hasConfigError, setHasConfigError] = useState(false);
  const [isCallActive,  setIsCallActive]  = useState(false);
  const [isMuted,       setIsMuted]       = useState(false);
  const [isConnecting,  setIsConnecting]  = useState(false);

  const vapiRef          = useRef(null);
  const transcriptRef    = useRef([]);

  // Keep callback refs stable so Vapi event handlers never go stale
  const onStatusChangeRef     = useRef(onStatusChange);
  const onTranscriptUpdateRef = useRef(onTranscriptUpdate);
  const addToastRef           = useRef(addToast);

  useEffect(() => { onStatusChangeRef.current     = onStatusChange;     }, [onStatusChange]);
  useEffect(() => { onTranscriptUpdateRef.current = onTranscriptUpdate; }, [onTranscriptUpdate]);
  useEffect(() => { addToastRef.current           = addToast;           }, [addToast]);

  const publicKey   = import.meta.env.VITE_VAPI_PUBLIC_KEY;
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

  // Push a new transcript array to state + parent
  const pushTranscript = useCallback((msgs) => {
    transcriptRef.current = msgs;
    onTranscriptUpdateRef.current?.(msgs);
  }, []);

  // ── Vapi initialisation (once on mount) ──────────────────────────
  useEffect(() => {
    if (!publicKey || !assistantId) {
      addToastRef.current('Configuration error: VAPI credentials missing.', 'error');
      setHasConfigError(true);
      onStatusChangeRef.current?.('error');
      return;
    }

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setIsCallActive(true);
      setIsConnecting(false);
      onStatusChangeRef.current?.('ready');
      addToastRef.current('Connected.', 'success');
    });

    vapi.on('call-end', () => {
      setIsCallActive(false);
      setIsConnecting(false);
      setIsMuted(false);
      onStatusChangeRef.current?.('idle');
    });

    // User started speaking
    vapi.on('speech-start', () => {
      onStatusChangeRef.current?.('listening');
    });

    // User stopped speaking — AI is about to respond
    vapi.on('speech-end', () => {
      onStatusChangeRef.current?.('processing');
    });

    vapi.on('message', (msg) => {
      if (msg.type !== 'transcript') return;

      const { role, transcriptType, transcript } = msg;
      if (!transcript?.trim()) return;

      const current = transcriptRef.current;
      const last    = current[current.length - 1];

      if (transcriptType === 'partial') {
        // Update the last entry in-place if it's an ongoing partial from the same role
        if (last?.isPartial && last.role === role) {
          pushTranscript([...current.slice(0, -1), { ...last, text: transcript }]);
        } else {
          pushTranscript([...current, {
            id:        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            role,
            text:      transcript,
            timestamp: new Date(),
            isPartial: true,
          }]);
        }
      } else if (transcriptType === 'final') {
        if (last?.isPartial && last.role === role) {
          // Finalise the existing partial
          pushTranscript([...current.slice(0, -1), { ...last, text: transcript, isPartial: false }]);
        } else {
          pushTranscript([...current, {
            id:        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            role,
            text:      transcript,
            timestamp: new Date(),
            isPartial: false,
          }]);
        }
        // AI finished its turn — return to ready (waiting for user)
        if (role === 'assistant') {
          onStatusChangeRef.current?.('ready');
        }
      }
    });

    vapi.on('call-start-failed', (event) => {
      setIsConnecting(false);
      onStatusChangeRef.current?.('idle');
      addToastRef.current(`Could not connect: ${event.error ?? 'unknown error'}`, 'error');
    });

    vapi.on('error', (err) => {
      console.error('[Vapi]', err);
      setIsCallActive(false);
      setIsConnecting(false);
      addToastRef.current(err?.message ?? 'Voice assistant error. Please try again.', 'error');
      onStatusChangeRef.current?.('error');
    });

    setIsReady(true);

    return () => {
      vapi.stop();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentionally once

  // ── Call controls ─────────────────────────────────────────────────
  const startCall = useCallback(async () => {
    if (!vapiRef.current || isConnecting) return;
    // Clear transcript before new session
    pushTranscript([]);
    setIsConnecting(true);
    onStatusChangeRef.current?.('initializing');
    try {
      await vapiRef.current.start(assistantId);
    } catch (err) {
      console.error('[Vapi] start failed:', err);
      setIsConnecting(false);
      onStatusChangeRef.current?.('idle');
      addToastRef.current('Failed to start session. Please try again.', 'error');
    }
  }, [isConnecting, assistantId, pushTranscript]);

  const endCall = useCallback(() => {
    vapiRef.current?.stop();
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const next = !isMuted;
    vapiRef.current.setMuted(next);
    setIsMuted(next);
    addToastRef.current(next ? 'Microphone muted.' : 'Microphone unmuted.', 'info');
  }, [isMuted]);

  // ── Render ────────────────────────────────────────────────────────
  if (hasConfigError) {
    return (
      <div className="widget-error">
        Voice assistant unavailable. Check VAPI configuration.
      </div>
    );
  }

  if (!isReady) {
    return <SkeletonLoader />;
  }

  return (
    <div className="voice-widget">
      {!isCallActive ? (
        <div className="widget-idle">
          <div className="widget-mic-icon">
            <MicIcon size={26} />
          </div>
          <p className="widget-description">
            Speak directly with our AI support assistant
          </p>
          <button
            className="btn-start"
            onClick={startCall}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting\u2026' : 'Start Voice Session'}
          </button>
        </div>
      ) : (
        <div className="widget-active">
          <div className="call-live-badge">
            <span className="call-live-dot" />
            Session active
          </div>
          <div className="call-controls">
            <button
              className={`btn-mute${isMuted ? ' muted' : ''}`}
              onClick={toggleMute}
              aria-pressed={isMuted}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon size={18} />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button className="btn-end" onClick={endCall}>
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
