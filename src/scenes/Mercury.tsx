import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, mix, rand, ramp, slot} from '../anim';
import {Formula, Glow, Label, Stage} from '../components/primitives';
import {PhotonPacket, wlColor} from '../components/viz';
import {Level, SpinArrow, Stamp, TArrow, TermH, TermSVG} from '../components/grupD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 16: ΔS = 0 melonggar pada atom berat; Hg ³P°₁ → ¹S₀ 254 nm (interkombinasi) → lampu TL.
const UV = wlColor(254);

/** Atom skematis: inti + kulit elektron berputar. */
const AtomSketch: React.FC<{x: number; y: number; t: number; shells: number; rn: number; label: string; scale?: number; opacity?: number; heavy?: boolean}> = ({
  x,
  y,
  t,
  shells,
  rn,
  label,
  scale = 1,
  opacity = 1,
  heavy,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <circle r={rn * 3.2} fill={heavy ? 'url(#soft-violet)' : 'url(#soft-cyan)'} opacity={0.35} />
    {Array.from({length: shells}, (_, k) => {
      const R = rn + 24 + k * (heavy ? 20 : 34);
      const tilt = -20 + k * 37;
      const sp = (heavy ? 1.6 : 1.1) / (1 + k * 0.35);
      const a = t * sp + k * 1.7;
      return (
        <g key={k} transform={`rotate(${tilt})`}>
          <ellipse rx={R} ry={R * 0.38} fill="none" stroke={C.cyan} strokeOpacity={0.25} strokeWidth={2} />
          <circle cx={R * Math.cos(a)} cy={R * 0.38 * Math.sin(a)} r={5} fill={C.cyan} />
          {heavy ? <circle cx={R * Math.cos(a + Math.PI)} cy={R * 0.38 * Math.sin(a + Math.PI)} r={5} fill={C.pink} /> : null}
        </g>
      );
    })}
    <circle r={rn} fill={heavy ? '#7a4bd8' : '#c9b8ff'} stroke="#fff" strokeOpacity={0.3} strokeWidth={2} />
    <circle cx={-rn * 0.3} cy={-rn * 0.35} r={rn * 0.3} fill="#fff" opacity={0.3} />
    <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={rn * 0.8} fill="#fff">
      {label}
    </text>
  </g>
);

const Lock: React.FC<{x: number; y: number; open: number; color: string; opacity?: number}> = ({x, y, open, color, opacity = 1}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <g transform={`translate(${14 * open} ${-16 * open}) rotate(${-28 * open} 18 -10)`}>
      <path d="M-18,-6 L-18,-26 A18,18 0 0 1 18,-26 L18,-6" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
    </g>
    <rect x={-28} y={-8} width={56} height={44} rx={8} fill={color} />
    <circle cx={0} cy={10} r={6} fill="#0a1124" />
  </g>
);

export const Mercury: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  // Fase A: atom ringan vs berat
  const a0 = ramp(t, 0.2, 1.4);
  const loose = ramp(t, wordOf(0, 'melonggar') - 0.3, wordOf(0, 'melonggar') + 0.8);
  const toB = ramp(t, cue(1) - 0.2, cue(1) + 1.2, EASE_IN_OUT);
  const lightOut = 1 - ramp(t, cue(1) - 0.4, cue(1) + 0.3, EASE_IN_OUT);
  const heavyIn = ramp(t, wordOf(0, 'berat') - 0.4, wordOf(0, 'berat') + 0.6);
  // Fase B: diagram tingkat
  const lv = ramp(t, wordOf(1, 'merkuri') - 0.2, wordOf(1, 'merkuri') + 0.8);
  const tFrom = wordOf(1, 'berasal');
  const arr = ramp(t, tFrom - 0.2, tFrom + 0.8);
  const termP = ramp(t, wordOf(1, 'triplet') - 0.2, wordOf(1, 'triplet') + 0.5);
  const termS = ramp(t, wordOf(1, 'singlet') - 0.2, wordOf(1, 'singlet') + 0.5);
  const banned = ramp(t, wordOf(2, 'dilarang') - 0.2, wordOf(2, 'dilarang') + 0.5);
  const unban = ramp(t, wordOf(3, 'tercampur') + 0.2, wordOf(3, 'tercampur') + 1.2, EASE_IN_OUT);
  const mixBar = ramp(t, cue(3) + 0.4, cue(3) + 1.2);
  const eps = 0.08 * ramp(t, wordOf(3, 'tercampur') - 0.3, wordOf(3, 'tercampur') + 1.6, EASE_IN_OUT);
  const bright = ramp(t, wordOf(4, 'terang') - 0.4, wordOf(4, 'terang') + 0.4);
  const tUV = wordOf(4, 'Ultraviolet');
  const bOut = 1 - ramp(t, tUV - 0.3, tUV + 0.4, EASE_IN_OUT);
  // Fase C: lampu TL
  const tube = ramp(t, tUV + 0.2, tUV + 1.2);
  const phos = ramp(t, wordOf(4, 'fosfor') - 0.2, wordOf(4, 'fosfor') + 1.2);
  const white = ramp(t, wordOf(4, 'putih') - 0.4, wordOf(4, 'putih') + 1.0);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const hgX = mix(1300, 330, toB);
  const hgY = mix(480, 560, toB);
  const hgS = mix(1.4, 1.05, toB);

  const yP = 400;
  const yS = 800;
  const LX1 = 720;
  const LX2 = 1060;
  const AX = 960;
  // foton UV keluar berulang (lebih sering setelah larangan longgar)
  const rate = mix(0.5, 1.4, bright);
  const emit = (ph: number) => (arr > 0.99 ? cyc(ph) : 0) * (1 - 0.8 * banned + 0.8 * unban);

  // tabung TL
  const TX0 = 300;
  const TX1 = 1620;
  const TY = 560;
  const TR = 90;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={hgX} y={hgY} r={360} color="violet" opacity={0.14 * bOut} />
        {/* Fase A */}
        <g opacity={a0 * lightOut}>
          <AtomSketch x={620} y={480} t={t} shells={1} rn={30} label="He" scale={1.5} />
          <Label x={620} y={690} size={30} color={C.ink}>
            atom ringan
          </Label>
          <Lock x={620} y={780} open={0} color={C.mint} />
        </g>
        <AtomSketch x={hgX} y={hgY} t={t} shells={6} rn={46} label="Hg" heavy scale={hgS} opacity={heavyIn * bOut} />
        <g opacity={heavyIn * lightOut}>
          <Label x={1300} y={690} size={30} color={C.ink}>
            atom berat
          </Label>
          <Lock x={1300} y={780} open={loose} color={C.amber} />
        </g>
        <g opacity={toB * bOut}>
          <Label x={330} y={790} size={30} color={C.ink}>
            merkuri · Z = 80
          </Label>
        </g>

        {/* Fase B: tingkat Hg */}
        <g opacity={lv * bOut}>
          <Level x1={LX1} x2={LX2} y={yP} color={C.violet} lit={0.5 + 0.5 * Math.sin(t * 1.5)} />
          <Level x1={LX1} x2={LX2} y={yS} color={C.blue} lit={0.5 + 0.5 * Math.sin(t * 1.5 + 2)} />
          <Label x={LX1 - 16} y={yP} size={26} anchor="end" color={C.muted} font="serif">
            6s6p
          </Label>
          <Label x={LX1 - 16} y={yS} size={26} anchor="end" color={C.muted} font="serif">
            6s²
          </Label>
          <SpinArrow x={790} y={yP - 44} len={50} angle={4 * Math.sin(t * 2)} />
          <SpinArrow x={830} y={yP - 44} len={50} angle={4 * Math.sin(t * 2 + 1)} />
          <SpinArrow x={790} y={yS - 44} len={50} angle={4 * Math.sin(t * 2)} />
          <SpinArrow x={830} y={yS - 44} len={50} angle={180 + 4 * Math.sin(t * 2 + 1)} />
          <TermSVG x={LX2 + 22} y={yP} mult={3} L="P" J="1" odd anchor="start" size={56} opacity={termP} />
          <TermSVG x={LX2 + 22} y={yS} mult={1} L="S" J="0" anchor="start" size={56} opacity={termS} />
          <TArrow x1={AX} y1={yP + 16} x2={AX} y2={yS - 16} p={arr} color={UV} width={7} opacity={1 - 0.6 * banned + 0.6 * unban} />
          <Label x={AX - 24} y={600} size={30} anchor="end" color={UV} opacity={arr * (1 - banned + unban)}>
            254 nm
          </Label>
          {[0, 0.33, 0.66].map((o, k) => {
            const ph = ((t * rate + o) % 1 + 1) % 1;
            return <PhotonPacket key={k} x={mix(AX + 40, 1150, ph)} y={mix(560, 520, ph) + k * 40} wavelength={18} color={UV} amp={14} len={110} opacity={emit(ph) * (0.6 + 0.4 * bright)} phase={-t * 16} />;
          })}
          {/* komposisi keadaan ³P°₁ */}
          <g opacity={mixBar}>
            <rect x={1250} y={yP - 22} width={440} height={44} rx={10} fill="rgba(10,16,34,0.9)" stroke={C.faint} strokeWidth={2} />
            <rect x={1250} y={yP - 22} width={440 * (1 - eps)} height={44} rx={10} fill={C.violet} opacity={0.85} />
            <rect x={1250 + 440 * (1 - eps)} y={yP - 22} width={440 * eps} height={44} fill={C.gold} opacity={0.95} />
            <Label x={1260} y={yP - 50} size={24} anchor="start" color={C.violet}>
              triplet
            </Label>
            <Label x={1690} y={yP + 50} size={24} anchor="end" color={C.gold} opacity={ramp(eps, 0.02, 0.05)}>
              + sedikit singlet
            </Label>
          </g>
        </g>

        {/* Fase C: lampu TL */}
        <g opacity={tube}>
          {Array.from({length: 9}, (_, k) => (
            <Glow key={k} x={TX0 + 60 + k * 150} y={TY} r={190} color="white" opacity={0.22 * white * (0.9 + 0.1 * Math.sin(t * 3 + k))} />
          ))}
          <rect x={TX0} y={TY - TR} width={TX1 - TX0} height={2 * TR} rx={TR} fill="rgba(140,120,255,0.07)" stroke="#c8d6ff" strokeOpacity={0.7} strokeWidth={3} />
          {/* lapisan fosfor di dinding dalam */}
          <rect x={TX0 + 8} y={TY - TR + 8} width={TX1 - TX0 - 16} height={2 * TR - 16} rx={TR - 8} fill="none" stroke="#f4f1ff" strokeWidth={10} opacity={0.15 + 0.35 * phos + 0.45 * white} />
          <rect x={TX0 + 8} y={TY - TR + 8} width={TX1 - TX0 - 16} height={2 * TR - 16} rx={TR - 8} fill="#ffffff" opacity={0.35 * white} />
          {[TX0 - 30, TX1].map((x, k) => (
            <rect key={k} x={x} y={TY - 34} width={30} height={68} rx={6} fill="#4a5680" />
          ))}
          {Array.from({length: 22}, (_, k) => {
            const x = TX0 + 70 + k * 56 + 10 * Math.sin(t * 1.3 + k);
            const y = TY + 18 * Math.sin(t * 0.9 + k * 2.1);
            const ph = ((t * (0.5 + 0.2 * rand(k)) + rand(k * 3.3)) % 1 + 1) % 1;
            const dir = k % 2 ? 1 : -1;
            const py = mix(y, TY + dir * (TR - 14), ph);
            return (
              <g key={k}>
                <circle cx={x} cy={y} r={5} fill={C.violet} opacity={0.9} />
                <PhotonPacket x={x} y={py} wavelength={10} color={UV} amp={6} len={36} angle={90} opacity={cyc(ph) * (1 - 0.5 * white)} phase={-t * 18} />
                <circle cx={x} cy={TY + dir * (TR - 10)} r={10 + 6 * ph} fill="#fff" opacity={phos * Math.max(0, (ph - 0.8) / 0.2) * (1 - ph) * 8} />
              </g>
            );
          })}
          <Label x={TX0 + 40} y={TY - TR - 50} size={28} anchor="start" color={UV}>
            busur Hg → UV 254 nm (tak tampak)
          </Label>
          <Label x={TX1 - 40} y={TY - TR - 50} size={28} anchor="end" color="#f4f1ff" opacity={phos}>
            lapisan fosfor di dinding
          </Label>
          <Label x={960} y={TY + TR + 70} size={32} color="#ffffff" weight={700} opacity={white}>
            cahaya putih tampak · lampu TL
          </Label>
        </g>
      </Stage>
      <Formula x={1470} y={650} p={slot(t, tFrom - 0.3, cue(2)) * bOut} accent={C.violet} size={60} caption="253,65 nm ≈ 254 nm · ultraviolet">
        <TermH mult={3} L="P" J={1} odd /> → <TermH mult={1} L="S" J={0} />
      </Formula>
      <Formula x={1470} y={650} p={slot(t, cue(2) + 0.1, cue(3))} accent={C.red} size={60} caption="kopling LS murni: dilarang">
        Δ<i>S</i> = 1 → 0 ≠ 0
      </Formula>
      <Formula x={1470} y={650} p={slot(t, cue(3) + 0.3, tUV)} accent={C.gold} size={58} caption="spin–orbit kuat pada atom berat (Z = 80)">
        <TermH mult={3} L="P" J={1} odd /> + <span style={{fontStyle: 'italic'}}>ε</span> <TermH mult={1} L="P" J={1} odd />
      </Formula>
      <Stamp x={AX} y={600} p={banned * (1 - unban)} text="DILARANG" sub="ΔS ≠ 0" />
      <Stamp x={AX} y={250} p={bright * bOut} text="GARIS INTERKOMBINASI" color={UV} rot={0} size={30} />
    </AbsoluteFill>
  );
};
