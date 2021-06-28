# TimeManager App

A Nextcloud app to track time spent on work, life or anything in-between.

_Looking for screenshots, official release packages or a place to leave a rating?_ 👉 [Visit the app on the Nextcloud Appstore](https://apps.nextcloud.com/apps/timemanager)

📱 **Looking for a mobile companion app?** Try the [Android app (currently in beta)](https://play.google.com/store/apps/details?id=de.jbservices.nc_timemanager_app) made by [@joleaf](https://github.com/joleaf).

## Features

* Organize time entries based on tasks, projects and clients.
* Quickly record a time entry for your latest tasks.
* Check or uncheck a time entry (e.g. to save whether you've billed it).
* Get summaries of your time spent on tasks, projects and clients.
* Take a glance at simple, but useful statistics.
* Create basic reports using filters, timerange selection and a simple graph.

## Planned features

* _Allow tracking of time in the background._
* _Collaboration with other users – right now you can only view and edit your own time entries._
* _Performance improvements._
* _Work with start & end of time entry or duration._
* _Allow to organize time entries without assigning them to tasks, projects or clients._

## Development
The client-side JavaScript of this plugin uses ES6 features and needs to be transpiled for use in a browser. To run a watch command that automatically updates the `bundle.js` file when you make changes, execute `npm run dev`. To make a simple build, use `npm build`.

Before building or development, dependencies need to be installed once by running `npm install`.

## Changelog

### 0.2.2 Beta, 28. June 2021
- Update Portuguese translation (I forgot to include some updated strings 🙈)

### 0.2.1 Beta, 26. June 2021
- Update Portuguese translation (thanks to @vascocb)
- Fix wrong internal version number

### 0.2.0 Beta, 25. June 2021
- Add basic **reporting feature** with client, project, task, status and timerange filters and a simple graph
- Add **CSV export** functionality for reports
- Add basic print stylesheet for reports
- Add Portuguese translation (thanks to @vascocb)
- Clean up some older PHP code and add more type information (still tons to do, though...)
- Respect locale (short locale) when formatting dates and times in JS / Svelte components

### 0.1.8 Beta, 24. February 2021
- Bump compatibility to Nextcloud 21

### 0.1.7 Beta, 10. February 2021
- Fix missing localization of time entry start dates (#25)
- Add link to beta Android app (thanks to @joleaf)
- Update JS dependencies
- Add `paymentStatus` to sync REST API response (thanks to @joleaf)

### 0.1.6 Beta, 30. November 2020
- Fix syntax error in French translation file (thanks for the fix @Thovi98)

### 0.1.5 Beta, 27. November 2020
- Add French translation (thanks to @Thovi98)
- Fix missing *.svelte views for server-side-rendering in app release
- Update JS dependencies
- Improve Dark Mode by using Nextcloud's CSS variables instead of fixed colors
- Redirect to login when session times out and server responds with 401
- Allow time entries in steps of `0.01` instead of `0.25`

### 0.1.4 Beta, 1. September 2020
- Fix sorting of "Latest entries" on Dashboard page

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