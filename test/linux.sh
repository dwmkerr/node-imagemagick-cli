#!/usr/bin/env bash

# IMPORTANT: Run this on a CI platform only, ideally in a container. It affects
# the installed software and is NOT SAFE to run locally!

if [[ -z "$CIRCLECI" ]]; then
    echo "This script should run on a CI platform only. As \$CIRCLECI is not defined, the script will abort for safety."
    exit 1
fi

# Remove any installed image magick.
sudo apt remove --purge imagemagick

# Install IM 6.
# TODO

wget http://www.imagemagick.org/download/ImageMagick-6.9.9-33.tar.gz
wget http://www.imagemagick.org/download/ImageMagick-6.9.9-33.tar.gz
tar xvzf ImageMagick-6.9.9-33.tar.gz
cd ImageMagick-6.9.9-33
touch configure
./configure
make
make install
ldconfig /usr/local/lib
make check
convert -v
