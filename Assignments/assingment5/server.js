import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const folder = path.dirname(fileURLToPath(import.meta.url));

createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const file = url.pathname === "/"
    ? path.join(folder, "public", "index.html")
    : url.pathname.startsWith("/files/")
      ? path.join(folder, "files", path.basename(url.pathname))
      : null;

  if (!file) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  try {
    const contents = await readFile(file);
    if (url.pathname.startsWith("/files/")) {
      response.setHeader("Content-Disposition", `attachment; filename="${path.basename(file)}"`);
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
    } else {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
    }
    response.end(contents);
  } catch {
    response.writeHead(404);
    response.end("File not found");
  }
}).listen(5000, "127.0.0.1", () => {
  console.log("Server running. Open http://127.0.0.1:5000");
}).on("error", (error) => {
  console.error(`Could not start server: ${error.message}`);
});
