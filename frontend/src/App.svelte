<script lang="ts">
  import { io, type Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import GhostReplay from "./components/GhostReplay.svelte";

  let socket: Socket;

  let sessions: Coordinates[][] = $state([]);

  let mouseCoordinates: Coordinates = $state([0, 0]);
  let session: Coordinates[] = $state([]);

  function mouseMoved(event: MouseEvent) {
    mouseCoordinates = [event.x, event.y];
  }

  function logInterval() {
    session.push(mouseCoordinates);
  }

  function socketInterval() {
    socket.emit("data", session);
    session = [];
  }

  onMount(() => {
    socket = io("http://localhost:3000");

    socket.on("sessions", (newSessions) => {
      sessions = newSessions;
    });

    document.addEventListener("mousemove", mouseMoved);
    setInterval(logInterval, 50);
    setInterval(socketInterval, 500);
  });
</script>

{#each sessions as session}
  <GhostReplay {session} />
{/each}
