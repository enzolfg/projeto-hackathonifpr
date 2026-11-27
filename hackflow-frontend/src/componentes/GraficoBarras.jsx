// Gráfico de barras horizontais. dados = [{ nome, valor }, ...].
// A barra mais longa ocupa 62% da largura; a líder é destacada (classe "lider").
// "vazio" é o texto mostrado quando não há dados.
export default function GraficoBarras({ dados, vazio = 'Sem dados ainda.' }) {
  if (!dados.length) return <p className="sub">{vazio}</p>;
  const maximo = Math.max(1, ...dados.map((d) => d.valor));
  return (
    <div>
      {dados.map((d, i) => (
        <div className="br" key={d.nome}>
          <span>{d.nome}</span>
          <div className={'barra' + (i === 0 ? ' lider' : '')} style={{ width: `${(d.valor / maximo) * 62}%` }} />
          <b>{d.valor}</b>
        </div>
      ))}
    </div>
  );
}
