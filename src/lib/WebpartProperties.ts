import { ComponentPublicInstance, ComponentOptionsBase } from "vue";

export function getPropertyValue(vueRoot: ComponentPublicInstance, key: string): string {
    let el: HTMLElement | undefined = vueRoot?.$el?.parentElement,
        prop: string | null = el ? el.getAttribute(`data-${key}`) : null;
    if (prop) return decodeURIComponent(prop);
    else return "";
}