local json = require("json")
local math = require("math")


-- This process details
PROCESS_NAME = "aos TrackerAI"
PROCESS_ID = "Ejr_9-PPwg9RV7FFilWIeap6Zm0CdmUEbevGzPwAOd0"


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

        UsersTable[user] = UsersTable[user] or {}
        UsersTable[user].transactions = UsersTable[user].transactions or {}
        
        -- Check if transactions exist
        if not next(UsersTable[user].transactions) then
            SendFailure(m.From, "No transactions found.")
            return
        end
        
        -- Format transactions according to the specified interface
        local formattedTransactions = {}
        
        -- Process expense transactions
        if UsersTable[user].transactions.Expense then
            for id, transaction in pairs(UsersTable[user].transactions.Expense) do
                table.insert(formattedTransactions, {
                    id = transaction.id,
                    category = transaction.category,
                    description = transaction.description,
                    date = transaction.date,
                    type = "expense",
                    amount = tonumber(transaction.amount) or 0
                })
            end
        end
        
        -- Process income transactions
        if UsersTable[user].transactions.Income then
            for id, transaction in pairs(UsersTable[user].transactions.Income) do
                table.insert(formattedTransactions, {
                    id = transaction.id,
                    category = transaction.category,
                    description = transaction.description,
                    date = transaction.date,
                    type = "income",
                    amount = tonumber(transaction.amount) or 0
                })
            end
        end
        
        SendSuccess(m.From, formattedTransactions)
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
    "FetchUserCategories",
    Handlers.utils.hasMatchingTag("Action", "FetchUserCategories"),
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


-- Handler to add mock transactions
Handlers.add(
    "AddMockTransactions",
    Handlers.utils.hasMatchingTag("Action", "AddMockTransactions"),
    function(m)
        local user = m.From
        UsersTable[user] = UsersTable[user] or {}
        UsersTable[user].transactions = UsersTable[user].transactions or {}
        UsersTable[user].transactions.Expense = UsersTable[user].transactions.Expense or {}
        UsersTable[user].transactions.Income = UsersTable[user].transactions.Income or {}
        
        -- Sample expense categories
        local expenseCategories = {"Food", "Transport", "Entertainment", "Utilities", "Shopping"}
        -- Sample income categories
        local incomeCategories = {"Salary", "Freelance", "Investment", "Gift", "Bonus"}
        
        -- Add 15 expense transactions
        for i = 1, 15 do
            local transactionId = GenerateTransactionId()
            local category = expenseCategories[math.random(#expenseCategories)]
            local amount = tostring(math.random(10, 500))
            local date = os.date("%Y-%m-%d", os.time() - math.random(0, 30)*24*60*60) -- Random date in last 30 days
            
            UsersTable[user].transactions.Expense[transactionId] = {
                id = transactionId,
                category = category,
                description = "Expense transaction " .. i,
                date = date,
                createdTime = os.time() * 1000, -- Current time in milliseconds
                amount = amount,
                type = "Expense"
            }
        end
        
        -- Add 5 income transactions
        for i = 1, 5 do
            local transactionId = GenerateTransactionId()
            local category = incomeCategories[math.random(#incomeCategories)]
            local amount = tostring(math.random(500, 2000))
            local date = os.date("%Y-%m-%d", os.time() - math.random(0, 30)*24*60*60) -- Random date in last 30 days
            
            UsersTable[user].transactions.Income[transactionId] = {
                id = transactionId,
                category = category,
                description = "Income transaction " .. i,
                date = date,
                createdTime = os.time() * 1000, -- Current time in milliseconds
                amount = amount,
                type = "Income"
            }
        end
        
        SendSuccess(user, "20 mock transactions added successfully (15 expense, 5 income)")
    end
)

-- Handler to add mock categories
Handlers.add(
    "AddMockCategories",
    Handlers.utils.hasMatchingTag("Action", "AddMockCategories"),
    function(m)
        local user = m.From
        UsersTable[user] = UsersTable[user] or {}
        UsersTable[user].catergories = UsersTable[user].catergories or {}
        
        -- Add 5 expense categories
        local expenseCategories = {
            {name = "Food", description = "Food and dining expenses", icon = "🍕"},
            {name = "Transport", description = "Transportation costs", icon = "🚗"},
            {name = "Entertainment", description = "Entertainment expenses", icon = "🎬"},
            {name = "Utilities", description = "Bills and utilities", icon = "💡"},
            {name = "Shopping", description = "Shopping expenses", icon = "🛒"}
        }
        
        for i, cat in ipairs(expenseCategories) do
            local categoryId = GenerateCatergoryId()
            UsersTable[user].catergories[categoryId] = {
                id = categoryId,
                name = cat.name,
                description = cat.description,
                icon = cat.icon,
                createdTime = os.time() * 1000,
                type = "Expense"
            }
        end
        
        -- Add 5 income categories
        local incomeCategories = {
            {name = "Salary", description = "Monthly salary", icon = "💰"},
            {name = "Freelance", description = "Freelance income", icon = "💻"},
            {name = "Investment", description = "Investment returns", icon = "📈"},
            {name = "Gift", description = "Gifts received", icon = "🎁"},
            {name = "Bonus", description = "Bonus income", icon = "✨"}
        }
        
        for i, cat in ipairs(incomeCategories) do
            local categoryId = GenerateCatergoryId()
            UsersTable[user].catergories[categoryId] = {
                id = categoryId,
                name = cat.name,
                description = cat.description,
                icon = cat.icon,
                createdTime = os.time() * 1000,
                type = "Income"
            }
        end
        
        SendSuccess(user, "10 mock categories added successfully (5 expense, 5 income)")
    end
)







