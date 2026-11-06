import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import styles from './simulador.module.css';

type Formation = '3-1' | '2-2' | '1-2-1';
type Player = { name: string; number: number };
type Tactics = { pressure: number; pace: number; possession: number; duration: number };
type MatchStats = { shots: number; passes: number; recoveries: number; possession: number };

const formations: Record<Formation, { label: string; positions: [number, number][] }> = {
  '3-1': { label: '3–1 • Equilibrada', positions: [[31, 27], [50, 37], [69, 27], [50, 19]] },
  '2-2': { label: '2–2 • Ofensiva', positions: [[34, 28], [66, 28], [36, 18], [64, 18]] },
  '1-2-1': { label: '1–2–1 • Losango', positions: [[50, 31], [34, 22], [66, 22], [50, 15]] },
};
const initialPlayers: Player[] = [
  { name: 'Rafa', number: 1 },
  { name: 'Caio', number: 7 },
  { name: 'Davi', number: 10 },
  { name: 'Léo', number: 11 },
  { name: 'Bruno', number: 9 },
];
const initialTactics: Tactics = { pressure: 62, pace: 55, possession: 60, duration: 20 };
const initialStats: MatchStats = { shots: 0, passes: 0, recoveries: 0, possession: 50 };

function readSaved<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function SimulatorPage() {
  const [formation, setFormation] = useState<Formation>(() => readSaved('oct-tatics-formation', '3-1'));
  const [players, setPlayers] = useState<Player[]>(() => readSaved('oct-tatics-players', initialPlayers));
  const [tactics, setTactics] = useState<Tactics>(() => readSaved('oct-tatics-tactics', initialTactics));
  const [running, setRunning] = useState(false);
  const [minute, setMinute] = useState(0);
  const [score, setScore] = useState<[number, number]>([2, 1]);
  const [stats, setStats] = useState<MatchStats>(initialStats);
  const [events, setEvents] = useState<string[]>(['Pronto para iniciar a simulação.']);

  useEffect(() => {
    localStorage.setItem('oct-tatics-formation', JSON.stringify(formation));
    localStorage.setItem('oct-tatics-players', JSON.stringify(players));
    localStorage.setItem('oct-tatics-tactics', JSON.stringify(tactics));
  }, [formation, players, tactics]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setMinute((current) => {
        const next = current + 1;
        if (next >= tactics.duration) setRunning(false);
        return Math.min(next, tactics.duration);
      });
      setStats((current) => ({
        shots: current.shots + (Math.random() < 0.18 + tactics.pace / 500 ? 1 : 0),
        passes: current.passes + 2 + Math.floor(Math.random() * 5),
        recoveries: current.recoveries + (Math.random() < tactics.pressure / 160 ? 1 : 0),
        possession: Math.max(25, Math.min(75, 50 + Math.round((tactics.possession - 50) * 0.3) + Math.floor(Math.random() * 7 - 3))),
      }));
      if (Math.random() < 0.035 + tactics.pace / 2500) {
        const homeScores = Math.random() < 0.5;
        if (homeScores) setScore(([home, away]) => [home + 1, away]);
        else setScore(([home, away]) => [home, away + 1]);
        setEvents((current) => [
          `${String(minute + 1).padStart(2, '0')}’ • ${homeScores ? 'GOL! Boa jogada da equipe da casa.' : 'Gol da equipe visitante.'}`,
          ...current,
        ].slice(0, 5));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, tactics, minute]);

  const progress = useMemo(() => Math.min(100, (minute / tactics.duration) * 100), [minute, tactics.duration]);
  const positions = formations[formation].positions;

  function updatePlayer(index: number, name: string) {
    setPlayers((current) => current.map((player, i) => (i === index ? { ...player, name } : player)));
  }

  function resetMatch() {
    setRunning(false);
    setMinute(0);
    setScore([2, 1]);
    setStats(initialStats);
    setEvents(['Simulação reiniciada. Ajuste os parâmetros e comece novamente.']);
  }

  function saveSetup() {
    localStorage.setItem('oct-tatics-setup-saved', 'true');
    setEvents((current) => ['Configuração tática salva neste navegador.', ...current].slice(0, 5));
  }

  return (
    <main className={styles.app}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="/" aria-label="Oct Táticas, início">
          <span className={styles.brandMark}>O</span><span>oct<span className={styles.brandAccent}>táticas</span></span>
        </a>
        <div className={styles.topMeta}><span className={styles.liveDot} /> CENTRAL DE SIMULAÇÃO <span className={styles.topDivider}>/</span> FUTSAL</div>
        <button className={styles.profile} type="button" title="Perfil">OS</button>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <div className={styles.sideLabel}>ÁREA TÉCNICA</div>
          <a className={`${styles.navItem} ${styles.activeNav}`} href="#simulacao"><span>▦</span> Simulador</a>
          <a className={styles.navItem} href="#taticas"><span>⌘</span> Táticas</a>
          <a className={styles.navItem} href="#elenco"><span>♙</span> Elenco</a>
          <div className={styles.sideBottom}><span className={styles.statusIcon}>●</span><div><strong>Modo laboratório</strong><small>Configuração local</small></div></div>
        </aside>

        <section className={styles.content} id="simulacao">
          <div className={styles.headingRow}>
            <div><div className={styles.eyebrow}>SEU CAMPO, SUAS REGRAS</div><h1>Simulador tático</h1><p className={styles.subtitle}>Monte a formação, ajuste o estilo de jogo e veja a estratégia em ação.</p></div>
            <button type="button" className={styles.saveButton} onClick={saveSetup}><span>▣</span> Salvar configuração</button>
          </div>

          <div className={styles.mainGrid}>
            <section className={styles.pitchCard}>
              <div className={styles.cardHeader}><div><span className={styles.sectionKicker}>VISÃO TÁTICA</span><h2>Quadra</h2></div><span className={styles.formationBadge}>{formation}</span></div>
              <div className={styles.scoreboard}>
                <div className={styles.teamName}><span className={styles.teamEmblem}>O</span><span>OCT TÁTICAS</span></div>
                <div className={styles.score}>{score[0]} <span>:</span> {score[1]}</div>
                <div className={styles.matchClock}>{String(minute).padStart(2, '0')}<small> / {tactics.duration} MIN</small></div>
                <div className={styles.awayName}>ADVERSÁRIO <span className={styles.awayEmblem}>A</span></div>
              </div>
              <div className={styles.pitchWrap}>
                <div className={styles.pitch} aria-label={`Quadra de futsal com formação ${formation}`}>
                  <div className={styles.pitchLine} /><div className={styles.centerCircle} /><div className={styles.centerSpot} />
                  <div className={`${styles.penalty} ${styles.penaltyTop}`} /><div className={`${styles.penalty} ${styles.penaltyBottom}`} />
                  <div className={`${styles.goal} ${styles.goalTop}`} /><div className={`${styles.goal} ${styles.goalBottom}`} />
                  {players.map((player, index) => {
                    const [x, y] = index === 0 ? [50, 87] : positions[index - 1];
                    const style = { left: `${x}%`, top: `${y}%` } as CSSProperties;
                    return <div key={player.number} className={`${styles.player} ${index === 0 ? styles.goalkeeper : ''}`} style={style}><span>{player.number}</span><small>{player.name || `Jogador ${index + 1}`}</small></div>;
                  })}
                  {[{ x: 43, y: 38, n: 4 }, { x: 57, y: 38, n: 6 }, { x: 50, y: 50, n: 8 }, { x: 39, y: 63, n: 10 }, { x: 61, y: 63, n: 7 }].map((player) => <div key={player.n} className={`${styles.player} ${styles.opponent}`} style={{ left: `${player.x}%`, top: `${player.y}%` }}><span>{player.n}</span></div>)}
                  <span className={styles.ball} style={{ left: `${minute % 2 ? 56 : 44}%`, top: `${minute % 2 ? 48 : 55}%` }}>●</span>
                </div>
              </div>
              <div className={styles.pitchLegend}><span><i className={styles.legendHome} /> OCT TÁTICAS</span><span><i className={styles.legendAway} /> ADVERSÁRIO</span><span><i className={styles.legendBall} /> BOLA</span></div>
              <div className={styles.matchControls}>
                <button className={styles.playButton} type="button" onClick={() => minute >= tactics.duration ? resetMatch() : setRunning(!running)}><span>{running ? 'Ⅱ' : '▶'}</span> {running ? 'Pausar simulação' : minute >= tactics.duration ? 'Jogar novamente' : 'Iniciar simulação'}</button>
                <button className={styles.resetButton} type="button" onClick={resetMatch}>↺ Reiniciar</button>
                <div className={styles.progressWrap}><div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div><small>{Math.round(progress)}% concluído</small></div>
              </div>
            </section>

            <aside className={styles.settingsColumn} id="taticas">
              <section className={styles.settingsCard}>
                <div className={styles.cardHeader}><div><span className={styles.sectionKicker}>PLANO DE JOGO</span><h2>Formação</h2></div><span className={styles.tinyIcon}>⌗</span></div>
                <div className={styles.formationList}>{(Object.keys(formations) as Formation[]).map((key) => <button key={key} type="button" className={`${styles.formationOption} ${formation === key ? styles.selectedFormation : ''}`} onClick={() => setFormation(key)}><span className={styles.miniPitch}><i /><i /><i /><i /></span><span><strong>{key}</strong><small>{formations[key].label.split('•')[1]}</small></span><span className={styles.radio}>{formation === key ? '●' : '○'}</span></button>)}</div>
                <div className={styles.sliderGroup}><label htmlFor="pressure"><span>Pressão defensiva</span><b>{tactics.pressure}<small>%</small></b></label><input id="pressure" type="range" min="0" max="100" value={tactics.pressure} onChange={(e) => setTactics({ ...tactics, pressure: Number(e.target.value) })} /><div className={styles.rangeLabels}><span>Recuada</span><span>Alta</span></div></div>
                <div className={styles.sliderGroup}><label htmlFor="pace"><span>Ritmo de jogo</span><b>{tactics.pace}<small>%</small></b></label><input id="pace" type="range" min="0" max="100" value={tactics.pace} onChange={(e) => setTactics({ ...tactics, pace: Number(e.target.value) })} /><div className={styles.rangeLabels}><span>Controlado</span><span>Intenso</span></div></div>
                <div className={styles.sliderGroup}><label htmlFor="possession"><span>Foco em posse</span><b>{tactics.possession}<small>%</small></b></label><input id="possession" type="range" min="0" max="100" value={tactics.possession} onChange={(e) => setTactics({ ...tactics, possession: Number(e.target.value) })} /><div className={styles.rangeLabels}><span>Transição</span><span>Posse</span></div></div>
                <div className={styles.durationRow}><label htmlFor="duration">Duração da partida</label><select id="duration" value={tactics.duration} onChange={(e) => { setTactics({ ...tactics, duration: Number(e.target.value) }); if (minute >= Number(e.target.value)) setMinute(0); }}><option value="10">10 minutos</option><option value="20">20 minutos</option><option value="30">30 minutos</option><option value="40">40 minutos</option></select></div>
              </section>

              <section className={styles.settingsCard} id="elenco">
                <div className={styles.cardHeader}><div><span className={styles.sectionKicker}>QUINTETO INICIAL</span><h2>Elenco em quadra</h2></div><span className={styles.rosterCount}>5 atletas</span></div>
                <div className={styles.roster}>{players.map((player, index) => <label className={styles.rosterPlayer} key={player.number}><span className={`${styles.rosterNumber} ${index === 0 ? styles.gkNumber : ''}`}>{player.number}</span><input aria-label={`Nome do jogador ${player.number}`} value={player.name} maxLength={14} onChange={(e) => updatePlayer(index, e.target.value)} /><small>{index === 0 ? 'GOL' : index === 1 ? 'FIXO' : index === 4 ? 'PIVÔ' : 'ALA'}</small></label>)}</div>
              </section>
            </aside>
          </div>

          <div className={styles.bottomGrid}>
            <section className={styles.statsCard}><div className={styles.cardHeader}><div><span className={styles.sectionKicker}>DADOS DA PARTIDA</span><h2>Desempenho ao vivo</h2></div><span className={styles.liveLabel}><i /> {running ? 'AO VIVO' : 'SIMULAÇÃO'}</span></div><div className={styles.statsGrid}><div className={styles.stat}><span>Posse de bola</span><strong>{stats.possession}<small>%</small></strong><div className={styles.statBar}><i style={{ width: `${stats.possession}%` }} /></div></div><div className={styles.stat}><span>Finalizações</span><strong>{stats.shots}</strong><small className={styles.statHint}>no alvo</small></div><div className={styles.stat}><span>Passes realizados</span><strong>{stats.passes}</strong><small className={styles.statHint}>equipe da casa</small></div><div className={styles.stat}><span>Recuperações</span><strong>{stats.recoveries}</strong><small className={styles.statHint}>pressão efetiva</small></div></div></section>
            <section className={styles.eventsCard}><div className={styles.cardHeader}><div><span className={styles.sectionKicker}>ACONTECEU</span><h2>Momentos da partida</h2></div><span className={styles.eventIcon}>⌁</span></div><div className={styles.eventList}>{events.map((event, index) => <div className={styles.event} key={`${event}-${index}`}><span className={styles.eventDot} />{event}</div>)}</div></section>
          </div>
          <footer className={styles.footer}><span>OCT TÁTICAS <b>•</b> LABORATÓRIO DE ESTRATÉGIA</span><span>Simulação demonstrativa — resultados não representam partidas reais.</span></footer>
        </section>
      </div>
    </main>
  );
}
