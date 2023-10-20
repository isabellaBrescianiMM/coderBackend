import fs from 'fs'


export default class CartManager2 {
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

    async getCarts() {
        const data = await this.read();
        return data;
    }
    async addCart() {
        try{
            const carts = await this.getCarts()
            const new_cart = {
                id: this.getNextID(carts),
                products: []
            }
            carts.push(new_cart)
            await this.write(carts)
        }catch{
            throw new Error('Problema agregando carrito!')
        }
    }

    async getCartProductsById(id) {
        const list = await this.read();
        const cart = list.find(cart => cart.id == id);
        if (cart) {
            return cart.products;
        } else {
            throw new Error('Carrito no encontrado');
        }
    }

   
    async addProduct(cart_id, obj, getProductById) {
        try{
            const list = await this.read();

            //validar que te lleguen todos los parámetros esperados en addProducts
            if (!obj.id || !obj.quantity) {
                throw new Error('Faltan parámetros en el objeto del producto');
            }
            // Find the index of the product with the matching "id."
            const  cart_index = list.findIndex( cart => cart.id == cart_id);

            

            if (cart_index !== -1) {
 
                //que el produto exista en la base
                getProductById(obj.id)

                const existingProductIndex = list[cart_index].products.findIndex(product => product.id == obj.id);
               
                if (existingProductIndex !== -1) {
                    // Si el producto ya está en el carrito, aumenta la cantidad.
                    list[cart_index].products[existingProductIndex].quantity += obj.quantity;
                    console.log("Cantidad actualizada en el carrito.");
                  } else {
                    // Si el producto no está en el carrito, la agrega.
                    const newProd = {
                        "id": obj.id,
                        "quantity": obj.quantity
                    }

                    list[cart_index].products.push(newProd)

                    console.log("Product added successfully.");
            }
            } else {
                console.log("Cart not found.");
            }

             // Escribe los cambios en el JSON
            if(list[cart_index].products > 0){
                await this.write(list);
                console.log(`Producto ${obj.id} Agregado con Exito`)
            }

        }catch{
            console.log(`Producto ${obj.id} no se pudo agregar al carrito ${cart_id}`)
        }
    
    }

    async updateProduct(id, updatedProduct) {
        const list = await this.read();
        const index = list.findIndex(product => product.id === id);
        
        if (index !== -1) {
            //validar que lleguen solo props del producto
            const allowedProps = ['id', 'title', 'description', 'price', 'thumbnail', 'code', 'stock'];
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
            updatedProduct.id = id
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

    
}