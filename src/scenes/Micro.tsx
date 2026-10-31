import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Badge, Formula, Glow, Label, Stage, V} from '../components/primitives';
import {OrbitalBoxes, Term, TermSVG, type BoxFill} from '../components/grupB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 07: bukti mikrostatus p²: C(6,2) = 15 = 9 (³P) + 5 (¹D) + 1 (¹S).
const MLV = [1, 0, -1];
type Micro = {a: number; b: number; ML: number; MS: number; col: number; row: number; slotIdx: number; term: 'P' | 'D' | 'S'; pile: {x: number; y: number}};

const build = (): Micro[] => {
  const out: Micro[] = [];
  const seen: Record<string, number> = {};
  for (let a = 0; a < 6; a++)
    for (let b = a + 1; b < 6; b++) {
      const ML = MLV[a >> 1] + MLV[b >> 1];
      const MS = (a % 2 ? -0.5 : 0.5) + (b % 2 ? -0.5 : 0.5);
      const col = 2 - ML;
      const row = 1 - MS;
      const key = `${col},${row}`;
      const idx = seen[key] ?? 0;
      seen[key] = idx + 1;
      // tiap sel blok 3×3 menyerahkan satu ke ³P, baris M_S = 0 satu ke ¹D, sisanya (pusat) ke ¹S
      const inBlock = Math.abs(ML) <= 1;
      const rank = idx - (inBlock ? 1 : 0);
      const term: Micro['term'] = inBlock && idx === 0 ? 'P' : rank === 0 ? 'D' : 'S';
      const pile =
        term === 'P' ? {x: 1400 - ML * 48, y: 540 + (row - 1) * 48} : term === 'D' ? {x: 1590, y: 540 + (col - 2) * 48} : {x: 1750, y: 540};
      out.push({a, b, ML, MS, col, row, slotIdx: idx, term, pile});
    }
  return out;
};
const MICRO = build();
const CELL = {x0: 480, y0: 400, d: 140};
const cellXY = (col: number, row: number) => ({x: CELL.x0 + col * CELL.d, y: CELL.y0 + row * CELL.d});
const COUNT = [
  [0, 1, 1, 1, 0],
  [1, 2, 3, 2, 1],
  [0, 1, 1, 1, 0],
];
const dotOff = (n: number, i: number) => {
  if (n === 1) return {x: 0, y: 8};
  if (n === 2) return {x: (i - 0.5) * 46, y: 8};
  return {x: (i - 1) * 40, y: 8 + (i === 1 ? -14 : 10)};
};
const TERM_COL = {P: C.violet, D: C.gold, S: C.mint};
const fillOf = (m: {a: number; b: number}): BoxFill[] =>
  [0, 1, 2].map((bx) => [m.a === 2 * bx || m.b === 2 * bx ? 1 : 0, m.a === 2 * bx + 1 || m.b === 2 * bx + 1 ? 1 : 0]);
const GAL = (k: number) => ({x: 400 + (k % 5) * 230, y: 500 + Math.floor(k / 5) * 120});

export const Micro: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const s0 = slot(t, 0.2, cue(1), 0.7, 0.45);
  const six = slot(t, cue(1), cue(2) + 0.6, 0.6, 0.5);
  const tbl = ramp(t, cue(2) - 0.1, cue(2) + 0.7);
  const cF = slot(t, wordOf(1, 'belas') - 0.3, cue(2) + 0.4);
  const blockHi = ramp(t, wordOf(3, 'triplet') - 0.2, wordOf(3, 'triplet') + 0.5) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.3));
  const rowHi = ramp(t, wordOf(3, 'M-S') - 0.2, wordOf(3, 'M-S') + 0.4) * (1 - ramp(t, wordOf(3, 'triplet') - 0.2, wordOf(3, 'triplet') + 0.3));
  const cellHi = ramp(t, wordOf(3, 'M-L') - 0.2, wordOf(3, 'M-L') + 0.4) * (1 - ramp(t, wordOf(3, 'triplet') - 0.2, wordOf(3, 'triplet') + 0.3));
  const dRowHi = ramp(t, wordOf(4, 'dua') - 0.2, wordOf(4, 'dua') + 0.4) * (1 - ramp(t, wordOf(4, 'Tinggal') - 0.2, wordOf(4, 'Tinggal') + 0.3));
  const sHi = ramp(t, wordOf(4, 'Tinggal') - 0.2, wordOf(4, 'Tinggal') + 0.4) * (1 - ramp(t, cue(5) - 0.2, cue(5) + 0.3));
  const peelStart = {P: wordOf(3, 'sembilan'), D: wordOf(4, 'lima'), S: wordOf(4, 'singlet', 1)};
  const sum = ramp(t, cue(5) + 0.1, cue(5) + 0.8);
  const habis = ramp(t, wordOf(5, 'terbagi') - 0.2, wordOf(5, 'terbagi') + 0.5, BACK);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

  // baris 0: mikrostatus berganti-ganti (silang-pudar) di tiga kotak
  const per = 0.9;
  const si = Math.floor(Math.max(0, t) / per);
  const fr = ramp((Math.max(0, t) % per) / per, 0.72, 1, EASE_IN_OUT);
  const fa = fillOf(MICRO[si % 15]);
  const fb = fillOf(MICRO[(si + 1) % 15]);
  const f0: BoxFill[] = fa.map((f, i) => [mix(f[0], fb[i][0], fr), mix(f[1], fb[i][1], fr)]);

  // progres pengelupasan per mikrostatus
  const order: Record<string, number> = {P: 0, D: 0, S: 0};
  const peel = MICRO.map((m) => {
    const i = order[m.term]++;
    return ramp(t, peelStart[m.term] - 0.1 + i * 0.16, peelStart[m.term] + 0.7 + i * 0.16, EASE_IN_OUT);
  });
  const remaining = (col: number, row: number) => COUNT[row][col] - MICRO.reduce((s, m, k) => s + (m.col === col && m.row === row ? peel[k] : 0), 0);

  return (
    <AbsoluteFill>
      <Stage>
        {/* baris 0 */}
        <g opacity={s0}>
          <OrbitalBoxes x={960} y={660} n={3} fill={f0} w={130} h={130} t={t} labels={['+1', '0', '−1']} labelSize={24} />
          <Label x={960} y={540} size={28} color={C.muted}>
            dua elektron di subkulit p — berapa banyak cara?
          </Label>
        </g>

        {/* baris 1: enam spin-orbital */}
        <g opacity={six}>
          <OrbitalBoxes x={860} y={300} n={3} fill={[[0.35 + 0.25 * pulse, 0.35 + 0.25 * pulse], [0.35 + 0.25 * pulse, 0.35 + 0.25 * pulse], [0.35 + 0.25 * pulse, 0.35 + 0.25 * pulse]]} w={110} h={96} t={t} labels={['+1', '0', '−1']} labelSize={20} />
          <Label x={1150} y={300} size={30} color={C.ink} anchor="start" weight={600}>
            3 × 2 = 6 spin-orbital
          </Label>
        </g>
        {/* galeri 15 mikrostatus → terbang ke tabel */}
        {MICRO.map((m, k) => {
          const pin = ramp(t, cue(1) + 1.2 + k * 0.22, cue(1) + 1.6 + k * 0.22, BACK);
          const fly = ramp(t, cue(2) + 0.6 + k * 0.17, cue(2) + 1.5 + k * 0.17, EASE_IN_OUT);
          const g = GAL(k);
          const c = cellXY(m.col, m.row);
          const o = dotOff(COUNT[m.row][m.col], m.slotIdx);
          const dx = c.x + o.x;
          const dy = c.y + o.y;
          const pl = peel[k];
          const px = mix(dx, m.pile.x, pl);
          const py = mix(dy, m.pile.y, pl) - Math.sin(Math.PI * pl) * 50;
          const x = mix(g.x, px, fly);
          const y = mix(g.y, py, fly);
          const inBlock = m.term === 'P' ? blockHi : 0;
          const tint = Math.max(pl, inBlock, m.term === 'D' ? dRowHi : 0, m.term === 'S' ? sHi : 0);
          const col = interpolateColors(tint, [0, 1], [C.ink, TERM_COL[m.term]]);
          return (
            <g key={k}>
              <g opacity={pin * (1 - ramp(fly, 0, 0.5))} transform={`translate(${x} ${y}) scale(${1 - 0.6 * fly})`}>
                <OrbitalBoxes x={0} y={0} n={3} fill={fillOf(m)} w={48} h={52} t={t + k} arrowW={3} />
              </g>
              <circle cx={x} cy={y + Math.sin(t * 2.4 + k) * 3} r={13 + 2 * pl} fill={col} opacity={ramp(fly, 0.3, 1)} />
            </g>
          );
        })}

        {/* tabel M_L × M_S */}
        <g opacity={tbl}>
          {[2, 1, 0, -1, -2].map((ml, c) => (
            <Label key={ml} x={CELL.x0 + c * CELL.d} y={300} size={26} color={C.gold} font="mono">
              {ml > 0 ? `+${ml}` : ml < 0 ? `−${-ml}` : '0'}
            </Label>
          ))}
          <Label x={CELL.x0 + 2 * CELL.d} y={262} size={24} color={C.gold}>
            M
            <tspan baselineShift="sub" fontSize={16}>
              L
            </tspan>
          </Label>
          {[1, 0, -1].map((ms, r) => (
            <Label key={ms} x={380} y={CELL.y0 + r * CELL.d} size={26} color={C.violet} font="mono">
              {ms > 0 ? '+1' : ms < 0 ? '−1' : '0'}
            </Label>
          ))}
          <Label x={310} y={CELL.y0 + CELL.d} size={24} color={C.violet}>
            M
            <tspan baselineShift="sub" fontSize={16}>
              S
            </tspan>
          </Label>
          {COUNT.map((row, r) =>
            row.map((_, c) => {
              const {x, y} = cellXY(c, r);
              const rem = remaining(c, r);
              return (
                <g key={`${r}${c}`}>
                  <rect x={x - 64} y={y - 64} width={128} height={128} rx={12} fill="rgba(12,18,40,0.7)" stroke={C.faint} strokeWidth={2} />
                  {[0, 1, 2, 3].map((n) => {
                    const op = Math.max(0, 1 - Math.abs(rem - n));
                    return op > 0.01 ? (
                      <text key={n} x={x + 48} y={y - 42} textAnchor="end" dominantBaseline="central" fontFamily={FONT.mono} fontSize={26} fontWeight={600} fill={n === 0 ? C.faint : C.ink} opacity={op}>
                        {n}
                      </text>
                    ) : null;
                  })}
                </g>
              );
            }),
          )}
          {/* sorotan */}
          <rect x={CELL.x0 - 70} y={CELL.y0 - 70} width={5 * CELL.d} height={140} rx={16} fill="none" stroke={C.violet} strokeWidth={4} opacity={rowHi} />
          <rect x={CELL.x0 + CELL.d - 70} y={CELL.y0 - 70} width={140} height={140} rx={16} fill={C.violet} fillOpacity={0.12} stroke={C.violet} strokeWidth={5} opacity={cellHi} />
          <rect x={CELL.x0 + CELL.d - 72} y={CELL.y0 - 72} width={3 * CELL.d + 4} height={3 * CELL.d + 4} rx={18} fill={C.violet} fillOpacity={0.08} stroke={C.violet} strokeWidth={5} opacity={blockHi * (0.7 + 0.3 * pulse)} />
          <rect x={CELL.x0 - 70} y={CELL.y0 + CELL.d - 70} width={5 * CELL.d} height={140} rx={16} fill={C.gold} fillOpacity={0.08} stroke={C.gold} strokeWidth={5} opacity={dRowHi * (0.7 + 0.3 * pulse)} />
          <rect x={CELL.x0 + 2 * CELL.d - 70} y={CELL.y0 + CELL.d - 70} width={140} height={140} rx={16} fill={C.mint} fillOpacity={0.1} stroke={C.mint} strokeWidth={5} opacity={sHi * (0.7 + 0.3 * pulse)} />
        </g>

        {/* tumpukan term */}
        {(['P', 'D', 'S'] as const).map((tm) => {
          const x = tm === 'P' ? 1400 : tm === 'D' ? 1590 : 1750;
          const n = tm === 'P' ? 9 : tm === 'D' ? 5 : 1;
          const p = ramp(t, peelStart[tm] - 0.4, peelStart[tm] + 0.2);
          const done = ramp(t, peelStart[tm] + 0.7 + (n - 1) * 0.16, peelStart[tm] + 1.2 + (n - 1) * 0.16);
          return (
            <g key={tm} opacity={p}>
              <Glow x={x} y={540} r={tm === 'P' ? 130 : 90} color={tm === 'P' ? 'violet' : tm === 'D' ? 'gold' : 'mint'} opacity={0.3 * done + 0.25 * sum * pulse} />
              <TermSVG x={x} y={380} m={tm === 'P' ? '3' : '1'} L={tm} size={54} colored={false} color={TERM_COL[tm]} />
              <Label x={x} y={700} size={32} color={TERM_COL[tm]} font="mono" weight={600} opacity={done}>
                {n}
              </Label>
            </g>
          );
        })}
      </Stage>

      <Formula x={960} y={350} p={s0} accent={C.violet} caption="dari mana tiga term ini? Hitung!">
        <V>p</V>² → <Term m="3" L="P" /> + <Term m="1" L="D" /> + <Term m="1" L="S" /> ?
      </Formula>
      <Formula x={1630} y={620} p={cF} accent={C.cyan} caption="mikrostatus">
        C(6, 2) = 15
      </Formula>
      <Formula x={760} y={830} p={sum} accent={C.mint} size={56}>
        <span style={{color: C.violet}}>9</span> + <span style={{color: C.gold}}>5</span> + <span style={{color: C.mint}}>1</span> = 15
      </Formula>
      <Badge x={1580} y={830} text="TERBAGI HABIS ✓" color={C.mint} opacity={habis} scale={0.9 + 0.1 * habis} />
    </AbsoluteFill>
  );
};
