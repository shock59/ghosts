import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

let sessions: Record<string, Coordinates[]> = {};

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);
  socket.emit("sessions", Object.values(sessions));

  socket.on("data", (data: Coordinates[]) => {
    sessions[socket.id] = [...(sessions[socket.id] ?? []), ...data];
  });

  socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
