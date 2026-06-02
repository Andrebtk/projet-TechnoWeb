import Message from "./Message";

// 1. On ajoute onAuthorClick ici
function MessageList({ messages, isConnected, currentUser, onRefresh, onAuthorClick }) {
	if (!messages || messages.length === 0) {
		return <p style={{ textAlign: "center", color: "#666" }}>Aucun message à afficher.</p>;
	}

	return (
		<div className="message-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
			{messages.map((msg, index) => (
			<Message 
				key={msg._id || msg.id || index} 
				message={msg} 
				isConnected={isConnected} 
				currentUser={currentUser} 
				onRefresh={onRefresh}
				onAuthorClick={onAuthorClick} // 2. Et on le transmet au Message !
			/>
			))}
		</div>
	);
}

export default MessageList;