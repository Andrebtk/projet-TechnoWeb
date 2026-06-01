import Message from "./Message";

function MessageList({ messages, isConnected, currentUser, onRefresh }) {
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
				currentUser={currentUser}
				onRefresh={onRefresh}
			/>
			))}
		</div>
	);
}

export default MessageList;