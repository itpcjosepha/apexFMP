#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
VERSION_DIR="$ROOT_DIR/manifests/v1/1.0.0"
LATEST_DIR="$ROOT_DIR/manifests/v1/latest"

cp "$VERSION_DIR/lib.json" "$LATEST_DIR/lib.json"
cp "$VERSION_DIR/apexConfig.json" "$LATEST_DIR/apexConfig.json"

echo "Published latest manifest from $VERSION_DIR/lib.json"
echo "Published latest manifest from $VERSION_DIR/apexConfig.json"
