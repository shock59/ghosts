<script lang="ts">
  import { onMount } from "svelte";

  let mouseCoordinates: [number, number] = $state([0, 0]);
  let session: [number, number][] = $state([]);
  let interval: number | undefined = $state();
  let mode: "recording" | "replay" = $state("recording");
  let replayIndex = $state(0);

  function mouseMoved(event: MouseEvent) {
    mouseCoordinates = [event.x, event.y];
  }

  function logInterval() {
    if (mode == "recording") {
      session.push(mouseCoordinates);
    } else {
      mouseCoordinates = session[replayIndex];
      replayIndex++;
    }
  }

  function stopRecording() {
    mode = "replay";
    document.removeEventListener("mousemove", mouseMoved);
  }

  onMount(() => {
    document.addEventListener("mousemove", mouseMoved);
    interval = setInterval(logInterval, 50);
  });
</script>

<p>{mouseCoordinates}</p>
<button onclick={stopRecording}>Stop recording</button>

<div class="cursor" style="left: {mouseCoordinates[0]}px; top: {mouseCoordinates[1]}px;"></div>

<style>
  .cursor {
    position: absolute;
    width: 20px;
    height: 20px;
    background: red;
    pointer-events: none;
  }
</style>
