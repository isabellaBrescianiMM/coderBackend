import fs from 'fs'


export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getNextID(list) {
        return list.length > 0 ? list[list.length - 1].id + 1 : 1;
    }

    async read() {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } else {
            return [];
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
        const list = await this.read();

        
        if (!obj.title || !obj.description || !obj.price || !obj.thumbnail || !obj.code || obj.stock === undefined) {
            throw new Error('Faltan parámetros en el objeto del producto');
        }

        if (list.some(product => product.code === obj.code)) {
            throw new Error('El código del producto ya existe');
        }

        const nextID = await this.getNextID(list);
        obj.id = nextID;
        list.push(obj);
        await this.write(list);
        return obj;
    }

    async updateProduct(id, updatedProduct) {
        const list = await this.read();
        const index = list.findIndex(product => product.id === id);

        if (index !== -1) {
            
            const allowedProps = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
            const updatedProps = Object.keys(updatedProduct);

  
            const invalidProps = updatedProps.filter(prop => !allowedProps.includes(prop));

            if (invalidProps.length > 0) {
                throw new Error('Propiedades no válidas en el objeto de producto');
            }

     
            const existingProductWithCode = list.find(product => product.code === updatedProduct.code && product.id !== id);

            if (existingProductWithCode) {
                throw new Error('El código del producto ya existe');
            }

            list[index] = { ...list[index], ...updatedProduct };

            await this.write(list);
        } else {
            throw new Error('Producto no encontrado');
        }
    }

    async deleteProduct(id) {
        const list = await this.read();
        const index = list.findIndex(product => product.id === id);
        if (index !== -1) {
            list.splice(index, 1);
            await this.write(list);
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


