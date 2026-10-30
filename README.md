Hasilnya
<img width="1366" height="768" alt="Screenshot (318)" src="https://github.com/user-attachments/assets/bcd28a70-5042-41fb-842c-bf833959fe74" />


# Pertemuan 11 – Web UI Automation Testing

## Deskripsi
Project ini merupakan tugas bootcamp Digital Skola untuk melakukan Web UI Automation Testing pada halaman login SauceDemo menggunakan Selenium WebDriver, Mocha, dan Page Object Model (POM). Project ini juga menerapkan Visual Regression Testing untuk membandingkan screenshot hasil pengujian.

## Tools & Technologies
- JavaScript
- Node.js
- Selenium WebDriver
- Mocha
- Pixelmatch
- PNGJS
- Visual Studio Code (VS Code)
- SauceDemo

## Struktur Folder
```text
project/
├── screenshots/
│   ├── baseline/
│   ├── current/
│   └── diff/
├── tests/
│   ├── locator/
│   │   └── LoginPage.locator.js
│   ├── page/
│   │   ├── LoginPage.js
│   │   └── ScreenshotPage.js
│   └── specs/
│       └── Login.spec.js
├── utilities/
│   └── VisualRegressionHelper.js
├── package.json
├── package-lock.json
└── README.md
```

## Test Scenarios

### 1. Positive Test – Standard User
- Membuka halaman login SauceDemo.
- Login menggunakan akun `standard_user`.
- Memvalidasi bahwa login berhasil.

### 2. Negative Test – Locked Out User
- Membuka halaman login SauceDemo.
- Login menggunakan akun `locked_out_user`.
- Memvalidasi bahwa sistem menolak login dan menampilkan pesan error yang sesuai.

## Visual Regression Testing
Pengujian visual dilakukan dengan mengambil screenshot halaman dan membandingkannya menggunakan Pixelmatch. Hasil screenshot disimpan pada folder `screenshots/current/`, sedangkan folder `screenshots/baseline/` digunakan untuk gambar acuan dan `screenshots/diff/` untuk hasil perbandingan visual jika tersedia.

## Cara Menjalankan Project

### 1. Clone Repository
```bash
git clone <URL_REPOSITORY_GITHUB>
```

### 2. Masuk ke Folder Project
```bash
cd Tugas-Pertemuan11/project
```

### 3. Install Dependencies
```bash
npm ci
```

### 4. Jalankan Automation Test
```bash
npm test
```

## Test Result
Pengujian mencakup dua skenario login, yaitu positive test menggunakan `standard_user` dan negative test menggunakan `locked_out_user`. Hasil pengujian terakhir menunjukkan **2 passing tests**.

## Website Under Test
https://www.saucedemo.com/
