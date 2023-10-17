import {Router} from 'express'
import ProductManager from '../utils/productManager.js'

const router = Router()
const productManager = new ProductManager('./data/productos.json')

router.get('/', async (req, res) => {
    try {
      const products = await productManager.getProducts();
      console.log(products);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
  });

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const product = await productManager.getProductById(id);
        console.log(product);
        res.json(product);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching product.' });
      }
    res.json(products[id])
})

router.post('/', async  (req, res) => {
    try {
    const prod = req.body
    await products.addProduct(prod)
    res.send({status: "aproveed", message:"Product added succesfuly!"})}
    catch (error){
        res.status(500).json({ error: 'An error occurred while adding product.' });
    }
})

router.put('/', async (req,resp)=>{
    const prod = req.body
    const products = await productManager.getProducts();
    const idx = products.findIndex(u => u.title.toLowerCase() == prod.title.toLowerCase())
    if (idx <0){
        return resp.status(404).json({status: "Error", error: "User not found"})
    }
    await updateProduct(idx,  prod ) 
    resp.send({status:'success', message:'Usuario modificado!'})
})


router.delete('/:pid', async (req,resp)=>{
    try{
        const id = req.params.pid
        await deleteProduct(id)
        resp.send({status:'success', message:'Usuario eliminado con exito!'})
    }catch{
        resp.status(500).json({ error: 'An error occurred while deleting product.' });
    }
    
})

export default router