<script lang="ts">
	import logo from '$lib/imgs/logo_saomiguel - Copy.png';

	let cpf = $state('');
	let senha = $state('');

	function maskCpf(value: string) {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	}

	function handleCpfInput(e: Event) {
		const target = e.target as HTMLInputElement;
		cpf = maskCpf(target.value);
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		console.log('Tentativa de login:', { cpf, senha });
	}
</script>

<svelte:head>
	<title>Login | Acampamento São Miguel</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="logo-wrapper">
			<img src={logo} alt="Logo São Miguel" class="logo" />
		</div>
		
		<h1 class="title">Bem-vindo(a)</h1>
		<p class="subtitle">Faça login para ver os eventos do acampamento</p>

		<form onsubmit={handleSubmit} class="login-form">
			<div class="input-group">
				<label for="cpf">CPF</label>
				<input 
					type="text" 
					id="cpf" 
					name="cpf" 
					placeholder="000.000.000-00" 
					maxlength="14"
					bind:value={cpf}
					oninput={handleCpfInput}
					required
				/>
			</div>

			<div class="input-group">
				<label for="senha">Senha</label>
				<input 
					type="password" 
					id="senha" 
					name="senha" 
					placeholder="Digite sua senha" 
					bind:value={senha}
					required
				/>
			</div>

			<button type="submit" class="login-button">
				Entrar
			</button>
		</form>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #ffffff;
		background: radial-gradient(circle at top right, rgba(111, 222, 194, 0.08), transparent 40%),
					radial-gradient(circle at bottom left, rgba(182, 158, 85, 0.06), transparent 40%);
	}

	.login-card {
		background: #ffffff;
		width: 100%;
		max-width: 420px;
		padding: 3rem 2.5rem;
		border-radius: 24px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05), 
					0 1px 3px rgba(0, 0, 0, 0.02);
		border: 1px solid rgba(182, 158, 85, 0.15);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.login-card:hover {
		box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08), 
					0 2px 5px rgba(0, 0, 0, 0.04);
	}

	.logo-wrapper {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.logo {
		width: 140px;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.06));
		transition: transform 0.3s ease;
	}

	.logo:hover {
		transform: scale(1.02);
	}

	.title {
		font-size: 1.75rem;
		font-weight: 700;
		color: #1a1a1a;
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 0.95rem;
		color: #666;
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #4a4a4a;
	}

	input {
		width: 100%;
		padding: 0.875rem 1rem;
		font-size: 1rem;
		border: 1.5px solid #eaeaea;
		border-radius: 12px;
		background: #fafafa;
		color: #333;
		transition: all 0.2s ease;
		outline: none;
	}

	input::placeholder {
		color: #a0a0a0;
	}

	input:focus {
		background: #ffffff;
		border-color: #6FDEC2;
		box-shadow: 0 0 0 4px rgba(111, 222, 194, 0.15);
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: -0.5rem;
	}

	.forgot-password {
		font-size: 0.875rem;
		color: #B69E55;
		text-decoration: none;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	.forgot-password:hover {
		color: #9d8744;
		text-decoration: underline;
	}

	.login-button {
		margin-top: 1rem;
		width: 100%;
		padding: 0.875rem;
		font-size: 1rem;
		font-weight: 600;
		color: #ffffff;
		background: #6FDEC2;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 14px rgba(111, 222, 194, 0.4);
		position: relative;
		overflow: hidden;
	}

	.login-button:hover {
		background: #5bccae;
		transform: translateY(-2px);
		box-shadow: 0 6px 18px rgba(111, 222, 194, 0.5);
	}

	.login-button:active {
		transform: translateY(0);
	}
	
	.login-button:focus-visible {
		outline: 2px solid #B69E55;
		outline-offset: 2px;
	}
</style>
