import express from 'express'
import prodRouter from '../routers/router_products.js'
import cartRouter from '../routers/router_carts.js'
const PORT = 8080

const app = express()

app.use(express.json())
app.use('/static', express.static('public'))
//app.use(express.urlencoded({extended:true}))

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const uploader = multer({storage})

app.post('/', uploader.single('file'), (req, res)  => {
    if(!req.file){
        return res.status(400).send({status: 'error', error: 'No file'})
    }else{
        res.send('File uploaded')}
})

app.get('/',  (req, res)  => {
    res.send('¡Bienvenido a mi aplicación Express!');
})

app.use('/api/products', prodRouter)
app.use('/api/carts', cartRouter )

app.listen(PORT, ()=>{
    console.log('El servidor esta corriendo')
})