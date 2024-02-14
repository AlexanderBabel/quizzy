-- Parameters
local lobbyCode = KEYS[1]
local playerId = ARGV[1]

-- Retrieve and decode the lobby
local lobbyJson = redis.call('GET', lobbyCode)
assert(lobbyJson, "Lobby not found")

local lobby = cjson.decode(lobbyJson)

-- Iterate over the players, remove the matching player
for i, player in ipairs(lobby.players) do
    if player.id == playerId then
        table.remove(lobby.players, i)
        break
    end
end

-- Encode and update the lobby in Redis
redis.call('SET', lobbyCode, cjson.encode(lobby))

return redis.status_reply("OK")
