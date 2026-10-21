"""Images de l'onglet Guides, fabriquées à partir des images déjà présentes dans le dépôt.

  python3 scripts/guide-images.py          (Pillow requis : pip install pillow)

- Cartes : assemblage des tuiles de images/map/tiles (rendu du jeu © Keen Games, via enshrouded.wiki.gg).
  Les épingles ne sont PAS dessinées dans l'image : app.js les place par-dessus, d'après data/map.js.
  Les bornes de chaque découpe (coordonnées de la carte, y vers le haut) doivent rester identiques
  à celles de window.ENS.guides.cartes dans data/guides.js.
- Visuels d'équipement : rendus des sets du wiki, réduits et convertis en WebP.
"""
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None  # carte entière : 10240 × 10240

ROOT = Path(__file__).resolve().parent.parent
TILES = ROOT / "images/map/tiles"
OUT = ROOT / "images/guides"
SIZE, T = 10240, 1280

# nom: (x0, y0, x1, y1) en coordonnées de carte, largeur de sortie en px
CARTES = {
    "carte-monde": ((0, 0, SIZE, SIZE), 1600),
    "carte-springlands": ((2300, 900, 5100, 3100), 1400),
}
# nom: (image source, largeur de sortie)
VISUELS = {
    "set-mage": ("images/mage-set.png", 520),
}


def monde():
    """Carte entière en pleine résolution (tuile « a_b » : colonne a, ligne b depuis le haut)."""
    im = Image.new("RGB", (SIZE, SIZE))
    for f in TILES.glob("*.jpg"):
        a, b = map(int, f.stem.split("_"))
        im.paste(Image.open(f).convert("RGB"), (a * T, b * T))
    return im


def main():
    OUT.mkdir(exist_ok=True)
    full = monde()
    for nom, ((x0, y0, x1, y1), w) in CARTES.items():
        crop = full.crop((x0, SIZE - y1, x1, SIZE - y0))
        crop = crop.resize((w, round(w * crop.height / crop.width)), Image.LANCZOS)
        crop.save(OUT / f"{nom}.webp", quality=72, method=6)
        print(nom, crop.size)
    for nom, (src, w) in VISUELS.items():
        im = Image.open(ROOT / src).convert("RGBA")
        bbox = im.getbbox()  # retire les marges transparentes
        if bbox:
            im = im.crop(bbox)
        im = im.resize((w, round(w * im.height / im.width)), Image.LANCZOS) if im.width > w else im
        im.save(OUT / f"{nom}.webp", quality=80, method=6)
        print(nom, im.size)


if __name__ == "__main__":
    main()
