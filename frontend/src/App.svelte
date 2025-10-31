<script lang="ts">
  import { io, type Socket } from "socket.io-client";
  import { onMount } from "svelte";

  let socket: Socket;

  let mouseCoordinates: Coordinates = $state([0, 0]);
  let previousMouseCoordinates: Coordinates = $state([0, 0]);
  let displayCoordinates: Coordinates = $state([0, 0]);

  let sessions: Coordinates[][] = $state([]);

  let session: Coordinates[] = $state([]);
  let replayIndex = $state(0);

  let previousTime: number = $state(0);
  let delta: number = $state(0);

  function mouseMoved(event: MouseEvent) {
    mouseCoordinates = [event.x, event.y];
    previousMouseCoordinates = mouseCoordinates;
    displayCoordinates = mouseCoordinates;
  }

  function logInterval() {
    session.push(mouseCoordinates);
    // previousMouseCoordinates = [...mouseCoordinates];
    // displayCoordinates = [...mouseCoordinates];
    // mouseCoordinates = session[replayIndex];
    replayIndex++;
  }

  function socketInterval() {
    socket.emit("data", session);
    session = [];
  }

  // function frame() {
  //   const now = Date.now();
  //   delta = now - previousTime;
  //   previousTime = now;

  //   for (let index in displayCoordinates) {
  //     displayCoordinates[index] +=
  //       ((mouseCoordinates[index] - previousMouseCoordinates[index]) / 50) *
  //       delta;
  //   }
  //   requestAnimationFrame(frame);
  // }

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

<p>{replayIndex}</p>

{#if session.length}
  <div
    class="cursor"
    style="left: {session[session.length - 1][0]}px; top: {session[
      session.length - 1
    ][1]}px;"
  ></div>
{/if}

{#each sessions as session}
  {#if session[replayIndex]}
    <div
      class="cursor"
      style="left: {session[replayIndex][0]}px; top: {session[
        replayIndex
      ][1]}px;"
    ></div>
  {/if}
{/each}

<style>
  .cursor {
    position: absolute;
    width: 20px;
    height: 20px;
    background: red;
    pointer-events: none;
  }
</style>
