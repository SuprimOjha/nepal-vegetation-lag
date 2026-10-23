# Security and credential handling

This project may interact with NASA Earthdata services and public hosting platforms. Keep access credentials separate from source code.

## Secrets

- Never commit Earthdata passwords, personal access tokens, API keys, cookies, or session files.
- Store deployment credentials in the hosting provider's secret manager or environment settings.
- Use least-privilege tokens and rotate any credential that may have been exposed.
- Do not print authorization headers or secrets in logs, issue reports, or test output.
- Keep local credential files out of version control.

## Public API

- Validate query parameters and reject invalid date ranges, lags, and limits.
- Apply reasonable timeouts to external requests.
- Handle upstream service errors explicitly and avoid returning raw credentials or sensitive response headers.
- Avoid treating upstream text as trusted instructions or executable content.

## Reporting a vulnerability

Please avoid publishing exploitable details or secrets in a public issue. Report the affected endpoint, impact, and minimal reproduction without including credentials. Remove any exposed secret from repository history and revoke it at the issuing provider; deleting a line in a later commit does not revoke a credential.