# Development environment

## Backend

From the repository root:

```bash
python -m venv .venv
```

Activate the environment using your operating system's instructions, then run:

```bash
python -m pip install -r backend/requirements.txt
python -m unittest discover -s backend/tests -v
```

To start the API, use the command documented in the README from the backend directory. Check the actual application import path before changing deployment start commands.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Use the package scripts in `frontend/package.json` as the source of truth for supported commands.

## Configuration hygiene

- Keep secrets in local environment files that are excluded by `.gitignore` or in deployment secret settings.
- Document variable names and safe example values, but never put real credentials in this file.
- Record dependency updates and test the exact versions used for a release.
- Keep frontend API origin configuration synchronized with the deployed backend.

These instructions describe the intended development workflow; they do not certify that a particular local or deployed environment is currently working.