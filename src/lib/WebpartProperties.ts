import { ComponentPublicInstance, ComponentOptionsBase } from "vue";

const dashToCamel = (str: string) => {
    return str.replace(/\W+(.)/g, (index, chr) => {
        return chr.toUpperCase();
    });
}, camelToDash = (name: string) => {
    return name.replace(/\W+/g, '-')
        .replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
};

export function getPropertyString(vueRoot: any, key: string): string {
    let el: HTMLElement | undefined = vueRoot?.$el?.parentElement,
        prop: string | null = el ? el.getAttribute(`data-${camelToDash(key)}`) : null;
    if (prop) return decodeURIComponent(prop);
    else return "";
}
export function getPropertyInteger(vueRoot: any, key: string): number {
    let propStringValue = getPropertyString(vueRoot, key);
    try {
        return parseInt(propStringValue);
    } catch (e) {
        return 0;
    }
}