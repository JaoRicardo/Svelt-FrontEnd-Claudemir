<script lang="ts">
	import logo from '$lib/imgs/logo_saomiguel - Copy.png';
	import { apiFetch } from '$lib/api';

	let step = $state(1);
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	// Formulário
	let name = $state('');
	let cpf = $state('');
	let birthday = $state('');
	let sex = $state('');
	let marital_status_id = $state('');
	let email = $state('');
	let phone = $state('');
	let password = $state('');
	let password_confirmation = $state('');

	const maritalStatuses = [
		{ id: 1, name: 'Solteiro' },
		{ id: 2, name: 'Namorando' },
		{ id: 3, name: 'União estável' },
		{ id: 4, name: 'Casado' },
		{ id: 5, name: 'Viúvo' },
		{ id: 6, name: 'Separado' },
		{ id: 7, name: 'Divorciado' },
		{ id: 8, name: 'Segunda união' },
	];

	function maskCpf(value: string) {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	}

	function maskPhone(value: string) {
		value = value.replace(/\D/g, '');
		value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
		value = value.replace(/(\d)(\d{4})$/, '$1-$2');
		return value.substring(0, 15);
	}

	function handleCpfInput(e: Event) {
		const target = e.target as HTMLInputElement;
		cpf = maskCpf(target.value);
	}

	function handlePhoneInput(e: Event) {
		const target = e.target as HTMLInputElement;
		phone = maskPhone(target.value);
	}

	function nextStep() {
		errorMessage = '';
		if (!name || !cpf || !birthday || !sex || !marital_status_id) {
			errorMessage = 'Por favor, preencha todos os campos desta etapa.';
			return;
		}
		step = 2;
	}

	function prevStep() {
		errorMessage = '';
		step = 1;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMessage = '';

		if (password !== password_confirmation) {
			errorMessage = 'As senhas não coincidem.';
			return;
		}

		isLoading = true;

		const cleanCpf = cpf.replace(/\D/g, '');
		const cleanPhone = phone.replace(/\D/g, '');

		try {
			const response = await apiFetch('/register', {
				method: 'POST',
				body: JSON.stringify({
					name,
					cpf: cleanCpf,
					birthday,
					sex,
					marital_status_id,
					email,
					phone: cleanPhone,
					password,
					password_confirmation,
					picture: "https://example.com/foto.jpg",
					document: "https://example.com/documento.pdf",
					is_counselor: false
				})
			});

			const data = await response.json();

			if (response.ok) {
				successMessage = 'Conta criada com sucesso! Redirecionando...';
				setTimeout(() => {
					window.location.href = '/'; // Redireciona para o login
				}, 2000);
			} else {
				errorMessage = data.message || 'Erro ao realizar cadastro.';
				if (data.errors) {
					const firstErrorKey = Object.keys(data.errors)[0];
					errorMessage = data.errors[firstErrorKey][0];
				}
			}
		} catch (error) {
			console.error('Erro na requisição:', error);
			errorMessage = 'Erro de conexão com o servidor.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Registro | Acampamento São Miguel</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="logo-wrapper">
			<img src={logo} alt="Logo São Miguel" class="logo" />
		</div>
		
		<h1 class="title">Criar Conta</h1>
		<p class="subtitle">
			{step === 1 ? 'Etapa 1: Seus dados básicos' : 'Etapa 2: Contato e segurança'}
		</p>

		{#if successMessage}
			<div class="success-message">
				{successMessage}
			</div>
		{:else}
			<form onsubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} class="login-form">
				{#if errorMessage}
					<div class="error-message">
						{errorMessage}
					</div>
				{/if}

				{#if step === 1}
					<div class="input-group">
						<label for="name">Nome Completo</label>
						<input type="text" id="name" placeholder="Digite seu nome completo" bind:value={name} maxlength="255" required />
					</div>

					<div class="input-group">
						<label for="cpf">CPF</label>
						<input type="text" id="cpf" placeholder="000.000.000-00" maxlength="14" bind:value={cpf} oninput={handleCpfInput} required />
					</div>

					<div class="input-group">
						<label for="birthday">Data de Nascimento</label>
						<input type="date" id="birthday" bind:value={birthday} required />
					</div>

					<div class="row-group">
						<div class="input-group flex-1">
							<label for="sex">Sexo</label>
							<select id="sex" bind:value={sex} required>
								<option value="" disabled selected>Selecione</option>
								<option value="M">Masculino</option>
								<option value="F">Feminino</option>
							</select>
						</div>

						<div class="input-group flex-1">
							<label for="marital_status_id">Estado Civil</label>
							<select id="marital_status_id" bind:value={marital_status_id} required>
								<option value="" disabled selected>Selecione</option>
								{#each maritalStatuses as status}
									<option value={status.id}>{status.name}</option>
								{/each}
							</select>
						</div>
					</div>

					<button type="submit" class="login-button">
						Próximo
					</button>
				{:else if step === 2}
					<div class="input-group">
						<label for="email">E-mail</label>
						<input type="email" id="email" placeholder="seu@email.com" bind:value={email} required />
					</div>

					<div class="input-group">
						<label for="phone">Telefone</label>
						<input type="text" id="phone" placeholder="(00) 00000-0000" bind:value={phone} oninput={handlePhoneInput} maxlength="15" required />
					</div>

					<div class="input-group">
						<label for="password">Senha</label>
						<input type="password" id="password" placeholder="Crie uma senha" bind:value={password} required />
					</div>

					<div class="input-group">
						<label for="password_confirmation">Confirmar Senha</label>
						<input type="password" id="password_confirmation" placeholder="Confirme sua senha" bind:value={password_confirmation} required />
					</div>

					<div class="button-group">
						<button type="button" class="login-button secondary" onclick={prevStep} disabled={isLoading}>
							Voltar
						</button>
						<button type="submit" class="login-button" disabled={isLoading}>
							{#if isLoading}
								Enviando...
							{:else}
								Finalizar Cadastro
							{/if}
						</button>
					</div>
				{/if}
			</form>
		{/if}
		
		{#if !successMessage}
			<div class="login-link">
				<p>Já tem uma conta? <a href="/">Faça login</a></p>
			</div>
		{/if}
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
		max-width: 480px;
		padding: 3rem 2.5rem;
		border-radius: 24px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05), 
					0 1px 3px rgba(0, 0, 0, 0.02);
		border: 1px solid rgba(182, 158, 85, 0.15);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		margin: 2rem;
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
		margin-bottom: 2rem;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.row-group {
		display: flex;
		gap: 1rem;
	}

	.flex-1 {
		flex: 1;
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

	input, select {
		width: 100%;
		padding: 0.875rem 1rem;
		font-size: 1rem;
		border: 1.5px solid #eaeaea;
		border-radius: 12px;
		background: #fafafa;
		color: #333;
		transition: all 0.2s ease;
		outline: none;
		font-family: inherit;
	}

	input::placeholder {
		color: #a0a0a0;
	}

	input:focus, select:focus {
		background: #ffffff;
		border-color: #6FDEC2;
		box-shadow: 0 0 0 4px rgba(111, 222, 194, 0.15);
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}

	.login-button {
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
	}

	.login-button:hover:not(:disabled) {
		background: #5bccae;
		transform: translateY(-2px);
		box-shadow: 0 6px 18px rgba(111, 222, 194, 0.5);
	}

	.login-button.secondary {
		background: #f0f0f0;
		color: #333;
		box-shadow: none;
	}

	.login-button.secondary:hover:not(:disabled) {
		background: #e0e0e0;
	}

	.login-button:disabled {
		background: #a5d6c8;
		cursor: not-allowed;
		box-shadow: none;
	}

	.error-message {
		background-color: #ffebee;
		color: #c62828;
		padding: 0.75rem;
		border-radius: 8px;
		font-size: 0.875rem;
		text-align: center;
		border: 1px solid #ffcdd2;
	}

	.success-message {
		background-color: #e8f5e9;
		color: #2e7d32;
		padding: 1.5rem;
		border-radius: 8px;
		font-size: 1rem;
		text-align: center;
		border: 1px solid #c8e6c9;
		font-weight: 600;
	}

	.login-link {
		margin-top: 2rem;
		text-align: center;
		font-size: 0.9rem;
		color: #666;
	}

	.login-link a {
		color: #B69E55;
		font-weight: 600;
		text-decoration: none;
	}

	.login-link a:hover {
		text-decoration: underline;
	}
</style>
