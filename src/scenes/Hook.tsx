import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, rand, ramp} from '../anim';
import {Glow, Label, Stage} from '../components/primitives';
import {CipherChar, NA_YELLOW, Stars} from '../components/grupA';
import {Electron, PhotonPacket} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Pembuka: lampu jalan natrium → spektroskop → DUA garis kuning (589,0 & 589,6 nm)
// → atom Na dengan satu elektron terluar → "kode" ²P₃/₂ → simbol term.
const LAMP = {x: 392, y: 262};
const SLIT = {x: 690, y: 430};
const PRISM = {x: 850, y: 440};
const SCR = {x: 1180, y: 230, w: 580, h: 400};
const nmX = (nm: number) => SCR.x + 30 + ((nm - 588.5) / 1.6) * (SCR.w - 60);
const ATOM_C = {x: 520, y: 470};
const BUILDINGS = [
  {x: 760, w: 120, h: 210},
  {x: 900, w: 90, h: 320},
  {x: 1010, w: 150, h: 250},
  {x: 1190, w: 110, h: 380},
  {x: 1320, w: 160, h: 230},
  {x: 1500, w: 100, h: 300},
  {x: 1620, w: 140, h: 190},
];

export const Hook: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // --- fase lampu & spektroskop (baris 0–2) ---
  const night = ramp(t, -0.5, 1.2);
  const on = ramp(t, wordOf(0, 'lampu') - 0.2, wordOf(0, 'lampu') + 1.4, EASE_IN_OUT);
  const flick = 0.92 + 0.08 * Math.sin(t * 9.1) * Math.sin(t * 3.3);
  const fadeA = 1 - ramp(t, cue(3) - 0.5, cue(3) + 0.7, EASE_IN_OUT);
  const scope = ramp(t, wordOf(1, 'spektroskop') - 0.4, wordOf(1, 'spektroskop') + 0.6);
  const beam = ramp(t, wordOf(1, 'Lewatkan') - 0.2, wordOf(1, 'spektroskop') + 0.6, EASE_IN_OUT);
  const screenOn = ramp(t, wordOf(1, 'teliti') - 0.3, wordOf(1, 'teliti') + 0.6);
  const one = ramp(t, wordOf(1, 'kuning') - 0.2, wordOf(1, 'kuning') + 0.5);
  const split = ramp(t, wordOf(1, 'dua') - 0.5, wordOf(1, 'dua') + 0.9, EASE_IN_OUT);
  const nm0 = ramp(t, wordOf(2, 'nol') - 0.3, wordOf(2, 'nol') + 0.4);
  const nm6 = ramp(t, wordOf(2, 'enam') - 0.3, wordOf(2, 'enam') + 0.4);
  const zoomGap = ramp(t, cue(2) - 0.2, cue(2) + 1.2, EASE_IN_OUT);

  // --- layar pindah ke pojok kanan atas (baris 3–5) ---
  const mv = ramp(t, cue(3) - 0.3, cue(3) + 1.3, EASE_IN_OUT);
  const scrS = mix(1, 0.72, mv);
  const scrCx = SCR.x + SCR.w / 2;
  const scrCy = SCR.y + SCR.h / 2;
  const tcx = mix(scrCx, 1510, mv);
  const tcy = mix(scrCy, 334, mv);
  const scrT = `translate(${tcx} ${tcy}) scale(${scrS}) translate(${-scrCx} ${-scrCy})`;

  // --- atom Na ---
  const atomP = ramp(t, cue(3) - 0.1, cue(3) + 1.0, BACK);
  const outer = ramp(t, wordOf(3, 'terluar') - 0.3, wordOf(3, 'terluar') + 0.5);
  const ask = ramp(t, wordOf(3, 'Mengapa') - 0.2, wordOf(3, 'Mengapa') + 0.6, BACK);
  const toLines = ramp(t, wordOf(3, 'garis') - 0.4, wordOf(3, 'garis') + 0.8, EASE_IN_OUT) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.5, EASE_IN_OUT));
  const atomDim = mix(1, 0.75, ramp(t, cue(4), cue(4) + 1));
  const lblAtom = ramp(t, wordOf(3, 'satu', 0) - 0.2, wordOf(3, 'satu', 0) + 0.5) * (1 - ramp(t, cue(5) - 0.3, cue(5) + 0.3, EASE_IN_OUT));

  // --- kode ---
  const kAt = wordOf(4, 'kode');
  const codeP = ramp(t, kAt - 0.5, kAt + 0.4);
  const scan = (((t - kAt) * 0.55) % 1 + 1) % 1;
  const term = ramp(t, wordOf(5, 'simbol') - 0.3, wordOf(5, 'simbol') + 0.6, BACK);
  const chips = ['membacanya', 'menyusunnya', 'memakainya'].map((w) => ramp(t, wordOf(5, w) - 0.3, wordOf(5, w) + 0.4, BACK));
  const chipTxt = ['membaca', 'menyusun', 'meramal cahaya'];

  // dua garis
  const xa = mix(nmX(589.3), nmX(588.995), split);
  const xb = mix(nmX(589.3), nmX(589.592), split);
  const lw = mix(44, 10, split);
  const pulse = 0.85 + 0.15 * Math.sin(t * 2.2);

  // elektron terluar (3s) mengorbit
  const ang = t * 1.1;
  const ex = ATOM_C.x + 205 * Math.cos(ang);
  const ey = ATOM_C.y + 205 * Math.sin(ang) * 0.92;

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <linearGradient id="hk-cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NA_YELLOW} stopOpacity="0.55" />
            <stop offset="100%" stopColor={NA_YELLOW} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hk-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={NA_YELLOW} stopOpacity="0.15" />
            <stop offset="100%" stopColor={NA_YELLOW} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <Stars t={t} opacity={night * 0.9} />
        {/* ---------- lampu jalan + spektroskop ---------- */}
        <g opacity={fadeA * night}>
          {/* siluet kota */}
          <g opacity={1 - 0.65 * scope}>
            {BUILDINGS.map((b, i) => (
              <g key={i}>
                <rect x={b.x} y={820 - b.h} width={b.w} height={b.h} fill="#0b1128" stroke="#1c2648" strokeWidth={2} />
                {Array.from({length: Math.floor(b.h / 46) * 3}, (_, j) => {
                  const cx = b.x + 16 + (j % 3) * ((b.w - 32) / 2);
                  const cy = 820 - b.h + 24 + Math.floor(j / 3) * 46;
                  const lit = rand(i * 17 + j * 3.1) > 0.55;
                  return lit ? <rect key={j} x={cx - 6} y={cy} width={12} height={16} fill={NA_YELLOW} opacity={0.25 + 0.15 * Math.sin(t * 0.7 + j + i)} /> : null;
                })}
              </g>
            ))}
          </g>
          <rect x={120} y={818} width={1680} height={4} rx={2} fill={C.faint} opacity={0.8} />
          <ellipse cx={LAMP.x} cy={822} rx={260} ry={34} fill={NA_YELLOW} opacity={0.18 * on * flick} />
          <path d={`M${LAMP.x - 34},${LAMP.y + 14} L${LAMP.x + 34},${LAMP.y + 14} L${LAMP.x + 230},820 L${LAMP.x - 230},820 Z`} fill="url(#hk-cone)" opacity={0.55 * on * flick} />
          {/* tiang */}
          <rect x={250} y={250} width={16} height={572} rx={6} fill="#2a3352" stroke="#47517a" strokeWidth={2} />
          <path d={`M258,262 Q258,226 300,226 L${LAMP.x - 10},226`} fill="none" stroke="#47517a" strokeWidth={12} strokeLinecap="round" />
          <path d={`M${LAMP.x - 46},${LAMP.y - 30} L${LAMP.x + 46},${LAMP.y - 30} L${LAMP.x + 32},${LAMP.y + 6} L${LAMP.x - 32},${LAMP.y + 6} Z`} fill="#2a3352" stroke="#59628c" strokeWidth={2} />
          <Glow x={LAMP.x} y={LAMP.y + 12} r={300} color="gold" opacity={0.55 * on * flick} />
          <ellipse cx={LAMP.x} cy={LAMP.y + 12} rx={30} ry={12} fill={mixHex('#3a3020', '#fff4c0', on)} />
          <Label x={LAMP.x + 10} y={140} size={26} color={NA_YELLOW} opacity={on} weight={600}>
            lampu natrium
          </Label>
          {/* berkas ke celah */}
          <g opacity={beam * on}>
            <path d={`M${LAMP.x + 30},${LAMP.y + 6} L${SLIT.x},${SLIT.y - 6} L${SLIT.x},${SLIT.y + 6} L${LAMP.x + 24},${LAMP.y + 22} Z`} fill="url(#hk-beam)" />
            {[0, 1, 2].map((k) => {
              const ph = (t * 0.55 + k / 3) % 1;
              const px = mix(LAMP.x + 40, SLIT.x - 20, ph);
              const py = mix(LAMP.y + 16, SLIT.y, ph);
              const a = (Math.atan2(SLIT.y - LAMP.y - 16, SLIT.x - LAMP.x - 40) * 180) / Math.PI;
              return <PhotonPacket key={k} x={px} y={py} wavelength={14} color={NA_YELLOW} amp={12} len={90} opacity={cyc(ph)} phase={-t * 12} angle={a} />;
            })}
          </g>
          {/* spektroskop */}
          <g opacity={scope}>
            <rect x={SLIT.x - 14} y={350} width={360} height={170} rx={20} fill="rgba(12,18,40,0.85)" stroke={C.muted} strokeWidth={2.5} />
            <rect x={SLIT.x - 4} y={SLIT.y - 46} width={8} height={36} fill="#59628c" />
            <rect x={SLIT.x - 4} y={SLIT.y + 10} width={8} height={36} fill="#59628c" />
            <path d={`M${SLIT.x + 4},${SLIT.y} L${PRISM.x - 34},${PRISM.y - 6}`} stroke={NA_YELLOW} strokeWidth={5} strokeLinecap="round" opacity={0.7 * beam} />
            <path d={`M${PRISM.x - 60},${PRISM.y + 50} L${PRISM.x + 60},${PRISM.y + 50} L${PRISM.x},${PRISM.y - 62} Z`} fill="rgba(160,200,255,0.16)" stroke="#bcd0ff" strokeWidth={3} strokeLinejoin="round" />
            {/* sinar terurai: satu → dua */}
            {[xa, xb].map((xx, k) => (
              <path
                key={k}
                d={`M${PRISM.x + 28},${PRISM.y} Q${PRISM.x + 120},${PRISM.y - 14 + (k ? 10 : -10) * split} ${SLIT.x + 346},${PRISM.y - 18 + (k ? 16 : -16) * split}`}
                fill="none"
                stroke={NA_YELLOW}
                strokeWidth={mix(7, 3.5, split)}
                strokeLinecap="round"
                opacity={beam * (k ? split : 1) * 0.85}
              />
            ))}
            <Label x={PRISM.x - 8} y={556} size={24} color={C.muted}>
              spektroskop
            </Label>
          </g>
        </g>
        {/* ---------- layar spektrum ---------- */}
        <g opacity={screenOn} transform={scrT}>
          <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={18} fill="rgba(6,9,20,0.92)" stroke={C.faint} strokeWidth={2.5} />
          <text x={SCR.x + 22} y={SCR.y + 30} fontFamily={FONT.mono} fontSize={20} fill={C.muted} letterSpacing={2}>
            SPEKTRUM Na · diperbesar
          </text>
          {/* sumbu nm */}
          {[588.5, 589, 589.5, 590].map((nm) => (
            <g key={nm} opacity={0.4 + 0.6 * zoomGap}>
              <rect x={nmX(nm) - 1} y={SCR.y + SCR.h - 70} width={2} height={12} fill={C.muted} />
              <text x={nmX(nm)} y={SCR.y + SCR.h - 34} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={C.muted}>
                {String(nm).replace('.', ',')}
              </text>
            </g>
          ))}
          <rect x={SCR.x + 30} y={SCR.y + SCR.h - 60} width={SCR.w - 60} height={2} fill={C.faint} />
          <text x={SCR.x + SCR.w - 30} y={SCR.y + SCR.h - 12} textAnchor="end" fontFamily={FONT.mono} fontSize={16} fill={C.muted} opacity={zoomGap}>
            nm
          </text>
          {/* garis: satu lebar (belum terurai) → dua tajam */}
          <g opacity={one}>
            <rect x={xa - lw * 1.6} y={SCR.y + 56} width={lw * 3.2} height={SCR.h - 130} fill={NA_YELLOW} opacity={0.12 * pulse} rx={lw} />
            <rect x={xb - lw * 1.6} y={SCR.y + 56} width={lw * 3.2} height={SCR.h - 130} fill={NA_YELLOW} opacity={0.12 * pulse * split} rx={lw} />
            <rect x={xa - lw / 2} y={SCR.y + 60} width={lw} height={SCR.h - 138} fill={NA_YELLOW} opacity={pulse} rx={3} />
            <rect x={xb - lw / 2} y={SCR.y + 60} width={lw} height={SCR.h - 138} fill={NA_YELLOW} opacity={pulse * split} rx={3} />
            <rect x={xa - 1.5} y={SCR.y + 60} width={3} height={SCR.h - 138} fill="#fffbe0" opacity={0.8 * split} />
            <rect x={xb - 1.5} y={SCR.y + 60} width={3} height={SCR.h - 138} fill="#fffbe0" opacity={0.8 * split} />
          </g>
          <text x={xa - 18} y={SCR.y + 92} textAnchor="end" fontFamily={FONT.mono} fontSize={24} fontWeight={600} fill={NA_YELLOW} opacity={nm0}>
            589,0 nm
          </text>
          <text x={xb + 18} y={SCR.y + 92} textAnchor="start" fontFamily={FONT.mono} fontSize={24} fontWeight={600} fill={NA_YELLOW} opacity={nm6}>
            589,6 nm
          </text>
        </g>
        <Label x={mix(1470, 1510, mv)} y={mix(680, 520, mv)} size={mix(34, 28, mv)} color={C.gold} weight={700} opacity={split * (1 - ramp(t, cue(4) - 0.4, cue(4) + 0.3, EASE_IN_OUT))}>
          bukan satu garis — dua!
        </Label>
        {/* ---------- atom natrium ---------- */}
        <g opacity={atomP * atomDim} transform={`translate(${ATOM_C.x} ${ATOM_C.y}) scale(${0.8 + 0.2 * atomP}) translate(${-ATOM_C.x} ${-ATOM_C.y})`}>
          {[70, 125].map((r, k) => (
            <g key={r}>
              <circle cx={ATOM_C.x} cy={ATOM_C.y} r={r} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="4 8" />
              {Array.from({length: k ? 8 : 2}, (_, j) => {
                const a = (j / (k ? 8 : 2)) * Math.PI * 2 + t * (k ? 0.6 : 0.9);
                return <circle key={j} cx={ATOM_C.x + r * Math.cos(a)} cy={ATOM_C.y + r * Math.sin(a)} r={6} fill={C.muted} opacity={0.6} />;
              })}
            </g>
          ))}
          <ellipse cx={ATOM_C.x} cy={ATOM_C.y} rx={205} ry={205 * 0.92} fill="none" stroke={C.cyan} strokeWidth={2.5} strokeDasharray="6 8" opacity={0.4 + 0.5 * outer} />
          <Glow x={ATOM_C.x} y={ATOM_C.y} r={90} color="gold" opacity={0.5} />
          <circle cx={ATOM_C.x} cy={ATOM_C.y} r={40} fill="#c9873a" stroke="#ffd28a" strokeWidth={2} />
          <text x={ATOM_C.x} y={ATOM_C.y + 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={32} fill="#fff">
            Na
          </text>
          <circle cx={ex} cy={ey} r={20 + 30 * outer * (0.5 + 0.5 * Math.sin(t * 4))} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.6 * outer} />
          <Electron x={ex} y={ey} r={12 + 4 * outer} />
          <text x={ATOM_C.x + 330} y={ATOM_C.y - 210} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontWeight={600} fontSize={130} fill={C.gold} opacity={ask} transform={`rotate(${8 * Math.sin(t * 1.6)} ${ATOM_C.x + 330} ${ATOM_C.y - 210})`}>
            ?
          </text>
        </g>
        <Label x={ATOM_C.x} y={745} size={28} color={C.cyan} weight={600} opacity={lblAtom}>
          1 elektron terluar (3s¹)
        </Label>
        {/* satu elektron → dua garis? */}
        {[0, 1].map((k) => {
          const tx = mix(scrCx, 1510, 1) + (k ? 45 : -45);
          const d = `M${ATOM_C.x + 230},${ATOM_C.y - 40} C${ATOM_C.x + 480},${ATOM_C.y - 120 + k * 60} ${tx - 220},${520} ${tx},${490}`;
          return <path key={k} d={d} fill="none" stroke={NA_YELLOW} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-t * 30} opacity={0.9 * toLines} />;
        })}
        {/* chip penutup */}
        {chips.map((p, i) => (
          <g key={i} opacity={p} transform={`translate(0 ${(1 - p) * 20})`}>
            <rect x={210 + i * 210 - (i === 2 ? 0 : 0)} y={780} width={i === 2 ? 240 : 190} height={52} rx={26} fill="rgba(12,18,40,0.85)" stroke={C.gold} strokeOpacity={0.6} strokeWidth={2} />
            <text x={210 + i * 210 + (i === 2 ? 120 : 95)} y={807} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={24} fontWeight={600} fill={C.ink}>
              {chipTxt[i]}
            </text>
          </g>
        ))}
      </Stage>
      {/* ---------- kode rahasia ²P₃/₂ ---------- */}
      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 640,
          transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * codeP})`,
          opacity: codeP,
          padding: '26px 64px 34px',
          borderRadius: 20,
          background: 'linear-gradient(160deg, rgba(14,24,40,0.9), rgba(6,10,20,0.9))',
          border: `1px solid ${C.mint}55`,
          boxShadow: `0 0 50px ${C.mint}22, 0 20px 60px rgba(0,0,0,0.5)`,
          overflow: 'hidden',
        }}
      >
        <div style={{fontFamily: FONT.mono, fontSize: 18, letterSpacing: 4, color: C.mint, opacity: 0.8, textAlign: 'center'}}>KODE KEADAAN · 3p</div>
        <div style={{fontFamily: FONT.serif, fontSize: 190, lineHeight: 1.05, whiteSpace: 'nowrap', textAlign: 'center', marginTop: 4}}>
          <span style={{display: 'inline-block', fontSize: 104, transform: 'translateY(-74px)', marginRight: 6}}>
            <CipherChar ch="2" t={t} at={kAt + 1.0} seed={1} color={C.violet} start={kAt - 0.5} />
          </span>
          <CipherChar ch="P" t={t} at={kAt + 1.5} seed={2} color={C.gold} start={kAt - 0.5} />
          <span style={{display: 'inline-block', fontSize: 90, transform: 'translateY(44px)', marginLeft: 4}}>
            {'3/2'.split('').map((ch, i) => (
              <CipherChar key={i} ch={ch} t={t} at={kAt + 2.0 + i * 0.15} seed={3 + i} color={C.mint} start={kAt - 0.5} />
            ))}
          </span>
        </div>
        {/* garis pindai */}
        <div style={{position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 40, marginTop: -20, background: `linear-gradient(180deg, transparent, ${C.mint}22, transparent)`, opacity: codeP * cyc(scan)}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 850,
          transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * term})`,
          opacity: term,
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: 46,
          letterSpacing: 8,
          color: C.gold,
          textShadow: `0 0 30px ${C.gold}66`,
          whiteSpace: 'nowrap',
        }}
      >
        SIMBOL TERM
      </div>
    </AbsoluteFill>
  );
};

/** Campur dua warna hex. */
function mixHex(a: string, b: string, p: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - p) + ((pb >> s) & 255) * p);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}
