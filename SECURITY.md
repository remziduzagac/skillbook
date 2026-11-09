# Security policy

## Supported versions

The latest release only. A fix comes as a new release.

## Reporting a vulnerability

Report privately through GitHub's private vulnerability reporting: the "Report a vulnerability" button on this repository's Security tab, or <https://github.com/remziduzagac/skillbook/security/advisories/new>. Please do not open a public issue.

Include the skill and file, the skillbook version, the agent and its version, what happens, and how to reproduce it.

## What happens next

- An acknowledgement within 7 days.
- A fix, or a decision not to fix with the reason, within 60 days.
- Disclosure once a fix is released, or after 90 days at the latest, agreed with you.
- Credit in the release notes, unless you prefer otherwise.

## Scope

skillbook holds agent skills: markdown instructions, templates and a few scripts, and the scripts that install them. A security problem here is anything that could make an agent following a skill harm the person using it or their repositories, such as an instruction that leaks a secret, a template that weakens a repository's security or a script that runs untrusted input; or an install script that installs files other than a release's own, or changes files outside the folders it names.
