<script>
	export let inbox;
</script>

<main>
	<ul>
		{#each inbox as message}
			{#if message.type === 'text'}
				<div class="text-message" style="color: {message.senderColor};">
					<b>{message.senderID}: </b>
					<br />
					<div class="text">
						{message.message}
					</div>
				</div>
				<br />
			{:else if message.type === 'disconnect'}
				<div style="color: white;" class="disconnect-message">
					<b style="color: red;">
						<span
							class="material-symbols-rounded icon"
							style="font-family: 'Material Symbols Rounded';
							position: relative;
							top: 7px;"
						>
							flight_takeoff
						</span>
						{message.senderID}:
					</b> disconnected from the server
				</div>
				<br />
			{:else if message.type === 'connect'}
				<div style="color: white;" class="connect-message">
					<b style="color: green;">
						<span
							class="material-symbols-rounded icon"
							style="font-family: 'Material Symbols Rounded';
							position: relative;
							top: 7px;"
						>
							flight_land
						</span>
						{message.senderID}:
					</b> connected to the server
				</div>
				<br />
			{:else if message.type === 'You'}
				<div class="self-message" style="color: {message.senderColor};">
					<b class="self-username" style="font-size: medium;">{message.senderID}: </b>
					<br />
					<div class="text">
						{message.message}
					</div>
				</div>
				<br />
			{/if}
		{/each}
	</ul>
</main>

<style>
	.text-message .text {
		background-color: #2a2a2a;
		color: white;
		width: fit-content;
		padding: 12px;
		border-radius: 5px 20px 20px 20px;
		margin-top: 7px;
		backdrop-filter: blur(8px);
		box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
	}

	.self-message .text {
		background-color: #2a2a2a;
		color: white;
		width: fit-content;
		padding: 12px;
		border-radius: 20px 5px 20px 20px;
		text-align: right;
		margin-left: auto;
		margin-top: 7px;
		backdrop-filter: blur(8px);
		box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
	}

	.self-message .self-username {
		/* move the username to the right of the text area without using margin*/
		float: right;
	}

	.self-message {
		margin-right: 50px;
	}
</style>
