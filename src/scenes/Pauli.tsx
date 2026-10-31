import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Badge, Card, Formula, Label, Sqrt, Stage, Sub, V} from '../components/primitives';
import {Cross, OrbBox, SpinUD} from '../components/grupA';
import {Electron} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 2: elektron identik → Ψ antisimetrik → a = b memberi Ψ = 0 → larangan Pauli → ↑↓ boleh, ↑↑ tidak.

/** Huruf yang bersilang-pudar dari `from` ke `to`. */
const Morph: React.FC<{from: string; to: string; p: number; color?: string}> = ({from, to, p, color}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    <span style={{opacity: 1 - p}}>{from}</span>
    <span style={{position: 'absolute', left: 0, top: 0, opacity: p, color}}>{to}</span>
  </span>
);

/** Satu suku (x(1) y(2)) dengan coretan merah yang tergambar. */
const Term: React.FC<{first: React.ReactNode; second: React.ReactNode; strike: number; opacity: number}> = ({first, second, strike, opacity}) => (
  <span style={{position: 'relative', display: 'inline-block', opacity}}>
    <V>{first}</V>(1)&thinsp;<V>{second}</V>(2)
    <span style={{position: 'absolute', left: -6, right: -6, top: '50%', height: 5, borderRadius: 3, background: C.red, transform: `scaleX(${strike})`, transformOrigin: 'left'}} />
  </span>
);

/** Satu konfigurasi: dua spin-orbital (a, b) berisi elektron bernomor. */
const Config: React.FC<{cx: number; y: number; inA: number; inB: number; same: number; opacity: number; t: number; seed: number}> = ({cx, y, inA, inB, same, opacity, t, seed}) => {
  const xa = mix(cx - 95, cx, same);
  const xb = mix(cx + 95, cx, same);
  const ea = mix(cx - 95, cx - 30, same);
  const eb = mix(cx + 95, cx + 30, same);
  const bob = (k: number) => 8 * Math.sin(t * 2.2 + k + seed);
  return (
    <g opacity={opacity}>
      <OrbBox x={xb} y={y} w={150} h={120} color={C.violet} opacity={1 - 0.5 * same} />
      <OrbBox x={xa} y={y} w={150} h={120} color={C.violet} />
      <text x={xa} y={y + 96} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.ink}>
        a
      </text>
      <text x={xb} y={y + 96} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.ink} opacity={1 - same}>
        b
      </text>
      {[
        {x: ea, n: inA},
        {x: eb, n: inB},
      ].map((e, k) => (
        <g key={k}>
          <Electron x={e.x} y={y + bob(k)} r={18} />
          <text x={e.x} y={y - 38 + bob(k)} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={24} fontWeight={600} fill={C.muted}>
            {e.n}
          </text>
        </g>
      ))}
    </g>
  );
};

export const Pauli: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // baris 0: identik
  const g0 = slot(t, -0.3, cue(1), 0.6, 0.45);
  const nums = 1 - ramp(t, wordOf(0, 'label') - 0.4, wordOf(0, 'label') + 0.5, EASE_IN_OUT);
  const ask = ramp(t, wordOf(0, 'dibedakan') - 0.4, wordOf(0, 'dibedakan') + 0.4, BACK);
  const idt = ramp(t, wordOf(0, 'identik') - 0.3, wordOf(0, 'identik') + 0.5);

  // baris 1: pertukaran → tanda berganti
  const g1 = slot(t, cue(1), cue(2), 0.6, 0.45);
  const sw = ramp(t, wordOf(1, 'berganti') - 0.4, wordOf(1, 'berganti') + 1.4, EASE_IN_OUT);
  const flip = ramp(sw, 0.4, 0.65);

  // baris 2–3: rumus antisimetrik & a = b
  const fP = slot(t, cue(2), cue(4) - 0.05);
  const t1 = ramp(t, wordOf(2, 'a-satu') - 0.3, wordOf(2, 'a-satu') + 0.4);
  const mn = ramp(t, wordOf(2, 'dikurangi') - 0.3, wordOf(2, 'dikurangi') + 0.3);
  const t2 = ramp(t, wordOf(2, 'b-satu') - 0.3, wordOf(2, 'b-satu') + 0.4);
  const den = ramp(t, wordOf(2, 'akar') - 0.3, wordOf(2, 'akar') + 0.4);
  const same = ramp(t, wordOf(3, 'sama') - 0.3, wordOf(3, 'sama') + 0.8, EASE_IN_OUT);
  const strike = ramp(t, wordOf(3, 'saling') - 0.2, wordOf(3, 'saling') + 0.6, EASE_IN_OUT);
  const zero = ramp(t, wordOf(3, 'nol') - 0.3, wordOf(3, 'nol') + 0.4, BACK);
  const ann = ramp(t, wordOf(3, 'saling') - 0.1, wordOf(3, 'nol') + 0.2, EASE_IN_OUT);
  const cfg = slot(t, cue(2) + 0.2, cue(4) - 0.05, 0.6, 0.4);
  const cA = ramp(t, wordOf(2, 'a-satu') - 0.3, wordOf(2, 'a-satu') + 0.5);
  const cB = ramp(t, wordOf(2, 'b-satu') - 0.3, wordOf(2, 'b-satu') + 0.5);
  const ring = ramp(t, wordOf(3, 'nol') - 0.6, wordOf(3, 'nol') + 1.2);

  // baris 4: pernyataan larangan Pauli + bilangan kuantum
  const g4 = slot(t, cue(4) - 0.05, cue(5) + 0.05, 0.6, 0.45);
  const row1 = ramp(t, wordOf(4, 'dua') - 0.3, wordOf(4, 'dua') + 0.4);
  const row2 = ramp(t, wordOf(4, 'elektron') + 0.1, wordOf(4, 'elektron') + 0.7);
  const ms = ramp(t, wordOf(4, 'menempati') - 0.2, wordOf(4, 'menempati') + 0.5);

  // baris 5: kotak orbital
  const badge = ramp(t, wordOf(4, 'larangan') - 0.3, wordOf(4, 'larangan') + 0.5, BACK);
  const okBox = ramp(t, wordOf(5, 'orbital') - 0.3, wordOf(5, 'orbital') + 0.6, BACK);
  const badBox = ramp(t, wordOf(5, 'asalkan') - 0.3, wordOf(5, 'asalkan') + 0.6, BACK);
  const badX = ramp(t, wordOf(5, 'berlawanan') - 0.1, wordOf(5, 'berlawanan') + 0.6, EASE_IN_OUT);

  const arc = (p: number, xa: number, xb: number, y: number, up: number) => ({x: mix(xa, xb, p), y: y - up * Math.sin(Math.PI * p) * 110});

  return (
    <AbsoluteFill>
      <Stage>
        {/* ---- baris 0: dua elektron identik saling mengitari ---- */}
        <g opacity={g0}>
          {[0, 1].map((k) => {
            const a = t * 1.3 + k * Math.PI;
            const r = 190 + 30 * Math.sin(t * 0.9);
            const x = 960 + r * Math.cos(a);
            const y = 520 + 0.45 * r * Math.sin(a);
            return (
              <g key={k}>
                <Electron x={x} y={y} r={34} label />
                <text x={x} y={y - 66} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={34} fontWeight={600} fill={C.gold} opacity={nums}>
                  {k + 1}
                </text>
                <text x={x} y={y - 66} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={38} fontWeight={700} fill={C.red} opacity={ask}>
                  ?
                </text>
              </g>
            );
          })}
          <Label x={960} y={770} size={32} color={C.ink} opacity={idt} weight={600}>
            identik: tidak bisa diberi label
          </Label>
        </g>

        {/* ---- baris 1: tukar dua elektron → tanda Ψ berbalik ---- */}
        <g opacity={g1}>
          {(() => {
            const a = arc(sw, 760, 1160, 560, 1);
            const b = arc(sw, 1160, 760, 560, -1);
            return (
              <g>
                <path d={`M760,560 Q960,${560 - 220} 1160,560`} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="6 8" />
                <path d={`M760,560 Q960,${560 + 220} 1160,560`} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="6 8" />
                <Electron x={a.x} y={a.y} r={30} label />
                <Electron x={b.x} y={b.y} r={30} label />
                <Label x={a.x} y={a.y - 56} size={26} color={C.muted} font="mono">
                  1
                </Label>
                <Label x={b.x} y={b.y - 56} size={26} color={C.muted} font="mono">
                  2
                </Label>
              </g>
            );
          })()}
          <g transform={`translate(960 760) scale(${1 + 0.12 * Math.sin(Math.PI * flip)})`}>
            <text x={-34} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontSize={72} fill={C.mint} opacity={1 - flip}>
              +
            </text>
            <text x={-34} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontSize={72} fill={C.red} opacity={flip}>
              −
            </text>
            <text x={20} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={72} fill={C.ink}>
              Ψ
            </text>
          </g>
        </g>

        {/* ---- baris 2–3: dua konfigurasi → a = b → saling menghapus ---- */}
        <g opacity={cfg}>
          <g transform={`translate(${mix(0, 320, ann)} 0)`} opacity={1 - ann}>
            <Config cx={640} y={620} inA={1} inB={2} same={same} opacity={cA} t={t} seed={0} />
          </g>
          <text x={960} y={620} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontSize={80} fill={C.ink} opacity={mn * (1 - ann)}>
            −
          </text>
          <g transform={`translate(${mix(0, -320, ann)} 0)`} opacity={1 - ann}>
            <Config cx={1280} y={620} inA={2} inB={1} same={same} opacity={cB} t={t} seed={1.7} />
          </g>
          {/* riak saat lenyap */}
          <circle cx={960} cy={620} r={40 + 260 * ring} fill="none" stroke={C.red} strokeWidth={4} opacity={0.8 * Math.sin(Math.PI * ring)} />
          <Label x={960} y={620} size={64} color={C.red} weight={700} font="serif" italic opacity={zero}>
            Ψ = 0
          </Label>
          <Label x={960} y={700} size={28} color={C.muted} opacity={zero}>
            tidak ada keadaan sama sekali
          </Label>
        </g>

        {/* ---- baris 5: kotak orbital ---- */}
        <g transform="translate(0 -50)">
          <g opacity={okBox} transform={`translate(0 ${(1 - okBox) * 30})`}>
            <OrbBox x={660} y={600} w={200} h={150} color={C.mint} />
            <SpinUD x={620} y={600 + 6 * Math.sin(t * 2.4)} up len={100} />
            <SpinUD x={700} y={600 + 6 * Math.sin(t * 2.4 + 1.3)} up={false} len={100} />
            <Label x={660} y={725} size={30} color={C.mint} weight={700}>
              ✓ spin berlawanan
            </Label>
          </g>
          <g opacity={badBox} transform={`translate(0 ${(1 - badBox) * 30})`}>
            <OrbBox x={1260} y={600} w={200} h={150} color={mixColor(badX)} />
            <SpinUD x={1220} y={600 + 6 * Math.sin(t * 2.4 + 0.6)} up len={100} opacity={1 - 0.5 * badX} />
            <SpinUD x={1300} y={600 + 6 * Math.sin(t * 2.4 + 2)} up len={100} opacity={1 - 0.5 * badX} />
            <Cross x={1260} y={600} r={80} p={badX} />
            <Label x={1260} y={725} size={30} color={C.red} weight={700} opacity={badX}>
              ✗ spin sama, kotak sama
            </Label>
          </g>
          <Label x={960} y={810} size={28} color={C.muted} opacity={okBox}>
            satu orbital ruang: paling banyak dua elektron
          </Label>
        </g>
      </Stage>

      <Formula x={960} y={280} p={g1 * ramp(t, cue(1) + 0.2, cue(1) + 0.8)} accent={C.red} caption="tukar dua elektron identik → tanda berganti">
        <V>Ψ</V>(2,&thinsp;1)&nbsp;=&nbsp;<span style={{color: C.red}}>−</span>
        <V>Ψ</V>(1,&thinsp;2)
      </Formula>

      <Formula x={960} y={290} p={fP} accent={C.violet} caption={<Morph from="fungsi antisimetrik untuk spin-orbital a dan b" to="taruh b = a: kedua suku identik" p={same} color={C.red} />}>
        <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
          <V>Ψ</V>&nbsp;=&nbsp;
        </span>
        <span style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', margin: '0 0.1em'}}>
          <span style={{whiteSpace: 'nowrap', padding: '0 0.2em 0.06em'}}>
            [&thinsp;
            <Term first="a" second={<Morph from="b" to="a" p={same} color={C.red} />} strike={strike} opacity={t1} />
            <span style={{opacity: mn}}>&nbsp;−&nbsp;</span>
            <Term first={<Morph from="b" to="a" p={same} color={C.red} />} second="a" strike={strike} opacity={t2} />
            &thinsp;]
          </span>
          <span style={{alignSelf: 'stretch', height: 3, borderRadius: 2, background: 'currentColor', opacity: 0.85 * den}} />
          <span style={{opacity: den, padding: '0.08em 0.2em 0', fontSize: '0.84em'}}>
            <Sqrt>2</Sqrt>
          </span>
        </span>
        <span style={{display: 'inline-block', verticalAlign: 'middle', color: C.red, opacity: zero}}>&nbsp;=&nbsp;0</span>
      </Formula>

      {/* baris 4: pernyataan larangan Pauli */}
      <Card x={960} y={280} opacity={g4} accent={C.gold} style={{padding: '24px 44px', textAlign: 'center'}}>
        <div style={{fontFamily: FONT.mono, fontSize: 22, letterSpacing: 4, color: C.gold}}>LARANGAN PAULI</div>
        <div style={{fontSize: 40, fontWeight: 600, marginTop: 10}}>
          dua elektron <span style={{color: C.red}}>tidak boleh</span> menempati spin-orbital yang sama
        </div>
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 610,
          transform: 'translate(-50%, -50%)',
          opacity: g4,
          fontFamily: FONT.serif,
          fontSize: 44,
          color: C.ink,
        }}
      >
        <table style={{borderCollapse: 'separate', borderSpacing: '34px 10px', textAlign: 'center'}}>
          <thead>
            <tr style={{fontSize: 34, color: C.muted, fontStyle: 'italic'}}>
              <td />
              <td>n</td>
              <td>l</td>
              <td>
                m<Sub>l</Sub>
              </td>
              <td style={{color: interpolateColors(ms, [0, 1], [C.muted, C.gold])}}>
                m<Sub>s</Sub>
              </td>
            </tr>
          </thead>
          <tbody>
            {[
              {o: row1, label: 'elektron 1', s: '+½', col: C.cyan},
              {o: row2, label: 'elektron 2', s: '−½', col: C.pink},
            ].map((r) => (
              <tr key={r.label} style={{opacity: r.o}}>
                <td style={{fontFamily: FONT.sans, fontSize: 28, color: C.muted, textAlign: 'right'}}>{r.label}</td>
                <td>1</td>
                <td>0</td>
                <td>0</td>
                <td style={{color: r.col, fontWeight: 600, background: `rgba(255,194,74,${0.14 * ms})`, borderRadius: 12, padding: '0 14px'}}>{r.s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Badge x={960} y={250} text="LARANGAN PAULI" color={C.gold} opacity={ramp(t, cue(5) - 0.2, cue(5) + 0.5) * badge} />
    </AbsoluteFill>
  );
};

function mixColor(p: number) {
  // mint → merah (silang warna halus)
  const a = [0x5e, 0xf0, 0xb0];
  const b = [0xff, 0x54, 0x70];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * p));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
