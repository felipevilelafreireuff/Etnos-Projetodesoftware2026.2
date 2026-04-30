'use client';
import { motion } from 'framer-motion';
import { useJogoScreen } from '@/src/hooks/jogo/useJogoScreen';
import { useStrings } from '@/src/contexts/LocaleContext';
import Button from '@/src/components/ui/Button';
import Spinner from '@/src/components/ui/Spinner';
import StatusTurno from './components/StatusTurno/StatusTurno';
import MaoDoJogador from './components/MaoDoJogador/MaoDoJogador';
import CartasVisiveis from './components/CartasVisiveis/CartasVisiveis';
import PainelJogadores from './components/PainelJogadores/PainelJogadores';
import Tabuleiro from './components/Tabuleiro/Tabuleiro';
import styles from './Jogo.module.css';

export default function Jogo() {
  const S = useStrings();
  const {
    estado, loading, erro, cartasSelecionadas, liderId, fase, nomesInput,
    handleSetNomes, handleIniciar,
    handleRecruitarDeck, handleRecruitarVisivel,
    handleSelecionarCarta, handleDefinirLider,
    handleJogarBando, handleProximoTurno, handleEncerrarEra,
  } = useJogoScreen();

  if (fase === 'setup') {
    return (
      <div className={styles.setup}>
        <motion.h1
          className={styles.titulo}
          initial={{ opacity: 0, y: -30, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, y: 0,  letterSpacing: '0.18em' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          EtNós
        </motion.h1>

        <motion.p
          className={styles.subtitulo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {S.jogo.configPartida}
        </motion.p>

        <motion.div
          className={styles.nomes}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {nomesInput.map((nome, i) => (
            <input
              key={i}
              className={styles.input}
              placeholder={`Jogador ${i + 1}${i >= 4 ? ' (opcional)' : ''}`}
              value={nome}
              onChange={e => {
                const novo = [...nomesInput];
                novo[i] = e.target.value;
                handleSetNomes(novo);
              }}
            />
          ))}
          <div className={styles.extraNomes}>
            {nomesInput.length < 6 && (
              <button className={styles.addJogador} onClick={() => handleSetNomes([...nomesInput, ''])}>
                {S.jogo.addJogador}
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
        >
          <Button size="lg" onClick={handleIniciar} disabled={loading || nomesInput.filter(n => n.trim()).length < 4}>
            {loading ? <Spinner size={18} /> : S.jogo.iniciar}
          </Button>
        </motion.div>

        {erro && <p className={styles.erro}>{erro}</p>}
      </div>
    );
  }

  if (!estado) return null;

  const jogadorAtual = estado.jogadores.find(j => j.id === estado.jogador_atual_id)!;
  const maoCheia     = jogadorAtual.mao.length >= 10;
  const podeRecrutar = !maoCheia && estado.estado === 'EM_ANDAMENTO';
  const podeBando    = cartasSelecionadas.length > 0 && liderId !== null;

  const guiaBando = (() => {
    if (cartasSelecionadas.length === 0)
      return { texto: 'Clique nas cartas para montar um bando', pronto: false };
    if (!liderId)
      return { texto: `${cartasSelecionadas.length} carta(s) selecionada(s) · defina o líder`, pronto: false };
    return { texto: `Pronto! ${cartasSelecionadas.length} carta(s) · líder definido`, pronto: true };
  })();

  return (
    <div className={styles.layout}>
      <div className={styles.topo}>
        <StatusTurno estado={estado} jogadorAtual={jogadorAtual} />
        {loading && <Spinner size={20} />}
        {erro    && <span className={styles.erroInline}>{erro}</span>}
      </div>

      <div className={styles.corpo}>
        <aside className={styles.lateral}>
          <PainelJogadores jogadores={estado.jogadores} jogadorAtualId={estado.jogador_atual_id} />
          <Tabuleiro reinos={estado.reinos} />
        </aside>

        <section className={styles.principal}>
          <MaoDoJogador
            cartas={jogadorAtual.mao}
            cartasSelecionadas={cartasSelecionadas}
            liderId={liderId}
            onSelecionar={handleSelecionarCarta}
            onLider={handleDefinirLider}
          />

          <CartasVisiveis
            cartas={estado.cartas_visiveis}
            totalCartasDeck={estado.total_cartas_deck}
            onPegarVisivel={handleRecruitarVisivel}
            onSacarDeck={handleRecruitarDeck}
            disabled={!podeRecrutar}
          />

          <div className={styles.acoes}>
            <div className={styles.acoesRow}>
              <Button onClick={() => handleJogarBando(true)} disabled={loading || !podeBando}>
                {S.jogo.jogarBando} + {S.jogo.colocarMarcador}
              </Button>

              <Button onClick={() => handleJogarBando(false)} disabled={loading || !podeBando} variant="ghost">
                {S.jogo.jogarBando} {S.jogo.semMarcador}
              </Button>

              <Button onClick={handleProximoTurno} disabled={loading} variant="ghost">
                {S.jogo.proximoTurno}
              </Button>

              {estado.estado === 'FIM_DE_ERA' && (
                <Button onClick={handleEncerrarEra} disabled={loading} variant="danger">
                  {S.jogo.encerrarEra}
                </Button>
              )}
            </div>

            <div className={`${styles.bandoGuia} ${guiaBando.pronto ? styles.pronto : ''}`}>
              {guiaBando.texto}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
