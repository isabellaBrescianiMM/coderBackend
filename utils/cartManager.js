

export default class CartManager{
    constructor (){
        this.carts = []
    }
    async getElementById(id){
        let elem
        this.carts.forEach(element => {
            if(element.id == id){
                elem = element
            }else{
                console.log("El elemento no fue encontrado")
            }
        })
        return elem
    }

    async getCarts (){
        return this.carts
    }
    async getNextID(){
        const count = this.carts.length
        return (count>0) ? this.carts[count-1].id + 1 : 1
    }
    async addCart(prod){
        const count = this.carts.length
        let sigue =0;
        if(count>0) {
            this.products.forEach(element => {
                if(element.code != code){
                    sigue =1;
                }else{
                    console.log("El codigo ingresado ya pertenece a otro producto");
                }})
            }else{
                const id = this.getNextID();
                    const cart_single = {
                        id,
                        products
                    }
    
                    this.carts.push(cart_single);
            }
            if(sigue==1){
                const id = this.getNextID();
                    const cart_single = {
                        id,
                        products
                    }
                    this.carts.push(cart_single);
            }
        }   
    }

