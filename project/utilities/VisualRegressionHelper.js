
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const pixelmatchModule = require("pixelmatch");
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

class VisualRegressionHelper {
  constructor() {
    const rootDir = path.resolve(__dirname, "..");

    this.baselineDir = path.join(rootDir, "screenshots", "baseline");
    this.currentDir = path.join(rootDir, "screenshots", "current");
    this.diffDir = path.join(rootDir, "screenshots", "diff");

    fs.mkdirSync(this.baselineDir, { recursive: true });
    fs.mkdirSync(this.currentDir, { recursive: true });
    fs.mkdirSync(this.diffDir, { recursive: true });

    // Toleransi perbedaan maksimal 1%
    this.threshold = 0.01;
  }

  compareImages(filename) {
    const baselinePath = path.join(this.baselineDir, filename);
    const currentPath = path.join(this.currentDir, filename);

    const diffPath = path.join(
      this.diffDir,
      filename.replace(/\.png$/i, "-diff.png")
    );

    if (!fs.existsSync(currentPath)) {
      throw new Error(`Screenshot terbaru tidak ditemukan: ${currentPath}`);
    }

    // Buat baseline jika belum tersedia.
    if (!fs.existsSync(baselinePath)) {
      fs.copyFileSync(currentPath, baselinePath);

      console.log(`Baseline dibuat: ${filename}`);
      console.log("Perbandingan akan dilakukan pada testing berikutnya.");

      return {
        match: true,
        baselineCreated: true,
        difference: 0,
        percentage: "0.00",
      };
    }

    // Baca gambar baseline dan current.
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));

    if (
      baseline.width !== current.width ||
      baseline.height !== current.height
    ) {
      throw new Error(
        `Ukuran screenshot berbeda untuk ${filename}. ` +
        `Baseline: ${baseline.width}x${baseline.height}, ` +
        `Current: ${current.width}x${current.height}`
      );
    }

    // Siapkan gambar diff.
    const diff = new PNG({
      width: baseline.width,
      height: baseline.height,
    });

    // Bandingkan setiap pixel.
    const differentPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      baseline.width,
      baseline.height,
      {
        threshold: 0.1,
        diffColor: [255, 0, 0],
        alpha: 0.7,
      }
    );

    // Hitung persentase perbedaan.
    const totalPixels = baseline.width * baseline.height;
    const difference = differentPixels / totalPixels;
    const percentage = (difference * 100).toFixed(2);

    // Simpan diff SETIAP kali perbandingan dilakukan.
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    console.log("-------------------------------------");
    console.log(`Screenshot       : ${filename}`);
    console.log(`Different Pixels : ${differentPixels}`);
    console.log(`Visual Difference: ${percentage}%`);
    console.log(`Diff Saved       : ${diffPath}`);

    const match = difference <= this.threshold;

    console.log(
      match
        ? "STATUS: VISUAL TEST PASSED"
        : "STATUS: VISUAL TEST FAILED"
    );

    console.log("-------------------------------------");

    return {
      match,
      baselineCreated: false,
      difference,
      percentage,
      differentPixels,
    };
  }
}

module.exports = VisualRegressionHelper;
