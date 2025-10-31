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
  <GhostReplay {session} />
{/each}

<main>
  <div id="content" bind:this={content}>Content</div>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #content {
    width: 240px;
    padding: 16px;
    color: white;
    background: blue;
    font-weight: bold;
    text-align: center;
  }

  #status {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
