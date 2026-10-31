import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, mix, ramp, slot, win} from '../anim';
import {Formula, Glow, Label, Stage} from '../components/primitives';
import {Electron, PhotonPacket, wlColor} from '../components/viz';
import {Level, TArrow} from '../components/grupD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 15: tingkat hidrogen per l; 1s→2p (Lyman α, serapan), 3d→2p (Hα, pancaran), 2s→1s dilarang; umur 2s vs 2p.
const COL = {s: 330, p: 640, d: 950};
const HW = 100;
const yN = (n: number) => 230 + 610 / (n * n); // E = −13,6/n² eV → 1: 840, 2: 382, 3: 298
const UV = wlColor(121.6);
const RED = wlColor(656);

const LEVELS: {n: number; l: 's' | 'p' | 'd'}[] = [
  {n: 1, l: 's'},
  {n: 2, l: 's'},
  {n: 3, l: 's'},
  {n: 2, l: 'p'},
  {n: 3, l: 'p'},
  {n: 3, l: 'd'},
];

export const Hydrogen: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const intro = ramp(t, 0.2, 1.6);
  const lvl = LEVELS.map((_, i) => ramp(t, 0.4 + i * 0.18, 1.2 + i * 0.18));

  // 1s → 2p
  const tAbs = wordOf(1, 'menyerap');
  const ph1 = ramp(t, tAbs - 1.3, tAbs, EASE_IN_OUT);
  const a1 = ramp(t, tAbs - 0.1, tAbs + 0.9);
  const e1 = ramp(t, tAbs, tAbs + 0.9, EASE_IN_OUT);
  const e1vis = win(t, cue(0) + 0.6, cue(2) - 0.2);
  const lyman = ramp(t, wordOf(1, 'Lyman') - 0.3, wordOf(1, 'Lyman') + 0.4);

  // 3d → 2p
  const tEm = wordOf(2, 'memancarkan');
  const e2vis = win(t, cue(2) + 0.1, cue(3) + 0.4);
  const e2 = ramp(t, tEm, tEm + 0.8, EASE_IN_OUT);
  const a2 = ramp(t, tEm, tEm + 0.8);
  const ph2 = ramp(t, tEm + 0.5, tEm + 3.2);
  const halpha = ramp(t, wordOf(2, 'merah') - 0.3, wordOf(2, 'merah') + 0.4);

  // Δl & larangan 2s → 1s
  const dl = ramp(t, wordOf(3, 'Keduanya') - 0.2, wordOf(3, 'Keduanya') + 0.6);
  const tBan = wordOf(3, 'Sedangkan');
  const e3vis = ramp(t, tBan - 0.2, tBan + 0.4);
  const ban = ramp(t, tBan + 0.3, tBan + 1.2);
  const cross = ramp(t, wordOf(3, 'dilarang') - 0.1, wordOf(3, 'dilarang') + 0.4);
  const tries = cyc((((t - tBan) * 0.7) % 1 + 1) % 1) * ramp(t, tBan + 0.6, tBan + 1.2);

  // umur: 2s bertahan, 2p turun cepat berulang
  const life = ramp(t, cue(4) - 0.2, cue(4) + 0.6);
  const bar2p = ramp(t, wordOf(4, 'nanodetik') - 0.6, wordOf(4, 'nanodetik') + 0.4);
  const bar2s = ramp(t, wordOf(4, 'bertahan') - 0.2, wordOf(4, 'bertahan') + 2.2, EASE_IN_OUT);
  const cyc2p = ((t - cue(4)) * 0.8 % 1 + 1) % 1;
  const fall = Math.min(1, Math.max(0, (cyc2p - 0.35) / 0.15));
  const e4vis = life * Math.min(1, cyc2p * 5);

  const wob = (k: number) => [6 * Math.sin(t * 2.3 + k), 3 * Math.sin(t * 3.1 + k * 2)];
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // jalur panah
  const P1 = {x1: COL.s + 30, y1: yN(1) - 8, x2: COL.p - 20, y2: yN(2) + 10};
  const P2 = {x1: COL.d - 20, y1: yN(3) + 8, x2: COL.p + 30, y2: yN(2) - 8};

  // posisi elektron
  const ex1 = mix(COL.s, COL.p, e1);
  const ey1 = mix(yN(1), yN(2), e1) - 18;
  const ex2 = mix(COL.d, COL.p + 40, e2);
  const ey2 = mix(yN(3), yN(2), e2) - 18;
  const ex4 = mix(COL.p + 40, COL.s + 40, fall);
  const ey4 = mix(yN(2), yN(1), fall) - 18;

  const lifeX0 = 1060;
  const dec = 70; // px per dekade, sumbu 10⁻¹⁰ … 1 s
  const lx = (sec: number) => lifeX0 + (Math.log10(sec) + 10) * dec;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={560} y={560} r={520} color="violet" opacity={0.12 + 0.03 * Math.sin(t * 0.8)} />
        <g opacity={intro}>
          <Label x={COL.s} y={200} size={28} color={C.blue} font="serif" italic>
            l = 0 (s)
          </Label>
          <Label x={COL.p} y={200} size={28} color={C.amber} font="serif" italic>
            l = 1 (p)
          </Label>
          <Label x={COL.d} y={200} size={28} color={C.blue} font="serif" italic>
            l = 2 (d)
          </Label>
          <line x1={140} y1={860} x2={140} y2={250} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          <Label x={140} y={226} size={28} color={C.muted} font="serif" italic>
            E
          </Label>
          <Label x={160} y={yN(1) + 34} size={20} color={C.muted} anchor="start" font="mono">
            −13,6 eV
          </Label>
        </g>
        {LEVELS.map((L, i) => {
          const x = COL[L.l];
          const col = L.l === 'p' ? C.amber : C.blue;
          const glow = 0.5 + 0.5 * Math.sin(t * 1.4 + i);
          return (
            <g key={i} opacity={lvl[i]}>
              <Level x1={x - HW} x2={x + HW} y={yN(L.n)} color={col} lit={glow} />
              <Label x={x - HW - 14} y={yN(L.n)} size={30} anchor="end" color={C.ink} font="serif">
                {`${L.n}${L.l}`}
              </Label>
            </g>
          );
        })}

        {/* 1s → 2p : foton UV datang, panah serapan */}
        <PhotonPacket x={mix(60, COL.s - 60, ph1)} y={yN(1) - 70} wavelength={26} color={UV} amp={20} len={170} opacity={ph1 > 0 ? 1 - ramp(t, tAbs - 0.2, tAbs + 0.2) : 0} phase={-t * 14} />
        <TArrow {...P1} p={a1} color={UV} opacity={1 - 0.55 * ramp(t, cue(2), cue(2) + 0.6) + 0.55 * dl} />
        <Label x={P1.x1 + 118} y={700} size={28} anchor="start" color={UV} opacity={lyman * (1 - 0.4 * ramp(t, cue(2), cue(2) + 0.6))}>
          Lyman α
        </Label>
        <Label x={P1.x1 + 118} y={650} size={28} anchor="start" color={C.mint} font="serif" italic opacity={dl}>
          Δl = +1
        </Label>

        {/* 3d → 2p : pancaran merah Hα */}
        <TArrow {...P2} p={a2} color={RED} />
        <PhotonPacket x={mix(COL.p + 120, 1060, ph2)} y={mix(yN(2) - 60, 250, ph2)} wavelength={40} color={RED} amp={22} len={200} angle={-14} opacity={ph2 > 0 ? Math.sin(Math.PI * ph2) : 0} phase={-t * 10} />
        <Label x={COL.d - 110} y={436} size={28} anchor="start" color={RED} opacity={halpha}>
          Hα
        </Label>
        <Label x={COL.d - 110} y={480} size={28} anchor="start" color={C.mint} font="serif" italic opacity={dl}>
          Δl = −1
        </Label>

        {/* 2s → 1s dilarang */}
        <g opacity={ban}>
          <line x1={COL.s} y1={yN(2) + 14} x2={COL.s} y2={yN(1) - 34} stroke={C.red} strokeWidth={5} strokeDasharray="14 12" opacity={0.75} />
          <path d={`M${COL.s - 12},${yN(1) - 46} L${COL.s},${yN(1) - 24} L${COL.s + 12},${yN(1) - 46}`} fill="none" stroke={C.red} strokeWidth={5} opacity={0.75} />
        </g>
        <g opacity={cross} transform={`translate(${COL.s} 610) scale(${1.4 - 0.4 * cross})`}>
          <circle r={34} fill="rgba(40,6,16,0.9)" stroke={C.red} strokeWidth={4} />
          <path d="M-15,-15 L15,15 M15,-15 L-15,15" stroke={C.red} strokeWidth={6} strokeLinecap="round" />
        </g>
        <Label x={COL.s - 50} y={610} size={28} anchor="end" color={C.red} font="serif" italic opacity={cross}>
          Δl = 0
        </Label>

        {/* elektron */}
        <Electron x={ex1 + wob(1)[0]} y={ey1 + wob(1)[1]} r={11} opacity={e1vis} />
        <Electron x={ex2 + wob(2)[0]} y={ey2 + wob(2)[1]} r={11} opacity={e2vis} />
        <Electron x={COL.s + wob(3)[0]} y={yN(2) - 18 + wob(3)[1] + 10 * tries} r={11} opacity={e3vis} />
        <Glow x={COL.s} y={yN(2) - 18} r={60 + 8 * Math.sin(t * 3)} color="cyan" opacity={0.5 * life} />
        <Electron x={ex4} y={ey4} r={11} opacity={e4vis * (1 - Math.max(0, (cyc2p - 0.6) / 0.15))} />
        <PhotonPacket x={mix(COL.s + 60, 40, Math.min(1, Math.max(0, (cyc2p - 0.5) / 0.4)))} y={yN(1) - 90} wavelength={22} color={UV} amp={16} len={130} opacity={life * Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (cyc2p - 0.5) / 0.4))))} phase={-t * 14} />

        {/* penggaris umur (skala log) */}
        <g opacity={life}>
          <line x1={lifeX0} y1={740} x2={lx(1) + 20} y2={740} stroke={C.muted} strokeWidth={3} />
          {[
            [1e-9, '1 ns'],
            [1e-6, '1 µs'],
            [1e-3, '1 ms'],
            [1, '1 dtk'],
          ].map(([s, txt]) => (
            <g key={txt as string}>
              <line x1={lx(s as number)} y1={730} x2={lx(s as number)} y2={750} stroke={C.muted} strokeWidth={3} />
              <Label x={lx(s as number)} y={778} size={22} color={C.muted} font="mono">
                {txt}
              </Label>
            </g>
          ))}
          <rect x={lifeX0} y={588} width={(lx(1.6e-9) - lifeX0) * bar2p} height={44} rx={8} fill={C.amber} opacity={0.85} />
          <rect x={lifeX0} y={666} width={(lx(0.12) - lifeX0) * bar2s} height={44} rx={8} fill={C.blue} opacity={0.85} />
          <rect x={lifeX0 + (lx(0.12) - lifeX0) * bar2s - 30} y={666} width={30} height={44} rx={8} fill="#fff" opacity={0.25 * bar2s * (0.5 + 0.5 * Math.sin(t * 4))} />
          <Label x={lifeX0 - 16} y={610} size={30} anchor="end" font="serif" color={C.amber}>
            2p
          </Label>
          <Label x={lifeX0 - 16} y={688} size={30} anchor="end" font="serif" color={C.blue}>
            2s
          </Label>
          <Label x={lx(1.6e-9) + 20} y={610} size={24} anchor="start" color={C.amber} opacity={bar2p}>
            ≈ 1,6 ns
          </Label>
          <Label x={1420} y={820} size={22} color={C.muted} font="mono">
            skala logaritmik
          </Label>
        </g>
      </Stage>

      <Formula x={1410} y={330} p={slot(t, cue(1) + 0.4, cue(2))} accent={UV} size={56} caption="Lyman α · ultraviolet · serapan">
        1s → 2p
        <br />
        10,2 eV ≈ 121,6 nm
      </Formula>
      <Formula x={1410} y={330} p={slot(t, cue(2) + 0.3, cue(3))} accent={RED} size={56} caption="Hα · merah · pancaran">
        3d → 2p
        <br />
        1,89 eV ≈ 656 nm
      </Formula>
      <Formula x={1410} y={330} p={slot(t, cue(3) + 0.2, cue(4))} accent={C.mint} size={56} caption="dipol listrik (E1)">
        <span style={{color: C.mint}}>Δl = ±1</span> ✓
        <br />
        <span style={{color: C.red}}>2s → 1s: Δl = 0 ✗</span>
      </Formula>
      <Formula x={1410} y={360} p={slot(t, cue(4) + 0.1, dur + 2)} accent={C.blue} size={56}>
        <span style={{color: C.blue}}>τ(2s) ≈ 0,1 dtk</span>
        <br />
        <span style={{color: C.amber}}>τ(2p) ≈ 1,6 ns</span>
      </Formula>
    </AbsoluteFill>
  );
};
