const getHashOfString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return hash;
};

const normalizeHash = (hash, min, max) =>
    Math.floor((hash % (max - min)) + min);

const HSLtoString = (hsl) => `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;

export const generateHSL = (name) => {
    const hRange = [0, 360];
    const sRange = [0, 100];
    const lRange = [0, 100];

    const hash = getHashOfString(name);
    const h = normalizeHash(hash, hRange[0], hRange[1]);
    const s = normalizeHash(hash, sRange[0], sRange[1]);
    const l = normalizeHash(hash, lRange[0], lRange[1]);

    return HSLtoString([h, s, l]);
};
