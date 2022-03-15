<script lang="ts">
/**
 * This is a sample of a Vue 3 component rendered inside of the webpart
 */
import { defineComponent, PropType } from "vue";

export interface IDocument {
  Id: number;
  Title: string;
}

export default defineComponent({
  props: {
    item: { type: Object as PropType<IDocument>, required: true }
  }
});
</script>

<template>
  <li>{{ item.Id }}: {{ item.Title }}</li>
</template>

<style scoped>
li {
    padding: 1em;
    border: 1px solid #aaa;
}
</style>
