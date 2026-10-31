import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Label, Op, Stage, Sub, Sup} from '../components/primitives';
import {Mark} from '../components/grupC';
import {PhotonPacket} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 12: paritas. Inversi r → −r (di bidang = putar 180°): s, d genap (tetap), p, f ganjil (tanda fase bertukar).
// π = (−1)^Σl; operator dipol ganjil → integral ⟨f|d|i⟩ ≠ 0 hanya bila paritas berlawanan (AUDIT).
const PLUS = C.pink;
const MINUS = C.cyan;
const ORB_N: Record<string, number> = {s: 0, p: 1, d: 2, f: 3};
const isOdd = (o: string) => ORB_N[o] % 2 === 1;

/** Orbital 2D: lobus r = R|cos nθ| berwarna fase (+ merah muda, − sian), diputar rot (inversi = rot π). */
const Orb: React.FC<{x: number; y: number; o: string; R: number; rot: number; opacity?: number}> = ({x, y, o, R, rot, opacity = 1}) => {
  if (opacity <= 0.001) return null;
  const n = ORB_N[o];
  if (n === 0)
    return (
      <g opacity={opacity}>
        <circle cx={x} cy={y} r={R * 0.62} fill={PLUS} opacity={0.32} />
        <circle cx={x} cy={y} r={R * 0.62} fill="none" stroke={PLUS} strokeWidth={4} />
        <Label x={x} y={y} size={R * 0.3} color="#fff" weight={800}>
          +
        </Label>
      </g>
    );
  const lobes = Array.from({length: 2 * n}, (_, k) => {
    const a = (-Math.PI / 2 + k * Math.PI) / n;
    const b = (Math.PI / 2 + k * Math.PI) / n;
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const th = mix(a, b, i / 40);
      const r = R * Math.abs(Math.cos(n * th));
      pts.push(`${(x + r * Math.cos(th + rot)).toFixed(1)},${(y - r * Math.sin(th + rot)).toFixed(1)}`);
    }
    const mid = (a + b) / 2;
    return {d: `M${pts.join(' L')} Z`, sign: k % 2 === 0 ? 1 : -1, lx: x + R * 0.62 * Math.cos(mid + rot), ly: y - R * 0.62 * Math.sin(mid + rot)};
  });
  return (
    <g opacity={opacity}>
      {lobes.map((l, k) => (
        <g key={k}>
          <path d={l.d} fill={l.sign > 0 ? PLUS : MINUS} opacity={0.3} />
          <path d={l.d} fill="none" stroke={l.sign > 0 ? PLUS : MINUS} strokeWidth={3.5} strokeLinejoin="round" />
          <Label x={l.lx} y={l.ly} size={Math.max(20, R * (n === 3 ? 0.17 : 0.24))} color="#fff" weight={800}>
            {l.sign > 0 ? '+' : '−'}
          </Label>
        </g>
      ))}
    </g>
  );
};

/** Sudut putar bertahap: tiap periode berputar π (inversi) lalu diam — kontinu. */
const steps = (t: number, t0: number, period = 3.6, move = 1.5) => {
  if (t <= t0) return 0;
  const k = Math.floor((t - t0) / period);
  const f = ramp((t - t0) % period, 0, move, EASE_IN_OUT);
  return Math.PI * (k + f);
};

// grafik integran: kiri ganjil (paritas sama) → luas 0; kanan genap (paritas berlawanan) → luas ≠ 0
const PL = [
  {xc: 560, f: (u: number) => u * Math.exp(-u * u), title: 'paritas sama', sub: 's → s', ok: false},
  {xc: 1360, f: (u: number) => u * u * Math.exp(-u * u) * 1.15, title: 'paritas berlawanan', sub: 's → p', ok: true},
];
const PW = 540;
const PY = 600;
const PS = 230;

export const Parity: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  // baris 0: tangga tingkat, satu lompatan lolos, satu ditolak
  const intro = slot(t, cue(0) - 0.2, cue(1) - 0.05, 0.6, 0.45);
  const jumpA = ramp(t, cue(0) + 0.6, cue(0) + 1.6, EASE_IN_OUT);
  const jumpB = ramp(t, cue(0) + 2.0, cue(0) + 3.2);
  const keyWord = ramp(t, wordOf(0, 'paritas') - 0.3, wordOf(0, 'paritas') + 0.4, BACK);
  // baris 1: inversi s dan p
  const inv = slot(t, cue(1) - 0.05, cue(2) - 0.05, 0.6, 0.45);
  const rot1 = steps(t, wordOf(1, 'dibalik') - 0.2, 4.2, 1.6);
  const keep = ramp(t, wordOf(1, 'tetap') - 0.2, wordOf(1, 'tetap') + 0.5);
  const flip = ramp(t, wordOf(1, 'berganti') - 0.2, wordOf(1, 'berganti') + 0.5);
  const card1 = slot(t, wordOf(1, 'Paritas') + 0.2, cue(2) - 0.05);
  // baris 2: s p d f
  const row = slot(t, cue(2) - 0.05, cue(3) - 0.05, 0.6, 0.45);
  const rot2 = steps(t, cue(2) + 0.6, 3.4, 1.5);
  const even = ramp(t, wordOf(2, 'genap') - 0.2, wordOf(2, 'genap') + 0.5);
  const odd = ramp(t, wordOf(2, 'ganjil') - 0.2, wordOf(2, 'ganjil') + 0.5);
  const card2 = slot(t, wordOf(2, 'konfigurasi') - 0.3, cue(3) - 0.05);
  // baris 3: operator dipol
  const dip = slot(t, cue(3) - 0.05, cue(4) - 0.05, 0.6, 0.45);
  const rot3 = steps(t, wordOf(3, 'ganjil') - 0.3, 3.0, 1.3);
  const card3 = slot(t, wordOf(3, 'operator', 0) - 0.2, cue(4) - 0.05);
  // baris 4: integral transisi
  const integ = slot(t, cue(4) - 0.05, cue(5) - 0.05, 0.6, 0.45);
  const sweep = ramp(t, cue(4) + 0.6, cue(4) + 3.6, EASE_IN_OUT);
  const verdict = ramp(t, cue(4) + 3.5, cue(4) + 4.1, BACK);
  const card4 = slot(t, cue(4) - 0.05, cue(5) - 0.05);
  // baris 5: aturan
  const rule = ramp(t, cue(5) - 0.05, cue(5) + 0.6);
  const card5 = slot(t, wordOf(5, 'genap', 0) - 0.3, dur + 2);
  const hop = (t - cue(5)) * 0.55;
  const rp = Math.max(0, hop % 1);

  // ---- tangga baris 0 ----
  const LVL = [780, 620, 450];
  return (
    <AbsoluteFill>
      <Stage>
        {/* ===== baris 0 ===== */}
        <g opacity={intro}>
          {LVL.map((y, k) => (
            <line key={k} x1={700} y1={y} x2={1220} y2={y} stroke={k === 0 ? C.ink : C.muted} strokeWidth={k === 0 ? 5 : 4} strokeLinecap="round" />
          ))}
          {/* lompatan diizinkan */}
          <path d={`M820,${LVL[0] - 6} L820,${mix(LVL[0] - 6, LVL[1] + 10, jumpA)}`} stroke={C.mint} strokeWidth={6} strokeLinecap="round" opacity={Math.min(1, jumpA * 8)} />
          <circle cx={820} cy={mix(LVL[0] - 14, LVL[1] - 14, jumpA)} r={13} fill={C.cyan} />
          <Mark x={760} y={(LVL[0] + LVL[1]) / 2} ok p={ramp(jumpA, 0.8, 1)} size={26} />
          {/* lompatan ditolak: naik setengah lalu memantul */}
          <path d={`M1080,${LVL[0] - 6} L1080,${LVL[0] - 6 - 220 * Math.sin(Math.PI * Math.min(1, jumpB)) * 0.75}`} stroke={C.red} strokeWidth={6} strokeLinecap="round" strokeDasharray="10 10" opacity={Math.min(1, Math.sin(Math.PI * jumpB) * 5)} />
          <circle cx={1080} cy={LVL[0] - 14 - 220 * Math.sin(Math.PI * jumpB) * 0.75} r={13} fill={C.cyan} />
          <Mark x={1150} y={LVL[2] + 40} ok={false} p={ramp(t, cue(0) + 2.6, cue(0) + 3.2)} size={30} />
          <Label x={960} y={300} size={60} color={C.gold} weight={700} opacity={keyWord}>
            kuncinya: paritas
          </Label>
        </g>

        {/* ===== baris 1: inversi ===== */}
        <g opacity={inv}>
          {[
            {o: 's', x: 620},
            {o: 'p', x: 1180},
          ].map(({o, x}) => {
            const odd1 = isOdd(o);
            return (
              <g key={o}>
                <circle cx={x} cy={580} r={200} fill="none" stroke={odd1 ? C.amber : C.blue} strokeWidth={2} strokeDasharray="4 10" opacity={0.6} />
                <Orb x={x} y={580} o={o} R={170} rot={rot1} />
                <circle cx={x} cy={580} r={6} fill={C.ink} />
                <Label x={x - 230} y={400} size={44} color={C.ink} weight={700} font="mono">
                  {o}
                </Label>
                <Label x={x} y={820} size={34} color={odd1 ? C.amber : C.blue} weight={700} opacity={odd1 ? flip : keep}>
                  {odd1 ? 'berganti tanda' : 'tetap'}
                </Label>
              </g>
            );
          })}
          {/* titik r dibalik melalui pusat */}
          {(() => {
            const a0 = 0.5;
            const cx0 = 1180;
            const r = 120;
            // titik bergerak lurus melalui pusat: r → −r → r …
            const sgn = Math.cos(rot1);
            const px = cx0 + sgn * r * Math.cos(a0);
            const py = 580 - sgn * r * Math.sin(a0);
            return (
              <g opacity={ramp(t, wordOf(1, 'koordinat') - 0.2, wordOf(1, 'koordinat') + 0.4)}>
                <path d={`M${cx0 + r * Math.cos(a0)},${580 - r * Math.sin(a0)} L${cx0 - r * Math.cos(a0)},${580 + r * Math.sin(a0)}`} stroke={C.ink} strokeWidth={2} strokeDasharray="5 7" opacity={0.6} />
                <circle cx={px} cy={py} r={11} fill={C.gold} />
                <Label x={cx0 + (r + 40) * Math.cos(a0)} y={580 - (r + 40) * Math.sin(a0)} size={30} color={C.gold} font="serif" italic weight={600}>
                  r
                </Label>
                <Label x={cx0 - (r + 46) * Math.cos(a0)} y={580 + (r + 46) * Math.sin(a0)} size={30} color={C.gold} font="serif" italic weight={600}>
                  −r
                </Label>
              </g>
            );
          })()}
        </g>

        {/* ===== baris 2: s p d f ===== */}
        <g opacity={row}>
          {['s', 'p', 'd', 'f'].map((o, i) => {
            const x = 390 + i * 380;
            const od = isOdd(o);
            const tag = od ? odd : even;
            return (
              <g key={o}>
                <circle cx={x} cy={570} r={150} fill={od ? C.amber : C.blue} opacity={0.07 * tag} />
                <circle cx={x} cy={570} r={150} fill="none" stroke={od ? C.amber : C.blue} strokeWidth={3} opacity={0.25 + 0.75 * tag} />
                <Orb x={x} y={570} o={o} R={130} rot={rot2} />
                <Label x={x - 130} y={420} size={44} weight={700} font="mono">
                  {o}
                </Label>
                <Label x={x} y={760} size={34} color={od ? C.amber : C.blue} weight={700} opacity={tag}>
                  {od ? `ganjil (l = ${ORB_N[o]})` : `genap (l = ${ORB_N[o]})`}
                </Label>
              </g>
            );
          })}
        </g>

        {/* ===== baris 3: operator dipol ===== */}
        <g opacity={dip}>
          <PhotonPacket x={mix(380, 640, (t * 0.35) % 1)} y={580} wavelength={46} color={C.gold} amp={30} len={260} phase={-t * 8} opacity={Math.min(1, ((t * 0.35) % 1) * 6) * (1 - ((t * 0.35) % 1))} />
          <circle cx={1000} cy={580} r={220} fill="none" stroke={C.amber} strokeWidth={2} strokeDasharray="4 10" opacity={0.6} />
          <circle cx={1000} cy={580} r={22} fill={C.amber} />
          {(() => {
            const ang = 0.35 + rot3;
            const ex = 1000 + 170 * Math.cos(ang);
            const ey = 580 - 170 * Math.sin(ang);
            const hx = 1000 + 150 * Math.cos(ang);
            const hy = 580 - 150 * Math.sin(ang);
            const nx = -Math.sin(ang);
            const ny = -Math.cos(ang);
            return (
              <g>
                <path d={`M${1000 + 26 * Math.cos(ang)},${580 - 26 * Math.sin(ang)} L${hx},${hy}`} stroke={C.amber} strokeWidth={7} strokeLinecap="round" />
                <path d={`M${ex},${ey} L${hx + nx * 14},${hy + ny * 14} L${hx - nx * 14},${hy - ny * 14} Z`} fill={C.amber} />
                <Label x={1000 + 215 * Math.cos(ang)} y={580 - 215 * Math.sin(ang)} size={36} color={C.amber} font="serif" italic weight={600}>
                  r
                </Label>
              </g>
            );
          })()}
          <Label x={1000} y={850 - 20} size={32} color={C.amber} weight={700} opacity={ramp(t, wordOf(3, 'ganjil') - 0.2, wordOf(3, 'ganjil') + 0.5)}>
            dibalik → arah berlawanan: ganjil
          </Label>
        </g>

        {/* ===== baris 4: integral transisi ===== */}
        <g opacity={integ}>
          {PL.map((pl, k) => {
            const x0 = pl.xc - PW / 2;
            const N = 120;
            const xs = Array.from({length: N + 1}, (_, i) => -3 + (6 * i) / N);
            const X = (u: number) => pl.xc + (u / 3) * (PW / 2);
            const uMax = -3 + 6 * sweep;
            const pos: string[] = [];
            const neg: string[] = [];
            let area = 0;
            xs.forEach((u) => {
              const v = pl.f(u);
              if (u <= uMax) area += (v * 6) / N;
            });
            const shown = xs.filter((u) => u <= uMax);
            shown.forEach((u) => {
              const v = pl.f(u);
              pos.push(`${X(u).toFixed(1)},${(PY - Math.max(0, v) * PS).toFixed(1)}`);
              neg.push(`${X(u).toFixed(1)},${(PY - Math.min(0, v) * PS).toFixed(1)}`);
            });
            const curve = xs.map((u, i) => `${i ? 'L' : 'M'}${X(u).toFixed(1)},${(PY - pl.f(u) * PS).toFixed(1)}`).join(' ');
            const baseEnd = shown.length ? X(shown[shown.length - 1]) : x0;
            return (
              <g key={k}>
                <Label x={pl.xc} y={420} size={34} weight={700} color={C.ink}>
                  {pl.title}
                </Label>
                <Label x={pl.xc} y={462} size={26} color={C.muted} font="mono">
                  {`${pl.sub} · integran ${pl.ok ? 'genap' : 'ganjil'}`}
                </Label>
                <line x1={x0} y1={PY} x2={x0 + PW} y2={PY} stroke={C.faint} strokeWidth={2} />
                <line x1={pl.xc} y1={PY - 110} x2={pl.xc} y2={PY + 110} stroke={C.faint} strokeWidth={1.5} strokeDasharray="4 6" />
                {shown.length > 1 ? (
                  <>
                    <path d={`M${X(shown[0])},${PY} L${pos.join(' L')} L${baseEnd},${PY} Z`} fill={PLUS} opacity={0.4} />
                    <path d={`M${X(shown[0])},${PY} L${neg.join(' L')} L${baseEnd},${PY} Z`} fill={MINUS} opacity={0.4} />
                  </>
                ) : null}
                <path d={curve} fill="none" stroke={C.ink} strokeWidth={3.5} />
                {/* meter luas kumulatif */}
                <line x1={pl.xc - 230} y1={760} x2={pl.xc + 230} y2={760} stroke={C.faint} strokeWidth={2} />
                <line x1={pl.xc} y1={744} x2={pl.xc} y2={776} stroke={C.muted} strokeWidth={2} />
                <rect x={pl.xc + Math.min(0, area * 200)} y={750} width={Math.abs(area * 200)} height={20} rx={4} fill={area >= 0 ? PLUS : MINUS} opacity={0.85} />
                <Label x={pl.xc - 250} y={760} size={26} color={C.muted} anchor="end" font="serif" italic>
                  ∫
                </Label>
                <Label x={pl.xc + 40} y={820} size={36} color={pl.ok ? C.mint : C.red} weight={700} anchor="start" opacity={verdict}>
                  {pl.ok ? '∫ ≠ 0 · diizinkan' : '∫ = 0 · dilarang'}
                </Label>
                <Mark x={pl.xc} y={820} ok={pl.ok} p={verdict} size={26} />
              </g>
            );
          })}
        </g>

        {/* ===== baris 5: genap ↔ ganjil ===== */}
        <g opacity={rule}>
          {[
            {x: 640, txt: 'genap', col: C.blue},
            {x: 1280, txt: 'ganjil', col: C.amber},
          ].map((b) => (
            <g key={b.txt}>
              <rect x={b.x - 150} y={540} width={300} height={130} rx={24} fill={`${b.col}22`} stroke={b.col} strokeWidth={4} />
              <Label x={b.x} y={605} size={48} color={b.col} weight={700}>
                {b.txt}
              </Label>
            </g>
          ))}
          <path d="M800,575 Q960,500 1120,575" fill="none" stroke={C.mint} strokeWidth={5} strokeLinecap="round" />
          <path d="M1120,640 Q960,715 800,640" fill="none" stroke={C.mint} strokeWidth={5} strokeLinecap="round" />
          <path d="M1120,575 l-24,-4 l12,-18 Z" fill={C.mint} />
          <path d="M800,640 l24,4 l-12,18 Z" fill={C.mint} />
          {/* foton bolak-balik di busur */}
          {(() => {
            const u = rp < 0.5 ? rp * 2 : (rp - 0.5) * 2;
            const top = rp < 0.5;
            const x = top ? mix(800, 1120, u) : mix(1120, 800, u);
            const y = top ? 575 - 150 * u * (1 - u) : 640 + 150 * u * (1 - u);
            return <circle cx={x} cy={y} r={11} fill={C.gold} opacity={Math.min(1, u * 8, (1 - u) * 8)} />;
          })()}
          {/* genap → genap dilarang */}
          <path d="M560,540 C520,440 760,440 720,540" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="8 8" />
          <Mark x={640} y={458} ok={false} p={ramp(t, cue(5) + 1.2, cue(5) + 1.8)} size={24} />
          <path d="M1200,540 C1160,440 1400,440 1360,540" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="8 8" />
          <Mark x={1280} y={458} ok={false} p={ramp(t, cue(5) + 1.5, cue(5) + 2.1)} size={24} />
        </g>
      </Stage>

      {/* kartu rumus bergantian (satu slot di atas) */}
      <Formula x={960} y={262} p={card1} size={60} accent={C.gold}>
        ψ(−<i>r</i>) = ± ψ(<i>r</i>)
      </Formula>
      <Formula x={960} y={262} p={card2} size={64} accent={C.gold} caption="jumlah l semua elektron">
        π = (−1)
        <Sup>Σ<i>l</i></Sup>
      </Formula>
      <Formula x={960} y={262} p={card3} size={60} accent={C.amber} caption="operator dipol: paritas ganjil">
        <Op>d</Op> = −<i>e</i> <Op>r</Op>
      </Formula>
      <Formula x={960} y={262} p={card4} size={56} accent={C.mint} caption="integral transisi">
        ⟨<i>f</i> | <Op>d</Op> | <i>i</i>⟩ = ∫ ψ<Sub>f</Sub>
        <Sup>*</Sup> <Op>d</Op> ψ<Sub>i</Sub> d<i>τ</i>
      </Formula>
      <Formula x={960} y={262} p={card5} size={64} accent={C.mint} caption="transisi dipol listrik selalu mengubah paritas">
        <span style={{fontFamily: FONT.sans, fontWeight: 700}}>
          <span style={{color: C.blue}}>genap</span> ↔ <span style={{color: C.amber}}>ganjil</span>
        </span>
      </Formula>
    </AbsoluteFill>
  );
};
