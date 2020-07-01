# TimeManager App

A Nextcloud app to track time spent on work, life or anything in-between.

_Looking for screenshots, official release packages or a place to leave a rating?_ 👉 [Visit the app on the Nextcloud Appstore](https://apps.nextcloud.com/apps/timemanager)

## Features

* Organize time entries based on tasks, projects and clients.
* Quickly record a time entry for your latest tasks.
* Check or uncheck a time entry (e.g. to save whether you've billed it).
* Get summaries of your time spent on tasks, projects and clients.
* Take a glance at simple, but useful statistics.

## Planned features

* _Allow tracking of time in the background._
* _Collaboration with other users – right now you can only view and edit your own time entries._
* _Sync with mobile apps._
* _Detailed statistics._
* _Performance improvements._
* _Work with start & end of time entry or duration._
* _Allow to organize time entries without assigning them to tasks, projects or clients._

## Development
The client-side JavaScript of this plugin uses ES6 features and needs to be transpiled for use in a browser. To run a watch command that automatically updates the `bundle.js` file when you make changes, execute `npm run dev`. To make a simple build, use `npm build`.

Before building or development dependencies need to be installed once by running `npm install`.

## Changelog

### 0.1.3 Beta, 1. July 2020
- Fix issue with `LOWER` SQL function and backticks interpreted as timestamp (issue #3)

### 0.1.2 Beta, 22. June 2020
- Navigation – Fix icon urls

### 0.1.1 Beta, 22. June 2020
- Fix case of class filename

### 0.1.0 Beta, 22. June 2020
- Initial release.
- Featureset:
	- Organize time entries based on tasks, projects and clients.
	- Quickly record a time entry for your latest tasks.
	- Check or uncheck a time entry (e.g. to save whether you've billed it).
	- Get summaries of your time spent on tasks, projects and clients.
	- Take a glance at simple, but useful statistics.