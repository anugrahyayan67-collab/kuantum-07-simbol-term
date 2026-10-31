import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Frac, Glow, Label, Stage, Sup} from '../components/primitives';
import {PhotonPacket, wlColor} from '../components/viz';
import {OrbBox, SpectrumDefs, SpinArrow, Stamp, TermH, TestTube} from '../components/grupD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 18: Mn²⁺ d⁵ ⁶S — setiap serapan d→d memaksa spin berbalik (terlarang spin) & d→d terlarang paritas → warna sangat pucat.
const OTHER = ['#7a4be0', '#2f6bff', '#22b46a', '#e0901e', '#1aa7b8'];
const MN = '#ff9cc4';
const BX = [720, 840, 960, 1080, 1200];
const BY = 430;

export const Manganese: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const tubesIn = OTHER.map((_, i) => ramp(t, 0.3 + i * 0.18, 1.1 + i * 0.18));
  const pale = ramp(t, wordOf(0, 'pucat') - 0.6, wordOf(0, 'pucat') + 0.4);
  const toL1 = ramp(t, cue(1) - 0.3, cue(1) + 1.0, EASE_IN_OUT);
  const othersOut = 1 - ramp(t, cue(1) - 0.4, cue(1) + 0.3, EASE_IN_OUT);
  const boxes = ramp(t, cue(1) + 0.2, cue(1) + 0.9);
  const tFive = wordOf(1, 'lima', 0);
  const spinsIn = BX.map((_, i) => ramp(t, tFive - 0.2 + i * 0.16, tFive + 0.3 + i * 0.16));
  const sextet = slot(t, wordOf(1, 'sextet') - 0.3, cue(2) + 0.2);
  const parallel = ramp(t, wordOf(1, 'sejajar') - 0.3, wordOf(1, 'sejajar') + 0.4);

  // foton datang, elektron pindah ke kotak 1 & berbalik
  const tAbs = wordOf(2, 'menyerap');
  const photon = ramp(t, tAbs - 0.6, tAbs + 0.9, EASE_IN_OUT);
  const tMove = wordOf(2, 'berpindah');
  const move = ramp(t, tMove - 0.2, tMove + 1.0, EASE_IN_OUT);
  const tFlip = wordOf(2, 'berbalik');
  const flip = ramp(t, tFlip - 0.4, tFlip + 0.4, EASE_IN_OUT);
  const settle = ramp(t, tFlip + 0.2, tFlip + 0.8, EASE_IN_OUT);
  const quartet = slot(t, tFlip - 0.2, wordOf(3, 'terlarang', 0) - 0.3);
  // larangan
  const none = ramp(t, cue(3) - 0.1, cue(3) + 0.6);
  const banS = ramp(t, wordOf(3, 'terlarang', 0) - 0.2, wordOf(3, 'terlarang', 0) + 0.3);
  const banP = ramp(t, wordOf(3, 'paritas') - 0.2, wordOf(3, 'paritas') + 0.3);
  const orbOut = 1 - ramp(t, cue(4) - 0.4, cue(4) + 0.2, EASE_IN_OUT);
  // spektrum serapan
  const chart = ramp(t, cue(4) + 0.1, cue(4) + 0.8);
  const curveO = ramp(t, cue(4) + 0.4, cue(4) + 1.8, EASE_IN_OUT);
  const curveM = ramp(t, wordOf(4, 'lemah') - 0.6, wordOf(4, 'lemah') + 0.6, EASE_IN_OUT);
  const gone = ramp(t, wordOf(4, 'hilang') - 0.6, wordOf(4, 'hilang') + 0.8);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const mnX = mix(1560, 200, toL1);
  const mnY = mix(500, 560, toL1);
  const mnFill = mix(0.4, 0.16, gone);

  // elektron yang berpindah: dari kotak 5 ke kotak 1 (melengkung di atas)
  const mx = mix(BX[4], BX[0] + 20, move);
  const my = BY - Math.sin(Math.PI * move) * 140;

  const CH = {x0: 560, x1: 1620, y0: 780, top: 330};
  const nmX = (nm: number) => CH.x0 + ((nm - 380) / 380) * (CH.x1 - CH.x0);
  const other = (nm: number) => 340 * Math.exp(-(((nm - 560) / 70) ** 2)) + 60 * Math.exp(-(((nm - 420) / 40) ** 2));
  const mnAbs = (nm: number) => 9 * Math.exp(-(((nm - 530) / 8) ** 2)) + 7 * Math.exp(-(((nm - 400) / 6) ** 2)) + 5 * Math.exp(-(((nm - 445) / 6) ** 2));
  const curve = (f: (nm: number) => number, p: number, wob: number) =>
    Array.from({length: 121}, (_, k) => {
      const nm = 380 + (k / 120) * 380;
      return `${k ? 'L' : 'M'}${nmX(nm).toFixed(1)},${(CH.y0 - f(nm) * p * (1 + wob * Math.sin(t * 2 + k * 0.1))).toFixed(1)}`;
    }).join(' ');

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <SpectrumDefs id="mn-spec" />
        <Glow x={mnX} y={mnY} r={200} color="white" opacity={0.08 + 0.12 * pale} />
        {/* deretan larutan */}
        {OTHER.map((col, i) => (
          <TestTube key={i} x={360 + i * 240} y={500} w={92} h={320} color={col} fill={0.88} t={t} seed={i + 1} opacity={tubesIn[i] * othersOut} />
        ))}
        <TestTube x={mnX} y={mnY} w={92} h={320} color={MN} fill={mnFill} t={t} seed={9} opacity={ramp(t, 1.2, 2.0)} />
        <g opacity={ramp(t, 1.4, 2.4) * othersOut}>
          <line x1={330} y1={700} x2={1350} y2={700} stroke={C.muted} strokeWidth={2} />
          <Label x={840} y={736} size={28} color={C.muted}>
            ion logam transisi lain (ilustrasi)
          </Label>
        </g>
        <g opacity={ramp(t, 1.4, 2.4)}>
          <Label x={mnX} y={mnY + 200} size={34} color={MN} weight={700}>
            Mn²⁺
          </Label>
          <Label x={mnX} y={mnY + 240} size={24} color={C.muted} opacity={pale * othersOut}>
            merah muda sangat pucat
          </Label>
        </g>

        {/* kotak orbital d⁵ */}
        <g opacity={boxes * orbOut}>
          <Label x={BX[0] - 90} y={BY} size={36} font="serif" color={C.ink}>
            3d
          </Label>
          {BX.map((x, i) => (
            <OrbBox key={i} x={x} y={BY} s={100} lit={parallel * (0.5 + 0.5 * Math.sin(t * 2 + i))} />
          ))}
          {BX.map((x, i) => {
            if (i === 4) return null;
            const shift = i === 0 ? -20 * settle : 0;
            return <SpinArrow key={i} x={x + shift} y={BY + 3 * Math.sin(t * 2.4 + i)} len={64} opacity={spinsIn[i]} angle={3 * Math.sin(t * 1.7 + i)} />;
          })}
          <SpinArrow x={mx} y={my + 3 * Math.sin(t * 2.4 + 4)} len={64} opacity={spinsIn[4]} angle={180 * flip + 3 * Math.sin(t * 1.7 + 4)} />
          <path
            d={`M${BX[4]},${BY - 60} Q${(BX[0] + BX[4]) / 2},${BY - 230} ${BX[0] + 20},${BY - 60}`}
            fill="none"
            stroke={C.muted}
            strokeWidth={3}
            strokeDasharray="8 10"
            strokeDashoffset={-t * 20}
            opacity={0.6 * Math.sin(Math.PI * move)}
          />
          <PhotonPacket x={mix(120, BX[0] - 140, photon)} y={BY - 10} wavelength={30} color={wlColor(520)} amp={20} len={160} opacity={Math.sin(Math.PI * photon)} phase={-t * 12} />
          <Label x={960} y={290} size={28} color={C.red} opacity={none}>
            keadaan tereksitasi dengan 5 spin sejajar: tidak ada
          </Label>
        </g>

        {/* spektrum serapan */}
        <g opacity={chart}>
          <line x1={CH.x0} y1={CH.y0} x2={CH.x1 + 20} y2={CH.y0} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          <line x1={CH.x0} y1={CH.y0} x2={CH.x0} y2={CH.top - 20} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          <rect x={CH.x0} y={CH.y0 + 10} width={CH.x1 - CH.x0} height={12} fill="url(#mn-spec)" />
          <Label x={(CH.x0 + CH.x1) / 2} y={CH.y0 + 52} size={26} color={C.muted}>
            panjang gelombang (tampak)
          </Label>
          <Label x={CH.x0 - 20} y={CH.top} size={26} color={C.muted} anchor="end">
            serapan
          </Label>
          <path d={curve(other, curveO, 0.015)} fill="none" stroke={C.violet} strokeWidth={5} />
          <Label x={nmX(560) + 150} y={CH.y0 - 300} size={28} color={C.violet} anchor="start" opacity={curveO}>
            ion logam transisi lain (umum)
          </Label>
          <path d={curve(mnAbs, curveM, 0.06)} fill="none" stroke={MN} strokeWidth={5} />
          <Label x={nmX(640)} y={CH.y0 - 60} size={30} color={MN} weight={700} opacity={curveM}>
            Mn²⁺ : jauh lebih lemah
          </Label>
        </g>
      </Stage>
      <Formula x={960} y={660} p={sextet * orbOut} accent={C.violet} size={66} caption={<>lima spin sejajar</>}>
        d<Sup>5</Sup> : <i>S</i> = 5 × ½ = <Frac n="5" d="2" /> → <TermH mult={6} L="S" J="5/2" />
      </Formula>
      <Formula x={960} y={660} p={quartet} accent={C.red} size={60} caption="satu spin berbalik">
        <i>S</i> : <Frac n="5" d="2" /> → <Frac n="3" d="2" /> &nbsp;⇒&nbsp; <span style={{color: C.red}}>Δ<i>S</i> ≠ 0</span>
      </Formula>
      <Stamp x={760} y={650} p={banS * orbOut} text="TERLARANG SPIN" sub="ΔS ≠ 0" />
      <Stamp x={1200} y={650} p={banP * orbOut} text="TERLARANG PARITAS" sub="d → d: genap → genap" rot={6} />
    </AbsoluteFill>
  );
};
