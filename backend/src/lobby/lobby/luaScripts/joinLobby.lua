
-- Parameters
local lobbyCode = KEYS[1]
local userName = ARGV[1]
local playerId = ARGV[2] -- The random player ID is passed in as a parameter


-- Check if the lobby exists
local lobbyJson = redis.call('GET', lobbyCode)
if not lobbyJson then
    return redis.error_reply("Lobby not found")
end

-- Decode the lobby JSON
local lobby = cjson.decode(lobbyJson)

-- Create new player and add to the lobby's player list
local player = {
    name = userName,
    id = playerId
}
table.insert(lobby.players, player)

-- Encode the updated lobby back to JSON and store in Redis
local updatedLobbyJson = cjson.encode(lobby)
redis.call('SET', lobbyCode, updatedLobbyJson)

return redis.status_reply("OK")
