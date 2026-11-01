import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Badge, Card, Formula, Label, Stage, V} from '../components/primitives';
import {Electron} from '../components/viz';
import {SpinArrow, Term, TermSVG, Vec} from '../components/grupB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 05: kopling Russell–Saunders (LS): l → L, s → S, L + S → J; ³P → J = 0, 1, 2; 1 + 3 + 5 = 9 = 3 × 3.
const LIGHT_GOLD = '#ffe2a3';

/** Proyeksi 3D sederhana: z ke atas layar, y ke dalam (miring 0,32). */
const proj = (o: {x: number; y: number}, v: [number, number, number]) => ({x: o.x + v[0], y: o.y - v[2] + 0.32 * v[1]});

const Sub2: React.FC<{base: string; sub: string; x: number; y: number; color: string; size?: number; opacity?: number}> = ({base, sub, x, y, color, size = 34, opacity = 1}) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    dominantBaseline="central"
    fontFamily={FONT.serif}
    fontStyle="italic"
    fontSize={size}
    fill={color}
    opacity={opacity}
    style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: size * 0.1}}
  >
    {base}
    <tspan baselineShift="sub" fontSize={size * 0.62} fontStyle="normal">
      {sub}
    </tspan>
  </text>
);

export const Coupling: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const s0 = slot(t, 0.2, cue(1) + 0.1, 0.7, 0.45);
  const s1 = slot(t, cue(1) + 0.1, cue(3), 0.6, 0.45);
  const ab = 1 - ramp(t, cue(2) - 0.2, cue(2) + 0.5, EASE_IN_OUT); // panel l dan s menghilang di baris 2
  const pl = ramp(t, cue(1) + 0.3, cue(1) + 1.0, BACK);
  const pL = ramp(t, wordOf(1, 'menjadi', 0) - 0.2, wordOf(1, 'menjadi', 0) + 0.6, BACK);
  const ps = ramp(t, wordOf(1, 'spinnya') - 0.2, wordOf(1, 'spinnya') + 0.5, BACK);
  const pS = ramp(t, wordOf(1, 'menjadi', 1) - 0.2, wordOf(1, 'menjadi', 1) + 0.6, BACK);
  const pJ = ramp(t, wordOf(1, 'digabung') - 0.2, wordOf(1, 'digabung') + 0.7, BACK);
  const fJ = slot(t, wordOf(2, 'berjenjang') - 0.4, cue(3));
  const s3 = slot(t, cue(3) + 0.1, cue(4), 0.6, 0.4);
  const jAt = [wordOf(3, 'nol'), wordOf(3, 'satu', 2), wordOf(3, 'dua')];
  const s4 = ramp(t, cue(4) + 0.1, cue(4) + 0.7);
  const gAt = [wordOf(4, 'satu'), wordOf(4, 'tiga', 0), wordOf(4, 'lima')];
  const toGrid = ramp(t, wordOf(4, 'kali') - 0.3, wordOf(4, 'kali') + 1.3, EASE_IN_OUT);
  const t5 = t - cue(5);
  const pp = t5 > 0 ? 0.5 + 0.5 * Math.cos((2 * Math.PI * t5) / 5) : 1; // bolak-balik: kisi ↔ kelompok J
  const grid = t5 > 0 ? pp : toGrid;
  const ph = t * 1.4;

  // panel C: L dan S berpresesi mengelilingi J
  const OC = {x: 1540, y: 800};
  const J3: [number, number, number] = [0, 0, 330];
  const Lv: [number, number, number] = [94 * Math.cos(ph), 94 * Math.sin(ph), 194];
  const Lp = proj(OC, Lv);
  const Jp = proj(OC, J3);
  const coneC = proj(OC, [0, 0, 194]);

  return (
    <AbsoluteFill>
      <Stage>
        {/* baris 0: atom ringan, dua elektron mengorbit */}
        <g opacity={s0}>
          <circle cx={960} cy={520} r={70} fill="url(#soft-red)" opacity={0.5} />
          <circle cx={960} cy={520} r={26} fill={C.red} />
          {[0, 1].map((k) => {
            const a = t * (1.1 + 0.25 * k) + k * 2.6;
            const rx = k ? 300 : 210;
            const ry = k ? 110 : 150;
            const rot = k ? -18 : 24;
            const cr = Math.cos((rot * Math.PI) / 180);
            const sr = Math.sin((rot * Math.PI) / 180);
            const ex = rx * Math.cos(a);
            const ey = ry * Math.sin(a);
            const x = 960 + ex * cr - ey * sr;
            const y = 520 + ex * sr + ey * cr;
            return (
              <g key={k}>
                <ellipse cx={960} cy={520} rx={rx} ry={ry} transform={`rotate(${rot} 960 520)`} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="6 8" />
                <Electron x={x} y={y} r={16} />
                <SpinArrow x={x + 34} y={y} up={k === 0} len={46} width={4} />
              </g>
            );
          })}
          <Label x={960} y={300} size={30} color={C.muted}>
            atom ringan: gerak orbital & spin tiap elektron
          </Label>
        </g>
        {/* baris 1: penjumlahan vektor */}
        <g opacity={s1}>
          <g opacity={ab}>
            <Label x={380} y={300} size={30} color={C.gold} weight={700}>
              orbital → L
            </Label>
            {(() => {
              const o = {x: 250, y: 780};
              const w = 0.08 * Math.sin(t * 1.3);
              const a1 = -1.05 + w;
              const a2 = -0.35 - w;
              const p1 = {x: o.x + 210 * Math.cos(a1), y: o.y + 210 * Math.sin(a1)};
              const p2 = {x: p1.x + 190 * Math.cos(a2), y: p1.y + 190 * Math.sin(a2)};
              return (
                <g>
                  <Vec x1={o.x} y1={o.y} x2={mix(o.x, p1.x, pl)} y2={mix(o.y, p1.y, pl)} color={LIGHT_GOLD} width={5} />
                  <Vec x1={p1.x} y1={p1.y} x2={mix(p1.x, p2.x, pl)} y2={mix(p1.y, p2.y, pl)} color={LIGHT_GOLD} width={5} opacity={pl} />
                  <Sub2 base="l" sub="1" x={(o.x + p1.x) / 2 - 34} y={(o.y + p1.y) / 2 - 10} color={LIGHT_GOLD} opacity={pl} />
                  <Sub2 base="l" sub="2" x={(p1.x + p2.x) / 2} y={(p1.y + p2.y) / 2 - 36} color={LIGHT_GOLD} opacity={pl} />
                  <Vec x1={o.x} y1={o.y} x2={mix(o.x, p2.x, pL)} y2={mix(o.y, p2.y, pL)} color={C.gold} width={9} opacity={pL} />
                  <Label x={(o.x + p2.x) / 2 + 30} y={(o.y + p2.y) / 2 + 40} size={44} color={C.gold} font="serif" italic weight={600} opacity={pL}>
                    L
                  </Label>
                </g>
              );
            })()}
          </g>
          <g opacity={ab * ps}>
            <Label x={960} y={300} size={30} color={C.violet} weight={700}>
              spin → S
            </Label>
            {(() => {
              const o = {x: 920, y: 800};
              const w = 0.1 * Math.sin(t * 1.7);
              const p1 = {x: o.x + 200 * Math.sin(0.25 + w), y: o.y - 200 * Math.cos(0.25 + w)};
              const p2 = {x: p1.x + 200 * Math.sin(-0.05 - w), y: p1.y - 200 * Math.cos(-0.05 - w)};
              return (
                <g>
                  <Vec x1={o.x} y1={o.y} x2={p1.x} y2={p1.y} color={C.cyan} width={5} />
                  <Vec x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} color={C.cyan} width={5} />
                  <Sub2 base="s" sub="1" x={o.x + 50} y={(o.y + p1.y) / 2 + 10} color={C.cyan} />
                  <Sub2 base="s" sub="2" x={p1.x + 50} y={(p1.y + p2.y) / 2} color={C.cyan} />
                  <Vec x1={o.x - 70} y1={o.y} x2={mix(o.x - 70, p2.x - 70, pS)} y2={mix(o.y, p2.y, pS)} color={C.violet} width={9} opacity={pS} />
                  <Label x={o.x - 110} y={(o.y + p2.y) / 2} size={44} color={C.violet} font="serif" italic weight={600} opacity={pS}>
                    S
                  </Label>
                </g>
              );
            })()}
          </g>
          <g opacity={pJ}>
            <Label x={1540} y={300} size={30} color={C.mint} weight={700}>
              L + S → J
            </Label>
            <ellipse cx={coneC.x} cy={coneC.y} rx={94} ry={94 * 0.32} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="5 6" />
            <Vec x1={OC.x} y1={OC.y} x2={Jp.x} y2={Jp.y} color={C.mint} width={9} />
            <Vec x1={OC.x} y1={OC.y} x2={Lp.x} y2={Lp.y} color={C.gold} width={7} />
            <Vec x1={Lp.x} y1={Lp.y} x2={Jp.x} y2={Jp.y} color={C.violet} width={7} />
            <Label x={Lp.x + (Lp.x >= OC.x ? 34 : -34)} y={Lp.y + 46} size={36} color={C.gold} font="serif" italic>
              L
            </Label>
            <Label x={(Lp.x + Jp.x) / 2 + (Lp.x >= OC.x ? 34 : -34)} y={(Lp.y + Jp.y) / 2 - 6} size={36} color={C.violet} font="serif" italic>
              S
            </Label>
            <Label x={Jp.x + 46} y={Jp.y + 4} size={44} color={C.mint} font="serif" italic weight={600}>
              J
            </Label>
            <Label x={1540} y={850} size={26} color={C.muted}>
              L dan S berpresesi mengelilingi J
            </Label>
          </g>
        </g>

        {/* baris 3: ³P → J = 0, 1, 2 (model vektor, panjang √(x(x+1))) */}
        <g opacity={s3}>
          {[0, 1, 2].map((j, i) => {
            const k = 140;
            const O = {x: 520 + i * 440, y: 710};
            const p = ramp(t, jAt[i] - 0.25, jAt[i] + 0.5, BACK);
            const Lm = k * Math.SQRT2;
            const Jm = k * Math.sqrt(j * (j + 1));
            const a = ph * (0.9 + 0.15 * i) + i;
            let Lv3: [number, number, number];
            if (j === 0) {
              // J = 0: L dan S antiparalel, arah bebas
              Lv3 = [Lm * 0.9 * Math.cos(a), Lm * 0.9 * Math.sin(a), Lm * 0.43];
            } else {
              const ca = Jm / (2 * Lm);
              const sa = Math.sqrt(1 - ca * ca);
              Lv3 = [Lm * sa * Math.cos(a), Lm * sa * Math.sin(a), Lm * ca];
            }
            const base = j === 0 ? {x: O.x, y: O.y - 150} : O;
            const L2 = proj(base, Lv3);
            const J2 = proj(base, [0, 0, Jm]);
            return (
              <g key={j} opacity={0.2 + 0.8 * p}>
                {j > 0 ? <Vec x1={base.x} y1={base.y} x2={J2.x} y2={J2.y} color={C.mint} width={9} /> : <circle cx={base.x} cy={base.y} r={12 + 3 * Math.sin(t * 3)} fill={C.mint} />}
                <Vec x1={base.x} y1={base.y} x2={L2.x} y2={L2.y} color={C.gold} width={6} />
                <Vec x1={L2.x} y1={L2.y} x2={J2.x} y2={J2.y} color={C.violet} width={6} />
                <Label x={O.x} y={770} size={36} color={C.mint} weight={700} font="serif" italic>
                  J = {j}
                </Label>
                <TermSVG x={O.x} y={832} m="3" L="P" J={String(j)} size={50} />
              </g>
            );
          })}
          <Label x={300} y={480} size={24} color={C.gold} anchor="start">
            ■ L
          </Label>
          <Label x={300} y={516} size={24} color={C.violet} anchor="start">
            ■ S
          </Label>
          <Label x={300} y={552} size={24} color={C.mint} anchor="start">
            ■ J
          </Label>
        </g>

        {/* baris 4–5: 1 + 3 + 5 = 9 = 3 × 3 */}
        <g opacity={s4}>
          {Array.from({length: 9}, (_, k) => {
            const grp = k === 0 ? 0 : k < 4 ? 1 : 2;
            const idx = k === 0 ? 0 : k < 4 ? k - 1 : k - 4;
            const n = [1, 3, 5][grp];
            const cx = [480, 820, 1300][grp];
            const ax = cx + (idx - (n - 1) / 2) * 100;
            const ay = 600;
            const gx = 960 + ((k % 3) - 1) * 100;
            const gy = 600 + (Math.floor(k / 3) - 1) * 100;
            const pIn = ramp(t, gAt[grp] - 0.2 + idx * 0.08, gAt[grp] + 0.3 + idx * 0.08, BACK);
            const arc = Math.sin(Math.PI * grid) * (k % 2 ? -40 : 40);
            const x = mix(ax, gx, grid);
            const y = mix(ay, gy, grid) + arc;
            const colJ = [C.mint, '#3cc58b', '#2a9e6e'][grp];
            const colG = interpolateColors(Math.floor(k / 3), [0, 1, 2], [C.cyan, C.violet, C.pink]);
            const col = interpolateColors(grid, [0, 1], [colJ, colG]);
            return (
              <g key={k} opacity={pIn} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * pIn})`}>
                <rect x={-40} y={-40} width={80} height={80} rx={12} fill={col} fillOpacity={0.28} stroke={col} strokeWidth={3} />
                <circle cx={0} cy={4 * Math.sin(t * 2.5 + k)} r={11} fill={col} />
              </g>
            );
          })}
          {/* label kelompok J */}
          {[0, 1, 2].map((g) => (
            <g key={g} opacity={(1 - grid) * ramp(t, gAt[g], gAt[g] + 0.5)}>
              <Label x={[480, 820, 1300][g]} y={700} size={34} color={C.mint} font="serif" italic weight={600}>
                J = {g}
              </Label>
              <Label x={[480, 820, 1300][g]} y={744} size={26} color={C.muted}>
                {[1, 3, 5][g]} keadaan (2J + 1)
              </Label>
            </g>
          ))}
          {/* label kisi M_L × M_S */}
          <g opacity={grid}>
            {['+1', '0', '−1'].map((m, i) => (
              <Label key={`l${m}`} x={860 + i * 100} y={428} size={24} color={C.gold} font="mono">
                {m}
              </Label>
            ))}
            {['+1', '0', '−1'].map((m, i) => (
              <Label key={`s${m}`} x={796} y={500 + i * 100} size={24} color={C.violet} font="mono" anchor="end">
                {m}
              </Label>
            ))}
            <Label x={1115} y={428} size={26} color={C.gold} anchor="start">
              M
              <tspan baselineShift="sub" fontSize={16}>
                L
              </tspan>
              
            </Label>
            <Label x={730} y={600} size={26} color={C.violet} anchor="end">
              M
              <tspan baselineShift="sub" fontSize={16}>
                S
              </tspan>
            </Label>
          </g>
        </g>
      </Stage>

      <Formula x={760} y={540} p={fJ} accent={C.mint} caption="naik satu-satu dari selisih sampai jumlah">
        <V color={C.mint}>J</V> = |<V color={C.gold}>L</V> − <V color={C.violet}>S</V>|, …, <V color={C.gold}>L</V> + <V color={C.violet}>S</V>
      </Formula>
      <Formula x={960} y={275} p={s3} accent={C.violet}>
        <Term m="3" L="P" />: <V color={C.gold}>L</V> = 1, <V color={C.violet}>S</V> = 1 → <V color={C.mint}>J</V> = 0, 1, 2
      </Formula>
      <Formula x={960} y={330} p={s4 * ramp(t, gAt[0] - 0.3, gAt[0] + 0.3)} accent={C.mint}>
        1 + 3 + 5 = 9 = 3 × 3
      </Formula>
      <Badge x={960} y={800} text="KOPLING LS · RUSSELL–SAUNDERS" color={C.gold} opacity={s0 * ramp(t, wordOf(0, 'kopling', 0) - 0.2, wordOf(0, 'kopling', 0) + 0.5)} />
      <Card x={960} y={820} plain opacity={ramp(t, cue(5), cue(5) + 0.7)}>
        <div style={{fontSize: 30, color: C.ink}}>
          9 keadaan tetap 9 — hanya <span style={{color: C.mint, fontWeight: 700}}>dikelompokkan ulang</span> menurut <V color={C.mint}>J</V>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
