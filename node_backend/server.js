const express = require("express");
const path = require("path");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { parse } = require('csv-parse');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Para parsear o corpo das requisições JSON

// Servir arquivos estáticos do diretório raiz do projeto (onde estão html, css, js, img)
app.use(express.static(path.join(__dirname, "..", "html")));
app.use(express.static(path.join(__dirname, "..", "css")));
app.use(express.static(path.join(__dirname, "..", "js")));
app.use(express.static(path.join(__dirname, "..", "img")));

// Rota para a página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "html", "index.html"));
});

// Rota para salvar filmes em CSV
app.post("/save-movies", async (req, res) => {
  const movies = req.body;
  const csvFilePath = path.join(__dirname, "movies.csv");

  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
      { id: "id", title: "ID" },
      { id: "nome", title: "Nome" },
      { id: "descricao", title: "Descricao" },
      { id: "preco", title: "Preco" },
      { id: "capa", title: "Capa" },
    ],
    append: false, // Sobrescreve o arquivo a cada salvamento
  });

  try {
    await csvWriter.writeRecords(movies);
    res.status(200).send("Filmes salvos com sucesso no CSV!");
  } catch (error) {
    console.error("Erro ao salvar filmes no CSV:", error);
    res.status(500).send("Erro ao salvar filmes no CSV.");
  }
});

// Rota para obter filmes
app.get("/get-movies", async (req, res) => {
  const csvFilePath = path.join(__dirname, "movies.csv");

  if (!fs.existsSync(csvFilePath)) {
    // Se o arquivo não existe, retorna os filmes iniciais e cria o CSV
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
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
        { id: "id", title: "ID" },
        { id: "nome", title: "Nome" },
        { id: "descricao", title: "Descricao" },
        { id: "preco", title: "Preco" },
        { id: "capa", title: "Capa" },
      ],
      append: false,
    });
    try {
      await csvWriter.writeRecords(filmesIniciais);
      res.status(200).json(filmesIniciais);
    } catch (error) {
      console.error("Erro ao criar CSV inicial:", error);
      res.status(500).send("Erro ao carregar filmes.");
    }
    return;
  }

  // Se o arquivo existe, lê e retorna os filmes
  fs.readFile(csvFilePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo CSV:", err);
      res.status(500).send("Erro ao carregar filmes.");
      return;
    }
    parse(data, { columns: true, skip_empty_lines: true }, (err, records) => {
      if (err) {
        console.error("Erro ao parsear o CSV:", err);
        res.status(500).send("Erro ao carregar filmes.");
        return;
      }
      // Converte preco para número
      const filmes = records.map(record => ({
        ...record,
        id: parseInt(record.ID),
        preco: parseInt(record.Preco),
        nome: record.Nome,
        descricao: record.Descricao,
        capa: record.Capa
      }));
      res.status(200).json(filmes);
    });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


