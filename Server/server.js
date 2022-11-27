// -----------------------------
// Start the server on port 3000
// -----------------------------
// use cors to only allow
// requests from the client
// -----------------------------

const io = require("socket.io")(3000, {
	cors: {
		origin: ["http://localhost:5173", "http://192.168.1.231:5173"],
	},
});

// -----------------------------
// Handle connections to the
// server
// -----------------------------

io.on("connection", (socket) => {
	// Handle setting username
	io.use((socket, next) => {
		const username = socket.handshake.auth.username;
		if (username == undefined) {
			username = "Anonymous";
		}
		socket.username = username;
		next();
	});

	// Output who connected
	console.log(`🔌 - 🆔: ${socket.username}`);

	// Send the connection to all clients
	socket.broadcast.emit("distribute-message", {
		type: "connect",
		senderID: socket.username,
	});

	socket.on("user-color", (color) => {
		socket.color = color;
	});

	// Handle messages from the client
	socket.on("sent-message", (message) => {
		// Log the message that was sent
		// TODO: Encrypt messages so only connected clients with key can read messages
		console.log(`📨 - 🆔: ${socket.username} ▶️ ${message}`);

		// Send the message to all other clients
		socket.broadcast.emit("distribute-message", {
			type: "text",
			senderID: socket.username,
			senderColor: socket.color,
			message: message,
		});
	});

	// Handle disconnections from the server
	socket.on("disconnect", () => {
		// Log who disconnected
		console.log(`❌ - 🆔: ${socket.username}`);

		// Send the disconnect to all other clients
		socket.broadcast.emit("distribute-message", {
			type: "disconnect",
			senderID: socket.username,
		});
	});
});
