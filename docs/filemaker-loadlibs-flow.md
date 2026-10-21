# FileMaker loadLibs Flow

1. Receive `loadLibs` request from webviewer bridge.
2. Read persistent bundle JSON using:
   - namespace: `apex`
   - name: dynamic `apexLibName` (for example `lib`)
3. For each requested library in `libs`:
   - lookup `libraries.<name>` in bundle JSON
   - validate metadata
   - retrieve JS runtime payload
   - register in webviewer using `apexFMPRegisterLibrary`.
4. If required library is missing, return an explicit error payload or keep page in legacy mode.

## Notes

- Keep one persistent bundle per channel (`latest`, `stable`) if needed.
- Prefer immutable versioned manifests for rollback safety.
