<script lang="ts">
  import { onMount } from "svelte";

  let mouseCoordinates: Coordinates = $state([0, 0]);
  let previousMouseCoordinates: Coordinates = $state([0, 0]);
  let displayCoordinates: Coordinates = $state([0, 0]);

  let session: Coordinates[] = $state([]);
  let mode: "recording" | "replay" = $state("recording");
  let replayIndex = $state(0);

  let previousTime: number = $state(0);
  let delta: number = $state(0);

  function mouseMoved(event: MouseEvent) {
    mouseCoordinates = [event.x, event.y];
    previousMouseCoordinates = mouseCoordinates;
    displayCoordinates = mouseCoordinates;
  }

  function logInterval() {
    if (mode == "recording") {
      session.push(mouseCoordinates);
    } else {
      previousMouseCoordinates = [...mouseCoordinates];
      displayCoordinates = [...mouseCoordinates];
      mouseCoordinates = session[replayIndex];
      if (replayIndex != session.length - 1) replayIndex++;
    }
  }

  function frame() {
    const now = Date.now();
    delta = now - previousTime;
    previousTime = now;

    for (let index in displayCoordinates) {
      displayCoordinates[index] +=
        ((mouseCoordinates[index] - previousMouseCoordinates[index]) / 50) *
        delta;
    }
    requestAnimationFrame(frame);
  }

  function stopRecording() {
    mode = "replay";
    document.removeEventListener("mousemove", mouseMoved);
    requestAnimationFrame(frame);
  }

  onMount(() => {
    document.addEventListener("mousemove", mouseMoved);
    setInterval(logInterval, 50);
  });
</script>

<p>{replayIndex}</p>
<button onclick={stopRecording}>Stop recording</button>

<div
  class="cursor"
  style="left: {displayCoordinates[0]}px; top: {displayCoordinates[1]}px;"
></div>

<style>
  .cursor {
    position: absolute;
    width: 20px;
    height: 20px;
    background: red;
    pointer-events: none;
  }
</style>
