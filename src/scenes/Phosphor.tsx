import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, mix, ramp} from '../anim';
import {Card, Glow, Label, Stage} from '../components/primitives';
import {Electron, PhotonPacket, Vial, wlColor} from '../components/viz';
import {Level, SpinArrow, Stopwatch, TArrow} from '../components/grupD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 17: diagram Jablonski S₀/S₁/T₁ — fluoresensi cepat, lintas antarsistem, fosforesensi lambat.
const yS0 = 800;
const yS1 = 380;
const yT1 = 500;
const XA = 260; // serapan
const XF = 420; // fluoresensi
const XP = 860; // fosforesensi
const ABS = wlColor(360);
const FLU = wlColor(470);
const PHO = wlColor(600);
const VF = '#3fb8ff';
const VP = '#9dff5a';

const StateLabel: React.FC<{x: number; y: number; s: string; n: string; color: string; opacity?: number}> = ({x, y, s, n, color, opacity = 1}) => (
  <text x={x} y={y} textAnchor="end" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={54} fill={color} opacity={opacity} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 5}}>
    {s}
    <tspan fontSize={34} baselineShift="-28%" fontStyle="normal">
      {n}
    </tspan>
  </text>
);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const seg = (ph: number, a: number, b: number) => clamp01((ph - a) / (b - a));

export const Phosphor: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const lv = [0, 1, 2].map((i) => ramp(t, 0.3 + i * 0.25, 1.1 + i * 0.25));
  const absA = ramp(t, wordOf(0, 'cahaya') - 0.3, wordOf(0, 'cahaya') + 0.6);
  const fluA = ramp(t, wordOf(1, 'Fluoresensi') - 0.2, wordOf(1, 'Fluoresensi') + 0.7);
  const nsL = ramp(t, wordOf(1, 'nanodetik') - 0.4, wordOf(1, 'nanodetik') + 0.3);
  const tCross = wordOf(2, 'menyeberang');
  const iscA = ramp(t, tCross - 0.2, tCross + 1.0);
  const t1Hi = ramp(t, wordOf(2, 'triplet') - 0.3, wordOf(2, 'triplet') + 0.5);
  const tBan = wordOf(3, 'dilarang');
  const phoA = ramp(t, tBan - 0.2, tBan + 2.2, EASE_IN_OUT);
  const msL = ramp(t, wordOf(3, 'milidetik') - 0.4, wordOf(3, 'milidetik') + 0.4);
  const banL = ramp(t, tBan - 0.2, tBan + 0.5);
  const note = ramp(t, cue(4) + 0.2, cue(4) + 1.0);
  const ut = ramp(t, wordOf(4, 'UTS') - 0.5, wordOf(4, 'UTS') + 0.3);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // lampu UV: nyala → padam saat "lambat"
  const tOff = wordOf(3, 'lambat');
  const lampOn = ramp(t, 0.8, 1.6) * (1 - ramp(t, tOff - 0.05, tOff + 0.15));
  const flu = lampOn;
  const pho = ramp(t, 0.8, 2.2) * (t < tOff ? 1 : Math.exp(-(t - tOff) / 3.2));

  // elektron 1: siklus fluoresensi (sampai lintas antarsistem)
  const t0 = wordOf(0, 'cahaya') + 0.2;
  const ph = (((t - t0) / 2.4) % 1 + 1) % 1;
  const running = t > t0 ? 1 : 0;
  let fx = XA;
  let fy = yS0;
  if (running) {
    const up = seg(ph, 0.15, 0.3);
    const slide = seg(ph, 0.3, 0.55);
    const down = seg(ph, 0.55, 0.65);
    const back = seg(ph, 0.65, 1);
    if (ph < 0.55) {
      fx = mix(XA, XF, slide);
      fy = mix(yS0, yS1, up);
    } else {
      fx = mix(XF, XA, back);
      fy = mix(yS1, yS0, down);
    }
  }
  const e1vis = ramp(t, 0.6, 1.2) * (1 - ramp(t, tCross - 0.8, tCross - 0.3));
  const fluPh = running ? seg(ph, 0.6, 1) : 0;
  const absPh = running ? seg(ph, 0, 0.17) : 0;

  // elektron 2: S₁ → T₁ → (tertahan) → S₀ lambat, lalu berulang pelan
  const tDrop = wordOf(3, 'fosforesensi');
  let px = 520;
  let py = yS1;
  let dwell = 0;
  let phoPh = 0;
  if (t < tCross + 1.2) {
    const k = seg(t, tCross, tCross + 1.2);
    px = mix(520, 740, k);
    py = mix(yS1, yT1, k * k);
  } else if (t < tDrop) {
    px = mix(740, XP, seg(t, tCross + 1.2, tDrop - 0.5));
    py = yT1;
    dwell = seg(t, tCross + 1.2, tDrop);
  } else if (t < tDrop + 1.6) {
    px = XP;
    py = mix(yT1, yS0, seg(t, tDrop, tDrop + 1.6) ** 1.4);
    dwell = 1 - seg(t, tDrop, tDrop + 0.4);
    phoPh = seg(t, tDrop + 0.6, tDrop + 3.4);
  } else {
    const q = (((t - tDrop - 1.6) / 5) % 1 + 1) % 1;
    phoPh = t < tDrop + 3.4 ? seg(t, tDrop + 0.6, tDrop + 3.4) : seg(q, 0.86, 1);
    if (q < 0.1) {
      px = mix(XP, XA, seg(q, 0, 0.1));
      py = yS0;
    } else if (q < 0.17) {
      px = XA;
      py = mix(yS0, yS1, seg(q, 0.1, 0.17));
    } else if (q < 0.27) {
      const k = seg(q, 0.17, 0.27);
      px = mix(XA, 740, k);
      py = mix(yS1, yT1, k * k);
    } else if (q < 0.8) {
      px = mix(740, XP, seg(q, 0.27, 0.7));
      py = yT1;
      dwell = seg(q, 0.27, 0.8);
    } else {
      px = XP;
      py = mix(yT1, yS0, seg(q, 0.8, 0.9) ** 1.4);
      dwell = 1 - seg(q, 0.8, 0.84);
    }
  }
  const e2vis = ramp(t, tCross - 0.6, tCross - 0.1);
  const wob = 4 * Math.sin(t * 3);

  const VX1 = 1300;
  const VX2 = 1620;
  const VY = 610;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={560} y={560} r={480} color="violet" opacity={0.12} />
        {/* tingkat */}
        <g opacity={lv[0]}>
          <Level x1={200} x2={1000} y={yS0} color={C.blue} lit={0.5 + 0.5 * Math.sin(t * 1.2)} />
          {[1, 2, 3].map((k) => (
            <line key={k} x1={200} y1={yS0 - k * 18} x2={1000} y2={yS0 - k * 18} stroke={C.blue} strokeWidth={2} opacity={0.25} />
          ))}
          <StateLabel x={180} y={yS0} s="S" n="0" color={C.blue} />
        </g>
        <g opacity={lv[1]}>
          <Level x1={200} x2={560} y={yS1} color={C.cyan} lit={0.5 + 0.5 * Math.sin(t * 1.2 + 1)} />
          {[1, 2, 3].map((k) => (
            <line key={k} x1={200} y1={yS1 - k * 18} x2={560} y2={yS1 - k * 18} stroke={C.cyan} strokeWidth={2} opacity={0.25} />
          ))}
          <StateLabel x={180} y={yS1} s="S" n="1" color={C.cyan} />
          <SpinArrow x={500} y={yS1 - 90} len={44} angle={4 * Math.sin(t * 2)} />
          <SpinArrow x={534} y={yS1 - 90} len={44} angle={180 + 4 * Math.sin(t * 2 + 1)} />
          <Label x={517} y={yS1 - 140} size={22} color={C.muted}>
            singlet
          </Label>
        </g>
        <g opacity={lv[2] * (0.45 + 0.55 * t1Hi)}>
          <Level x1={680} x2={1000} y={yT1} color={C.violet} lit={0.5 + 0.5 * Math.sin(t * 1.2 + 2) + 0.5 * dwell} />
          {[1, 2, 3].map((k) => (
            <line key={k} x1={680} y1={yT1 - k * 18} x2={1000} y2={yT1 - k * 18} stroke={C.violet} strokeWidth={2} opacity={0.25} />
          ))}
          <text x={1040} y={yT1} dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={54} fill={C.violet} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 5}}>
            T
            <tspan fontSize={34} baselineShift="-28%" fontStyle="normal">
              1
            </tspan>
          </text>
          <SpinArrow x={930} y={yT1 - 90} len={44} angle={4 * Math.sin(t * 2)} />
          <SpinArrow x={964} y={yT1 - 90} len={44} angle={4 * Math.sin(t * 2 + 1)} />
          <Label x={947} y={yT1 - 140} size={22} color={C.muted}>
            triplet
          </Label>
        </g>

        {/* panah */}
        <TArrow x1={XA} y1={yS0 - 12} x2={XA} y2={yS1 + 12} p={absA} color={ABS} />
        <Label x={XA - 18} y={600} size={24} anchor="end" color={ABS} opacity={absA}>
          serapan
        </Label>
        <TArrow x1={XF} y1={yS1 + 12} x2={XF} y2={yS0 - 12} p={fluA} color={FLU} />
        <Label x={XF + 20} y={560} size={26} anchor="start" color={FLU} opacity={fluA}>
          fluoresensi
        </Label>
        <Label x={XF + 20} y={600} size={26} anchor="start" color={C.ink} font="mono" opacity={nsL}>
          ≈ ns
        </Label>
        <path
          d={`M560,${yS1 + 4} C620,${yS1 + 10} 640,${yT1 - 30} 700,${yT1 - 4}`}
          fill="none"
          stroke={C.violet}
          strokeWidth={5}
          strokeDasharray="10 9"
          strokeDashoffset={-t * 30}
          opacity={iscA}
        />
        <Label x={700} y={yS1 - 10} size={24} anchor="start" color={C.violet} opacity={iscA}>
          lintas antarsistem
        </Label>
        <TArrow x1={XP} y1={yT1 + 12} x2={XP} y2={yS0 - 12} p={phoA} color={PHO} dash="16 10" />
        <Label x={XP - 20} y={630} size={26} anchor="end" color={PHO} opacity={phoA}>
          fosforesensi
        </Label>
        <Label x={XP + 20} y={630} size={26} anchor="start" color={C.ink} font="mono" opacity={msL}>
          ms – dtk
        </Label>
        <Label x={XP + 20} y={672} size={24} anchor="start" color={C.red} opacity={banL}>
          ΔS ≠ 0 · dilarang spin
        </Label>
        <Stopwatch x={1090} y={yT1 + 120} r={38} t={t} rate={0.15} color={C.violet} fillFrac={dwell} opacity={e2vis * 0.95} />

        {/* elektron & foton */}
        <PhotonPacket x={mix(90, XA - 30, absPh)} y={620} wavelength={18} color={ABS} amp={14} len={110} opacity={e1vis * cyc(absPh)} phase={-t * 14} />
        <PhotonPacket x={mix(XF + 30, 640, fluPh)} y={700} wavelength={26} color={FLU} amp={16} len={120} opacity={e1vis * cyc(fluPh)} phase={-t * 14} />
        <Electron x={fx + wob} y={fy - 18} r={11} opacity={e1vis} />
        <Electron x={px + wob} y={py - 18} r={11} opacity={e2vis} />
        <Glow x={px} y={py - 18} r={50 + 10 * Math.sin(t * 4)} color="violet" opacity={0.6 * dwell * e2vis} />
        <PhotonPacket x={mix(XP + 30, 1150, phoPh)} y={750} wavelength={34} color={PHO} amp={16} len={130} opacity={cyc(phoPh) * e2vis} phase={-t * 8} />

        {/* lampu & dua sampel */}
        <g>
          <rect x={1300} y={250} width={320} height={50} rx={14} fill="#2a3352" stroke="#4a5680" strokeWidth={2} />
          <rect x={1320} y={296} width={280} height={14} rx={5} fill={ABS} opacity={0.25 + 0.75 * lampOn} />
          <path d={`M1330,310 L1180,${VY - 120} L1740,${VY - 120} L1590,310 Z`} fill={ABS} opacity={0.12 * lampOn} />
          <Label x={1460} y={210} size={26} color={C.ink} opacity={0.4 + 0.6 * lampOn} font="mono">
            lampu UV
          </Label>
          <Label x={1660} y={275} size={24} anchor="start" color={ABS} opacity={lampOn} font="mono" weight={700}>
            ON
          </Label>
          <Label x={1660} y={275} size={24} anchor="start" color={C.muted} opacity={1 - lampOn} font="mono" weight={700}>
            OFF
          </Label>
        </g>
        <Vial x={VX1} y={VY} w={130} h={290} color={VF} glow={flu} t={t} />
        <Vial x={VX2} y={VY} w={130} h={290} color={VP} glow={pho} t={t} />
        <Label x={VX1} y={VY + 180} size={26} color={VF}>
          fluoresen
        </Label>
        <Label x={VX2} y={VY + 180} size={26} color={VP}>
          fosforesen
        </Label>
      </Stage>
      <Card x={760} y={848} opacity={note} accent={C.gold} style={{fontSize: 30, padding: '12px 26px'}}>
        Ini keadaan <b style={{color: C.gold}}>molekul</b> — orbital molekul{' '}
        <span style={{color: C.gold, opacity: 0.5 + 0.5 * ut, fontWeight: 700}}>setelah UTS</span>
      </Card>
    </AbsoluteFill>
  );
};
