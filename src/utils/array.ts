export function groupBy<T, K extends keyof T>(array: Array<T>, key: K) {
  return array.reduce((acc, item): Record<string, T[]> => {
    const value = item[key];

    if (typeof value !== "string") {
      throw new Error(`Property "${String(key)}" is not a string`);
    }

    if (!acc[value]) acc[value] = [];
    acc[value].push(item);

    return acc;
  }, {} as Record<string, T[]>);
}

export function groupByKeyInitial<T, K extends keyof T>(
  array: Array<T>,
  key: K
): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const value = item[key];

    if (typeof value !== "string") {
      throw new Error(`Property "${String(key)}" is not a string`);
    }

    const initial = value.substring(0, 1);
    if (!acc[initial]) acc[initial] = [];
    acc[initial].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
