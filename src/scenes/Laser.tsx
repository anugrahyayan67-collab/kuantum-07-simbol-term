import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {EASE_IN_OUT, cyc, mix, rand, ramp, slot} from '../anim';
import {Formula, Frac, Glow, Label, Stage} from '../components/primitives';
import {PhotonPacket, wlColor} from '../components/viz';
import {FRAUNHOFER, Level, OrbBox, SpectrumDefs, SpinArrow, StarIcon, Stopwatch, StreetLamp, TArrow, TermH, TermSVG} from '../components/grupD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 19: Nd³⁺ 4f³ → ⁴I₉/₂; laser ⁴F₃/₂ → ⁴I₁₁/₂ 1064 nm; garis D Fraunhofer = garis natrium (serapan).
const IR = '#b8202e';
const FX = (i: number) => 960 + (i - 3) * 104;
const FY = 430;

const HtmlAt: React.FC<{x: number; y: number; p: number; children: React.ReactNode; color?: string; size?: number}> = ({x, y, p, children, color = C.ink, size = 40}) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) translateY(${(1 - p) * 14}px)`,
        opacity: p,
        fontFamily: FONT.serif,
        fontSize: size,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );

export const Laser: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  // Fase A: kotak 4f
  const aIn = ramp(t, 0.3, 1.2);
  const aOut = 1 - ramp(t, cue(2) - 0.5, cue(2) + 0.1, EASE_IN_OUT);
  const tThree = wordOf(0, 'tiga', 1);
  const spins = [0, 1, 2].map((i) => ramp(t, tThree - 0.2 + i * 0.25, tThree + 0.3 + i * 0.25));
  const sS = ramp(t, wordOf(1, 'sejajar') - 0.3, wordOf(1, 'sejajar') + 0.4);
  const sL = ramp(t, wordOf(1, 'terbesar') - 0.3, wordOf(1, 'terbesar') + 0.4);
  const sI = ramp(t, wordOf(1, 'huruf') - 0.2, wordOf(1, 'huruf') + 0.4);
  const sJ = ramp(t, wordOf(1, 'Kurang') - 0.2, wordOf(1, 'Kurang') + 0.5);
  const term = slot(t, wordOf(1, 'sembilan') - 0.1, cue(2) + 0.1);
  // Fase B: tingkat laser
  const bIn = ramp(t, cue(2) - 0.1, cue(2) + 0.8);
  const bOut = 1 - ramp(t, cue(4) - 0.5, cue(4) + 0.1, EASE_IN_OUT);
  const pump = ramp(t, cue(2) + 0.6, cue(2) + 1.5);
  const lase = ramp(t, wordOf(2, 'sebelas') - 0.2, wordOf(2, 'sebelas') + 0.7);
  const beam = ramp(t, wordOf(2, 'inframerah') - 0.3, wordOf(2, 'inframerah') + 1.2, EASE_IN_OUT);
  const store = ramp(t, wordOf(3, 'bertahan') - 0.6, wordOf(3, 'menimbun') + 0.8);
  // Fase C: Fraunhofer
  const cIn = ramp(t, cue(4) - 0.1, cue(4) + 0.8);
  const dark = ramp(t, wordOf(4, 'gelap') - 0.3, wordOf(4, 'gelap') + 1.0);
  const tD = wordOf(4, 'garis', 1);
  const dBox = ramp(t, wordOf(4, 'kuning') - 0.3, tD + 0.4);
  const zoom = ramp(t, tD + 0.2, tD + 1.2);
  const na = ramp(t, wordOf(5, 'natrium') - 0.3, wordOf(5, 'natrium') + 0.8);
  const lamp = ramp(t, wordOf(5, 'lampu') - 0.4, wordOf(5, 'lampu') + 0.5);
  const star = ramp(t, wordOf(5, 'bintang') - 0.4, wordOf(5, 'bintang') + 0.5);
  const tKode = wordOf(5, 'kode');
  const zOut = 1 - ramp(t, tKode - 0.8, tKode - 0.2, EASE_IN_OUT);
  const code = slot(t, tKode - 0.2, dur + 2);

  // tingkat Nd³⁺
  const yG = 800;
  const yL = 715;
  const yU = 400;
  const yP = 310;
  const LX1 = 200;
  const LX2 = 620;
  const nPop = Math.round(2 + 7 * store);

  // spektrum
  const SX0 = 300;
  const SX1 = 1620;
  const sx = (nm: number) => SX0 + ((nm - 380) / 380) * (SX1 - SX0);
  const SY = 260;
  const SH = 100;
  const ZX0 = 560;
  const ZX1 = 1360;
  const zx = (nm: number) => ZX0 + ((nm - 587.5) / 3.6) * (ZX1 - ZX0);
  const dX = sx(589.3);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <SpectrumDefs id="sun-spec" />
        <defs>
          <linearGradient id="na-zoom" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={wlColor(586)} />
            <stop offset="100%" stopColor={wlColor(592)} />
          </linearGradient>
        </defs>
        {/* ---------- Fase A ---------- */}
        <g opacity={aIn * aOut}>
          <Glow x={960} y={FY} r={420} color="violet" opacity={0.14} />
          <text x={960} y={280} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontSize={48} fill={C.ink} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 5}}>
            Nd
            <tspan fontSize={30} baselineShift="45%">
              3+
            </tspan>
            <tspan dx={10} fill={C.muted}>
              {' · 4f'}
            </tspan>
            <tspan fontSize={30} baselineShift="45%" fill={C.muted}>
              3
            </tspan>
            <tspan dx={12} fontSize={30} fontFamily={FONT.sans} fill={C.muted}>
              {' (laser Nd:YAG)'}
            </tspan>
          </text>
          <Label x={FX(0) - 96} y={FY} size={36} font="serif">
            4f
          </Label>
          {Array.from({length: 7}, (_, i) => {
            const ml = 3 - i;
            const glow = i < 3 ? sL * (0.6 + 0.4 * Math.sin(t * 3 + i)) : 0;
            return (
              <g key={i}>
                <OrbBox x={FX(i)} y={FY} s={92} lit={glow} color={i < 3 ? interpolateColors(sL, [0, 1], [C.ink, C.gold]) : C.ink} />
                <Label x={FX(i)} y={FY + 76} size={26} font="mono" color={i < 3 ? C.gold : C.muted} opacity={0.6 + 0.4 * (i < 3 ? sL : 0)}>
                  {ml > 0 ? `+${ml}` : ml < 0 ? `−${-ml}` : '0'}
                </Label>
              </g>
            );
          })}
          <Label x={FX(6) + 90} y={FY + 76} size={24} font="serif" italic color={C.muted}>
            mₗ
          </Label>
          {[0, 1, 2].map((i) => (
            <SpinArrow key={i} x={FX(i)} y={FY - (1 - spins[i]) * 60 + 3 * Math.sin(t * 2.2 + i)} len={60} opacity={spins[i]} angle={3 * Math.sin(t * 1.6 + i)} />
          ))}
        </g>

        {/* ---------- Fase B ---------- */}
        <g opacity={bIn * bOut}>
          <Level x1={LX1} x2={LX2} y={yP} color={C.muted} width={3} lit={0.3} />
          <rect x={LX1} y={yP - 22} width={LX2 - LX1} height={22} fill={C.muted} opacity={0.12} />
          <Label x={LX2 + 20} y={yP - 12} size={24} anchor="start" color={C.muted}>
            pita pompa
          </Label>
          <Level x1={LX1} x2={LX2} y={yU} color={C.gold} lit={0.4 + 0.6 * store} />
          <Level x1={LX1} x2={LX2} y={yL} color={C.gold} lit={0.3} />
          <Level x1={LX1} x2={LX2} y={yG} color={C.gold} lit={0.3} />
          <TermSVG x={LX2 + 20} y={yU} mult={4} L="F" J="3/2" size={46} anchor="start" />
          <TermSVG x={LX2 + 20} y={yL} mult={4} L="I" J="11/2" size={46} anchor="start" />
          <TermSVG x={LX2 + 20} y={yG} mult={4} L="I" J="9/2" size={46} anchor="start" />
          <TArrow x1={270} y1={yG - 10} x2={270} y2={yP + 10} p={pump} color={C.mint} />
          <Label x={252} y={560} size={24} anchor="end" color={C.mint} opacity={pump}>
            pompa
          </Label>
          <path d={`M300,${yP + 6} q10,15 0,30 q-10,15 0,30 q10,15 0,28`} fill="none" stroke={C.muted} strokeWidth={3} opacity={pump} transform={`translate(30 0)`} />
          <TArrow x1={450} y1={yU + 10} x2={450} y2={yL - 10} p={lase} color={IR} width={8} />
          <Label x={470} y={560} size={28} anchor="start" color="#ff6a6a" opacity={lase}>
            1064 nm
          </Label>
          <path d={`M560,${yL + 8} q10,12 0,24 q-10,12 0,24 q10,12 0,24`} fill="none" stroke={C.muted} strokeWidth={3} opacity={lase} />
          {Array.from({length: nPop}, (_, k) => (
            <circle key={k} cx={240 + k * 40} cy={yU - 16 + 3 * Math.sin(t * 3 + k)} r={9} fill={C.cyan} opacity={0.9 * Math.min(1, store * 9 - k + 2)} />
          ))}
          {/* batang laser */}
          <rect x={940} y={470} width={680} height={100} rx={20} fill="#b9a0e8" opacity={0.18 + 0.1 * beam} stroke="#d8c8ff" strokeOpacity={0.6} strokeWidth={3} />
          <rect x={900} y={440} width={22} height={160} rx={6} fill="#c8d6ff" opacity={0.8} />
          <rect x={1638} y={440} width={14} height={160} rx={5} fill="#c8d6ff" opacity={0.45} />
          <Label x={1280} y={440} size={26} color="#d8c8ff">
            kristal Nd:YAG
          </Label>
          {[0, 1, 2].map((k) => (
            <line key={k} x1={930} y1={500 + k * 20} x2={1630} y2={500 + k * 20} stroke={IR} strokeWidth={4} strokeDasharray="30 22" strokeDashoffset={-t * (90 + k * 20)} opacity={0.75 * beam} />
          ))}
          <line x1={1652} y1={520} x2={mix(1652, 1840, beam)} y2={520} stroke={IR} strokeWidth={30} strokeOpacity={0.22 * beam} strokeLinecap="round" />
          <line x1={1652} y1={520} x2={mix(1652, 1840, beam)} y2={520} stroke={IR} strokeWidth={9} opacity={beam} strokeLinecap="round" />
          <Label x={1280} y={620} size={28} color="#ff6a6a" opacity={beam}>
            berkas 1064 nm · inframerah (tak tampak)
          </Label>
          <Stopwatch x={850} y={yU} r={38} t={t} rate={0.25} color={C.gold} fillFrac={store} opacity={ramp(t, cue(3), cue(3) + 0.6)} />
        </g>

        {/* ---------- Fase C ---------- */}
        <g opacity={cIn}>
          <StarIcon x={180} y={SY + SH / 2} r={46} t={t} color="#fff2b0" />
          <Label x={180} y={SY + SH + 50} size={22} color={C.muted}>
            Matahari
          </Label>
          <rect x={SX0} y={SY} width={SX1 - SX0} height={SH} fill="url(#sun-spec)" />
          {Array.from({length: 70}, (_, k) => {
            const nm = 385 + rand(k * 4.1) * 370;
            return <rect key={`f${k}`} x={sx(nm)} y={SY} width={1 + rand(k * 2.3) * 1.5} height={SH} fill="#05060c" opacity={dark * (0.25 + 0.35 * rand(k * 7.7))} />;
          })}
          {FRAUNHOFER.map((f, k) => (
            <rect key={k} x={sx(f.nm) - f.w / 2} y={SY} width={f.w} height={SH} fill="#05060c" opacity={dark * 0.95} />
          ))}
          {['A', 'B', 'C', 'E', 'F', 'G', 'H', 'K'].map((k) => {
            const f = FRAUNHOFER.find((x) => x.k === k)!;
            return (
              <Label key={k} x={sx(f.nm) + (k === 'K' ? -10 : k === 'H' ? 10 : 0)} y={SY + SH + 22} size={20} font="mono" color={C.muted} opacity={dark * 0.8 * zOut}>
                {k}
              </Label>
            );
          })}
          <rect x={dX - 16} y={SY - 10} width={32} height={SH + 20} rx={6} fill="none" stroke={C.gold} strokeWidth={4} opacity={dBox * (0.75 + 0.25 * Math.sin(t * 4))} />
          <Label x={dX} y={SY - 36} size={36} weight={800} color={C.gold} opacity={dBox}>
            D
          </Label>
          {/* kaca pembesar */}
          <g opacity={zoom * zOut}>
            <line x1={dX - 16} y1={SY + SH + 10} x2={ZX0} y2={460} stroke={C.gold} strokeWidth={2} opacity={0.45} />
            <line x1={dX + 16} y1={SY + SH + 10} x2={ZX1} y2={460} stroke={C.gold} strokeWidth={2} opacity={0.45} />
            <rect x={ZX0} y={460} width={ZX1 - ZX0} height={120} rx={8} fill="url(#na-zoom)" />
            {[588.995, 589.592].map((nm) => (
              <rect key={nm} x={zx(nm) - 9} y={460} width={18} height={120} fill="#05060c" opacity={0.95} />
            ))}
            <rect x={ZX0} y={460} width={ZX1 - ZX0} height={120} rx={8} fill="none" stroke={C.gold} strokeWidth={3} />
            <Label x={ZX0 - 20} y={520} size={22} anchor="end" color={C.muted}>
              serapan
            </Label>
          </g>
          <g opacity={na * zOut}>
            <rect x={ZX0} y={640} width={ZX1 - ZX0} height={70} rx={8} fill="#05060c" stroke={C.faint} strokeWidth={2} />
            {[588.995, 589.592].map((nm, k) => (
              <g key={nm}>
                <rect x={zx(nm) - 18} y={640} width={36} height={70} fill={wlColor(589)} opacity={0.25 + 0.1 * Math.sin(t * 5 + k)} />
                <rect x={zx(nm) - 6} y={640} width={12} height={70} fill="#fff6c0" />
                <line x1={zx(nm)} y1={584} x2={zx(nm)} y2={636} stroke={C.gold} strokeWidth={2} strokeDasharray="5 6" opacity={0.6} />
              </g>
            ))}
            <Label x={ZX1 + 20} y={675} size={22} anchor="start" color={C.muted}>
              pancaran
            </Label>
            <Label x={zx(588.995) - 30} y={745} size={24} anchor="end" color={wlColor(589)} font="mono">
              589,0 nm
            </Label>
            <Label x={zx(589.592) + 30} y={745} size={24} anchor="start" color={wlColor(589)} font="mono">
              589,6 nm
            </Label>
          </g>
          <StreetLamp x={190} y={860} h={270} t={t} on={lamp} opacity={lamp} />
          <PhotonPacket x={mix(300, 470, cyc(((t * 0.4) % 1 + 1) % 1))} y={620} wavelength={30} color={wlColor(589)} amp={14} len={110} opacity={lamp * zOut * 0.8} phase={-t * 10} />
          <StarIcon x={1680} y={640} r={52} t={t + 1} opacity={star} />
          <Label x={1680} y={740} size={22} color={C.muted} opacity={star}>
            bintang
          </Label>
        </g>
      </Stage>

      {/* tally Hund (Fase A) */}
      <HtmlAt x={640} y={590} p={sS * aOut} color={C.violet}>
        <i>S</i> = 3 × ½ = <Frac n="3" d="2" />
      </HtmlAt>
      <HtmlAt x={1000} y={590} p={sL * aOut} color={C.gold}>
        <i>L</i> = 3 + 2 + 1 = 6 <span style={{opacity: sI}}>→ I</span>
      </HtmlAt>
      <HtmlAt x={1380} y={590} p={sJ * aOut} color={C.mint}>
        <i>J</i> = <i>L</i> − <i>S</i> = <Frac n="9" d="2" />
      </HtmlAt>
      <Formula x={960} y={770} p={term} accent={C.gold} size={76} caption="term dasar Nd³⁺ (kurang dari setengah penuh)">
        <TermH mult={4} L="I" J="9/2" />
      </Formula>
      {/* kartu Fase B */}
      <Formula x={1280} y={300} p={slot(t, cue(2) + 0.4, cue(3))} accent={IR} size={60} caption="pancaran laser · 1064 nm (inframerah)">
        <TermH mult={4} L="F" J="3/2" /> → <TermH mult={4} L="I" J="11/2" />
      </Formula>
      <Formula x={1280} y={300} p={slot(t, cue(3) + 0.2, cue(4) - 0.3)} accent={C.amber} size={58} caption="umur keadaan atas ≈ 230 µs → energi tertimbun">
        f → f : <span style={{color: C.red}}>terlarang paritas</span>
      </Formula>
      {/* kartu penutup */}
      <Formula x={960} y={560} p={code} accent={C.gold} size={60} caption="garis D natrium · sama di lampu jalan dan di bintang">
        <TermH mult={2} L="P" J="3/2" odd />, <TermH mult={2} L="P" J="1/2" odd /> → <TermH mult={2} L="S" J="1/2" />
      </Formula>
    </AbsoluteFill>
  );
};
