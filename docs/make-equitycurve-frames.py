"""Render EquityCurve demo frames (1920x1080) to PNG slides for the Meteora DBC side-track video."""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
OUT = os.path.join(os.path.dirname(__file__), "frames")
os.makedirs(OUT, exist_ok=True)

BG = (13, 16, 26)
CARD = (24, 30, 48)
MINT = (52, 211, 153)
CYAN = (56, 189, 248)
PURPLE = (167, 139, 250)
YELLOW = (251, 191, 36)
RED = (251, 113, 133)
WHITE = (241, 245, 249)
GREY = (148, 163, 184)

FONTS = {
    "mono": r"C:\Windows\Fonts\consola.ttf",
    "mono_b": r"C:\Windows\Fonts\consolab.ttf",
    "sans": r"C:\Windows\Fonts\segoeui.ttf",
    "sans_b": r"C:\Windows\Fonts\segoeuib.ttf",
    "sans_l": r"C:\Windows\Fonts\segoeuisl.ttf",
}


def font(kind, size):
    p = FONTS.get(kind, "")
    if p and os.path.exists(p):
        return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def bg(d):
    d.rectangle([0, 0, W, H], fill=BG)


def bar(d):
    d.rectangle([0, 0, W, 10], fill=PURPLE)


def scene(d, label, idx, total=7):
    d.text((64, 56), label, font=font("mono_b", 26), fill=CYAN)
    d.text((W - 64 - 130, 56), f"{idx}/{total}", font=font("mono", 26), fill=GREY)


def card(d, x, y, w, h, fill=CARD):
    d.rounded_rectangle([x, y, x + w, y + h], radius=18, fill=fill, outline=(50, 62, 92), width=2)


def title(d):
    bar(d)
    d.text((W // 2, 280), "EQUITYCURVE", font=font("sans_b", 104), fill=WHITE, anchor="mm")
    d.text((W // 2, 390), "Pyth-anchored tokenized-stock launches on Meteora DBC", font=font("sans_l", 42), fill=PURPLE, anchor="mm")
    d.text((W // 2, 475), "oracle-fair launch price  \u00b7  mainnet only  \u00b7  no mocks", font=font("mono", 30), fill=GREY, anchor="mm")
    d.rounded_rectangle([W // 2 - 320, 540, W // 2 + 320, 616], radius=38, outline=MINT, width=3)
    d.text((W // 2, 578), "github.com/sidsri14/equitycurve", font=font("mono", 28), fill=WHITE, anchor="mm")
    d.text((W // 2, 700), "CWF \u00b7 Meteora DBC Side-Track \u00b7 $20K Pool", font=font("sans_b", 30), fill=GREY, anchor="mm")


def problem(d):
    scene(d, "THE GAP", 1)
    d.text((W // 2, 170), "Tokenized stocks are booming \u2014 launches are still guesswork.", font=font("sans_b", 44), fill=WHITE, anchor="mm")
    card(d, 160, 260, 800, 300)
    d.text((200, 315), "today's launch price", font=font("mono_b", 28), fill=GREY)
    d.text((200, 375), "set by team choice / momentum", font=font("mono", 26), fill=WHITE)
    d.text((200, 435), "not by the asset's real fair value", font=font("mono", 26), fill=RED)
    d.text((200, 495), "thin, new, and volatile after listing", font=font("mono", 22), fill=GREY)
    card(d, 960, 260, 800, 300)
    d.text((1000, 315), "what launch should be", font=font("mono_b", 28), fill=MINT)
    d.text((1000, 375), "oracle-anchored to the true price", font=font("mono", 26), fill=WHITE)
    d.text((1000, 435), "curve priced off live reference data", font=font("mono", 26), fill=WHITE)
    d.text((1000, 495), "premium/discount visible to everyone", font=font("mono", 22), fill=GREY)
    d.text((W // 2, 700), "RWA on Solana: tokenized stocks $2M \u2192 $487M in 9 months (2026)", font=font("sans", 32), fill=YELLOW, anchor="mm")
    d.text((W // 2, 830), "real assets need real price anchors \u2014 that's EquityCurve", font=font("sans", 30), fill=GREY, anchor="mm")


def curve(d):
    scene(d, "THE MECHANISM \u00b7 METeora DBC", 2)
    d.text((W // 2, 170), "One honest number sets the whole curve.", font=font("sans_b", 48), fill=WHITE, anchor="mm")
    card(d, 120, 250, 830, 360)
    d.text((160, 305), "CURVE STUDIO", font=font("mono_b", 28), fill=CYAN)
    d.text((160, 365), "anchor: live Pyth reference/fair-value price", font=font("mono", 24), fill=WHITE)
    d.text((160, 425), "generate via buildCurveWithCustomSqrtPrices", font=font("mono", 24), fill=WHITE)
    d.text((160, 485), "ConfigParameters: start price, curve shape", font=font("mono", 24), fill=WHITE)
    d.text((160, 545), "fee & config tuned for equity-like assets", font=font("mono", 24), fill=GREY)
    card(d, 980, 250, 820, 360)
    d.text((1020, 305), "STOCK-LAUNCH FLOW", font=font("mono_b", 28), fill=MINT)
    d.text((1020, 365), "1. oracle fair value \u2192 launch price", font=font("mono", 24), fill=WHITE)
    d.text((1020, 425), "2. DBC raises on the virtual curve", font=font("mono", 24), fill=WHITE)
    d.text((1020, 485), "3. graduation \u2192 DAMM v2 liquidity", font=font("mono", 24), fill=WHITE)
    d.text((1020, 545), "4. migrate with real pool + price intact", font=font("mono", 24), fill=GREY)
    d.rounded_rectangle([W // 2 - 420, 680, W // 2 + 420, 765], radius=34, outline=MINT, width=3)
    d.text((W // 2, 722), "official @meteora-ag/dynamic-bonding-curve-sdk", font=font("mono_b", 28), fill=MINT, anchor="mm")
    d.text((W // 2, 870), "the launch raiser and the DEX are the same contract", font=font("sans", 30), fill=GREY, anchor="mm")


def monitor(d):
    scene(d, "LIVE \u00b7 FAIR-VALUE MONITOR", 3)
    d.text((W // 2, 170), "Reading real mainnet DBC pools right now.", font=font("sans_b", 48), fill=WHITE, anchor="mm")
    d.text((W // 2, 250), "program dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN \u00b7 no testnet, no mocks", font=font("mono", 24), fill=GREY, anchor="mm")
    rows = [
        ("ASTROCOW / USDC", "spot \u00b7 live sqrt read", "Pyth ref \u00b7 live", "premium/ discount \u00b7 live", MINT),
        ("scade / SOL", "spot \u00b7 live sqrt read", "Pyth ref \u00b7 live", "premium/ discount \u00b7 live", MINT),
    ]
    card(d, 180, 320, 1560, 300)
    y = 380
    for name, s1, s2, s3, col in rows:
        d.text((260, y), name, font=font("mono_b", 30), fill=WHITE)
        d.text((860, y), s1, font=font("mono", 28), fill=CYAN)
        d.text((1200, y), s2, font=font("mono", 28), fill=GREY)
        d.text((1560, y), s3, font=font("mono_b", 28), fill=col, anchor="ra")
        y += 110
    card(d, 180, 660, 1560, 170)
    d.text((260, 720), "derived from on-chain sqrt price \u00b7 converted to USD via on-chain SOL/USD push feed", font=font("mono", 26), fill=WHITE)
    d.text((260, 770), "premium/discount vs Pyth reference \u00b7 migration progress tracked per pool", font=font("mono", 26), fill=WHITE)
    d.text((W // 2, 900), "spot vs oracle \u2014 live, every block", font=font("sans", 30), fill=MINT, anchor="mm")


def pyth(d):
    scene(d, "LIVE \u00b7 ON-CHAIN PYTH", 4)
    d.text((W // 2, 170), "46 push feeds decoded from raw account bytes.", font=font("sans_b", 46), fill=WHITE, anchor="mm")
    card(d, 180, 280, 1560, 300)
    rows = [
        ("SOL / USD", "", "sponsored shard-0 push feed", "price 159.42", CYAN),
        ("USDC / USD", "", "sponsored shard-0 push feed", "price 0.99998", CYAN),
        ("USDT / USD", "", "sponsored shard-0 push feed", "price 1.00002", CYAN),
    ]
    y = 340
    for a, _, b, c, col in rows:
        d.text((260, y), a, font=font("mono_b", 28), fill=WHITE)
        d.text((760, y), b, font=font("mono", 25), fill=GREY)
        d.text((1560, y), c, font=font("mono_b", 28), fill=col, anchor="ra")
        y += 96
    card(d, 180, 620, 1560, 170)
    d.text((260, 680), "zero RPC key required \u00b7 raw account bytes in \u2192 price on screen", font=font("mono", 26), fill=WHITE)
    d.text((260, 730), "Hermes equity feed IDs \u00b7 PreStocks keyless fallback for refs", font=font("mono", 26), fill=WHITE)
    d.text((W // 2, 880), "the price layer is Pyth-native end to end", font=font("sans", 32), fill=CYAN, anchor="mm")


def studio(d):
    scene(d, "CURVE STUDIO \u00b7 CONFIG", 5)
    d.text((W // 2, 170), "Tune the launch curve like an issuance team.", font=font("sans_b", 46), fill=WHITE, anchor="mm")
    card(d, 240, 260, 1440, 340)
    rows = [
        ("start price (from oracle)", "Pyth fair value \u00b7 0.003310", WHITE),
        ("curve shape", "virtual reserves \u00b7 custom sqrt", CYAN),
        ("fee schedule", "equity-tuned \u00b7 configurable", MINT),
        ("graduation threshold", "migrate \u2192 DAMM v2 pool", PURPLE),
    ]
    y = 325
    for k, v, col in rows:
        d.text((320, y), k, font=font("mono_b", 27), fill=GREY)
        d.text((920, y), v, font=font("mono", 27), fill=col)
        y += 68
    card(d, 240, 630, 1440, 160)
    d.text((320, 690), "one anchor \u2192 full ConfigParameters via buildCurveWithCustomSqrtPrices", font=font("mono", 26), fill=WHITE)
    d.text((320, 740), "parametrized \u2014 equity, RWA, AI, meme pairs on the same liquidity layer", font=font("mono", 26), fill=GREY)
    d.text((W // 2, 880), "launchpads can issue, not guess", font=font("sans", 32), fill=MINT, anchor="mm")


def prestocks(d):
    scene(d, "PRESTOCKS / KEYLESS", 6)
    d.text((W // 2, 170), "Reference prices even without a signed RPC key.", font=font("sans_b", 46), fill=WHITE, anchor="mm")
    card(d, 240, 270, 1440, 300)
    d.text((320, 330), "PreStocks keyless Pyth fallback", font=font("mono_b", 28), fill=CYAN)
    d.text((320, 395), "reads the same push feeds, no RPC key handoff", font=font("mono", 26), fill=WHITE)
    d.text((320, 455), "keeps EquityCurve usable for judges without key setup", font=font("mono", 26), fill=GREY)
    d.text((320, 515), "production apps still get the on-chain raw-bytes path", font=font("mono", 26), fill=GREY)
    d.text((W // 2, 700), "Pyth Pro / PreStocks eligibility \u2014 already the tracked angle", font=font("sans", 32), fill=YELLOW, anchor="mm")
    d.text((W // 2, 800), "one codebase \u00b7 keyless + on-chain \u00b7 verified in the Stocklana build", font=font("sans", 30), fill=GREY, anchor="mm")


def close(d):
    scene(d, "BOTTOM LINE", 7)
    d.text((W // 2, 200), "Tokenized equities need honest launch rails.", font=font("sans_b", 50), fill=WHITE, anchor="mm")
    card(d, 260, 300, 1400, 300)
    d.text((340, 365), "oracle-fair DBC launches for any asset class", font=font("mono_b", 30), fill=MINT)
    d.text((340, 425), "live mainnet: ASTROCOW/USDC + scade/SOL \u00b7 46 push feeds", font=font("mono", 28), fill=WHITE)
    d.text((340, 485), "fair-value monitor \u00b7 premium/discount vs Pyth \u00b7 migration", font=font("mono", 28), fill=WHITE)
    d.text((340, 545), "Meteora DBC + Pyth + PreStocks \u2014 composable, not a toy", font=font("mono", 28), fill=GREY)
    d.text((W // 2, 700), "launch what's fair. prove it on-chain.", font=font("sans_b", 42), fill=PURPLE, anchor="mm")
    d.text((W // 2, 860), "EquityCurve \u00b7 Meteora DBC Side-Track \u00b7 CLEANEST SUBMIT (not arena-gated)", font=font("mono", 30), fill=CYAN, anchor="mm")


SLIDES = [title, problem, curve, monitor, pyth, studio, close]

for i, fn in enumerate(SLIDES, 1):
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    bg(d)
    fn(d)
    p = os.path.join(OUT, f"slide-{i:02d}.png")
    img.save(p)
    print("wrote", p)
print("done", len(SLIDES))