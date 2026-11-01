import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {NA_YELLOW, SpinVec} from '../components/grupA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Peta video: tiga bagian (prinsip dasar → implementasi dalam kimia → penerapan).
const CARDS = [
  {n: '1', title: 'Prinsip & teori dasar', items: ['spin elektron', 'larangan Pauli', 'kopling momentum sudut'], words: ['spin', 'Pauli', 'momentum'], color: C.cyan, glow: 'cyan' as const, x: 420},
  {n: '2', title: 'Implementasi dalam kimia', items: ['term dasar periode 4', 'struktur halus', 'aturan seleksi'], words: ['term', 'struktur', 'aturan'], color: C.violet, glow: 'violet' as const, x: 960},
  {n: '3', title: 'Penerapan', items: ['lampu', 'cahaya berpendar', 'warna ion logam', 'laser'], words: ['lampu', 'berpendar', 'warna', 'laser'], color: C.amber, glow: 'gold' as const, x: 1500},
];
const Y = 560;
const CW = 480;
const CH = 380;

const Icon: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) {
    // elektron dengan spin yang berpresesi
    const a = t * 2.2;
    const tx = x + 26 * Math.cos(a);
    const ty = y - 46 + 8 * Math.sin(a);
    return (
      <g>
        <ellipse cx={x} cy={y - 46} rx={26} ry={8} fill="none" stroke={C.cyan} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.6} />
        <circle cx={x} cy={y} r={20} fill={C.cyan} opacity={0.9} />
        <circle cx={x - 6} cy={y - 6} r={6} fill="#fff" opacity={0.6} />
        <SpinVec x1={x} y1={y} x2={tx} y2={ty} color={C.cyan} width={4} head={14} />
      </g>
    );
  }
  if (i === 1) {
    // tangga term dengan pemisahan struktur halus
    const s = 6 + 3 * Math.sin(t * 1.5);
    return (
      <g>
        <rect x={x - 50} y={y + 30} width={100} height={3} fill={C.violet} />
        <rect x={x - 50} y={y - 40 - s} width={100} height={3} fill={C.violet} />
        <rect x={x - 50} y={y - 40 + s} width={100} height={3} fill={C.violet} />
        {[-1, 1].map((k) => (
          <line key={k} x1={x + k * 18} y1={y - 38 + k * s} x2={x + k * 18} y2={y + 28} stroke={NA_YELLOW} strokeWidth={3} opacity={0.6 + 0.4 * Math.sin(t * 3 + k)} />
        ))}
      </g>
    );
  }
  // sinar laser yang berdenyut
  const ph = (t * 0.8) % 1;
  return (
    <g>
      <rect x={x - 60} y={y - 18} width={56} height={36} rx={6} fill="#3a2414" stroke={C.amber} strokeWidth={2} />
      <rect x={x - 4} y={y - 3} width={72} height={6} rx={3} fill={C.red} opacity={0.85} />
      <circle cx={x - 4 + 72 * ph} cy={y} r={7} fill="#fff" opacity={Math.sin(Math.PI * ph)} />
    </g>
  );
};

export const Roadmap: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const head = ramp(t, -0.2, 0.9);
  const thread = ramp(t, wordOf(4, 'kembali') - 0.4, wordOf(4, 'kuning') + 0.6, EASE_IN_OUT);
  const solve = ramp(t, wordOf(4, 'memecahkan') - 0.3, wordOf(4, 'memecahkan') + 0.6, BACK);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center', opacity: head, translate: `0px ${(1 - head) * 20}px`}}>
        <div style={{fontFamily: FONT.mono, fontSize: 22, letterSpacing: 6, color: C.gold}}>PETA PERJALANAN · MODUL 7</div>
        <div style={{fontFamily: FONT.sans, fontSize: 60, fontWeight: 700, color: C.ink, marginTop: 6}}>Simbol Term &amp; Aturan Seleksi</div>
      </div>
      <Stage>
        {CARDS.map((c, i) => {
          const p = ramp(t, cue(0) + 0.3 + i * 0.25, cue(0) + 1.1 + i * 0.25, BACK);
          const on = ramp(t, cue(i + 1) - 0.1, cue(i + 1) + 0.5);
          const off = i < 2 ? ramp(t, cue(i + 2) - 0.1, cue(i + 2) + 0.5, EASE_IN_OUT) : ramp(t, cue(4) - 0.1, cue(4) + 0.5, EASE_IN_OUT);
          const back = i === 1 ? ramp(t, cue(4), cue(4) + 0.6) : 0;
          const lit = Math.max(on * (1 - off), back);
          const dim = 0.55 + 0.45 * Math.max(lit, 1 - ramp(t, cue(1) - 0.2, cue(1) + 0.4));
          const top = Y - CH / 2;
          const left = c.x - CW / 2;
          return (
            <g key={i} opacity={p * dim} transform={`translate(0 ${(1 - p) * 40 - 10 * lit})`}>
              <Glow x={c.x} y={Y} r={280} color={c.glow} opacity={0.2 * lit} />
              <rect x={left} y={top} width={CW} height={CH} rx={28} fill="rgba(12,18,40,0.85)" stroke={c.color} strokeOpacity={0.3 + 0.6 * lit} strokeWidth={2.5} />
              <text x={left + 36} y={top + 66} fontFamily={FONT.mono} fontSize={64} fontWeight={600} fill={c.color} dominantBaseline="central">
                {c.n}
              </text>
              <Icon i={i} x={left + CW - 100} y={top + 70} t={t} />
              <text x={left + 36} y={top + 150} fontFamily={FONT.sans} fontSize={31} fontWeight={700} fill={C.ink}>
                {c.title}
              </text>
              <rect x={left + 36} y={top + 172} width={(CW - 72) * on} height={2} fill={c.color} opacity={0.6} />
              {c.items.map((it, k) => {
                const w = ramp(t, wordOf(i + 1, c.words[k]) - 0.25, wordOf(i + 1, c.words[k]) + 0.35);
                const yy = top + 216 + k * 40;
                return (
                  <g key={k} opacity={0.35 + 0.65 * w}>
                    <circle cx={left + 46} cy={yy} r={5 + 2 * w} fill={c.color} />
                    <text x={left + 66} y={yy} dominantBaseline="central" fontFamily={FONT.sans} fontSize={25} fill={C.ink}>
                      {it}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        {/* benang merah: dua garis kuning kembali di akhir bagian dua */}
        <g opacity={thread}>
          <path
            d={`M140,${Y + 250} C400,${Y + 300} 700,${Y + 300} 880,${Y + 262}`}
            fill="none"
            stroke={NA_YELLOW}
            strokeWidth={3}
            strokeDasharray="10 10"
            strokeDashoffset={-t * 30}
            opacity={0.8}
          />
          <rect x={890} y={Y + 232} width={300} height={60} rx={30} fill="rgba(12,18,40,0.9)" stroke={NA_YELLOW} strokeWidth={2} />
          {[0, 1].map((k) => (
            <rect key={k} x={918 + k * 16} y={Y + 244} width={5} height={36} rx={2} fill={NA_YELLOW} opacity={0.75 + 0.25 * Math.sin(t * 3 + k * 2)} />
          ))}
          <text x={962} y={Y + 263} dominantBaseline="central" fontFamily={FONT.sans} fontSize={24} fontWeight={600} fill={C.ink}>
            dua garis kuning
          </text>
          <g opacity={solve}>
            <text x={1210} y={Y + 263} dominantBaseline="central" fontFamily={FONT.sans} fontSize={24} fontWeight={700} fill={C.mint}>
              → misteri terpecahkan
            </text>
          </g>
        </g>
      </Stage>
    </AbsoluteFill>
  );
};
