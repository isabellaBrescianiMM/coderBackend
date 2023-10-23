import {Router} from 'express'
import CartManager from '../utils/cartManager.js'
import path from 'path'
import { fileURLToPath } from 'url'
import {dirname} from 'path'

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename )
const router = Router()
const carts = new CartManager(path.join(_dirname, './data/carrito.json'))



router.post('/', async (req, res) => {
    try{
        const new_cart = await carts.addCart()
        res.status(200).json(new_cart)
    }catch(err){
        message = res.status(400).json({ error: err.message});
    }
})

router.get('/:cid',  async (req, res) => {
    try{
    const id = req.params.cid
    const prods = await  carts.getCartProductsById(id)
    res.status(200).json(prods)

    }catch(err){
        message = res.status(400).json({ error: err.message});
    }
})



router.post('/:cid/product/:pid', async (req,resp)=>{
    try{
        const cart_id = req.params.cid
        const prod_id = req.params.pid
        await carts.addProduct(cart_id,  prod_id)
        resp.send({status:'success', message:'Producto agregado!'})
    }catch(err){
        message = res.status(400).json({ error: err.message});
    }
})



export default router