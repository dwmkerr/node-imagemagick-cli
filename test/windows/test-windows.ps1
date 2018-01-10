# Ensure that if there is any failure, we bail and abort.
$script:ErrorActionPreference = 'Stop'

# Install IM 6.
choco install imagemagick.tool --version "6.9.9.23" --no-progress
refreshenv

# Test for IM 6.
$env:CHECK_VERSION="9"
node .\\test\\check-imagemagick-version.js
If ($LastExitCode -ne 0) {
    Throw "ImageMagick Version Test Failed"
}
