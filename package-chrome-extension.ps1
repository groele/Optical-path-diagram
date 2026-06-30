$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist = Join-Path $root "dist"
$packageDir = Join-Path $dist "optical-path-chrome-extension"
$zipPath = Join-Path $dist "optical-path-chrome-extension.zip"

if (Test-Path $packageDir) {
  $resolvedRoot = [System.IO.Path]::GetFullPath($root)
  $resolvedPackageDir = [System.IO.Path]::GetFullPath($packageDir)
  if (-not $resolvedPackageDir.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove a package directory outside the project root: $resolvedPackageDir"
  }
  Remove-Item -LiteralPath $packageDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $packageDir | Out-Null

$items = @(
  "manifest.json",
  "index.html",
  "CHROME_EXTENSION.md",
  "src",
  "extension"
)

foreach ($item in $items) {
  $source = Join-Path $root $item
  $target = Join-Path $packageDir $item
  if (Test-Path $source -PathType Container) {
    Copy-Item -LiteralPath $source -Destination $target -Recurse
  } else {
    Copy-Item -LiteralPath $source -Destination $target
  }
}

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -Path (Join-Path $packageDir "*") -DestinationPath $zipPath -Force

Write-Host "Chrome extension package created:"
Write-Host $zipPath
