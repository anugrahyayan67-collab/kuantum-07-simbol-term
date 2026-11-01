import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, rand, ramp, slot} from '../anim';
import {Badge, Card, Formula, Frac, Glow, Label, Stage, Sub, V} from '../components/primitives';
import {Cross, SpinVec} from '../components/grupA';
import {Electron} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 1: spin elektron — s = ½, mₛ = ±½ (α/β), bukan putaran harfiah, Stern–Gerlach (Ag, 1922).
const CX = 700;
const CY = 500;
const R = 260; // piksel per ħ
const PROJ = 0.5 * R;
const RAD = Math.sqrt(0.5) * R; // √(s(s+1) − mₛ²) = √½
const RY = RAD * 0.28;

// Stern–Gerlach
const SG = {y: 500, src: 300, mag0: 640, mag1: 1000, scr: 1520, split: 140};
const defl = (x: number) => (x <= SG.mag0 ? 0 : Math.pow((x - SG.mag0) / (SG.scr - SG.mag0), 1.6));

const half = () => <Frac n="1" d="2" size={0.7} />;

export const Spin: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- A: elektron → spin → kerucut proyeksi ----------
  const grpA = slot(t, -0.3, cue(3) + 0.1, 0.6, 0.5);
  const zoom = ramp(t, wordOf(0, 'bawaan') - 0.6, wordOf(0, 'spin') + 0.3, EASE_IN_OUT);
  const arrow0 = ramp(t, wordOf(0, 'spin') - 0.2, wordOf(0, 'spin') + 0.6, BACK);
  const cones = ramp(t, cue(1) - 0.2, cue(1) + 0.9, EASE_IN_OUT);
  const plus = ramp(t, wordOf(1, 'plus') - 0.3, wordOf(1, 'plus') + 0.5);
  const minus = ramp(t, wordOf(1, 'minus') - 0.3, wordOf(1, 'minus') + 0.5);
  const naik = ramp(t, wordOf(2, 'naik') - 0.3, wordOf(2, 'naik') + 0.4);
  const turun = ramp(t, wordOf(2, 'turun') - 0.3, wordOf(2, 'turun') + 0.4);
  const alfa = ramp(t, wordOf(2, 'alfa') - 0.3, wordOf(2, 'alfa') + 0.4, BACK);
  const beta = ramp(t, wordOf(2, 'beta') - 0.3, wordOf(2, 'beta') + 0.4, BACK);

  const ang = t * 1.3;
  const orbX = CX + 300 * Math.cos(ang);
  const orbY = CY + 110 * Math.sin(ang);
  const elX = mix(orbX, CX, zoom);
  const elY = mix(orbY, CY, zoom);
  const elR = mix(14, 46, zoom) * mix(1, 0.6, cones);
  const wob = 0.12 * Math.sin(t * 2.1);
  const phi = t * 1.6;
  const upTip = {x: CX + RAD * Math.cos(phi), y: CY - PROJ + RY * Math.sin(phi)};
  const dnTip = {x: CX + RAD * Math.cos(phi + Math.PI), y: CY + PROJ + RY * Math.sin(phi + Math.PI)};

  // ---------- B: bukan bola berputar ----------
  const grpB = slot(t, cue(3) - 0.05, cue(4) + 0.05, 0.6, 0.45);
  const cross = ramp(t, wordOf(3, 'berputar') + 0.1, wordOf(3, 'berputar') + 0.9, EASE_IN_OUT);
  const murni = ramp(t, wordOf(3, 'murni') - 0.3, wordOf(3, 'murni') + 0.4);
  const klasik = ramp(t, wordOf(3, 'klasik') - 0.3, wordOf(3, 'klasik') + 0.4);
  const ballFade = mix(1, 0.45, ramp(t, wordOf(3, 'Spin') - 0.2, wordOf(3, 'Spin') + 0.6));

  // ---------- C: Stern–Gerlach ----------
  const grpC = ramp(t, cue(4) - 0.05, cue(4) + 0.6);
  const oven = ramp(t, wordOf(4, 'perak') - 0.4, wordOf(4, 'perak') + 0.4);
  const field = ramp(t, wordOf(4, 'magnet') - 0.4, wordOf(4, 'magnet') + 0.5);
  const flow = ramp(t, wordOf(4, 'melewati') - 0.3, wordOf(4, 'melewati') + 0.8);
  const ghost = ramp(t, wordOf(4, 'homogen') - 0.2, wordOf(4, 'homogen') + 0.5) * (1 - 0.65 * ramp(t, wordOf(4, 'dua') - 0.2, wordOf(4, 'dua') + 0.6));
  const spots = ramp(t, wordOf(4, 'terbelah') - 0.2, wordOf(4, 'dua') + 0.4);
  const dua = ramp(t, wordOf(4, 'dua') - 0.3, wordOf(4, 'dua') + 0.5, BACK);

  return (
    <AbsoluteFill>
      <Stage>
        {/* ================= A ================= */}
        <g opacity={grpA}>
          {/* inti + lintasan orbital (hilang saat kamera mendekat) */}
          <g opacity={1 - zoom}>
            <ellipse cx={CX} cy={CY} rx={300} ry={110} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="6 8" />
            <Glow x={CX} y={CY} r={70} color="gold" opacity={0.6} />
            <circle cx={CX} cy={CY} r={24} fill="#c9873a" />
            <Label x={CX} y={CY + 170} size={26} color={C.muted}>
              bergerak di orbital…
            </Label>
          </g>
          {/* kerucut proyeksi */}
          <g opacity={cones}>
            <line x1={CX} y1={CY + 230} x2={CX} y2={CY - 230} stroke={C.muted} strokeWidth={2} strokeDasharray="5 7" />
            <Label x={CX + 18} y={CY - 246} size={28} color={C.muted} font="serif" italic anchor="start">
              z
            </Label>
            {[1, -1].map((s) => {
              const on = s > 0 ? 1 : minus;
              const col = s > 0 ? C.cyan : C.pink;
              const yc = CY - s * PROJ;
              return (
                <g key={s} opacity={on}>
                  <line x1={CX} y1={CY} x2={CX - RAD} y2={yc} stroke={col} strokeWidth={1.5} opacity={0.3} />
                  <line x1={CX} y1={CY} x2={CX + RAD} y2={yc} stroke={col} strokeWidth={1.5} opacity={0.3} />
                  <ellipse cx={CX} cy={yc} rx={RAD} ry={RY} fill={col} fillOpacity={0.06} stroke={col} strokeWidth={2} strokeDasharray="6 6" opacity={0.7} />
                  <rect x={CX - 14} y={yc - 1.5} width={28} height={3} fill={col} />
                </g>
              );
            })}
          </g>
          {/* elektron */}
          <Electron x={elX} y={elY} r={elR} />
          {/* panah spin awal (tegak, sedikit bergoyang) → digantikan vektor pada kerucut */}
          <SpinVec
            x1={elX - 150 * Math.sin(wob) * arrow0}
            y1={elY + 150 * Math.cos(wob) * arrow0 * 0.9}
            x2={elX + 150 * Math.sin(wob) * arrow0}
            y2={elY - 150 * Math.cos(wob) * arrow0}
            color={C.cyan}
            width={8}
            opacity={arrow0 * (1 - cones)}
          />
          <SpinVec x1={CX} y1={CY} x2={upTip.x} y2={upTip.y} color={C.cyan} width={7} opacity={cones} />
          <SpinVec x1={CX} y1={CY} x2={dnTip.x} y2={dnTip.y} color={C.pink} width={7} opacity={cones * minus} />
          {/* label proyeksi */}
          <g opacity={cones}>
            <text x={CX + RAD + 30} y={CY - PROJ} dominantBaseline="central" fontFamily={FONT.serif} fontSize={36} fill={C.cyan} opacity={plus}>
              +½ ħ
            </text>
            <text x={CX + RAD + 30} y={CY + PROJ} dominantBaseline="central" fontFamily={FONT.serif} fontSize={36} fill={C.pink} opacity={minus}>
              −½ ħ
            </text>
            <g opacity={naik}>
              <Label x={CX - RAD - 36} y={CY - PROJ - 18} size={32} color={C.cyan} anchor="end" weight={700}>
                spin naik ↑
              </Label>
              <Label x={CX - RAD - 36} y={CY - PROJ + 30} size={40} color={C.cyan} anchor="end" font="serif" italic opacity={alfa}>
                α
              </Label>
            </g>
            <g opacity={turun}>
              <Label x={CX - RAD - 36} y={CY + PROJ - 18} size={32} color={C.pink} anchor="end" weight={700}>
                spin turun ↓
              </Label>
              <Label x={CX - RAD - 36} y={CY + PROJ + 30} size={40} color={C.pink} anchor="end" font="serif" italic opacity={beta}>
                β
              </Label>
            </g>
          </g>
        </g>

        {/* ================= B ================= */}
        <g opacity={grpB}>
          <defs>
            <radialGradient id="sp-ball" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#d8e4ff" />
              <stop offset="45%" stopColor="#5a6ea8" />
              <stop offset="100%" stopColor="#141c38" />
            </radialGradient>
          </defs>
          <g opacity={ballFade}>
            <circle cx={CX} cy={CY} r={150} fill="url(#sp-ball)" />
            {Array.from({length: 6}, (_, k) => {
              const th = t * 2.4 + (k * Math.PI) / 6;
              const rx = 150 * Math.abs(Math.cos(th));
              return <ellipse key={k} cx={CX} cy={CY} rx={Math.max(1, rx)} ry={150} fill="none" stroke="#e6ecff" strokeWidth={2} opacity={0.18 + 0.25 * Math.max(0, Math.sin(th))} />;
            })}
            <ellipse cx={CX} cy={CY} rx={150} ry={36} fill="none" stroke="#e6ecff" strokeWidth={2} opacity={0.3} />
            {/* panah putar */}
            <path d={`M${CX - 120},${CY - 200} A140,40 0 0 0 ${CX + 120},${CY - 200}`} fill="none" stroke={C.amber} strokeWidth={6} strokeLinecap="round" transform={`translate(0 ${-6 * Math.sin(t * 2)})`} />
            <path d={`M${CX + 120},${CY - 200} l-26,-16 l6,26 Z`} fill={C.amber} transform={`translate(0 ${-6 * Math.sin(t * 2)})`} />
          </g>
          <Cross x={CX} y={CY} r={130} p={cross} width={14} />
        </g>

        {/* ================= C: Stern–Gerlach ================= */}
        <g opacity={grpC}>
          {/* tungku */}
          <g opacity={oven}>
            <rect x={150} y={SG.y - 60} width={150} height={120} rx={16} fill="#3a2414" stroke={C.amber} strokeWidth={3} />
            <Glow x={260} y={SG.y} r={60} color="red" opacity={0.4 + 0.15 * Math.sin(t * 5)} />
            <Label x={225} y={SG.y + 100} size={24} color={C.muted}>
              tungku atom perak (Ag)
            </Label>
            <rect x={420} y={SG.y - 70} width={10} height={58} fill="#59628c" />
            <rect x={420} y={SG.y + 12} width={10} height={58} fill="#59628c" />
          </g>
          {/* magnet tak homogen: kutub runcing di atas, berlekuk di bawah */}
          <g opacity={field}>
            <path d={`M${SG.mag0},250 L${SG.mag1},250 L${SG.mag1},380 L820,452 L${SG.mag0},380 Z`} fill="#5a2230" stroke={C.red} strokeWidth={3} strokeLinejoin="round" />
            <path d={`M${SG.mag0},750 L${SG.mag1},750 L${SG.mag1},580 L880,580 L820,626 L760,580 L${SG.mag0},580 Z`} fill="#1f2e5a" stroke={C.blue} strokeWidth={3} strokeLinejoin="round" />
            <Label x={820} y={310} size={34} weight={700}>
              N
            </Label>
            <Label x={820} y={700} size={34} weight={700}>
              S
            </Label>
            {[-1, 0, 1].map((k) => (
              <path
                key={k}
                d={`M${820 + k * 120},${626 + Math.abs(k) * -40} Q${820 + k * 60},520 820,456`}
                fill="none"
                stroke={C.violet}
                strokeWidth={2}
                strokeDasharray="6 8"
                strokeDashoffset={t * 20}
                opacity={0.55}
              />
            ))}
            <Label x={820} y={795} size={24} color={C.muted}>
              medan magnet tak homogen
            </Label>
          </g>
          {/* layar */}
          <rect x={SG.scr} y={290} width={30} height={420} rx={4} fill="rgba(12,18,40,0.92)" stroke={C.faint} strokeWidth={2} />
          {/* dugaan klasik: pita menyebar */}
          <g opacity={ghost}>
            <rect x={SG.scr + 4} y={SG.y - SG.split - 20} width={22} height={2 * SG.split + 40} rx={10} fill={C.muted} opacity={0.35} />
            <Label x={SG.scr + 15} y={262} size={22} color={C.muted}>
              dugaan klasik: pita menyebar
            </Label>
          </g>
          {/* atom-atom yang terbang */}
          <g opacity={flow}>
            {Array.from({length: 30}, (_, i) => {
              const ph = (((t - cue(4)) * 0.3 + i / 30) % 1 + 1) % 1;
              const x = mix(SG.src, SG.scr, ph);
              const s = rand(i * 7.31 + 0.5) > 0.5 ? 1 : -1;
              const y = SG.y - s * SG.split * defl(x) + (rand(i * 3.3) - 0.5) * 8;
              const sorted = ramp(x, SG.mag0, SG.mag0 + 200);
              return (
                <g key={i} opacity={cyc(ph)}>
                  <circle cx={x} cy={y} r={7} fill="#c0c8de" opacity={1 - sorted} />
                  <circle cx={x} cy={y} r={7} fill={s > 0 ? C.cyan : C.pink} opacity={sorted} />
                </g>
              );
            })}
          </g>
          {/* dua titik di layar */}
          {[1, -1].map((s) => (
            <g key={s} opacity={spots}>
              <Glow x={SG.scr + 15} y={SG.y - s * SG.split} r={70} color={s > 0 ? 'cyan' : 'violet'} opacity={0.6 + 0.2 * Math.sin(t * 3 + s)} />
              <ellipse cx={SG.scr + 15} cy={SG.y - s * SG.split} rx={14} ry={28} fill={s > 0 ? C.cyan : C.pink} />
              <text x={SG.scr + 54} y={SG.y - s * SG.split} dominantBaseline="central" fontFamily={FONT.serif} fontSize={34} fill={s > 0 ? C.cyan : C.pink}>
                {s > 0 ? '↑ +½' : '↓ −½'}
              </text>
            </g>
          ))}
          <g opacity={dua}>
            <Label x={SG.scr + 54} y={SG.y} size={32} color={C.gold} anchor="start" weight={700}>
              tepat dua berkas
            </Label>
          </g>
        </g>
      </Stage>
      <Formula x={1400} y={420} p={slot(t, cue(1) - 0.1, wordOf(1, 'proyeksinya') + 0.1)} accent={C.cyan} caption="bilangan kuantum spin">
        <V>s</V>&nbsp;=&nbsp;
        <Frac n="1" d="2" />
      </Formula>
      <Formula x={1400} y={420} p={slot(t, wordOf(1, 'proyeksinya') + 0.1, cue(3) + 0.05)} accent={C.cyan} caption="proyeksi pada sumbu z: hanya dua">
        <V>m</V>
        <Sub>s</Sub>&nbsp;=&nbsp;<span style={{color: C.cyan}}>+{half()}</span>
        <span style={{fontFamily: FONT.sans, fontSize: '0.5em', color: C.muted}}>&nbsp;atau&nbsp;</span>
        <span style={{color: C.pink}}>−{half()}</span>
      </Formula>
      <Card x={1360} y={460} opacity={grpB * ramp(t, cue(3) + 0.3, cue(3) + 0.9)} accent={C.red} anchor="center" style={{padding: '26px 40px'}}>
        <div style={{fontSize: 36, fontWeight: 700, color: C.red}}>✗ bukan bola kecil berputar</div>
        <div style={{fontSize: 36, fontWeight: 700, color: C.mint, marginTop: 18, opacity: murni}}>✓ sifat kuantum murni</div>
        <div style={{fontSize: 28, color: C.muted, marginTop: 10, opacity: klasik}}>tanpa padanan klasik yang tepat</div>
      </Card>
      <Badge x={960} y={196} text="STERN & GERLACH · 1922" color={C.cyan} opacity={grpC * oven} />
    </AbsoluteFill>
  );
};
