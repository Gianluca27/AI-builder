import { User, Sparkles } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <Sparkles className="text-purple-600" size={16} />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="text-gray-600" size={16} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
