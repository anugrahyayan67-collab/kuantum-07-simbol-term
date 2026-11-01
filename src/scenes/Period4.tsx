import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp, slot} from '../anim';
import {Formula, Label, Stage, Sup} from '../components/primitives';
import {TermHtml, TermSvg, type Term} from '../components/grupC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 9: term dasar periode 4 (K…Kr) — NIST/Modul 7 §8 (lihat naskah/AUDIT.md).
type El = {sym: string; cfg: React.ReactNode; term: Term; mult: number; block: 's' | 'd' | 'p'};
const sup = (s: string) => <Sup>{s}</Sup>;
const EL: El[] = [
  {sym: 'K', cfg: <>4s{sup('1')}</>, term: {m: '2', L: 'S', J: '1/2'}, mult: 2, block: 's'},
  {sym: 'Ca', cfg: <>4s{sup('2')}</>, term: {m: '1', L: 'S', J: '0'}, mult: 1, block: 's'},
  {sym: 'Sc', cfg: <>3d{sup('1')}</>, term: {m: '2', L: 'D', J: '3/2'}, mult: 2, block: 'd'},
  {sym: 'Ti', cfg: <>3d{sup('2')}</>, term: {m: '3', L: 'F', J: '2'}, mult: 3, block: 'd'},
  {sym: 'V', cfg: <>3d{sup('3')}</>, term: {m: '4', L: 'F', J: '3/2'}, mult: 4, block: 'd'},
  {sym: 'Cr', cfg: <>3d{sup('5')}4s{sup('1')}</>, term: {m: '7', L: 'S', J: '3'}, mult: 7, block: 'd'},
  {sym: 'Mn', cfg: <>3d{sup('5')}</>, term: {m: '6', L: 'S', J: '5/2'}, mult: 6, block: 'd'},
  {sym: 'Fe', cfg: <>3d{sup('6')}</>, term: {m: '5', L: 'D', J: '4'}, mult: 5, block: 'd'},
  {sym: 'Co', cfg: <>3d{sup('7')}</>, term: {m: '4', L: 'F', J: '9/2'}, mult: 4, block: 'd'},
  {sym: 'Ni', cfg: <>3d{sup('8')}</>, term: {m: '3', L: 'F', J: '4'}, mult: 3, block: 'd'},
  {sym: 'Cu', cfg: <>3d{sup('10')}4s{sup('1')}</>, term: {m: '2', L: 'S', J: '1/2'}, mult: 2, block: 'd'},
  {sym: 'Zn', cfg: <>3d{sup('10')}</>, term: {m: '1', L: 'S', J: '0'}, mult: 1, block: 'd'},
  {sym: 'Ga', cfg: <>4p{sup('1')}</>, term: {m: '2', L: 'P', J: '1/2', odd: true}, mult: 2, block: 'p'},
  {sym: 'Ge', cfg: <>4p{sup('2')}</>, term: {m: '3', L: 'P', J: '0'}, mult: 3, block: 'p'},
  {sym: 'As', cfg: <>4p{sup('3')}</>, term: {m: '4', L: 'S', J: '3/2', odd: true}, mult: 4, block: 'p'},
  {sym: 'Se', cfg: <>4p{sup('4')}</>, term: {m: '3', L: 'P', J: '2'}, mult: 3, block: 'p'},
  {sym: 'Br', cfg: <>4p{sup('5')}</>, term: {m: '2', L: 'P', J: '3/2', odd: true}, mult: 2, block: 'p'},
  {sym: 'Kr', cfg: <>4p{sup('6')}</>, term: {m: '1', L: 'S', J: '0'}, mult: 1, block: 'p'},
];
const CW = 90;
const GAP = 6;
const X0 = (1920 - (18 * (CW + GAP) - GAP)) / 2;
const cx = (i: number) => X0 + i * (CW + GAP) + CW / 2;
const CELL_Y = 600; // atas sel
const CELL_H = 136;
const BASE = 572; // dasar grafik batang
const UNIT = 42;
const BLOCK_COL = {s: C.cyan, d: C.gold, p: C.violet};

export const Period4: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  // waktu menyala tiap unsur, menempel ke nama unsur di narasi
  const pBlock = wordOf(5, 'blok');
  const T: number[] = [
    wordOf(1, 'Kalium'),
    wordOf(1, 'Kalsium'),
    wordOf(2, 'skandium'),
    wordOf(2, 'titanium'),
    wordOf(2, 'vanadium'),
    wordOf(3, 'kromium'),
    wordOf(3, 'mangan'),
    wordOf(4, 'besi'),
    wordOf(4, 'kobalt'),
    wordOf(4, 'nikel'),
    wordOf(5, 'Tembaga'),
    wordOf(5, 'seng'),
    ...[0, 1, 2, 3, 4].map((k) => pBlock + 0.3 + k * 0.5),
    wordOf(5, 'kripton'),
  ];
  const on = T.map((a) => ramp(t, a - 0.15, a + 0.45, BACK));
  const cellIn = (i: number) => ramp(t, cue(0) + 0.4 + i * 0.12, cue(0) + 1.0 + i * 0.12);
  const ends = ramp(t, wordOf(0, 'kalium') - 0.1, wordOf(0, 'kalium') + 0.5) * (1 - ramp(t, cue(1) - 0.3, cue(1), EASE_IN_OUT));
  const peak = ramp(t, cue(3) + 0.4, cue(3) + 1.4);
  const pPattern = ramp(t, pBlock, pBlock + 0.8);
  const parity = ramp(t, wordOf(5, 'kripton') + 0.6, wordOf(5, 'kripton') + 1.4);
  const blocks = ramp(t, cue(2) - 0.4, cue(2) + 0.6);
  // unsur yang sedang dibahas (untuk kartu besar)
  const cardEnd = (k: number) => (k < 11 ? T[k + 1] - 0.05 : pBlock + 0.1);
  const pCard = slot(t, pBlock + 0.1, dur + 2, 0.6, 0.4);
  const titleCard = slot(t, cue(0) + 0.6, T[0] - 0.05, 0.6, 0.35);
  return (
    <AbsoluteFill>
      <Stage>
        {/* sumbu grafik multiplisitas */}
        <g opacity={ramp(t, cue(1) - 0.6, cue(1) + 0.3)}>
          <line x1={X0 - 10} y1={BASE} x2={X0 + 18 * (CW + GAP)} y2={BASE} stroke={C.faint} strokeWidth={2} />
          {[1, 3, 5, 7].map((v) => (
            <g key={v}>
              <line x1={X0 - 6} y1={BASE - v * UNIT} x2={X0 + 18 * (CW + GAP)} y2={BASE - v * UNIT} stroke={C.faint} strokeWidth={1} strokeDasharray="4 10" opacity={0.5} />
            </g>
          ))}
          <Label x={X0 + 6} y={BASE - 5 * UNIT} size={26} color={C.violet} anchor="start" weight={600}>
            multiplisitas 2S+1
          </Label>
        </g>
        {/* batang multiplisitas */}
        {EL.map((e, i) => {
          const h = e.mult * UNIT * on[i] * (1 + 0.025 * Math.sin(t * 2.2 + i * 0.7) * on[i]);
          const top = Math.max(0, h);
          const isPeak = i === 5 || i === 6;
          return (
            <g key={e.sym} opacity={Math.min(1, on[i] * 1.5)}>
              <rect x={cx(i) - 26} y={BASE - top} width={52} height={top} rx={6} fill={C.violet} opacity={isPeak ? 0.55 + 0.35 * peak : 0.45} />
              <rect x={cx(i) - 26} y={BASE - top} width={52} height={Math.min(8, top)} rx={4} fill="#fff" opacity={0.35} />
              <Label x={cx(i)} y={BASE - top - 20} size={isPeak ? 30 : 24} color={isPeak ? C.ink : C.violet} weight={700}>
                {String(e.mult)}
              </Label>
            </g>
          );
        })}
        {/* puncak Cr–Mn */}
        <g opacity={peak}>
          <path
            d={`M${cx(5) - 40},${BASE - 7 * UNIT - 52} Q${(cx(5) + cx(6)) / 2},${BASE - 7 * UNIT - 92 - 6 * Math.sin(t * 2)} ${cx(6) + 40},${BASE - 6 * UNIT - 52}`}
            fill="none"
            stroke={C.gold}
            strokeWidth={3}
            strokeDasharray="6 8"
          />
          <Label x={cx(5) - 56} y={BASE - 7 * UNIT - 56} size={26} color={C.gold} weight={600} anchor="end">
            puncak: 6 & 5 elektron tak berpasangan
          </Label>
        </g>
        {/* sel tabel periodik */}
        {EL.map((e, i) => {
          const p = cellIn(i);
          const lit = on[i];
          const active = Math.max(0, Math.min(1, on[i])) * (1 - ramp(t, T[i] + 1.6, T[i] + 2.4, EASE_IN_OUT));
          const endGlow = (i === 0 || i === 17 ? ends : 0) + (e.term.odd ? parity * (0.6 + 0.4 * Math.sin(t * 4)) : 0);
          return (
            <g key={e.sym} opacity={p} transform={`translate(0 ${(1 - p) * 30})`}>
              <rect
                x={cx(i) - CW / 2}
                y={CELL_Y}
                width={CW}
                height={CELL_H}
                rx={10}
                fill="rgba(14,20,44,0.88)"
                stroke={BLOCK_COL[e.block]}
                strokeOpacity={0.35 + 0.65 * Math.max(active, endGlow > 0 ? Math.min(1, endGlow) : 0)}
                strokeWidth={2 + 3 * active}
              />
              <rect x={cx(i) - CW / 2} y={CELL_Y} width={CW} height={CELL_H} rx={10} fill={C.gold} opacity={0.12 * active} />
              <Label x={cx(i)} y={CELL_Y + 36} size={34} weight={700} color={C.ink}>
                {e.sym}
              </Label>
              <TermSvg x={cx(i)} y={CELL_Y + 96} term={e.term} size={30} opacity={Math.min(1, lit)} colored />
              {e.term.odd ? <circle cx={cx(i) + 18} cy={CELL_Y + 80} r={16} fill="none" stroke={C.amber} strokeWidth={3} opacity={parity * (0.6 + 0.4 * Math.sin(t * 4))} /> : null}
            </g>
          );
        })}
        {/* label blok */}
        <g opacity={blocks}>
          {(
            [
              ['blok s', 0, 1, C.cyan],
              ['blok d · d¹ … d¹⁰', 2, 11, C.gold],
              ['blok p · p¹ … p⁶', 12, 17, C.violet],
            ] as const
          ).map(([name, a, b, col]) => (
            <g key={name} opacity={name.startsWith('blok p') ? pPattern : 1}>
              <path d={`M${cx(a) - 40},${CELL_Y + CELL_H + 20} v10 H${cx(b) + 40} v-10`} fill="none" stroke={col} strokeWidth={2.5} opacity={0.8} />
              <Label x={(cx(a) + cx(b)) / 2} y={CELL_Y + CELL_H + 56} size={26} color={col} weight={600}>
                {name}
              </Label>
            </g>
          ))}
        </g>
        <Label x={(cx(12) + cx(17)) / 2} y={CELL_Y + CELL_H + 102} size={26} color={C.amber} weight={600} opacity={parity}>
          ° = paritas ganjil (p¹, p³, p⁵)
        </Label>
      </Stage>
      {/* konfigurasi kecil di bawah simbol unsur (HTML agar superskrip rapi) */}
      {EL.map((e, i) => (
        <div
          key={e.sym}
          style={{
            position: 'absolute',
            left: cx(i),
            top: CELL_Y + 62,
            transform: 'translate(-50%, -50%)',
            fontFamily: FONT.mono,
            fontSize: 16,
            color: C.muted,
            whiteSpace: 'nowrap',
            opacity: cellIn(i) * (0.5 + 0.5 * Math.min(1, on[i])),
          }}
        >
          {e.cfg}
        </div>
      ))}
      {/* kartu besar: unsur yang sedang dibahas */}
      <Formula x={1440} y={262} p={titleCard} accent={C.gold} size={56}>
        <span style={{fontFamily: FONT.sans, fontWeight: 600}}>K → Kr</span>
        <span style={{fontSize: 30, color: C.muted, fontFamily: FONT.sans}}> · 18 unsur</span>
      </Formula>
      {EL.slice(0, 12).map((e, k) => (
        <Formula key={e.sym} x={1440} y={262} p={slot(t, T[k] - 0.1, cardEnd(k), Math.min(0.5, (cardEnd(k) - T[k]) * 0.35), 0.3)} accent={C.violet} size={60}>
          <span style={{fontFamily: FONT.sans, fontWeight: 700}}>{e.sym}</span>
          <span style={{fontSize: 34, color: C.muted, fontFamily: FONT.mono, margin: '0 22px'}}>{e.cfg}</span>
          <TermHtml term={e.term} colored />
        </Formula>
      ))}
      <Formula x={1440} y={262} p={pCard} accent={C.violet} size={56}>
        <span style={{fontSize: 38, fontFamily: FONT.sans}}>
          p<Sup>1</Sup>…p<Sup>6</Sup>
        </span>{' '}
        <span>
          <TermHtml term={EL[12].term} /> <TermHtml term={EL[13].term} /> <TermHtml term={EL[14].term} /> <TermHtml term={EL[15].term} /> <TermHtml term={EL[16].term} />{' '}
          <TermHtml term={EL[17].term} />
        </span>
      </Formula>
    </AbsoluteFill>
  );
};
