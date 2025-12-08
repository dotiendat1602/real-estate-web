import { useEffect, useCallback, useRef } from 'react';
import { socketClient } from '@/lib/socket';
import {
  NewMessageEvent,
  MessageSentEvent,
  TypingEvent,
  JoinedConversationEvent,
  LeftConversationEvent,
} from '@/types/interfaces/api/chat';

interface UseSocketOptions {
  autoConnect?: boolean;
  token?: string;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = true, token } = options;
  const isConnectedRef = useRef(false);

  // Connect socket
  useEffect(() => {
    if (autoConnect && !isConnectedRef.current) {
      socketClient.connect(token);
      isConnectedRef.current = true;
    }

    return () => {
      if (isConnectedRef.current) {
        socketClient.disconnect();
        isConnectedRef.current = false;
      }
    };
  }, [autoConnect, token]);

  // Conversation methods
  const joinConversation = useCallback((conversationId: number) => {
    socketClient.joinConversation(conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: number) => {
    socketClient.leaveConversation(conversationId);
  }, []);

  // Message methods
  const sendMessage = useCallback(
    (conversationId: number, senderId: number, content: string, tempId?: string) => {
      socketClient.sendMessage(conversationId, senderId, content, tempId);
    },
    []
  );

  // Typing methods
  const startTyping = useCallback((conversationId: number, userId: number) => {
    socketClient.startTyping(conversationId, userId);
  }, []);

  const stopTyping = useCallback((conversationId: number, userId: number) => {
    socketClient.stopTyping(conversationId, userId);
  }, []);

  // Event listeners
  const onNewMessage = useCallback((callback: (data: NewMessageEvent) => void) => {
    socketClient.onNewMessage(callback);
    return () => socketClient.off('chat:new-message', callback);
  }, []);

  const onMessageSent = useCallback((callback: (data: MessageSentEvent) => void) => {
    socketClient.onMessageSent(callback);
    return () => socketClient.off('chat:sent', callback);
  }, []);

  const onTyping = useCallback((callback: (data: TypingEvent) => void) => {
    socketClient.onTyping(callback);
    return () => socketClient.off('chat:typing', callback);
  }, []);

  const onStopTyping = useCallback((callback: (data: TypingEvent) => void) => {
    socketClient.onStopTyping(callback);
    return () => socketClient.off('chat:stop-typing', callback);
  }, []);

  const onJoinedConversation = useCallback((callback: (data: JoinedConversationEvent) => void) => {
    socketClient.onJoinedConversation(callback);
    return () => socketClient.off('chat:joined-conversation', callback);
  }, []);

  const onLeftConversation = useCallback((callback: (data: LeftConversationEvent) => void) => {
    socketClient.onLeftConversation(callback);
    return () => socketClient.off('chat:left-conversation', callback);
  }, []);

  return {
    isConnected: socketClient.isConnected(),
    socket: socketClient.getSocket(),
    // Conversation methods
    joinConversation,
    leaveConversation,
    // Message methods
    sendMessage,
    // Typing methods
    startTyping,
    stopTyping,
    // Event listeners
    onNewMessage,
    onMessageSent,
    onTyping,
    onStopTyping,
    onJoinedConversation,
    onLeftConversation,
  };
};