import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Card, Label, Stage} from '../components/primitives';
import {Mark, Stamp, TermHtml, TermSvg, type Term} from '../components/grupC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 14: simbol tidak sah (¹S₁/₂, ³P₁/₂), lalu ²P°₃/₂ → ²S₁/₂ ✓, ²D₅/₂ ✓, ²P°₁/₂ ✗ (paritas) — AUDIT.
const BAD1: Term = {m: '1', L: 'S', J: '1/2'};
const BAD2: Term = {m: '3', L: 'P', J: '1/2'};
const TOP: Term = {m: '2', L: 'P', J: '3/2', odd: true};
const CANDS: {term: Term; x: number; even: boolean; rows: [React.ReactNode, boolean][]}[] = [
  {
    term: {m: '2', L: 'S', J: '1/2'},
    x: 300,
    even: true,
    rows: [
      [<>Δ<i>S</i> = 0</>, true],
      [<>Δ<i>L</i> = −1</>, true],
      [<>Δ<i>J</i> = −1</>, true],
      [<>ganjil → genap</>, true],
    ],
  },
  {
    term: {m: '2', L: 'D', J: '5/2'},
    x: 590,
    even: true,
    rows: [
      [<>Δ<i>S</i> = 0</>, true],
      [<>Δ<i>L</i> = +1</>, true],
      [<>Δ<i>J</i> = +1</>, true],
      [<>ganjil → genap</>, true],
    ],
  },
  {
    term: {m: '2', L: 'P', J: '1/2', odd: true},
    x: 880,
    even: false,
    rows: [
      [<>Δ<i>S</i> = 0</>, true],
      [<>Δ<i>L</i> = 0</>, true],
      [<>Δ<i>J</i> = −1</>, true],
      [<>ganjil → ganjil</>, false],
    ],
  },
];
const YT = 330;
const YC = 660;
const STEPS = ['sahkan simbol', 'cek ΔS, ΔL, ΔJ', 'cek paritas', 'cek energi'];

export const Check: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  // ---------- bagian A: simbol tidak sah ----------
  const partA = ramp(t, cue(0) - 0.2, cue(0) + 0.6) * (1 - ramp(t, cue(3) - 0.5, cue(3) - 0.05, EASE_IN_OUT));
  const s1 = ramp(t, cue(0) + 0.3, cue(0) + 0.9, BACK);
  const s2 = ramp(t, cue(0) + 0.7, cue(0) + 1.3, BACK);
  const scan = ramp(t, cue(0) + 1.0, cue(1) + 0.2, EASE_IN_OUT);
  const ask = ramp(t, wordOf(0, 'sah') - 0.3, wordOf(0, 'sah') + 0.3) * (1 - ramp(t, cue(1) + 0.4, cue(1) + 0.9));
  const st1 = ramp(t, wordOf(1, 'Tidak') - 0.1, wordOf(1, 'Tidak') + 0.35, EASE_IN_OUT);
  const why1 = ramp(t, wordOf(1, 'nol', 0) - 0.2, wordOf(1, 'nol', 0) + 0.5);
  const st2 = ramp(t, wordOf(2, 'tidak') - 0.1, wordOf(2, 'tidak') + 0.35, EASE_IN_OUT);
  const why2 = ramp(t, wordOf(2, 'bulat') - 0.4, wordOf(2, 'bulat') + 0.3);
  const chips = [wordOf(2, 'nol'), wordOf(2, 'satu', 2), wordOf(2, 'dua')].map((a) => ramp(t, a - 0.15, a + 0.35, BACK));
  // ---------- bagian B: diagram transisi ----------
  const partB = ramp(t, cue(3) - 0.05, cue(3) + 0.6) * (1 - ramp(t, cue(6) - 0.5, cue(6) - 0.05, EASE_IN_OUT));
  const candIn = ramp(t, cue(3) + 0.4, cue(3) + 1.2);
  const starts = [wordOf(3, 'genap') - 1.2, cue(4) - 0.1, cue(5) - 0.1];
  const ends = [cue(4) - 0.1, cue(5) - 0.1, cue(6) - 0.4];
  const arrow = starts.map((a) => ramp(t, a, a + 0.9, EASE_IN_OUT));
  const tickT = [
    [0, 0.5, 1.0, 1.5].map((d) => wordOf(3, 'genap') + d),
    [0.6, 1.0, 1.4, 1.8].map((d) => cue(4) + d),
    [wordOf(5, 'lolos') - 0.9, wordOf(5, 'lolos') - 0.5, wordOf(5, 'lolos') - 0.1, wordOf(5, 'paritas') + 0.2],
  ];
  const verdictT = [wordOf(3, 'diizinkan'), wordOf(4, 'lolos'), wordOf(5, 'Dilarang')];
  const verdict = verdictT.map((a) => ramp(t, a - 0.2, a + 0.4));
  const panel = starts.map((a, k) => slot(t, a, ends[k], 0.5, 0.35));
  // ---------- bagian C: urutan 4 langkah ----------
  const partC = ramp(t, cue(6) - 0.05, cue(6) + 0.6);
  const stepT = [wordOf(6, 'sahkan'), wordOf(6, 'momentum'), wordOf(6, 'paritas'), wordOf(6, 'energi')];
  const stepIn = stepT.map((a) => ramp(t, a - 0.25, a + 0.35, BACK));
  const SX = (k: number) => 300 + k * 440;

  return (
    <AbsoluteFill>
      <Stage>
        {/* ===== A ===== */}
        <g opacity={partA}>
          <TermSvg x={620} y={470} term={BAD1} size={150} opacity={s1} />
          <TermSvg x={1300} y={470} term={BAD2} size={150} opacity={s2} />
          {/* kaca pembesar menyapu */}
          <g opacity={Math.min(1, scan * 8) * (1 - ramp(scan, 0.9, 1))}>
            {(() => {
              const x = mix(480, 1440, scan);
              const y = 440 + 30 * Math.sin(scan * Math.PI * 2);
              return (
                <>
                  <circle cx={x} cy={y} r={90} fill="rgba(255,194,74,0.06)" stroke={C.gold} strokeWidth={5} />
                  <path d={`M${x + 64},${y + 64} L${x + 120},${y + 120}`} stroke={C.gold} strokeWidth={14} strokeLinecap="round" />
                </>
              );
            })()}
          </g>
          <Label x={960} y={300} size={56} color={C.gold} weight={700} opacity={ask}>
            sah?
          </Label>
          {/* J yang mungkin untuk ³P: hanya bulat */}
          <g opacity={why2}>
            {['0', '1', '2'].map((j, k) => (
              <g key={j} opacity={Math.min(1, chips[k])} transform={`translate(${1180 + k * 120} 822) scale(${0.6 + 0.4 * Math.min(1.2, chips[k])})`}>
                <circle cx={0} cy={0} r={38} fill="rgba(94,240,176,0.15)" stroke={C.mint} strokeWidth={3} />
                <Label x={0} y={0} size={36} color={C.mint} weight={700} font="serif">
                  {j}
                </Label>
              </g>
            ))}
          </g>
        </g>

        {/* ===== B ===== */}
        <g opacity={partB}>
          <line x1={180} y1={YT} x2={1000} y2={YT} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          <TermSvg x={440} y={YT - 56} term={TOP} size={60} colored anchor="middle" />
          <Label x={620} y={YT - 54} size={30} color={C.amber} weight={700} anchor="start">
            ganjil
          </Label>
          {CANDS.map((c, k) => {
            const live = panel[k];
            const p = arrow[k];
            const ok = c.rows.every((r) => r[1]);
            const col = ok ? C.mint : C.red;
            const y1 = mix(YT + 10, YC - 12, p);
            return (
              <g key={k} opacity={candIn}>
                <line x1={c.x - 100} y1={YC} x2={c.x + 100} y2={YC} stroke={C.gold} strokeWidth={7} strokeLinecap="round" opacity={live} />
                <line x1={c.x - 100} y1={YC} x2={c.x + 100} y2={YC} stroke={C.ink} strokeWidth={5} strokeLinecap="round" opacity={1 - live} />
                <TermSvg x={c.x} y={YC + 52} term={c.term} size={52} colored />
                <Label x={c.x} y={YC + 112} size={26} color={c.even ? C.blue : C.amber} weight={700}>
                  {c.even ? 'genap' : 'ganjil'}
                </Label>
                {p > 0.001 ? (
                  <g opacity={Math.min(1, p * 6)}>
                    <path d={`M${c.x},${YT + 10} L${c.x},${y1}`} stroke={C.muted} strokeWidth={5} strokeLinecap="round" strokeDasharray={ok ? undefined : '10 9'} opacity={1 - verdict[k]} />
                    <path d={`M${c.x},${YT + 10} L${c.x},${y1}`} stroke={col} strokeWidth={5} strokeLinecap="round" strokeDasharray={ok ? undefined : '10 9'} opacity={verdict[k]} />
                    <path d={`M${c.x},${y1 + 12} L${c.x - 13},${y1 - 12} L${c.x + 13},${y1 - 12} Z`} fill={C.muted} opacity={ramp(p, 0.7, 1) * (1 - verdict[k])} />
                    <path d={`M${c.x},${y1 + 12} L${c.x - 13},${y1 - 12} L${c.x + 13},${y1 - 12} Z`} fill={col} opacity={ramp(p, 0.7, 1) * verdict[k]} />
                  </g>
                ) : null}
                <Mark x={c.x + 52} y={(YT + YC) / 2} ok={ok} p={verdict[k]} size={30} />
              </g>
            );
          })}
        </g>

        {/* ===== C: alur garis penghubung langkah ===== */}
        <g opacity={partC}>
          {[0, 1, 2].map((k) => {
            const p = ramp(t, stepT[k + 1] - 0.4, stepT[k + 1] + 0.1, EASE_IN_OUT);
            const x0 = SX(k) + 175;
            const x1 = SX(k + 1) - 175;
            const ph = ((t * 0.7 + k * 0.3) % 1 + 1) % 1;
            return (
              <g key={k} opacity={p}>
                <path d={`M${x0},540 L${x1 - 14},540`} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
                <path d={`M${x1},540 L${x1 - 18},529 L${x1 - 18},551 Z`} fill={C.gold} />
                <circle cx={mix(x0, x1 - 16, ph)} cy={540} r={7} fill="#fff" opacity={Math.min(1, ph * 6) * (1 - ph)} />
              </g>
            );
          })}
        </g>
      </Stage>

      {/* A: cap & alasan */}
      <Stamp x={620} y={612} p={partA * st1} text="TIDAK SAH" rot={-10} size={46} />
      <Stamp x={1300} y={612} p={partA * st2} text="TIDAK SAH" rot={-10} size={46} />
      <Card x={620} y={722} opacity={partA * why1} accent={C.red}>
        <div style={{fontSize: 34, fontFamily: FONT.serif}}>
          <i style={{color: C.violet}}>S</i> = 0, <i style={{color: C.gold}}>L</i> = 0 → <i style={{color: C.mint}}>J</i> = 0 saja
        </div>
      </Card>
      <Card x={1300} y={722} opacity={partA * why2} accent={C.red}>
        <div style={{fontSize: 34, fontFamily: FONT.serif}}>
          <i style={{color: C.gold}}>L</i> = 1, <i style={{color: C.violet}}>S</i> = 1 → <i style={{color: C.mint}}>J</i> bulat
        </div>
      </Card>

      {/* B: panel centang per kandidat */}
      {CANDS.map((c, k) =>
        panel[k] <= 0.001 ? null : (
          <Card key={k} x={1450} y={520} opacity={partB * panel[k]} scale={0.94 + 0.06 * panel[k]} accent={c.rows.every((r) => r[1]) ? C.mint : C.red} style={{padding: '26px 40px', minWidth: 520}}>
            <div style={{fontFamily: FONT.serif, fontSize: 56, textAlign: 'center', marginBottom: 14}}>
              <TermHtml term={TOP} /> → <TermHtml term={c.term} colored />
            </div>
            {c.rows.map(([label, ok], r) => {
              const p = ramp(t, tickT[k][r] - 0.1, tickT[k][r] + 0.3, BACK);
              return (
                <div key={r} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 36, fontFamily: FONT.serif, padding: '6px 4px', borderTop: r ? `1px solid ${C.faint}` : undefined}}>
                  <span style={{color: r === 3 ? (ok ? C.ink : C.red) : C.ink, fontFamily: r === 3 ? FONT.sans : FONT.serif, fontSize: r === 3 ? 32 : 36}}>
                    {r === 3 ? 'paritas: ' : ''}
                    {label}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 46,
                      textAlign: 'center',
                      fontFamily: FONT.sans,
                      fontWeight: 800,
                      fontSize: 38,
                      color: ok ? C.mint : C.red,
                      opacity: Math.min(1, p),
                      transform: `scale(${0.4 + 0.6 * p})`,
                    }}
                  >
                    {ok ? '✓' : '✗'}
                  </span>
                </div>
              );
            })}
            <div style={{textAlign: 'center', marginTop: 12, fontFamily: FONT.sans, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: c.rows.every((r) => r[1]) ? C.mint : C.red, opacity: verdict[k]}}>
              {c.rows.every((r) => r[1]) ? 'DIIZINKAN' : 'DILARANG'}
            </div>
          </Card>
        ),
      )}

      {/* C: empat langkah */}
      {STEPS.map((s, k) => (
        <Card
          key={k}
          x={SX(k)}
          y={540}
          opacity={partC * Math.min(1, stepIn[k])}
          scale={0.85 + 0.15 * Math.min(1.1, stepIn[k])}
          accent={[C.violet, C.gold, C.amber, C.mint][k]}
          style={{width: 340, textAlign: 'center', padding: '22px 10px', whiteSpace: 'normal'}}
        >
          <div style={{fontSize: 56, fontWeight: 800, color: [C.violet, C.gold, C.amber, C.mint][k], lineHeight: 1}}>{k + 1}</div>
          <div style={{fontSize: 32, fontWeight: 600, marginTop: 10}}>{s}</div>
        </Card>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 330,
          transform: 'translate(-50%, -50%)',
          opacity: partC * ramp(t, cue(6) + 0.2, cue(6) + 0.8),
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 700,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        Urutan memeriksa transisi
      </div>
      <div
        style={{
          position: 'absolute',
          left: SX(3),
          top: 690,
          transform: 'translate(-50%, -50%)',
          opacity: partC * stepIn[3],
          fontFamily: FONT.serif,
          fontSize: 32,
          color: C.muted,
          whiteSpace: 'nowrap',
        }}
      >
        <i>h</i>ν = Δ<i>E</i>
      </div>
    </AbsoluteFill>
  );
};
