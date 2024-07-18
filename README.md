# TimeManager App

A Nextcloud app to track time spent on work, life or anything in-between.

_Looking for screenshots, official release packages or a place to leave a rating?_ 👉 [Visit the app on the Nextcloud Appstore](https://apps.nextcloud.com/apps/timemanager)

## Features

- 💅 Organize time entries based on tasks, projects and clients.
- 🎤 Quickly record a time entry for your latest tasks.
- ✅ Check or uncheck a time entry (e.g. to save whether you've billed it).
- 🧑‍💻 Get summaries of your time spent on tasks, projects and clients.
- 📊 Take a glance at simple, but useful statistics.
- 📒 Create basic reports using filters, timerange selection and a simple graph.
- 🤝 Track your time together with others by sharing a client and its associated projects and tasks (_web app only_).
- 🕰 Work with start & end of time entry or duration.

## Update strategy

☝️ A few words on the state of this app:

> [!Tip]
> If you have a **feature request**, please read the following section before opening an issue or to understand why I may have closed your already opened issue.

### Background

- This Nextcloud app was originally developed by [me](https://github.com/te-online) for my own use
- I've published it at some point to share with whoever could be interested
- The codebase is by no means in perfect shape (that's why versions continue to be suffixed "Beta")
- I know that contributing is not easy as it is right now

> [!Important]
> I consider the app **mostly feature-complete**

### Long-term goals

- I have no interest in adding massive new features to this app, nor do I intend to change it in any big way
- With new features comes new responsibility to maintain those and I have no interest in that

> [!Important]
> My **main concern is to support the existing feature set** as best as I can for the foreseeable future. My responses to feature requests should be seen with this goal in mind

### Conclusion

You may have come here with lots of ideas in your head and now you read this. It may be a disappointment to you, and I'm sorry about that.

If you absolutely need these features, you are welcome to fork the repository and make your own version ✨

## Development

The client-side JavaScript of this plugin uses ES6 features and needs to be transpiled for use in a browser. To run a watch command that automatically updates the `bundle.js` file when you make changes, execute `npm run dev`. To make a simple build, use `npm build`.

Before building or development, dependencies need to be installed once by running `npm install`.

## Automated testing

Some end-to-end testing is done using [Cypress](https://www.cypress.io/). Tests currently cover basic features of the app and run in a headless Chrome browser on a dockerized Nextcloud instance. For this repository tests run on [a mirror repository on Gitlab](https://gitlab.com/te-online/timemanager).

To run tests locally, change into the `tests` directory. Before running or working on tests, run `npm install` to install dependencies. Make sure to create a `.env` file based on `.env.example` and a `cypress.env.json` based on `cypress.env.example.json`; values can be chosen freely, only make sure they align between the two files.

To run the app, install docker and docker-compose on your machine.

- Then run `docker-compose up`,
- followed by `docker exec $(docker ps -qf "name=app") sh -c 'chown www-data:root custom_apps'`.
- Wait for the app to be ready,
- then run `docker exec -u www-data $(docker ps -qf "name=app") sh -c 'php -f ./occ app:disable firstrunwizard'`.
- Then activate the app by running `docker exec -u www-data $(docker ps -qf "name=app") sh -c 'php -f ./occ app:enable timemanager'`
- Finally, run `npm start` and use Cypress' UI to start running the tests included in the spec file.

To shut down containers and delete the temporary volumes, run `docker-compose down -v` in a second terminal while you're in the same `tests` directory.

Test cases might depend on running in a specific order. This means you might need to wind down your docker containers and start them again as described above when re-running tests.

**New features** are supposed to be covered by end-to-end tests in a way that reflects their average usage.

**Bugfixes** are supposed to include a test case that demonstrates the bug being fixed and prevent it to be re-introduced in the future.

## Changelog

The changelog is available [in the CHANGELOG file](https://github.com/te-online/timemanager/blob/main/CHANGELOG.md)
