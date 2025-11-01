<script lang="ts">
  import { onMount } from "svelte";

  const { color }: { color: string } = $props();

  let sliderElement: HTMLDivElement;

  let mouseDown: boolean = $state(false);
  let sliderPosition: number = $state(10);

  function onMouseDown() {
    mouseDown = true;
  }

  function onMouseUp() {
    mouseDown = false;
  }

  function onMouseMove(event: MouseEvent) {
    if (!mouseDown) return;
    const rect = sliderElement.getBoundingClientRect();
    sliderPosition = event.x - rect.x;
    if (sliderPosition < 10) sliderPosition = 10;
    else if (sliderPosition > 630) sliderPosition = 630;
  }

  onMount(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  });
</script>

<div
  class="slider"
  bind:this={sliderElement}
  style="background: linear-gradient(to right, {color}, {color} {sliderPosition}px, #313244 {sliderPosition}px)"
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="handle"
    onmousedown={onMouseDown}
    style="margin-left: {sliderPosition - 10}px"
  ></div>
</div>

<style>
  .slider {
    width: 640px;
    height: 20px;
    margin: 10px auto;
    display: flex;
    border: 1px #45475a solid;
    border-radius: 8px;
    cursor: pointer;
  }

  .handle {
    width: 20px;
    height: 40px;
    margin-top: -10px;
    background: #45475a;
    border: 1px #585b70 solid;
    border-radius: 8px;
    cursor: pointer;
  }

  .handle:hover {
    background: #585b70;
    border-color: #6c7086;
  }
</style>
