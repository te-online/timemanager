# Changelog

## 0.3.18 Beta, 11. March 2025

### Added

- Support for Nextcloud 31

### Fixed

- Update JS dependencies with `npm audit`
- Button styling should be aligned between anchor-element buttons and actual buttons
- Avoid use of deprecated logger, which caused a crash in Nextcloud 31 (#206)

## 0.3.17 Beta, 11. February 2025

### Added

- Add missing German translation strings

### Changed

- Update French translation (contributed by @punkyard)
- Docs: Replace docker with podman

### Fixed

- Override NC 30 default headline margin
- Sort list of time entries descending (#25)
- Consider timezone when printing start and end into the CSV report (#205)

## 0.3.16 Beta, 24. September 2024

### Added

- Support for Nextcloud 30

### Changed

- Updated JS dependencies and adjusted build scripts

### Fixed

- Adjustments to global CSS changes in Nextcloud 30

## 0.3.15 Beta, 18. July 2024

### Fixed

- Statistics graphs and reports should now respect the current timezone as determined by the user's browser and should not skip any days anymore (#122)

## 0.3.14 Beta, 28. April 2024

### Added

- Basic support for Nextcloud 29, manually checked

### Changed

- Styling updates, matching Nextcloud 29
- Reports: Minor UX improvements

## 0.3.13 Beta, 30. March 2024

### Fixed

- Nextcloud 28.0.4 dependency manager could not find JS file referenced via JSON file. It is unclear why this stopped working in a minor version update (#163)

## 0.3.12 Beta, 8. March 2024

### Fixed

- Legacy Sync API did not work when using PostgreSQL (#150)
- Clients could not be edited after being shared with a group the author was a member of (#152)

### Changed

- Improve French translation (#155) (contributed by @punkyard)

### Added

- Sharing Dialog: Show "(Group)" behind search results that are groups to make it easier to discern them from users

## 0.3.11 Beta, 17. December 2023

**I'm really sorry about these frequent, tiny releases. They are important bugfixes and I hope this to be the last one for now. Thanks for your patience**

### Fixed

- Another fix for the Sync API used by the Android app: Some objects may not be present in the sync response due to erroneuos re-use of a single QueryBuilder instance, unintentionally producing conflicting query conditions (#150)

## 0.3.10 Beta, 8. December 2023

### Fixed

- Fix Android app stops loading data: Revert use of named parameter for providing list of applicable commits to SQL for the legacy sync API (#148)

## 0.3.9 Beta, 2. December 2023

### Added

- Add sharing with Nextcloud user groups (#93 and #141) (contributed by @DavidProdinger)
- Run (manual) tests for Nextcloud 28 (RC2) and bump compatibility (autotest pending docker-container release)
- Add Italian localization (thanks to @Fabiettus)

## 0.3.8 Beta, 5. July 2023

- Update to comply with Autoloader requirements (by @SpaceCafe, #130)
- Update JS dependencies

## 0.3.7 Beta, 9. April 2023

### Added

- Run tests for Nextcloud 26 and bump compatibility to Nextcloud 26
- Update JS dependencies

### Fixed

- Migrate to QueryBuilder for all SQL queries to restore Nextcloud 26 compatibility (#32 and #117)
- Quick Add: Date fields are able to open brower's built-in mini calendar again (#115)

## 0.3.6 Beta, 6. March 2023

### Fixed

- Quick Add: Fix duration popover closing when using the mouse to open it in Chrome (issue #114)

## 0.3.5 Beta, 5. March 2023

### Fixed

- Fix buttons on Reports page have padding for icon, but no icon is shown (issue #94)
- Fix crash when running Nextcloud on top of PostgreSQL due to missing space character in query (issue #100)
- Fix broken print stylesheet in NC25 due to massive upstream styling changes (issue #109)

### Added

- Choose between setting duration or start and end time when creating & editing time entries w/ automatic conversion (thanks to @devattendant, PR !99)
- Dates should now be displayed in the user's browser's current timezone
- Simple end-to-end test for Quick Add widget and duration/start/end conversion
- Maintenance: Update a bunch of JS dependencies
- Add Russian localization (thanks to @lonelywoolf)

## 0.3.4 Beta, 6. November 2022

### Fixed

- SVG Favicon was re-generated (thanks to @devattendant)
- Add transform step for SCSS, since it [got removed from NC25](https://github.com/nextcloud/server/pull/32261)
- Fix input fields border style for NC25 on reports page
- Remove border from file input for NC25
- Fix Cypress tests for NC25 failing due to `position: fixed` and `overflow: hidden` breaking Cypress' scrolling
- Fix user filter showing on time entries list even though no entries were shared
- Fix warning when checkmark status is not defined on a time entry

### Added

- Run tests for Nextcloud 25 and bump compatibility to Nextcloud 25

## 0.3.3 Beta, 11. September 2022

### Added

- Dashboard / Quick Add: Rework combo-selector for client, project and taks – I hope you like it, happy to get feedback.
- Dashboard / Quick Add: Add autosuggest for previous notes for repeated time entries to prefill details
- Maintenance: Update some JS dependencies

### Fixed

- Previously missing colors for select inputs have been themed

## 0.3.2 Beta, 29. June 2022

### Added

- Add overview of all projects, tasks, and latest time entries when you select the respective menu entries without selecting a client first
- Dashboard: Add ability to see latest time entries by other people in clients that you shared and enable to filter them by person
- Reports: Add ability to filter reports by person who created the time entries

### Fixed

- Bugfix: The list of clients, projects, and tasks that appears when you select the respective menu items didn't show items shared with you
- Attempt to avoid more layout-shifts on Dashboard when JS has mounted components

## 0.3.1 Beta, 6. May 2022

### Added

- Tools/Import:
  - Add comma as a delimiter
  - Improve test coverage
  - Improve error handling, especially if file does not contain entities
  - Show messages in a dialog
- Run tests for Nextcloud 24 and bump compatibility to Nextcloud 24
- Update JS dependencies

## 0.3.0 Beta, 18. April 2022

### Added

- Add basic **client sharing feature** with support for sharing clients and all associated projects and tasks (issues #65 and possibly #1)
  - Allows users you shared the client with to create and edit time entries in tasks you created
  - Only you can see everyone's time entries (also in reports), everyone else only sees their entries
  - The sharing feature is currently **not supported** in the Android app and/or REST API
- Maintenance: Update JS dependencies

### Fixed

- Bugfix: Some variables weren't checked properly before accessing them, causing warnings to be logged (issue #72)

## 0.2.9 Beta, 15. March 2022

### Fixed

- Bugfix: Import UI will now create a commit and show the success message even if importing to an empty database
- Bugfix: Navigation button will stay visible and interactive when navigating client-side (issue #70)

## 0.2.8 Beta, 24. February 2022

- Add feature-preview of import functionality for clients, projects and tasks from a CSV file
- Add Chinese simplified localization (thanks to @lakehy)

## 0.2.7 Beta, 4. December 2021

- Maintenance: Bump compatibility to Nextcloud 23
- Maintenance: Update JS dependencies
- Bugfix: Filter selects – Add missing color customisations for dark-mode (issue #59)
- Bugfix: Reports – Improve completeness of reports at the beginning and end of an interval (issue #58)

## 0.2.6 Beta, 13. November 2021

### Fixed

#### IMPORTANT

**If you experience sync issues with the Android app by [@joleaf](https://gitlab.com/joleaf/nc-timemanager-mobile-app), please install this update at your earliest convenience and restart the Android app to clear the sync queue. It will most likely resolve those issues. Details below.**

- Bugfix: Don't assume that clients can handle sync conflicts (issue #53).

> This is sort of a regression, caused by #48 being fixed. Previously the bug described in #48 prevented the API to ask for client-side conflict handling, making the Android app work as it did.

> Since there's no API documentation and the API changed because of this bugfix, the Android app is not to blame for this. This release makes sync behavior configurable, defaulting to the sync behavior previous to 0.2.5. I've opened an [issue in the app's repository](https://gitlab.com/joleaf/nc-timemanager-mobile-app/-/issues/4) to work on adjusting to the different API signature and getting conflict handling implemented in the Android app. If you've left a negative review in the PlayStore based on this issue, please consider updating it, if this release fixes the issue for you. If not, please open an issue in this repository or the [Android app's repository](https://gitlab.com/joleaf/nc-timemanager-mobile-app).

> **Note:** If you've synced your [Android app (currently in beta)](https://play.google.com/store/apps/details?id=de.jbservices.nc_timemanager_app) with release 0.2.5 you might experience duplicate objects. **This release contains a database migration that will fix these duplicate objects and prevent them in the future**, however you might need to sort out manually which ones you'd like to keep and which ones to delete. Very sorry for the inconvenience!

> _As an aside: I'm actively working on setting up a test pipeline for API integrations that will catch these sort of errors in the future. After all, this is a good reminder that this app, as well as the Android app, are still in beta state._

- Bugfix: Make sure to round outputs of totals in Statistics module (issue #52)

## 0.2.5 Beta, 29. September 2021

### Added

- Add Czech localization (thanks to @p-bo)

### Fixed

- Bugfix: Attempt to fix switched params to `in_array` method in `storagehelper.php` when checking desired commit for existence

## 0.2.4 Beta, 15. July 2021

### Fixed

- Bugfixes
  - Reports: More detailed filters are now prioritized over parent filters. _Example: Filtering for a specific project overrides any client filters set._ This might not be ideal, but at least it delivers more predictable results for most use-cases (issue #33)
  - Reports: The graph is now respecting configured filters (issue #37)
  - Dashboard: The statistics module is looking for time entries on the last day of a week again (issue #35)

## 0.2.3 Beta, 14. July 2021

### Added

- Bump compatibility to Nextcloud 22
- Remove `database.xml` and generate migration files instead

## 0.2.2 Beta, 28. June 2021

### Fixed

- Update Portuguese translation (I forgot to include some updated strings 🙈)

## 0.2.1 Beta, 26. June 2021

### Added

- Update Portuguese translation (thanks to @vascocb)

### Fixed

- Fix wrong internal version number

## 0.2.0 Beta, 25. June 2021

### Added

- Add basic **reporting feature** with client, project, task, status and timerange filters and a simple graph
- Add **CSV export** functionality for reports
- Add basic print stylesheet for reports
- Add Portuguese translation (thanks to @vascocb)

### Fixed

- Clean up some older PHP code and add more type information (still tons to do, though...)
- Respect locale (short locale) when formatting dates and times in JS / Svelte components

## 0.1.8 Beta, 24. February 2021

### Added

- Bump compatibility to Nextcloud 21

## 0.1.7 Beta, 10. February 2021

### Fixed

- Fix missing localization of time entry start dates (#25)

### Added

- Add link to beta Android app (thanks to @joleaf)
- Update JS dependencies
- Add `paymentStatus` to sync REST API response (thanks to @joleaf)

## 0.1.6 Beta, 30. November 2020

### Fixed

- Fix syntax error in French translation file (thanks for the fix @Thovi98)

## 0.1.5 Beta, 27. November 2020

### Added

- Add French translation (thanks to @Thovi98)

### Changed

- Update JS dependencies
- Allow time entries in steps of `0.01` instead of `0.25`

### Fixed

- Fix missing \*.svelte views for server-side-rendering in app release
- Improve Dark Mode by using Nextcloud's CSS variables instead of fixed colors
- Redirect to login when session times out and server responds with 401

## 0.1.4 Beta, 1. September 2020

### Fixed

- Fix sorting of "Latest entries" on Dashboard page

## 0.1.3 Beta, 1. July 2020

### Fixed

- Fix issue with `LOWER` SQL function and backticks interpreted as timestamp (issue #3)

## 0.1.2 Beta, 22. June 2020

### Fixed

- Navigation – Fix icon urls

## 0.1.1 Beta, 22. June 2020

### Fixed

- Fix case of class filename

## 0.1.0 Beta, 22. June 2020

### Added

- Initial release.
- Featureset:
  - Organize time entries based on tasks, projects and clients.
  - Quickly record a time entry for your latest tasks.
  - Check or uncheck a time entry (e.g. to save whether you've billed it).
  - Get summaries of your time spent on tasks, projects and clients.
  - Take a glance at simple, but useful statistics.
