import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Badge, Card, Formula, Glow, Label, Stage, V} from '../components/primitives';
import {Chip, Term, Vec} from '../components/grupB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 04: membaca simbol term ²ˢ⁺¹L_J, tabel huruf L, contoh ³F₄, degenerasi 2J+1, jebakan.
const LETTERS = ['S', 'P', 'D', 'F', 'G', 'H', 'I'];
const MULT = [
  {n: '1', name: 'singlet', S: '0'},
  {n: '2', name: 'doublet', S: '½'},
  {n: '3', name: 'triplet', S: '1'},
  {n: '4', name: 'quartet', S: '3/2'},
];

const BigText: React.FC<{x: number; y: number; size: number; color: string; anchor: 'start' | 'middle' | 'end'; italic?: boolean; opacity?: number; children: React.ReactNode}> = ({
  x,
  y,
  size,
  color,
  anchor,
  italic,
  opacity = 1,
  children,
}) =>
  opacity <= 0.001 ? null : (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontFamily={FONT.serif}
      fontStyle={italic ? 'italic' : undefined}
      fontSize={size}
      fill={color}
      opacity={opacity}
      style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.9)', strokeWidth: size * 0.06}}
    >
      {children}
    </text>
  );

export const Symbol: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  // bagian simbol generik muncul mengikuti kata
  const pM = ramp(t, wordOf(0, 'dua') - 0.1, wordOf(0, 'dua') + 0.6, BACK);
  const pL = ramp(t, wordOf(0, 'tengah') - 0.2, wordOf(0, 'tengah') + 0.5, BACK);
  const pJ = ramp(t, wordOf(0, 'bawah') - 0.2, wordOf(0, 'bawah') + 0.5, BACK);
  // simbol naik ke atas saat penjelasan dimulai
  const rise = ramp(t, cue(1) - 0.6, cue(1) + 0.6, EASE_IN_OUT);
  const sc = mix(1.3, 1, rise);
  const dy = mix(190, 0, rise);
  const ex = ramp(t, wordOf(4, 'triplet') - 0.2, wordOf(4, 'triplet') + 0.7, EASE_IN_OUT); // generik → ³F₄
  const topOut = 1 - ramp(t, cue(6) - 0.5, cue(6) + 0.1, EASE_IN_OUT);
  // anotasi
  const aM = ramp(t, cue(1), cue(1) + 0.7) * topOut;
  const aL = ramp(t, cue(2), cue(2) + 0.7) * topOut;
  const aJ = ramp(t, cue(3), cue(3) + 0.7) * topOut;
  const hiM = ramp(t, cue(1), cue(1) + 0.5) * (1 - ramp(t, cue(2) - 0.3, cue(2) + 0.2));
  const hiL = ramp(t, cue(2), cue(2) + 0.5) * (1 - ramp(t, cue(3) - 0.3, cue(3) + 0.2));
  const hiJ = ramp(t, cue(3), cue(3) + 0.5) * (1 - ramp(t, cue(4) - 0.3, cue(4) + 0.2));
  const breathe = (k: number) => 0.55 + 0.25 * Math.sin(t * 1.6 + k * 2.1);
  // panel bawah (slot berurutan)
  const s1 = slot(t, cue(1) + 0.2, cue(2));
  const s2 = slot(t, cue(2) + 0.1, cue(3));
  const s3 = slot(t, cue(3) + 0.1, cue(4));
  const s4 = slot(t, cue(4) + 0.1, cue(5));
  const s5 = slot(t, cue(5), cue(6));
  const s6 = ramp(t, cue(6) + 0.2, cue(6) + 0.9);
  const multAt = [wordOf(1, 'satu'), wordOf(1, 'dua'), wordOf(1, 'tiga'), wordOf(1, 'empat')];
  const letAt = [wordOf(2, 'nol'), wordOf(2, 'satu'), wordOf(2, 'dua'), wordOf(2, 'tiga'), wordOf(2, 'G,'), wordOf(2, 'H,'), wordOf(2, 'I.')];
  const ch1 = ramp(t, wordOf(4, 'Tiga', 0) - 0.1, wordOf(4, 'Tiga', 0) + 0.5, BACK);
  const ch2 = ramp(t, wordOf(4, 'berarti', 1) - 0.1, wordOf(4, 'berarti', 1) + 0.5, BACK);
  const ch3 = ramp(t, wordOf(4, 'empat', 1) - 0.1, wordOf(4, 'empat', 1) + 0.5, BACK);
  const g0 = wordOf(5, 'sembilan');
  const gCard = ramp(t, cue(5) + 0.2, cue(5) + 0.9);
  const trap1 = ramp(t, wordOf(6, 'doublet') - 0.2, wordOf(6, 'doublet') + 0.5);
  const trap2 = ramp(t, wordOf(6, 'besar') - 0.2, wordOf(6, 'besar') + 0.5);
  // presesi vektor (baris 3)
  const ph = t * 1.5;
  const VC = {x: 960, y: 860};
  const Jlen = 320;
  const coneR = 100;
  const Lend = {x: VC.x + coneR * Math.cos(ph), y: VC.y - Jlen * 0.62 + 0.3 * coneR * Math.sin(ph)};
  const Jend = {x: VC.x, y: VC.y - Jlen};

  return (
    <AbsoluteFill>
      <Stage>
        {/* simbol raksasa */}
        <g opacity={topOut} transform={`translate(${960 * (1 - sc)} ${330 * (1 - sc) + dy}) scale(${sc})`}>
          <Glow x={800} y={255} r={150} color="violet" opacity={pM * (0.25 + 0.6 * hiM) * breathe(0)} />
          <Glow x={960} y={330} r={190} color="gold" opacity={pL * (0.25 + 0.6 * hiL) * breathe(1)} />
          <Glow x={1060} y={400} r={140} color="mint" opacity={pJ * (0.25 + 0.6 * hiJ) * breathe(2)} />
          {/* generik */}
          <g opacity={1 - ex}>
            <BigText x={905} y={250} size={88} color={C.violet} anchor="end" opacity={pM}>
              2<tspan fontStyle="italic">S</tspan>+1
            </BigText>
            <BigText x={960} y={330} size={210} color={C.gold} anchor="middle" italic opacity={pL}>
              L
            </BigText>
            <BigText x={1030} y={400} size={108} color={C.mint} anchor="start" italic opacity={pJ}>
              J
            </BigText>
          </g>
          {/* contoh ³F₄ */}
          <g opacity={ex}>
            <BigText x={905} y={250} size={110} color={C.violet} anchor="end">
              3
            </BigText>
            <BigText x={960} y={330} size={210} color={C.gold} anchor="middle">
              F
            </BigText>
            <BigText x={1030} y={400} size={110} color={C.mint} anchor="start">
              4
            </BigText>
          </g>
        </g>
        {/* anotasi berpanah */}
        <g opacity={aM}>
          <Label x={440} y={240} size={34} color={C.violet} weight={700}>
            multiplisitas
          </Label>
          <Label x={440} y={284} size={26} color={C.muted}>
            2S + 1 · dari spin total S
          </Label>
          <Vec x1={600} y1={250} x2={mix(640, 690, 0.5 + 0.5 * Math.sin(t * 2))} y2={250} color={C.violet} width={4} />
        </g>
        <g opacity={aL}>
          <Label x={1250} y={236} size={34} color={C.gold} weight={700} anchor="start">
            L · momentum sudut orbital
          </Label>
          <Vec x1={1240} y1={246} x2={mix(1100, 1080, 0.5 + 0.5 * Math.sin(t * 2))} y2={280} color={C.gold} width={4} />
        </g>
        <g opacity={aJ}>
          <Label x={1250} y={410} size={34} color={C.mint} weight={700} anchor="start">
            J · momentum sudut total
          </Label>
          <Vec x1={1240} y1={410} x2={mix(1135, 1115, 0.5 + 0.5 * Math.sin(t * 2))} y2={405} color={C.mint} width={4} />
        </g>

        {/* baris 1: multiplisitas = banyak arah spin total */}
        <g opacity={s1}>
          {MULT.map((m, i) => {
            const x = 510 + i * 300;
            const p = ramp(t, multAt[i] - 0.15, multAt[i] + 0.45, BACK);
            const n = i + 1;
            return (
              <g key={m.n} opacity={p} transform={`translate(0 ${(1 - p) * 20})`}>
                <Label x={x} y={560} size={64} color={C.violet} font="serif" weight={600}>
                  {m.n}
                </Label>
                <Label x={x} y={628} size={36} color={C.ink} weight={600}>
                  {m.name}
                </Label>
                <Label x={x} y={672} size={28} color={C.muted} font="mono">
                  S = {m.S}
                </Label>
                {Array.from({length: n}, (_, k) => {
                  const xx = x + (k - (n - 1) / 2) * 50;
                  return <circle key={k} cx={xx} cy={735 + 6 * Math.sin(t * 2.4 + k * 1.1 + i)} r={14} fill={C.violet} opacity={0.85} />;
                })}
              </g>
            );
          })}
          <Label x={960} y={815} size={26} color={C.muted}>
            banyaknya arah spin total yang mungkin (M
            <tspan baselineShift="sub" fontSize={18}>
              S
            </tspan>
            ) = 2S + 1
          </Label>
        </g>

        {/* baris 2: tabel huruf L */}
        <g opacity={s2}>
          {LETTERS.map((l, i) => {
            const x = 450 + i * 170;
            const p = ramp(t, letAt[i] - 0.15, letAt[i] + 0.4, BACK);
            const hot = ramp(t, letAt[i] - 0.15, letAt[i] + 0.3) * (1 - ramp(t, letAt[i] + 0.9, letAt[i] + 1.6));
            return (
              <g key={l} opacity={0.25 + 0.75 * p}>
                <rect x={x - 70} y={560} width={140} height={200} rx={16} fill="rgba(12,18,40,0.82)" stroke={C.gold} strokeOpacity={0.3 + 0.7 * hot} strokeWidth={2 + 2 * hot} />
                <Label x={x} y={600} size={26} color={C.muted} font="mono">
                  L = {i}
                </Label>
                <Label x={x} y={690} size={76} color={C.gold} font="serif" weight={600}>
                  {l}
                </Label>
              </g>
            );
          })}
          <Label x={960} y={815} size={26} color={C.muted} opacity={ramp(t, letAt[4], letAt[4] + 0.6)}>
            setelah F lanjut menurut abjad: G, H, I, …
          </Label>
        </g>

        {/* baris 3: J dari gabungan vektor L dan S, berpresesi */}
        <g opacity={s3}>
          <ellipse cx={VC.x} cy={VC.y - Jlen * 0.62} rx={coneR} ry={coneR * 0.3} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="5 6" />
          <Vec x1={VC.x} y1={VC.y} x2={Jend.x} y2={Jend.y} color={C.mint} width={8} />
          <Vec x1={VC.x} y1={VC.y} x2={Lend.x} y2={Lend.y} color={C.gold} width={6} />
          <Vec x1={Lend.x} y1={Lend.y} x2={Jend.x} y2={Jend.y} color={C.violet} width={6} />
          <Label x={Lend.x + (Lend.x > VC.x ? 34 : -34)} y={Lend.y + 40} size={34} color={C.gold} font="serif" italic>
            L
          </Label>
          <Label x={(Lend.x + Jend.x) / 2 + (Lend.x > VC.x ? 40 : -40)} y={(Lend.y + Jend.y) / 2} size={34} color={C.violet} font="serif" italic>
            S
          </Label>
          <Label x={VC.x + 40} y={Jend.y - 10} size={40} color={C.mint} font="serif" italic weight={600}>
            J
          </Label>
          <Label x={1300} y={680} size={36} color={C.ink} anchor="start">
            L dan S digabung
          </Label>
          <Label x={1300} y={730} size={36} color={C.mint} anchor="start" weight={700}>
            → J (total)
          </Label>
          <Label x={560} y={700} size={32} color={C.muted} anchor="middle">
            L dan S berpresesi
          </Label>
          <Label x={560} y={744} size={32} color={C.muted} anchor="middle">
            mengelilingi J
          </Label>
        </g>

        {/* baris 5: sembilan tingkat M_J berenergi sama */}
        <g opacity={s5}>
          <Label x={1400} y={590} size={28} color={C.muted}>
            M
            <tspan baselineShift="sub" fontSize={19}>
              J
            </tspan>
            {' '}= −4 … +4 · energi sama
          </Label>
          {Array.from({length: 9}, (_, k) => {
            const x = 1080 + k * 80;
            const p = ramp(t, g0 - 0.6 + k * 0.17, g0 - 0.2 + k * 0.17, BACK);
            const yy = 690 + 5 * Math.sin(t * 2 + k * 0.8);
            return (
              <g key={k} opacity={p}>
                <line x1={x - 30} y1={690} x2={x + 30} y2={690} stroke={C.mint} strokeWidth={5} strokeLinecap="round" />
                <circle cx={x} cy={yy - 22} r={11} fill={C.mint} />
                <Label x={x} y={740} size={22} color={C.muted} font="mono">
                  {k - 4 > 0 ? `+${k - 4}` : k - 4 < 0 ? `−${4 - k}` : '0'}
                </Label>
              </g>
            );
          })}
          <Label x={1400} y={800} size={24} color={C.muted} opacity={ramp(t, g0 + 1.4, g0 + 2.2)}>
            tanpa medan luar: berimpit (degenerat)
          </Label>
        </g>
      </Stage>

      {/* baris 4: ³F₄ diurai */}
      <Chip x={540} y={640} color={C.violet} opacity={s4 * ch1} size={36}>
        <span style={{color: C.violet, fontFamily: FONT.serif}}>3</span> = 2<V>S</V> + 1 → <V>S</V> = 1
      </Chip>
      <Chip x={960} y={640} color={C.gold} opacity={s4 * ch2} size={36}>
        <span style={{color: C.gold, fontFamily: FONT.serif}}>F</span> → <V>L</V> = 3
      </Chip>
      <Chip x={1380} y={640} color={C.mint} opacity={s4 * ch3} size={36}>
        <span style={{color: C.mint, fontFamily: FONT.serif}}>4</span> → <V>J</V> = 4
      </Chip>
      <Card x={960} y={770} plain opacity={s4 * ramp(t, cue(4) + 4.2, cue(4) + 4.9)}>
        <div style={{fontSize: 26, color: C.muted}}>
          J = 4 ada di rentang |L − S| = 2 sampai L + S = 4
        </div>
      </Card>

      {/* baris 5: g = 2J + 1 */}
      <Formula x={600} y={690} p={s5 * gCard} accent={C.mint} caption="degenerasi tingkat">
        <V>g</V> = 2<V color={C.mint}>J</V> + 1 = 9
      </Formula>

      {/* baris 6: jebakan */}
      <Badge x={960} y={240} text="AWAS JEBAKAN" color={C.red} opacity={s6} scale={0.9 + 0.1 * s6 + 0.03 * Math.sin(t * 4)} />
      {[
        {y: 430, p: trap1, left: <Term m="2" L="P" />, lcap: '2 = 2S + 1 → S = ½ (spin)', right: <span style={{fontFamily: FONT.serif}}>2p</span>, rcap: 'n = 2, l = 1 (satu orbital)'},
        {y: 690, p: trap2, left: <Term m="1" L="S" J="0" />, lcap: 'huruf S = L total 0 (seluruh atom)', right: <span style={{fontFamily: FONT.serif, fontStyle: 'italic'}}>s</span>, rcap: 'orbital s: l = 0 (satu elektron)'},
      ].map((r) => (
        <React.Fragment key={r.y}>
          <Card x={600} y={r.y} opacity={s6 * r.p} accent={C.violet} style={{width: 520, textAlign: 'center'}}>
            <div style={{fontSize: 96, lineHeight: 1.1}}>{r.left}</div>
            <div style={{fontSize: 26, color: C.muted, marginTop: 6}}>{r.lcap}</div>
          </Card>
          <Card x={960} y={r.y} plain opacity={s6 * r.p}>
            <div style={{fontSize: 90, color: C.red, fontFamily: FONT.serif, transform: `scale(${1 + 0.06 * Math.sin(t * 3)})`}}>≠</div>
          </Card>
          <Card x={1320} y={r.y} opacity={s6 * r.p} accent={C.cyan} style={{width: 520, textAlign: 'center'}}>
            <div style={{fontSize: 96, lineHeight: 1.1, color: C.cyan}}>{r.right}</div>
            <div style={{fontSize: 26, color: C.muted, marginTop: 6}}>{r.rcap}</div>
          </Card>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
