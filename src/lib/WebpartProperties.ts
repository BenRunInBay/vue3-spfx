/**
 * WebpartProperties
 * @date 2022-09-12
 */
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
export function getPropertyFloat(vueRoot: any, key: string): number {
    let propStringValue = getPropertyString(vueRoot, key);
    try {
        return parseFloat(propStringValue);
    } catch (e) {
        return 0;
    }
}
export function getPropertyObject(vueRoot: any, key: string): any {
    let propValue: string = getPropertyString(vueRoot, key);
    if (propValue) return JSON.parse(propValue);
}
export function getPropertyBoolean(vueRoot: any, key: string): boolean {
    let propValue: string = getPropertyString(vueRoot, key);
    return (propValue == "true");
}
export function getInstanceId(vueRoot: any): string {
    return getPropertyString(vueRoot, "instanceId");
}

export function getVueDOMElementHTML(appID: string, properties: any, instanceId: string=""): string {
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
    return `<div id="${appID}" data-instance-id="${instanceId}" ${propAttributes}></div>`;
}