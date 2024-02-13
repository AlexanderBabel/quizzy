# Lobby API

## /v1/lobby/

| Route    | Method | Roles        | Description  | Request             | Response                              |
| -------- | ------ | ------------ | ------------ | ------------------- | ------------------------------------- |
| /join    | POST   | PLAYER       | Join lobby   | lobbyCode, userName | success                               |
| /create  | POST   | HOST         | Create lobby | quizId              | success, lobbyCode                    |
| /start   | GET    | HOST         | Start game   | -                   | success                               |
| /kick    | POST   | HOST         | Kick player  | playerId            | -                                     |
| /players | GET    | PLAYER, HOST | Get players  | -                   | - players<ul><li>id</li><li>name</li> |

### POST join [PLAYER]

- lobbyCode
- userName

### POST create [HOST]

- quizId

### GET players [PLAYER, HOST]

Response:

- players
  - id
  - name

### GET start [HOST]

### POST kick [HOST]

- playerId

# Game API

## /v1/game/

| Route     | Method | Roles        | Description                | Request  | Response                                                                                |
| --------- | ------ | ------------ | -------------------------- | -------- | --------------------------------------------------------------------------------------- |
| /ready    | GET    | PLAYER, HOST | Get game state             | -        | state (string)                                                                          |
| /question | GET    | PLAYER, HOST | Get current question       | -        | - question (string)<br>- answers<ul><li>id</li><li>text</li></ul><br>- endTime (Date)   |
| /answer   | POST   | PLAYER       | Answer question            | answerId | -                                                                                       |
| /summary  | GET    | PLAYER, HOST | Get answer summary         | -        | - answers<ul><li>id</li><li>count (int)</li><li>correct (bool)</li></ul>                |
| /score    | GET    | PLAYER, HOST | Get score after a question | -        | - players<ul><li>id</li><li>name</li><li>score (int)</li><li>deltaScore (int)</li></ul> |
| /report   | POST   | PLAYER, HOST | Report a quiz              | reason   | -                                                                                       |
| /nextround| GET    | HOST         | Start next round           | -        | -                                                                                       |

### POST answer [PLAYER]

- answerId

### GET ready [PLAYER, HOST]

Response:

- game state

### GET question [PLAYER, HOST]

Response:

- question (string)
- answers
  - id
  - text
- endTime (Date)

### GET answerSummary [PLAYER, HOST]

Response:

- answers
  - id
  - count (int)
  - correct (bool)

### GET score [PLAYER, HOST]

Response:

- players (player: top 3 + yourself, host: top 5)
  - id
  - name
  - score (int)
  - deltaScore (int)

### POST report [PLAYER, HOST]

- reason (string)

### GET nextRound [HOST]

# Auth API

## /v1/auth/

| Route            | Method | Roles  | Description           | Request | Response    |
| ---------------- | ------ | ------ | --------------------- | ------- | ----------- |
| /callback/google | GET    | PUBLIC | Google OAuth callback | code    | accessToken |

## callback/google [PLAYER, HOST, ADMIN]

Response:

- accessToken

# Quiz Search API

## /v1/quiz/

| Route   | Method | Roles  | Description | Request | Response |
| ------- | ------ | ------ | ----------- | ------- | -------- |
| /search | GET    | PUBLIC | Search quiz | query   | quizzes  |

### GET search?query="TEXT" [PUBLIC]

Response:

- quizzes

# Creator API:

## /v1/creator-quiz/

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

| Route             | Method | Description     | Request | Response        |
| ----------------- | ------ | --------------- | ------- | --------------- |
| /v1/admin/block   | POST   | Block a user    | userId  | success (bool)  |
| /v1/admin/reports | GET    | Get all reports | -       | reports (array) |

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
