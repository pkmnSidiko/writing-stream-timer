# Security Policy

TLC Storyworks is a collection of browser-based writing and streaming tools. We take security seriously, especially because these tools may be used alongside unpublished writing, project information, and other personal data.

## Supported Versions

TLC Storyworks currently follows the active version of the project on the `main` branch.

| Version        | Supported |
| -------------- | --------- |
| Current `main` | ✅         |
| Older versions | ❌         |

Because the project is primarily distributed as browser-based static tools, security fixes are generally made in the current version rather than maintained across multiple older versions.

## Reporting a Vulnerability

**Please do not publicly report suspected security vulnerabilities through GitHub Issues or Discussions.**

Private vulnerability reporting is enabled for this repository. If you believe you have found a security vulnerability, please use GitHub's **Private Vulnerability Reporting** feature to submit it confidentially.

A useful report should include:

* The affected tool, page, or feature
* The relevant URL, file, or component, if known
* A description of the vulnerability
* Steps needed to reproduce the problem
* The potential impact
* A suggested fix or mitigation, if you have one

Please do not include unpublished writing, passwords, API keys, access tokens, financial information, or other sensitive personal information in a report.

### What happens after a report?

Security reports are reviewed privately.

If a vulnerability is confirmed, we may:

1. Develop and test a fix or mitigation.
2. Release the fix through the appropriate repository update.
3. Review related code for similar problems.
4. Publish a security advisory when appropriate and when doing so will not increase risk to users.

If a report does not represent a security vulnerability, it may be closed or redirected to the appropriate GitHub Issue or Discussion.

We cannot guarantee a specific response or resolution time for every report, but legitimate security reports will be reviewed as reasonably possible.

## Security Practices

GitHub's repository security features are enabled for this project, including:

* **Private Vulnerability Reporting** for confidential security reports
* **Security Advisories** for coordinating and documenting confirmed vulnerabilities
* **Dependabot Alerts** for known vulnerabilities in project dependencies
* **Code Scanning** for detecting common security and coding problems
* **Secret Scanning** for detecting accidentally committed secrets
* A maintained **Security Policy** describing how vulnerabilities should be reported

Security findings are reviewed and addressed according to their severity and potential impact.

## Privacy and Local Data

TLC Storyworks tools are designed to run primarily in the user's browser.

The current tools do not require users to upload their manuscripts or writing projects to TLC Storyworks servers. Where browser storage is used, information such as settings, preferences, word-count history, or timer configuration may be stored locally in the user's browser.

Users should still avoid entering passwords, API keys, financial information, or other highly sensitive information into the tools.

Local browser storage is controlled by the browser and the user's device. Clearing browser data, using private/incognito browsing, browser settings, or browser extensions may affect locally stored information.

This privacy model may change if future tools introduce accounts, cloud storage, analytics, third-party integrations, APIs, or other external services. If that happens, the security and privacy documentation will be updated accordingly.

## Secure Development

TLC Storyworks is developed with a preference for simple, local-first browser functionality.

Security considerations include:

* Treating user-provided and locally stored values as untrusted input.
* Avoiding unnecessary use of `innerHTML` when creating interfaces from dynamic data.
* Keeping dependencies to a minimum where practical.
* Monitoring dependency vulnerabilities through Dependabot.
* Using GitHub code scanning to identify potential vulnerabilities and coding errors.
* Using secret scanning to help prevent accidental exposure of credentials or other secrets.
* Reviewing security findings and fixes rather than automatically assuming that scanner results are harmless.
* Considering embedded/browser-source use cases when evaluating changes.

Security tooling is an additional layer of protection and does not guarantee that every vulnerability will be detected.

## Scope

Security reports may include issues such as:

* Cross-site scripting (XSS)
* Unsafe handling of user-supplied or locally stored data
* Malicious or compromised dependencies
* Insecure external resources or integrations
* Unexpected exposure of locally stored information
* Accidental exposure of secrets or credentials
* Vulnerabilities affecting browser embeds or browser-source use
* Other issues that could compromise users or their data

Ordinary bugs, cosmetic problems, feature requests, and compatibility issues should generally be reported through the project's normal GitHub Issues or Discussions.

## Responsible Disclosure

Please allow the project an opportunity to investigate and address a reported vulnerability before publicly disclosing technical details that could put other users at risk.

We appreciate responsible security research and reports that help make TLC Storyworks safer for everyone.
