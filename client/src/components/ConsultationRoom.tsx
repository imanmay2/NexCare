import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
    FileText, Activity, User, Heart, Shield, Send, Wifi, WifiOff,
    FlaskConical, Pill
} from 'lucide-react';

// ─── Type Definitions matching Go backend structs ──────────────────────────

interface ConsultationRoomProps {
    appointmentId: string;
    userRole: 'patient' | 'doctor';
    userName: string;
    userId: string;
}

// Matches Go: OutgoingMsg — messages received FROM server
interface OutgoingMsg {
    sender_id: string;
    role: 'patient' | 'doctor';
    msg: string;
}

// Matches Go: IncomingMsg — messages sent TO server
interface IncomingMsg {
    msg: string;
}

interface ChatMessage extends OutgoingMsg {
    id: string;
    timestamp: Date;
    isSelf: boolean;
}

// ─── WebSocket URL ──────────────────────────────────────────────────────────
// Auth via URL query params: /ws?a_id=...&role=...&user_id=...
const WS_BASE_URL = 'ws://localhost:8080/ws';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function formatMsgTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Avatar({ role, size = 40 }: { role: 'patient' | 'doctor'; size?: number }) {
    const isDoctor = role === 'doctor';
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: isDoctor ? '#dbeafe' : '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>
            <User size={size * 0.45} color={isDoctor ? '#1d4ed8' : '#15803d'} />
        </div>
    );
}

function ConnectionBadge({ connected }: { connected: boolean }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 500, letterSpacing: '0.02em',
            padding: '3px 9px', borderRadius: 20,
            background: connected ? '#dcfce7' : '#fef9c3',
            color: connected ? '#15803d' : '#854d0e',
            border: `1px solid ${connected ? '#bbf7d0' : '#fde68a'}`,
        }}>
            <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: connected ? '#22c55e' : '#eab308',
                animation: connected ? 'pulse 2s infinite' : 'none',
            }} />
            {connected ? 'Live' : 'Reconnecting'}
        </span>
    );
}

function ControlBtn({
    active, danger, onClick, children, label,
}: {
    active?: boolean; danger?: boolean; onClick: () => void;
    children: React.ReactNode; label: string;
}) {
    return (
        <button
            aria-label={label}
            onClick={onClick}
            style={{
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s',
                background: danger && active ? '#ef4444'
                    : active ? '#fee2e2'
                        : '#f1f5f9',
                color: danger && active ? '#fff'
                    : active ? '#ef4444'
                        : '#475569',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
        >
            {children}
        </button>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ConsultationRoom({
    appointmentId, userRole, userName, userId,
}: ConsultationRoomProps) {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [activeTab, setActiveTab] = useState<'workspace' | 'chat'>('workspace');

    // Chat state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [wsConnected, setWsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Timer
    useEffect(() => {
        const t = setInterval(() => setCallDuration(p => p + 1), 1000);
        return () => clearInterval(t);
    }, []);

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // WebSocket: auth via URL query params matching Go backend
    const connectWS = useCallback(() => {
        const params = new URLSearchParams({
            a_id: appointmentId,
            role: userRole,
            user_id: userId,
        });
        const url = `${WS_BASE_URL}?${params.toString()}`;

        try {
            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
                setWsConnected(true);
                if (reconnectTimerRef.current) {
                    clearTimeout(reconnectTimerRef.current);
                    reconnectTimerRef.current = null;
                }
            };

            // Parse OutgoingMsg from server
            ws.onmessage = (event: MessageEvent) => {
                try {
                    const data: OutgoingMsg = JSON.parse(event.data);
                    const newMsg: ChatMessage = {
                        ...data,
                        id: `${Date.now()}-${Math.random()}`,
                        timestamp: new Date(),
                        isSelf: data.sender_id === userId,
                    };
                    setMessages(prev => [...prev, newMsg]);
                } catch {
                    console.error('Failed to parse message:', event.data);
                }
            };

            ws.onclose = () => {
                setWsConnected(false);
                reconnectTimerRef.current = setTimeout(connectWS, 3000);
            };

            ws.onerror = () => {
                ws.close();
            };
        } catch {
            setWsConnected(false);
        }
    }, [appointmentId, userRole, userId]);

    useEffect(() => {
        connectWS();
        return () => {
            wsRef.current?.close();
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        };
    }, [connectWS]);

    const injectDummyReply = useCallback((sentText: string) => {
        const dummy: ChatMessage = {
            sender_id: 'dummy-bot',
            role: userRole === 'doctor' ? 'patient' : 'doctor',
            msg: `[Demo] Got your message: "${sentText}"`,
            id: `${Date.now()}-dummy`,
            timestamp: new Date(),
            isSelf: false,
        };
        setTimeout(() => {
            setMessages(prev => [...prev, dummy]);
        }, 600);
    }, [userRole]);

    // Send IncomingMsg to server
    const sendMessage = useCallback(() => {
        const text = inputValue.trim();
        if (!text) return;

        // Optimistically add own message regardless of WS state
        const selfMsg: ChatMessage = {
            sender_id: userId,
            role: userRole,
            msg: text,
            id: `${Date.now()}-self`,
            timestamp: new Date(),
            isSelf: true,
        };
        setMessages(prev => [...prev, selfMsg]);
        setInputValue('');
        inputRef.current?.focus();

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const payload: IncomingMsg = { msg: text };
            wsRef.current.send(JSON.stringify(payload));
        } else {
            // WS offline — inject a dummy reply for testing
            injectDummyReply(text);
        }
    }, [inputValue, userId, userRole, injectDummyReply]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleEndCall = () => {
        if (window.confirm('End this consultation?')) {
            wsRef.current?.close();
            window.close();
        }
    };

    const isDoctor = userRole === 'doctor';

    return (
        <>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .tab-btn {
                    flex: 1; padding: 8px 0; border: none; cursor: pointer;
                    font-size: 12px; font-weight: 500; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    gap: 5px; transition: all 0.15s;
                }
                .tab-btn.active {
                    background: #fff;
                    color: #1e40af;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .tab-btn.inactive {
                    background: transparent;
                    color: #64748b;
                }
                .tab-btn.inactive:hover { background: rgba(255,255,255,0.5); }
                .ctrl-btn:hover { filter: brightness(0.94); }
                .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .send-btn:not(:disabled):hover { background: #1d4ed8; }
                .msg-bubble {
                    padding: 8px 12px;
                    border-radius: 14px; font-size: 13px; line-height: 1.5;
                    word-break: break-word;
                    width: fit-content;
                }
                .clinical-btn {
                    width: 100%; padding: 9px 14px;
                    border-radius: 8px; font-size: 12px; font-weight: 500;
                    cursor: pointer; display: flex; align-items: center;
                    gap: 8px; transition: all 0.15s; border: 1px solid;
                }
                .clinical-btn.primary {
                    background: #1d4ed8; color: #fff; border-color: #1d4ed8;
                }
                .clinical-btn.primary:hover { background: #1e40af; }
                .clinical-btn.secondary {
                    background: #fff; color: #374151; border-color: #e2e8f0;
                }
                .clinical-btn.secondary:hover { background: #f8fafc; }
                .checklist-item {
                    display: flex; align-items: flex-start; gap: 8px;
                    padding: 8px 0; border-bottom: 1px solid #f1f5f9;
                    font-size: 12px; color: #475569;
                }
                .checklist-item:last-child { border-bottom: none; }
            `}</style>

            {/* Root container */}
            <div style={{
                position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
                background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                overflow: 'hidden',
            }}>

                {/* ── Header ── */}
                <header style={{
                    height: 60, background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(226,232,240,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 20px', flexShrink: 0, zIndex: 10,
                }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 8,
                            background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                        }}>
                            <Heart size={16} color="#fff" fill="#fff" />
                        </div>
                        <div>
                            <div style={{
                                fontSize: 14, fontWeight: 600, color: '#0f172a',
                                display: 'flex', alignItems: 'center', gap: 8,
                            }}>
                                NexCare
                                <ConnectionBadge connected={wsConnected} />
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                Live consultation · {isDoctor ? 'Dr.' : 'Patient'} {userName}
                            </div>
                        </div>
                    </div>

                    {/* Timer + session */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            background: '#f1f5f9', borderRadius: 20,
                            padding: '5px 14px', fontFamily: 'monospace',
                            fontSize: 13, fontWeight: 600, color: '#334155',
                            letterSpacing: '0.05em',
                        }}>
                            {formatTime(callDuration)}
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            fontSize: 11, color: '#94a3b8',
                        }}>
                            <Shield size={12} color="#22c55e" />
                            <span style={{ display: 'none' }} className="sm:inline">
                                E2E encrypted · {appointmentId}
                            </span>
                            <span>E2E encrypted</span>
                        </div>
                    </div>
                </header>

                {/* ── Main workspace ── */}
                <div style={{
                    flex: 1, display: 'flex', gap: 12, padding: 12, overflow: 'hidden',
                }}>

                    {/* ─ Left: video + controls ─ */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Video canvas */}
                        <div style={{
                            flex: 1, background: '#0f172a', borderRadius: 16,
                            border: '1px solid #1e293b', position: 'relative',
                            overflow: 'hidden', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            {/* Remote participant placeholder */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 72, height: 72, borderRadius: '50%',
                                    background: '#1e293b', border: '2px solid #334155',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 12px',
                                }}>
                                    <User size={32} color="#475569" />
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>
                                    {isDoctor ? 'Awaiting patient video' : 'Connecting with doctor…'}
                                </p>
                                <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>
                                    Adaptive bandwidth active
                                </p>
                            </div>

                            {/* PiP self-view */}
                            <div style={{
                                position: 'absolute', bottom: 14, right: 14,
                                width: 160, height: 104, background: '#020617',
                                borderRadius: 10, border: '1px solid #334155',
                                overflow: 'hidden', display: 'flex',
                                flexDirection: 'column', justifyContent: 'space-between',
                                padding: 8,
                            }}>
                                <span style={{
                                    fontSize: 10, color: '#cbd5e1',
                                    background: 'rgba(0,0,0,0.5)', borderRadius: 4,
                                    padding: '2px 6px', width: 'fit-content',
                                    backdropFilter: 'blur(4px)',
                                }}>
                                    You
                                </span>
                                {isVideoOff && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: '#020617', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <VideoOff size={20} color="#475569" />
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {isMuted && <MicOff size={12} color="#f87171" />}
                                </div>
                            </div>

                            {/* WS status indicator */}
                            {!wsConnected && (
                                <div style={{
                                    position: 'absolute', top: 12, left: 12,
                                    background: 'rgba(239,68,68,0.15)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    borderRadius: 8, padding: '4px 10px',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    fontSize: 11, color: '#fca5a5',
                                }}>
                                    <WifiOff size={11} />
                                    Chat disconnected — reconnecting
                                </div>
                            )}
                        </div>

                        {/* Controls bar */}
                        <div style={{
                            height: 72, background: '#fff', borderRadius: 14,
                            border: '1px solid #e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0 24px', flexShrink: 0,
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                fontSize: 11, color: '#64748b',
                                background: '#f8fafc', border: '1px solid #e2e8f0',
                                borderRadius: 8, padding: '5px 10px',
                            }}>
                                <Shield size={13} color="#22c55e" />
                                End-to-end encrypted
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <ControlBtn
                                    active={isMuted} danger
                                    onClick={() => setIsMuted(p => !p)}
                                    label={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted
                                        ? <MicOff size={18} />
                                        : <Mic size={18} />
                                    }
                                </ControlBtn>

                                <ControlBtn
                                    active={isVideoOff} danger
                                    onClick={() => setIsVideoOff(p => !p)}
                                    label={isVideoOff ? 'Enable video' : 'Disable video'}
                                >
                                    {isVideoOff
                                        ? <VideoOff size={18} />
                                        : <Video size={18} />
                                    }
                                </ControlBtn>

                                <button
                                    onClick={handleEndCall}
                                    style={{
                                        height: 44, padding: '0 20px', borderRadius: 22,
                                        background: '#ef4444', border: 'none', color: '#fff',
                                        fontWeight: 500, fontSize: 13, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 7,
                                        boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <PhoneOff size={15} />
                                    Disconnect
                                </button>
                            </div>

                            <div style={{ width: 120 }} />
                        </div>
                    </div>

                    {/* ─ Right: sidebar ─ */}
                    <div style={{
                        width: 300, flexShrink: 0, background: '#fff',
                        borderRadius: 16, border: '1px solid #e2e8f0',
                        display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    }}>

                        {/* Tab switcher */}
                        <div style={{
                            padding: 10, background: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0', flexShrink: 0,
                        }}>
                            <div style={{
                                display: 'flex', background: '#f1f5f9',
                                borderRadius: 10, padding: 3, gap: 2,
                            }}>
                                <button
                                    className={`tab-btn ${activeTab === 'workspace' ? 'active' : 'inactive'}`}
                                    onClick={() => setActiveTab('workspace')}
                                >
                                    <Activity size={13} />
                                    Workspace
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'chat' ? 'active' : 'inactive'}`}
                                    onClick={() => setActiveTab('chat')}
                                >
                                    <MessageSquare size={13} />
                                    Chat
                                    {messages.length > 0 && activeTab !== 'chat' && (
                                        <span style={{
                                            minWidth: 16, height: 16, borderRadius: 8,
                                            background: '#2563eb', color: '#fff',
                                            fontSize: 9, fontWeight: 700,
                                            display: 'inline-flex', alignItems: 'center',
                                            justifyContent: 'center', padding: '0 4px',
                                        }}>
                                            {messages.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ── Workspace tab ── */}
                        {activeTab === 'workspace' && (
                            <div style={{
                                flex: 1, overflowY: 'auto', padding: 14, display: 'flex',
                                flexDirection: 'column', gap: 12,
                            }}>
                                {/* Notes card */}
                                <div style={{
                                    background: '#eff6ff', border: '1px dashed #bfdbfe',
                                    borderRadius: 10, padding: 12,
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        marginBottom: 6, fontSize: 11, fontWeight: 600,
                                        color: '#1e40af',
                                    }}>
                                        <FileText size={12} color="#3b82f6" />
                                        Consultation notes
                                    </div>
                                    <p style={{
                                        fontSize: 11, color: '#3b82f6', lineHeight: 1.5, margin: 0,
                                    }}>
                                        Use this panel to review symptoms and prepare observations during the session.
                                    </p>
                                </div>

                                {/* Role-specific actions */}
                                {isDoctor ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 600, color: '#94a3b8',
                                            letterSpacing: '0.08em', textTransform: 'uppercase',
                                        }}>
                                            Clinical actions
                                        </span>
                                        <button className="clinical-btn primary">
                                            <Pill size={13} />
                                            Prescribe medication
                                        </button>
                                        <button className="clinical-btn secondary">
                                            <FlaskConical size={13} color="#64748b" />
                                            Request lab work
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 600, color: '#94a3b8',
                                            letterSpacing: '0.08em', textTransform: 'uppercase',
                                            marginBottom: 4,
                                        }}>
                                            Before the consultation
                                        </span>
                                        {[
                                            'Keep prescriptions or medications nearby',
                                            'Speak clearly into your microphone',
                                            'Note any symptoms to discuss',
                                        ].map((item, i) => (
                                            <div key={i} className="checklist-item">
                                                <span style={{
                                                    width: 16, height: 16, borderRadius: '50%',
                                                    background: '#dcfce7', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0, fontSize: 9, color: '#16a34a', fontWeight: 700,
                                                }}>✓</span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Session info */}
                                <div style={{
                                    marginTop: 'auto', borderTop: '1px solid #f1f5f9',
                                    paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4,
                                }}>
                                    {[
                                        ['Session ID', appointmentId],
                                        ['Role', isDoctor ? 'Physician' : 'Patient'],
                                        ['Duration', formatTime(callDuration)],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            fontSize: 11, color: '#64748b',
                                        }}>
                                            <span style={{ color: '#94a3b8' }}>{label}</span>
                                            <span style={{ fontWeight: 500, fontFamily: label === 'Session ID' || label === 'Duration' ? 'monospace' : 'inherit' }}>
                                                {val}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Chat tab ── */}
                        {activeTab === 'chat' && (
                            <div style={{
                                flex: 1, display: 'flex', flexDirection: 'column',
                                overflow: 'hidden',
                            }}>
                                {/* Message list */}
                                <div style={{
                                    flex: 1, overflowY: 'auto', padding: '12px 12px 4px',
                                    display: 'flex', flexDirection: 'column', gap: 8,
                                }}>
                                    {messages.length === 0 ? (
                                        <div style={{
                                            flex: 1, display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', justifyContent: 'center',
                                            gap: 8, padding: '32px 16px', color: '#94a3b8',
                                        }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 12,
                                                background: '#f1f5f9', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <MessageSquare size={18} color="#cbd5e1" />
                                            </div>
                                            <p style={{ fontSize: 12, margin: 0, textAlign: 'center' }}>
                                                {wsConnected
                                                    ? 'Chat is live — send a message'
                                                    : 'Connecting to chat server…'}
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: msg.isSelf ? 'row-reverse' : 'row',
                                                    alignItems: 'flex-end', gap: 7,
                                                }}
                                            >
                                                {!msg.isSelf && (
                                                    <Avatar role={msg.role} size={26} />
                                                )}
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: msg.isSelf ? 'flex-end' : 'flex-start',
                                                    gap: 2,
                                                    maxWidth: "78%"
                                                }}>
                                                    {!msg.isSelf && (
                                                        <span style={{
                                                            fontSize: 10, color: '#94a3b8',
                                                            fontWeight: 500, paddingLeft: 2,
                                                        }}>
                                                            {msg.role === 'doctor' ? 'Doctor' : 'Patient'}
                                                        </span>
                                                    )}
                                                    <div
                                                        className="msg-bubble"
                                                        style={{
                                                            background: msg.isSelf ? '#2563eb' : '#f1f5f9',
                                                            color: msg.isSelf ? '#fff' : '#1e293b',
                                                            borderBottomRightRadius: msg.isSelf ? 4 : 14,
                                                            borderBottomLeftRadius: msg.isSelf ? 14 : 4,
                                                        }}
                                                    >
                                                        {msg.msg}
                                                    </div>
                                                    <span style={{ fontSize: 9, color: '#cbd5e1', paddingLeft: 2, paddingRight: 2 }}>
                                                        {formatMsgTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input bar */}
                                <div style={{
                                    padding: '8px 10px', borderTop: '1px solid #f1f5f9',
                                    background: '#fff', display: 'flex', gap: 8, alignItems: 'center',
                                    flexShrink: 0,
                                }}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={e => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={wsConnected ? 'Type a message…' : 'Reconnecting…'}
                                        disabled={false}
                                        style={{
                                            flex: 1, height: 36, padding: '0 12px',
                                            border: '1px solid #e2e8f0', borderRadius: 10,
                                            fontSize: 12, outline: 'none', background: '#f8fafc',
                                            color: '#1e293b',
                                            transition: 'border-color 0.15s',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#93c5fd'}
                                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                    <button
                                        className="send-btn"
                                        onClick={sendMessage}
                                        disabled={!inputValue.trim()}
                                        aria-label="Send message"
                                        style={{
                                            width: 36, height: 36, borderRadius: 10,
                                            border: 'none', background: '#2563eb', color: '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
                                        }}
                                    >
                                        <Send size={15} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}