import express from 'express'


const app = express()

app.get('/', (req, res) => {
    return(res.json({message: 'Hello World'}))
})

app.post('/courses', (req, res) => {
    const {name} = req.body
    return res.json({message: `Hello ${name}`})
})

app.listen(3333, () => console.log('Server started on port 3333!'))