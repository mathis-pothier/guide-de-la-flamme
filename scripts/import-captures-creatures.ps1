# Bestiaire : importe des captures d'écran prises en jeu pour les créatures sans image.
# 1. Déposer les captures dans captures-creatures/ (dossier non versionné), nommées par l'identifiant de la créature
#    (liste : captures-creatures/A-FAIRE.txt), ex. fell-knight.jpg ou fell-knight.png. La créature doit être au centre de l'image.
# 2. powershell -ExecutionPolicy Bypass -File scripts/import-captures-creatures.ps1
#    → recadrage carré au centre, 400×400 px, JPEG → images/creatures-jeu/<id>.jpg
# 3. node scripts/build-bestiaire.mjs  (les captures remplacent les images de remplacement), puis node scripts/stamp-version.mjs
# Option -Zoom 0.6 : taille du carré par rapport au petit côté de l'image (1 = tout le petit côté ; défaut 0.75).
param([double]$Zoom = 0.75, [int]$Taille = 400)
Add-Type -AssemblyName System.Drawing
$racine = Split-Path -Parent $PSScriptRoot
$source = Join-Path $racine "captures-creatures"
$cible = Join-Path $racine "images\creatures-jeu"
if (-not (Test-Path $source)) { Write-Host "Dossier absent : $source"; exit 1 }
New-Item -ItemType Directory -Force $cible | Out-Null
$ids = (Get-Content (Join-Path $racine "data\bestiaire.js") -Raw | Select-String -Pattern '"id":"([^"]+)"' -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value }
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 86L
$n = 0
foreach ($f in Get-ChildItem $source -File | Where-Object { $_.Extension -match '^\.(jpe?g|png|webp|bmp)$' }) {
  $id = $f.BaseName.ToLower()
  if ($ids -notcontains $id) { Write-Host "Ignoré (identifiant inconnu) : $($f.Name)"; continue }
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  try {
    $cote = [int]([Math]::Min($img.Width, $img.Height) * $Zoom)
    $x = [int](($img.Width - $cote) / 2); $y = [int](($img.Height - $cote) / 2)
    $bmp = New-Object System.Drawing.Bitmap $Taille, $Taille
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $Taille, $Taille), (New-Object System.Drawing.Rectangle $x, $y, $cote, $cote), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save((Join-Path $cible "$id.jpg"), $codec, $params)
    $bmp.Dispose(); $n++
    Write-Host "OK : $id"
  } finally { $img.Dispose() }
}
Write-Host "$n capture(s) importée(s) dans images/creatures-jeu/. Lancez maintenant : node scripts/build-bestiaire.mjs"
