import {Router} from 'express'
import ProductManager from '../utils/productManager.js'
import path from 'path'
import { fileURLToPath } from 'url'
import {dirname} from 'path'

const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename )
const router = Router()
const productManager = new ProductManager(path.join(_dirname, './data/productos.json'))

router.get('/', async (req, res) => {
  /*La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior*/
  try {
    let limit = parseInt(req.query.limit) || 0; 
    let products = await productManager.getProducts();

    if (limit > 0) {
      products = products.slice(0, limit);
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/:pid', async (req, res) => {
  /*La ruta GET /:pid deberá traer sólo el producto con el id proporcionado*/
    try {
        const id = req.params.pid
        const product = await productManager.getProductById(id);
        console.log(product);
        res.status(200).json(product);
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message});
      }
   
})

router.post('/', async  (req, res) => {
  /*La ruta raíz POST / deberá agregar un nuevo producto id:autogenerado title:String,
- description:String
- code:String
- price:Number
- status:Boolean
- stock:Number
- category:String
- thumbnails:Array de Strings
que contenga las rutas
donde están almacenadas
las imágenes referentes a
dicho producto */
    try {
      const prod = req.body
      const products = await productManager.getProducts();
      await productManager.addProduct(prod)
      res.status(200).send({status: "Aproveed", message:"Product added succesfuly!"})}
    catch (error){
      res.status(400).json({ error: error.message});
    }
})

router.put('/:pid', async (req,resp)=>{
  /*La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe
actualizar o eliminar el id al momento de hacer dicha actualización.*/
  try{
    const id = req.params.pid
    const prod = req.body
    await productManager.updateProduct(id,  prod ) 
    resp.send({status:'success', message:'Producto modificado!'})
  }catch (error){
    resp.status(400).json({ error: error.message});
  }
    
})


router.delete('/:pid', async (req,resp)=>{
  /*La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. */
    try{
        const id = req.params.pid
        await productManager.deleteProduct(id)
        resp.status(200).send({status:'Success', message:'Producto eliminado con exito!'})
    }catch (error){
        resp.status(500).json({ error: error.message});
    }
    
})

export default router