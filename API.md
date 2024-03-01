# Lobby API (WS)

| Route         | Method | Roles        | Description  | Request             | Response                              |
| ------------- | ------ | ------------ | ------------ | ------------------- | ------------------------------------- |
| lobby:join    | MSG    | PLAYER       | Join lobby   | lobbyCode, userName | lobbyCode, quizName                   |
| lobby:create  | MSG    | HOST         | Create lobby | quizId              | state, role, quizName                 |
| lobby:start   | MSG    | HOST         | Start game   | -                   | -                                     |
| lobby:kick    | MSG    | HOST         | Kick player  | playerId            | -                                     |
| lobby:players | MSG    | PLAYER, HOST | Get players  | -                   | - players<ul><li>id</li><li>name</li> |

### lobby:join [PLAYER]

Request:

- lobbyCode
- userName

Response:

- state ("game" | "lobby")
- role ("host" | "player")
- quizName

### lobby:create [HOST]

Request:

- quizId

Response:

- lobbyCode
- quizName

### lobby:players [PLAYER, HOST]

This message is sent automatically as soon as a player joins or leaves the lobby. Manual request is also possible.

Response:

- players
  - id
  - name

### lobby:start [HOST]

### lobby:kick [HOST]

- playerId

# Game API (WS, REST for report)

| Route             | Method | Roles        | Description                | Request  | Response                                                                                                                                                        |
| ----------------- | ------ | ------------ | -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| game:question     | MSG    | PLAYER, HOST | Get current question       | -        | - question (string)<br>- answers<ul><li>id</li><li>text</li></ul><br>- endTime (Date)                                                                           |
| game:answer       | MSG    | PLAYER       | Answer question            | answerId | -                                                                                                                                                               |
| game:results      | MSG    | PLAYER, HOST | Get score after a question | -        | - answers<ul><li>id</li><li>count (int)</li><li>correct (bool)</li></ul>- players<ul><li>id</li><li>name</li><li>score (int)</li><li>deltaScore (int)</li></ul> |
| /v1/game/report           | POST   | PLAYER, HOST | Report a quiz              | reason   | -                                                                                                                                                               |
| game:nextQuestion | MSG    | HOST         | Start next round           | -        | -                                                                                                                                                               |

### game:answer [PLAYER]

- answerId

### game:question [PLAYER, HOST]

Response:

- question (string)
- answers
  - id
  - text
- endTime (Date)

### game:results [PLAYER, HOST]

Response:

- answers
  - id
  - count (int)
  - correct (bool)
- players (player: top 3 + yourself, host: top 5)
  - id
  - name
  - score (int)
  - deltaScore (int)

### POST /v1/game/report [PLAYER, HOST]

- reason (string)

### game:nextRound [HOST]

# Auth API

## /v1/auth/

| Route  | Method | Roles  | Description           | Request | Response |
| ------ | ------ | ------ | --------------------- | ------- | -------- |
| /login | GET    | PUBLIC | Google OAuth callback | token   | token    |
| /guest | GET    | PUBLIC | Guest login           | -       | token    |

## login [PUBLIC]

Request:

- token (from Google OAuth)

Response:

- token (access token to be used in the Authorization header for all other requests)

## guest [PUBLIC]

Response:

- token (access token to be used in the Authorization header for all other requests)

# Quiz Search API

## /v1/quiz/

| Route           | Method | Roles  | Description   | Request | Response |
| --------------- | ------ | ------ | ------------- | ------- | -------- |
| /search         | GET    | PUBLIC | Search quiz   | query   | quizzes  |
| /:quizId/report | POST   | PLAYER | Report a quiz | reason  | -        |

### GET search?query="TEXT" [PUBLIC]

Response:

- quizzes

### POST :quizId/report [PLAYER]

- reason

# Creator API:

## /v1/quiz/

| Route           | Method | Roles   | Description     | Request | Response |
| --------------- | ------ | ------- | --------------- | ------- | -------- |
| /add            | POST   | CREATOR | Add a quiz      | quiz    | success  |
| /:quizId/edit   | PUT    | CREATOR | Edit a quiz     | quiz    | success  |
| /:quizId/delete | DELETE | CREATOR | Delete a quiz   | -       | success  |
| /list           | GET    | CREATOR | Get all quizzes | -       | quizzes  |

### /add

- name
- visibility (PUBLIC or PRIVATE)
- questions
  - order
  - question
  - imageUpload? - see in nestjs documentation
  - answers
    - text
    - correct (bool)

### PUT /:quizId/edit

- name
- visibility (PUBLIC or PRIVATE)
- questions
  - questionId
  - order
  - question
  - imageUpload? - see in nestjs documentation
  - answers
    - answerId
    - text
    - correct (bool)

### DELETE /:quizId/delete

### GET /list

# Admin API:

## /v1/admin/

| Route                    | Method | Description     | Request | Response        |
| ------------------------ | ------ | --------------- | ------- | --------------- |
| /block                   | POST   | Block a user    | userId  | success (bool)  |
| /unblock                 | POST   | Unblock a user  | userId  | success (bool)  |
| /reports                 | GET    | Get all reports | -       | reports (array) |
| /report/:reportId/delete | DELETE | Delete a report | -       | success (bool)  |

### GET /reports

Response:

- id
- reason
- creatorId
- quizId
- createdAt

# Game states & requests

State: Waiting for the game to start

- ready (wait for the start of the game)
- question (get the current question)

State: Answer the question

- ready (long pending request)
- answer (at some point)

State: Waiting for others to answer

- ready (long pending request)

State: Results phase

- score
- ready (long pending request)

State: Leaderboard

- leaderboard
