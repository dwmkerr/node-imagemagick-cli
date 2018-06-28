#!/usr/bin/env bash
set -e

# Remove any installed image magick.
sudo apt remove --purge imagemagick

# Install IM 6.
version="ImageMagick-6.9.10-3"
cp ../downloads/${version}.tar.gz .
tar xzf ${version}.tar.gz
cd ${version}
touch configure
./configure
make
sudo make install
sudo ldconfig /usr/local/lib
convert -version
cd ..

# Check the ImageMagick version with node-imagemagick-cli.
CHECK_VERSION=6 node ./test/check-imagemagick-version.js

# Install IM 7.
version="ImageMagick-7.0.7-29"
cp ../downloads/${version}.tar.gz .
tar xzf ${version}.tar.gz
cd ${version}
touch configure
./configure
make
sudo make install
sudo ldconfig /usr/local/lib
convert -version
cd ..

# Check the ImageMagick version with node-imagemagick-cli.
CHECK_VERSION=7 node ./test/check-imagemagick-version.js
