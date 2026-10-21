# Télécharge les sous-titres (FR puis EN, manuels ou auto) des vidéos de liste-videos-enshrouded.csv
# et les enregistre en texte brut dans transcriptions/<id>.txt. À lancer sur un PC perso :
# YouTube bloque les sous-titres depuis les serveurs cloud.
#   pip install -U yt-dlp
#   python telecharger_transcriptions.py
import csv, re, subprocess, sys, time, tempfile
from pathlib import Path

ici = Path(__file__).resolve().parent
sortie = ici / "transcriptions"
sortie.mkdir(exist_ok=True)


def vtt_en_texte(vtt):
    lignes, vu = [], set()
    for l in vtt.splitlines():
        if not l.strip() or "-->" in l or l.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")):
            continue
        l = re.sub(r"<[^>]+>", "", l).strip()
        if l and l not in vu:  # les sous-titres auto répètent chaque ligne
            vu.add(l)
            lignes.append(l)
    return " ".join(lignes)


def telecharger(video):
    # Langue d'origine de la vidéo seulement : les traductions auto (ex. "fr" d'une vidéo EN)
    # renvoient vite des 429 qui font échouer tout le téléchargement. Manuels avant auto.
    pref = ["fr", "fr-orig"] if video["langue"] == "FR" else ["en", "en-orig"]
    with tempfile.TemporaryDirectory() as tmp:
        cmd = [sys.executable, "-m", "yt_dlp", "--skip-download", "--write-subs", "--write-auto-subs",
               "--ignore-errors", "--sub-langs", ",".join(pref), "--sub-format", "vtt",
               "-o", f"{tmp}/%(id)s.%(ext)s", video["url"]]
        subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        fichiers = sorted(Path(tmp).glob("*.vtt"))
        if not fichiers:
            return None
        fichiers.sort(key=lambda f: next((i for i, p in enumerate(pref) if f.name.endswith(f".{p}.vtt")), 9))
        f = fichiers[0]
        return f.name.split(".")[-2], vtt_en_texte(f.read_text(encoding="utf-8"))


videos = list(csv.DictReader(open(ici / "liste-videos-enshrouded.csv", encoding="utf-8")))
echecs = []
for i, v in enumerate(videos, 1):
    cible = sortie / f"{v['id']}.txt"
    if cible.exists():
        continue
    print(f"[{i}/{len(videos)}] {v['titre']}", flush=True)
    try:
        res = telecharger(v)
    except subprocess.TimeoutExpired:
        res = None
    if not res:
        echecs.append(v["id"])
        print("   pas de sous-titres", flush=True)
    else:
        langue, texte = res
        cible.write_text(f"# {v['titre']}\n# {v['chaine']} | {v['url']} | sous-titres: {langue}\n\n{texte}\n", encoding="utf-8")
    time.sleep(3)  # évite le blocage pour trop de requêtes

(sortie / "echecs.txt").write_text("\n".join(echecs), encoding="utf-8")
print(f"Terminé : {len(videos) - len(echecs)} ok, {len(echecs)} sans sous-titres")
