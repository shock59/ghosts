<script lang="ts">
  import { io, type Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import GhostReplay from "./components/GhostReplay.svelte";
  import Counter from "./components/Counter.svelte";
  import Canvas from "./components/Canvas.svelte";

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

{#each sessions as session}
  <GhostReplay {session} {contentCoordinates} />
{/each}

<main>
  <div id="content" bind:this={content}>
    Hello! All of the ghosts you can see moving around this site are the replays
    of what other people were doing here before you arrived.

    <br />
    <br />

    Try interacting with some of the elements here for a while, and your ghost
    will be added to the site for the next person who visits to see!

    <Counter />

    <Canvas />
  </div>
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
    padding: 16px 32px;
    color: #cdd6f4;
    background: #1e1e2e;
    font-family: "Inter";
    font-size: 18px;
    text-align: center;
  }
</style>
