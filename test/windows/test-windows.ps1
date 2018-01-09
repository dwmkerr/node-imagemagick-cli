# Install IM 6.
choco install imagemagick.tool --version "6.9.9.23" && refreshenv

# Test for IM 6.
CHECK_VERSION=9 node .\\test\\check-imagemagick-version.js
