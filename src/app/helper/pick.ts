export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const finalObject = {} as Pick<T, K>;

    for (const key of keys) {
        if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
            finalObject[key] = obj[key];
        }
    }

    return finalObject;
};
