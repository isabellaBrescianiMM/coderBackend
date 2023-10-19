import {Router} from 'express'
import ProductManager from '../utils/productManager.js'

const router = Router()
const productManager = new ProductManager('./routers/data/productos.json')

router.get('/', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      res.status(200).json(products);
    } catch (error) {
      message = 
      res.status(400).json({ error: error.message});
    }
  });

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const product = await productManager.getProductById(id);
        console.log(product);
        res.status(200).json(product);
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message});
      }
    res.json(products[id])
})

router.post('/', async  (req, res) => {
    try {
      const prod = req.body
      const products = await productManager.getProducts();
      await productManager.addProduct(prod)
      res.status(200).send({status: "Aproveed", message:"Product added succesfuly!"})}
    catch (error){
      res.status(400).json({ error: error.message});
    }
})

router.put('/', async (req,resp)=>{
    const prod = req.body
    const products = await productManager.getProducts();
    const idx = products.findIndex(u => u.title.toLowerCase() == prod.title.toLowerCase())
    if (idx <0){
        return resp.status(404).json({status: "Error", error: "Product not found"})
    }
    await productManager.updateProduct(idx,  prod ) 
    resp.send({status:'success', message:'Producto modificado!'})
})


router.delete('/:pid', async (req,resp)=>{
    try{
        const id = req.params.pid
        await productManager.deleteProduct(id)
        resp.status(200).send({status:'Success', message:'Producto eliminado con exito!'})
    }catch (error){
        resp.status(500).json({ error: error.message});
    }
    
})

export default router