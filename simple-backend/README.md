# simple-backend

Modified from [GitHub](https://github.com/Thinkful-Ed/trello-backend)

Simple backend for supporting arbitrary Trello-like frontend clients

Note that this is not meant to be a robust, full-fledged Trello app backend. Its sole purpose is to provide a backend that can be run locally in order to demo front end apps that implement a UI for it.

## To get it running

1. Clone this repo
2. `cd` into it
3. Run `npm install`
4. Run `npm start`

By default, this will run the server on port 8080. And it will expect clients coming from localhost:3000. If you want non-default settings, set environment variables for `CLIENT_ORIGIN` and `SERVER_PORT` before running `npm start`.

## Seed data

Whenever you start the server, a repo will be pre-loaded via a data fixture, which should make your life easier as you develop a GUI client. Specifically, you can assume that the repo represented in the `repos.json` file will be available each time the server starts. 

## More details on what it does

This server supports basic CRUD ops for repos, lists, and cards.

The underlying app is extremely limited, it supports creating, reading, updating, and deleting repos, lists, and cards.

Here are some oddities and guidelines:

+ "It's not a real application" - specifically, it's got a volatile, in memory data store.
+ CRUD ops for repos
    - When you read a repo, you get all child components (i.e., any lists and their cards)
    - When you create a repo, you only get to give it a name, and you cannot also create child lists and cards as part of same op.
    - When you delete a repo, you delete all its child components
+ CRUD ops for lists
    - When you read a list, you get all child cards
    - When you create a list, you only get to give it a title, and you cannot also create child cards and cards as part of same op.
    - When you create a list, via the URL structure, you create it as a child of an existing repo (i.e., POST /api/repo/{{someRepoId}}/list)
    - When you update, read, or delete a list, you do so via a direct path to the list (e.g., DELETE /api/list/{{someListId}})
    - When you delete a list, you delete its card children, if any
+ CRUD ops for cards
    - When you create a card, you only get to give it text
    - When you create a card, via the URL structure, you create it as a child of an existing list (i.e., POST /api/list/{{someListid}/card)
    - When you update, read, or delete a card, you do so via a direct path to the list (e.g., DELETE /api/card/{{someCardId}})

Have fun!
