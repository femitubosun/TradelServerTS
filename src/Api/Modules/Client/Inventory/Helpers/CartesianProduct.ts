// @ts-nocheck
const f = <T>(a: T[], b: T[]) =>
  [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));

export const CartesianProduct = <T>(a: T[], b: T[], ...c: T[][]) => {
  if (!b || b.length === 0) return a;
  const fab = f(a, b);
  const [b2, ...c2] = c;
  return CartesianProduct(fab, b2, c2);
};
