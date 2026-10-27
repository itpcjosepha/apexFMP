#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
VERSION_DIR="$ROOT_DIR/manifests/v1/1.0.0"
LATEST_DIR="$ROOT_DIR/manifests/v1/latest"
WEB_LATEST_DIR="$ROOT_DIR/web/downloads/lib/v1/latest"

cp "$VERSION_DIR/apexConfig.json" "$LATEST_DIR/apexConfig.json"
cp "$VERSION_DIR/apexConfig.json" "$WEB_LATEST_DIR/apexConfig.json"

echo "Published latest manifest from $VERSION_DIR/apexConfig.json"
echo "Published latest web download from $VERSION_DIR/apexConfig.json"

if [[ -f "$VERSION_DIR/lib.json" ]]; then
	cp "$VERSION_DIR/lib.json" "$LATEST_DIR/lib.json"
	cp "$VERSION_DIR/lib.json" "$WEB_LATEST_DIR/lib.json"
	echo "Published legacy manifest from $VERSION_DIR/lib.json"
else
	echo "Legacy manifest not found at $VERSION_DIR/lib.json; skipped lib.json publish"
fi
