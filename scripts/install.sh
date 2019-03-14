! /bin/bash

if [ $# -eq 1 ]; then
	proxy=$1
fi

# run with sudo
# postgres bin directory should be in PATH
# begin updating pip, if needed
curl https://bootstrap.pypa.io/get-pip.py | python

# install dependencies of pygresql, compress
sudo apt install libpq-dev ncompress bc zip gzip gfortran gcc python-dev csh

# copy libgpstk.so
sudo cp /opt/gpstk/build/libgpstk.so /usr/lib/libgpstk.so

# modules to install
modules="pygresql tqdm==4.19.4 scandir simplekml numpy matplotlib scipy pysftp simplekml sklearn psutil dispy"

# sequence of packages to install
if [ -z "$proxy" ]; then
	pip install $modules --proxy=$proxy
else
	pip install $modules --proxy=$proxy
fi
