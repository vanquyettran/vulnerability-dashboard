# Frontend Engineer Coding Challenge

> This repository contains the coding challenge for frontend engineers.

**Note:** Please don't fork this repository, create a pull request against it, or use GuardRails in the repo name. Otherwise other candidates may take inspiration from it. Once the coding challenge is completed, you can submit it via this [Google form](https://forms.gle/i5nZWZKoUnTWj3td9).

## Description

We have provided a simple backend that supports CRUD operations on Repos, Lists, and Cards. Implement a simple **Trello-like responsive UI** using `ReactJS` and `TypeScript`. Create the project in a dedicated repository with meaningful commit messages.

The UI must support the following actions:

1. **Repo List:** Show a list of all *repos*, allow creating a new *repo*, editing a *repo* name, or deleting a new *repo*.
2. **Repo Details:** Show all *lists* of a *repo* board. Note that the *lists* are static with the titles `Open`, `Confirmed`, `False Positive`, and `Fixed`. 
3. **Vulnerability Cards**: Allow creating, editing and deleting *Vulnerability Cards*. The cards can be moved from:
    - `Open` to either `Confirmed`, `False Positive`, and `Fixed`.
    - `Confirmed` to `Fixed`.
    - * Vulnerability Cards* in `False Positive` and `Fixed` lists are considered final and can't be moved to any other state.

Wherever you’d have to add something that you feel requires product subscriptions (e.g. Logging 3rd party service) or significant extra time, just mention it in the README.md file.

**What we want to see:**

- Project Structure: Clear organization and structure of folders, code and functionality.
- Clean Code: Code Consistency, use of linters, formatting, error handling, simple and performant solution to the challenge.
- Stack Knowledge: Proper use of ReactJS and its latest features, where it makes sense. The UI has to be responsive.
- State Management: Make sure your state management is clean, simple and easy to test. 
- Implementation: The implementation has to work according to the specs.
- Unit Tests: Covering the core functionality with unit tests.
- Proper Documentation: Describe what the project is doing, what has been used, how to configure it, how to start it, test it etc.

**Bonus points for:**

- Vulnerability Notes: Modify the backend to enable Vulnerability Cards to contain notes.
- Activity Log: Add dates/times to when a card was moved to a list. An activity log is hidden and can be displayed under the card.
- Containerized app

**Things you don’t have to worry about:**

- Making it very pretty: The UI should be clean and properly aligned however it does not need any extraneous CSS and/or animations. You can use any UI framework you like. Feel free to make it as beautiful as you'd like :)
- CI configuration / Deployment
