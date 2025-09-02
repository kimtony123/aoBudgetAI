local json = require("json")
local math = require("math")


-- This process details
PROCESS_NAME = "aos Tracker"
PROCESS_ID = "-E8bZaG3KJMNqwCCcIqFKTVzqNZgXxqX9Q32I_M3-Wo"



-- tables 
UsersTable = UsersTable or {}

CatergoryCounter = CatergoryCounter or 0
TransactionCounter  = TransactionCounter or 0


-- Function to get the current time in milliseconds
function GetCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end



function To_base62(n)
    local chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    return n == 0 and "0" or To_base62(math.floor(n/62)) .. chars:sub(n%62+1, n%62+1)
end

-- Function to generate a unique review ID
function GenerateCatergoryId()
    CatergoryCounter = CatergoryCounter + 1
    return "CI" .. To_base62(CatergoryCounter)
end

-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. To_base62(TransactionCounter)
end


-- Response helper functions
function SendSuccess(target, message)
    ao.send({
        Target = target,
        Data = json.encode({
            code = 200,
            message = "success",
            data = message
        })
    })
end


function SendFailure(target, message)
    ao.send({
        Target = target,
        Data = json.encode({
            code = 404,
            message = message,
            data = {}
        })
    })
end



function ValidateField(value, fieldName, target)
    if not value then
        SendFailure(target, fieldName .. " is missing or empty")
        return false
    end
    return true
end



Handlers.add(
    "AddTransaction",
    Handlers.utils.hasMatchingTag("Action", "AddTransaction"),
    function(m)
        local createdTime = GetCurrentTime(m)
        local transactionId = GenerateTransactionId()
        local catergoryId = m.Tags.catergoryId
        local description = m.Tags.description
        local date = m.Tags.date
        local amount = m.Tags.amount
        local type = m.Tags.type
        local user = m.From




        print("Here is the caller Process ID"..user)
        
        -- Field validation examples
        if not ValidateField(createdTime, "createdTime", m.From) then return end
        if not ValidateField(transactionId, "transactionId", m.From) then return end
        if not ValidateField(catergoryId, "catergory", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(date, "date", m.From) then return end
        if not ValidateField(amount, "amount", m.From) then return end
        if not ValidateField(type, "type", m.From) then return end


        UsersTable = UsersTable or {}
        UsersTable[user] =  UsersTable[user] or {}
        UsersTable[user].catergories = UsersTable[user].catergories or {}
        UsersTable[user].transactions = UsersTable[user].transactions or {}
        UsersTable[user].transactions[type] =  UsersTable[user].transactions[type] or {}


        local transaction =  UsersTable[user].transactions[type][transactionId] 
        local catergory =  UsersTable[user].catergories[catergoryId].name


        transaction = {
                    id = transactionId,
                    catergory = catergory,
                    description = description,
                    date = date,
                    createdTime = createdTime,
                    amount = amount,
                    type = type
                    
                }
        

        SendSuccess(user, ""..type .."Transaction Added Succesfullly")
    end
)


Handlers.add(
    "AddCatergory",
    Handlers.utils.hasMatchingTag("Action", "AddCatergory"),
    function(m)
        local createdTime = GetCurrentTime(m)
        local catergoryId = GenerateCatergoryId()
        local name = m.Tags.name
        local description = m.Tags.description
        local icon = m.Tags.icon
        local type = m.Tags.type
        local user = m.From


        print("Here is the caller Process ID"..user)
        

        -- Field validation examples
        if not ValidateField(createdTime, "createdTime", m.From) then return end
        if not ValidateField(catergoryId, "catergoryId", m.From) then return end
        if not ValidateField(name, "name", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(icon, "date", m.From) then return end
        if not ValidateField(type, "type", m.From) then return end


        UsersTable = UsersTable or {}
        UsersTable[user] =  UsersTable[user] or {}
        UsersTable[user].catergories = UsersTable[user].catergories or {}


        local catergory = UsersTable[user].catergories[catergoryId]

        catergory = {
                    id = catergoryId,
                    description = description,
                    icon = icon,
                    createdTime = createdTime,
                    type = type                    
                }


        

        SendSuccess(user, ""..type .."Catergory Added Succesfullly")
    end
)


Handlers.add(
    "DeleteTransaction",
    Handlers.utils.hasMatchingTag("Action", "DeleteTransation"),
    function(m)
        local id = m.Tags.id
        local type = m.Tags.type
        local reviewId = m.Tags.reviewId
        local user = m.From
        if not ValidateField(id, "id", m.From) then return end
        
        if not ValidateField(type, "type", m.From) then return end

      
        local transaction =  UsersTable[user].transactions[type][id]

        if transaction == nil then
            SendFailure(m.From, "transaction doesnt exist..")
            return
        end
        transaction = nil
        SendSuccess(m.From , "Transaction Deleted Succesfully." )   
    end
)



Handlers.add(
    "DeleteCatergory",
    Handlers.utils.hasMatchingTag("Action", "DeleteCatergory"),
    function(m)
        local id = m.Tags.id

        local user = m.From
        if not ValidateField(id, "id", m.From) then return end
        

        local catergory = UsersTable[user].catergories[id]
      
        if catergory == nil then
            SendFailure(m.From, "transaction doesnt exist..")
            return
        end
        catergory = nil
        SendSuccess(m.From , "Catergory Deleted Succesfully." )   
    end
)



Handlers.add(
    "FetchUserTransactions",
    Handlers.utils.hasMatchingTag("Action", "FetchUserTransactions"),
    function(m)
        local user = m.From

         if not ValidateField(user, "user", m.From) then return end

         local transactions = UsersTable[user].transactions
        -- Ensure appId exists in ReviewsTable
         if transactions == nil then
             SendFailure(m.From , "transactions not Found.")
            return
        end
        -- Fetch the info
        local transactionsList  = UsersTable[user].transactions
        SendSuccess(m.From , transactionsList)
    end
)

Handlers.add(
    "FetchUserIncomeTransactions",
    Handlers.utils.hasMatchingTag("Action", "FetchUserIncomeTransactions"),
    function(m)
        local user = m.From
        local type = m.Tags.type

        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(type, "type", m.From) then return end


         local transactions = UsersTable[user].transactions[type]
        -- Ensure appId exists in ReviewsTable
         if transactions == nil then
             SendFailure(m.From , "transactions not Found.")
            return
        end
        -- Fetch the info
        local transactionsList  = UsersTable[user].transactions[type]
        SendSuccess(m.From , transactionsList)
    end
)



Handlers.add(
    "FetchUserExpenseTransactions",
    Handlers.utils.hasMatchingTag("Action", "FetchUserExpenseTransactions"),
    function(m)
        local user = m.From
        local type = m.Tags.type

        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(type, "type", m.From) then return end


         local transactions = UsersTable[user].transactions[type]
        -- Ensure appId exists in ReviewsTable
         if transactions == nil then
             SendFailure(m.From , "transactions not Found.")
            return
        end
        -- Fetch the info
        local transactionsList  = UsersTable[user].transactions[type]
        SendSuccess(m.From , transactionsList)
    end
)



Handlers.add(
    "FetchUserCatergories",
    Handlers.utils.hasMatchingTag("Action", "FetchUserCatergories"),
    function(m)
        local user = m.From

         if not ValidateField(user, "user", m.From) then return end

         local transactions = UsersTable[user].catergories
        -- Ensure appId exists in ReviewsTable
         if transactions == nil then
             SendFailure(m.From , "Catergories not Found.")
            return
        end
        -- Fetch the info
        local catergoriesList  = UsersTable[user].catergories
        SendSuccess(m.From , catergoriesList)
    end
)







