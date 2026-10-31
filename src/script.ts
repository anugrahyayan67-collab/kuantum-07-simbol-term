// Naskah narasi "Kode Rahasia Atom" — Kimia Kuantum Modul 7: Simbol Term & Aturan Seleksi.
// Setiap adegan berisi baris narasi. Durasi baris dihitung otomatis dari jumlah
// suku kata (lihat timeline.ts) atau dari rekaman suara bila sudah ada,
// jadi cukup ubah teks di sini: visual, subtitle, dan musik ikut menyesuaikan.
//
// Aturan menulis teks narasi (dibaca mesin TTS):
//  - angka & simbol ditulis sebagai kata ("dua puluh meter per detik"),
//  - rumus ditulis sebagai kalimat; rumus rapi tampil di layar (komponen Formula).
// Angka & term sudah dicek di naskah/AUDIT.md (NIST Atomic Spectroscopy, Modul 7).
//
// hl     : kata/frasa yang disorot pada subtitle
// pause  : jeda (detik) SETELAH baris dibacakan
// lead   : jeda (detik) sebelum baris pertama adegan
// tail   : jeda (detik) setelah baris terakhir adegan
// fixed  : durasi tetap (detik) untuk adegan tanpa narasi

export type Line = {
  text: string;
  /** Teks khusus TTS (opsional). Bila kosong, dibuat otomatis oleh src/tts.ts. */
  tts?: string;
  hl?: string[];
  pause?: number;
};

export type SceneScript = {
  id: string;
  chapter: string; // nomor bab di heading, "" untuk tanpa heading
  part?: 1 | 2 | 3; // 1 prinsip & teori dasar, 2 implementasi dalam kimia, 3 penerapan
  title: string;
  lines: Line[];
  lead?: number;
  tail?: number;
  fixed?: number;
  mood: 'mystery' | 'title' | 'wonder' | 'build' | 'quantum' | 'tension' | 'bright' | 'resolve' | 'outro';
};

export const SCRIPT: SceneScript[] = [
  {
    "id": "hook",
    "chapter": "",
    "title": "Dua garis kuning",
    "mood": "mystery",
    "lead": 1.6,
    "tail": 1.2,
    "lines": [
      {
        "text": "Malam hari, lampu jalan natrium memancarkan cahaya kuning yang khas.",
        "hl": [
          "kuning"
        ],
        "pause": 0.9
      },
      {
        "text": "Lewatkan cahayanya ke spektroskop yang sangat teliti, dan kuning itu ternyata bukan satu garis, melainkan dua.",
        "hl": [
          "dua"
        ],
        "pause": 1.0
      },
      {
        "text": "Lima ratus delapan puluh sembilan koma nol, dan lima ratus delapan puluh sembilan koma enam nanometer.",
        "pause": 0.9,
        "tts": "Lima ratus delapan puluh sembilan koma nol, dan lima ratus delapan puluh sembilan koma enam nanometer."
      },
      {
        "text": "Natrium hanya punya satu elektron terluar. Mengapa satu elektron memberi dua garis?",
        "hl": [
          "satu elektron",
          "dua garis"
        ],
        "pause": 1.0
      },
      {
        "text": "Jawabannya tersimpan dalam sebuah kode pendek yang menempel pada setiap keadaan atom.",
        "hl": [
          "kode pendek"
        ],
        "pause": 0.9
      },
      {
        "text": "Kode itu disebut simbol term. Hari ini kita belajar membacanya, menyusunnya, dan memakainya untuk meramal cahaya.",
        "hl": [
          "simbol term"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "title",
    "chapter": "",
    "title": "Kode Rahasia Atom",
    "mood": "title",
    "fixed": 7,
    "lines": []
  },
  {
    "id": "roadmap",
    "chapter": "",
    "title": "Peta video",
    "mood": "wonder",
    "lead": 0.8,
    "tail": 1.4,
    "lines": [
      {
        "text": "Perjalanan kita punya tiga bagian.",
        "pause": 0.6
      },
      {
        "text": "Pertama, prinsip dasar: spin, larangan Pauli, dan cara momentum sudut elektron dijumlahkan.",
        "hl": [
          "prinsip dasar"
        ],
        "pause": 0.7
      },
      {
        "text": "Kedua, implementasi dalam kimia: term dasar unsur periode empat, struktur halus, dan aturan seleksi.",
        "hl": [
          "implementasi dalam kimia"
        ],
        "pause": 0.7
      },
      {
        "text": "Ketiga, penerapan: dari lampu, cahaya berpendar, warna ion logam, sampai laser.",
        "hl": [
          "penerapan"
        ],
        "pause": 0.7
      },
      {
        "text": "Di akhir bagian dua, kita kembali ke dua garis kuning natrium dan memecahkan misterinya.",
        "hl": [
          "dua garis kuning"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "spin",
    "chapter": "01",
    "title": "Spin elektron",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Mulai dari satu elektron. Selain bergerak di orbital, elektron membawa momentum sudut bawaan yang disebut spin.",
        "hl": [
          "spin"
        ],
        "pause": 0.7
      },
      {
        "text": "Bilangan kuantum spinnya s sama dengan setengah, dan proyeksinya hanya dua: plus setengah atau minus setengah.",
        "hl": [
          "setengah"
        ],
        "pause": 0.7,
        "tts": "Bilangan kuantum spinnya, es, sama dengan setengah, dan proyeksinya hanya dua: plus setengah atau minus setengah."
      },
      {
        "text": "Kita menyebutnya spin naik dan spin turun, alfa dan beta.",
        "hl": [
          "alfa",
          "beta"
        ],
        "pause": 0.7
      },
      {
        "text": "Tapi jangan bayangkan bola kecil yang benar-benar berputar. Spin adalah sifat kuantum murni, tanpa padanan klasik yang tepat.",
        "hl": [
          "sifat kuantum murni"
        ],
        "pause": 0.7
      },
      {
        "text": "Buktinya: berkas atom perak yang melewati medan magnet tak homogen terbelah menjadi tepat dua berkas.",
        "hl": [
          "tepat dua berkas"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "pauli",
    "chapter": "02",
    "title": "Larangan Pauli",
    "mood": "tension",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Elektron-elektron identik. Mereka tidak bisa diberi label atau dibedakan satu sama lain.",
        "hl": [
          "identik"
        ],
        "pause": 0.7
      },
      {
        "text": "Akibatnya, fungsi gelombang total harus berganti tanda bila dua elektron ditukar.",
        "hl": [
          "berganti tanda"
        ],
        "pause": 0.7
      },
      {
        "text": "Untuk dua spin-orbital a dan b, fungsi yang memenuhi syarat ini adalah a-satu kali b-dua, dikurangi b-satu kali a-dua, dibagi akar dua.",
        "pause": 0.9,
        "tts": "Untuk dua spin-orbital a dan be, fungsi yang memenuhi syarat ini adalah a satu kali be dua, dikurangi be satu kali a dua, dibagi akar dua."
      },
      {
        "text": "Sekarang taruh kedua elektron di spin-orbital yang sama. Kedua suku identik, saling menghapus, dan fungsi gelombangnya nol.",
        "hl": [
          "nol"
        ],
        "pause": 0.9
      },
      {
        "text": "Itulah larangan Pauli: dua elektron tidak boleh menempati spin-orbital yang sama.",
        "hl": [
          "larangan Pauli"
        ],
        "pause": 0.7
      },
      {
        "text": "Satu orbital ruang boleh berisi dua elektron, asalkan spinnya berlawanan.",
        "hl": [
          "spinnya berlawanan"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "singlet",
    "chapter": "03",
    "title": "Singlet dan triplet",
    "mood": "quantum",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Bagaimana dua spin setengah bergabung? Hanya ada dua kemungkinan: S total nol atau satu.",
        "hl": [
          "nol atau satu"
        ],
        "pause": 0.7,
        "tts": "Bagaimana dua spin setengah bergabung? Hanya ada dua kemungkinan: es total nol atau satu."
      },
      {
        "text": "S nol punya satu keadaan, disebut singlet. S satu punya tiga keadaan, disebut triplet.",
        "hl": [
          "singlet",
          "triplet"
        ],
        "pause": 0.7,
        "tts": "Es nol punya satu keadaan, disebut singlet. Es satu punya tiga keadaan, disebut triplet."
      },
      {
        "text": "Tiga keadaan triplet: keduanya naik, keduanya turun, dan satu kombinasi naik-turun bertanda plus.",
        "hl": [
          "bertanda plus"
        ],
        "pause": 0.7
      },
      {
        "text": "Singlet adalah kombinasi naik-turun bertanda minus.",
        "hl": [
          "bertanda minus"
        ],
        "pause": 0.7
      },
      {
        "text": "Jadi hati-hati: dua spin berlawanan belum tentu singlet. Naik-turun saja adalah campuran singlet dan triplet.",
        "hl": [
          "belum tentu singlet"
        ],
        "pause": 0.9
      },
      {
        "text": "Angka satu dan tiga inilah yang nanti muncul sebagai multiplisitas di pojok kiri atas simbol term.",
        "hl": [
          "multiplisitas"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "symbol",
    "chapter": "04",
    "title": "Membaca simbol term",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Inilah bentuk simbol term: dua S tambah satu di kiri atas, huruf L di tengah, dan J di kanan bawah.",
        "hl": [
          "simbol term"
        ],
        "pause": 0.7,
        "tts": "Inilah bentuk simbol term: dua es tambah satu di kiri atas, huruf el di tengah, dan je di kanan bawah."
      },
      {
        "text": "Angka kiri atas adalah multiplisitas: satu singlet, dua doublet, tiga triplet, empat quartet.",
        "hl": [
          "multiplisitas"
        ],
        "pause": 0.7,
        "tts": "Angka kiri atas adalah multiplisitas: satu singlet, dua doublet, tiga triplet, empat kuartet."
      },
      {
        "text": "Huruf di tengah menyatakan L, momentum sudut orbital total: S untuk nol, P satu, D dua, F tiga, lalu G, H, I.",
        "hl": [
          "momentum sudut orbital total"
        ],
        "pause": 0.7,
        "tts": "Huruf di tengah menyatakan el, momentum sudut orbital total: es untuk nol, pe satu, de dua, ef tiga, lalu ge, ha, i."
      },
      {
        "text": "Angka kanan bawah adalah J, momentum sudut total hasil gabungan L dan S.",
        "hl": [
          "momentum sudut total"
        ],
        "pause": 0.7,
        "tts": "Angka kanan bawah adalah je, momentum sudut total hasil gabungan el dan es."
      },
      {
        "text": "Contoh: triplet F empat. Tiga berarti S satu, F berarti L tiga, dan J empat.",
        "hl": [
          "triplet F empat"
        ],
        "pause": 0.7,
        "tts": "Contoh: triplet ef empat. Tiga berarti es satu, ef berarti el tiga, dan je empat."
      },
      {
        "text": "Tingkat ini punya dua J tambah satu, yaitu sembilan keadaan yang berenergi sama tanpa medan luar.",
        "hl": [
          "sembilan keadaan"
        ],
        "pause": 0.7,
        "tts": "Tingkat ini punya dua je tambah satu, yaitu sembilan keadaan yang berenergi sama tanpa medan luar."
      },
      {
        "text": "Awas jebakan: angka dua pada doublet P bukan bilangan kuantum utama, dan huruf S besar bukan orbital s.",
        "hl": [
          "Awas jebakan"
        ],
        "pause": 0.9,
        "tts": "Awas jebakan: angka dua pada doublet pe bukan bilangan kuantum utama, dan huruf es besar bukan orbital es."
      }
    ]
  },
  {
    "id": "coupling",
    "chapter": "05",
    "title": "Kopling LS",
    "mood": "quantum",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Pada atom ringan, kita memakai kopling Russell–Saunders, atau kopling LS.",
        "hl": [
          "kopling LS"
        ],
        "pause": 0.7,
        "tts": "Pada atom ringan, kita memakai kopling Rasel Sanders, atau kopling el es."
      },
      {
        "text": "Momentum orbital semua elektron dijumlahkan menjadi L, spinnya menjadi S, lalu keduanya digabung menjadi J.",
        "hl": [
          "digabung menjadi J"
        ],
        "pause": 0.7,
        "tts": "Momentum orbital semua elektron dijumlahkan menjadi el, spinnya menjadi es, lalu keduanya digabung menjadi je."
      },
      {
        "text": "Karena ini penjumlahan vektor, J tidak tunggal: nilainya berjenjang dari selisih L dan S sampai jumlahnya.",
        "hl": [
          "berjenjang"
        ],
        "pause": 0.7,
        "tts": "Karena ini penjumlahan vektor, je tidak tunggal: nilainya berjenjang dari selisih el dan es sampai jumlahnya."
      },
      {
        "text": "Untuk triplet P, L satu dan S satu, sehingga J bisa nol, satu, atau dua.",
        "hl": [
          "nol, satu, atau dua"
        ],
        "pause": 0.7,
        "tts": "Untuk triplet pe, el satu dan es satu, sehingga je bisa nol, satu, atau dua."
      },
      {
        "text": "Cek hitungannya: satu tambah tiga tambah lima sama dengan sembilan, sama dengan tiga kali tiga.",
        "hl": [
          "sembilan"
        ],
        "pause": 0.7
      },
      {
        "text": "Jumlah keadaan tidak hilang. Keadaan hanya dikelompokkan ulang menurut J.",
        "hl": [
          "dikelompokkan ulang"
        ],
        "pause": 0.9,
        "tts": "Jumlah keadaan tidak hilang. Keadaan hanya dikelompokkan ulang menurut je."
      }
    ]
  },
  {
    "id": "hund",
    "chapter": "06",
    "title": "Aturan Hund",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Satu konfigurasi bisa menghasilkan beberapa term. Mana yang energinya paling rendah? Di sinilah aturan Hund bekerja.",
        "hl": [
          "aturan Hund"
        ],
        "pause": 0.7,
        "tts": "Satu konfigurasi bisa menghasilkan beberapa term. Mana yang energinya paling rendah? Di sinilah aturan Hun bekerja."
      },
      {
        "text": "Pertama, abaikan subkulit penuh, karena spin dan momentum orbitalnya selalu nol.",
        "hl": [
          "abaikan subkulit penuh"
        ],
        "pause": 0.7
      },
      {
        "text": "Kedua, buat spin total sebesar mungkin: isi orbital berbeda dengan spin sejajar sebelum berpasangan.",
        "hl": [
          "spin total sebesar mungkin"
        ],
        "pause": 0.7
      },
      {
        "text": "Ketiga, untuk spin maksimum itu, pilih L terbesar.",
        "hl": [
          "L terbesar"
        ],
        "pause": 0.7,
        "tts": "Ketiga, untuk spin maksimum itu, pilih el terbesar."
      },
      {
        "text": "Keempat, tentukan J: kurang dari setengah penuh ambil selisihnya, lebih dari setengah penuh ambil jumlahnya.",
        "hl": [
          "setengah penuh"
        ],
        "pause": 0.7,
        "tts": "Keempat, tentukan je: kurang dari setengah penuh ambil selisihnya, lebih dari setengah penuh ambil jumlahnya."
      },
      {
        "text": "Coba pada karbon, dua p dua. Dua elektron di m-l satu dan nol, keduanya spin naik.",
        "hl": [
          "karbon"
        ],
        "pause": 0.7,
        "tts": "Coba pada karbon, dua pe dua. Dua elektron di em el satu dan nol, keduanya spin naik."
      },
      {
        "text": "S satu, L satu, kurang dari setengah penuh, maka J nol. Term dasar karbon: triplet P nol.",
        "hl": [
          "triplet P nol"
        ],
        "pause": 0.9,
        "tts": "Es satu, el satu, kurang dari setengah penuh, maka je nol. Term dasar karbon: triplet pe nol."
      }
    ]
  },
  {
    "id": "micro",
    "chapter": "07",
    "title": "Bukti mikrostatus",
    "mood": "quantum",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Mengapa karbon hanya punya triplet P, singlet D, dan singlet S? Kita buktikan dengan menghitung.",
        "hl": [
          "menghitung"
        ],
        "pause": 0.7,
        "tts": "Mengapa karbon hanya punya triplet pe, singlet de, dan singlet es? Kita buktikan dengan menghitung."
      },
      {
        "text": "Subkulit p punya enam spin-orbital. Memilih dua dari enam memberi lima belas susunan, disebut mikrostatus.",
        "hl": [
          "lima belas",
          "mikrostatus"
        ],
        "pause": 0.7,
        "tts": "Subkulit pe punya enam spin-orbital. Memilih dua dari enam memberi lima belas susunan, disebut mikrostatus."
      },
      {
        "text": "Kelompokkan kelima belas mikrostatus itu menurut M-L dan M-S dalam sebuah tabel.",
        "hl": [
          "tabel"
        ],
        "pause": 0.7,
        "tts": "Kelompokkan kelima belas mikrostatus itu menurut em el dan em es dalam sebuah tabel."
      },
      {
        "text": "Ambil M-S terbesar, lalu M-L terbesar di baris itu: triplet P, yang mengambil sembilan kotak.",
        "hl": [
          "sembilan kotak"
        ],
        "pause": 0.7,
        "tts": "Ambil em es terbesar, lalu em el terbesar di baris itu: triplet pe, yang mengambil sembilan kotak."
      },
      {
        "text": "Sisanya punya M-L dua, jadi singlet D dengan lima kotak. Tinggal satu kotak: singlet S.",
        "hl": [
          "lima kotak",
          "singlet S"
        ],
        "pause": 0.7,
        "tts": "Sisanya punya em el dua, jadi singlet de dengan lima kotak. Tinggal satu kotak: singlet es."
      },
      {
        "text": "Sembilan tambah lima tambah satu, lima belas. Semua mikrostatus terbagi habis.",
        "hl": [
          "terbagi habis"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "patterns",
    "chapter": "08",
    "title": "Pola p dan d",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Dengan cara yang sama, kita dapat tabel term dasar untuk semua pengisian p dan d.",
        "hl": [
          "tabel term dasar"
        ],
        "pause": 0.7,
        "tts": "Dengan cara yang sama, kita dapat tabel term dasar untuk semua pengisian pe dan de."
      },
      {
        "text": "Dari d satu sampai d lima, spin terus naik, hingga d lima memberi sextet S: setengah penuh, L nol.",
        "hl": [
          "sextet S"
        ],
        "pause": 0.7,
        "tts": "Dari de satu sampai de lima, spin terus naik, hingga de lima memberi sekstet es: setengah penuh, el nol."
      },
      {
        "text": "Setelah setengah penuh, elektron mulai berpasangan dan spin total turun lagi.",
        "hl": [
          "berpasangan"
        ],
        "pause": 0.7
      },
      {
        "text": "Lihat pola cerminnya: d dua dan d delapan sama-sama triplet F, p satu dan p lima sama-sama doublet P.",
        "hl": [
          "pola cerminnya"
        ],
        "pause": 0.7,
        "tts": "Lihat pola cerminnya: de dua dan de delapan sama-sama triplet ef, pe satu dan pe lima sama-sama doublet pe."
      },
      {
        "text": "Ini hubungan elektron dan lubang. Termnya sama, tapi urutan J terbalik, jadi J tetap harus dihitung.",
        "hl": [
          "elektron dan lubang"
        ],
        "pause": 0.9,
        "tts": "Ini hubungan elektron dan lubang. Termnya sama, tapi urutan je terbalik, jadi je tetap harus dihitung."
      }
    ]
  },
  {
    "id": "period4",
    "chapter": "09",
    "title": "Term dasar periode 4",
    "mood": "bright",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Sekarang terapkan pada atom nyata: unsur periode empat, dari kalium sampai kripton.",
        "hl": [
          "periode empat"
        ],
        "pause": 0.7
      },
      {
        "text": "Kalium, satu elektron empat s: doublet S setengah. Kalsium, semua berpasangan: singlet S nol.",
        "hl": [
          "doublet S setengah",
          "singlet S nol"
        ],
        "pause": 0.7,
        "tts": "Kalium, satu elektron empat es: doublet es setengah. Kalsium, semua berpasangan: singlet es nol."
      },
      {
        "text": "Masuk logam transisi, multiplisitas naik: skandium doublet D, titanium triplet F, vanadium quartet F.",
        "hl": [
          "multiplisitas naik"
        ],
        "pause": 0.7,
        "tts": "Masuk logam transisi, multiplisitas naik: skandium doublet de, titanium triplet ef, vanadium kuartet ef."
      },
      {
        "text": "Puncaknya di kromium dan mangan, dengan elektron tak berpasangan paling banyak.",
        "hl": [
          "kromium dan mangan"
        ],
        "pause": 0.7
      },
      {
        "text": "Lalu turun lagi: besi quintet D empat, kobalt quartet F, nikel triplet F empat.",
        "hl": [
          "turun lagi"
        ],
        "pause": 0.7,
        "tts": "Lalu turun lagi: besi kuintet de empat, kobalt kuartet ef, nikel triplet ef empat."
      },
      {
        "text": "Tembaga dan seng kembali sederhana, lalu blok p mengulang pola p satu sampai p enam, hingga kripton singlet S nol.",
        "hl": [
          "blok p"
        ],
        "pause": 0.9,
        "tts": "Tembaga dan seng kembali sederhana, lalu blok pe mengulang pola pe satu sampai pe enam, hingga kripton singlet es nol."
      }
    ]
  },
  {
    "id": "chromium",
    "chapter": "10",
    "title": "Kasus kromium dan besi",
    "mood": "tension",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Kromium sering menjebak. Konfigurasinya tiga d lima empat s satu, bukan tiga d empat empat s dua.",
        "hl": [
          "menjebak"
        ],
        "pause": 0.7,
        "tts": "Kromium sering menjebak. Konfigurasinya tiga de lima empat es satu, bukan tiga de empat empat es dua."
      },
      {
        "text": "Lima elektron d sejajar memberi S lima per dua, dan elektron empat s ikut sejajar.",
        "hl": [
          "ikut sejajar"
        ],
        "pause": 0.7,
        "tts": "Lima elektron de sejajar memberi es lima per dua, dan elektron empat es ikut sejajar."
      },
      {
        "text": "Spin totalnya tiga, multiplisitas tujuh, J tiga: septet S tiga.",
        "hl": [
          "septet S tiga"
        ],
        "pause": 0.7,
        "tts": "Spin totalnya tiga, multiplisitas tujuh, je tiga: septet es tiga."
      },
      {
        "text": "Sextet S lima per dua justru milik mangan netral, yang subkulit empat s-nya sudah penuh.",
        "hl": [
          "mangan netral"
        ],
        "pause": 0.7,
        "tts": "Sekstet es lima per dua justru milik mangan netral, yang subkulit empat es-nya sudah penuh."
      },
      {
        "text": "Ion juga bisa. Besi netral quintet D empat. Besi tiga plus melepas dua elektron empat s dan satu elektron tiga d.",
        "hl": [
          "Besi tiga plus"
        ],
        "pause": 0.7,
        "tts": "Ion juga bisa. Besi netral kuintet de empat. Besi tiga plus melepas dua elektron empat es dan satu elektron tiga de."
      },
      {
        "text": "Tersisa tiga d lima, semuanya sejajar: sextet S lima per dua, sama seperti mangan dua plus.",
        "hl": [
          "sama seperti mangan dua plus"
        ],
        "pause": 0.9,
        "tts": "Tersisa tiga de lima, semuanya sejajar: sekstet es lima per dua, sama seperti mangan dua plus."
      }
    ]
  },
  {
    "id": "fine",
    "chapter": "11",
    "title": "Struktur halus",
    "mood": "wonder",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Mengapa satu term terpecah menjadi beberapa tingkat J?",
        "hl": [
          "terpecah"
        ],
        "pause": 0.7,
        "tts": "Mengapa satu term terpecah menjadi beberapa tingkat je?"
      },
      {
        "text": "Penyebabnya interaksi spin–orbit: magnet kecil spin merasakan medan magnet dari gerak orbital elektron.",
        "hl": [
          "spin–orbit"
        ],
        "pause": 0.7,
        "tts": "Penyebabnya interaksi spin orbit: magnet kecil spin merasakan medan magnet dari gerak orbital elektron."
      },
      {
        "text": "Energinya bergeser sebanding dengan J kali J tambah satu, dikurangi L kali L tambah satu, dikurangi S kali S tambah satu.",
        "pause": 0.9,
        "tts": "Energinya bergeser sebanding dengan je kali je tambah satu, dikurangi el kali el tambah satu, dikurangi es kali es tambah satu."
      },
      {
        "text": "Untuk triplet P, pergeserannya minus dua A, minus A, dan plus A. Jaraknya satu banding dua: aturan interval Landé.",
        "hl": [
          "aturan interval Landé"
        ],
        "pause": 0.7,
        "tts": "Untuk triplet pe, pergeserannya minus dua a, minus a, dan plus a. Jaraknya satu banding dua: aturan interval Lande."
      },
      {
        "text": "Kembali ke natrium. Elektron terluarnya bisa naik ke tiga p, dengan term doublet P.",
        "hl": [
          "natrium"
        ],
        "pause": 0.7,
        "tts": "Kembali ke natrium. Elektron terluarnya bisa naik ke tiga pe, dengan term doublet pe."
      },
      {
        "text": "Spin–orbit memecahnya menjadi doublet P tiga per dua dan doublet P setengah, berselisih sangat tipis.",
        "hl": [
          "berselisih sangat tipis"
        ],
        "pause": 0.7,
        "tts": "Spin orbit memecahnya menjadi doublet pe tiga per dua dan doublet pe setengah, berselisih sangat tipis."
      },
      {
        "text": "Keduanya turun ke doublet S setengah dan memancarkan dua garis: lima delapan sembilan koma nol dan lima delapan sembilan koma enam nanometer. Misteri terpecahkan.",
        "hl": [
          "Misteri terpecahkan"
        ],
        "pause": 1.0,
        "tts": "Keduanya turun ke doublet es setengah dan memancarkan dua garis: lima ratus delapan puluh sembilan koma nol dan lima ratus delapan puluh sembilan koma enam nanometer. Misteri terpecahkan."
      }
    ]
  },
  {
    "id": "parity",
    "chapter": "12",
    "title": "Paritas",
    "mood": "quantum",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Tidak semua lompatan elektron diizinkan. Kuncinya adalah simetri yang disebut paritas.",
        "hl": [
          "paritas"
        ],
        "pause": 0.7
      },
      {
        "text": "Paritas bertanya: bila semua koordinat dibalik melalui pusat atom, apakah fungsi gelombang tetap, atau berganti tanda?",
        "hl": [
          "berganti tanda"
        ],
        "pause": 0.7
      },
      {
        "text": "Orbital s dan d berparitas genap, p dan f ganjil. Paritas konfigurasi adalah minus satu pangkat jumlah l.",
        "hl": [
          "genap",
          "ganjil"
        ],
        "pause": 0.7,
        "tts": "Orbital es dan de berparitas genap, pe dan ef ganjil. Paritas konfigurasi adalah minus satu pangkat jumlah el kecil."
      },
      {
        "text": "Cahaya berinteraksi dengan atom lewat operator dipol, dan operator dipol berparitas ganjil.",
        "hl": [
          "operator dipol"
        ],
        "pause": 0.7
      },
      {
        "text": "Agar integral transisi tidak nol, keadaan awal dan akhir harus berparitas berlawanan.",
        "hl": [
          "berparitas berlawanan"
        ],
        "pause": 0.7
      },
      {
        "text": "Jadi transisi dipol listrik selalu mengubah paritas: genap ke ganjil, atau ganjil ke genap.",
        "hl": [
          "mengubah paritas"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "rules",
    "chapter": "13",
    "title": "Aturan seleksi E1",
    "mood": "build",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Inilah daftar aturan seleksi dipol listrik, atau E1, yang dipakai di UTS.",
        "hl": [
          "aturan seleksi"
        ],
        "pause": 0.7,
        "tts": "Inilah daftar aturan seleksi dipol listrik, atau e satu, yang dipakai di u te es."
      },
      {
        "text": "Satu: paritas harus berubah.",
        "hl": [
          "paritas harus berubah"
        ],
        "pause": 0.7
      },
      {
        "text": "Dua: spin total tidak berubah, delta S sama dengan nol, karena operator dipol tidak menyentuh spin.",
        "hl": [
          "delta S sama dengan nol"
        ],
        "pause": 0.7,
        "tts": "Dua: spin total tidak berubah, delta es sama dengan nol, karena operator dipol tidak menyentuh spin."
      },
      {
        "text": "Tiga: delta L boleh nol atau plus minus satu, tapi L nol ke L nol dilarang. Aturan yang sama berlaku untuk J.",
        "hl": [
          "L nol ke L nol dilarang"
        ],
        "pause": 0.7,
        "tts": "Tiga: delta el boleh nol atau plus minus satu, tapi el nol ke el nol dilarang. Aturan yang sama berlaku untuk je."
      },
      {
        "text": "Empat: bila hanya satu elektron yang berpindah, delta l kecil harus plus minus satu.",
        "hl": [
          "plus minus satu"
        ],
        "pause": 0.7,
        "tts": "Empat: bila hanya satu elektron yang berpindah, delta el kecil harus plus minus satu."
      },
      {
        "text": "Dan tidak ada syarat umum untuk n: elektron boleh melompat ke kulit mana pun, asal energi fotonnya cocok.",
        "hl": [
          "tidak ada syarat umum"
        ],
        "pause": 0.7,
        "tts": "Dan tidak ada syarat umum untuk en: elektron boleh melompat ke kulit mana pun, asal energi fotonnya cocok."
      },
      {
        "text": "Ingat, diizinkan bukan berarti pasti kuat. Kekuatan garis masih bergantung pada integral transisi dan populasi.",
        "hl": [
          "bukan berarti pasti kuat"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "check",
    "chapter": "14",
    "title": "Memeriksa simbol & transisi",
    "mood": "tension",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Sebelum memakai aturan seleksi, periksa dulu apakah simbolnya sah.",
        "hl": [
          "sah"
        ],
        "pause": 0.7
      },
      {
        "text": "Singlet S setengah? Tidak sah. S nol dan L nol hanya memberi J nol.",
        "hl": [
          "Tidak sah"
        ],
        "pause": 0.7,
        "tts": "Singlet es setengah? Tidak sah. Es nol dan el nol hanya memberi je nol."
      },
      {
        "text": "Triplet P setengah? Juga tidak sah. L satu dan S satu hanya memberi J bulat: nol, satu, dua.",
        "hl": [
          "J bulat"
        ],
        "pause": 0.7,
        "tts": "Triplet pe setengah? Juga tidak sah. El satu dan es satu hanya memberi je bulat: nol, satu, dua."
      },
      {
        "text": "Sekarang mulai dari doublet P tiga per dua yang ganjil. Ke doublet S setengah yang genap: semua lolos, diizinkan.",
        "hl": [
          "diizinkan"
        ],
        "pause": 0.7,
        "tts": "Sekarang mulai dari doublet pe tiga per dua yang ganjil. Ke doublet es setengah yang genap: semua lolos, diizinkan."
      },
      {
        "text": "Ke doublet D lima per dua yang genap: juga lolos.",
        "hl": [
          "juga lolos"
        ],
        "pause": 0.7,
        "tts": "Ke doublet de lima per dua yang genap: juga lolos."
      },
      {
        "text": "Tapi ke doublet P setengah yang ganjil: L, S, dan J lolos, namun paritas tidak berubah. Dilarang.",
        "hl": [
          "Dilarang"
        ],
        "pause": 0.7,
        "tts": "Tapi ke doublet pe setengah yang ganjil: el, es, dan je lolos, namun paritas tidak berubah. Dilarang."
      },
      {
        "text": "Urutannya: sahkan simbol, cek momentum sudut, cek paritas, lalu cek energi.",
        "hl": [
          "sahkan simbol"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "hydrogen",
    "chapter": "15",
    "title": "Kembali ke hidrogen",
    "mood": "bright",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Aturan yang sama menjelaskan spektrum hidrogen yang sudah kita kenal.",
        "hl": [
          "hidrogen"
        ],
        "pause": 0.7
      },
      {
        "text": "Satu s ke dua p menyerap sepuluh koma dua elektronvolt, sekitar seratus dua puluh satu nanometer: garis Lyman alfa.",
        "hl": [
          "Lyman alfa"
        ],
        "pause": 0.7,
        "tts": "Satu es ke dua pe menyerap sepuluh koma dua elektronvolt, sekitar seratus dua puluh satu nanometer: garis Laiman alfa."
      },
      {
        "text": "Tiga d ke dua p memancarkan satu koma delapan sembilan elektronvolt, sekitar enam ratus lima puluh enam nanometer: garis merah H alfa.",
        "hl": [
          "H alfa"
        ],
        "pause": 0.7,
        "tts": "Tiga de ke dua pe memancarkan satu koma delapan sembilan elektronvolt, sekitar enam ratus lima puluh enam nanometer: garis merah ha alfa."
      },
      {
        "text": "Keduanya punya delta l plus minus satu. Sedangkan dua s ke satu s, delta l nol, dilarang untuk dipol listrik.",
        "hl": [
          "dilarang"
        ],
        "pause": 0.7,
        "tts": "Keduanya punya delta el plus minus satu. Sedangkan dua es ke satu es, delta el nol, dilarang untuk dipol listrik."
      },
      {
        "text": "Itulah sebabnya keadaan dua s bertahan sekitar sepersepuluh detik, sedangkan dua p hanya sekitar satu koma enam nanodetik.",
        "hl": [
          "bertahan"
        ],
        "pause": 0.9,
        "tts": "Itulah sebabnya keadaan dua es bertahan sekitar sepersepuluh detik, sedangkan dua pe hanya sekitar satu koma enam nanodetik."
      }
    ]
  },
  {
    "id": "mercury",
    "chapter": "16",
    "title": "Lampu merkuri",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Aturan delta S nol paling tegas pada atom ringan. Pada atom berat, aturan ini mulai melonggar.",
        "hl": [
          "melonggar"
        ],
        "pause": 0.7,
        "tts": "Aturan delta es nol paling tegas pada atom ringan. Pada atom berat, aturan ini mulai melonggar."
      },
      {
        "text": "Contohnya merkuri. Garis terkuat lampu merkuri tekanan rendah, dua ratus lima puluh empat nanometer, berasal dari triplet P satu ke singlet S nol.",
        "hl": [
          "dua ratus lima puluh empat nanometer"
        ],
        "pause": 0.7,
        "tts": "Contohnya merkuri. Garis terkuat lampu merkuri tekanan rendah, dua ratus lima puluh empat nanometer, berasal dari triplet pe satu ke singlet es nol."
      },
      {
        "text": "Dalam kopling LS murni, transisi ini dilarang, karena spinnya berubah.",
        "hl": [
          "dilarang"
        ],
        "pause": 0.7,
        "tts": "Dalam kopling el es murni, transisi ini dilarang, karena spinnya berubah."
      },
      {
        "text": "Tetapi pada atom seberat merkuri, interaksi spin–orbit kuat, sehingga keadaan triplet tercampur sedikit singlet.",
        "hl": [
          "tercampur"
        ],
        "pause": 0.7,
        "tts": "Tetapi pada atom seberat merkuri, interaksi spin orbit kuat, sehingga keadaan triplet tercampur sedikit singlet."
      },
      {
        "text": "Hasilnya garis interkombinasi yang terang. Ultraviolet inilah yang diubah lapisan fosfor menjadi cahaya putih lampu TL.",
        "hl": [
          "garis interkombinasi"
        ],
        "pause": 0.9,
        "tts": "Hasilnya garis interkombinasi yang terang. Ultraviolet inilah yang diubah lapisan fosfor menjadi cahaya putih lampu te el."
      }
    ]
  },
  {
    "id": "glow",
    "chapter": "17",
    "title": "Fluoresensi & fosforesensi",
    "mood": "quantum",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Aturan spin juga membedakan dua cara molekul memancarkan kembali cahaya: fluoresensi dan fosforesensi.",
        "hl": [
          "fluoresensi",
          "fosforesensi"
        ],
        "pause": 0.7
      },
      {
        "text": "Fluoresensi: singlet tereksitasi kembali ke singlet dasar. Spin tidak berubah, cahaya keluar dalam hitungan nanodetik.",
        "hl": [
          "nanodetik"
        ],
        "pause": 0.7
      },
      {
        "text": "Tetapi sebagian molekul menyeberang ke keadaan triplet.",
        "hl": [
          "triplet"
        ],
        "pause": 0.7
      },
      {
        "text": "Kembali dari triplet ke singlet dilarang spin, jadi pancarannya lambat, dari milidetik sampai detik: fosforesensi.",
        "hl": [
          "dilarang spin"
        ],
        "pause": 0.7
      },
      {
        "text": "Ini keadaan molekul, bukan atom, tetapi aturan spinnya sama. Orbital molekul menunggu kita setelah UTS.",
        "hl": [
          "setelah UTS"
        ],
        "pause": 0.9,
        "tts": "Ini keadaan molekul, bukan atom, tetapi aturan spinnya sama. Orbital molekul menunggu kita setelah u te es."
      }
    ]
  },
  {
    "id": "manganese",
    "chapter": "18",
    "title": "Warna pucat mangan",
    "mood": "bright",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Larutan ion logam transisi biasanya berwarna. Tetapi larutan mangan dua plus hanya merah muda yang sangat pucat.",
        "hl": [
          "sangat pucat"
        ],
        "pause": 0.7
      },
      {
        "text": "Mangan dua plus adalah d lima, dengan term dasar sextet S: lima spin sejajar.",
        "hl": [
          "sextet S"
        ],
        "pause": 0.7,
        "tts": "Mangan dua plus adalah de lima, dengan term dasar sekstet es: lima spin sejajar."
      },
      {
        "text": "Untuk menyerap cahaya, satu elektron d harus berpindah orbital, dan itu memaksa satu spin berbalik.",
        "hl": [
          "satu spin berbalik"
        ],
        "pause": 0.7,
        "tts": "Untuk menyerap cahaya, satu elektron de harus berpindah orbital, dan itu memaksa satu spin berbalik."
      },
      {
        "text": "Tidak ada keadaan tereksitasi lain dengan lima spin sejajar. Semua serapan d ke d terlarang spin, sekaligus terlarang paritas.",
        "hl": [
          "terlarang spin"
        ],
        "pause": 0.7,
        "tts": "Tidak ada keadaan tereksitasi lain dengan lima spin sejajar. Semua serapan de ke de terlarang spin, sekaligus terlarang paritas."
      },
      {
        "text": "Serapannya jauh lebih lemah daripada ion logam transisi lain, sehingga warnanya nyaris hilang.",
        "hl": [
          "nyaris hilang"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "laser",
    "chapter": "19",
    "title": "Laser dan bintang",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Simbol term juga dipakai merancang laser. Laser Nd:YAG memakai ion neodimium tiga plus, empat f tiga.",
        "hl": [
          "laser"
        ],
        "pause": 0.7,
        "tts": "Simbol term juga dipakai merancang laser. Laser en de yag memakai ion neodimium tiga plus, empat ef tiga."
      },
      {
        "text": "Dengan aturan Hund: tiga spin sejajar, S tiga per dua. L terbesar enam, huruf I. Kurang dari setengah penuh, J sembilan per dua.",
        "hl": [
          "aturan Hund"
        ],
        "pause": 0.7,
        "tts": "Dengan aturan Hun: tiga spin sejajar, es tiga per dua. El terbesar enam, huruf i. Kurang dari setengah penuh, je sembilan per dua."
      },
      {
        "text": "Laser bekerja dari quartet F tiga per dua ke quartet I sebelas per dua, memancarkan inframerah seribu enam puluh empat nanometer.",
        "hl": [
          "seribu enam puluh empat nanometer"
        ],
        "pause": 0.7,
        "tts": "Laser bekerja dari kuartet ef tiga per dua ke kuartet i sebelas per dua, memancarkan inframerah seribu enam puluh empat nanometer."
      },
      {
        "text": "Transisi f ke f terlarang paritas, jadi keadaan atasnya bertahan lama, cocok untuk menimbun energi laser.",
        "hl": [
          "bertahan lama"
        ],
        "pause": 0.7,
        "tts": "Transisi ef ke ef terlarang paritas, jadi keadaan atasnya bertahan lama, cocok untuk menimbun energi laser."
      },
      {
        "text": "Di langit, Fraunhofer melihat garis gelap pada spektrum Matahari dan menamai pasangan kuning itu garis D.",
        "hl": [
          "garis D"
        ],
        "pause": 0.7,
        "tts": "Di langit, Fraunhofer melihat garis gelap pada spektrum Matahari dan menamai pasangan kuning itu garis de."
      },
      {
        "text": "Itulah garis natrium yang sama, kini sebagai serapan. Dari lampu jalan sampai bintang, kode pendek yang sama memberi tahu atom apa yang ada di sana.",
        "hl": [
          "kode pendek yang sama"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "recap",
    "chapter": "20",
    "title": "Merangkai semuanya",
    "mood": "resolve",
    "lead": 1.0,
    "tail": 2.4,
    "lines": [
      {
        "text": "Mari rangkum.",
        "pause": 0.6
      },
      {
        "text": "Spin setengah dan larangan Pauli membatasi cara elektron mengisi orbital.",
        "hl": [
          "larangan Pauli"
        ],
        "pause": 0.7
      },
      {
        "text": "Simbol term merangkum spin total, momentum orbital total, dan momentum sudut total dalam satu kode.",
        "hl": [
          "satu kode"
        ],
        "pause": 0.7
      },
      {
        "text": "Aturan Hund memilih term dasar: spin maksimum, L maksimum, lalu J sesuai pengisian.",
        "hl": [
          "term dasar"
        ],
        "pause": 0.7,
        "tts": "Aturan Hun memilih term dasar: spin maksimum, el maksimum, lalu je sesuai pengisian."
      },
      {
        "text": "Spin–orbit memecah term menjadi struktur halus, seperti dua garis kuning natrium.",
        "hl": [
          "struktur halus"
        ],
        "pause": 0.7,
        "tts": "Spin orbit memecah term menjadi struktur halus, seperti dua garis kuning natrium."
      },
      {
        "text": "Dan aturan seleksi menentukan lompatan yang diizinkan: paritas berubah, delta S nol, delta L dan delta J nol atau plus minus satu.",
        "hl": [
          "aturan seleksi"
        ],
        "pause": 0.7,
        "tts": "Dan aturan seleksi menentukan lompatan yang diizinkan: paritas berubah, delta es nol, delta el dan delta je nol atau plus minus satu."
      },
      {
        "text": "Setelah UTS, kita bawa ide-ide ini dari atom ke molekul: ikatan valensi dan orbital molekul.",
        "hl": [
          "dari atom ke molekul"
        ],
        "pause": 1.0,
        "tts": "Setelah u te es, kita bawa ide-ide ini dari atom ke molekul: ikatan valensi dan orbital molekul."
      }
    ]
  },
  {
    "id": "outro",
    "chapter": "",
    "title": "Penutup",
    "mood": "outro",
    "fixed": 15,
    "lines": []
  }
];
