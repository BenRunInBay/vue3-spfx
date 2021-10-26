<script lang="ts">
import { defineComponent, PropType } from "vue";

export interface IDocument {
  Title: string;
}

export default defineComponent({
  props: {
    item: { type: Object as PropType<IDocument>, required: true }
  }
});
</script>

<template>
  <li>{{ item.Title }}</li>
</template>

<style scoped>
li {
    padding: 1em;
    border: 1px solid #aaa;
}
</style>
