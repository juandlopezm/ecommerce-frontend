const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Formatea un valor numérico (o string) como pesos colombianos. */
export function formatCOP(value: string | number): string {
  return cop.format(Number(value));
}
