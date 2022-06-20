export type ResolveStaticPropsReturnType<
  T extends (...args: never) => Promise<{ props: unknown }>
> = T extends (...args: never) => Promise<{ props: infer U }> ? U : never;
