### Sportacus version 2 notes and info
Last updated April 2, 2021

# Features required (basically get us mostly to where we are in version 1):
- Game schedule and referee schedule
- Ability to add, edit and delete: venues/fields, age groups, teams, users, referees, coaches, regions, projects
- Basic permission system
- Referees can sign up for games
- Referees can enter game report info
- Send emails and texts for changes and reminders (and created?)
- Calculate and indicate conflicts:
- Official conflicts (signed up to multiple games at the same time)
- Team conflicts (team games overla)
- Location conflicts (multiple games at same location and time)
- Game conflicts (game time overlap)
- Import/export games and teams
- -make game export use search criteria
- separate login account (user) from volunteer roles (coach and official)
- Calculate referee points as Sportacus 1
- Checkbox in the official game report to flag that the referee admin needs to be alerted to this report.
- Referee iCalendar support
- Support various positions for each game (CR, AR1, AR2 or R1, R1 as well as mentor, standby, etc.)

# Additional features
- Phone app?
- API backend design
- Referee self-assignments as well as referee assignments by an admin (with accept/decline logic)
- standardize user access and rights so scheduler users can edit their region games only
- Support multiple organizations  (i.e. multiple independent areas, sections, etc.)
- Better search function. Add region, age group, location filters to schedule search (have a simple search and an advanced search; perhaps name=value syntax)
- “Follow” teams and get notified when games are created/changed
- Credentialing (coach/ref levels) for tournament games
- Automated scheduling based upon team/coach/field constraints
- Cut and paste import (paste into text field and import tab-delimited table)
- Add support to assign permissions for division and region schedulers to change only their games. Perhaps a group system?
- Add logging capability to log various actions for tracking
- Show change log in game screen (track who changes what)
- For region/team POCs, use POC list that can have more than one
- Add assigned positions for mentor, backup ref, time keeper, etc., and other positions.  Would be great to have this configurable.
- Add more info to the user profile - Add settings page for referees, schedulers, and region owner.
- Identify youth referees so that we can make sure there is an adult referee signed up
- Allow multiple roles per user account (support coach and referee, or referee and youth referee, etc)
- Allow user to “subscribe” to alerts for a team… maybe other entities?
- Add mobile verify function
- Add RRA only viewable info to track referee's status, equipment, etc.
- Improve scorecards to enter more data
- Add line card info to the game report?
- Support for Venues as well as fields (nested). Be able to change the status of all games on a field or venue (rained out, etc)

# Tournament Features
- Calculate team points.
- Have the ability to link the home or away team to the winner or loser of another game.
- Support for pools.
- Settings for tournament point system: points awarded for win, loss, tie, forfeit, each goal, player sendoff, coach sendoff, per-game goal max, per-game point max.
- Scheduling
- Official "comfort level" selection (mark what Age Group they are willing to referee).
- Assigners can score referee ability (separate from comfort level... referee can't see?)
- Official game count limits (per day, week, month)
- Add messaging system: tracks automatic outgoing emails and allows users to send messages to each other without knowing email addresses. Also would allow smart alert messages (i.e. if you make multiple changes to the same object within 10 mins, it just sends one email with the end result of all the changes)
- Add notify options to person: all, my region, my team, my games
- In game edit/create page, have AgeGroup pull-down update the list of teams for team1 and team2 (javascript)
- Add availability to officials, teams, and locations
- Add availability page that shows locations, games, and referee assignments graphically on one page
- Official conflicts (availability, ability, time between back-to-back games)
- Add constraints to Teams, Locations, Officials,
- Constraints includes time (unavailable), team,
- Add POC to age groups (division coordinators)
- Add default game length in AgeGroup entity, but can be changed per game - maybe
