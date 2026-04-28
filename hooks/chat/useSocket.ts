// import { useEffect, useCallback, useRef } from 'react';
// import { socketClient } from '@/lib/socket';
// import {
//   NewMessageEvent,
//   MessageSentEvent,
//   TypingEvent,
//   JoinedConversationEvent,
//   LeftConversationEvent,
// } from '@/types/interfaces/api/chat';

// interface UseSocketOptions {
//   autoConnect?: boolean;
//   token?: string;
// }

// export const useSocket = (options: UseSocketOptions = {}) => {
//   const { autoConnect = true, token } = options;
//   const isConnectedRef = useRef(false);

//   // Connect socket
//   useEffect(() => {
//     if (autoConnect && !isConnectedRef.current) {
//       socketClient.connect(token);
//       isConnectedRef.current = true;
//     }

//     return () => {
//       if (isConnectedRef.current) {
//         socketClient.disconnect();
//         isConnectedRef.current = false;
//       }
//     };
//   }, [autoConnect, token]);

//   // Conversation methods
//   const joinConversation = useCallback((conversationId: number) => {
//     socketClient.joinConversation(conversationId);
//   }, []);

//   const leaveConversation = useCallback((conversationId: number) => {
//     socketClient.leaveConversation(conversationId);
//   }, []);

//   // Message methods
//   const sendMessage = useCallback(
//     (conversationId: number, senderId: number, content: string, tempId?: string) => {
//       socketClient.sendMessage(conversationId, senderId, content, tempId);
//     },
//     []
//   );

//   // Typing methods
//   const startTyping = useCallback((conversationId: number, userId: number) => {
//     socketClient.startTyping(conversationId, userId);
//   }, []);

//   const stopTyping = useCallback((conversationId: number, userId: number) => {
//     socketClient.stopTyping(conversationId, userId);
//   }, []);

//   // Event listeners
//   const onNewMessage = useCallback((callback: (data: NewMessageEvent) => void) => {
//     socketClient.onNewMessage(callback);
//     return () => socketClient.off('chat:new-message', callback);
//   }, []);

//   const onMessageSent = useCallback((callback: (data: MessageSentEvent) => void) => {
//     socketClient.onMessageSent(callback);
//     return () => socketClient.off('chat:sent', callback);
//   }, []);

//   const onTyping = useCallback((callback: (data: TypingEvent) => void) => {
//     socketClient.onTyping(callback);
//     return () => socketClient.off('chat:typing', callback);
//   }, []);

//   const onStopTyping = useCallback((callback: (data: TypingEvent) => void) => {
//     socketClient.onStopTyping(callback);
//     return () => socketClient.off('chat:stop-typing', callback);
//   }, []);

//   const onJoinedConversation = useCallback((callback: (data: JoinedConversationEvent) => void) => {
//     socketClient.onJoinedConversation(callback);
//     return () => socketClient.off('chat:joined-conversation', callback);
//   }, []);

//   const onLeftConversation = useCallback((callback: (data: LeftConversationEvent) => void) => {
//     socketClient.onLeftConversation(callback);
//     return () => socketClient.off('chat:left-conversation', callback);
//   }, []);

//   return {
//     isConnected: socketClient.isConnected(),
//     socket: socketClient.getSocket(),
//     // Conversation methods
//     joinConversation,
//     leaveConversation,
//     // Message methods
//     sendMessage,
//     // Typing methods
//     startTyping,
//     stopTyping,
//     // Event listeners
//     onNewMessage,
//     onMessageSent,
//     onTyping,
//     onStopTyping,
//     onJoinedConversation,
//     onLeftConversation,
//   };
// };


import { useEffect, useCallback, useRef, useState } from "react";
import { socketClient } from "@/lib/socket";
import {
  NewMessageEvent,
  MessageSentEvent,
  TypingEvent,
  JoinedConversationEvent,
  LeftConversationEvent,
} from "@/types/interfaces/api/chat";

interface UseSocketOptions {
  autoConnect?: boolean;
  token?: string;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = true, token } = options;

  const [isConnected, setIsConnected] = useState<boolean>(() =>
    socketClient.isConnected()
  );

  const socketRef = useRef<ReturnType<typeof socketClient.getSocket> | null>(
    null
  );

  useEffect(() => {
    if (!autoConnect) {
      // Nếu không auto connect thì đảm bảo state đúng
      setIsConnected(socketClient.isConnected());
      return;
    }

    socketClient.connect(token);
    const socket = socketClient.getSocket();
    socketRef.current = socket;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);

    // Sync ngay lập tức trong trường hợp đã connected sẵn
    setIsConnected(socketClient.isConnected());

    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
      socketClient.disconnect();
      socketRef.current = null;
      setIsConnected(false);
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
    (
      conversationId: number,
      senderId: number,
      content: string,
      tempId?: string
    ) => {
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
    return () => socketClient.off("chat:new-message", callback);
  }, []);

  const onMessageSent = useCallback(
    (callback: (data: MessageSentEvent) => void) => {
      socketClient.onMessageSent(callback);
      return () => socketClient.off("chat:sent", callback);
    },
    []
  );

  const onTyping = useCallback((callback: (data: TypingEvent) => void) => {
    socketClient.onTyping(callback);
    return () => socketClient.off("chat:typing", callback);
  }, []);

  const onStopTyping = useCallback((callback: (data: TypingEvent) => void) => {
    socketClient.onStopTyping(callback);
    return () => socketClient.off("chat:stop-typing", callback);
  }, []);

  const onJoinedConversation = useCallback(
    (callback: (data: JoinedConversationEvent) => void) => {
      socketClient.onJoinedConversation(callback);
      return () => socketClient.off("chat:joined-conversation", callback);
    },
    []
  );

  const onLeftConversation = useCallback(
    (callback: (data: LeftConversationEvent) => void) => {
      socketClient.onLeftConversation(callback);
      return () => socketClient.off("chat:left-conversation", callback);
    },
    []
  );

  return {
    isConnected,
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    onNewMessage,
    onMessageSent,
    onTyping,
    onStopTyping,
    onJoinedConversation,
    onLeftConversation,
  };
};
