export type OmitBy<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type OptionalBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type ValueOf<T> = T[keyof T];
