import express from 'express'
import prodRouter from './routers/router_products.js'
import cartRouter from './routers/router_carts.js'

const PORT = 8080

const app = express()

app.use(express.json())
app.use('/static', express.static('public'))


app.get('/',  (req, res)  => {
    res.send('¡Bienvenido a mi aplicación Express!');
})

app.use('/api/products', prodRouter)
app.use('/api/carts', cartRouter )

app.listen(PORT, ()=>{
    console.log('El servidor esta corriendo')
})