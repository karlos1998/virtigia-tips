export function priceFormatter(value: number) {
    if(isNaN(value)) {
        throw new Error("Input must be a valid integer");
    };
    const thresholds = [1e9, 1e6, 1e3];
    const suffixes = ["g", "m", "k"];
    for (let i = 0; i < thresholds.length; i++) {
        if (value >= thresholds[i]) {
            return (value / thresholds[i]).toFixed(2).replace(/\.00$/, "") + suffixes[i];
        };
    };
    return value.toString();
};