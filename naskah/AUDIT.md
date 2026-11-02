# Audit angka & istilah — *Kode Rahasia Atom* (Modul 7: Simbol Term & Aturan Seleksi)

Sumber utama: Modul 7 (bahan kuliah), NIST Atomic Spectroscopy (Martin & Wiese) bag. 8 & 17, NIST ASD / Basic Atomic Spectroscopic Data, Atkins & de Paula, Levine.

| Adegan | Klaim | Nilai / dasar · dicek | Sumber |
|---|---|---|---|
| hook, fine, laser | Garis D natrium (3p ²P → 3s ²S₁/₂) | D₂ (²P₃/₂) 588,995 nm ≈ 589,0; D₁ (²P₁/₂) 589,592 nm ≈ 589,6; selisih ≈ 17,2 cm⁻¹ · ✓ 2 Nov 2026 | NIST ASD Na I: 588,995095 & 589,592424 nm (udara); E(²P°₃/₂) − E(²P°₁/₂) = 16973,366 − 16956,170 = 17,196 cm⁻¹ |
| spin | s = ½, mₛ = ±½; spin bukan putaran harfiah | — | Modul 7 §2 |
| spin | Stern–Gerlach: berkas atom perak terbelah dua | 1922 | Gerlach & Stern, Z. Phys. 9, 349 |
| pauli | Ψ antisimetrik, (a₁b₂ − b₁a₂)/√2, nol bila a = b | — | Modul 7 (7.2–7.3) |
| singlet | S = 0 (1 keadaan), S = 1 (3 keadaan); αβ saja = campuran | — | Modul 7 §2 |
| symbol | ²ˢ⁺¹L_J; S P D F G H I = 0…6; ³F₄: S=1, L=3, J=4, g=9; ¹S₁/₂ tidak sah | — | Modul 7 §3 |
| coupling | J = \|L−S\| … L+S; ³P → J = 0,1,2; 1+3+5 = 9 = 3×3 | (7.6), (7.7) | Modul 7 §4 |
| hund | C 2p²: S=1, L=1, J=0 → ³P₀ | — | Modul 7 Contoh 3; NIST |
| micro | p²: C(6,2) = 15 = 9 (³P) + 5 (¹D) + 1 (¹S) | tabel ML×MS | Modul 7 §6 |
| patterns | d¹…d¹⁰ & p¹…p⁶ term dasar; d⁵ ⁶S₅/₂; d²/d⁸ ³F, p¹/p⁵ ²P | — | Modul 7 §7 |
| period4 | K ²S₁/₂ · Ca ¹S₀ · Sc ²D₃/₂ · Ti ³F₂ · V ⁴F₃/₂ · Cr ⁷S₃ · Mn ⁶S₅/₂ · Fe ⁵D₄ · Co ⁴F₉/₂ · Ni ³F₄ · Cu ²S₁/₂ · Zn ¹S₀ · Ga ²P°₁/₂ · Ge ³P₀ · As ⁴S°₃/₂ · Se ³P₂ · Br ²P°₃/₂ · Kr ¹S₀ | — | Modul 7 §8; NIST |
| chromium | Cr 3d⁵4s¹ → S = 3, ⁷S₃; Mn ⁶S₅/₂; Fe ⁵D₄; Fe³⁺ 3d⁵ ⁶S₅/₂ = Mn²⁺ | — | Modul 7 Contoh 4–5 |
| fine | E_J = E_LS + (A/2)[J(J+1) − L(L+1) − S(S+1)]; ³P: −2A, −A, +A; interval Landé E_J − E_{J−1} = AJ | (7.9) | Modul 7 §9 |
| parity | π = (−1)^Σl; s,d genap, p,f ganjil; dipol ganjil → paritas berubah | (7.10–7.11) | Modul 7 §10 |
| rules | E1: paritas berubah; ΔS = 0; ΔL, ΔJ = 0, ±1 (0↔0 dilarang); Δl = ±1; tanpa syarat Δn | — | Modul 7 §11 |
| check | ²P°₃/₂ → ²S₁/₂ ✓, → ²D₅/₂ ✓, → ²P°₁/₂ ✗ (paritas) | — | Modul 7 Contoh 7, §12 |
| hydrogen | 1s→2p 10,2 eV ≈ 121,6 nm (Lyman α); 3d→2p 1,889 eV ≈ 656 nm (Hα); 2s→1s E1 dilarang | Modul 7 Contoh 8 | NIST ASD |
| hydrogen | Umur 2s ≈ 0,12 dtk (dua foton); 2p ≈ 1,6 ns | 0,122 s; 1,596 ns | NIST; Bethe & Salpeter |
| mercury | Garis Hg 253,65 nm ≈ 254 nm, 6s6p ³P₁ → 6s² ¹S₀ (interkombinasi), garis utama lampu Hg tekanan rendah / TL; layar menulis pencampuran ³P°₁ + ε ¹P°₁ (J sama = 1, spin–orbit hanya mencampur tingkat ber-J sama) | ✓ 2 Nov 2026 | NIST ASD Hg I: 253,6521 nm, 6s² ¹S₀ – 6s6p ³P°₁, A = 8,4×10⁶ s⁻¹; Atkins |
| glow | Fluoresensi S₁→S₀ ≈ ns; fosforesensi T₁→S₀ terlarang spin, ms–dtk | — | Turro; Atkins |
| manganese | Mn²⁺ d⁵ ⁶S: tak ada keadaan sextet lain → d–d terlarang spin & Laporte → merah muda sangat pucat | kualitatif (tanpa angka ε) | Housecroft & Sharpe; Atkins Inorganic |
| laser | Nd³⁺ 4f³: S = 3/2, L = 6 (I), J = 9/2 → ⁴I₉/₂; laser ⁴F₃/₂ → ⁴I₁₁/₂ 1064 nm; f–f terlarang paritas → umur panjang (≈ 230 µs) | — | Koechner; NIST |
| laser | Fraunhofer menamai garis D (1814) | — | sejarah spektroskopi |

Paritas: "°" dipakai untuk Na ²P° dan Hg ³P°₁ (konvensi NIST); term Nd³⁺ 4f³ (ganjil) ditulis tanpa "°" mengikuti konvensi literatur laser.

Catatan gaya: "≈" untuk perkiraan, "±" hanya plus-minus. Kopling LS disebut sebagai pendekatan (atom ringan).
