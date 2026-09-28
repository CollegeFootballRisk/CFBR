# CFBR Smart Commits

CFBR uses a lightweight commit syntax to synchronize GitHub Issues, Project #6, and releases.

## Status syntax

```text
#12 start work #in-progress
#12 continue work #continued-development
#12 move back to backlog #backlog
#12 finish work #done
```

The status labels are mutually exclusive:

- `backlog`
- `in-progress`
- `continued-development`
- `done`

They map directly to Project #6:

- `backlog` → `Backlog`
- `in-progress` → `In Progress`
- `continued-development` → `Continued Development`
- `done` → `Done`

A `#done` commit also closes the referenced issue.

## Multiple issues

```text
#12 #18 fixed authentication and player search #done
```

Both issues are updated. The commit produces one release.

## Releases

Only `#done` creates a release.

### Bugfix

```text
#12 fix authentication #done
```

increments the bugfix number.

### Minor

```text
#12 add player search #done #minor
```

increments the minor number and resets bugfix to zero.

### Major

```text
#12 breaking API change #done #major
```

increments the major number and resets minor and bugfix to zero.

### Explicit

```text
#12 release milestone #done #explicit:1.2.0
```

The older `#version:1.2.0` syntax is also accepted.

The requested version must always be strictly greater than the latest `vX.Y.Z` tag.

## VS Code

Install **GitHub Pull Requests and Issues**.

The extension provides `#` issue completion directly in the Source Control commit message box. The workspace settings restrict suggestions to open CFBR issues.

Status/version tokens remain normal text in the built-in SCM input.

## Required secret

Add this repository secret:

```text
CFBR_PROJECT_TOKEN
```

It is used only for Project #6 GraphQL operations.

The normal GitHub Actions token handles repository contents, issue labels/state, tags, and releases.

## Workflow behavior

On every push to `main`:

1. Every commit in the push is parsed.
2. Status commits update the corresponding issue labels.
3. Referenced issues are moved to the matching Project #6 status.
4. `#done` closes the issue.
5. If the push contains a `#done` commit, the latest one produces one release.

The release tag is created on the actual completed commit, not on a later workflow-generated commit.
