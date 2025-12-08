import { io, Socket } from 'socket.io-client';
import {
  JoinConversationPayload,
  LeaveConversationPayload,
  SendMessagePayload,
  TypingPayload,
  NewMessageEvent,
  MessageSentEvent,
  TypingEvent,
  JoinedConversationEvent,
  LeftConversationEvent,
} from '@/types/interfaces/api/chat';

class SocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  /**
   * Khởi tạo kết nối WebSocket
   */
  connect(token?: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      path: '/socket.io/',
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  /**
   * Setup các event listeners mặc định
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔴 Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server chủ động disconnect, cần reconnect thủ công
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
    });
  }

  /**
   * Ngắt kết nối
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected and cleaned up');
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Lấy socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  // ============================================================================
  // CONVERSATION ROOM METHODS
  // ============================================================================

  /**
   * Join vào một conversation room
   */
  joinConversation(conversationId: number): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    const payload: JoinConversationPayload = { conversationId };
    this.socket.emit('chat:join-conversation', payload);
    console.log(`📥 Joining conversation: ${conversationId}`);
  }

  /**
   * Leave khỏi conversation room
   */
  leaveConversation(conversationId: number): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    const payload: LeaveConversationPayload = { conversationId };
    this.socket.emit('chat:leave-conversation', payload);
    console.log(`📤 Leaving conversation: ${conversationId}`);
  }

  /**
   * Lắng nghe event đã join conversation
   */
  onJoinedConversation(callback: (data: JoinedConversationEvent) => void): void {
    this.socket?.on('chat:joined-conversation', callback);
  }

  /**
   * Lắng nghe event đã leave conversation
   */
  onLeftConversation(callback: (data: LeftConversationEvent) => void): void {
    this.socket?.on('chat:left-conversation', callback);
  }

  // ============================================================================
  // MESSAGE METHODS
  // ============================================================================

  /**
   * Gửi message qua WebSocket
   */
  sendMessage(
    conversationId: number,
    senderId: number,
    content: string,
    tempId?: string
  ): void {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }

    const payload: SendMessagePayload = {
      conversationId,
      senderId,
      content,
      tempId,
    };

    this.socket.emit('chat:send-message', payload);
    console.log(`📨 Sending message to conversation ${conversationId}`);
  }

  /**
   * Lắng nghe message mới
   */
  onNewMessage(callback: (data: NewMessageEvent) => void): void {
    this.socket?.on('chat:new-message', callback);
  }

  /**
   * Lắng nghe xác nhận message đã gửi
   */
  onMessageSent(callback: (data: MessageSentEvent) => void): void {
    this.socket?.on('chat:sent', callback);
  }

  // ============================================================================
  // TYPING INDICATOR METHODS
  // ============================================================================

  /**
   * Emit typing indicator
   */
  startTyping(conversationId: number, userId: number): void {
    if (!this.socket?.connected) return;

    const payload: TypingPayload = {
      conversationId,
      userId,
    };

    this.socket.emit('chat:typing', payload);
  }

  /**
   * Emit stop typing indicator
   */
  stopTyping(conversationId: number, userId: number): void {
    if (!this.socket?.connected) return;

    const payload: TypingPayload = {
      conversationId,
      userId,
    };

    this.socket.emit('chat:stop-typing', payload);
  }

  /**
   * Lắng nghe typing event
   */
  onTyping(callback: (data: TypingEvent) => void): void {
    this.socket?.on('chat:typing', callback);
  }

  /**
   * Lắng nghe stop typing event
   */
  onStopTyping(callback: (data: TypingEvent) => void): void {
    this.socket?.on('chat:stop-typing', callback);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Remove listener cho một event
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  /**
   * Remove tất cả listeners
   */
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

// Export singleton instance
export const socketClient = new SocketClient();

// Export class để có thể tạo multiple instances nếu cần
export default SocketClient;