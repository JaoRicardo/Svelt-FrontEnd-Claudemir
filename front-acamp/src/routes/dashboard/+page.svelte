<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import logo from '$lib/imgs/logo_saomiguel - Copy.png';

	$effect(() => {
		// Se já terminou de carregar e não está autenticado, volta pro login
		if (!auth.isLoading && !auth.isAuthenticated) {
			window.location.href = '/login';
		}
	});

	function handleLogout() {
		auth.clearToken();
		window.location.href = '/login';
	}
</script>

<svelte:head>
	<title>Painel | Acampamento São Miguel</title>
</svelte:head>

<div class="dashboard-container">
	{#if auth.isLoading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Verificando acesso...</p>
		</div>
	{:else if auth.isAuthenticated && auth.user}
		<div class="dashboard-card">
			<div class="header">
				<img src={logo} alt="Logo São Miguel" class="logo" />
				<button class="logout-btn" onclick={handleLogout}>Sair da Conta</button>
			</div>
			
			<div class="welcome-section">
				<h1 class="title">Olá, {auth.user.name?.split(' ')[0] || 'Usuário'}!</h1>
				<p class="subtitle">Bem-vindo(a) ao seu painel de controle do acampamento.</p>
			</div>

			<div class="info-grid">
				<div class="info-card">
					<span class="label">Nome Completo</span>
					<span class="value">{auth.user.name}</span>
				</div>
				<div class="info-card">
					<span class="label">CPF</span>
					<span class="value">{auth.user.cpf}</span>
				</div>
				<div class="info-card">
					<span class="label">E-mail</span>
					<span class="value">{auth.user.email}</span>
				</div>
				<div class="info-card">
					<span class="label">Telefone</span>
					<span class="value">{auth.user.phone || 'Não informado'}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.dashboard-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #ffffff;
		background: radial-gradient(circle at top left, rgba(111, 222, 194, 0.08), transparent 40%),
					radial-gradient(circle at bottom right, rgba(182, 158, 85, 0.06), transparent 40%);
		padding: 2rem;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: #666;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(111, 222, 194, 0.3);
		border-top-color: #6FDEC2;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.dashboard-card {
		background: #ffffff;
		width: 100%;
		max-width: 800px;
		padding: 2.5rem;
		border-radius: 24px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05), 
					0 1px 3px rgba(0, 0, 0, 0.02);
		border: 1px solid rgba(182, 158, 85, 0.15);
		animation: slideUp 0.4s ease-out;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #f0f0f0;
	}

	.logo {
		width: 120px;
		height: auto;
		object-fit: contain;
	}

	.logout-btn {
		padding: 0.6rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: #c62828;
		background: #ffebee;
		border: 1px solid #ffcdd2;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.logout-btn:hover {
		background: #ffcdd2;
		color: #b71c1c;
	}

	.welcome-section {
		margin-bottom: 3rem;
	}

	.title {
		font-size: 2rem;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1rem;
		color: #666;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.info-card {
		background: #fafafa;
		padding: 1.5rem;
		border-radius: 16px;
		border: 1px solid #eaeaea;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		transition: transform 0.2s ease;
	}

	.info-card:hover {
		transform: translateY(-2px);
		border-color: rgba(111, 222, 194, 0.4);
		background: #ffffff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
	}

	.label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #a0a0a0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.value {
		font-size: 1.1rem;
		color: #333;
		font-weight: 500;
		word-break: break-word;
	}

	@media (max-width: 600px) {
		.dashboard-card {
			padding: 1.5rem;
		}
		
		.header {
			flex-direction: column;
			gap: 1.5rem;
			align-items: center;
		}
	}
</style>
