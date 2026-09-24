import os
from PIL import Image, ImageDraw, ImageFont

def generate_favicons():
    public_dir = r"c:\Users\jayyj\Downloads\NMC\NMC_All_Changes_Completed_Updated\NMC_All_Changes_Completed(1)\NMC\client\public"
    os.makedirs(public_dir, exist_ok=True)

    # 1. Write the crisp vector favicon.svg
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4332" />
      <stop offset="50%" stop-color="#16382b" />
      <stop offset="100%" stop-color="#0d241b" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAD074" />
      <stop offset="50%" stop-color="#C6912E" />
      <stop offset="100%" stop-color="#9A6B1A" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background container with squircle shape for modern browsers -->
  <rect x="2" y="2" width="124" height="124" rx="28" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="3" />
  
  <!-- Subtle inner decorative border -->
  <rect x="7" y="7" width="114" height="114" rx="23" fill="none" stroke="#C6912E" stroke-width="1" stroke-opacity="0.4" stroke-dasharray="3 2" />

  <!-- Trade Globe / Merchant Emblem at Top Center -->
  <g transform="translate(64, 46)" filter="url(#glow)">
    <!-- Globe outer circle -->
    <circle cx="0" cy="0" r="23" fill="#122c22" stroke="url(#goldGrad)" stroke-width="2.2" />
    <!-- Meridians / Latitudes -->
    <ellipse cx="0" cy="0" rx="12" ry="23" fill="none" stroke="#C6912E" stroke-width="1.2" stroke-opacity="0.8" />
    <line x1="-23" y1="0" x2="23" y2="0" stroke="#C6912E" stroke-width="1.2" stroke-opacity="0.8" />
    <ellipse cx="0" cy="0" rx="23" ry="11" fill="none" stroke="#C6912E" stroke-width="1" stroke-opacity="0.6" stroke-dasharray="2 1.5" />
    <!-- Golden Wheat/Sprout Leaves -->
    <path d="M-6 -22 C-14 -12 -12 2 -2 6 C-1 -4 -3 -16 -6 -22 Z" fill="url(#goldGrad)" opacity="0.9" />
    <path d="M6 -22 C14 -12 12 2 2 6 C1 -4 3 -16 6 -22 Z" fill="url(#goldGrad)" opacity="0.9" />
    <circle cx="0" cy="-22" r="2.5" fill="#FFE185" />
  </g>

  <!-- Brand Typography "NMC" -->
  <text x="64" y="95" 
        text-anchor="middle" 
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Outfit', 'Inter', 'Arial Black', sans-serif" 
        font-weight="900" 
        font-size="33" 
        letter-spacing="2.5" 
        fill="#FFFFFF" 
        filter="url(#glow)">NMC</text>

  <!-- Sub-label "EXPORTS" in gold -->
  <text x="64" y="112" 
        text-anchor="middle" 
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Outfit', 'Inter', sans-serif" 
        font-weight="800" 
        font-size="9" 
        letter-spacing="3" 
        fill="#E4B54C">EXPORTS</text>
</svg>
'''
    svg_path = os.path.join(public_dir, "favicon.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated favicon.svg at:", svg_path)

    # 2. Render pixel-perfect PNGs using PIL at high resolution then downsample with Lanczos
    size = 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background squircle
    bg_color = (22, 56, 43, 255)       # #16382B
    gold_border = (198, 145, 46, 255)   # #C6912E
    gold_light = (245, 208, 116, 255)   # #F5D074
    white_text = (255, 255, 255, 255)

    # Draw rounded rect
    corner_radius = 112
    draw.rounded_rectangle([10, 10, size - 10, size - 10], radius=corner_radius, fill=bg_color, outline=gold_border, width=12)

    # Draw inner dashed-look border
    draw.rounded_rectangle([32, 32, size - 32, size - 32], radius=corner_radius - 20, outline=(198, 145, 46, 110), width=3)

    # Globe emblem
    globe_center = (256, 185)
    globe_r = 92
    globe_bbox = [globe_center[0] - globe_r, globe_center[1] - globe_r, globe_center[0] + globe_r, globe_center[1] + globe_r]
    draw.ellipse(globe_bbox, fill=(18, 44, 34, 255), outline=gold_border, width=8)

    # Globe inner lines
    draw.ellipse([globe_center[0] - 48, globe_center[1] - globe_r, globe_center[0] + 48, globe_center[1] + globe_r], outline=(198, 145, 46, 180), width=4)
    draw.line([globe_center[0] - globe_r, globe_center[1], globe_center[0] + globe_r, globe_center[1]], fill=(198, 145, 46, 180), width=4)
    draw.ellipse([globe_center[0] - globe_r, globe_center[1] - 44, globe_center[0] + globe_r, globe_center[1] + 44], outline=(198, 145, 46, 130), width=3)

    # Golden leaves / crown on top
    draw.ellipse([globe_center[0] - 12, globe_center[1] - globe_r - 18, globe_center[0] + 12, globe_center[1] - globe_r + 6], fill=gold_light)

    # Try loading a bold system font, otherwise draw bold text
    font_bold = None
    font_sub = None
    for font_name in ["arialbd.ttf", "segoeuib.ttf", "tahomabd.ttf", "arial.ttf"]:
        try:
            font_path = os.path.join(r"C:\Windows\Fonts", font_name)
            if os.path.exists(font_path):
                font_bold = ImageFont.truetype(font_path, 130)
                font_sub = ImageFont.truetype(font_path, 36)
                break
        except Exception:
            pass

    if font_bold:
        # Draw "NMC"
        text = "NMC"
        # Bounding box for center alignment
        bbox = draw.textbbox((0, 0), text, font=font_bold)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        x = (size - w) // 2
        y = 310
        # Shadow
        draw.text((x + 3, y + 4), text, font=font_bold, fill=(10, 20, 15, 180))
        # Foreground
        draw.text((x, y), text, font=font_bold, fill=white_text)

        # Draw "EXPORTS"
        sub_text = "E X P O R T S"
        sbbox = draw.textbbox((0, 0), sub_text, font=font_sub)
        sw = sbbox[2] - sbbox[0]
        sx = (size - sw) // 2
        sy = 445
        draw.text((sx, sy), sub_text, font=font_sub, fill=gold_light)
    else:
        # Fallback default
        draw.text((160, 310), "NMC", fill=white_text)

    # Save high-res PNGs
    img_512 = img
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_180 = img.resize((180, 180), Image.Resampling.LANCZOS) # Apple touch icon
    img_48 = img.resize((48, 48), Image.Resampling.LANCZOS)
    img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img_16 = img.resize((16, 16), Image.Resampling.LANCZOS)

    img_512.save(os.path.join(public_dir, "favicon-512x512.png"), "PNG")
    img_192.save(os.path.join(public_dir, "favicon-192x192.png"), "PNG")
    img_180.save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
    img_32.save(os.path.join(public_dir, "favicon-32x32.png"), "PNG")
    img_16.save(os.path.join(public_dir, "favicon-16x16.png"), "PNG")

    # Multi-resolution ICO file containing 16, 32, 48
    ico_path = os.path.join(public_dir, "favicon.ico")
    img_48.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Saved all PNG & ICO favicons to public dir successfully!")

if __name__ == "__main__":
    generate_favicons()
