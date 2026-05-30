import Message from "./Message";

function MessageList({ messages, isConnected, onRefresh }) {
  if (!messages || messages.length === 0) {
    return <p>Aucun message à afficher.</p>;
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message
          key={message._id || message.id}
          message={message}
          isConnected={isConnected}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

export default MessageList;