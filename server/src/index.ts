import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { drizzle } from "drizzle-orm/libsql";
import { replaysTable, sessionEntriesTable } from "./db/schema.js";
import { eq } from "drizzle-orm";

const badWords: string[] = JSON.parse(process.env.BAD_WORDS!);

const db = drizzle(process.env.DB_FILE_NAME!);

const app = express();

app.use(express.static("public"));

const server = createServer(app);
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL! } });

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  (async () => {
    const replays = await db.select().from(replaysTable);
    for (const replay of replays) {
      const sessionEntries = await db
        .select()
        .from(sessionEntriesTable)
        .where(eq(sessionEntriesTable.id, replay.id));
      const session = sessionEntries
        .toSorted((a, b) => a.index - b.index)
        .map((entry) => JSON.parse(entry.value));
      socket.emit("newReplay", {
        name: replay.name,
        session,
      });
    }
  })();

  let session: Session = [];
  let name: string = "Ghost";

  socket.on("data", (data: Session) => {
    session = [...session, ...data];
  });
  socket.on("updateName", (newName: string) => {
    newName = newName.trim();
    for (const word of badWords) {
      if (newName.includes(word)) {
        socket.emit(
          "updateNameResponse",
          "Your new name was blocked by the bad word filter"
        );
        return;
      }
    }
    name = newName != "" ? newName : "Ghost";
    socket.emit("updateNameResponse", `Updated name to ${newName}`);
  });

  socket.on("disconnect", async () => {
    console.log(`Client disconnected: ${socket.id}`);

    const insertion = await db.insert(replaysTable).values({
      name,
    });
    const id = insertion.lastInsertRowid;

    for (const index in session) {
      await db.insert(sessionEntriesTable).values({
        id: Number(id),
        index: Number(index),
        value: JSON.stringify(session[index]),
      });
    }
  });
});

server.listen(Number(process.env.PORT!), () => {
  console.log("server running at http://localhost:3000");
});
