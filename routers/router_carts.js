import {Router} from 'express'
import CartManager from '../utils/cartManager.js'


const router = Router()
const carts = new CartManager()



router.get('/:cid', (req, res) => {
    const id = req.params.cid
    res.json(carts[id])
})

router.post('/', (req, res) => {
    const prod = req.body
    carts.addCart(prod)
    res.send({status: "aproveed", message:"Cart added succesfuly!"})
})

router.post('/:cid/product/:pid', (req,resp)=>{
    const prod = req.body
    const idx = carts.findIndex(u => u.title.toLowerCase() == prod.title.toLowerCase())
    if (idx <0){
        return resp.status(404).json({status: "Error", error: "User not found"})
    }
    carts[idx]= prod 
    resp.send({status:'success', message:'Usuario modificado!'})
})




export default router