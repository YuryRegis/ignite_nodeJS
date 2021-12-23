const express = require('express')
const {v4: uuidv4} = require('uuid')


const app = express()
const customers = []    

// Middlewares
app.use(express.json())

function verifyExistisAccount(request, response, next) {
    const {cpf} = request.headers
    const customer = customers.find(customer => customer.cpf === cpf)
    
    if(!customer) 
        return response.status(404).json({error: 'Customer not found'})
    
    request.customer = customer
    return next()
}


// localhost:33333/
app.listen(3333)


app.get('/statement', verifyExistisAccount, (request, response) => {
   
    const {customer} = request
    
    return response.status(200).json(customer.statement)
})


app.get('/statement/date', verifyExistisAccount, (request, response) => {
    const {customer} = request
    const { date } = request.query
    const dateFormated = new Date(date + " 00:00")
    const statement = customer.statement.filter(operation => operation.createdAt.toDateString() === new Date(dateFormated).toDateString())
    return response.status(200).json({statement})
})


app.get('/account', verifyExistisAccount, (request, response) => {
    const {customer} = request
    return response.status(200).json({customer})
})


app.post('/account', (request, response) => {
    const id = uuidv4()
    const {cpf, name} = request.body

    const customerAlreadyExists = customers.some(customer => customer.cpf === cpf)

    if (customerAlreadyExists) {
      return response.status(400).json({error: 'Customer already created'}) 
    }
    customers.push({id, cpf, name, statement: []})
    return response.status(201).send()
})


app.post('/deposit', verifyExistisAccount, (request, response) => {
    const {description, amount} = request.body
    const {customer} = request

    const statementOperation = {
        description,
        amount,
        createdAt: new Date(),
        type: 'credit'
    }

    customer.statement.push(statementOperation)
    return response.status(201).send()
})


app.post('/withdraw', verifyExistisAccount, (request, response) => {
    const { amount } = request.body
    const {customer} = request

    const balance = getBalance(customer.statement)

    if (balance < amount) {
        return response.status(400).json({error: 'Insufficient balance'})
    }

    const statementOperation = {
        amount,
        createdAt: new Date(),
        type: 'credit'
    }

    customer.statement.push(statementOperation)
    return response.status(201).send()
})


app.put('/account', verifyExistisAccount, (request, response) => {
    const { name } = request.body
    const { customer } = request

    customer.name = name

    return response.status(200).send()
})


app.patch('/courses/:id', (request, response) => {})


app.delete('/account', verifyExistisAccount, (request, response) => {
    const { customer } = request

    customers.splice(customer, 1)

    return response.status(200).send(customers)
})


function getBalance(statement) {
    return statement.reduce((balance, operation) => {
        if(operation.type === 'credit')
            return balance += operation.amount
        return balance -= operation.amount
    },0)
}