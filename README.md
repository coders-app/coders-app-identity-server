# Identity Server

This repo contains the code for the app Identity Server that belongs to the suite Coders App.

## Getting started

Install the app's dependencies:

    npm install

## Development

This project uses TypeScript, you can run the compiler in watch mode with:

    npm run build:dev

You can run the compiled app with nodemon with:

    npm run start:dev

You can run tests in watch mode with:

    npm run test:dev

These git hooks are configured in the project with Husky:

- `pre-commit`: fails if it finds `console.*` or `debugger` statements, also runs Prettier and ESLint and fails if ESLint errors are present.
- `commit-msg`: fails if the message is shorter than 11 or longer than 71 characters.
- `pre-push`: fails if the name of the branch doesn't start with _feature/_, _bugfix/_ or /_hotfix/_.

## Build

If you want to build the app, you can run the compiler with:

    npm run build

You can run the build with:

    npm start

You can run tests with:

    npm test

You can run tests and generate coverage report with:

    npm run test:coverage
