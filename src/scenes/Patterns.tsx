import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot, smoothPath} from '../anim';
import {DrawPath, Formula, Label, Stage, Sup, V} from '../components/primitives';
import {OrbitalBoxes, Term, TermSVG, type BoxFill} from '../components/grupB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 08: term dasar d¹…d¹⁰ (dan p¹…p⁶), S naik sampai 5/2 lalu turun, pola cermin elektron–lubang.
const DT: [string, string, string][] = [
  ['2', 'D', '3/2'],
  ['3', 'F', '2'],
  ['4', 'F', '3/2'],
  ['5', 'D', '0'],
  ['6', 'S', '5/2'],
  ['5', 'D', '4'],
  ['4', 'F', '9/2'],
  ['3', 'F', '4'],
  ['2', 'D', '5/2'],
  ['1', 'S', '0'],
];
const SV = [0.5, 1, 1.5, 2, 2.5, 2, 1.5, 1, 0.5, 0];
const PT: [string, string, string, boolean][] = [
  ['2', 'P', '1/2', true],
  ['3', 'P', '0', false],
  ['4', 'S', '3/2', true],
  ['3', 'P', '2', false],
  ['2', 'P', '3/2', true],
  ['1', 'S', '0', false],
];
const colX = (n: number) => 190 + (n - 1) * 171; // n = 1..10
const pX = (n: number) => 960 + (n - 3.5) * 171; // n = 1..6
const Y = {head: 250, box: 322, term: 400, g0: 760, gs: 100};
const BW = 26;
const BG = 3;

/** Isi Hund: ↑ di semua kotak dulu, lalu ↓. p = progres elektron (0..n, kontinu). */
const hundFill = (nb: number, p: number): BoxFill[] =>
  Array.from({length: nb}, (_, i) => [Math.min(1, Math.max(0, p - i)), Math.min(1, Math.max(0, p - nb - i))]);

const Power: React.FC<{x: number; y: number; base: string; n: number; color: string; size?: number; opacity?: number}> = ({x, y, base, n, color, size = 36, opacity = 1}) => (
  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={size} fill={color} opacity={opacity}>
    {base}
    <tspan baselineShift="super" fontSize={size * 0.62} fontStyle="normal">
      {n}
    </tspan>
  </text>
);

export const Patterns: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const frame = ramp(t, cue(0) + 0.2, cue(0) + 1.2);
  const a5 = wordOf(1, 'sextet') - 0.3;
  const a1 = cue(1) + 0.4;
  const b6 = wordOf(2, 'berpasangan') - 0.6;
  const at = (n: number) => (n <= 5 ? mix(a1, a5, (n - 1) / 4) : mix(b6, cue(2) + 4.2, (n - 6) / 4));
  const colP = (n: number) => ramp(t, at(n) - 0.2, at(n) + 0.5, BACK);
  const fillP = (n: number) => mix(0, n, ramp(t, at(n) - 0.2, at(n) + 0.7, EASE_IN_OUT));
  // grafik S
  const gOn = slot(t, cue(0) + 1.0, cue(3) + 0.3, 0.6, 0.6);
  const revealed = [...Array(10)].reduce((s, _, i) => s + ramp(t, at(i + 1), at(i + 1) + 0.6), 0);
  const gpts: [number, number][] = SV.map((s, i) => [colX(i + 1), Y.g0 - s * Y.gs]);
  const peak = ramp(t, a5 + 0.3, a5 + 1.0);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  // pola cermin
  const mirror = ramp(t, wordOf(3, 'cerminnya') - 0.2, wordOf(3, 'cerminnya') + 0.5);
  const dArc = ramp(t, wordOf(3, 'delapan') - 0.2, wordOf(3, 'delapan') + 0.9, EASE_IN_OUT);
  const pRow = slot(t, wordOf(3, 'satu') - 0.5, cue(4) + 0.4, 0.6, 0.5);
  const pArc = ramp(t, wordOf(3, 'lima') - 0.2, wordOf(3, 'lima') + 0.9, EASE_IN_OUT);
  const hlD = mirror * (1 - ramp(t, cue(4) + 0.2, cue(4) + 0.6)) + ramp(t, cue(4) + 0.6, cue(4) + 1.2);
  const fJ = ramp(t, cue(4) + 0.5, cue(4) + 1.2);
  const holes = ramp(t, wordOf(4, 'lubang') - 0.2, wordOf(4, 'lubang') + 0.5);
  const jRing = ramp(t, wordOf(4, 'terbalik') - 0.2, wordOf(4, 'terbalik') + 0.5);

  return (
    <AbsoluteFill>
      <Stage>
        {/* tabel d¹…d¹⁰ */}
        {Array.from({length: 10}, (_, i) => {
          const n = i + 1;
          const x = colX(n);
          const p = colP(n);
          const isMirror = n === 2 || n === 8;
          const fresh = ramp(t, at(n) - 0.2, at(n) + 0.3) * (1 - ramp(t, at(n) + 0.8, at(n) + 1.6));
          return (
            <g key={n} opacity={frame}>
              <rect
                x={x - 80}
                y={Y.head - 34}
                width={160}
                height={Y.term - Y.head + 74}
                rx={14}
                fill={isMirror ? C.gold : C.faint}
                fillOpacity={isMirror ? 0.1 * hlD : 0.12 + 0.2 * fresh}
                stroke={isMirror ? C.gold : C.faint}
                strokeOpacity={isMirror ? 0.25 + 0.75 * hlD : 0.35 + 0.5 * fresh}
                strokeWidth={isMirror ? 2 + 2 * hlD : 2}
              />
              <Power x={x} y={Y.head} base="d" n={n} color={C.ink} opacity={0.5 + 0.5 * p} />
              <OrbitalBoxes x={x} y={Y.box} n={5} fill={hundFill(5, fillP(n))} w={BW} h={40} gap={BG} t={t + n} arrowW={2.6} stroke={C.muted} />
              <TermSVG x={x} y={Y.term} m={DT[i][0]} L={DT[i][1]} J={DT[i][2]} size={48} opacity={p} />
            </g>
          );
        })}
        {/* lubang di d⁸: dua tempat ↓ yang kosong */}
        {[3, 4].map((b) => {
          const bx = colX(8) - (5 * BW + 4 * BG) / 2 + b * (BW + BG) + BW * 0.68;
          return <circle key={b} cx={bx} cy={Y.box} r={8 + 2 * pulse} fill="none" stroke={C.pink} strokeWidth={3} strokeDasharray="4 3" opacity={holes} />;
        })}
        {/* cincin J (d² dan d⁸) */}
        {[2, 8].map((n) => (
          <circle key={n} cx={colX(n) + 24} cy={Y.term + 14} r={15 + 2 * pulse} fill="none" stroke={C.mint} strokeWidth={3} opacity={jRing} />
        ))}

        {/* grafik S */}
        <g opacity={gOn}>
          <line x1={110} y1={Y.g0} x2={1800} y2={Y.g0} stroke={C.faint} strokeWidth={2} />
          {[1, 2].map((s) => (
            <line key={s} x1={110} y1={Y.g0 - s * Y.gs} x2={1800} y2={Y.g0 - s * Y.gs} stroke={C.faint} strokeWidth={1} strokeDasharray="4 8" opacity={0.6} />
          ))}
          <Label x={96} y={Y.g0 - 2.5 * Y.gs} size={30} color={C.violet} font="serif" italic anchor="start">
            S
          </Label>
          {[0, 1, 2].map((s) => (
            <Label key={s} x={150} y={Y.g0 - s * Y.gs - 16} size={20} color={C.muted} font="mono">
              {s}
            </Label>
          ))}
          <DrawPath d={smoothPath(gpts)} p={Math.max(0, (revealed - 1) / 9)} stroke={C.violet} width={5} />
          {gpts.map(([x, y], i) => {
            const p = ramp(t, at(i + 1), at(i + 1) + 0.5, BACK);
            return <circle key={i} cx={x} cy={y} r={9 * p + (i === 4 ? 4 * pulse * peak : 0)} fill={C.violet} opacity={p} />;
          })}
          <Label x={colX(5)} y={Y.g0 - 2.5 * Y.gs - 42} size={26} color={C.gold} weight={700} opacity={peak}>
            setengah penuh: S = 5/2, L = 0
          </Label>
          <Label x={colX(8)} y={Y.g0 - 2 * Y.gs + 10} size={24} color={C.pink} opacity={ramp(t, b6, b6 + 0.6)}>
            mulai berpasangan → S turun
          </Label>
        </g>

        {/* cermin d² ↔ d⁸ */}
        <g opacity={dArc}>
          <DrawPath d={`M${colX(2)},${Y.term + 50} C${colX(2)},${Y.term + 170} ${colX(8)},${Y.term + 170} ${colX(8)},${Y.term + 50}`} p={dArc} stroke={C.gold} width={4} />
          <TermSVG x={(colX(2) + colX(8)) / 2} y={Y.term + 168} m="3" L="F" size={46} colored={false} color={C.gold} />
          <Label x={(colX(2) + colX(8)) / 2 + 70} y={Y.term + 170} size={24} color={C.muted} anchor="start">
            d<tspan baselineShift="super" fontSize={15}>2</tspan> ↔ d<tspan baselineShift="super" fontSize={15}>8</tspan>
          </Label>
        </g>
        {/* deret p¹…p⁶ */}
        <g opacity={pRow}>
          {PT.map((pt, i) => {
            const n = i + 1;
            const x = pX(n);
            const mir = n === 1 || n === 5;
            return (
              <g key={n}>
                <rect x={x - 76} y={622} width={152} height={176} rx={14} fill={mir ? C.cyan : C.faint} fillOpacity={mir ? 0.1 * pArc : 0.12} stroke={mir ? C.cyan : C.faint} strokeOpacity={mir ? 0.3 + 0.7 * pArc : 0.35} strokeWidth={2} />
                <Power x={x} y={652} base="p" n={n} color={C.ink} size={32} />
                <OrbitalBoxes x={x} y={710} n={3} fill={hundFill(3, n)} w={34} h={42} gap={4} t={t + n * 2} arrowW={2.6} />
                <TermSVG x={x} y={770} m={pt[0]} L={pt[1]} J={pt[2]} odd={pt[3]} size={40} />
              </g>
            );
          })}
          <DrawPath d={`M${pX(1)},800 C${pX(1)},862 ${pX(5)},862 ${pX(5)},800`} p={pArc} stroke={C.cyan} width={4} />
          <g opacity={pArc}>
            <TermSVG x={pX(6) + 160} y={712} m="2" L="P" odd size={46} colored={false} color={C.cyan} anchor="start" />
            <Label x={pX(6) + 160} y={770} size={24} color={C.muted} anchor="start">
              p<tspan baselineShift="super" fontSize={15}>1</tspan> ↔ p<tspan baselineShift="super" fontSize={15}>5</tspan>
            </Label>
          </g>
        </g>
      </Stage>

      <Formula x={960} y={710} p={fJ} accent={C.mint} caption="elektron ↔ lubang: term sama, urutan J terbalik — J tetap dihitung">
        <V>d</V><Sup>2</Sup>: <Term m="3" L="F" J="2" /> &nbsp;↔&nbsp; <V>d</V><Sup>8</Sup>: <Term m="3" L="F" J="4" />
      </Formula>
    </AbsoluteFill>
  );
};
