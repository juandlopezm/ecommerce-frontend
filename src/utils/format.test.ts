import { describe, expect, it } from "vitest";
import { formatCOP } from "./format";

describe("formatCOP", () => {
  it("formatea un número como pesos colombianos", () => {
    expect(formatCOP(20000)).toContain("20.000");
  });

  it("acepta un string numérico", () => {
    expect(formatCOP("52000")).toContain("52.000");
  });

  it("no muestra decimales", () => {
    expect(formatCOP(1000.99)).not.toContain(",99");
  });
});
