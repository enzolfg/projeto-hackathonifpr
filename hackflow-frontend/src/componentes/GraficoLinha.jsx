// Gráfico de área/linha. dados = [{ dia: "21/11", total: 2 }, ...].
// Cálculo das posições no SVG:
//  - eixo X: do x=60 ao x=390, dividido igualmente entre os pontos;
//  - eixo Y: y=150 é o zero e y=20 é o topo da escala (menor múltiplo de 3 que cabe o maior valor,
//    assim as linhas de grade mostram sempre números inteiros).
// As cores e fontes vêm das classes gl-* em estilos.css.
const X_INICIO = 60;
const X_FIM = 390;
const Y_ZERO = 150;
const ALTURA = 130;

export default function GraficoLinha({ dados }) {
  if (!dados.length) return <p className="sub">Nenhuma inscrição ainda.</p>;

  const maximo = Math.max(...dados.map((d) => d.total), 0);
  const topo = Math.max(3, Math.ceil(maximo / 3) * 3);
  const passo = dados.length > 1 ? (X_FIM - X_INICIO) / (dados.length - 1) : 0;

  const x = (i) => Math.round(X_INICIO + i * passo);
  const y = (valor) => Math.round(Y_ZERO - (valor / topo) * ALTURA);

  const linha = dados.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(d.total)}`).join('');
  const area = `${linha}V${Y_ZERO}H${x(0)}Z`;
  const indiceDoPico = dados.findIndex((d) => d.total === maximo);

  return (
    <svg className="grafico-linha" viewBox="0 0 420 190" width="100%" role="img" aria-label="Inscrições por dia">
      {/* Linhas de grade e valores do eixo Y: 0, 1/3, 2/3 e topo da escala */}
      {[0, 1, 2, 3].map((n) => {
        const valor = (topo * n) / 3;
        return (
          <g key={n}>
            <path className="gl-grade" d={`M40 ${y(valor)}H410`} />
            <text className="gl-eixo" x="32" y={y(valor) + 4} textAnchor="end">{valor}</text>
          </g>
        );
      })}

      <path className="gl-area" d={area} />
      <path className="gl-linha" d={linha} />
      {dados.map((d, i) => <circle className="gl-ponto" key={d.dia} cx={x(i)} cy={y(d.total)} r="4" />)}

      {/* Valor do pico */}
      <text className="gl-pico" x={x(indiceDoPico)} y={y(maximo) - 12} textAnchor="middle">{maximo}</text>

      {/* Dias */}
      {dados.map((d, i) => <text className="gl-eixo" key={d.dia} x={x(i)} y="172" textAnchor="middle">{d.dia}</text>)}
    </svg>
  );
}
