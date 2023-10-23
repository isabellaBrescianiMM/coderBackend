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
            let nextLink = await this.getNextID()
            const new_cart = {
                id: nextLink,
                products: []
            }
            carts.push(new_cart)
            await this.write(carts)
            return new_cart
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

   
    async addProduct(cart_id, prod_id) {
        try{
            const list = await this.read();

         
            // Find the index of the product with the matching "id."
            const  cart_index = list.findIndex( cart => cart.id == cart_id);

            

            if (cart_index !== -1) {
 
             
                const existingProductIndex = list[cart_index].products.findIndex(product => product.id == prod_id);
               
                if (existingProductIndex !== -1) {
                    // Si el producto ya está en el carrito, aumenta la cantidad.
                    list[cart_index].products[existingProductIndex].quantity += 1;
                    console.log("Cantidad actualizada en el carrito.");
                  } else {
                    // Si el producto no está en el carrito, la agrega.
                    const newProd = {
                        "id": prod_id,
                        "quantity": 1
                    }

                    list[cart_index].products.push(newProd)
                   
                    console.log("Product added successfully.");
            }
            } else {
                console.log("Cart not found.");
            }
     
             // Escribe los cambios en el JSON
            if(list[cart_index].products.length > 0){
                await this.write(list);
                console.log(`Producto ${prod_id} Agregado con Exito`)
            }

        }catch{
            console.log(`Producto ${prod_id} no se pudo agregar al carrito ${cart_id}`)
        }
    
    }



    
}