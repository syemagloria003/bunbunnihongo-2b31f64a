# Tema Dunia Katakana — Reskin Penuh

## Masalah
Setiap level Katakana sekarang cuma berbeda gradient `bg` + `ground`. Sisanya (background bukit hijau + bunga pink, awan, rumput, koin madu, sarang lebah, laba‑laba/lalat) di-render dengan fungsi yang sama persis seperti dunia Hiragana. `engine.ts` juga melakukan `parseInt("k1") → NaN → 1`, jadi `drawSky` malah pakai cabang Hiragana.

## Pendekatan
Tambahkan satu konsep tunggal: **`theme`** per level. Setiap modul render bercabang berdasarkan tema, bukan berdasarkan `levelNum`. Semua dunia Hiragana memakai tema `"garden"` (perilaku saat ini, tidak berubah). 7 dunia Katakana mendapat tema masing‑masing.

```text
Tema Katakana:
  k1 crystal_cave   — gua biru, stalaktit, kristal berkilau, kelelawar gelap
  k2 starry_sea     — laut malam, bulan, bintang, gelombang, ubur-ubur silau
  k3 nebula_sky     — pulau melayang, awan ungu, galaksi, lalat bercahaya
  k4 snow_field     — bukit salju, pinus, salju turun, rubah putih
  k5 silver_ruins   — pilar metal patah, kabut, awan kelabu, robot kecil
  k6 comet_nest     — langit api, komet melintas, batu magma, imp api
  k7 cosmic_void    — kosmos hitam, spiral galaksi, void wisp (boss arena)
```

Skema warna setiap tema sudah implisit dari gradient `bg` yang ada — palette tinggal diturunkan dari sana.

## Yang Dibongkar

### 1. `src/game/levels.ts`
- Tambah field `theme: WorldTheme` di `LevelDef`.
- Semua entri `LEVELS` (Hiragana) → `theme: "garden"`.
- `KATAKANA_LEVELS` → tema sesuai tabel di atas.
- Export type `WorldTheme = "garden" | "crystal_cave" | "starry_sea" | "nebula_sky" | "snow_field" | "silver_ruins" | "comet_nest" | "cosmic_void"`.

### 2. `src/game/background.ts` — bercabang per tema
Setiap fungsi (`drawSky`, `drawFar`, `drawMid`, `drawClouds`, `drawForeground`) menerima `theme: WorldTheme` (bukan `level: number`).
- `drawSky`: gradient & sumber cahaya berbeda — matahari (garden), bulan (sea/void), kristal pendar (cave), aurora (nebula), matahari pucat (snow), kabut (ruins), letupan komet (comet).
- `drawFar`: bukit hijau (garden) · siluet stalaktit terbalik (cave) · garis ombak + pulau jauh (sea) · pulau melayang (nebula) · bukit salju + pinus jauh (snow) · pilar runtuh (ruins) · gunung magma (comet) · spiral galaksi (void).
- `drawMid`: bunga (garden) · kristal berkilau di lantai gua (cave) · ubur‑ubur melayang (sea) · gumpalan nebula (nebula) · pohon pinus salju (snow) · kolom + roda gigi raksasa (ruins) · ember & lava bubble (comet) · planet/cincin (void).
- `drawClouds`: awan biasa (garden/snow) · kabut tipis (cave/ruins) · gelombang awan ungu (nebula) · asap komet horizontal (comet) · debu bintang (sea/void).
- `drawForeground`: rumput (garden) · serpihan kristal di tepi (cave) · gelembung air (sea) · awan tipis depan (nebula) · serpihan salju jatuh (snow) · debu logam (ruins) · ember melayang (comet) · partikel bintang (void).

### 3. `src/game/render.ts` — bercabang per tema
Sebagian besar fungsi `draw*` dapat parameter `theme`. Hero `drawBee` (Buzu) **tidak berubah** — dia maskot lintas dunia.
- `drawGround`: rumput+tanah (garden) · batu+kristal kecil (cave) · pasir basah+karang (sea) · awan padat (nebula) · salju+es (snow) · ubin metal (ruins) · batu magma+retakan pijar (comet) · void+stardust (void).
- `drawPlatform`: honeycomb (garden) · serpihan kristal (cave) · papan kayu apung (sea) · awan padat (nebula) · balok es (snow) · pelat metal (ruins) · batu lava (comet) · cakram bintang (void).
- `drawHoney` (koin): madu (garden) · kristal (cave) · bintang (sea) · gumpalan nebula (nebula) · kepingan salju (snow) · roda gigi (ruins) · ember api (comet) · galaksi mini (void). Warna burst particle ikut.
- `drawGate` (gerbang kana): bingkai sesuai tema (kayu+madu / kristal / koral / cincin nebula / es / metal / batu pijar / cincin bintang).
- `drawHive` (goal): sarang lebah (garden) · portal kristal (cave) · mercusuar (sea) · gerbang awan (nebula) · iglo (snow) · monolit (ruins) · portal komet (comet) · singgasana bintang (void) — bendera kecil tetap melambai.
- `drawSpider` & `drawFly`: reskin warna + sedikit aksen bentuk per tema (kelelawar gelap dengan mata merah untuk cave, ubur‑ubur untuk sea, dst). Mekanik & hitbox identik.

### 4. `src/game/particles.ts`
`burst()` dapat opsional `palette: string[]` agar warna percikan cocok per tema. `confetti()` di akhir level pakai palette tema.

### 5. `src/game/engine.ts`
- Hapus `levelNum`; ganti dengan `this.theme = level.theme`.
- Teruskan `this.theme` ke semua call `drawSky/drawFar/drawMid/drawClouds/drawForeground/drawGround/drawPlatform/drawHive/drawHoney/drawGate/drawSpider/drawFly`.
- Saat coin diambil & saat menang, pilih palette particle dari tabel tema.

### 6. Modal kana (`KanaGateModal.tsx`) — opsional ringan
Tidak diubah. Visual gerbang sudah ditangani oleh `drawGate` di canvas; modal tetap kartu putih netral biar fokus baca huruf.

## Di luar scope
- Tidak menambah mekanik baru (es licin, kristal pecah, gravitasi berbeda).
- Tidak menambah pola pergerakan musuh baru — cuma reskin visual.
- Buzu si lebah tetap sama bentuknya di semua dunia.
- Hiragana 7 dunia tidak diubah tampilannya (tema `garden` = perilaku saat ini).

## Hasil yang diharapkan
Begitu masuk Gua Kristal: langit gelap kebiruan, stalaktit menggantung, lantai berbatu+kristal kecil, koin jadi kristal pendar, sarang lebah jadi portal kristal, "laba‑laba" jadi kelelawar gelap. Setiap dunia berikutnya terasa naik tingkat suasana — bukan sekadar warna langit berbeda.
