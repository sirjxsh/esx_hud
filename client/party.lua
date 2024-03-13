group = nil


RegisterNetEvent("esx:updateParty")
AddEventHandler("esx:updateParty", function(party)
    group = party
    print(party)
    --SendNUIMessage({ type = "PARTY_HUD", value = party })
end)

Citizen.CreateThread(function()

    while true do
        if group ~= nil then
            for _, member in pairs(group) do
                if member.online then
                    member.armor = GetPedArmour(member.ped)
                    member.health = GetEntityHealth(member.ped)
                end
            end
            SendNUIMessage({ type = "PARTY_HUD", value = group })
        end
        Citizen.Wait(2000)
    end

end)