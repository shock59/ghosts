<script lang="ts">
  import { io, type Socket } from "socket.io-client";
  import { onMount } from "svelte";
  import GhostReplay from "./components/GhostReplay.svelte";
  import Counter from "./components/Counter.svelte";
  import Canvas from "./components/Canvas.svelte";
  import Slider from "./components/Slider.svelte";
  import colors from "./lib/colors";

  let socket: Socket;

  let sessions: Session[] = $state([]);

  let mouseCoordinates: Coordinates = $state([0, 0]);
  let session: Session = $state([]);
  let delay: number = $state(0);

  let content: HTMLElement;
  let contentCoordinates: Coordinates = $state([0, 0]);

  let counter: Counter;
  let canvas: Canvas;
  let slider0: Slider;
  let slider1: Slider;
  let slider2: Slider;

  function updateContentCoordinates() {
    const rect = content.getBoundingClientRect();
    contentCoordinates = [rect.x, rect.y];
  }

  function mouseMoved(event: MouseEvent) {
    mouseCoordinates = [
      event.pageX - contentCoordinates[0],
      event.pageY - contentCoordinates[1],
    ];
  }

  function logInterval() {
    const newLog = [0, mouseCoordinates];
    if (session.length > 0 && newLog[1] == session[session.length - 1][1]) {
      delay += 50;
    } else {
      if (delay > 0) {
        session.push([2, delay]);
        delay = 0;
      }
      session.push([0, mouseCoordinates]);
    }
  }

  function socketInterval() {
    if (delay > 0) return;
    socket.emit("data", session);
    session = [];
  }

  function addCommand(command: Command) {
    session.push([1, command]);
  }

  function executeCommand(command: Command) {
    switch (command[0]) {
      case "counter":
        counter.executeCommand(command[1] as number);
        break;
      case "canvas":
        canvas.executeCommand(command[1] as [number, number, number]);
        break;
      case "slider0":
        slider0.executeCommand(command[1] as number);
        break;
      case "slider1":
        slider1.executeCommand(command[1] as number);
        break;
      case "slider2":
        slider2.executeCommand(command[1] as number);
        break;
    }
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
  <GhostReplay {session} {contentCoordinates} {executeCommand} />
{/each}

<main>
  <div id="content" bind:this={content}>
    Hello! All of the ghosts you can see moving around this site are the replays
    of what other people were doing here before you arrived.

    <br />
    <br />

    Try interacting with some of the elements here for a while, and your ghost
    will be added to the site for the next person who visits to see!

    <div class="container">
      <Counter
        addCommand={(arg) => addCommand(["counter", arg])}
        bind:this={counter}
      />
    </div>

    <div class="container">
      <Canvas
        addCommand={(arg) => addCommand(["canvas", arg])}
        bind:this={canvas}
      />
    </div>

    <div class="container">
      <Slider
        color={colors[2]}
        addCommand={(arg) => addCommand(["slider0", arg])}
        bind:this={slider0}
      />
    </div>
    <div class="container">
      <Slider
        color={colors[6]}
        addCommand={(arg) => addCommand(["slider1", arg])}
        bind:this={slider1}
      />
    </div>
    <div class="container">
      <Slider
        color={colors[9]}
        addCommand={(arg) => addCommand(["slider2", arg])}
        bind:this={slider2}
      />
    </div>
  </div>
</main>

<style>
  main {
    width: 100vw;
    min-width: 800px;
    min-height: 100vh;
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

  .container {
    width: fit-content;
    margin: 16px auto;
    display: flex;
  }
</style>
