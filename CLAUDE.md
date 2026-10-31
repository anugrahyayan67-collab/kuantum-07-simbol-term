# Konteks repo (untuk asisten AI)

- Video **"Kode Rahasia Atom" — Kimia Kuantum Modul 7: Simbol Term & Aturan Seleksi** (S1 Kimia UNESA, RPS pertemuan 7) milik **Yayan** (Septian Anugrah). Mesin disalin dari `video-landasan-kimia-kuantum` (Modul 2), ditambah perbaikan seri fisika (subtitle silang-pudar, `EASE` lembut, `cyc`, `tts.ts`, `qa-lines`/`qa-film`/`qa-glitch`). Aturan umum & pelajaran teknis: repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md`.
- Gaya seri kuantum Yayan: panggung gelap, aksen **emas–sian**, font Outfit + Source Serif 4 + JetBrains Mono, subtitle kata-per-kata. Tanpa nama di video (aturan video kuantum).
- Benang merah cerita: **dua garis kuning natrium** (589,0 & 589,6 nm) — misteri di pembuka, dipecahkan di adegan `fine` (struktur halus ²P₃/₂ / ²P₁/₂ → ²S₁/₂), muncul lagi sebagai garis D Fraunhofer di `laser`.
- **Kode warna**: spin naik/α = sian `C.cyan`, spin turun/β = merah muda `C.pink`, multiplisitas/S = ungu `C.violet`, L = emas `C.gold`, J = mint `C.mint`, paritas genap = biru `C.blue`, ganjil = jingga `C.amber`, dilarang = merah `C.red`; foton memakai warna panjang gelombangnya (`wlColor`).
- **Semua adegan harus terus bergerak** (elektron di kotak orbital, vektor L/S berpresesi, tabel mikrostatus yang terkelupas, garis spektrum menyala).
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah merge ke `main`, minta pengguna menekan *Run workflow*.
- Narasi menyusul. Selalu sediakan versi tanpa narasi.

## Aturan konten & tata letak
- Rumus/simbol term utama ≥ 56 px (`Formula`), satu kartu per momen; zona subtitle (bawah 180 px) bebas; margin ≥ 80 px. Komponen HTML di luar `<Stage>`.
- Simbol term ditulis dengan superskrip/subskrip benar (`Sup`/`Sub` di HTML, `tspan baselineShift` di SVG); penanda paritas ganjil "°". Angka & term dicek di `naskah/AUDIT.md`.
- Teks TTS terpisah dari subtitle (`tts:` per baris; huruf tunggal dieja di `src/tts.ts`).
- Kemulusan: `EASE` lembut, fade keluar `EASE_IN_OUT`; tanpa ganti berdasarkan ambang (silang-pudar); tanpa CSS blur; tanpa filter pada garis lurus.

## QA
- `CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell node scripts/qa-lines.mjs out/x <adegan...>` lalu `python3 scripts/contact.py out/x out/x-s 9`.
- `npm run check` (cek kata `wordOf`), uji kemulusan `node scripts/qa-film.mjs out/a.mp4 0 99999 0.25` lalu `python3 scripts/qa-glitch.py out/a.mp4 0`.
