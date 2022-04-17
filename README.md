# TimeManager App

A Nextcloud app to track time spent on work, life or anything in-between.

_Looking for screenshots, official release packages or a place to leave a rating?_ 👉 [Visit the app on the Nextcloud Appstore](https://apps.nextcloud.com/apps/timemanager)

📱 **Looking for a mobile companion app?** Try the [Android app (currently in beta)](https://play.google.com/store/apps/details?id=de.jbservices.nc_timemanager_app) made by [@joleaf](https://gitlab.com/joleaf/nc-timemanager-mobile-app).

## Features

- 💅 Organize time entries based on tasks, projects and clients.
- 🎤 Quickly record a time entry for your latest tasks.
- ✅ Check or uncheck a time entry (e.g. to save whether you've billed it).
- 🧑‍💻 Get summaries of your time spent on tasks, projects and clients.
- 📊 Take a glance at simple, but useful statistics.
- 📒 Create basic reports using filters, timerange selection and a simple graph.
- 🤝 Track your time together with others by sharing a client and its associated projects and tasks (_web app only_).

## Planned features

- _Allow tracking of time in the background._
- _Work with start & end of time entry or duration._
- _Allow to organize time entries without assigning them to tasks, projects or clients._
- _REST API improvements for mobile clients_

## Development

The client-side JavaScript of this plugin uses ES6 features and needs to be transpiled for use in a browser. To run a watch command that automatically updates the `bundle.js` file when you make changes, execute `npm run dev`. To make a simple build, use `npm build`.

Before building or development, dependencies need to be installed once by running `npm install`.

## Changelog

### 0.3.0 Beta, 17. April 2022

- Add basic **client sharing feature** with support for sharing clients and all associated projects and tasks (issues #65 and possibly #1)
  - Allows users you shared the client with to create and edit time entries in tasks you created
  - Only you can see everyone's time entries (also in reports), everyone else only sees their entries
  - The sharing feature is currently **not supported** in the Android app and/or REST API
- Maintenance: Update JS dependencies
- Bugfix: Some variables weren't checked properly before accessing them, causing warnings to be logged (issue #72)

### 0.2.9 Beta, 15. March 2022

- Bugfix: Import UI will now create a commit and show the success message even if importing to an empty database
- Bugfix: Navigation button will stay visible and interactive when navigating client-side (issue #70)

### 0.2.8 Beta, 24. February 2022

- Add feature-preview of import functionality for clients, projects and tasks from a CSV file
- Add Chinese simplified localization (thanks to @lakehy)

### 0.2.7 Beta, 4. December 2021

- Maintenance: Bump compatibility to Nextcloud 23
- Maintenance: Update JS dependencies
- Bugfix: Filter selects – Add missing color customisations for dark-mode (issue #59)
- Bugfix: Reports – Improve completeness of reports at the beginning and end of an interval (issue #58)

### 0.2.6 Beta, 13. November 2021

#### IMPORTANT

**If you experience sync issues with the Android app by [@joleaf](https://gitlab.com/joleaf/nc-timemanager-mobile-app), please install this update at your earliest convenience and restart the Android app to clear the sync queue. It will most likely resolve those issues. Details below.**

- Bugfix: Don't assume that clients can handle sync conflicts (issue #53).

> This is sort of a regression, caused by #48 being fixed. Previously the bug described in #48 prevented the API to ask for client-side conflict handling, making the Android app work as it did.

> Since there's no API documentation and the API changed because of this bugfix, the Android app is not to blame for this. This release makes sync behavior configurable, defaulting to the sync behavior previous to 0.2.5. I've opened an [issue in the app's repository](https://gitlab.com/joleaf/nc-timemanager-mobile-app/-/issues/4) to work on adjusting to the different API signature and getting conflict handling implemented in the Android app. If you've left a negative review in the PlayStore based on this issue, please consider updating it, if this release fixes the issue for you. If not, please open an issue in this repository or the [Android app's repository](https://gitlab.com/joleaf/nc-timemanager-mobile-app).

> **Note:** If you've synced your [Android app (currently in beta)](https://play.google.com/store/apps/details?id=de.jbservices.nc_timemanager_app) with release 0.2.5 you might experience duplicate objects. **This release contains a database migration that will fix these duplicate objects and prevent them in the future**, however you might need to sort out manually which ones you'd like to keep and which ones to delete. Very sorry for the inconvenience!

> _As an aside: I'm actively working on setting up a test pipeline for API integrations that will catch these sort of errors in the future. After all, this is a good reminder that this app, as well as the Android app, are still in beta state._

- Bugfix: Make sure to round outputs of totals in Statistics module (issue #52)

### 0.2.5 Beta, 29. September 2021

- Add Czech localization (thanks to @p-bo)
- Bugfix: Attempt to fix switched params to `in_array` method in `storagehelper.php` when checking desired commit for existence

### 0.2.4 Beta, 15. July 2021

- Bugfixes
  - Reports: More detailed filters are now prioritized over parent filters. _Example: Filtering for a specific project overrides any client filters set._ This might not be ideal, but at least it delivers more predictable results for most use-cases (issue #33)
  - Reports: The graph is now respecting configured filters (issue #37)
  - Dashboard: The statistics module is looking for time entries on the last day of a week again (issue #35)

### 0.2.3 Beta, 14. July 2021

- Bump compatibility to Nextcloud 22
- Remove `database.xml` and generate migration files instead

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
- Fix missing \*.svelte views for server-side-rendering in app release
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
