<script setup lang="ts">
import { defineEmits } from "vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue"]);

const handleTimeframeChange = (value: string) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="absolute right-4 top-11 z-10 p-4">
    <Select
      v-model="props.modelValue"
      @update:model-value="handleTimeframeChange"
    >
      <SelectTrigger>
        <SelectValue :placeholder="`Last ${props.modelValue} Days`" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="60">Last 60 Days</SelectItem>
        <SelectItem value="30">Last 30 Days</SelectItem>
        <SelectItem value="14">Last 14 Days</SelectItem>
        <SelectItem value="7">Last 7 Days</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
