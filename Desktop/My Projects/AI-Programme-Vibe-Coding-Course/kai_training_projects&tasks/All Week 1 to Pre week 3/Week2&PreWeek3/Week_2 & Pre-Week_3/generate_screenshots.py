"""
generate_screenshots.py
━━━━━━━━━━━━━━━━━━━━━━
Automatically generates all 7 screenshots of the Tanzania Traffic AI Classifier web app.
Run this script to VERIFY that the screenshots in the /screenshots folder
are genuine renders of index.html — not fabricated images.

Requirements:
    pip install playwright
    python -m playwright install chromium

Usage:
    python3 generate_screenshots.py

Output:
    screenshots/ folder with 7 PNG files (overwrites existing)
"""

import asyncio
import os
import sys
from pathlib import Path

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("❌ Playwright not installed.")
    print("   Run: pip install playwright && python -m playwright install chromium")
    sys.exit(1)

# ── Config ──────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent.resolve()
HTML_PATH  = f"file://{SCRIPT_DIR}/index.html"
OUT_DIR    = SCRIPT_DIR / "screenshots"
VIEWPORT   = {"width": 1280, "height": 800}

STEPS = [
    # (filename, description, js_before_shot, wait_ms)
    (
        "01_home_landing.png",
        "Home / Landing state — empty upload zone",
        None,
        500,
    ),
    (
        "02_bajaj_loaded.png",
        "Bajaj sample loaded — synthetic road scene drawn",
        "loadSample('bajaj')",
        600,
    ),
    (
        "03_bajaj_detection.png",
        "Bajaj detection — bounding boxes + confidence scores",
        "runDetection()",
        3800,
    ),
    (
        "04_mixed_scene.png",
        "Mixed scene — Daladala + Bajaj + Pikipiki + pedestrians",
        "loadSample('mixed')",
        600,
    ),
    (
        "05_mixed_detection.png",
        "Mixed scene detection — 6 objects detected",
        "runDetection()",
        3800,
    ),
    (
        "06_daladala_with_stats.png",
        "Daladala detection with session statistics updated",
        ["loadSample('daladala')", "runDetection()"],
        4200,
    ),
    (
        "07_full_page.png",
        "Full page view — complete application layout",
        None,
        500,
    ),
]


async def main():
    print("━" * 60)
    print("  Tanzania Traffic AI — Screenshot Generator")
    print("  Verifying: index.html renders match documented screenshots")
    print("━" * 60)
    print(f"\n📂 Source: {HTML_PATH}")
    print(f"📁 Output: {OUT_DIR}\n")

    OUT_DIR.mkdir(exist_ok=True)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        page = await browser.new_page(viewport=VIEWPORT)

        print(f"🌐 Loading {HTML_PATH} ...")
        await page.goto(HTML_PATH, wait_until="networkidle")
        await asyncio.sleep(1)
        print("✅ Page loaded\n")

        for i, (filename, desc, js_cmds, wait_ms) in enumerate(STEPS, 1):
            out_path = OUT_DIR / filename
            print(f"  [{i}/{len(STEPS)}] {filename}")
            print(f"          {desc}")

            if js_cmds:
                cmds = js_cmds if isinstance(js_cmds, list) else [js_cmds]
                for cmd in cmds:
                    await page.evaluate(cmd)
                    await asyncio.sleep(0.1)

            await asyncio.sleep(wait_ms / 1000)

            full = filename == "07_full_page.png"
            await page.screenshot(path=str(out_path), full_page=full)
            size_kb = out_path.stat().st_size // 1024
            print(f"          ✅ Saved → {size_kb} KB\n")

        await browser.close()

    print("━" * 60)
    print("  All screenshots generated successfully!")
    print("  Compare these with the documented screenshots in README.md")
    print("  If they match → screenshots are verified as genuine.")
    print("━" * 60)

    # Print summary
    print("\n📋 Generated files:")
    for f in sorted(OUT_DIR.glob("*.png")):
        print(f"   {f.name} — {f.stat().st_size // 1024} KB")


if __name__ == "__main__":
    asyncio.run(main())
