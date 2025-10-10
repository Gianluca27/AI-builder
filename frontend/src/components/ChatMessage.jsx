import { User, Terminal } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-yellow-400/20 border-2 border-yellow-400/50 rounded-full flex items-center justify-center">
          <Terminal className="text-yellow-400" size={16} />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 border-2 font-mono ${
          isUser
            ? "bg-yellow-400/10 text-white border-yellow-400/50"
            : "bg-black/50 text-green-400 border-yellow-400/30"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-green-400/20 border-2 border-green-400/50 rounded-full flex items-center justify-center">
          <User className="text-green-400" size={16} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
