// ===================================
// AUTENTICAÇÃO - Sistema de Chamados TI
// ===================================

/**
 * FUNÇÃO: login()
 * 
 * Responsável por:
 * - Capturar os dados do usuário e senha do formulário HTML
 * - Validar as credenciais (admin / 123)
 * - Salvar o usuário no localStorage se válido
 * - Redirecionar para dashboard.html se válido
 * - Mostrar mensagem de erro se inválido
 */
function login() {
    
    // Captura os valores dos campos de entrada do HTML
    const usuarioInput = document.getElementById('username');
    const senhaInput = document.getElementById('password');
    const mensagemErro = document.getElementById('errorMessage');
    
    // Obtém o valor digitado pelo usuário (trim remove espaços em branco)
    const usuario = usuarioInput.value.trim();
    const senha = senhaInput.value;
    
    // Limpa a mensagem de erro anterior
    mensagemErro.textContent = '';
    
    // ===== VALIDAÇÃO 1: Campos vazios =====
    // Verifica se o usuário e a senha foram preenchidos
    if (!usuario || !senha) {
        mensagemErro.textContent = 'Por favor, preencha todos os campos';
        return false;
    }
    
    // ===== VALIDAÇÃO 2: Credenciais corretas =====
    // Define as credenciais válidas
    const usuarioValido = 'admin';
    const senhaValida = '123';
    
    // Compara os valores inseridos com as credenciais corretas
    if (usuario === usuarioValido && senha === senhaValida) {
        
        // ✅ CREDENCIAIS CORRETAS
        
        // Salva o nome do usuário no localStorage
        // localStorage é um armazenamento local no navegador
        localStorage.setItem('usuarioLogado', usuario);
        
        // Log no console para fins de debug (pode ser removido depois)
        console.log('✓ Login realizado com sucesso!');
        console.log('Usuário salvo:', usuario);
        
        // Pressiona a página para o dashboard depois de 500ms
        // (dá tempo para o usuário ver qualquer feedback visual)
        setTimeout(function() {
            window.location.href = 'dashboard.html';
        }, 500);
        
        return true;
        
    } else {
        
        // ❌ CREDENCIAIS INCORRETAS
        
        // Mostra mensagem de erro para o usuário
        mensagemErro.textContent = 'Usuário ou senha incorretos';
        
        // Limpa o campo de senha por segurança
        senhaInput.value = '';
        
        // Log no console para fins de debug
        console.log('✗ Tentativa de login falhou');
        
        return false;
    }
}

// ===================================
// EVENTO DO FORMULÁRIO
// ===================================

// Espera o documento HTML carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // Obtém referência ao formulário
    const formulario = document.getElementById('loginForm');
    
    // Adiciona evento ao formulário para interceptar o envio
    formulario.addEventListener('submit', function(evento) {
        
        // Previne o comportamento padrão do formulário
        // (normalmente recarrega a página)
        evento.preventDefault();
        
        // Chama a função login()
        login();
    });
});

// ===================================
// NOTAS DIDÁTICAS PARA INICIANTES
// ===================================

/*
 * 📚 CONCEITOS IMPORTANTES:
 * 
 * 1. FUNÇÕES:
 *    function login() { ... }
 *    Define um bloco de código reutilizável
 * 
 * 2. getElementById():
 *    Encontra elementos no HTML pelo atributo id
 *    Exemplo: document.getElementById('username')
 * 
 * 3. .value:
 *    Obtém o valor digitado em um input
 *    input.value retorna o texto do campo
 * 
 * 4. .trim():
 *    Remove espaços em branco no início e fim
 *    'usuario ' vira 'usuario'
 * 
 * 5. localStorage:
 *    Armazena dados no navegador do usuário
 *    localStorage.setItem('chave', 'valor')
 *    Os dados persistem mesmo após fechar o navegador
 * 
 * 6. window.location.href:
 *    Redireciona para outra página
 *    window.location.href = 'outra-pagina.html'
 * 
 * 7. addEventListener('submit', ...):
 *    Escuta quando o formulário é enviado
 *    preventDefault() impede o comportamento padrão
 * 
 * ⚠️ SEGURANÇA:
 *    Este é um exemplo educativo. Em produção:
 *    - Nunca coloque senhas no cliente (visível no JavaScript)
 *    - Sempre valide dados no servidor
 *    - Use HTTPS para transmitir dados sensíveis
 *    - Use APIs e tokens (JWT) para autenticação
 *    - Implemente proteção contra força bruta
 */
