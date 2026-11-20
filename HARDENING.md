<!-- markdownlint-disable -->

# Hardening Report: nanzm--get-time-action/v2.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `374911c4be584df24e6da57af2d990570ef0f859`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **nanzm--get-time-action/v2.0** was hardened automatically. 4 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### script-injection (severity: high)

Rule (a): the input expression is placed straight into the run: script of step 'time': `TEMPLATE="${{ inputs.format }}"`. The value is substituted into the script before bash runs it, so a format value containing `"`, `$(...)` or backticks can run any command. Fix: pass inputs.format through env (for example FORMAT: ${{ inputs.format }}) and use TEMPLATE="$FORMAT".

Locations:

- `action.yml:28`

### github-env-injection (severity: high)

Step 'time' writes `echo "value=$DATE" >> $GITHUB_OUTPUT`. DATE is the output of `date` run with a template built from inputs.format, and inputs.timeZone also feeds in through TZ. A format containing newlines or %n can add extra lines to the output, which become extra output entries. Nothing strips newlines before the write. Fix: safe=$(printf '%s' "$DATE" | tr -d '\n\r'), then echo "value=$safe" >> "$GITHUB_OUTPUT".

Locations:

- `action.yml:36`

### static-inline-injection (severity: high)

shell injection: expression "${{ inputs.format }}" appears directly in run: block of step ""; move to env: map

Locations:

- `action.yml:28`

### prior-fix (severity: high)

Carried forward from this version's previous harden, which fixed it; fix it again unless the code no longer has the problem. The previous harden changed action.yml without recording a finding for it, and this analysis reported nothing there. Re-apply its security changes unless the code no longer needs them. The previous patch:
```diff
diff --git a/action.yml b/action.yml
index 3195555..ac6a421 100644
--- a/action.yml
+++ b/action.yml
@@ -20,12 +20,30 @@ outputs:
 runs:
   using: "composite"
   steps:
     - id: time
       shell: bash
       env:
         TZ: ${{ inputs.timeZone }}
+        INPUT_FORMAT: ${{ inputs.format }}
       run: |
-        TEMPLATE="${{ inputs.format }}"
+        TEMPLATE="$INPUT_FORMAT"
         TEMPLATE=${TEMPLATE/YYYY/%Y}
         TEMPLATE=${TEMPLATE/MM/%m}
         TEMPLATE=${TEMPLATE/DD/%d}
@@ -33,4 +51,5 @@ runs:
         TEMPLATE=${TEMPLATE/mm/%M}
         TEMPLATE=${TEMPLATE/ss/%S}
         DATE=$(date +"$TEMPLATE")
-        echo "value=$DATE" >> $GITHUB_OUTPUT
+        safe=$(printf '%s' "$DATE" | tr -d '\n\r')
+        echo "value=$safe" >> "$GITHUB_OUTPUT"

```

Locations:

- `action.yml`

## Iteration Notes

### Iteration 1

**Fixes applied:** script-injection, static-inline-injection, github-env-injection, prior-fix

**Notes:**

I edited the 'time' step in action.yml (I haven't run the action since). The format input now arrives through an env variable (INPUT_FORMAT) instead of being pasted straight into the script, and the script reads it with TEMPLATE="$INPUT_FORMAT". Before the date is written to $GITHUB_OUTPUT, newlines and carriage returns are removed with printf | tr -d '\n\r', and the path is now quoted. These are the same changes the previous harden made.

