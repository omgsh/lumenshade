## Plan: Bump extension to v1.1.1 and repackage

1. Update `extension/manifest.json` version from `1.1.0` → `1.1.1`.
2. Update the popup footer label in `extension/popup/popup.html` if it references the version.
3. Repackage `extension/` into `public/lumenshade.zip` using `nix run nixpkgs#zip`.
4. Verify the new zip's manifest shows `1.1.1` and contains no `identity` permission.