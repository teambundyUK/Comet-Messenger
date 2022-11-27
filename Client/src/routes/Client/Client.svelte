<script>
	// -----------------------------
	// Import the Svelte components
	// and external packages
	// -----------------------------

	import Chat from './Components/Chat.svelte';
	import { io } from 'socket.io-client';

	// -----------------------------
	// Declare the variables
	// -----------------------------

	let outbox = '';
	let username;
	$: color = '#ffffff';
	let connected = false;

	// default address should be localhost:3000
	let address = 'ws://localhost:3000';

	// inbox stores all messages sent and recieved by the client
	let inbox = [
		{ type: 'text', senderID: 'Server', senderColor: 'red', message: 'Welcome to the chat room!' }
	];

	// -----------------------------
	// Setup connection to server on
	// port 3000
	// -----------------------------

	var socket = io.connect(address, { autoConnect: false });

	// Sets the username to the value of the input field
	function connect() {
		socket.auth = { username };
		try {
			socket.connect();
		} catch (error) {
			console.log(error);
		}
	}

	// Output the connection
	socket.on('connect', () => {
		console.log(`You connected with id: ${socket.id}`);
		connected = true;
		socket.emit('user-color', color);
	});

	// -----------------------------
	// Manage incoming messages
	// -----------------------------

	socket.on('distribute-message', (message) => {
		inbox = [...inbox, message];
	});

	// -----------------------------
	// Manage outgoing messages
	// -----------------------------

	// Function to send content of outbox to server as a message
	// TODO: Encrypt messages so only connected clients with key can read messages, make sure the message is not empty
	function SendMessage() {
		// Check if the message is empty
		if (outbox == '') {
			return;
		}
		socket.emit('sent-message', outbox);

		// Adds your message to the inbox
		inbox = [...inbox, { type: 'You', senderID: 'You', senderColor: color, message: outbox }];

		// Empties the outbox
		outbox = '';
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0"
	/>
</svelte:head>

<main>
	{#if !connected}
		<!-- Shows the username and server select screen -->
		<div class="modal-bg">
			<div class="modal">
				<h1>Login:</h1>
				<div class="input-wrapper">
					<div class="icon-wrapper">
						<span class="material-symbols-rounded icon"> person </span>
					</div>

					<input type="text" placeholder="Username" bind:value={username} />
				</div>
				<div class="input-wrapper">
					<div class="icon-wrapper">
						<span class="material-symbols-rounded icon"> dns </span>
					</div>
					<input type="text" placeholder="Address" bind:value={address} />
				</div>
				<div class="input-wrapper">
					<div style="background-color: {color};" class="icon-wrapper">
						<span style="color: #2a2a2a;" class="material-symbols-rounded icon"> palette </span>
					</div>

					<input
						type="color"
						style="background-color: {color};"
						class="color-picker"
						placeholder="Username"
						bind:value={color}
					/>
				</div>
				<button on:click={connect}>
					Connect
					<span class="material-symbols-rounded"> arrow_forward_ios </span>
				</button>
			</div>
		</div>
	{:else}
		<!-- Shows the chat area when the user has selected a username -->
		<div class="client-wrapper">
			<h1 style="color: white;">Client:</h1>
			<div class="chat-wrapper">
				<div class="chat-area">
					<Chat {inbox} />
				</div>
			</div>

			<div class="chat-box">
				<input type="text" placeholder="chat message ..." bind:value={outbox} />
				<button class="send-button" on:click={SendMessage}>
					<span class="material-symbols-rounded"> send </span>
				</button>
			</div>
		</div>
	{/if}
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap');

	/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
    */

	* {
		font-family: 'Quicksand', sans-serif;
	}

	.material-symbols-rounded {
		font-family: 'Material Symbols Rounded';
		position: relative;
		top: 3px;
		left: 5px;
	}

	.chat-area {
		margin-top: 10px;
		width: 100%;
		height: 80vh;
		overflow: auto;
		border-radius: 20px;
		background-color: #1a1a1a;
		backdrop-filter: blur(30px);
		box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
	}

	.client-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url(./waves.svg);
		background-size: cover;
		padding: 20px;
		box-sizing: border-box;
	}

	input {
		margin-bottom: 5px;
	}

	.chat-box {
		margin-top: 15px;
	}

	.modal-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url(./waves.svg);
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal {
		background-color: #5e5e5e53;
		padding: 20px;
		border-radius: 20px;
		width: 200px;
		backdrop-filter: blur(8px);
		box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
	}

	.modal input {
		border: none;
		background-color: #2a2a2a;
		color: white;
		padding: 10px;
		padding-left: 20px;
		border-radius: 0px 20px 20px 0px;
		font-size: small;
	}

	.modal input:focus {
		outline: none;
	}

	.modal .input-wrapper .icon {
		font-size: 30px;
		position: relative;
		top: 1px;
		left: 10px;
		color: white;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
	}

	.icon-wrapper {
		background-color: #2a2a2a;
		padding: 1px;
		margin-bottom: 5px;
		border-radius: 20px 0px 0px 20px;
	}

	.modal button {
		font-size: large;
		margin-top: 20px;
		border: none;
		background-color: #4a4a4a;
		color: white;
		padding: 10px;
		border-radius: 20px;
		width: 100%;
		cursor: pointer;
	}

	.modal button span {
		font-size: large;
	}

	.modal button:hover {
		background-color: #5a5a5a;
	}

	.modal h1 {
		margin-bottom: 40px;
		color: white;
	}

	.color-picker {
		width: 100%;
		height: 36px;
		cursor: pointer;
	}

	input[type='color'] {
		-webkit-appearance: none;
		border: none;
	}
	input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
	}
	input[type='color']::-webkit-color-swatch {
		border: none;
	}

	.chat-box input {
		border: none;
		background-color: #4a4a4a;
		color: white;
		padding: 10px;
		padding-left: 20px;
		border-radius: 20px;
		font-size: large;
		width: 90%;
	}

	.chat-box input:focus {
		outline: none;
	}

	.chat-box .send-button {
		font-size: large;
		border: none;
		background-color: #4a4a4a;
		color: white;
		margin-top: 0px;
		padding-top: 5px;
		padding-bottom: 10px;
		border-radius: 20px;
		width: 8%;
		cursor: pointer;
	}

	.chat-box .material-symbols-rounded {
		font-family: 'Material Symbols Rounded';
		position: relative;
		top: 3px;
		left: 5px;
	}
</style>
