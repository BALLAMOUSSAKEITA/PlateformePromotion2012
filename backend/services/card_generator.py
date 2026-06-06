import os
import io
import qrcode
from PIL import Image, ImageDraw, ImageFont
from config import settings

CARD_W, CARD_H = 860, 520
CARD_DIR = "cards"

# Palette
COLOR_BG = (15, 40, 80)          # bleu marine profond
COLOR_ACCENT = (196, 160, 80)     # or
COLOR_LIGHT = (230, 230, 230)     # gris clair
COLOR_WHITE = (255, 255, 255)
COLOR_STRIPE = (25, 60, 110)      # bleu légèrement plus clair


def _get_font(size: int, bold: bool = False):
    font_name = "arialbd.ttf" if bold else "arial.ttf"
    try:
        return ImageFont.truetype(font_name, size)
    except OSError:
        try:
            return ImageFont.truetype("DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf", size)
        except OSError:
            return ImageFont.load_default()


def _draw_rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill=fill)
    draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill=fill)
    draw.ellipse([x0, y0, x0 + 2 * radius, y0 + 2 * radius], fill=fill)
    draw.ellipse([x1 - 2 * radius, y0, x1, y0 + 2 * radius], fill=fill)
    draw.ellipse([x0, y1 - 2 * radius, x0 + 2 * radius, y1], fill=fill)
    draw.ellipse([x1 - 2 * radius, y1 - 2 * radius, x1, y1], fill=fill)


def _make_qr(data: str, size: int) -> Image.Image:
    qr = qrcode.QRCode(version=1, box_size=4, border=1)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color=COLOR_BG, back_color=COLOR_WHITE)
    return img.resize((size, size), Image.LANCZOS)


def generate_member_card(member, base_url: str) -> str:
    os.makedirs(CARD_DIR, exist_ok=True)
    out_path = os.path.join(CARD_DIR, f"{member.member_number}.png")

    img = Image.new("RGB", (CARD_W, CARD_H), COLOR_BG)
    draw = ImageDraw.Draw(img)

    # Bande décorative dorée en haut
    draw.rectangle([(0, 0), (CARD_W, 8)], fill=COLOR_ACCENT)

    # Bande diagonale subtile
    for i in range(0, CARD_W + CARD_H, 40):
        draw.line([(i, 0), (i - CARD_H, CARD_H)], fill=COLOR_STRIPE, width=20)

    # Réappliquer le fond par-dessus pour nettoyer (effet glassmorphisme simple)
    overlay = Image.new("RGBA", (CARD_W, CARD_H), (15, 40, 80, 200))
    img = img.convert("RGBA")
    img = Image.alpha_composite(img, overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Bande dorée supérieure
    draw.rectangle([(0, 0), (CARD_W, 8)], fill=COLOR_ACCENT)
    # Bande dorée inférieure
    draw.rectangle([(0, CARD_H - 8), (CARD_W, CARD_H)], fill=COLOR_ACCENT)

    # Ligne dorée verticale à gauche
    draw.rectangle([(0, 0), (6, CARD_H)], fill=COLOR_ACCENT)

    # === LOGO / ENTÊTE ===
    font_title = _get_font(14, bold=True)
    font_subtitle = _get_font(11)
    font_name = _get_font(28, bold=True)
    font_info = _get_font(13)
    font_number = _get_font(16, bold=True)
    font_small = _get_font(11)

    # Titre association
    draw.text((30, 22), "ANCIENS ÉLÈVES DE SIGUIRI", font=font_title, fill=COLOR_ACCENT)
    draw.text((30, 42), "Promotion 2012  ·  République de Guinée", font=font_subtitle, fill=COLOR_LIGHT)

    # Ligne de séparation dorée
    draw.rectangle([(30, 65), (CARD_W - 30, 67)], fill=COLOR_ACCENT)

    # === PHOTO DE PROFIL ===
    photo_x, photo_y = 30, 82
    photo_size = 160

    photo_loaded = False
    if member.photo_url:
        local_path = member.photo_url.replace(base_url + "/", "")
        if os.path.exists(local_path):
            try:
                photo = Image.open(local_path).convert("RGB")
                photo = photo.resize((photo_size, photo_size), Image.LANCZOS)
                mask = Image.new("L", (photo_size, photo_size), 0)
                mask_draw = ImageDraw.Draw(mask)
                mask_draw.ellipse([(0, 0), (photo_size, photo_size)], fill=255)
                photo_circle = Image.new("RGB", (photo_size, photo_size), COLOR_BG)
                photo_circle.paste(photo, mask=mask)
                # Bordure dorée
                border_img = Image.new("RGB", (photo_size + 6, photo_size + 6), COLOR_ACCENT)
                border_mask = Image.new("L", (photo_size + 6, photo_size + 6), 0)
                ImageDraw.Draw(border_mask).ellipse([(0, 0), (photo_size + 6, photo_size + 6)], fill=255)
                img.paste(border_img, (photo_x - 3, photo_y - 3), border_mask)
                img.paste(photo_circle, (photo_x, photo_y), mask)
                photo_loaded = True
            except Exception:
                pass

    if not photo_loaded:
        # Avatar placeholder
        draw = ImageDraw.Draw(img)
        draw.ellipse([(photo_x - 3, photo_y - 3), (photo_x + photo_size + 3, photo_y + photo_size + 3)], fill=COLOR_ACCENT)
        draw.ellipse([(photo_x, photo_y), (photo_x + photo_size, photo_y + photo_size)], fill=COLOR_STRIPE)
        initials = f"{member.first_name[0]}{member.last_name[0]}".upper()
        font_init = _get_font(52, bold=True)
        bbox = draw.textbbox((0, 0), initials, font=font_init)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text(
            (photo_x + (photo_size - tw) // 2, photo_y + (photo_size - th) // 2),
            initials,
            font=font_init,
            fill=COLOR_WHITE,
        )

    draw = ImageDraw.Draw(img)

    # === INFORMATIONS MEMBRE ===
    info_x = photo_x + photo_size + 30
    info_y = 85

    full_name = f"{member.first_name.upper()} {member.last_name.upper()}"
    draw.text((info_x, info_y), full_name, font=font_name, fill=COLOR_WHITE)

    if member.filiere:
        draw.text((info_x, info_y + 40), f"Filière : {member.filiere}", font=font_info, fill=COLOR_LIGHT)

    draw.text((info_x, info_y + 65), f"Statut : {member.status.value.capitalize()}", font=font_info, fill=COLOR_ACCENT)

    # Numéro de membre mis en valeur
    draw.rectangle([(info_x, info_y + 98), (info_x + 260, info_y + 128)], fill=COLOR_ACCENT)
    draw.text((info_x + 10, info_y + 103), member.member_number, font=font_number, fill=COLOR_BG)

    # === QR CODE ===
    verify_url = f"{base_url}/membres/{member.member_number}/verifier"
    qr_size = 120
    qr_img = _make_qr(verify_url, qr_size)
    qr_x = CARD_W - qr_size - 40
    qr_y = 82

    qr_bg = Image.new("RGB", (qr_size + 10, qr_size + 10), COLOR_WHITE)
    img.paste(qr_bg, (qr_x - 5, qr_y - 5))
    img.paste(qr_img, (qr_x, qr_y))

    draw = ImageDraw.Draw(img)
    draw.text((qr_x - 5, qr_y + qr_size + 8), "Scanner pour vérifier", font=font_small, fill=COLOR_LIGHT)

    # === PIED DE CARTE ===
    foot_y = CARD_H - 45
    draw.rectangle([(6, foot_y - 5), (CARD_W, foot_y + 35)], fill=COLOR_STRIPE)
    draw.text((30, foot_y), "CARTE DE MEMBRE OFFICIELLE  ·  Anciens Élèves de Siguiri", font=font_small, fill=COLOR_LIGHT)
    draw.text((30, foot_y + 15), f"Émise le : {member.created_at.strftime('%d/%m/%Y')}", font=font_small, fill=COLOR_ACCENT)

    img.save(out_path, "PNG", dpi=(300, 300))
    return out_path
