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
      return { match: true, baselineCreated: true, difference: 0 };
    }

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

    const diff = new PNG({
      width: baseline.width,
      height: baseline.height,
    });

    const differentPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      baseline.width,
      baseline.height,
      { threshold: 0.1 }
    );

    const totalPixels = baseline.width * baseline.height;
    const difference = differentPixels / totalPixels;
    const percentage = (difference * 100).toFixed(2);

    if (differentPixels > 0) {
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      console.log(`Diff screenshot disimpan: ${diffPath}`);
    } else if (fs.existsSync(diffPath)) {
      fs.unlinkSync(diffPath);
    }

    console.log(`${filename}: ${percentage}% perbedaan visual`);

    return {
      match: difference <= this.threshold,
      baselineCreated: false,
      difference,
      percentage,
      differentPixels,
    };
  }
}

module.exports = VisualRegressionHelper;