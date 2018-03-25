
export default function toInt(value) {
    const type = typeof value;
    switch (type) {
        case 'string':
            return parseInt(value);
        case 'boolean':
            return value ? 1 : 0;
        default:
            return NaN;
    }
}