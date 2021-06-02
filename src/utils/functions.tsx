export const isBrowser = () => {
    return typeof window !== "undefined"
}

export const takeIf = (condition, value, defaultValue = undefined) => {
    if (condition) {
        return value
    } else {
        return defaultValue
    }
}

export const isEqualJSON = (json1 = {}, json2 = {}) => {
    return JSON.stringify(json1) === JSON.stringify(json2);
}

export const findLastIndex = (array: Array<any>, predicate: (c: any) => boolean) => {
    if (!array) return -1;
    let index = array.length - 1
    if (!predicate) return index;
    for (let i = index; i > -1; i--) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}
