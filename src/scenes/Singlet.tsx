import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Frac, Label, Sqrt, Stage, Sub, V} from '../components/primitives';
import {SpinUD, SpinVec} from '../components/grupA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 3: dua spin ½ → S = 0 (singlet, 1 keadaan) atau S = 1 (triplet, 3 keadaan);
// αβ saja = campuran; angka 1 dan 3 menjadi multiplisitas di pojok kiri atas simbol term.

const A: React.FC = () => <span style={{color: C.cyan, fontFamily: FONT.serif, fontStyle: 'italic'}}>α</span>;
const B: React.FC = () => <span style={{color: C.pink, fontFamily: FONT.serif, fontStyle: 'italic'}}>β</span>;

const SX = 250; // kolom singlet
const TX = 1050; // kolom triplet
const ROWS = [500, 615, 730]; // M_S = +1, 0, −1
const HY = 395;

/** Rumus keadaan kecil (HTML) di sebelah kanan pasangan panah. */
const StateF: React.FC<{x: number; y: number; p: number; children: React.ReactNode}> = ({x, y, p, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(${(1 - p) * -14}px, -50%)`,
      opacity: p,
      fontFamily: FONT.serif,
      fontSize: 42,
      color: C.ink,
      whiteSpace: 'nowrap',
      textAlign: 'left',
    }}
  >
    {children}
  </div>
);

/** Pasangan panah; mode 'mix' bersilang-pudar ↑↓ ⇄ ↓↑ (superposisi). */
const Pair: React.FC<{x: number; y: number; kind: 'uu' | 'dd' | 'mix' | 'ud'; t: number; opacity: number}> = ({x, y, kind, t, opacity}) => {
  const b = (k: number) => 4 * Math.sin(t * 2.3 + k + y * 0.01);
  if (kind === 'mix') {
    const w = 0.5 + 0.5 * Math.sin(t * 2.2);
    return (
      <g opacity={opacity}>
        <g opacity={w}>
          <SpinUD x={x} y={y + b(0)} up len={58} width={5} />
          <SpinUD x={x + 36} y={y + b(1)} up={false} len={58} width={5} />
        </g>
        <g opacity={1 - w}>
          <SpinUD x={x} y={y + b(0)} up={false} len={58} width={5} />
          <SpinUD x={x + 36} y={y + b(1)} up len={58} width={5} />
        </g>
      </g>
    );
  }
  return (
    <g opacity={opacity}>
      <SpinUD x={x} y={y + b(0)} up={kind !== 'dd'} len={58} width={5} />
      <SpinUD x={x + 36} y={y + b(1)} up={kind === 'uu'} len={58} width={5} />
    </g>
  );
};

export const Singlet: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // baris 0: penjumlahan dua vektor spin
  const g0 = slot(t, -0.3, cue(1) + 0.1, 0.6, 0.45);
  const v0 = ramp(t, wordOf(0, 'nol') - 0.4, wordOf(0, 'nol') + 0.6, BACK);
  const v1 = ramp(t, wordOf(0, 'satu') - 0.4, wordOf(0, 'satu') + 0.6, BACK);
  const intro = ramp(t, cue(0) - 0.2, cue(0) + 0.8);
  const join = ramp(t, wordOf(0, 'bergabung') - 0.3, wordOf(0, 'bergabung') + 1.0, EASE_IN_OUT);

  // baris 1–4: diagram singlet / triplet
  const cols = ramp(t, cue(1) - 0.1, cue(1) + 0.6) * (1 - ramp(t, cue(5) + 0.2, cue(5) + 1.0, EASE_IN_OUT));
  const hS = ramp(t, wordOf(1, 'singlet') - 0.4, wordOf(1, 'singlet') + 0.4, BACK);
  const hT = ramp(t, wordOf(1, 'triplet') - 0.4, wordOf(1, 'triplet') + 0.4, BACK);
  const slotS = ramp(t, wordOf(1, 'satu', 0) - 0.3, wordOf(1, 'satu', 0) + 0.5);
  const slotT = ramp(t, wordOf(1, 'tiga') - 0.3, wordOf(1, 'tiga') + 0.5);
  const uu = ramp(t, wordOf(2, 'naik', 0) - 0.3, wordOf(2, 'naik', 0) + 0.5);
  const dd = ramp(t, wordOf(2, 'turun', 0) - 0.3, wordOf(2, 'turun', 0) + 0.5);
  const t0 = ramp(t, wordOf(2, 'plus') - 0.5, wordOf(2, 'plus') + 0.4);
  const s0 = ramp(t, wordOf(3, 'minus') - 0.5, wordOf(3, 'minus') + 0.4);
  const triGlow = ramp(t, cue(2), cue(2) + 0.5) * (1 - ramp(t, cue(3), cue(3) + 0.5));
  const sinGlow = ramp(t, cue(3), cue(3) + 0.5) * (1 - ramp(t, cue(4), cue(4) + 0.5));

  // baris 4: αβ saja = campuran
  const warn = slot(t, cue(4) - 0.05, cue(5) + 0.05);
  const ab = ramp(t, wordOf(4, 'Naik-turun') - 0.4, wordOf(4, 'Naik-turun') + 0.4, BACK) * (1 - ramp(t, cue(5) - 0.3, cue(5) + 0.3, EASE_IN_OUT));
  const split = ramp(t, wordOf(4, 'campuran') - 0.5, wordOf(4, 'campuran') + 0.8, EASE_IN_OUT);

  // baris 5: angka 1 dan 3 terbang ke simbol term
  const fly = ramp(t, cue(5) + 0.2, wordOf(5, 'multiplisitas') + 0.2, EASE_IN_OUT);
  const letters = ramp(t, cue(5) + 0.1, cue(5) + 0.9);
  const multi = ramp(t, wordOf(5, 'multiplisitas') - 0.2, wordOf(5, 'multiplisitas') + 0.6, BACK);
  const N1 = {x: mix(SX + 26, 690, fly), y: mix(HY, 520, fly), s: mix(84, 110, fly)};
  const N3 = {x: mix(TX + 26, 1150, fly), y: mix(HY, 520, fly), s: mix(84, 110, fly)};

  // vektor yang berpresesi (baris 0)
  const ph = t * 1.8;
  const VC0 = {x: 640, y: 600};
  const VC1 = {x: 1280, y: 600};
  const L = 165;

  return (
    <AbsoluteFill>
      <Stage>
        {/* ---------- baris 0: ½ + ½ ---------- */}
        <g opacity={g0}>
          {/* dua spin terpisah yang mendekat ke dua kemungkinan */}
          <g opacity={intro * (1 - join)}>
            <SpinUD x={860} y={600} up len={130} />
            <SpinUD x={1060} y={600} up={false} len={130} />
            <Label x={960} y={760} size={28} color={C.muted}>
              dua spin ½
            </Label>
          </g>
          <g opacity={join}>
            {/* S = 0: berlawanan, saling meniadakan */}
            <g opacity={0.35 + 0.65 * v0}>
              <SpinVec x1={VC0.x - 24} y1={VC0.y} x2={VC0.x - 24 + 40 * Math.cos(ph)} y2={VC0.y - L} color={C.cyan} width={6} />
              <SpinVec x1={VC0.x + 24} y1={VC0.y} x2={VC0.x + 24 - 40 * Math.cos(ph)} y2={VC0.y + L} color={C.pink} width={6} />
              <circle cx={VC0.x} cy={VC0.y} r={10} fill={C.violet} />
              <Label x={VC0.x} y={VC0.y + 225} size={44} color={C.violet} font="serif" italic weight={600} opacity={v0}>
                S = 0
              </Label>
            </g>
            {/* S = 1: sejajar, menjumlah */}
            <g opacity={0.35 + 0.65 * v1}>
              <SpinVec x1={VC1.x - 24} y1={VC1.y + 60} x2={VC1.x - 24 + 40 * Math.cos(ph)} y2={VC1.y + 60 - L} color={C.cyan} width={6} />
              <SpinVec x1={VC1.x + 24} y1={VC1.y + 60} x2={VC1.x + 24 + 40 * Math.cos(ph)} y2={VC1.y + 60 - L} color={C.cyan} width={6} />
              <SpinVec x1={VC1.x + 80} y1={VC1.y + 120} x2={VC1.x + 80 + 60 * Math.cos(ph) * v1} y2={VC1.y + 120 - 330 * v1} color={C.violet} width={8} opacity={v1} />
              <Label x={VC1.x} y={VC1.y + 225} size={44} color={C.violet} font="serif" italic weight={600} opacity={v1}>
                S = 1
              </Label>
            </g>
          </g>
        </g>

        {/* ---------- baris 1–4: kolom singlet & triplet ---------- */}
        <g opacity={cols}>
          {/* kepala kolom */}
          <g opacity={hS}>
            <text x={SX + 90} y={HY - 16} fontFamily={FONT.sans} fontSize={34} fontWeight={700} fill={C.violet} dominantBaseline="central">
              singlet
            </text>
            <text x={SX + 90} y={HY + 24} fontFamily={FONT.serif} fontStyle="italic" fontSize={28} fill={C.muted} dominantBaseline="central">
              S = 0 · 1 keadaan
            </text>
          </g>
          <g opacity={hT}>
            <text x={TX + 90} y={HY - 16} fontFamily={FONT.sans} fontSize={34} fontWeight={700} fill={C.violet} dominantBaseline="central">
              triplet
            </text>
            <text x={TX + 90} y={HY + 24} fontFamily={FONT.serif} fontStyle="italic" fontSize={28} fill={C.muted} dominantBaseline="central">
              S = 1 · 3 keadaan
            </text>
          </g>
          <rect x={SX - 20} y={430} width={600} height={2} fill={C.faint} opacity={hS} />
          <rect x={TX - 20} y={430} width={680} height={2} fill={C.faint} opacity={hT} />
          {/* sorotan kolom aktif */}
          <rect x={TX - 30} y={445} width={700} height={340} rx={20} fill={C.violet} opacity={0.07 * triGlow} />
          <rect x={SX - 30} y={555} width={620} height={120} rx={20} fill={C.violet} opacity={0.08 * sinGlow} />
          {/* baris-baris keadaan */}
          {ROWS.map((y, k) => (
            <g key={k} opacity={slotT}>
              <text x={TX} y={y} fontFamily={FONT.mono} fontSize={26} fill={C.muted} dominantBaseline="central">
                {['Mₛ = +1', 'Mₛ =  0', 'Mₛ = −1'][k]}
              </text>
              <rect x={TX + 160} y={y - 40} width={92} height={80} rx={12} fill="rgba(12,18,40,0.8)" stroke={C.violet} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 6" />
            </g>
          ))}
          <g opacity={slotS}>
            <text x={SX} y={ROWS[1]} fontFamily={FONT.mono} fontSize={26} fill={C.muted} dominantBaseline="central">
              Mₛ =  0
            </text>
            <rect x={SX + 160} y={ROWS[1] - 40} width={92} height={80} rx={12} fill="rgba(12,18,40,0.8)" stroke={C.violet} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 6" />
          </g>
          <Pair x={TX + 188} y={ROWS[0]} kind="uu" t={t} opacity={uu} />
          <Pair x={TX + 188} y={ROWS[2]} kind="dd" t={t} opacity={dd} />
          <Pair x={TX + 188} y={ROWS[1]} kind="mix" t={t} opacity={t0} />
          <Pair x={SX + 188} y={ROWS[1]} kind="mix" t={t + 1.4} opacity={s0} />
        </g>
        {/* αβ saja: terbelah ke dua kolom */}
        <g opacity={ab}>
          <Pair x={897} y={800} kind="ud" t={t} opacity={1} />
          <Label x={915} y={862} size={26} color={C.ink} weight={600}>
            αβ saja
          </Label>
          {[
            {x: SX + 330, y: ROWS[1] + 70},
            {x: TX + 130, y: ROWS[1] + 30},
          ].map((d, k) => (
            <path
              key={k}
              d={`M${915 + (k ? 40 : -40)},800 Q${k ? 1000 : 830},${k ? 640 : 700} ${d.x},${d.y}`}
              fill="none"
              stroke={C.violet}
              strokeWidth={3}
              strokeDasharray="8 8"
              strokeDashoffset={-t * 30}
              opacity={0.85 * split}
            />
          ))}
        </g>

        {/* ---------- baris 5: angka → multiplisitas ---------- */}
        <g opacity={letters}>
          {[
            {x: 800, L: 'D'},
            {x: 1260, L: 'P'},
          ].map((s) => (
            <text key={s.L} x={s.x} y={600} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontSize={220} fill={C.gold}>
              {s.L}
            </text>
          ))}
          <Label x={790} y={755} size={28} color={C.muted}>
            singlet · S = 0
          </Label>
          <Label x={1250} y={755} size={28} color={C.muted}>
            triplet · S = 1
          </Label>
          <Label x={1020} y={830} size={36} color={C.violet} weight={700} opacity={multi}>
            multiplisitas = 2S + 1
          </Label>
          {[690, 1150].map((x) => (
            <circle key={x} cx={x} cy={520} r={70 + 6 * Math.sin(t * 3)} fill="none" stroke={C.violet} strokeWidth={3} strokeDasharray="6 8" opacity={0.7 * multi} />
          ))}
        </g>
        {/* angka 1 & 3 (violet = multiplisitas) */}
        <g opacity={hS}>
          <text x={N1.x} y={N1.y} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontWeight={600} fontSize={N1.s} fill={C.violet}>
            1
          </text>
        </g>
        <g opacity={hT}>
          <text x={N3.x} y={N3.y} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontWeight={600} fontSize={N3.s} fill={C.violet}>
            3
          </text>
        </g>
      </Stage>

      {/* rumus keadaan */}
      <div style={{opacity: cols}}>
        <StateF x={TX + 290} y={ROWS[0]} p={uu}>
          <A />
          <A />
        </StateF>
        <StateF x={TX + 290} y={ROWS[2]} p={dd}>
          <B />
          <B />
        </StateF>
        <StateF x={TX + 290} y={ROWS[1]} p={t0}>
          <Frac
            n={
              <>
                <A />
                <B />
                &nbsp;<span style={{color: C.mint}}>+</span>&nbsp;
                <B />
                <A />
              </>
            }
            d={<Sqrt>2</Sqrt>}
            size={0.8}
          />
        </StateF>
        <StateF x={SX + 290} y={ROWS[1]} p={s0}>
          <Frac
            n={
              <>
                <A />
                <B />
                &nbsp;<span style={{color: C.red}}>−</span>&nbsp;
                <B />
                <A />
              </>
            }
            d={<Sqrt>2</Sqrt>}
            size={0.8}
          />
        </StateF>
      </div>

      <Formula x={960} y={250} p={slot(t, cue(0) - 0.1, cue(1) - 0.05)} accent={C.violet} caption="dua spin setengah: hanya dua kemungkinan">
        <Frac n="1" d="2" />
        &nbsp;+&nbsp;
        <Frac n="1" d="2" />
        &nbsp;→&nbsp;
        <V color={C.violet}>S</V>&nbsp;=&nbsp;0&nbsp;
        <span style={{fontFamily: FONT.sans, fontSize: '0.5em', color: C.muted}}>atau</span>
        &nbsp;1
      </Formula>
      <Formula x={960} y={265} p={warn} accent={C.red} size={56} caption="hati-hati: dua spin berlawanan belum tentu singlet — ini campuran">
        <A />
        <B />
        &nbsp;=&nbsp;
        <Frac n="1" d={<Sqrt>2</Sqrt>} />
        (&thinsp;<V>Ψ</V>
        <Sub>triplet</Sub>
        &nbsp;+&nbsp;<V>Ψ</V>
        <Sub>singlet</Sub>&thinsp;)
      </Formula>
    </AbsoluteFill>
  );
};
