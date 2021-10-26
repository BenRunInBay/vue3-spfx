<script lang="ts">
import { defineComponent, ComponentPublicInstance } from "vue";

import { sp } from "@pnp/sp/presets/core";
import * as SharePointTools from "./lib/SharePointTools";
import * as WebpartProperties from "./lib/WebpartProperties";
import DocumentItem from "./components/DocumentItem.vue";

interface ICompData {
  heading: string;
  description: string;
  listName: string;
  items: any[];
}

export default defineComponent({
  name: "App",
  components: { DocumentItem },
  data() {
    return {
      heading: "",
      description: "",
      listName: "Shared Documents",
      items: []
    } as ICompData;
  },
  created() {
    SharePointTools.configureSharePoint();
  },
  mounted() {
    this.setPropertiesFromWebpart();
    this.loadItemsFromSharePoint();
  },
  methods: {
    setPropertiesFromWebpart() {
      this.heading = WebpartProperties.getPropertyValue(
        this.$root as ComponentPublicInstance,
        "heading"
      );
      this.description = WebpartProperties.getPropertyValue(
        this.$root as ComponentPublicInstance,
        "description"
      );
      this.listName = WebpartProperties.getPropertyValue(
        this.$root as ComponentPublicInstance,
        "list-name"
      );
    },
    async loadItemsFromSharePoint() {
      this.items = await sp.web.lists.getByTitle(this.listName).items.get();
    }
  }
});
</script>

<template>
  <h2>{{ heading }}</h2>
  <div v-html="description"></div>
  <ul>
    <DocumentItem v-for="(item, i) in items" :key="i" :item="item" />
  </ul>
</template>

<style>
#vue3vitewebpartapp {
  font-family: Arial, sans-serif;
  color: #2c3e50;
  background-color: white;
  padding: 1em;
}
</style>
