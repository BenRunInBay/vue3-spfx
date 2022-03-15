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

export function getVueDOMElementHTML(appID: string, properties: any): string {
    let props: any[] = [], propAttributes: string = "";
    for (let k in properties) {
        let prop: any = properties[k];
        if (typeof (prop) == "string") props.push({
            key: k,
            value: prop
        });
        else if (typeof (prop) == "number") props.push({
            key: k,
            value: prop.toString()
        });
        else if (typeof (prop) == "boolean") props.push({
            key: k,
            value: prop ? "true" : "false"
        });
        else if (typeof (prop) == "object") props.push({
            key: k,
            value: JSON.stringify(prop)
        });
    }
    props.forEach((prop) => {
        propAttributes += `data-${camelToDash(prop.key)}="${encodeURIComponent(prop.value)}"`;
    });
    return `<div id="${appID}" ${propAttributes}></div>`;
}