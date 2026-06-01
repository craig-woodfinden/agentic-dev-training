# Safety doc — <agent name>

One page. If you can't keep it to one page, the agent is over-scoped.

## What this agent is allowed to do
- Read: <list>
- Write: <list, or "none">
- Call: <network endpoints, "none">
- Shell: <"none">

## What it is never allowed to do
Explicit list of negative permissions. Examples:
- Read outside the repo root
- Write to filesystem
- Make network calls to external services
- Execute shell commands
- Handle PII (no SSN/credit card patterns in inputs or outputs)

## Detection — what we watch for
- Path-escape attempts in tool args
- Suspicious tool-call patterns (many reads in a row, etc.)
- Token usage spikes

## When something goes wrong
- Refusal behaviour:
- Logging behaviour:
- Alert routing:
- How a user gets out of a bad loop:

## Owner
- Engineer:
- Reviewed by (Expert):
- Last reviewed:
