<script lang="ts">
	import logo from "$lib/imgs/logo_saomiguel - Copy.png";
	import { apiFetch } from "$lib/api";
	import { auth } from "$lib/stores/auth.svelte";

	let cpf = $state("");
	let senha = $state("");
	let isLoading = $state(false);
	let errorMessage = $state("");
	let showPassword = $state(false);
	let rememberMe = $state(false);

	function maskCpf(value: string) {
		return value
			.replace(/\D/g, "")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})/, "$1-$2")
			.replace(/(-\d{2})\d+?$/, "$1");
	}

	function handleCpfInput(e: Event) {
		const target = e.target as HTMLInputElement;
		cpf = maskCpf(target.value);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMessage = "";
		isLoading = true;

		const cleanCpf = cpf.replace(/\D/g, "");

		try {
			const response = await apiFetch("/login", {
				method: "POST",
				body: JSON.stringify({
					cpf: cleanCpf,
					password: senha,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				auth.setToken(data.token);
				auth.user = data.data || data;
				window.location.href = "/dashboard";
			} else {
				errorMessage =
					data.message ||
					"Erro ao realizar login. Verifique suas credenciais.";
				if (data.errors && data.errors.cpf) {
					errorMessage = data.errors.cpf[0];
				}
			}
		} catch (error) {
			console.error("Erro na requisição:", error);
			errorMessage = "Erro de conexão com o servidor.";
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Login | Acampamento São Miguel</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="login-left">
			<img src={logo} alt="Logo São Miguel" class="logo-mobile" />
			<h1 class="title">BEM-VINDO</h1>

			<form onsubmit={handleSubmit} class="login-form">
				{#if errorMessage}
					<div class="error-message">
						{errorMessage}
					</div>
				{/if}

				<div class="input-group">
					<label for="cpf" class="sr-only">CPF</label>
					<input
						type="text"
						id="cpf"
						name="cpf"
						placeholder="Digite seu CPF"
						maxlength="14"
						bind:value={cpf}
						oninput={handleCpfInput}
						disabled={isLoading}
						required
					/>
				</div>

				<div class="input-group">
					<label for="senha" class="sr-only">Senha</label>
					<div class="password-input-wrapper">
						<input
							type={showPassword ? "text" : "password"}
							id="senha"
							name="senha"
							placeholder="Sua senha secreta"
							bind:value={senha}
							disabled={isLoading}
							required
						/>
						<button
							type="button"
							class="toggle-password"
							onclick={() => (showPassword = !showPassword)}
							aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
						>
							{showPassword ? "Ocultar" : "Mostrar"}
						</button>
					</div>
				</div>

				<div class="form-options">
					<label class="remember-me">
						<input type="checkbox" bind:checked={rememberMe} />
						Lembrar de mim
					</label>
					<a href="/esqueci-senha" class="forgot-password">Esqueceu a Senha?</a>
				</div>

				<button type="submit" class="login-button" disabled={isLoading}>
					{#if isLoading}
						Carregando...
					{:else}
						ENTRAR
					{/if}
				</button>

				<div class="register-link">
					Ainda não tem conta? <a href="/registro">Registre-se aqui</a>
				</div>
			</form>
		</div>
		<div class="login-right">
			<img src={logo} alt="Logo São Miguel" class="logo" />
		</div>
	</div>
</div>

<style>
	/* Acessibility: Hide label visually but keep for screen readers */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f4f7f6; /* Soft neutral background to make card pop */
		padding: 1rem;
	}

	.login-card {
		display: flex;
		width: 100%;
		max-width: 900px;
		background: #ffffff;
		border-radius: 20px;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		min-height: 550px;
	}

	.login-left {
		flex: 1;
		background: #6fdec2; /* Primary teal color */
		padding: 3.5rem 3rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #ffffff;
	}

	.login-right {
		flex: 1;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
	}

	.logo-mobile {
		display: none;
		width: 120px;
		margin: 0 auto 2rem;
		filter: brightness(0) invert(1);
	}

	.title {
		font-size: 2.2rem;
		font-weight: 800;
		text-transform: uppercase;
		text-align: center;
		margin-bottom: 2.5rem;
		letter-spacing: 2px;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 340px;
		margin: 0 auto;
	}

	.error-message {
		background-color: rgba(255, 255, 255, 0.9);
		color: #c62828;
		padding: 0.75rem;
		border-radius: 50px;
		font-size: 0.875rem;
		text-align: center;
		font-weight: 600;
	}

	.input-group {
		width: 100%;
	}

	input[type="text"],
	input[type="password"] {
		width: 100%;
		padding: 1rem 1.5rem;
		font-size: 1rem;
		border: none;
		border-radius: 50px;
		background: #ffffff;
		color: #333;
		outline: none;
		text-align: center;
		font-weight: 500;
		box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
		transition: box-shadow 0.3s ease;
	}

	input::placeholder {
		color: #aaa;
		font-weight: 400;
	}

	input:focus {
		box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.4);
	}

	.password-input-wrapper {
		position: relative;
		width: 100%;
	}

	.password-input-wrapper input {
		/* Add padding right to avoid text overlapping the toggle button */
		padding-right: 4.5rem;
		padding-left: 4.5rem; /* Balance centering */
	}

	.toggle-password {
		position: absolute;
		right: 1.2rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: #6fdec2;
		font-size: 0.8rem;
		font-weight: 700;
		cursor: pointer;
		padding: 0;
		text-transform: uppercase;
	}
	
	.toggle-password:hover {
		color: #5bccae;
	}

	.form-options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9rem;
		margin-top: -0.5rem;
	}

	.remember-me {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.remember-me input[type="checkbox"] {
		width: 16px;
		height: 16px;
		accent-color: #b69e55;
		cursor: pointer;
	}

	.forgot-password {
		color: #ffffff;
		text-decoration: none;
		transition: opacity 0.2s;
	}

	.forgot-password:hover {
		text-decoration: underline;
		opacity: 0.9;
	}

	.login-button {
		width: 100%;
		padding: 1.1rem;
		font-size: 1.1rem;
		font-weight: 700;
		color: #ffffff;
		background: #b69e55;
		border: none;
		border-radius: 50px;
		cursor: pointer;
		text-transform: uppercase;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(182, 158, 85, 0.4);
		margin-top: 0.5rem;
	}

	.login-button:hover:not(:disabled) {
		background: #a8914b;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(182, 158, 85, 0.5);
	}

	.login-button:disabled {
		background: #d4c8a1;
		cursor: not-allowed;
		box-shadow: none;
	}

	.register-link {
		text-align: center;
		font-size: 0.9rem;
		margin-top: 1rem;
	}

	.register-link a {
		color: #ffffff;
		font-weight: 700;
		text-decoration: none;
	}

	.register-link a:hover {
		text-decoration: underline;
	}

	.logo {
		width: 80%;
		max-width: 350px;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.08));
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.login-card {
			flex-direction: column;
			max-width: 420px;
			min-height: auto;
		}

		.login-right {
			display: none; /* Hide illustration side on mobile to save space */
		}

		.login-left {
			padding: 3rem 2rem;
			border-radius: 20px;
		}
		
		.logo-mobile {
			display: block;
		}
	}
</style>
