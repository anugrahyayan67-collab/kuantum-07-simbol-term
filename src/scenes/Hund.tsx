import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Badge, Card, Formula, Glow, Label, Stage, Sub, V} from '../components/primitives';
import {Chip, OrbitalBoxes, Term, TermSVG} from '../components/grupB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 06: empat aturan Hund; karbon 2p² → S = 1, L = 1, J = 0 → ³P₀.
const RULES = [
  {title: 'Abaikan subkulit penuh', sub: 'spin & orbitalnya selalu nol'},
  {title: 'Spin total S sebesar mungkin', sub: 'orbital berbeda, spin sejajar dulu'},
  {title: 'Untuk S maksimum, L terbesar', sub: 'L = |Σmₗ| sebesar mungkin'},
  {title: 'Tentukan J', sub: '< ½ penuh: |L − S|  ·  > ½ penuh: L + S'},
];
const RX = 1400; // pusat panel kanan
const ML = ['+1', '0', '−1'];

export const Hund: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  // baris 0: tiga term C 2p², urutan energinya belum diketahui → aturan Hund menjawab
  const s0 = slot(t, 0.2, cue(1), 0.7, 0.45);
  const settle = ramp(t, wordOf(0, 'sinilah') - 0.2, wordOf(0, 'Hund') + 0.4, EASE_IN_OUT);
  // daftar aturan
  const ruleIn = [0, 1, 2, 3].map((i) => ramp(t, cue(i + 1) - 0.1, cue(i + 1) + 0.6, BACK));
  const act = (a: number, b: number) => ramp(t, a, a + 0.4) * (1 - ramp(t, b - 0.3, b + 0.1));
  const sAt = cue(6) + 0.1;
  const lAt = wordOf(6, 'L', 0);
  const jAt = wordOf(6, 'maka');
  const active = [
    act(cue(1), cue(2)),
    Math.max(act(cue(2), cue(3)), act(sAt, lAt)),
    Math.max(act(cue(3), cue(4)), act(lAt, jAt)),
    Math.max(act(cue(4), cue(5)), act(jAt, cue(7))),
  ];
  // panel kanan
  const s1 = slot(t, cue(1) + 0.2, cue(2));
  const s2 = slot(t, cue(2) + 0.2, cue(3));
  const hop = ramp(t, wordOf(2, 'sejajar') - 0.3, wordOf(2, 'sejajar') + 0.9, EASE_IN_OUT);
  const s3 = slot(t, cue(3) + 0.1, cue(4));
  const s4 = slot(t, cue(4) + 0.2, cue(5));
  const s5 = ramp(t, cue(5) + 0.1, cue(5) + 0.7);
  const e1 = ramp(t, wordOf(5, 'satu') - 0.3, wordOf(5, 'satu') + 0.5, EASE_IN_OUT);
  const e2 = ramp(t, wordOf(5, 'nol') - 0.3, wordOf(5, 'nol') + 0.5, EASE_IN_OUT);
  const up6 = ramp(t, cue(6) - 0.3, cue(6) + 0.5, EASE_IN_OUT);
  const cS = ramp(t, sAt, sAt + 0.5, BACK);
  const cL = ramp(t, lAt, lAt + 0.5, BACK);
  const cJ = ramp(t, jAt, jAt + 0.5, BACK);
  const fin = ramp(t, wordOf(6, 'Term') - 0.2, wordOf(6, 'Term') + 0.6);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  const bY = mix(520, 430, up6);

  // tingkat term di baris 0: berpindah-pindah, lalu menetap (³P terendah, ¹D, ¹S teratas)
  const terms = [
    {m: '3', L: 'P', fin: 2, col: C.violet},
    {m: '1', L: 'D', fin: 1, col: C.gold},
    {m: '1', L: 'S', fin: 0, col: C.cyan},
  ];
  const levelY = (k: number) => 340 + k * 170;

  return (
    <AbsoluteFill>
      <Stage>
        <g opacity={s0}>
          <Label x={960} y={265} size={32} color={C.muted}>
            karbon 1s² 2s² 2p² → tiga term
          </Label>
          {terms.map((tm, i) => {
            const wob = (Math.sin(t * 1.3 + i * 2.1) + 1) * 1; // 0..2
            const y = mix(levelY(wob), levelY(tm.fin), settle);
            const low = tm.fin === 2 ? settle : 0;
            return (
              <g key={i}>
                {low > 0.01 ? <Glow x={960} y={y} r={180} color="violet" opacity={0.5 * low * (0.7 + 0.3 * pulse)} /> : null}
                <line x1={760} y1={y} x2={1160} y2={y} stroke={tm.col} strokeWidth={6} strokeLinecap="round" opacity={0.6 + 0.4 * low} />
                <TermSVG x={1210 + i * 80} y={y} m={tm.m} L={tm.L} size={52} colored={false} color={tm.col} anchor="start" />
              </g>
            );
          })}
          <Label x={700} y={680} size={30} color={C.violet} anchor="end" opacity={settle} weight={700}>
            terendah →
          </Label>
          <Label x={560} y={420} size={60} color={C.muted} opacity={1 - settle} font="serif">
            ?
          </Label>
          <line x1={600} y1={300} x2={600} y2={720} stroke={C.faint} strokeWidth={2} />
          <Label x={600} y={278} size={22} color={C.muted}>
            E
          </Label>
        </g>

        {/* aturan 1: subkulit penuh */}
        <g opacity={s1}>
          <Label x={RX} y={330} size={30} color={C.muted}>
            2p⁶ (penuh)
          </Label>
          <OrbitalBoxes x={RX} y={480} n={3} fill={[[1, 1], [1, 1], [1, 1]]} w={130} h={140} t={t} labels={ML} labelSize={24} />
          <Label x={RX} y={660} size={30} color={C.ink}>
            Σmₛ = 0 · Σmₗ = 0
          </Label>
          <Label x={RX} y={710} size={30} color={C.mint} weight={700}>
            → S = 0, L = 0
          </Label>
        </g>

        {/* aturan 2: spin sejajar di orbital berbeda */}
        <g opacity={s2}>
          <Label x={RX} y={330} size={30} color={C.muted}>
            dua elektron di tiga orbital p
          </Label>
          <OrbitalBoxes x={RX} y={480} n={3} fill={[[1, 1 - hop], [hop, 0], [0, 0]]} w={130} h={140} t={t} labels={ML} labelSize={24} hi={[0, hop * pulse, 0]} />
          <Label x={RX} y={660} size={30} color={C.red} opacity={1 - hop}>
            berpasangan: S = 0 (energi lebih tinggi)
          </Label>
          <Label x={RX} y={660} size={30} color={C.mint} weight={700} opacity={hop}>
            spin sejajar: S = 1 ✓
          </Label>
        </g>
      </Stage>

      {/* daftar aturan (kiri) */}
      {RULES.map((r, i) => {
        const a = active[i];
        const dim = t > cue(5) - 0.3 && a < 0.05 ? 0.55 : 0.8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 110 + 16 * a,
              top: 260 + i * 140,
              width: 720,
              opacity: ruleIn[i] * (dim + (1 - dim) * a),
              transform: `translateX(${(1 - ruleIn[i]) * -40}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '16px 24px',
              borderRadius: 18,
              background: `linear-gradient(160deg, rgba(22,30,58,${0.6 + 0.3 * a}), rgba(8,11,24,0.8))`,
              border: `2px solid rgba(255,194,74,${0.15 + 0.75 * a})`,
              boxShadow: `0 0 ${40 * a}px rgba(255,194,74,${0.3 * a})`,
              fontFamily: FONT.sans,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                fontWeight: 800,
                color: '#1a1206',
                background: C.gold,
                opacity: 0.55 + 0.45 * a,
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{fontSize: 33, fontWeight: 700, color: C.ink}}>{r.title}</div>
              <div style={{fontSize: 24, color: C.muted, marginTop: 4}}>{r.sub}</div>
            </div>
          </div>
        );
      })}

      {/* aturan 3 */}
      <Formula x={RX} y={500} p={s3} accent={C.gold} caption={<span>M<sub>L</sub> terbesar yang tercapai, untuk S maksimum</span>}>
        <V color={C.gold}>L</V> = |Σ<V>m</V>
        <Sub>
          <V>l</V>
        </Sub>
        |<sub style={{fontSize: '0.5em', verticalAlign: '-0.32em', lineHeight: 0, fontFamily: FONT.sans}}> maks</sub>
      </Formula>

      {/* aturan 4 */}
      <Card x={RX} y={500} opacity={s4} scale={0.92 + 0.08 * s4} accent={C.mint} style={{padding: '26px 40px'}}>
        <div style={{fontSize: 28, color: C.muted, marginBottom: 8}}>kurang dari setengah penuh</div>
        <div style={{fontSize: 56, fontFamily: FONT.serif}}>
          <V color={C.mint}>J</V> = |<V color={C.gold}>L</V> − <V color={C.violet}>S</V>|
        </div>
        <div style={{height: 2, background: `${C.mint}44`, margin: '16px 0'}} />
        <div style={{fontSize: 28, color: C.muted, marginBottom: 8}}>lebih dari setengah penuh</div>
        <div style={{fontSize: 56, fontFamily: FONT.serif}}>
          <V color={C.mint}>J</V> = <V color={C.gold}>L</V> + <V color={C.violet}>S</V>
        </div>
      </Card>

      {/* baris 5–6: karbon */}
      <AbsoluteFill style={{opacity: s5}}>
        <Stage>
          <Label x={RX} y={mix(300, 260, up6)} size={32} color={C.ink} weight={600}>
            karbon: 2p²
          </Label>
          <OrbitalBoxes x={RX} y={bY} n={3} fill={[[0, 0], [0, 0], [0, 0]]} w={140} h={140} t={t} labels={ML} labelSize={26} hi={[e1 * (0.4 + 0.6 * fin * pulse), e2 * (0.4 + 0.6 * fin * pulse), 0]} />
          <Label x={RX - 260} y={bY + 96} size={24} color={C.muted} anchor="end">
            mₗ
          </Label>
          {/* dua elektron spin naik terbang masuk ke mₗ = +1 dan 0 */}
          {[e1, e2].map((p, k) => {
            const bx = RX - 210 + k * 140 + 140 * 0.32; // posisi panah ↑ di kotak k
            const x = mix(1840, bx, p);
            const y = mix(250, bY, p) - Math.sin(Math.PI * p) * 60 + Math.sin(t * 2.2 + k * 1.3) * 5;
            return (
              <g key={k} opacity={ramp(p, 0, 0.15)}>
                <line x1={x} y1={y + 46} x2={x} y2={y - 34} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
                <path d={`M${x},${y - 46} L${x - 12},${y - 28} L${x + 12},${y - 28} Z`} fill={C.cyan} />
              </g>
            );
          })}
          <Label x={RX} y={mix(660, 610, up6)} size={28} color={C.muted} opacity={e2 * (1 - up6)}>
            orbital berbeda, spin sejajar, tidak berpasangan
          </Label>
        </Stage>
      </AbsoluteFill>
      <Chip x={1090} y={640} color={C.violet} opacity={cS} size={30}>
        <V color={C.violet}>S</V> = ½ + ½ = 1
      </Chip>
      <Chip x={1365} y={640} color={C.gold} opacity={cL} size={30}>
        <V color={C.gold}>L</V> = 1 + 0 = 1
      </Chip>
      <Chip x={1630} y={640} color={C.mint} opacity={cJ} size={30}>
        <V color={C.mint}>J</V> = |1 − 1| = 0
      </Chip>
      <Formula x={RX} y={790} p={fin} accent={C.mint} size={72} caption="term dasar karbon">
        <span style={{textShadow: `0 0 ${18 + 14 * pulse}px ${C.mint}88`}}>
          <Term m="3" L="P" J="0" />
        </span>
      </Formula>
      <Badge x={960} y={820} text="ATURAN HUND" color={C.gold} opacity={s0 * settle} />
    </AbsoluteFill>
  );
};
