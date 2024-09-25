<script setup lang="ts">
const props = defineProps<{ clickedColumns: string[] }>();
</script>

<template>
  <div
    v-if="props.clickedColumns.length > 0"
    class="mt-4 border bg-white p-4 shadow"
  >
    <h3 class="mb-2 text-lg font-bold">Selected Columns</h3>
    <ul>
      <li
        v-for="(column, index) in props.clickedColumns"
        :key="index"
        class="mb-2"
      >
        {{ column }}
      </li>
    </ul>
  </div>
</template>
