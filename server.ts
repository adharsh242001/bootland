import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // In-memory store for finalized designs (Hall of Fame)
  const designs: any[] = [];

  app.use(express.json({ limit: '10mb' }));

  // API to finalize a design
  app.post("/api/finalize", (req, res) => {
    const design = {
      id: Math.random().toString(36).substring(7),
      ...req.body,
      timestamp: Date.now(),
    };
    designs.unshift(design);
    if (designs.length > 50) designs.pop(); // Keep last 50

    // Broadcast to projection screens
    io.emit("new-design", design);
    res.json(design);
  });

  // API to get a specific design for the share page
  app.get("/api/design/:id", (req, res) => {
    const design = designs.find(d => d.id === req.params.id);
    if (design) {
      res.json(design);
    } else {
      res.status(404).json({ error: "Design not found" });
    }
  });

  // API to get all designs for the gallery
  app.get("/api/designs", (req, res) => {
    res.json(designs);
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    // Send current designs to new projection client
    socket.emit("init-designs", designs);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
