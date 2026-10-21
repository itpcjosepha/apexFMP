# apexFMP Library Contract

## Discovery Endpoint

- URL: `/downloads/lib/v1/latest/lib.json`
- Purpose: returns current bundle metadata and library file map.

## FileMaker Request

Webviewer requests libraries via the bridge script:

- script: `(orc)apexFMP[(module;action;formName;formParam)JSON]`
- action: `loadLibs`
- formParam JSON:
  - `requestId`: unique identifier
  - `libs`: array of library names
  - `apexLibName`: persistent-data key name (default `lib`)
  - `bundleVersion`: optional expected version

## FileMaker Response Pattern

FileMaker should call Perform JavaScript in Web Viewer for each resolved library:

- `apexFMPRegisterLibrary('<name>', <apiObject>)`

The web runtime waits for these registrations and then boots page modules.
