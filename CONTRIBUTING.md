# Contributing to Orkestrix

Thank you for your interest in contributing.
All contributions are welcome — bugs, features, docs, and tests.

## Getting started

1. Fork the repository
2. Clone your fork:
   git clone https://github.com/SalwaMK/Orkestrix
3. Install dependencies:
   npm install
4. Copy environment variables:
   cp .env.example .env.local
5. Run migrations:
   npm run db:migrate
6. Start the dev server:
   npm run dev

## Making changes

- Create a branch: git checkout -b feature/your-feature-name
- Make your changes
- Make sure npm run build passes with no errors
- Open a pull request with a clear description of what you changed

## Guidelines

- No `any` types in TypeScript
- All monetary values stored as integer cents
- All date operations use date-fns
- Keep components under 150 lines — split if needed
- One component per file

## Reporting bugs

Open an issue on GitHub with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your OS and Node version
