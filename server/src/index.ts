import express from "express";
import { JSONFilePreset } from "lowdb/node";
import { createServer } from "node:http";
import { Server } from "socket.io";

const db = await JSONFilePreset<{ sessions: Record<string, Coordinates[]> }>(
  "db.json",
  { sessions: {} }
);

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

setInterval(() => {
  console.log(
    `Writing sessions to DB (${
      Object.values(db.data.sessions).length
    } sessions stored)`
  );
  db.write();
}, 60_000);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.emit("sessions", Object.values(db.data.sessions));

  socket.on("data", (data: Coordinates[]) => {
    db.data.sessions[socket.id] = [
      ...(db.data.sessions[socket.id] ?? []),
      ...data,
    ];
  });

  socket.on("disconnect", () =>
    console.log(`Client disconnected: ${socket.id}`)
  );
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
