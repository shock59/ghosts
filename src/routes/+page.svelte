<script lang="ts">
  import { onMount } from "svelte";

  let mouseCoordinates: [number, number] = $state([0, 0]);

  function mouseMoved(event: MouseEvent) {
    mouseCoordinates = [event.x, event.y];
  }

  onMount(() => {
    document.addEventListener("mousemove", mouseMoved);
  });
</script>

<p>{mouseCoordinates}</p>

<div class="cursor" style="left: {mouseCoordinates[0]}px; top: {mouseCoordinates[1]}px;"></div>

<style>
  .cursor {
    position: absolute;
    width: 20px;
    height: 20px;
    background: red;
  }
</style>
