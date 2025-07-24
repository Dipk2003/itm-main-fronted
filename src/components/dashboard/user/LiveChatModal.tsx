import React, { useState, useEffect } from 'react';
import { liveChatAPI, ChatMessage, LiveChatSession } from '@/lib/supportApi';
import { Button } from '@/components/ui/Button';

interface LiveChatModalProps {
  session: LiveChatSession;
  onClose: () => void;
}

const LiveChatModal: React.FC<LiveChatModalProps> = ({ session, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (session) {
      loadMessages();
    }
  }, [session]);

  const loadMessages = async () => {
    try {
      const chatMessages = await liveChatAPI.getChatMessages(session.id);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage) return;

    setIsSending(true);

    try {
      const message = await liveChatAPI.sendChatMessage(session.id, newMessage);
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Live Chat</h2>
          <button onClick={onClose} className="text-red-600">Close</button>
        </div>

        <div className="overflow-y-auto max-h-72 mb-4 border-t border-gray-200">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-2 ${msg.senderType === 'USER' ? 'text-right' : 'text-left'}`}>
              <p className="text-sm">
                <span className="font-semibold">{msg.senderName}: </span>
                {msg.message}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border rounded"
            placeholder="Type a message..."
          />
          <Button onClick={handleSendMessage} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;

