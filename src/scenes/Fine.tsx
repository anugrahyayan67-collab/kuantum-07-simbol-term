import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Frac, Label, Stage, Sub} from '../components/primitives';
import {SpinArr, TermSvg, type Term} from '../components/grupC';
import {PhotonPacket, wlColor} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 11: struktur halus. E_J = E_LS + (A/2)[J(J+1) − L(L+1) − S(S+1)]; ³P → −2A, −A, +A (Landé 1 : 2).
// Natrium 3p ²P → ²P₃/₂ & ²P₁/₂ → 3s ²S₁/₂: D₂ 589,0 nm, D₁ 589,6 nm (≈ 17,2 cm⁻¹) — AUDIT.
const A = 80; // piksel per A
const LY = 600; // energi term ³P sebelum terpecah
const U = {x0: 200, x1: 520}; // garis term tunggal
const S = {x0: 700, x1: 1000}; // garis tingkat J
const SHIFT = [-2, -1, 1]; // J = 0, 1, 2 (dalam satuan A)
const jy = (J: number) => LY - SHIFT[J] * A;
const T3P = (J: string): Term => ({m: '3', L: 'P', J});
// natrium
const NA = {x0: 220, x1: 700, yP: 370, yS: 790};
const SP = {x0: 1160, x1: 1760, y: 560, h: 130, l0: 588.6, l1: 590.0};
const sx = (nm: number) => SP.x0 + ((nm - SP.l0) / (SP.l1 - SP.l0)) * (SP.x1 - SP.x0);
const LENS = {x: 1000, y: 330, r: 128};

export const Fine: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  // ---------- bagian 1: term ³P ----------
  const part1 = ramp(t, cue(0) - 0.2, cue(0) + 0.6) * (1 - ramp(t, cue(4) - 0.5, cue(4) - 0.05, EASE_IN_OUT));
  const ask = ramp(t, wordOf(0, 'terpecah') - 0.2, wordOf(0, 'terpecah') + 0.5) * (1 - ramp(t, cue(3), cue(3) + 0.5));
  const illus = slot(t, cue(1) - 0.2, cue(3) - 0.1, 0.7, 0.5);
  const magSpin = ramp(t, wordOf(1, 'magnet', 0) - 0.2, wordOf(1, 'magnet', 0) + 0.5);
  const field = ramp(t, wordOf(1, 'medan') - 0.2, wordOf(1, 'medan') + 0.6);
  const eqCard = slot(t, cue(2) - 0.1, cue(3) + 0.4, 0.6, 0.4);
  const split = ramp(t, cue(3) + 0.1, cue(3) + 1.7, EASE_IN_OUT);
  const shiftIn = [wordOf(3, 'minus', 0), wordOf(3, 'minus', 1), wordOf(3, 'plus')].map((a) => ramp(t, a - 0.2, a + 0.4, BACK));
  const interval = ramp(t, wordOf(3, 'Jaraknya') - 0.2, wordOf(3, 'Jaraknya') + 0.6);
  const landeCard = slot(t, wordOf(3, 'Jaraknya') - 0.1, cue(4) - 0.2, 0.6, 0.4);
  // ---------- bagian 2: natrium ----------
  const part2 = ramp(t, cue(4) - 0.05, cue(4) + 0.7);
  const jump = ramp(t, wordOf(4, 'naik') - 0.1, wordOf(4, 'naik') + 0.6, EASE_IN_OUT);
  const nsplit = ramp(t, wordOf(5, 'memecahnya') - 0.2, wordOf(5, 'memecahnya') + 1.0, EASE_IN_OUT);
  const lens = ramp(t, wordOf(5, 'tipis') - 0.6, wordOf(5, 'tipis') + 0.3, BACK) * (1 - ramp(t, wordOf(6, 'Misteri') - 0.6, wordOf(6, 'Misteri') - 0.1, EASE_IN_OUT));
  const down = ramp(t, wordOf(6, 'turun') - 0.1, wordOf(6, 'turun') + 0.9, EASE_IN_OUT);
  const fly = [ramp(t, wordOf(6, 'memancarkan') - 0.2, wordOf(6, 'nol') - 0.1, EASE_IN_OUT), ramp(t, wordOf(6, 'memancarkan') + 0.3, wordOf(6, 'enam') - 0.1, EASE_IN_OUT)];
  const lineOn = [ramp(t, wordOf(6, 'nol') - 0.2, wordOf(6, 'nol') + 0.4), ramp(t, wordOf(6, 'enam') - 0.2, wordOf(6, 'enam') + 0.4)];
  const solved = slot(t, wordOf(6, 'Misteri') - 0.1, dur + 2, 0.6, 0.4);
  const screen = ramp(t, wordOf(6, 'memancarkan') - 0.6, wordOf(6, 'memancarkan') + 0.2);
  const yel = wlColor(589);
  const gap = mix(0, 5, nsplit); // celah nyata di diagram utama (tipis!)
  const ex = 420 + 14 * Math.sin(t * 2.2); // elektron bergoyang di tingkat
  const eY = mix(NA.yS, NA.yP, jump);
  // posisi elektron orbit (ilustrasi spin–orbit)
  const IL = {x: 1440, y: 590};
  const ang = t * 2.1;
  const ox = IL.x + 210 * Math.cos(ang);
  const oy = IL.y + 72 * Math.sin(ang);
  const front = Math.sin(ang) > 0;
  return (
    <AbsoluteFill>
      <Stage>
        {/* ===== bagian 1: ³P terpecah ===== */}
        <g opacity={part1}>
          {/* garis term tunggal */}
          <line x1={U.x0} y1={LY} x2={U.x1} y2={LY} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          <TermSvg x={U.x0 + (U.x1 - U.x0) / 2} y={LY - 46} term={{m: '3', L: 'P', J: ''}} size={68} colored />
          <Label x={(U.x0 + U.x1) / 2} y={LY + 46} size={28} color={C.muted}>
            tanpa spin–orbit
          </Label>
          <Label x={610} y={LY + 4 + 6 * Math.sin(t * 3)} size={90} color={C.gold} weight={700} opacity={ask}>
            ?
          </Label>
          {/* tingkat J */}
          {[0, 1, 2].map((J) => {
            const y = mix(LY, jy(J), split);
            const a = Math.min(1, split * 3);
            return (
              <g key={J} opacity={a}>
                <path d={`M${U.x1 + 8},${LY} L${S.x0 - 8},${y}`} stroke={C.muted} strokeWidth={2} strokeDasharray="6 8" fill="none" />
                <line x1={S.x0} y1={y} x2={S.x1} y2={y} stroke={C.mint} strokeWidth={6} strokeLinecap="round" />
                <TermSvg x={S.x1 + 28} y={y} term={T3P(String(J))} size={54} anchor="start" colored opacity={split} />
                <Label x={S.x1 + 190} y={y} size={38} color={C.mint} font="mono" anchor="start" opacity={shiftIn[J]}>
                  {['−2A', '−A', '+A'][J]}
                </Label>
              </g>
            );
          })}
          {/* aturan interval: A dan 2A */}
          <g opacity={interval}>
            {[
              [0, 1, 'A'],
              [1, 2, '2A'],
            ].map(([a, b, txt]) => (
              <g key={String(txt)}>
                <path d={`M${S.x1 + 320},${jy(a as number) - 4} h16 V${jy(b as number) + 4} h-16`} fill="none" stroke={C.gold} strokeWidth={3} />
                <Label x={S.x1 + 356} y={(jy(a as number) + jy(b as number)) / 2} size={38} color={C.gold} anchor="start" font="serif" italic>
                  {String(txt)}
                </Label>
              </g>
            ))}
            <Label x={S.x1 + 460} y={(jy(0) + jy(2)) / 2} size={42} color={C.gold} weight={700} anchor="start">
              1 : 2
            </Label>
          </g>
          {/* ilustrasi spin–orbit: elektron mengorbit, medan B dari gerak orbital, magnet kecil spin */}
          <g opacity={illus}>
            <ellipse cx={IL.x} cy={IL.y} rx={210} ry={72} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="5 8" opacity={0.7} />
            {/* medan B (vertikal, tanpa filter) */}
            <g opacity={field}>
              <path d={`M${IL.x},${IL.y + 130} L${IL.x},${IL.y - 150}`} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
              <path d={`M${IL.x},${IL.y - 176} L${IL.x - 14},${IL.y - 146} L${IL.x + 14},${IL.y - 146} Z`} fill={C.gold} />
              {[0, 1, 2].map((k) => {
                const ph = (t * 0.5 + k / 3) % 1;
                const r = 60 + ph * 110;
                return <ellipse key={k} cx={IL.x} cy={IL.y} rx={r} ry={r * 0.34} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.5 * Math.min(1, ph * 6) * (1 - ph)} />;
              })}
              <Label x={IL.x + 24} y={IL.y - 168} size={28} color={C.gold} anchor="start" weight={600}>
                B dari gerak orbital
              </Label>
            </g>
            {!front ? <SpinArr x={ox + 4} y={oy - 42} up len={70} width={7} tilt={0.35 * Math.sin(t * 3)} opacity={magSpin} /> : null}
            <circle cx={IL.x} cy={IL.y} r={30} fill={C.amber} />
            <circle cx={IL.x - 9} cy={IL.y - 9} r={9} fill="#fff" opacity={0.5} />
            <Label x={IL.x} y={IL.y} size={26} color="#2a1400" weight={800}>
              +
            </Label>
            <circle cx={ox} cy={oy} r={14} fill={C.cyan} />
            {front ? <SpinArr x={ox + 4} y={oy - 42} up len={70} width={7} tilt={0.35 * Math.sin(t * 3)} opacity={magSpin} /> : null}
            <Label x={IL.x} y={IL.y + 140} size={28} color={C.cyan} weight={600} opacity={magSpin}>
              magnet kecil spin ↔ medan orbital
            </Label>
          </g>
        </g>

        {/* ===== bagian 2: natrium ===== */}
        <g opacity={part2}>
          <Label x={NA.x0} y={NA.yP - 120} size={40} weight={700} anchor="start" color={C.ink}>
            Natrium (Na)
          </Label>
          <Label x={NA.x0 - 20} y={NA.yP} size={36} color={C.muted} font="mono" anchor="end">
            3p
          </Label>
          <Label x={NA.x0 - 20} y={NA.yS} size={36} color={C.muted} font="mono" anchor="end">
            3s
          </Label>
          {/* 3p: satu garis yang terbelah dua (celah dibuat tipis — sesuai kenyataan) */}
          <line x1={NA.x0} y1={NA.yP} x2={NA.x1} y2={NA.yP} stroke={C.ink} strokeWidth={5} strokeLinecap="round" opacity={1 - nsplit} />
          <line x1={NA.x0} y1={NA.yP - gap} x2={NA.x1} y2={NA.yP - gap} stroke={C.ink} strokeWidth={4} strokeLinecap="round" opacity={nsplit} />
          <line x1={NA.x0} y1={NA.yP + gap} x2={NA.x1} y2={NA.yP + gap} stroke={C.ink} strokeWidth={4} strokeLinecap="round" opacity={nsplit} />
          <TermSvg x={NA.x1 + 24} y={NA.yP} term={{m: '2', L: 'P', J: '', odd: true}} size={58} anchor="start" colored opacity={ramp(t, wordOf(4, 'doublet') - 0.2, wordOf(4, 'doublet') + 0.4) * (1 - nsplit)} />
          <line x1={NA.x0} y1={NA.yS} x2={NA.x1} y2={NA.yS} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
          <TermSvg x={NA.x1 + 24} y={NA.yS} term={{m: '2', L: 'S', J: '1/2'}} size={58} anchor="start" colored />
          {/* elektron valensi naik 3s → 3p */}
          <circle cx={ex} cy={eY - 16} r={13} fill={C.cyan} opacity={1 - down} />
          <circle cx={ex - 4} cy={eY - 20} r={4} fill="#fff" opacity={0.6 * (1 - down)} />
          {/* dua transisi turun */}
          {[0, 1].map((k) => {
            const x = k === 0 ? 540 : 620;
            const y0 = NA.yP + (k === 0 ? -gap : gap);
            const yy = mix(y0, NA.yS - 8, down);
            return (
              <g key={k} opacity={Math.min(1, down * 8)}>
                <path d={`M${x},${y0} L${x},${yy}`} stroke={yel} strokeWidth={5} strokeLinecap="round" />
                <path d={`M${x},${yy + 10} L${x - 12},${yy - 14} L${x + 12},${yy - 14} Z`} fill={yel} opacity={Math.min(1, down * 4)} />
                <Label x={x + (k === 0 ? -16 : 16)} y={(NA.yP + NA.yS) / 2 - 40} size={32} color={yel} weight={700} anchor={k === 0 ? 'end' : 'start'} opacity={ramp(down, 0.6, 1)}>
                  {k === 0 ? 'D₂' : 'D₁'}
                </Label>
              </g>
            );
          })}
          {/* kaca pembesar pada celah */}
          <g opacity={lens}>
            <circle cx={NA.x1 - 70} cy={NA.yP} r={26} fill="none" stroke={C.gold} strokeWidth={3} />
            <path d={`M${NA.x1 - 70 + 22},${NA.yP - 14} L${LENS.x - LENS.r * 0.8},${LENS.y + LENS.r * 0.55}`} stroke={C.gold} strokeWidth={2} strokeDasharray="5 6" fill="none" />
            <circle cx={LENS.x} cy={LENS.y} r={LENS.r} fill="rgba(10,16,36,0.92)" stroke={C.gold} strokeWidth={5} />
            <line x1={LENS.x - 100} y1={LENS.y - 40} x2={LENS.x + 100} y2={LENS.y - 40} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
            <line x1={LENS.x - 100} y1={LENS.y + 40} x2={LENS.x + 100} y2={LENS.y + 40} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
            <path d={`M${LENS.x},${LENS.y - 32} L${LENS.x},${LENS.y + 32}`} stroke={C.gold} strokeWidth={2.5} />
            <Label x={LENS.x} y={LENS.y + LENS.r + 32} size={28} color={C.gold} font="mono">
              ≈ 17 cm⁻¹
            </Label>
            <TermSvg x={LENS.x + LENS.r + 20} y={LENS.y - 40} term={{m: '2', L: 'P', J: '3/2', odd: true}} size={54} anchor="start" colored />
            <TermSvg x={LENS.x + LENS.r + 20} y={LENS.y + 40} term={{m: '2', L: 'P', J: '1/2', odd: true}} size={54} anchor="start" colored />
          </g>
          {/* foton kuning menuju layar spektrum */}
          {[0, 1].map((k) => {
            const p = fly[k];
            const x = mix(760, sx(k === 0 ? 589.0 : 589.6) - 20, p);
            const y = SP.y + SP.h / 2 + (k === 0 ? -22 : 22);
            return <PhotonPacket key={k} x={x} y={y} wavelength={k === 0 ? 30 : 31} color={yel} amp={20} len={170} phase={-t * 14} opacity={Math.min(1, p * 6) * (1 - ramp(p, 0.92, 1))} />;
          })}
          {/* layar spektrum */}
          <g opacity={screen}>
            <rect x={SP.x0} y={SP.y} width={SP.x1 - SP.x0} height={SP.h} rx={10} fill="rgba(6,8,16,0.95)" stroke={C.faint} strokeWidth={3} />
            {[589, 590].map((nm) => (
              <g key={nm}>
                <path d={`M${sx(nm)},${SP.y + SP.h} v12`} stroke={C.muted} strokeWidth={2} />
                <Label x={sx(nm)} y={SP.y + SP.h + 30} size={22} color={C.muted} font="mono">
                  {`${nm}`}
                </Label>
              </g>
            ))}
            <Label x={SP.x1} y={SP.y - 30} size={22} color={C.muted} font="mono" anchor="end">
              λ (nm)
            </Label>
            <Label x={SP.x0} y={SP.y - 30} size={26} color={C.muted} anchor="start" weight={600}>
              layar spektroskop
            </Label>
            {[0, 1].map((k) => {
              const x = sx(k === 0 ? 589.0 : 589.6);
              const a = lineOn[k] * (0.85 + 0.15 * Math.sin(t * 5 + k));
              return (
                <g key={k} opacity={a}>
                  <rect x={x - 16} y={SP.y + 4} width={32} height={SP.h - 8} fill={yel} opacity={0.18} />
                  <rect x={x - 4} y={SP.y + 4} width={8} height={SP.h - 8} rx={3} fill={yel} />
                  <rect x={x - 1.5} y={SP.y + 10} width={3} height={SP.h - 20} fill="#fff" opacity={0.8} />
                </g>
              );
            })}
          </g>
        </g>
      </Stage>

      {/* label garis spektrum (HTML: subskrip J) */}
      {[0, 1].map((k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: sx(k === 0 ? 589.0 : 589.6),
            top: SP.y + SP.h + 104,
            transform: 'translate(-50%, -50%)',
            opacity: part2 * lineOn[k],
            textAlign: 'center',
            fontFamily: FONT.sans,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{fontSize: 34, fontWeight: 700, color: yel}}>{k === 0 ? '589,0 nm' : '589,6 nm'}</div>
          <div style={{fontSize: 30, color: C.muted, fontFamily: FONT.serif}}>
            dari <sup style={{fontSize: '0.62em'}}>2</sup>P<sup style={{fontSize: '0.62em'}}>°</sup>
            <Sub>{k === 0 ? '3/2' : '1/2'}</Sub>
          </div>
        </div>
      ))}

      <Formula x={960} y={268} p={eqCard} size={56} accent={C.mint}>
        <span style={{fontStyle: 'italic'}}>E</span>
        <Sub color={C.mint}>J</Sub> = <span style={{fontStyle: 'italic'}}>E</span>
        <Sub>LS</Sub> + <Frac n={<i>A</i>} d="2" />
        [<i style={{color: C.mint}}>J</i>(<i style={{color: C.mint}}>J</i>+1) − <i style={{color: C.gold}}>L</i>(<i style={{color: C.gold}}>L</i>+1) − <i style={{color: C.violet}}>S</i>(
        <i style={{color: C.violet}}>S</i>+1)]
      </Formula>
      <Formula x={960} y={268} p={landeCard} size={60} accent={C.gold} caption="aturan interval Landé">
        <i>E</i>
        <Sub color={C.mint}>J</Sub> − <i>E</i>
        <Sub color={C.mint}>J−1</Sub> = <i>A</i>·<i style={{color: C.mint}}>J</i>
      </Formula>
      <Formula x={1460} y={300} p={solved} size={58} accent={C.gold} caption="struktur halus: spin–orbit">
        <span style={{fontFamily: FONT.sans, fontWeight: 700, color: C.gold}}>Misteri terpecahkan ✓</span>
      </Formula>
    </AbsoluteFill>
  );
};
