import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ================================
// CONFIGURAÇÃO DE PATHS
// ================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rota padrão para o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// ================================
// ROTA: CLIMA ATUAL
// ================================
app.get("/api/weather", async (req, res) => {
  const { q, lat, lon } = req.query;

  try {
    let url;

    if (q) {
      url = `${BASE_URL}/weather?q=${q}&appid=${API_KEY}&units=metric&lang=pt_br`;
    } else if (lat && lon) {
      url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
    } else {
      return res.status(400).json({ error: "Parâmetros inválidos" });
    }

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar clima" });
  }
});

// ================================
// ROTA: PREVISÃO 5 DIAS
// ================================
app.get("/api/forecast", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar previsão" });
  }
});

// ================================
// INICIAR SERVIDOR
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
