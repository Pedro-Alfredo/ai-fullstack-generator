import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { createRepoWithFiles } from "./github.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { idea, repoName } = req.body;

  const prompt = `
Você é um desenvolvedor full-stack. Gere um app completo baseado nesta ideia: "${idea}".
Inclua:
- Frontend React
- Backend Node.js/Express
- Banco de dados SQLite
- README
Separe os arquivos claramente.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você gera repositórios full-stack completos." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  const code = data.choices[0].message.content;

  // Criar repositório no GitHub
  const result = await createRepoWithFiles(repoName, code);

  res.json({ message: "App gerado e salvo no GitHub!", githubUrl: result });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
