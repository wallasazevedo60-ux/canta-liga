import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // caminho REAL gerado pelo build
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Did you run npm run build?`,
    );
  }

  app.use(express.static(distPath));

  // fallback para SPA
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}


