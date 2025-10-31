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
  style="left: {displayCoordinates[0] - 16}px; top: {displayCoordinates[1] -
    16}px;"
  bind:this={element}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    ><path
      fill="purple"
      d="M12 1a9.01 9.01 0 0 0-9 9v12a1 1 0 0 0 1.8.6l2.029-2.7 1.276 2.552a1 1 0 0 0 1.7.153L12 19.667l2.2 2.933a1 1 0 0 0 1.7-.153l1.271-2.547 2.029 2.7a1 1 0 0 0 .8.4 1 1 0 0 0 1-1V10a9.01 9.01 0 0 0-9-9zm7 18-1.2-1.6a.991.991 0 0 0-.89-.4 1 1 0 0 0-.8.549l-1.276 2.552L12.8 17.4a1 1 0 0 0-1.6 0l-2.029 2.705L7.9 17.553A1 1 0 0 0 7.09 17a.989.989 0 0 0-.89.4L5 19v-9a7 7 0 0 1 14 0zm-9-9v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 2 0zm6 0v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 2 0z"
    /></svg
  >
</div>

<style>
  .cursor {
    position: absolute;
    width: 32px;
    height: 32px;
    pointer-events: none;
    transition: 3s opacity;
    opacity: 1;
  }
</style>
