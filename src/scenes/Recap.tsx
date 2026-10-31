import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Formula, Glow, Stage, Sub, Sup} from '../components/primitives';
import {wlColor} from '../components/viz';
import {SpinArrow, TermH} from '../components/grupD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 20: enam poin ringkasan + ikon bergerak; dua garis kuning menyatu menjadi ²P°₃/₂.
const IX = 440;
const rowY = (i: number) => 236 + i * 110;
const NA = wlColor(589);

const ROWS: {title: string; detail: React.ReactNode; col: string}[] = [
  {title: 'Spin ½ & larangan Pauli', detail: 'maks. dua elektron per orbital, spin berlawanan', col: C.cyan},
  {
    title: 'Simbol term',
    detail: (
      <>
        <Sup color={C.violet}>2S+1</Sup>
        <span style={{color: C.gold}}>L</span>
        <Sub color={C.mint}>J</Sub> &nbsp;= spin · orbital · total dalam satu kode
      </>
    ),
    col: C.gold,
  },
  {title: 'Aturan Hund', detail: <>S maks → L maks → J sesuai pengisian</>, col: C.violet},
  {
    title: 'Struktur halus',
    detail: (
      <>
        spin–orbit memecah term: <TermH mult={2} L="P" J="3/2" odd /> & <TermH mult={2} L="P" J="1/2" odd /> (garis D)
      </>
    ),
    col: C.mint,
  },
  {title: 'Aturan seleksi', detail: <>paritas berubah · ΔS = 0 · ΔL, ΔJ = 0, ±1</>, col: C.amber},
  {title: 'Menuju molekul (setelah UTS)', detail: 'ikatan valensi · orbital molekul', col: C.blue},
];

const Icon: React.FC<{i: number; y: number; t: number}> = ({i, y, t}) => {
  if (i === 0)
    return (
      <g>
        <rect x={IX - 38} y={y - 38} width={76} height={76} rx={8} fill="rgba(20,28,56,0.8)" stroke={C.ink} strokeOpacity={0.6} strokeWidth={3} />
        <SpinArrow x={IX - 13} y={y + 4 * Math.sin(t * 3)} len={50} width={5} />
        <SpinArrow x={IX + 13} y={y - 4 * Math.sin(t * 3)} len={50} width={5} angle={180} />
      </g>
    );
  if (i === 1) {
    const a = t * 1.5;
    return (
      <g>
        <ellipse cx={IX} cy={y} rx={44} ry={16} fill="none" stroke={C.gold} strokeOpacity={0.5} strokeWidth={2} transform={`rotate(${20 * Math.sin(t)} ${IX} ${y})`} />
        <circle cx={IX + 44 * Math.cos(a)} cy={y + 16 * Math.sin(a)} r={6} fill={C.cyan} />
        <text x={IX} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontSize={40} fill={C.gold}>
          <tspan fontSize={24} baselineShift="45%" fill={C.violet}>
            2
          </tspan>
          L
          <tspan fontSize={24} baselineShift="-28%" fill={C.mint}>
            J
          </tspan>
        </text>
      </g>
    );
  }
  if (i === 2)
    return (
      <g>
        {[0, 1, 2].map((k) => {
          const ph = ((t * 0.5 - k * 0.12) % 1 + 1) % 1;
          const drop = Math.min(1, ph * 4);
          return (
            <g key={k}>
              <rect x={IX - 42 + k * 28} y={y - 14} width={28} height={28} fill="rgba(20,28,56,0.8)" stroke={C.ink} strokeOpacity={0.6} strokeWidth={2} />
              <SpinArrow x={IX - 28 + k * 28} y={y - (1 - drop) * 20} len={24} width={4} opacity={drop * Math.min(1, (1 - ph) * 6)} />
            </g>
          );
        })}
      </g>
    );
  if (i === 3) {
    const sp = 9 + 7 * Math.sin(t * 1.6);
    return (
      <g>
        <line x1={IX - 40} y1={y + 28} x2={IX - 10} y2={y + 28} stroke={C.mint} strokeWidth={4} />
        <path d={`M${IX - 10},${y + 28} L${IX + 8},${y - sp}`} stroke={C.mint} strokeWidth={2} strokeDasharray="3 4" fill="none" />
        <path d={`M${IX - 10},${y + 28} L${IX + 8},${y + sp - 8}`} stroke={C.mint} strokeWidth={2} strokeDasharray="3 4" fill="none" />
        <rect x={IX + 8} y={y - sp - 2} width={34} height={4} fill={NA} />
        <rect x={IX + 8} y={y + sp - 10} width={34} height={4} fill={NA} />
      </g>
    );
  }
  if (i === 4) {
    const ph = (t * 0.6) % 1;
    return (
      <g>
        <line x1={IX - 40} y1={y - 26} x2={IX + 40} y2={y - 26} stroke={C.amber} strokeWidth={4} />
        <line x1={IX - 40} y1={y + 26} x2={IX + 40} y2={y + 26} stroke={C.blue} strokeWidth={4} />
        <line x1={IX - 14} y1={y - 22} x2={IX - 14} y2={y + 12} stroke={C.mint} strokeWidth={4} />
        <path d={`M${IX - 22},${y + 8} L${IX - 14},${y + 20} L${IX - 6},${y + 8} Z`} fill={C.mint} />
        <path d={`M${IX + 6},${y} l8,10 l16,-20`} fill="none" stroke={C.mint} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.5 + 0.5 * Math.sin(Math.PI * ph)} />
      </g>
    );
  }
  const r = 0.5 + 0.5 * Math.sin(t * 2);
  return (
    <g>
      <ellipse cx={IX} cy={y} rx={50} ry={22 + 4 * r} fill={C.blue} opacity={0.28} />
      <ellipse cx={IX} cy={y} rx={32} ry={14} fill={C.blue} opacity={0.35} />
      {[-24, 24].map((dx) => (
        <circle key={dx} cx={IX + dx} cy={y} r={11} fill="#f2f5ff" />
      ))}
    </g>
  );
};

export const Recap: React.FC = () => {
  const {t, cue, cueEnd, dur} = useScene();
  const intro = ramp(t, cue(0) - 0.4, cue(0) + 0.6);
  const lit = ROWS.map((_, i) => ramp(t, cue(i + 1) - 0.2, cue(i + 1) + 0.6, BACK));
  const cur = (i: number) => Math.min(1, ramp(t, cue(i + 1) - 0.2, cue(i + 1) + 0.4)) * (1 - 0.4 * ramp(t, cue(i + 2) - 0.2, cue(i + 2) + 0.4));
  const tEnd = cueEnd(6) - 1.8;
  const listOut = ramp(t, tEnd, tEnd + 0.7, EASE_IN_OUT);
  const lines = ramp(t, tEnd + 0.4, tEnd + 1.0);
  const merge = ramp(t, tEnd + 1.0, tEnd + 2.6, EASE_IN_OUT);
  const sym = ramp(t, tEnd + 2.4, tEnd + 3.2);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const gap = mix(130, 0, merge);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={520} r={600} color="gold" opacity={0.06 + 0.04 * Math.sin(t)} />
        <g opacity={intro * (1 - listOut)}>
          <line x1={IX} y1={rowY(0)} x2={IX} y2={rowY(5)} stroke={C.faint} strokeWidth={2} opacity={0.6} />
          {ROWS.map((r, i) => (
            <g key={i} opacity={lit[i]} transform={`translate(${(1 - lit[i]) * -30} 0)`}>
              <circle cx={IX} cy={rowY(i)} r={48} fill="rgba(10,16,34,0.95)" stroke={r.col} strokeWidth={3} strokeOpacity={0.5 + 0.5 * cur(i)} />
              <Icon i={i} y={rowY(i)} t={t} />
            </g>
          ))}
        </g>
        {/* dua garis kuning natrium menyatu */}
        <g opacity={lines * (1 - 0.85 * sym)}>
          {[-1, 1].map((s) => {
            const x = 960 + s * gap - 8;
            return (
              <g key={s}>
                <rect x={x - 22} y={300} width={60} height={420} fill={NA} opacity={0.14 + 0.06 * Math.sin(t * 5 + s)} rx={20} />
                <rect x={x} y={300} width={16} height={420} fill={NA} rx={6} />
                <rect x={x + 5} y={300} width={6} height={420} fill="#fff6c0" rx={3} />
              </g>
            );
          })}
        </g>
        <Glow x={960} y={510} r={260 * sym + 40 * merge} color="gold" opacity={0.5 * merge} />
      </Stage>
      {ROWS.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: IX + 80,
            top: rowY(i) - 50,
            opacity: lit[i] * intro * (1 - listOut) * (0.55 + 0.45 * cur(i)),
            transform: `translateX(${(1 - lit[i]) * -30}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{fontFamily: FONT.sans, fontSize: 40, fontWeight: 700, color: r.col, lineHeight: 1.12}}>{r.title}</div>
          <div style={{fontFamily: FONT.serif, fontSize: 34, color: C.ink, lineHeight: 1.25}}>{r.detail}</div>
        </div>
      ))}
      <Formula x={960} y={510} p={sym} accent={C.gold} size={130} caption="kode pendek di balik cahaya kuning natrium">
        <TermH mult={2} L="P" J="3/2" odd />
      </Formula>
    </AbsoluteFill>
  );
};
