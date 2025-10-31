<script lang="ts">
  import { onMount } from "svelte";
  import colors from "../lib/colors";

  const extendedColors = ["#313244", ...colors];

  const width = 8;
  const height = 8;

  let drawing: number[][] = $state(
    new Array(height).fill(new Array(width).fill(0))
  );

  function changeCellColor(rowIndex: number, columnIndex: number) {
    drawing[rowIndex][columnIndex]++;
    if (drawing[rowIndex][columnIndex] >= extendedColors.length)
      drawing[rowIndex][columnIndex] = 0;
  }

  onMount(() => {
    console.log(drawing);
  });
</script>

<div class="canvas">
  {#each drawing as row, rowIndex}
    <div class="row">
      {#each row as cell, columnIndex}
        <button
          class="cell"
          style="background: {extendedColors[cell]}"
          aria-label="cell"
          onclick={() => changeCellColor(rowIndex, columnIndex)}
        ></button>
      {/each}
    </div>
  {/each}
</div>

<style>
  .canvas {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .row {
    width: fit-content;
    display: flex;
    flex-direction: row;
  }

  .cell {
    width: 80px;
    height: 80px;
    border: 1px #45475a solid;
    border-right: none;
    border-bottom: none;
    outline: none;
    transition: 180ms;
    cursor: pointer;
  }

  .cell:last-child {
    border-right: 1px #45475a solid;
  }
  .row:last-child .cell {
    border-bottom: 1px #45475a solid;
  }

  .row:first-child .cell:first-child {
    border-top-left-radius: 8px;
  }
  .row:first-child .cell:last-child {
    border-top-right-radius: 8px;
  }
  .row:last-child .cell:first-child {
    border-bottom-left-radius: 8px;
  }
  .row:last-child .cell:last-child {
    border-bottom-right-radius: 8px;
  }

  .cell:hover {
    border-color: #585b70;
  }
</style>
