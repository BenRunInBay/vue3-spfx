<script lang="ts">
/**
 * The App is the top-level Vue component inside of the webpart
 * Only put code and UI in the App that you want to appear in the webpart
 */
import { defineComponent, ComponentPublicInstance } from "vue";

import { sp } from "@pnp/sp/presets/core";
import * as SharePointTools from "./lib/SharePointTools";
import * as WebpartProperties from "./lib/WebpartProperties";
import DocumentItem from "./components/DocumentItem.vue";

interface ICompData {
  heading: string;
  description: string;
  listName: string;
  mockDataUrl: string;
  items: any[];
}

export default defineComponent({
  name: "App",
  components: { DocumentItem },
  data() {
    return {
      heading: "",
      description: "",
      listName: "",
      mockDataUrl: "",
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
      this.heading = WebpartProperties.getPropertyString(
        this.$root as ComponentPublicInstance,
        "heading"
      );
      this.description = WebpartProperties.getPropertyString(
        this.$root as ComponentPublicInstance,
        "description"
      );
      this.listName = WebpartProperties.getPropertyString(
        this.$root as ComponentPublicInstance,
        "list-name"
      );
      this.mockDataUrl = WebpartProperties.getPropertyString(
        this.$root as ComponentPublicInstance,
        "mock-data-url"
      );
    },
    async loadItemsFromSharePoint() {
      if (SharePointTools.isProduction()) this.items = await sp.web.lists.getByTitle(this.listName).items.get();
      else if (this.mockDataUrl) {
        fetch(this.mockDataUrl).then((response: Response) => {
          response.json().then((itemData: any) => {
            if (itemData) {
              this.items = [...itemData];
            }
          }).catch(jsonError => {
            throw jsonError;
          });
        }).catch(error => {
          throw error;
        });
      }
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
#UNIQUECLIENTAPP {
  font-family: Arial, sans-serif;
  color: #2c3e50;
  background-color: white;
  padding: 1em;
}
</style>
