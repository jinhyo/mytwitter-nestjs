export function makeQuerySelector<T>(
  repositoryName: string,
  select: (keyof T)[],
): string[] {
  return select.map((target) => `${repositoryName}.${target}`);
}
