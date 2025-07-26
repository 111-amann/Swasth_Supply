import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send, Headphones, X } from "lucide-react";

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 How can I help you today?",
      sender: "support",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "I can help you with:\n• Finding suppliers\n• Order issues\n• Payment problems\n• Account setup",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: messages.length + 2,
        text: "Thank you for your message! Our support team will get back to you shortly. In the meantime, you can browse our help center or try WhatsApp support for immediate assistance.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg"
        size="icon"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-80 bg-white shadow-2xl border chat-appear">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <Headphones className="text-green-500" size={20} />
              </div>
              <div>
                <h4 className="font-semibold">Swasth Support</h4>
                <p className="text-xs opacity-90">Online now</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg whitespace-pre-line ${
                    message.sender === "user"
                      ? "bg-green-500 text-white ml-auto"
                      : "bg-white border shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.sender === "support" && (
                    <p className="text-xs text-muted-foreground mt-1">Support Team</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 rounded-full"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-green-500 hover:bg-green-600 rounded-full"
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}
