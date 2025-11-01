import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { drizzle } from "drizzle-orm/libsql";
import { replaysTable } from "./db/schema.js";

const db = drizzle(process.env.DB_FILE_NAME!);

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  (async () => {
    const replays = await db.select().from(replaysTable);
    socket.emit(
      "sessions",
      replays.map((replay) => JSON.parse(replay.session))
    );
  })();

  let session: Session = [];
  let name: string = "Ghost";

  socket.on("data", (data: Session) => {
    session = [...session, ...data];
  });
  socket.on("updateName", (newName: string) => {
    newName = newName.trim();
    name = newName != "" ? newName : "Ghost";
  });

  socket.on("disconnect", async () => {
    console.log(`Client disconnected: ${socket.id}`);
    await db.insert(replaysTable).values({
      name,
      session: JSON.stringify(session),
    });
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
