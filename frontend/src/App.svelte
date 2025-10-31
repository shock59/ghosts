<script lang="ts">
  import { io, type Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import GhostReplay from "./components/GhostReplay.svelte";

  let socket: Socket;

  let sessions: Coordinates[][] = $state([]);

  let mouseCoordinates: Coordinates = $state([0, 0]);
  let session: Coordinates[] = $state([]);

  let content: HTMLElement;
  let contentCoordinates: Coordinates = $state([0, 0]);

  function updateContentCoordinates() {
    const rect = content.getBoundingClientRect();
    contentCoordinates = [rect.x, rect.y];
  }

  function mouseMoved(event: MouseEvent) {
    mouseCoordinates = [
      event.x - contentCoordinates[0],
      event.y - contentCoordinates[1],
    ];
  }

  function logInterval() {
    session.push(mouseCoordinates);
  }

  function socketInterval() {
    socket.emit("data", session);
    session = [];
  }

  onMount(() => {
    updateContentCoordinates();
    window.addEventListener("resize", updateContentCoordinates);

    socket = io("http://localhost:3000");
    socket.on("sessions", (newSessions) => {
      sessions = newSessions;
    });

    document.addEventListener("mousemove", mouseMoved);
    setInterval(logInterval, 50);
    setInterval(socketInterval, 500);
  });
</script>

<p id="status">
  {contentCoordinates}
</p>

{#each sessions as session}
  <GhostReplay {session} {contentCoordinates} />
{/each}

<main>
  <div id="content" bind:this={content}>Content</div>
</main>

<style>
  main {
    width: 100vw;
    min-width: 800px;
    height: 100vh;
    display: flex;
    justify-content: center;
    background: #181825;
  }

  #content {
    width: 800px;
    padding: 16px;
    color: #cdd6f4;
    background: #1e1e2e;
    font-family: "Inter";
    font-weight: bold;
    text-align: center;
  }

  #status {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
