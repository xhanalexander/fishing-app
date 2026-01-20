import { create } from 'zustand';

export const usePartyKitStore = create((set, get) => ({
  status: 'disconnected',
  devices: [],
  lastMessage: null,
  ws: null,
  room: null,
  vitePort: 5173,
  mobileData: null,
  connect: (deviceType = 'desktop') => {
    const { ws: existingWs } = get();
    
    if (existingWs) {
      existingWs.close();
    }
    const urlRoom = new URLSearchParams(window.location.search).get("room")
    const roomId = urlRoom ? urlRoom : Math.random().toString(36).substring(2, 10);
    console.log(`🎈 Connecting to room: ${roomId} as ${deviceType}`);
    set({ status: 'connecting' });
    set({ room: roomId })

    // Use environment variable or default to local PartyKit dev server
    const partykitHost = import.meta.env.VITE_PARTYKIT_HOST || 'localhost:1999';
    const protocol = partykitHost.includes('localhost') || partykitHost.includes('127.0.0.1') ? 'ws' : 'wss';
    const wsUrl = `${protocol}://${partykitHost}/party/${roomId}`;
    console.log(`🔗 Connecting to: ${wsUrl}`);
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('✅ Connected!');
      set({ status: 'connected' });
      ws.send(JSON.stringify({ type: 'register', deviceType }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
    
        set({ lastMessage: data });

        if (data.type === 'device-joined' || data.type === 'device-left') {
          set({ devices: data.connectedDevices });
        }
        
        // Only check payload if it exists and message type is 'data'
        if (data.type === 'data' && data.payload && data.payload.type === 'orientation') {
          set({ mobileData: data.payload });
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      set({ status: 'error' });
    };

    ws.onclose = () => {
      console.log('🔌 Disconnected');
      set({ status: 'disconnected', ws: null });
    };

    set({ ws });
  },

  disconnect: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
      set({ ws: null, status: 'disconnected' });
    }
  },

  sendData: (payload) => {
    const { ws } = get();
    if (ws?.readyState === WebSocket.OPEN) {
      console.log('📤 Sending:', payload);
      ws.send(JSON.stringify({ type: 'data', payload }));
    } else {
      console.warn('⚠️ WebSocket not connected');
    }
  },
}));

