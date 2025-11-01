<script lang="ts">
  let { addCommand }: { addCommand: (arg: unknown) => void } = $props();
  let value: number = $state(0);

  export function executeCommand(amount: number) {
    value += amount;
  }

  function changeValue(amount: number) {
    value += amount;
    addCommand(amount);
  }
</script>

<div class="counter">
  <button onclick={() => changeValue(-10)}>-10</button>
  <button onclick={() => changeValue(-5)}>-5</button>
  <button onclick={() => changeValue(-1)}>-1</button>
  <div class="counter-value">{value}</div>
  <button onclick={() => changeValue(1)}>+1</button>
  <button onclick={() => changeValue(5)}>+5</button>
  <button onclick={() => changeValue(10)}>+10</button>
</div>

<style>
  .counter {
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 22px;
  }

  button {
    margin: 0 8px;
    padding: 6px 16px;
    color: inherit;
    background: #313244;
    border: 1px #45475a solid;
    border-radius: 8px;
    outline: none;
    font: inherit;
    transition: 180ms;
  }

  button:hover {
    background: #45475a;
    border-color: #585b70;
  }

  .counter-value {
    min-width: 180px;
    margin: 0 8px;
    font-size: 32px;
    font-variant-numeric: tabular-nums;
  }
</style>
