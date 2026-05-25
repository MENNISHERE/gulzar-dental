import fs from "fs";
import path from "path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const srcDir = process.cwd();
const publicDir = path.join(srcDir, "public");

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sourceFile = path.join(
  srcDir,
  "file_00000000e988722f8a542eda2234d7c0.png",
);
const destFile = path.join(publicDir, "favicon.ico");

async function generateFavicon() {
  if (fs.existsSync(sourceFile)) {
    try {
      // 1. Read the original file
      const content = fs.readFileSync(sourceFile, "utf8");

      // 2. Extract SVG content
      const svgMatch = content.match(/<svg[\s\S]*?<\/svg>/);
      if (!svgMatch) {
        throw new Error("Could not find SVG inside the file");
      }

      const svgContent = svgMatch[0];
      const tempSvg = path.join(srcDir, "temp.svg");
      const tempPng = path.join(srcDir, "temp.png");

      fs.writeFileSync(tempSvg, svgContent);

      // 3. Convert SVG to cleaner 48x48 PNG using sharp
      await sharp(tempSvg).resize(48, 48).png().toFile(tempPng);

      // 4. Convert the clean PNG to ICO
      const buf = await pngToIco(tempPng);
      fs.writeFileSync(destFile, buf);

      // Cleanup temp files
      fs.unlinkSync(tempSvg);
      fs.unlinkSync(tempPng);

      console.log("Successfully generated valid 48x48 favicon.ico");
    } catch (err) {
      console.error("Error generating favicon:", err);
    }
  } else {
    console.error("Source logo file not found:", sourceFile);
  }
}

generateFavicon();
