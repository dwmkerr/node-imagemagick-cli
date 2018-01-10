# Ensure that if there is any failure, we bail and abort.
$script:ErrorActionPreference = 'Stop'

# Install IM 6.
choco install imagemagick.tool --version "6.9.9.23" --no-progress
refreshenv

# Test for IM 6.
$env:CHECK_VERSION="6"
node .\\test\\check-imagemagick-version.js
If ($LastExitCode -ne 0) {
    Throw "ImageMagick Version Test Failed"
}

# Uninstall IM 6.
choco uninstall imagemagick.tool --version "6.9.9.23" --no-progress
refreshenv

# Install IM 7.
choco install imagemagick.tool --version "7.0.7.6" --no-progress
refreshenv

# Test for IM 7.
$env:CHECK_VERSION="7"
node .\\test\\check-imagemagick-version.js
If ($LastExitCode -ne 0) {
    Throw "ImageMagick Version Test Failed"
}
