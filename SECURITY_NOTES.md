# Security Notes

## npm audit warning: react-simple-maps / d3-color

During dependency audit, npm reports high severity vulnerabilities related to `d3-color`.

Dependency path:

```txt
react-simple-maps → d3-zoom → d3-transition → d3-interpolate → d3-color

This issue is coming from a third-party transitive dependency, not from our application code.

The reported vulnerability is related to ReDoS (Regular Expression Denial of Service) in d3-color.

In our project, react-simple-maps is only used to render a static interactive world map with predefined country data and coordinates.

We do not pass user-controlled input into d3-color, and users cannot directly control the color parsing logic.

Because of that, the practical security risk in our current use case is low.

We tested npm audit fix, but the suggested complete fix requires:

npm audit fix --force

This would downgrade react-simple-maps to version 1.0.0, which is a breaking change and may break the existing map implementation.

Decision:

We are keeping react-simple-maps@3.0.0 for the current project scope and accepting this known third-party dependency warning.

Do not run:

npm audit fix --force

unless the map implementation is reviewed and migrated to a compatible alternative.

Possible future solutions:

Replace react-simple-maps with another maintained map library.
Upgrade dependencies if react-simple-maps releases a version that fixes the issue.
Review whether dependency overrides are safe for this project.