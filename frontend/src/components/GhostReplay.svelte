<script lang="ts">
  import { onMount } from "svelte";

  let { session }: { session: Coordinates[] } = $props();

  let element: HTMLElement;

  let sessionIndex: number = $state(0);

  let targetCoordinates: Coordinates = $state([0, 0]);
  let previousCoordinates: Coordinates = $state([0, 0]);
  let displayCoordinates: Coordinates = $state([0, 0]);

  let intervalId: number;

  let previousTime: number = $state(0);
  let delta: number = $state(0);

  function interval() {
    sessionIndex++;
    if (sessionIndex == session.length) {
      clearInterval(intervalId);
      element.style.opacity = "0";
      return;
    }
    targetCoordinates = session[sessionIndex];
    previousCoordinates = session[sessionIndex - 1];
    displayCoordinates = [...previousCoordinates];
  }

  function frame() {
    if (sessionIndex == session.length) return;

    const now = Date.now();
    delta = now - previousTime;
    previousTime = now;

    for (let index in displayCoordinates) {
      displayCoordinates[index] +=
        ((targetCoordinates[index] - previousCoordinates[index]) / 50) * delta;
    }

    requestAnimationFrame(frame);
  }

  onMount(() => {
    intervalId = setInterval(interval, 50);
    frame();
  });
</script>

<div
  class="cursor"
  style="left: {displayCoordinates[0]}px; top: {displayCoordinates[1]}px;"
  bind:this={element}
></div>

<style>
  .cursor {
    position: absolute;
    width: 20px;
    height: 20px;
    background: red;
    pointer-events: none;
    transition: 3s opacity;
    opacity: 1;
  }
</style>
