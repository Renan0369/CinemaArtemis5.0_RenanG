// Constantes e variáveis globais
const precoIngresso = 30;  // Preço fixo do ingresso
let quantidade = 1;  // Quantidade inicial de ingressos

// Usuário administrador simulado
const adminUser = { email: "admin@cinema.com", senha: "admin123", isAdmin: true, nome: "Administrador" };

// Filmes iniciais
const filmesIniciais = [
  {
    id: 1,
    nome: "Arca de Noé",
    descricao: "Uma aventura animada.",
    preco: 30,
    capa: "../img/filme1.jpg"
  },
  {
    id: 2,
    nome: "Drácula: A História Nunca Contada",
    descricao: "Origem sombria do vampiro.",
    preco: 30,
    capa: "../img/filme2.jpg"
  },
  {
    id: 3,
    nome: "Megamente",
    descricao: "O vilão mais divertido.",
    preco: 30,
    capa: "../img/filme3.jpg"
  }
];

// Função para inicializar filmes no localStorage
function inicializarFilmes() {
  const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");
  if (filmes.length === 0) {
    localStorage.setItem("filmes", JSON.stringify(filmesIniciais));
  }
}

// Função para carregar filmes na página inicial
function carregarFilmesHome() {
  const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");
  const listaFilmesDiv = document.getElementById("listaFilmesHome");

  if (listaFilmesDiv) {
    listaFilmesDiv.innerHTML = ""; // Limpa a lista

    if (filmes.length === 0) {
      listaFilmesDiv.innerHTML = "<p>Nenhum filme disponível no momento.</p>";
      return;
    }

    // Cria cards de filmes
    filmes.forEach(filme => {
      const filmeDiv = document.createElement("div");
      filmeDiv.className = "filme";
      filmeDiv.onclick = () => selecionarFilme(filme.nome);

      // Imagem do filme
      const img = document.createElement("img");
      img.src = filme.capa;
      img.alt = filme.nome;
      filmeDiv.appendChild(img);

      // Título do filme
      const titulo = document.createElement("h3");
      titulo.textContent = filme.nome;
      filmeDiv.appendChild(titulo);

      // Descrição e preço
      const descricao = document.createElement("p");
      descricao.textContent = `${filme.descricao} 🎟️ R$${filme.preco},00`;
      filmeDiv.appendChild(descricao);

      listaFilmesDiv.appendChild(filmeDiv);
    });
  }
}

// Função para verificar se o usuário está logado
function verificarLogin() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  return usuarioLogado ? JSON.parse(usuarioLogado) : null;
}

// Função para verificar se o usuário é administrador
function verificarAdmin() {
  const usuario = verificarLogin();
  return usuario && usuario.isAdmin;
}

// Função para atualizar a interface com base no status de login
function atualizarInterfaceLogin() {
  const usuario = verificarLogin();
  const userInfoHeader = document.getElementById("userInfoHeader");

  if (userInfoHeader) {
    userInfoHeader.innerHTML = ""; // Limpa o conteúdo existente
    if (usuario) {
      // Se estiver logado, mostra informações do usuário e link de logout
      const userNameSpan = document.createElement("span");
      userNameSpan.textContent = `Olá, ${usuario.nome}`;
      userInfoHeader.appendChild(userNameSpan);

      const logoutLink = document.createElement("a");
      logoutLink.href = "#";
      logoutLink.textContent = "Sair";
      logoutLink.onclick = fazerLogout;
      userInfoHeader.appendChild(logoutLink);

      // Se for admin, adiciona link para o painel de administração
      if (usuario.isAdmin) {
        const adminLink = document.createElement("a");
        adminLink.href = "admin.html"; // Página do painel de administração
        adminLink.textContent = "Painel Admin";
        adminLink.style.marginLeft = "10px";
        userInfoHeader.appendChild(adminLink);
      }

    } else {
      // Se não estiver logado, mostra o ícone de login
      const loginIconLink = document.createElement("a");
      loginIconLink.href = "login.html";
      loginIconLink.className = "login-icon";
      loginIconLink.textContent = "👤";
      userInfoHeader.appendChild(loginIconLink);
    }
  }
}

// Função para fazer login
function fazerLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  // Busca usuários cadastrados
  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // Adiciona o admin user se não existir
  if (!usuarios.some(u => u.email === adminUser.email)) {
    usuarios.push(adminUser);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    // Login bem-sucedido
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    // Registra o login no histórico
    registrarHistoricoLogin(usuario);

    // Redireciona para a página anterior ou para a página inicial
    const paginaAnterior = localStorage.getItem("paginaAnterior") || "index.html";
    window.location.href = paginaAnterior;
  } else {
    // Login falhou
    alert("E-mail ou senha incorretos. Tente novamente.");
  }
}

// Função para registrar histórico de login
function registrarHistoricoLogin(usuario) {
  const historico = JSON.parse(localStorage.getItem("historicoLogins") || "[]");
  const login = {
    usuario: usuario.email,
    nome: usuario.nome,
    data: new Date().toISOString(),
    isAdmin: usuario.isAdmin
  };
  historico.push(login);
  localStorage.setItem("historicoLogins", JSON.stringify(historico));
}

// Função para fazer cadastro
function fazerCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  // Validações
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem. Tente novamente.");
    return;
  }

  // Busca usuários cadastrados
  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // Verifica se o e-mail já está cadastrado
  if (usuarios.some(u => u.email === email)) {
    alert("Este e-mail já está cadastrado. Tente fazer login.");
    return;
  }

  // Adiciona o novo usuário
  const novoUsuario = {
    nome,
    email,
    senha,
    isAdmin: false,
    dataCadastro: new Date().toISOString()
  };
  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Faz login automático
  localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

  // Registra o cadastro no histórico
  registrarHistoricoLogin(novoUsuario);

  // Redireciona para a página anterior ou para a página inicial
  const paginaAnterior = localStorage.getItem("paginaAnterior") || "index.html";
  window.location.href = paginaAnterior;
}

// Função para fazer logout
function fazerLogout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// Função para selecionar um filme
function selecionarFilme(filme) {
  localStorage.setItem("filme", filme);  // Salva o filme no localStorage
  localStorage.setItem("paginaAnterior", "index.html");  // Salva a página atual

  // Verifica se o usuário está logado antes de prosseguir
  const usuario = verificarLogin();
  if (!usuario) {
    // Se não estiver logado, redireciona para a página de login
    window.location.href = "login.html";
  } else {
    // Se estiver logado, prossegue para a página de sessão
    window.location.href = "sessao.html";
  }
}

// Função para alterar a quantidade de ingressos
function alterarQuantidade(valor) {
  quantidade += valor;  // Incrementa ou decrementa a quantidade

  // Validações
  if (quantidade < 1) quantidade = 1;  // Mínimo de 1 ingresso
  if (quantidade > 8) {  // Máximo de 8 ingressos
    quantidade = 8;
    alert("Você só pode comprar no máximo 8 ingressos por vez.");
  }

  // Atualiza a exibição
  const qtdSpan = document.getElementById("qtdIngressos");
  const subtotalSpan = document.getElementById("subtotal");
  const filmeNome = localStorage.getItem("filme");
  const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");
  const filmeSelecionado = filmes.find(f => f.nome === filmeNome);

  if (qtdSpan && subtotalSpan && filmeSelecionado) {
    qtdSpan.textContent = quantidade;  // Atualiza a quantidade
    subtotalSpan.textContent = quantidade * filmeSelecionado.preco;  // Atualiza o subtotal
  }

  // Salva no localStorage
  localStorage.setItem("quantidade", quantidade);
  localStorage.setItem("subtotal", quantidade * precoIngresso);
}

// Função para confirmar a sessão
function confirmarSessao() {
  const quantidade = parseInt(localStorage.getItem("quantidade"));
  // Obtém assentos selecionados
  const assentosSelecionados = Array.from(document.querySelectorAll(".assento.selecionado")).map(el => el.dataset.id);
  const horarioSelecionado = localStorage.getItem("horario");

  // Validações
  if (assentosSelecionados.length !== quantidade) {
    alert("Escolha exatamente " + quantidade + " assento(s).");
    return;
  }

  if (!horarioSelecionado) {
    alert("Selecione um horário.");
    return;
  }

  // Salva no localStorage e redireciona
  localStorage.setItem("assentos", JSON.stringify(assentosSelecionados));
  localStorage.setItem("quantidade", quantidade);
  window.location.href = "confirmacao.html";
}

// Função para processar o pagamento
function processarPagamento(event) {
  event.preventDefault();  // Previne o comportamento padrão do formulário

  // Verifica se o usuário está logado
  const usuario = verificarLogin();
  if (!usuario) {
    alert("Você precisa estar logado para finalizar a compra.");
    localStorage.setItem("paginaAnterior", "confirmacao.html");
    window.location.href = "login.html";
    return;
  }

  // Obtém os dados do formulário e do localStorage
  const nome = document.getElementById("nome").value;
  const filme = localStorage.getItem("filme");
  const horario = localStorage.getItem("horario");
  const assentos = JSON.parse(localStorage.getItem("assentos"));
  const quantidade = localStorage.getItem("quantidade");
  const subtotal = localStorage.getItem("subtotal");

  // Registra a compra no histórico
  registrarHistoricoCompra(usuario, filme, horario, assentos, quantidade, subtotal);

  const filmeNome = localStorage.getItem("filme");
  const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");
  const filmeSelecionado = filmes.find(f => f.nome === filmeNome);

  // Gera o conteúdo da nota fiscal
  const conteudoNota = `
🎟️ NOTA FISCAL - CINEMA ARTEMIS 🎟️

Nome: ${nome}
E-mail: ${usuario.email}
Filme: ${filme}
Horário: ${horario}
Assentos: ${assentos.join(", ")}
Quantidade de ingressos: ${quantidade}
Valor unitário: R$${filmeSelecionado.preco},00
Valor total: R$${parseInt(subtotal)},00

Obrigado pela preferência!
`;

  // Cria e faz download da nota fiscal
  const blob = new Blob([conteudoNota], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "nota-fiscal.txt";
  link.click();

  // Mostra mensagem de sucesso
  alert("Pagamento aprovado! 🎉 Sua nota fiscal foi baixada.");
}

// Função para registrar histórico de compra
function registrarHistoricoCompra(usuario, filme, horario, assentos, quantidade, subtotal) {
  const historico = JSON.parse(localStorage.getItem("historicoCompras") || "[]");
  const compra = {
    usuario: usuario.email,
    nome: usuario.nome,
    filme,
    horario,
    assentos,
    quantidade,
    subtotal,
    data: new Date().toISOString()
  };
  historico.push(compra);
  localStorage.setItem("historicoCompras", JSON.stringify(historico));
}

// Função para adicionar um novo filme (admin)
function adicionarFilme(event) {
  event.preventDefault();

  // Verifica se é admin
  if (!verificarAdmin()) {
    alert("Apenas administradores podem adicionar filmes.");
    return;
  }

  // Obtém os dados do formulário
  const nome = document.getElementById("nomeFilme").value;
  const descricao = document.getElementById("descricaoFilme").value;
  const preco = parseInt(document.getElementById("precoFilme").value);
  const capa = document.getElementById("capaFilme").value;

  // Busca filmes cadastrados
  const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");

  // Gera um ID único para o novo filme
  const id = filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1;

  // Adiciona o novo filme
  const novoFilme = { id, nome, descricao, preco, capa };
  filmes.push(novoFilme);
  localStorage.setItem("filmes", JSON.stringify(filmes));

  // Limpa o formulário
  document.getElementById("formAdicionarFilme").reset();

  // Atualiza a lista de filmes
  carregarFilmesAdmin();

  // Mostra mensagem de sucesso
  alert(`Filme "${nome}" adicionado com sucesso!`);
}

// Função para remover um filme (admin)
function removerFilme(id) {
  // Verifica se é admin
  if (!verificarAdmin()) {
    alert("Apenas administradores podem remover filmes.");
    return;
  }

  // Confirma a remoção
  if (!confirm("Tem certeza que deseja remover este filme?")) {
    return;
  }

  // Busca filmes cadastrados
  let filmes = JSON.parse(localStorage.getItem("filmes") || "[]");

  // Remove o filme
  filmes = filmes.filter(f => f.id !== id);
  localStorage.setItem("filmes", JSON.stringify(filmes));

  // Atualiza a lista de filmes
  carregarFilmesAdmin();

  // Mostra mensagem de sucesso
  alert("Filme removido com sucesso!");
}

// Função para promover um usuário a administrador
function promoverUsuario(email) {
  // Verifica se é admin
  if (!verificarAdmin()) {
    alert("Apenas administradores podem promover usuários.");
    return;
  }

  // Confirma a promoção
  if (!confirm(`Tem certeza que deseja promover o usuário ${email} a administrador?`)) {
    return;
  }

  // Busca usuários cadastrados
  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // Encontra o usuário
  const index = usuarios.findIndex(u => u.email === email);
  if (index === -1) {
    alert("Usuário não encontrado.");
    return;
  }

  // Promove o usuário
  usuarios[index].isAdmin = true;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Atualiza a lista de usuários
  carregarUsuariosAdmin();

  // Mostra mensagem de sucesso
  alert(`Usuário ${email} promovido a administrador com sucesso!`);
}

// Função para rebaixar um usuário de administrador
function rebaixarUsuario(email) {
  // Verifica se é admin
  if (!verificarAdmin()) {
    alert("Apenas administradores podem rebaixar usuários.");
    return;
  }

  // Confirma o rebaixamento
  if (!confirm(`Tem certeza que deseja remover os privilégios de administrador do usuário ${email}?`)) {
    return;
  }

  // Busca usuários cadastrados
  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // Encontra o usuário
  const index = usuarios.findIndex(u => u.email === email);
  if (index === -1) {
    alert("Usuário não encontrado.");
    return;
  }

  // Rebaixa o usuário
  usuarios[index].isAdmin = false;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  // Atualiza a lista de usuários
  carregarUsuariosAdmin();

  // Mostra mensagem de sucesso
  alert(`Privilégios de administrador removidos do usuário ${email} com sucesso!`);
}

// Função para exportar usuários para CSV
function exportarUsuariosCSV() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  if (usuarios.length === 0) {
    alert("Nenhum usuário cadastrado para exportar.");
    return;
  }

  let csvContent = "Nome,Email,Admin,Data de Cadastro\n"; // Cabeçalho do CSV
  usuarios.forEach(user => {
    const dataCadastro = user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString('pt-BR') : 'N/A';
    csvContent += `${user.nome},${user.email},${user.isAdmin ? "Sim" : "Não"},${dataCadastro}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "usuarios.csv";
  link.click();
  alert("Usuários exportados para usuarios.csv!");
}

// Função para exportar histórico de logins para CSV
function exportarHistoricoLoginsCSV() {
  const historico = JSON.parse(localStorage.getItem("historicoLogins") || "[]");
  if (historico.length === 0) {
    alert("Nenhum histórico de login para exportar.");
    return;
  }

  let csvContent = "Nome,Email,Data,Admin\n"; // Cabeçalho do CSV
  historico.forEach(login => {
    const data = new Date(login.data).toLocaleString('pt-BR');
    csvContent += `${login.nome},${login.usuario},${data},${login.isAdmin ? "Sim" : "Não"}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historico_logins.csv";
  link.click();
  alert("Histórico de logins exportado para historico_logins.csv!");
}

// Função para exportar histórico de compras para CSV
function exportarHistoricoComprasCSV() {
  const historico = JSON.parse(localStorage.getItem("historicoCompras") || "[]");
  if (historico.length === 0) {
    alert("Nenhum histórico de compras para exportar.");
    return;
  }

  let csvContent = "Nome,Email,Filme,Horário,Assentos,Quantidade,Valor Total,Data\n"; // Cabeçalho do CSV
  historico.forEach(compra => {
    const data = new Date(compra.data).toLocaleString('pt-BR');
    csvContent += `${compra.nome},${compra.usuario},${compra.filme},${compra.horario},"${compra.assentos.join(', ')}",${compra.quantidade},R$${compra.subtotal},00,${data}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historico_compras.csv";
  link.click();
  alert("Histórico de compras exportado para historico_compras.csv!");
}

// Função para carregar filmes na página de administração
function carregarFilmesAdmin() {
  const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");
  const listaFilmesDiv = document.getElementById("listaFilmes");

  if (listaFilmesDiv) {
    listaFilmesDiv.innerHTML = ""; // Limpa a lista

    if (filmes.length === 0) {
      listaFilmesDiv.innerHTML = "<p>Nenhum filme cadastrado.</p>";
      return;
    }

    // Cria lista de filmes
    filmes.forEach(filme => {
      const filmeDiv = document.createElement("div");
      filmeDiv.className = "filme-item";

      // Imagem do filme
      const img = document.createElement("img");
      img.src = filme.capa;
      img.alt = filme.nome;
      filmeDiv.appendChild(img);

      // Informações do filme
      const infoDiv = document.createElement("div");
      infoDiv.className = "filme-info";

      const titulo = document.createElement("h4");
      titulo.textContent = filme.nome;
      infoDiv.appendChild(titulo);

      const descricao = document.createElement("p");
      descricao.textContent = filme.descricao;
      infoDiv.appendChild(descricao);

      const preco = document.createElement("p");
      preco.textContent = `Preço: R$${filme.preco},00`;
      infoDiv.appendChild(preco);

      filmeDiv.appendChild(infoDiv);

      // Ações do filme
      const acoesDiv = document.createElement("div");
      acoesDiv.className = "filme-actions";

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "Remover";
      btnRemover.className = "btn-danger";
      btnRemover.onclick = () => removerFilme(filme.id);
      acoesDiv.appendChild(btnRemover);

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.className = "btn-edit";
      btnEditar.onclick = () => editarFilme(filme);
      acoesDiv.appendChild(btnEditar);

      filmeDiv.appendChild(acoesDiv);

      listaFilmesDiv.appendChild(filmeDiv);
    });
  }

  // Atualiza estatísticas
  const totalFilmesSpan = document.getElementById("totalFilmes");
  if (totalFilmesSpan) {
    totalFilmesSpan.textContent = filmes.length;
  }
}

// Função para carregar usuários na página de administração
function carregarUsuariosAdmin() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const listaUsuariosDiv = document.getElementById("listaUsuarios");

  if (listaUsuariosDiv) {
    listaUsuariosDiv.innerHTML = ""; // Limpa a lista

    if (usuarios.length === 0) {
      listaUsuariosDiv.innerHTML = "<p>Nenhum usuário cadastrado.</p>";
      return;
    }

    // Adiciona botões de exportação
    const botoesDiv = document.createElement("div");
    botoesDiv.className = "admin-buttons";

    const btnExportarLogins = document.createElement("button");
    btnExportarLogins.textContent = "Exportar Histórico de Logins";
    btnExportarLogins.onclick = exportarHistoricoLoginsCSV;
    botoesDiv.appendChild(btnExportarLogins);

    const btnExportarCompras = document.createElement("button");
    btnExportarCompras.textContent = "Exportar Histórico de Compras";
    btnExportarCompras.onclick = exportarHistoricoComprasCSV;
    botoesDiv.appendChild(btnExportarCompras);

    listaUsuariosDiv.appendChild(botoesDiv);

    // Cria tabela de usuários
    const table = document.createElement("table");
    table.className = "admin-table";

    // Cabeçalho da tabela
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Nome", "Email", "Admin", "Data de Cadastro", "Ações"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corpo da tabela
    const tbody = document.createElement("tbody");
    usuarios.forEach(user => {
      const tr = document.createElement("tr");

      // Coluna Nome
      const tdNome = document.createElement("td");
      tdNome.textContent = user.nome;
      tr.appendChild(tdNome);

      // Coluna Email
      const tdEmail = document.createElement("td");
      tdEmail.textContent = user.email;
      tr.appendChild(tdEmail);

      // Coluna Admin
      const tdAdmin = document.createElement("td");
      tdAdmin.textContent = user.isAdmin ? "Sim" : "Não";
      tr.appendChild(tdAdmin);

      // Coluna Data de Cadastro
      const tdData = document.createElement("td");
      tdData.textContent = user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString('pt-BR') : 'N/A';
      tr.appendChild(tdData);

      // Coluna Ações
      const tdAcoes = document.createElement("td");
      tdAcoes.className = "user-actions";

      // Se não for admin, mostra botão para promover
      if (!user.isAdmin) {
        const btnPromover = document.createElement("button");
        btnPromover.textContent = "Promover a Admin";
        btnPromover.className = "btn-promote";
        btnPromover.onclick = () => promoverUsuario(user.email);
        tdAcoes.appendChild(btnPromover);
      } else if (user.email !== adminUser.email) { // Se for admin (mas não o admin principal), mostra botão para rebaixar
        const btnRebaixar = document.createElement("button");
        btnRebaixar.textContent = "Remover Admin";
        btnRebaixar.className = "btn-demote";
        btnRebaixar.onclick = () => rebaixarUsuario(user.email);
        tdAcoes.appendChild(btnRebaixar);
      }

      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    listaUsuariosDiv.appendChild(table);
  }

  // Atualiza estatísticas
  const totalUsuariosSpan = document.getElementById("totalUsuarios");
  if (totalUsuariosSpan) {
    totalUsuariosSpan.textContent = usuarios.length;
  }

  // Carrega também os filmes
  carregarFilmesAdmin();
}

// Função executada quando a página carrega
window.onload = function () {
  // Inicializa filmes no localStorage
  inicializarFilmes();

  // Verifica e atualiza a interface de login
  atualizarInterfaceLogin();

  // Se estiver na página inicial, carrega os filmes
  if (window.location.href.includes("index.html") || window.location.pathname === "/") {
    carregarFilmesHome();
  }

  // Atualiza o filme escolhido
  const filme = localStorage.getItem("filme");
  const filmeSpan = document.getElementById("filmeEscolhido");
  if (filmeSpan && filme) filmeSpan.textContent = "Filme escolhido: " + filme;

  // Carrega detalhes do filme na página de sessão
  if (window.location.href.includes("sessao.html")) {
    carregarDetalhesFilmeSessao();
  }

  // Atualiza o resumo na página de confirmação
  const resumo = document.getElementById("resumo");
  if (resumo && filme) {
    const horario = localStorage.getItem("horario");
    const assentos = JSON.parse(localStorage.getItem("assentos") || "[]");
    resumo.textContent = `Filme: ${filme}, Horário: ${horario}, Assentos: ${assentos.join(", ")}`;
  }

  // Atualiza o subtotal na página de confirmação
  const subtotal = localStorage.getItem("subtotal");
  const subtotalConfirm = document.getElementById("subtotalConfirmacao");
  if (subtotalConfirm && subtotal) {
    subtotalConfirm.textContent = subtotal;
  }

  // Atualiza a quantidade ao entrar na página
  const qtdSalva = parseInt(localStorage.getItem("quantidade")) || 1;
  quantidade = qtdSalva;
  alterarQuantidade(0);  // Força a atualização

  // Configura eventos dos botões de horário
  const botoesHorario = document.querySelectorAll(".horarios button");
  botoesHorario.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove a seleção de todos os botões
      botoesHorario.forEach(b => b.classList.remove("selecionado"));
      // Adiciona seleção ao botão clicado
      btn.classList.add("selecionado");
      // Salva o horário no localStorage
      localStorage.setItem("horario", btn.dataset.hora);
    });
  });

  // Configura eventos dos assentos
  const assentos = document.querySelectorAll(".assento");
  assentos.forEach(el => {
    el.addEventListener("click", () => {
      const selecionados = document.querySelectorAll(".assento.selecionado").length;
      if (el.classList.contains("selecionado")) {
        // Remove a seleção se já estiver selecionado
        el.classList.remove("selecionado");
      } else if (selecionados < quantidade) {
        // Adiciona seleção se ainda não atingiu o limite
        el.classList.add("selecionado");
      } else {
        // Avisa sobre o limite de assentos
        alert("Você só pode escolher " + quantidade + " assento(s).");
      }
    });
  });

  // Verifica se está na página de confirmação e se o usuário está logado
  if (window.location.href.includes("confirmacao.html")) {
    const usuario = verificarLogin();
    if (!usuario) {
      alert("Você precisa estar logado para finalizar a compra.");
      localStorage.setItem("paginaAnterior", "confirmacao.html");
      window.location.href = "login.html";
    }
  }

  // Se estiver na página de administração, verifica se é admin
  if (window.location.href.includes("admin.html")) {
    if (!verificarAdmin()) {
      alert("Acesso negado. Você não tem permissão para acessar esta página.");
      window.location.href = "index.html";
      return;
    }
    // Carrega a lista de usuários e filmes na página de administração
    carregarUsuariosAdmin();
  }
};



// Função para carregar detalhes do filme na página de sessão
function carregarDetalhesFilmeSessao() {
  const filmeNome = localStorage.getItem("filme");
  const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");
  const filmeSelecionado = filmes.find(f => f.nome === filmeNome);
  const detalhesFilmeDiv = document.getElementById("detalhesFilmeSessao");

  if (detalhesFilmeDiv && filmeSelecionado) {
    detalhesFilmeDiv.innerHTML = ""; // Limpa o conteúdo existente

    const filmeDiv = document.createElement("div");
    filmeDiv.className = "filme-detalhes-sessao"; // Nova classe para estilização

    const img = document.createElement("img");
    img.src = filmeSelecionado.capa;
    img.alt = filmeSelecionado.nome;
    filmeDiv.appendChild(img);

    const titulo = document.createElement("h3");
    titulo.textContent = filmeSelecionado.nome;
    filmeDiv.appendChild(titulo);

    const descricao = document.createElement("p");
    descricao.textContent = `${filmeSelecionado.descricao} 🎟️ R$${filmeSelecionado.preco},00`;
    filmeDiv.appendChild(descricao);

    detalhesFilmeDiv.appendChild(filmeDiv);
  }
}




// Função para voltar para a página anterior
function goBack() {
  window.history.back();
}
function editarFilme(filme) {
  if (!verificarAdmin()) {
    alert("Apenas administradores podem editar filmes.");
    return;
  }

  // Adiciona a mensagem de confirmação
  if (!confirm(`Tem certeza que deseja editar este filme?`)) {
    return;
  }

  // Preenche o formulário com os dados do filme
  document.getElementById("nomeFilme").value = filme.nome;
  document.getElementById("descricaoFilme").value = filme.descricao;
  document.getElementById("precoFilme").value = filme.preco;
  document.getElementById("capaFilme").value = filme.capa;

  // Remove o filme antigo (isso acontecerá quando o admin submeter o formulário)
  // Não removemos imediatamente para permitir que o admin cancele a edição

  // Rola até o formulário para facilitar a edição
  document.getElementById("formAdicionarFilme").scrollIntoView();
}

function adicionarFilme(event) {
  event.preventDefault();
  
  // Verifica se é admin
  if (!verificarAdmin()) {
    alert("Apenas administradores podem adicionar filmes.");
    return;
  }
  
  // Obtém os dados do formulário
  const nome = document.getElementById("nomeFilme").value;
  const descricao = document.getElementById("descricaoFilme").value;
  const preco = parseInt(document.getElementById("precoFilme").value);
  const capa = document.getElementById("capaFilme").value;
  
  // Busca filmes cadastrados
  const filmes = JSON.parse(localStorage.getItem("filmes") || "[]");
  
  // Verifica se é uma edição (procura pelo nome no array)
  const filmeExistenteIndex = filmes.findIndex(f => f.nome === nome);
  
  if (filmeExistenteIndex !== -1) {
    // Se encontrou, remove o filme antigo
    filmes.splice(filmeExistenteIndex, 1);
  }
  
  // Gera um ID único para o novo filme
  const id = filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1;
  
  // Adiciona o novo filme
  const novoFilme = { id, nome, descricao, preco, capa };
  filmes.push(novoFilme);
  localStorage.setItem("filmes", JSON.stringify(filmes));
  
  // Limpa o formulário
  document.getElementById("formAdicionarFilme").reset();
  
  // Atualiza a lista de filmes
  carregarFilmesAdmin();
  
  // Mostra mensagem de sucesso
  alert(`Filme "${nome}" ${filmeExistenteIndex !== -1 ? 'editado' : 'adicionado'} com sucesso!`);
}