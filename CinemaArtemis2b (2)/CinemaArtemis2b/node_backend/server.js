const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Servir arquivos estáticos do diretório raiz do projeto (onde estão html, css, js, img)
app.use(express.static(path.join(__dirname, "..", "html")));
app.use(express.static(path.join(__dirname, "..", "css")));
app.use(express.static(path.join(__dirname, "..", "js")));
app.use(express.static(path.join(__dirname, "..", "img")));

// Rota para a página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "html", "index.html"));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


