# Contributing to Coders App

## Branching Model

We use Trunk-Based Development with a single long-life branch called **master**.

Short-life auxilliary branches must follow the structures:

- feature/...
- bugfix/...
- hotfix/...

Branch names should be descriptive and in `kebab-case`.

Examples of good branch names are:

- feature/add-todo-slice
- feature/test-get-todos-controller
- bugfix/modal-auto-close

Examples of bad branch names are:

- feature/css
- feature/front
- feature/form

## Commits

Commits should be atomic in order to facilitate code-review and cherry-picks

Commit messages should:

- Start with the imperative
- Start with a an upper-case letter
- Be written in English
- Describe the changes in the code
- Not reflect the circumstances that lead to the changes

Examples of good commit messages:

- Add validation feedback for login form fields
- Add tests for endpoint GET /todos
  -Create factory for building a fake ToDo

Examples of bad commit messages:

- Changes
- CSS changes
- Fix bug
- Fix modal

## Pull Requests

All proposed changes must be submitted in a pull request.

Pull requests require at least one review before merging and all conversations should be resolved.

Pull requests should be merged and closed by the team member that opened them after giving appropriate time for discussion and review.

Auxilliary branches should be deleted after merging.

## Code Reviews

Team members should try to review current pull requests.

Where possible, inline comments should be used.
