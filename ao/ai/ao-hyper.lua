-- Backend AO Process Logic (Core Flow from section 2.5)

Results = Results or {} -- Your process's state where results are stored

-- Handler to listen for prompts from your frontend
Handlers.add(
    "SendInfer",
    Handlers.utils.hasMatchingTag("Action", "Infer"),
    function(msg)
        local reference = msg["X-Reference"] or msg.Reference
        -- Initialize result entry with processing status
        Results[reference] = { status = "processing", data = nil }
        ao.send({
            Target = "TED2PpCVx0KbkQtzEYBo0TRAO-HPJlpCMmUzch9ZL2g",
            Action = "Infer",
            ["X-Prompt"] = msg.Data, 
            ["X-Reference"] = reference
        })
        Send({ device = 'patch@1.0', cache = { results = Results } })
    end
)

Handlers.add(
    "AcceptResponse",
    Handlers.utils.hasMatchingTag("Action", "Infer-Response"),
    function(msg)
        -- print("Received AI response for message ")
        local reference = msg["X-Reference"] or msg.Reference
        print("AI response accepted for message " .. reference)
        Results[reference] = { status = "completed", data = msg.Data }
        Send({ device = 'patch@1.0', cache = { results = Results } })
    end
)