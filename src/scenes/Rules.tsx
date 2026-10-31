import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Badge, Label, Stage} from '../components/primitives';
import {Mark, SpinArr, Stamp} from '../components/grupC';
import {PhotonPacket} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 13: aturan seleksi E1 (AUDIT): paritas berubah; ΔS = 0; ΔL, ΔJ = 0, ±1 (0↔0 dilarang); Δl = ±1; tanpa syarat Δn.
const ROWS: {f: React.ReactNode; d: string; col: string}[] = [
  {
    f: (
      <>
        <span style={{color: C.blue}}>genap</span> ↔ <span style={{color: C.amber}}>ganjil</span>
      </>
    ),
    d: 'paritas harus berubah',
    col: C.amber,
  },
  {
    f: (
      <>
        Δ<i style={{color: C.violet}}>S</i> = 0
      </>
    ),
    d: 'spin tak disentuh foton',
    col: C.violet,
  },
  {
    f: (
      <>
        Δ<i style={{color: C.gold}}>L</i>, Δ<i style={{color: C.mint}}>J</i> = 0, ±1
      </>
    ),
    d: '0 ↮ 0 dilarang (untuk L dan J)',
    col: C.gold,
  },
  {
    f: (
      <>
        Δ<i>l</i> = ±1
      </>
    ),
    d: 'bila satu elektron berpindah',
    col: C.cyan,
  },
  {
    f: (
      <>
        Δ<i>n</i> : bebas
      </>
    ),
    d: 'kulit mana pun, asal energi cocok',
    col: C.mint,
  },
];
const RY = (k: number) => 318 + k * 104;
const P = {x: 1500, y: 545}; // pusat panel ikon

export const Rules: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const head = ramp(t, cue(0) - 0.2, cue(0) + 0.6);
  const uts = ramp(t, wordOf(0, 'UTS') - 0.3, wordOf(0, 'UTS') + 0.4, BACK);
  const rowIn = (k: number) => ramp(t, cue(k + 1) - 0.1, cue(k + 1) + 0.6, BACK);
  const active = (k: number) => Math.min(ramp(t, cue(k + 1) - 0.1, cue(k + 1) + 0.4), 1 - ramp(t, cue(k + 2) - 0.2, cue(k + 2) + 0.3, EASE_IN_OUT));
  const panel = ROWS.map((_, k) => slot(t, cue(k + 1) - 0.05, cue(k + 2) - 0.05, 0.5, 0.4));
  const icon0 = slot(t, cue(0) + 0.3, cue(1) - 0.05, 0.6, 0.4);
  const last = slot(t, cue(6) - 0.05, dur + 2, 0.6, 0.4);
  const stamp = ramp(t, wordOf(6, 'kuat', 0) - 0.2, wordOf(6, 'kuat', 0) + 0.35, EASE_IN_OUT);
  const loop = (period: number, a = 0) => Math.max(0, ((t - a) / period) % 1);

  return (
    <AbsoluteFill>
      <Stage>
        {/* bingkai panel ikon */}
        <rect x={1220} y={300} width={560} height={500} rx={28} fill="rgba(12,18,40,0.55)" stroke={C.faint} strokeWidth={2} opacity={head} />
        {/* penanda baris aktif */}
        {ROWS.map((r, k) => (
          <g key={k} opacity={rowIn(k)}>
            <rect x={110} y={RY(k) - 46} width={1060} height={92} rx={20} fill={r.col} opacity={0.08 + 0.1 * active(k)} />
            <rect x={110} y={RY(k) - 46} width={1060} height={92} rx={20} fill="none" stroke={r.col} strokeWidth={2.5} opacity={0.25 + 0.75 * active(k)} />
            <circle cx={160} cy={RY(k)} r={28} fill={r.col} opacity={0.9} />
            <Label x={160} y={RY(k)} size={30} color="#0a0d18" weight={800}>
              {String(k + 1)}
            </Label>
            {active(k) > 0.01 ? <line x1={1176} y1={RY(k)} x2={mix(1176, 1216, active(k))} y2={RY(k)} stroke={r.col} strokeWidth={3} opacity={active(k)} /> : null}
          </g>
        ))}

        {/* ikon baris 0: cahaya + atom = interaksi dipol listrik */}
        <g opacity={icon0}>
          {[0, 1].map((k) => {
            const ph = loop(2.4, k * 1.2);
            return <PhotonPacket key={k} x={mix(1240, 1470, ph)} y={P.y} wavelength={40} color={C.gold} amp={26} len={180} phase={-t * 9} opacity={Math.min(1, ph * 6) * (1 - ph)} />;
          })}
          <circle cx={P.x + 90} cy={P.y} r={22} fill={C.amber} />
          <ellipse cx={P.x + 90} cy={P.y} rx={110 + 8 * Math.sin(t * 3)} ry={110 - 8 * Math.sin(t * 3)} fill="url(#soft-cyan)" opacity={0.35} />
          <Label x={P.x} y={P.y + 190} size={34} color={C.gold} weight={700}>
            E1 = dipol listrik
          </Label>
        </g>

        {/* 1: paritas berubah */}
        <g opacity={panel[0]}>
          {[
            {x: P.x - 130, txt: 'genap', col: C.blue},
            {x: P.x + 130, txt: 'ganjil', col: C.amber},
          ].map((b) => (
            <g key={b.txt}>
              <circle cx={b.x} cy={P.y} r={86} fill={`${b.col}22`} stroke={b.col} strokeWidth={4} />
              <Label x={b.x} y={P.y} size={34} color={b.col} weight={700}>
                {b.txt}
              </Label>
            </g>
          ))}
          {(() => {
            const ph = loop(1.6, cue(1));
            const u = ph < 0.5 ? ph * 2 : (ph - 0.5) * 2;
            const x = ph < 0.5 ? mix(P.x - 40, P.x + 40, u) : mix(P.x + 40, P.x - 40, u);
            const y = P.y - 130 * Math.sin(Math.PI * u) * (ph < 0.5 ? 1 : -1) * 0.8;
            return <circle cx={x} cy={y} r={11} fill={C.gold} opacity={Math.min(1, u * 8, (1 - u) * 8)} />;
          })()}
          <path d={`M${P.x - 60},${P.y - 70} Q${P.x},${P.y - 140} ${P.x + 60},${P.y - 70}`} fill="none" stroke={C.mint} strokeWidth={3} strokeDasharray="6 7" />
          <path d={`M${P.x + 60},${P.y + 70} Q${P.x},${P.y + 140} ${P.x - 60},${P.y + 70}`} fill="none" stroke={C.mint} strokeWidth={3} strokeDasharray="6 7" />
        </g>

        {/* 2: ΔS = 0 — elektron pindah orbit, panah spin tetap */}
        <g opacity={panel[1]}>
          {(() => {
            const jump = ramp(t, cue(2) + 1.4, cue(2) + 2.4, EASE_IN_OUT);
            const back = ramp(t, cue(2) + 4.6, cue(2) + 5.6, EASE_IN_OUT);
            const R = mix(90, 180, jump - back);
            const ang = t * 1.6;
            const ex = P.x + R * Math.cos(ang);
            const ey = P.y - 30 + R * 0.45 * Math.sin(ang);
            const ph = ramp(t, cue(2) + 0.2, cue(2) + 1.6, EASE_IN_OUT);
            return (
              <>
                <ellipse cx={P.x} cy={P.y - 30} rx={90} ry={40} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="5 7" />
                <ellipse cx={P.x} cy={P.y - 30} rx={180} ry={81} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="5 7" />
                <circle cx={P.x} cy={P.y - 30} r={18} fill={C.amber} />
                <PhotonPacket x={mix(1250, P.x, ph)} y={P.y - 160} wavelength={36} color={C.gold} amp={20} len={160} phase={-t * 9} opacity={Math.min(1, ph * 6) * (1 - ph)} />
                <circle cx={ex} cy={ey} r={14} fill={C.cyan} />
                <SpinArr x={ex + 28} y={ey - 6} up len={60} />
                <Label x={P.x} y={P.y + 150} size={30} color={C.violet} weight={700}>
                  orbit berubah, spin tetap ↑
                </Label>
              </>
            );
          })()}
        </g>

        {/* 3: ΔL = 0, ±1; 0 ↔ 0 dilarang */}
        <g opacity={panel[2]}>
          {[
            {L: 'D (L = 2)', y: P.y - 150},
            {L: 'P (L = 1)', y: P.y - 20},
            {L: 'S (L = 0)', y: P.y + 130},
          ].map((l) => (
            <g key={l.L}>
              <line x1={1290} y1={l.y} x2={1560} y2={l.y} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
              <Label x={1580} y={l.y} size={26} color={C.gold} anchor="start" font="mono">
                {l.L}
              </Label>
            </g>
          ))}
          {[
            {x: 1330, y0: P.y + 130, y1: P.y - 20, ok: true, at: 0.8},
            {x: 1420, y0: P.y - 20, y1: P.y - 150, ok: true, at: 1.6},
            {x: 1500, y0: P.y + 130, y1: P.y - 150, ok: false, at: 2.4},
          ].map((a, k) => {
            const p = ramp(t, cue(3) + a.at, cue(3) + a.at + 0.7, EASE_IN_OUT);
            const col = a.ok ? C.mint : C.red;
            return (
              <g key={k}>
                <path d={`M${a.x},${a.y0 - 6} L${a.x},${mix(a.y0 - 6, a.y1 + 8, p)}`} stroke={col} strokeWidth={5} strokeLinecap="round" strokeDasharray={a.ok ? undefined : '9 8'} opacity={Math.min(1, p * 6)} />
                <Mark x={a.x + (a.ok ? -30 : 30)} y={(a.y0 + a.y1) / 2 + (a.ok ? 0 : 66)} ok={a.ok} p={ramp(p, 0.8, 1)} size={18} />
              </g>
            );
          })}
          {/* S ↔ S (0 ↔ 0) dilarang: lengkung kembali ke tingkat yang sama */}
          {(() => {
            const p = ramp(t, wordOf(3, 'dilarang') - 0.4, wordOf(3, 'dilarang') + 0.4);
            return (
              <g opacity={p}>
                <path d={`M1372,${P.y + 124} C1372,${P.y + 52} 1468,${P.y + 52} 1468,${P.y + 124}`} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="8 7" />
                <Mark x={1420} y={P.y + 52} ok={false} p={p} size={18} />
                <Label x={1420} y={P.y + 200} size={28} color={C.red} weight={700}>
                  L = 0 ↮ L = 0
                </Label>
              </g>
            );
          })()}
        </g>

        {/* 4: Δl = ±1 — s → p ✓, p → d ✓, s → d ✗ */}
        <g opacity={panel[3]}>
          {['s', 'p', 'd', 'f'].map((o, i) => (
            <g key={o}>
              <circle cx={1300 + i * 135} cy={P.y} r={44} fill="rgba(12,18,40,0.9)" stroke={i % 2 ? C.amber : C.blue} strokeWidth={4} />
              <Label x={1300 + i * 135} y={P.y} size={40} weight={700} font="mono" color={i % 2 ? C.amber : C.blue}>
                {o}
              </Label>
            </g>
          ))}
          {[
            {a: 0, b: 1, ok: true, up: true, at: 0.8},
            {a: 1, b: 2, ok: true, up: true, at: 1.6},
            {a: 0, b: 2, ok: false, up: false, at: 2.6},
          ].map((r, k) => {
            const p = ramp(t, cue(4) + r.at, cue(4) + r.at + 0.8, EASE_IN_OUT);
            const xa = 1300 + r.a * 135;
            const xb = 1300 + r.b * 135;
            const h = r.up ? -110 : 120;
            const yb = P.y + (r.up ? -50 : 50);
            const col = r.ok ? C.mint : C.red;
            const pts = Array.from({length: 31}, (_, i) => {
              const u = (i / 30) * p;
              return `${mix(xa, xb, u).toFixed(1)},${(yb + h * 4 * u * (1 - u) * 0.5).toFixed(1)}`;
            });
            return (
              <g key={k} opacity={Math.min(1, p * 6)}>
                <path d={`M${pts.join(' L')}`} fill="none" stroke={col} strokeWidth={4} strokeLinecap="round" strokeDasharray={r.ok ? undefined : '9 8'} />
                <Mark x={(xa + xb) / 2} y={yb + h * 0.5 + (r.up ? -26 : 26)} ok={r.ok} p={ramp(p, 0.85, 1)} size={18} />
              </g>
            );
          })}
        </g>

        {/* 5: Δn bebas — lompat ke kulit mana pun */}
        <g opacity={panel[4]}>
          {[1, 2, 3, 4].map((n) => (
            <circle key={n} cx={P.x} cy={P.y} r={40 + n * 48} fill="none" stroke={C.muted} strokeWidth={2} opacity={0.65} strokeDasharray={n === 1 ? undefined : '5 7'} />
          ))}
          {[1, 2, 3, 4].map((n) => (
            <Label key={n} x={P.x} y={P.y - 40 - n * 48} size={20} color={C.muted} font="mono">
              {`n=${n}`}
            </Label>
          ))}
          <circle cx={P.x} cy={P.y} r={16} fill={C.amber} />
          {(() => {
            // elektron: kulit 1 → 4 → 1 → 3 … mengikuti narasi
            const j1 = ramp(t, wordOf(5, 'melompat') - 0.2, wordOf(5, 'melompat') + 0.7, EASE_IN_OUT);
            const j2 = ramp(t, wordOf(5, 'asal') - 0.2, wordOf(5, 'asal') + 0.6, EASE_IN_OUT);
            const j3 = ramp(t, wordOf(5, 'asal') + 1.4, wordOf(5, 'asal') + 2.0, EASE_IN_OUT);
            const n = 1 + 3 * j1 - 3 * j2 + 2 * j3;
            const r = 40 + n * 48;
            const ang = t * (2.4 / Math.sqrt(n));
            const fl = ramp(t, wordOf(5, 'melompat') - 1.2, wordOf(5, 'melompat') - 0.1, EASE_IN_OUT);
            return (
              <>
                <PhotonPacket x={mix(1240, P.x - 40, fl)} y={P.y + 200} wavelength={22} color={'#9a7bff'} amp={18} len={150} phase={-t * 10} opacity={Math.min(1, fl * 6) * (1 - fl)} />
                <circle cx={P.x + r * Math.cos(ang)} cy={P.y - r * Math.sin(ang)} r={13} fill={C.cyan} />
              </>
            );
          })()}
        </g>

        {/* 6: diizinkan ≠ pasti kuat — garis spektrum dengan kekuatan berbeda */}
        <g opacity={last}>
          <rect x={1260} y={P.y - 40} width={480} height={180} rx={10} fill="rgba(6,8,16,0.95)" stroke={C.faint} strokeWidth={2} />
          {[0.95, 0.35, 0.7, 0.15, 0.55, 0.25].map((h, k) => {
            const x = 1310 + k * 78;
            const a = ramp(t, cue(6) + 0.3 + k * 0.2, cue(6) + 0.8 + k * 0.2) * (0.85 + 0.15 * Math.sin(t * 3 + k));
            return (
              <g key={k} opacity={a}>
                <rect x={x - 4} y={P.y + 130 - 160 * h} width={8} height={160 * h} rx={3} fill={C.gold} opacity={0.35 + 0.65 * h} />
                <circle cx={x} cy={P.y + 168} r={6} fill={C.mint} />
              </g>
            );
          })}
          <Label x={1500} y={P.y + 210} size={26} color={C.muted}>
            semua diizinkan · kekuatan berbeda
          </Label>
          <Label x={1500} y={P.y - 95} size={28} color={C.ink} weight={600} opacity={ramp(t, wordOf(6, 'integral') - 0.3, wordOf(6, 'integral') + 0.4)}>
            integral transisi × populasi
          </Label>
        </g>
      </Stage>

      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 222,
          transform: 'translateY(-50%)',
          opacity: head,
          fontFamily: FONT.sans,
          fontSize: 38,
          fontWeight: 700,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        Aturan seleksi dipol listrik <span style={{color: C.gold}}>(E1)</span>
      </div>
      <Badge x={780} y={222} text="untuk UTS" color={C.gold} opacity={uts} scale={0.85 + 0.15 * uts} />
      {ROWS.map((r, k) => (
        <React.Fragment key={k}>
          <div
            style={{
              position: 'absolute',
              left: 214,
              top: RY(k),
              transform: `translate(${(1 - rowIn(k)) * -30}px, -50%)`,
              opacity: Math.min(1, rowIn(k)),
              fontFamily: FONT.serif,
              fontSize: 56,
              color: C.ink,
              whiteSpace: 'nowrap',
            }}
          >
            {r.f}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 650,
              top: RY(k),
              transform: 'translateY(-50%)',
              opacity: Math.min(1, rowIn(k)) * (0.7 + 0.3 * active(k)),
              fontFamily: FONT.sans,
              fontSize: 29,
              color: C.muted,
              whiteSpace: 'nowrap',
            }}
          >
            {r.d}
          </div>
        </React.Fragment>
      ))}
      <Stamp x={1500} y={362} p={stamp} text="diizinkan ≠ pasti kuat" color={C.gold} size={36} rot={-7} />
    </AbsoluteFill>
  );
};
