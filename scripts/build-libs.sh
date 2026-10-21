#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT_DIR/libs-src"
DIST_VERSION_DIR="$ROOT_DIR/libs-dist/v1/1.0.0"
DIST_LATEST_DIR="$ROOT_DIR/libs-dist/v1/latest"

mkdir -p "$DIST_VERSION_DIR" "$DIST_LATEST_DIR"

cp "$SRC_DIR/fm-bridge.js" "$DIST_VERSION_DIR/fm-bridge.js"
cp "$SRC_DIR/fm-lib-loader.js" "$DIST_VERSION_DIR/fm-lib-loader.js"
cp "$SRC_DIR/fm-results-core.js" "$DIST_VERSION_DIR/fm-results-core.js"
cp "$SRC_DIR/staff-results-runtime.js" "$DIST_VERSION_DIR/staff-results-runtime.js"

cp "$DIST_VERSION_DIR/fm-bridge.js" "$DIST_LATEST_DIR/fm-bridge.js"
cp "$DIST_VERSION_DIR/fm-lib-loader.js" "$DIST_LATEST_DIR/fm-lib-loader.js"
cp "$DIST_VERSION_DIR/fm-results-core.js" "$DIST_LATEST_DIR/fm-results-core.js"
cp "$DIST_VERSION_DIR/staff-results-runtime.js" "$DIST_LATEST_DIR/staff-results-runtime.js"

echo "Built libraries into:"
echo "  $DIST_VERSION_DIR"
echo "  $DIST_LATEST_DIR"
