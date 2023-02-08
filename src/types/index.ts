export type WithRequiredProperties<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};
