// ===============================================
// SCRIPT.JS - Sistema de Chamados de TI
// Gerenciamento de chamados com localStorage
// ===============================================

/**
 * ========================================
 * INICIALIZAÇÃO DA PÁGINA
 * ========================================
 * 
 * Executa quando o HTML estiver completamente carregado
 * Configura eventos e carrega dados iniciais
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada. Iniciando dashboard...');
    
    // Verifica se o usuário está autenticado
    verificarAutenticacao();
    
    // Carrega e exibe os chamados existentes
    carregarChamados();
    
    // Cria o gráfico inicial
    atualizarGrafico();
    
    // ===== CONFIGURAÇÃO DOS EVENTOS =====
    
    // Evento: Quando o formulário "Novo Chamado" é enviado
    document.getElementById('formChamado').addEventListener('submit', function(evento) {
        evento.preventDefault(); // Previne recarga da página
        criarChamado(); // Chama função para criar
    });
    
    // Evento: Quando o filtro de status muda
    document.getElementById('filtroStatus').addEventListener('change', function() {
        console.log('Filtro alterado. Recarregando tabela...');
        carregarChamados(); // Recarrega a tabela com filtro
    });
    
    // Evento: Quando clica no botão "Sair"
    document.getElementById('btnSair').addEventListener('click', function() {
        logout();
    });
});

/**
 * ========================================
 * FUNÇÃO: verificarAutenticacao()
 * ========================================
 * 
 * Verifica se o usuário está logado
 * Se não estiver, redireciona para login
 */
function verificarAutenticacao() {
    
    // Tenta obter o usuário do localStorage
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    // Se não houver usuário salvo...
    if (!usuarioLogado) {
        console.log('❌ Nenhum usuário logado. Redirecionando para login...');
        // Redireciona para página de login
        window.location.href = 'index.html';
        return;
    }
    
    // Se houver usuário, mostra seu nome no header
    console.log('✓ Usuário autenticado:', usuarioLogado);
    document.getElementById('usuarioLogado').textContent = usuarioLogado;
}

/**
 * ========================================
 * FUNÇÃO: obterChamados()
 * ========================================
 * 
 * Lê todos os chamados salvos no localStorage
 * 
 * RETORNA: Array com os chamados ou [] se vazio
 */
function obterChamados() {
    
    // Tenta obter os dados do localStorage
    const chamadosJSON = localStorage.getItem('chamados');
    
    // Se não existirem dados, retorna array vazio
    if (!chamadosJSON) {
        console.log('ℹ️ Nenhum chamado encontrado no localStorage');
        return [];
    }
    
    // Converte a string JSON para um array de objetos
    // JSON.parse() transforma texto em objeto JavaScript
    const chamados = JSON.parse(chamadosJSON);
    console.log('✓ Chamados carregados:', chamados.length + ' encontrados');
    
    return chamados;
}

/**
 * ========================================
 * FUNÇÃO: salvarChamados(chamados)
 * ========================================
 * 
 * Salva um array de chamados no localStorage
 * 
 * PARÂMETRO: chamados - Array de objetos de chamados
 */
function salvarChamados(chamados) {
    
    // JSON.stringify() converte objeto JavaScript para string JSON
    const chamadosJSON = JSON.stringify(chamados);
    
    // Salva no localStorage
    localStorage.setItem('chamados', chamadosJSON);
    
    console.log('✓ Chamados salvos no localStorage');
}

/**
 * ========================================
 * FUNÇÃO: criarChamado()
 * ========================================
 * 
 * Captura dados do formulário HTML
 * Valida os dados
 * Cria um novo objeto de chamado
 * Salva no localStorage
 * Atualiza a tela
 */
function criarChamado() {
    
    console.log('--- Criando novo chamado ---');
    
    // ===== CAPTURA DOS DADOS DO FORMULÁRIO =====
    
    // Captura o valor do campo "Solicitante"
    const solicitante = document.getElementById('solicitante').value.trim();
    
    // Captura o tipo de problema selecionado
    const tipoProblem = document.getElementById('tipoProblem').value;
    
    // Captura a descrição do problema
    const descricao = document.getElementById('descricao').value.trim();
    
    // Captura o status inicial do chamado
    const status = document.getElementById('status').value;
    
    // ===== VALIDAÇÃO DOS DADOS =====
    
    // Verifica se todos os campos foram preenchidos
    if (!solicitante || !tipoProblem || !descricao || !status) {
        console.warn('⚠️ Campos vazios. Criação cancelada.');
        alert('❌ Por favor, preencha todos os campos');
        return; // Sai da função
    }
    
    console.log('✓ Validação passou');
    
    // ===== OBTENÇÃO DO PRÓXIMO ID =====
    
    // Obtém os chamados existentes
    const chamados = obterChamados();
    
    // Calcula o próximo ID
    // Se houver chamados, pega o maior ID e adiciona 1
    // Se não houver, começa com 1
    const novoId = chamados.length > 0 
        ? Math.max(...chamados.map(c => c.id)) + 1 
        : 1;
    
    console.log('Novo ID gerado:', novoId);
    
    // ===== CRIAÇÃO DO OBJETO CHAMADO =====
    
    // Cria um novo objeto com os dados do chamado
    const novoChamado = {
        id: novoId,                                    // ID único
        solicitante: solicitante,                      // Nome de quem abriu
        tipo: tipoProblem,                             // Tipo: Software/Hardware/Rede
        descricao: descricao,                          // Descrição do problema
        status: status,                                // Status atual
        dataCriacao: new Date().toLocaleDateString('pt-BR') // Data de hoje
    };
    
    console.log('Novo chamado criado:', novoChamado);
    
    // ===== SALVAMENTO =====
    
    // Adiciona o novo chamado à lista
    chamados.push(novoChamado);
    
    // Salva a lista atualizada no localStorage
    salvarChamados(chamados);
    
    // ===== FEEDBACK E ATUALIZAÇÃO =====
    
    // Mostra mensagem de sucesso ao usuário
    alert('✓ Chamado criado com sucesso!\nID: #' + novoId);
    
    // Limpa todos os campos do formulário
    document.getElementById('formChamado').reset();
    
    // Recarrega a tabela para mostrar o novo chamado
    carregarChamados();
    
    // Atualiza o gráfico
    atualizarGrafico();
}

/**
 * ========================================
 * FUNÇÃO: carregarChamados()
 * ========================================
 * 
 * Obtém os chamados do localStorage
 * Aplica filtro de status se selecionado
 * Exibe na tabela HTML
 */
function carregarChamados() {
    
    console.log('--- Carregando chamados ---');
    
    // ===== OBTENÇÃO E FILTRAGEM DOS DADOS =====
    
    // Obtém todos os chamados
    let chamados = obterChamados();
    
    // Obtém o valor do filtro selecionado
    const filtroStatus = document.getElementById('filtroStatus').value;
    
    // Se há filtro, filtra apenas chamados com esse status
    if (filtroStatus) {
        console.log('Aplicando filtro:', filtroStatus);
        // Array.filter() cria um novo array apenas com itens que atendem a condição
        chamados = chamados.filter(chamado => chamado.status === filtroStatus);
    }
    
    console.log('Chamados a exibir:', chamados.length);
    
    // ===== LIMPEZA E PREENCHIMENTO DA TABELA =====
    
    // Obtém o elemento <tbody> (corpo da tabela)
    const tbody = document.getElementById('tabelaChamados');
    
    // Remove todas as linhas anteriores
    tbody.innerHTML = '';
    
    // Se não houver chamados, mostra mensagem
    if (chamados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #999;">
                    Nenhum chamado encontrado
                </td>
            </tr>
        `;
        return;
    }
    
    // ===== CRIAÇÃO DAS LINHAS DA TABELA =====
    
    // Para cada chamado, cria uma linha na tabela
    chamados.forEach(chamado => {
        
        // Define a cor do badge de status
        let corStatus = 'status-aberto'; // Padrão: laranja
        if (chamado.status === 'Em andamento') {
            corStatus = 'status-andamento'; // Azul
        } else if (chamado.status === 'Resolvido') {
            corStatus = 'status-resolvido'; // Verde
        }
        
        // Cria uma nova linha (<tr>)
        const tr = document.createElement('tr');
        
        // Define o conteúdo HTML da linha
        tr.innerHTML = `
            <td>#${chamado.id}</td>
            <td>${chamado.solicitante}</td>
            <td>${chamado.tipo}</td>
            <td>${chamado.descricao.substring(0, 30)}...</td>
            <td><span class="badge ${corStatus}">${chamado.status}</span></td>
            <td>
                <button class="btn-deletar" onclick="deletarChamado(${chamado.id})">
                    Deletar
                </button>
            </td>
        `;
        
        // Adiciona a linha ao final da tabela
        tbody.appendChild(tr);
    });
    
    console.log('✓ Tabela atualizada');
}

/**
 * ========================================
 * FUNÇÃO: deletarChamado(id)
 * ========================================
 * 
 * Remove um chamado pelo seu ID
 * 
 * PARÂMETRO: id - ID do chamado a deletar
 */
function deletarChamado(id) {
    
    console.log('--- Deletando chamado #' + id + ' ---');
    
    // Pede confirmação ao usuário
    // confirm() retorna true (ok) ou false (cancelar)
    const confirmacao = confirm(
        'Tem certeza que deseja deletar o chamado #' + id + '?\n\n' +
        'Esta ação não pode ser desfeita.'
    );
    
    // Se o usuário clicou "Cancelar", sai da função
    if (!confirmacao) {
        console.log('Exclusão cancelada pelo usuário');
        return;
    }
    
    // ===== REMOÇÃO DO CHAMADO =====
    
    // Obtém todos os chamados
    let chamados = obterChamados();
    
    // Encontra o chamado a ser deletado (para log)
    const chamadoDeletado = chamados.find(c => c.id === id);
    console.log('Chamado a deletar:', chamadoDeletado);
    
    // Filtra removendo apenas o chamado com ID especificado
    // Array.filter() mantém todos EXCETO aquele que testamos
    chamados = chamados.filter(chamado => chamado.id !== id);
    
    // Salva a lista atualizada
    salvarChamados(chamados);
    
    console.log('✓ Chamado deletado com sucesso');
    
    // ===== ATUALIZAÇÃO DA TELA =====
    
    // Recarrega a tabela
    carregarChamados();
    
    // Atualiza o gráfico
    atualizarGrafico();
}

/**
 * ========================================
 * FUNÇÃO: atualizarGrafico()
 * ========================================
 * 
 * Conta quantos chamados existem em cada status
 * Exibe um gráfico de barras usando Chart.js
 */
function atualizarGrafico() {
    
    console.log('--- Atualizando gráfico ---');
    
    // ===== CONTAGEM DE CHAMADOS POR STATUS =====
    
    // Obtém todos os chamados
    const chamados = obterChamados();
    
    // Cria um objeto para contar chamados por status
    // Começa com 0 em cada status
    const contagem = {
        'Aberto': 0,
        'Em andamento': 0,
        'Resolvido': 0
    };
    
    // Para cada chamado, incrementa o contador do seu status
    // Array.forEach() executa uma ação para cada item
    chamados.forEach(chamado => {
        contagem[chamado.status]++;
    });
    
    console.log('Contagem por status:', contagem);
    
    // ===== CRIAÇÃO DO GRÁFICO COM CHART.JS =====
    
    // Obtém o elemento <canvas> onde o gráfico será desenhado
    const ctx = document.getElementById('grafico').getContext('2d');
    
    // Se já existe um gráfico, destroi para criar um novo
    // (evita duplicação)
    if (window.graficoChamados) {
        window.graficoChamados.destroy();
        console.log('Gráfico anterior destruído');
    }
    
    // Cria um novo gráfico com Chart.js
    window.graficoChamados = new Chart(ctx, {
        
        // Tipo de gráfico: barras (bar), pizza (pie), linha (line), etc
        type: 'bar',
        
        // Dados do gráfico
        data: {
            // Rótulos no eixo X
            labels: ['Aberto', 'Em andamento', 'Resolvido'],
            
            // Datasets (conjuntos de dados)
            datasets: [{
                label: 'Quantidade de Chamados',
                
                // Valores do gráfico
                data: [
                    contagem['Aberto'],
                    contagem['Em andamento'],
                    contagem['Resolvido']
                ],
                
                // Cores das barras
                backgroundColor: [
                    '#ff9800', // Laranja para Aberto
                    '#2196f3', // Azul para Em andamento
                    '#4caf50'  // Verde para Resolvido
                ],
                
                // Cores das bordas
                borderColor: [
                    '#f57c00',
                    '#1976d2',
                    '#388e3c'
                ],
                
                // Espessura da borda
                borderWidth: 2
            }]
        },
        
        // Opções de configuração
        options: {
            responsive: true,           // Responsivo ao tamanho da tela
            maintainAspectRatio: true,  // Mantém proporção
            scales: {
                y: {
                    beginAtZero: true, // Eixo Y começa em 0
                    max: 10            // Máximo de 10 no eixo Y
                }
            }
        }
    });
    
    console.log('✓ Gráfico criado/atualizado');
}

/**
 * ========================================
 * FUNÇÃO: logout()
 * ========================================
 * 
 * Desconecta o usuário da aplicação
 * Remove dados da sessão
 * Redireciona para login
 */
function logout() {
    
    console.log('--- Realizando logout ---');
    
    // Pede confirmação ao usuário
    const confirmacao = confirm('Tem certeza que deseja sair?');
    
    if (!confirmacao) {
        console.log('Logout cancelado');
        return;
    }
    
    // Remove o dados de autenticação do localStorage
    localStorage.removeItem('usuarioLogado');
    
    console.log('✓ Usuário desconectado');
    
    // Redireciona para a página de login
    window.location.href = 'index.html';
}

// ===============================================
// NOTAS DIDÁTICAS PARA INICIANTES
// ===============================================

/*
 * 📚 CONCEITOS IMPORTANTES UTILIZADOS:
 * 
 * 1. localStorage
 *    - Armazena dados no navegador do usuário
 *    - Dados persistem (não desaparecem ao fechar navegador)
 *    - Limite: ~5MB
 *    - getItem(chave) - obtém valor
 *    - setItem(chave, valor) - salva valor
 *    - removeItem(chave) - remove valor
 * 
 * 2. JSON (JavaScript Object Notation)
 *    - Formato de texto para dados estruturados
 *    - JSON.stringify() - transforma objeto em texto
 *    - JSON.parse() - transforma texto em objeto
 *    - Exemplo: {"id": 1, "nome": "João"}
 * 
 * 3. Arrays e Métodos
 *    - push() - adiciona elemento no final
 *    - filter() - cria novo array filtrando itens
 *    - forEach() - executa ação para cada item
 *    - map() - transforma cada item em um novo array
 *    - find() - retorna primeiro item que atende condição
 * 
 * 4. DOM (Document Object Model)
 *    - getElementById() - encontra elemento pelo id
 *    - createElement() - cria novo elemento HTML
 *    - appendChild() - adiciona elemento dentro de outro
 *    - innerHTML - acessa conteúdo HTML de um elemento
 * 
 * 5. Eventos
 *    - addEventListener() - escuta quando algo acontece
 *    - submit - quando formulário é enviado
 *    - change - quando valor muda em input/select
 *    - click - quando usuario clica
 * 
 * 6. Chart.js
 *    - Biblioteca para criar gráficos
 *    - new Chart(canvas, configuração) - cria gráfico
 *    - Tipos: bar, line, pie, doughnut, etc
 * 
 * ⚠️ SEGURANÇA - IMPORTANTE:
 *    Este é código EDUCATIVO apenas!
 *    Em PRODUÇÃO você DEVE:
 *    - Usar backend/servidor para salvar dados
 *    - Usar banco de dados (MySQL, MongoDB, etc)
 *    - Validar dados no servidor sempre
 *    - Usar HTTPS para transmitir dados
 *    - Implementar autenticação segura (JWT)
 *    - Nunca armazene senhas no cliente
 */
