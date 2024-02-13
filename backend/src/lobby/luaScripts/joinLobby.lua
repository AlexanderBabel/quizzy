-- Concise Redis Lua script for adding a player to a lobby

-- Parameters
local lobbyCode = KEYS[1]
local userName, playerId = ARGV[1], ARGV[2]

-- Retrieve and decode the lobby
local lobbyJson = assert(redis.call('GET', lobbyCode), "Lobby not found")
local lobby = cjson.decode(lobbyJson)

-- Add new player to the lobby's player list and update the lobby in Redis
table.insert(lobby.players, { name = userName, id = playerId })
redis.call('SET', lobbyCode, cjson.encode(lobby))

return redis.status_reply("OK")
