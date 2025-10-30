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
