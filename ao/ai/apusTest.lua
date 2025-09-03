local ApusAI = require('@apus/ai')

ApusAI_Debug = true 

ApusAI.setRouter("ED2PpCVx0KbkQtzEYBo0TRAO-HPJlpCMmUzch9ZL2g")


local prompt = "Translate 'hello world' to French."

ApusAI.infer(prompt, nil, function(err, res)
    if err then
        print("Error: " .. err.message)
        return
    end
    print("French Translation: " .. res.data)
    -- You could now store res.session to continue this conversation
end)