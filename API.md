# API Definition

## /v1/lobby/
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

## /v1/game/

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
    - delteScore (int)

### POST report [PLAYER, HOST]
- reason (string)

### GET nextRound [HOST]


## /v1/login/google [PLAYER, HOST, ADMIN]


## /v1/quiz/

### GET search?query="TEXT" [PUBLIC]
Response:
- quizzes

# Creator API:

## /v1/creator-quiz/
### /add
- name
- questions
    - order
    - question
    - imageUpload? - see in nestjs documentation
    - answers
        - order
        - text
        - correct (bool)

### PUT /:quizId/edit
- name
- questions
    - id
    - order
    - question
    - imageUpload? - see in nestjs documentation
    - answers
        - id
        - order
        - text
        - correct (bool)

### DELETE /:quizId/delete

### GET /list

## /v1/admin/
- block
- reports


Game states & requests

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
