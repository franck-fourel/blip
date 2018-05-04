#!/bin/sh -e

#wget -q -O artifact_node.sh 'https://raw.githubusercontent.com/tidepool-org/tools/master/artifact/artifact_node.sh'
chmod +x artifact_node.sh

. ./version.sh
echo "ARTIFACT_NODE_VERSION=${ARTIFACT_NODE_VERSION}"
echo "TRAVIS_NODE_VERSION=${TRAVIS_NODE_VERSION}"
./artifact_node.sh
