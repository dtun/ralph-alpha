# Releasing

Ralph ships from `packages/action`, so a release is a git ref that
`uses: dtun/ralph-alpha/packages/action@<ref>` can point at. Two rules shape
everything below:

- **Nothing is ever force-pushed**, tags included. Repository rulesets enforce
  this, so it does not rely on anyone remembering.
- **A published version never changes.** A fix is a new version.

## Version tags

Every release is an annotated tag, `vMAJOR.MINOR.PATCH`, following
[semantic versioning](https://semver.org):

| Change | Bump | Example |
|---|---|---|
| A fix, no input or behaviour change a workflow would notice | patch | `v0.1.0` → `v0.1.1` |
| New inputs, new behaviour, anything additive | minor | `v0.1.1` → `v0.2.0` |
| A renamed or removed input, or changed default behaviour | major (from `v1`) | `v1.4.2` → `v2.0.0` |

During `0.x` there is no stability promise. A minor can break workflows, and
its release notes say how.

Version tags are protected: they cannot be moved or deleted.

## `v0` is frozen

`v0` was the first release tag, before this process existed. It points at the
same commit as `v0.1.0` and stays there. Moving it would need a force push.
Workflows on `@v0` should move to an exact version.

## From `v1`: a release branch per major

`v1` will be a **branch**, not a tag. Workflows that want fixes without editing
can use `@v1`. Each release fast-forwards the branch to the release commit with
an ordinary push. A branch can move forward without force, and a tag cannot.

- Never create a `v1` tag as well. `@v1` would become ambiguous.
- The branch only moves forward. A bad release is fixed by the next one, not
  by rolling the branch back.
- Major branches are protected against force pushes and deletion.

`@v1` follows releases without review. For a workflow that must not change
under you, pin an exact tag (`@v1.0.3`) or its commit SHA.

## Cutting a release

1. Merge everything for the release into `main` through pull requests.
2. Pick the version from the table above.
3. Update the version in the docs that show `uses:` lines:
   `packages/action/README.md` and `packages/action/examples/ralph.yml`. Do it
   in a pull request, e.g. `docs(action): point examples at v0.2.0`, and merge.
4. Tag the merge commit on `main` and push the tag:

   ```bash
   git switch main && git pull --ff-only
   git tag -a v0.2.0 -m "v0.2.0: <one-line summary>"
   git push origin v0.2.0
   ```

5. Publish a GitHub release for the tag, with notes built from the merged pull
   requests since the last release. Call out anything a workflow must change:

   ```bash
   gh release create v0.2.0 --verify-tag --generate-notes
   ```

6. From `v1`, fast-forward the major branch to the new tag, e.g. for `v1.0.1`:

   ```bash
   git push origin v1.0.1^{commit}:refs/heads/v1
   ```

   This is rejected if it is not a fast-forward. That's on purpose.

7. Bump the version in the repositories that use Ralph, each through its own
   pull request.
