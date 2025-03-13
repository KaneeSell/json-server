import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({ logger: false }); // Desativa o log padrão do JSON Server

// Definir cores para cada método HTTP
const methodColors = {
  GET: chalk.blue,
  POST: chalk.green,
  PUT: chalk.yellow,
  PATCH: chalk.cyan,
  DELETE: chalk.red,
  OPTIONS: chalk.magenta,
  HEAD: chalk.gray,
};

// Definir mensagens para cada código de status
const statusMessages = {
  200: "OK",
  201: "Created",
  204: "No Content",
  304: "Not Modified",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

// Middleware para log detalhado
server.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.originalUrl;
  const methodColor = methodColors[method] || chalk.white;

  const start = process.hrtime(); // Inicia a contagem do tempo

  res.on("finish", () => {
    const statusCode = res.statusCode;
    const statusMsg = statusMessages[statusCode] || "Unknown Status";

    // Calcular tempo de resposta
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3); // Converte para ms

    // Definir cor do status
    const statusColor =
      statusCode === 304 ? chalk.gray :
      statusCode >= 200 && statusCode < 300 ? chalk.green :
      statusCode >= 400 && statusCode < 500 ? chalk.yellow :
      statusCode >= 500 ? chalk.red :
      chalk.white;

    console.log(
      `[${chalk.cyan(new Date().toISOString())}] ` +
      `[${methodColor(method)}] ` +
      `${chalk.magenta(url)} ` +
      `- ${statusColor(statusMsg)} ` +
      `(${chalk.whiteBright(ip)}) ` +
      `⏱ ${chalk.bold(responseTime)} ms`
    );
  });

  next();
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 25565;
server.listen(PORT, "0.0.0.0", () => {
  console.log(chalk.bold.green(`🔥 JSON Server rodando em http://localhost:${PORT}`));
});
