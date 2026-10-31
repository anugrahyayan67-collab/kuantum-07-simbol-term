import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {PhaseWave, freePacket} from '../components/qm';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const REFS = [
  'Modul 7 Kimia Kuantum — Simbol Term dan Aturan Seleksi (bahan kuliah, UNESA)',
  'P. Atkins & J. de Paula, Physical Chemistry · I. N. Levine, Quantum Chemistry, ed. 7',
  'NIST Atomic Spectroscopy (Martin & Wiese): bag. 8 term yang diizinkan, bag. 17 aturan seleksi',
  'NIST Atomic Spectra Database: garis D natrium 588,995 & 589,592 nm · Hg 253,65 nm · Lyman α 121,6 nm',
  'NIST Basic Atomic Spectroscopic Data: term dasar unsur periode 4 (K–Kr)',
  'W. Gerlach & O. Stern, Z. Phys. 9, 349 (1922) — pemisahan berkas atom perak',
  'W. Pauli, Z. Phys. 31, 765 (1925) — prinsip larangan',
  'F. Hund, Linienspektren und periodisches System der Elemente (1927)',
  'H. N. Russell & F. A. Saunders, Astrophys. J. 61, 38 (1925) — kopling LS',
  'J. Fraunhofer (1814) — garis gelap spektrum Matahari, garis D',
  'W. Koechner, Solid-State Laser Engineering — Nd:YAG ⁴F₃/₂ → ⁴I₁₁/₂, 1064 nm',
  'N. J. Turro, Modern Molecular Photochemistry — fluoresensi & fosforesensi',
  'C. E. Housecroft & A. G. Sharpe, Inorganic Chemistry — warna pucat Mn²⁺ (d⁵, terlarang spin)',
];

export const Outro: React.FC = () => {
  const {t, dur} = useScene();
  const a = ramp(t, 0, 1.6);
  const waves = ramp(t, 0, 4, EASE_IN_OUT);
  const refs = ramp(t, 2.4, 3.4);
  const out = 1 - ramp(t, dur - 1.6, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={300} r={500} color="violet" opacity={0.15} />
        <g opacity={0.3 * waves}>
          <PhaseWave f={(u) => freePacket((u - 0.5) * 24, 0.3 + t * 0.1, -5 + t * 0.4, 1.6, 4)} x={260} y={330} w={1400} sy={90} n={200} outline={false} mirror />
        </g>
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 150}}>
        <div style={{fontFamily: FONT.sans, fontSize: 30, letterSpacing: 18, color: C.ink, fontWeight: 300, opacity: a}}>KIMIA KUANTUM · MODUL 7</div>
        <div style={{fontFamily: FONT.sans, fontSize: 100, fontWeight: 800, color: C.gold, lineHeight: 1.05, opacity: a, textShadow: '0 0 50px rgba(255,194,74,0.4)'}}>KODE RAHASIA ATOM</div>
        <div style={{marginTop: 22, fontFamily: FONT.sans, fontSize: 34, color: C.ink, opacity: ramp(t, 1.2, 2.2)}}>Terima kasih telah menonton</div>
        <div style={{marginTop: 46, textAlign: 'center', opacity: refs}}>
          <div style={{fontFamily: FONT.mono, fontSize: 20, letterSpacing: 4, color: C.muted, marginBottom: 14}}>RUJUKAN</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 56, rowGap: 6, width: 1720, textAlign: 'left'}}>
            {REFS.map((r, i) => (
              <div key={r} style={{fontFamily: FONT.sans, fontSize: 22, color: C.muted, lineHeight: 1.4, opacity: ramp(t, 2.4 + i * 0.08, 3.2 + i * 0.08)}}>
                {r}
              </div>
            ))}
          </div>
          <div style={{marginTop: 20, fontFamily: FONT.sans, fontSize: 22, color: C.muted, opacity: 0.8}}>
            Term & contoh mengikuti Modul 7 dan NIST · pendekatan kopling LS (Russell–Saunders) · nilai ukur ditandai “≈” · ilustrasi alat skematis
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
