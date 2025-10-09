const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const buildDir = path.join(__dirname, "build");
const resourcesDir = path.join(__dirname, "src/scripts");
const distDir = path.join(buildDir, "scripts");
const tmpDir = path.join(distDir, "tmp_build");

const pythonScripts = ["auto_clicker.py", "listen_hotkey.py"];

const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";
const isLinux = process.platform === "linux";

const pythonCmd = isWindows ? "python" : "python3";

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

pythonScripts.forEach(script => {
  const scriptPath = path.join(resourcesDir, script);

  console.log(`\n[Build] Compiling ${script} with Nuitka...`);

  try {
    execSync(`${pythonCmd} -m nuitka --onefile --output-dir="${tmpDir}" "${scriptPath}"`, { stdio: "inherit" });

    const binName = script.replace(".py", isWindows ? ".exe" : ".bin");
    const binPath = path.join(tmpDir, binName);

    fs.renameSync(binPath, path.join(distDir, binName));
    console.log(`[Build] ${binName} moved to build/scripts/`);
  } catch (err) {
    console.error(`[Error] Failed to compile ${script}:`, err.message);
  }
});

// fs.rmSync(tmpDir, { recursive: true, force: true });
console.log("\n[Build] Cleanup complete. Build finished!");
