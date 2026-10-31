import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Frac, Label, Stage, Sup} from '../components/primitives';
import {BoxRow, SpinArr, TermHtml, TermSvg, type Term} from '../components/grupC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 10: Cr 3d⁵4s¹ → ⁷S₃; Mn 3d⁵4s² → ⁶S₅/₂; Fe 3d⁶4s² ⁵D₄ → Fe³⁺ 3d⁵ ⁶S₅/₂ = Mn²⁺ (AUDIT).
const BOX = 104;
const G = 8;
const RX = 300; // kiri baris kotak
const dX = (i: number) => RX + i * (BOX + G) + BOX / 2;
const sX = RX + 5 * (BOX + G) + 44 + BOX / 2;
const ROW_W = 5 * (BOX + G) + 44 + BOX;
const Y1 = 430;
const Y2 = 720;
const T_CR: Term = {m: '7', L: 'S', J: '3'};
const T_MN: Term = {m: '6', L: 'S', J: '5/2'};
const T_FE: Term = {m: '5', L: 'D', J: '4'};

/** Satu baris konfigurasi: 5 kotak 3d + 1 kotak 4s. */
const Row: React.FC<{y: number; opacity: number; stroke?: string; glow?: number}> = ({y, opacity, stroke, glow = 0}) => (
  <g opacity={opacity}>
    <BoxRow x={RX} y={y} n={5} box={BOX} gap={G} stroke={stroke} glow={glow} />
    <BoxRow x={RX + 5 * (BOX + G) + 44} y={y} n={1} box={BOX} gap={G} stroke={stroke} />
    <Label x={RX + (5 * (BOX + G) - G) / 2} y={y + 84} size={24} color={C.muted} font="mono">
      3d
    </Label>
    <Label x={sX} y={y + 84} size={24} color={C.muted} font="mono">
      4s
    </Label>
  </g>
);

const HtmlAt: React.FC<{x: number; y: number; opacity: number; children: React.ReactNode; size?: number; color?: string; anchor?: 'center' | 'left' | 'right'}> = ({
  x,
  y,
  opacity,
  children,
  size = 34,
  color = C.ink,
  anchor = 'center',
}) =>
  opacity <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0'}, -50%)`,
        opacity,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 600,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );

export const Chromium: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const wob = (k: number) => 0.09 * Math.sin(t * 2.4 + k * 1.3);
  const bob = (k: number) => 3 * Math.sin(t * 1.9 + k * 0.9);
  // ---------- bagian A: kromium & mangan ----------
  const partA = ramp(t, cue(0) + 0.1, cue(0) + 0.8) * (1 - ramp(t, cue(4) - 0.5, cue(4) - 0.05, EASE_IN_OUT));
  const fillCr = (k: number) => ramp(t, wordOf(0, 'tiga', 0) + k * 0.16, wordOf(0, 'tiga', 0) + k * 0.16 + 0.4, BACK);
  const wrongIn = ramp(t, wordOf(0, 'bukan') - 0.2, wordOf(0, 'bukan') + 0.4);
  const fillW = (k: number) => ramp(t, wordOf(0, 'tiga', 1) + k * 0.14, wordOf(0, 'tiga', 1) + k * 0.14 + 0.4, BACK);
  const cross = ramp(t, wordOf(0, 'tiga', 1) + 1.0, wordOf(0, 'tiga', 1) + 1.4, EASE_IN_OUT);
  const cross2 = ramp(t, wordOf(0, 'tiga', 1) + 1.25, wordOf(0, 'tiga', 1) + 1.65, EASE_IN_OUT);
  const wrongOut = 1 - ramp(t, cue(1) + 0.3, cue(1) + 0.9, EASE_IN_OUT);
  const parallel = ramp(t, wordOf(1, 'sejajar', 0) - 0.2, wordOf(1, 'sejajar', 0) + 0.6);
  const sAlso = ramp(t, wordOf(1, 'ikut') - 0.2, wordOf(1, 'ikut') + 0.5);
  const sum1 = slot(t, wordOf(1, 'memberi') - 0.2, wordOf(1, 'ikut') + 0.2, 0.5, 0.3);
  const sum2 = ramp(t, wordOf(1, 'ikut') + 0.2, wordOf(1, 'ikut') + 0.7);
  const crCard = slot(t, cue(2) - 0.1, cue(3) + 0.1, 0.6, 0.4);
  const crTerm = ramp(t, cue(3) - 0.2, cue(3) + 0.4);
  const mnIn = ramp(t, wordOf(3, 'mangan') - 0.3, wordOf(3, 'mangan') + 0.4);
  const fillMn = (k: number) => ramp(t, wordOf(3, 'mangan') + k * 0.12, wordOf(3, 'mangan') + k * 0.12 + 0.4, BACK);
  const mnFull = ramp(t, wordOf(3, 'penuh') - 0.2, wordOf(3, 'penuh') + 0.4);
  const mnCard = slot(t, cue(3) + 0.1, cue(4) - 0.1, 0.6, 0.4);
  // ---------- bagian B: besi → Fe³⁺ ----------
  const partB = ramp(t, cue(4) - 0.05, cue(4) + 0.7);
  const fillFe = (k: number) => ramp(t, cue(4) + 0.3 + k * 0.12, cue(4) + 0.7 + k * 0.12, BACK);
  const feCard = slot(t, cue(4) + 0.6, wordOf(4, 'melepas') + 0.1, 0.6, 0.4);
  const fly = [wordOf(4, 'dua') - 0.1, wordOf(4, 'dua') + 0.45, wordOf(4, 'satu') - 0.1].map((a) => ramp(t, a, a + 1.4, EASE_IN));
  const ion = ramp(t, wordOf(4, 'dua') - 0.2, wordOf(4, 'satu') + 0.6, EASE_IN_OUT);
  const ionLbl = ramp(t, wordOf(4, 'satu') + 0.7, wordOf(4, 'satu') + 1.1, EASE_IN_OUT);
  const ionCard = slot(t, wordOf(4, 'melepas') + 0.1, cue(5) + 0.1, 0.6, 0.4);
  const same = ramp(t, wordOf(5, 'sejajar') - 0.3, wordOf(5, 'sejajar') + 0.4);
  const d5Card = slot(t, cue(5) + 0.1, dur + 2, 0.6, 0.4);
  const mn2 = ramp(t, wordOf(5, 'sama') - 0.3, wordOf(5, 'sama') + 0.5);
  const fillMn2 = (k: number) => ramp(t, wordOf(5, 'sama') + k * 0.1, wordOf(5, 'sama') + k * 0.1 + 0.4, BACK);
  const eqGlow = ramp(t, wordOf(5, 'sama') + 0.6, wordOf(5, 'sama') + 1.2);
  // jalur elektron yang lepas: naik ke kanan-atas lalu memudar
  const flyPos = (x0: number, y0: number, p: number, k: number): [number, number] => [x0 + p * (260 + k * 80), y0 - p * (300 + k * 30) - 60 * Math.sin(Math.PI * p)];
  const flyFrom: [number, number, boolean][] = [
    [sX + 22, Y1, false],
    [sX - 22, Y1, true],
    [dX(0) + 22, Y1, false],
  ];
  return (
    <AbsoluteFill>
      <Stage>
        {/* ===== bagian A ===== */}
        <g opacity={partA}>
          <Label x={RX - 70} y={Y1} size={52} weight={700} anchor="end">
            Cr
          </Label>
          <Row y={Y1} opacity={ramp(t, cue(0) + 0.2, cue(0) + 0.9)} glow={parallel * (1 - crTerm) * (0.6 + 0.4 * Math.sin(t * 3))} />
          {[0, 1, 2, 3, 4].map((i) => (
            <SpinArr key={i} x={dX(i)} y={Y1 + bob(i) - (1 - fillCr(i)) * 60} up tilt={wob(i)} opacity={Math.min(1, fillCr(i) * 1.5)} />
          ))}
          <SpinArr x={sX} y={Y1 + bob(5) - (1 - fillCr(5)) * 60} up tilt={wob(5)} opacity={Math.min(1, fillCr(5) * 1.5)}  />
          <circle cx={sX} cy={Y1} r={68 + 6 * Math.sin(t * 4)} fill="none" stroke={C.cyan} strokeWidth={3} opacity={sAlso * (1 - crTerm) * 0.9} />
          <TermSvg x={RX + ROW_W + 40} y={Y1} term={T_CR} size={56} anchor="start" colored opacity={crTerm} />
          {/* konfigurasi salah: 3d⁴4s² */}
          <g opacity={wrongIn * wrongOut}>
            <Row y={Y2} opacity={1} stroke={C.red} />
            {[0, 1, 2, 3].map((i) => (
              <SpinArr key={i} x={dX(i)} y={Y2 + bob(i + 3) - (1 - fillW(i)) * 60} up tilt={wob(i + 3)} opacity={Math.min(1, fillW(i) * 1.5)} />
            ))}
            <SpinArr x={sX - 22} y={Y2 - (1 - fillW(4)) * 60} up opacity={Math.min(1, fillW(4) * 1.5)} />
            <SpinArr x={sX + 22} y={Y2 - (1 - fillW(5)) * 60} up={false} opacity={Math.min(1, fillW(5) * 1.5)} />
            <path d={`M${RX - 20},${Y2 - 60} L${RX + ROW_W + 20},${Y2 + 60}`} stroke={C.red} strokeWidth={8} strokeLinecap="round" pathLength={100} strokeDasharray="100 100" strokeDashoffset={100 * (1 - cross)} opacity={Math.min(1, cross * 8)} />
            <path d={`M${RX - 20},${Y2 + 60} L${RX + ROW_W + 20},${Y2 - 60}`} stroke={C.red} strokeWidth={8} strokeLinecap="round" pathLength={100} strokeDasharray="100 100" strokeDashoffset={100 * (1 - cross2)} opacity={Math.min(1, cross2 * 8)} />
          </g>
          {/* mangan netral */}
          <g opacity={mnIn}>
            <Label x={RX - 70} y={Y2} size={52} weight={700} anchor="end">
              Mn
            </Label>
            <Row y={Y2} opacity={1} />
            {[0, 1, 2, 3, 4].map((i) => (
              <SpinArr key={i} x={dX(i)} y={Y2 + bob(i + 7) - (1 - fillMn(i)) * 60} up tilt={wob(i + 7)} opacity={Math.min(1, fillMn(i) * 1.5)} />
            ))}
            <SpinArr x={sX - 22} y={Y2 - (1 - fillMn(5)) * 60} up opacity={Math.min(1, fillMn(5) * 1.5)} />
            <SpinArr x={sX + 22} y={Y2 - (1 - fillMn(6)) * 60} up={false} opacity={Math.min(1, fillMn(6) * 1.5)} />
            <rect x={sX - 62} y={Y2 - 62} width={124} height={124} rx={14} fill="none" stroke={C.gold} strokeWidth={3} opacity={mnFull * (0.6 + 0.4 * Math.sin(t * 3.4))} />
            <TermSvg x={RX + ROW_W + 40} y={Y2} term={T_MN} size={56} anchor="start" colored opacity={ramp(t, wordOf(3, 'penuh') + 0.4, wordOf(3, 'penuh') + 1.0)} />
          </g>
        </g>

        {/* ===== bagian B: besi ===== */}
        <g opacity={partB}>
          <Label x={RX - 70} y={Y1} size={52} weight={700} anchor="end" opacity={1 - ionLbl}>
            Fe
          </Label>
          <Row y={Y1} opacity={1} glow={same * (0.6 + 0.4 * Math.sin(t * 3))} />
          {/* 3d⁶: kotak pertama berpasangan */}
          <SpinArr x={dX(0) - 22} y={Y1 + bob(0) - (1 - fillFe(0)) * 60} up tilt={wob(0)} opacity={Math.min(1, fillFe(0) * 1.5)} />
          {[1, 2, 3, 4].map((i) => (
            <SpinArr key={i} x={dX(i)} y={Y1 + bob(i) - (1 - fillFe(i)) * 60} up tilt={wob(i)} opacity={Math.min(1, fillFe(i) * 1.5)} />
          ))}
          {/* elektron yang akan lepas (4s↓, 4s↑, 3d↓) */}
          {flyFrom.map(([x0, y0, up], k) => {
            const p = fly[k];
            const [fx, fy] = flyPos(x0, y0, p, k);
            const a = Math.min(1, fillFe(5 + k) * 1.5) * (1 - ramp(t, (k < 2 ? wordOf(4, 'dua') + k * 0.55 : wordOf(4, 'satu')) + 0.8, (k < 2 ? wordOf(4, 'dua') + k * 0.55 : wordOf(4, 'satu')) + 1.3));
            return (
              <g key={k}>
                {p > 0.02 ? <path d={`M${x0},${y0} Q${mix(x0, fx, 0.5)},${mix(y0, fy, 0.5) - 40} ${fx},${fy}`} fill="none" stroke={up ? C.cyan : C.pink} strokeWidth={3} strokeDasharray="4 9" opacity={a * 0.6 * Math.min(1, p * 10)} /> : null}
                <SpinArr x={fx} y={fy + bob(k + 5) * (1 - Math.min(1, p * 5)) - (1 - fillFe(5 + k)) * 60} up={up} tilt={wob(k + 5) + p * 0.6} opacity={a} />
                <Label x={fx + 40} y={fy - 30} size={26} color={C.ink} opacity={a * ramp(p, 0.15, 0.4)} font="serif" italic>
                  e⁻
                </Label>
              </g>
            );
          })}
          <TermSvg x={RX + ROW_W + 40} y={Y1} term={T_FE} size={56} anchor="start" colored opacity={ramp(t, cue(4) + 1.0, cue(4) + 1.6) * (1 - ion)} />
          <TermSvg x={RX + ROW_W + 40} y={Y1} term={T_MN} size={56} anchor="start" colored opacity={ramp(t, cue(5) + 0.4, cue(5) + 1.0)} />
          {/* Mn²⁺ pembanding */}
          <g opacity={mn2}>
            <Row y={Y2} opacity={1} glow={eqGlow * (0.6 + 0.4 * Math.sin(t * 3 + 1))} />
            {[0, 1, 2, 3, 4].map((i) => (
              <SpinArr key={i} x={dX(i)} y={Y2 + bob(i + 4) - (1 - fillMn2(i)) * 60} up tilt={wob(i + 4)} opacity={Math.min(1, fillMn2(i) * 1.5)} />
            ))}
            <TermSvg x={RX + ROW_W + 40} y={Y2} term={T_MN} size={56} anchor="start" colored opacity={eqGlow} />
            <g transform={`rotate(90 ${RX + ROW_W + 110} ${(Y1 + Y2) / 2})`}>
              <Label x={RX + ROW_W + 110} y={(Y1 + Y2) / 2} size={72} color={C.gold} weight={700} opacity={eqGlow}>
                =
              </Label>
            </g>
          </g>
        </g>
      </Stage>

      {/* label konfigurasi (HTML agar superskrip rapi) */}
      <HtmlAt x={RX + ROW_W / 2} y={Y1 - 98} opacity={partA * ramp(t, wordOf(0, 'tiga', 0) - 0.2, wordOf(0, 'tiga', 0) + 0.4)} color={C.mint}>
        ✓ 3d<Sup>5</Sup>4s<Sup>1</Sup>
      </HtmlAt>
      <HtmlAt x={RX + ROW_W / 2} y={Y2 - 98} opacity={partA * wrongIn * wrongOut} color={C.red}>
        ✗ 3d<Sup>4</Sup>4s<Sup>2</Sup>
      </HtmlAt>
      <HtmlAt x={RX + ROW_W / 2} y={Y2 - 98} opacity={partA * mnIn} color={C.muted}>
        3d<Sup>5</Sup>4s<Sup>2</Sup> · 4s penuh
      </HtmlAt>
      {/* penjumlahan spin */}
      <HtmlAt x={RX + ROW_W / 2} y={Y1 + 165} opacity={partA * sum1} size={38} color={C.violet}>
        S = 5 × <Frac n="1" d="2" /> = <Frac n="5" d="2" />
      </HtmlAt>
      <HtmlAt x={RX + ROW_W / 2} y={Y1 + 165} opacity={partA * sum2 * (1 - ramp(t, cue(3) - 0.4, cue(3) + 0.1, EASE_IN_OUT))} size={38} color={C.violet}>
        S = <Frac n="5" d="2" /> + <Frac n="1" d="2" /> = 3
      </HtmlAt>
      <HtmlAt x={RX - 70} y={Y1} opacity={partB * ionLbl} size={52} anchor="right">
        <span style={{fontWeight: 700}}>
          Fe<Sup>3+</Sup>
        </span>
      </HtmlAt>
      <HtmlAt x={RX + ROW_W / 2} y={Y1 - 98} opacity={partB * (1 - ionLbl)} color={C.muted}>
        3d<Sup>6</Sup>4s<Sup>2</Sup>
      </HtmlAt>
      <HtmlAt x={RX + ROW_W / 2} y={Y1 - 98} opacity={partB * ionLbl} color={C.gold}>
        3d<Sup>5</Sup> · semua sejajar
      </HtmlAt>
      <HtmlAt x={RX - 70} y={Y2} opacity={partB * mn2} size={52} anchor="right">
        <span style={{fontWeight: 700}}>
          Mn<Sup>2+</Sup>
        </span>
      </HtmlAt>

      {/* kartu rumus bergantian di satu slot */}
      <Formula x={1530} y={420} p={crCard} accent={C.violet} size={110} caption={<>S = 3 → 2S+1 = 7 · L = 0 · J = 3</>}>
        <TermHtml term={T_CR} colored />
      </Formula>
      <Formula x={1530} y={420} p={mnCard} accent={C.violet} size={100} caption={<>Mn netral · S = <Frac n="5" d="2" /> · L = 0</>}>
        <TermHtml term={T_MN} colored />
      </Formula>
      <Formula x={1530} y={420} p={feCard} accent={C.gold} size={100} caption={<>Fe netral · 3d<Sup>6</Sup>4s<Sup>2</Sup> · S = 2 · L = 2</>}>
        <TermHtml term={T_FE} colored />
      </Formula>
      <Formula x={1530} y={420} p={ionCard} accent={C.pink} size={64}>
        Fe → Fe<Sup>3+</Sup> + 3e<Sup>−</Sup>
        <div style={{fontSize: 28, fontFamily: FONT.sans, color: C.muted, marginTop: 8}}>
          2 dari 4s, 1 dari 3d
        </div>
      </Formula>
      <Formula x={1530} y={420} p={d5Card} accent={C.violet} size={96} caption={<>Fe<Sup>3+</Sup> 3d<Sup>5</Sup> = Mn<Sup>2+</Sup> 3d<Sup>5</Sup></>}>
        <TermHtml term={T_MN} colored />
      </Formula>
    </AbsoluteFill>
  );
};
