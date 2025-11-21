export function calcularDefinitiva(config, valores) {
  const { porcentajes } = config;
  if (!Array.isArray(porcentajes) || !Array.isArray(valores)) return 0;
  let total = 0;
  valores.forEach((nota, idx) => {
    if (!nota) return;
    const valor = Number(nota.valor);
    if (isNaN(valor)) return;
    const peso = Number(porcentajes[idx]) / 100;
    total += valor * peso;
  });
  return Number(total.toFixed(2));
}
