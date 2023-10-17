import {Router} from 'express'
import ProductManager from '../utils/productManager.js'

const router = Router()
const products = new ProductManager('../data/productos.json')

router.get('/', (req, res) => {
    res.json(products)
})

router.get('/:pid', (req, res) => {
    const id = req.params.pid
    res.json(products[id])
})

router.post('/', (req, res) => {
    const prod = req.body
    products.addProduct(prod.title, prod.description, prod.price,prod.thumbnail,prod.code,prod.stock)
    res.send({status: "aproveed", message:"Product added succesfuly!"})
})

router.put('/', (req,resp)=>{
    const prod = req.body
    const idx = products.findIndex(u => u.title.toLowerCase() == prod.title.toLowerCase())
    if (idx <0){
        return resp.status(404).json({status: "Error", error: "User not found"})
    }
    products[idx]= prod 
    resp.send({status:'success', message:'Usuario modificado!'})
})


router.delete('/:pid', (req,resp)=>{
    const id = req.params.pid
    
    const length = products.length
    products = products.filter(u => u.id != id)
    if(length == products.length){
        return resp.send({status: "Error", error: "User not found"})
    }
    resp.send({status:'success', message:'Usuario eliminado con exito!'})
})

export default router