# TimeManager app

Example app to demonstrate how to build an ownCloud app.

# Debug Log

Install jqjson and run in /data/
`tail -F nextcloud.log | while read -r line; do echo "$line" | jq '.["time", "message"]'; echo ''; done`

### Icon

CC-BY [Erlenmayer Flask](https://thenounproject.com/term/erlenmeyer-flask/416209/) by [mungang kim](https://thenounproject.com/mungang.kim)