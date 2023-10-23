import fs from 'fs'


export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getNextID(list = undefined) {
        if(list){
            return list.length > 0 ? list[list.length - 1].id + 1 : 1;
        }else{
            const list = await this.read();
            return list.length > 0 ? list[list.length - 1].id + 1 : 1;
        }
        
    }

    async read() {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } else {
            throw new Error('file does not exist: ' + this.path);
        }
    }

    async write(list) {
        await fs.promises.writeFile(this.path, JSON.stringify(list, null, 2));
    }

    async getProducts() {
        const data = await this.read();
        return data;
    }

    async addProduct(obj) {
         /*La ruta raíz POST / deberá agregar un nuevo producto 
         id:autogenerado 
         title:String,
- description:String
- code:String
- price:Number
- status:Boolean Status es true por defecto
- stock:Number
- category:String
- thumbnails:Array de Strings
que contenga las rutas
donde están almacenadas
las imágenes referentes a
dicho producto */

        const list = await this.read();

        //validar que te lleguen todos los parámetros esperados en addProducts
        //Todos los campos son obligatorios, a excepción de thumbnails
        if (!obj.title || !obj.description  || !obj.category  || !obj.price || !obj.code || obj.status == true || obj.stock === undefined) {
            throw new Error('Faltan parámetros en el objeto del producto');
        }
        
        //que no se repita un code
        if (list.some(product => product.code === obj.code)) {
            throw new Error('El código del producto ya existe');
        }

        const nextID = await this.getNextID(list);

        obj.id = nextID;

        list.push(obj);

        if(list.length > 0){
            await this.write(list);
            console.log(`Producto ${obj.title} Agregado con Exito`)
        }
        
        return obj;
    }

    async updateProduct(id, updatedProduct) {
        const list = await this.read();
        const index = list.findIndex(product => product.id == id);
        
        if (index !== -1) {
            //validar que lleguen solo props del producto
            const allowedProps = ['id', 'title', 'description', 'price','category','status', 'thumbnail', 'code', 'stock'];
            const updatedProps = Object.keys(updatedProduct);
            const invalidProps = updatedProps.filter(prop => !allowedProps.includes(prop));

            if (invalidProps.length > 0) {
                throw new Error(`Propiedades no válidas en el objeto de producto`);
            }

            
            //que no se pueda repetir el ID ni poner un CODE que ya exista
            const existingProductWithCode = list.find(product => product.code === updatedProduct.code && product.id !== id);
       
            if (existingProductWithCode) {
                throw new Error('El código del producto ya existe');
            }
            updatedProduct.id =  parseInt(id)
            list[index] = { ...list[index], ...updatedProduct };

            if (list.length > 0) { 
                await this.write(list);
                console.log(`Producto ${updatedProduct.title} Actualizado con Éxito`);
            }
        } else {
            throw new Error('Producto no encontrado');
        }
    }

    async deleteProduct(id) {
        const list = await this.read();
        const index = list.findIndex(product => product.id == id);
        if (index !== -1) {
            const prod = list[index]
            list.splice(index, 1);
            await this.write(list);
            console.log(`Producto ${prod.title} Eliminado con Éxito`);
        } else {
            throw new Error('Producto no encontrado');
        }
    }

    async getProductById(id) {
        const list = await this.read();
        const product = list.find(product => product.id == id);
   
        if (product) {
            return product;
        } else {
            throw new Error('Producto no encontrado');
        }
    }
}