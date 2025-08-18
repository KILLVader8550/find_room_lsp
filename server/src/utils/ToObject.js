export function ToObject(value = []){
    const [header, ...rows] = value;
    if(!header.length) return [];
    return rows.map(r => Object.fromEntries(header.map((k,i) => [String(k).trim(), r[i]?? null])));
}