import Logo from './Logo';

export default function Rodape() {
  return (
    <footer>
      <span><Logo /> © 2026 · Todos os direitos reservados</span>
      {/* Links ainda sem endereço: troque por <a href="https://..."> quando existirem */}
      <span><a>GitHub</a><a>Instagram</a></span>
    </footer>
  );
}
