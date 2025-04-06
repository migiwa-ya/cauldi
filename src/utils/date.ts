export function formatDate(date: Date, format = "Y-m-d H:i:s") {
  const d = date instanceof Date ? date : new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");

  const tokens: any = {
    Y: d.getFullYear(),
    m: pad(d.getMonth() + 1),
    d: pad(d.getDate()),
    H: pad(d.getHours()),
    i: pad(d.getMinutes()),
    s: pad(d.getSeconds()),
  };

  return format.replace(/[YmdHis]/g, (token) => tokens[token] ?? token);
}
