

export default class CartManager{
    constructor (){
        this.cart = []
    }
    getElementById = (id)=>{
        let elem
        this.cart.forEach(element => {
            if(element.id == id){
                elem = element
            }else{
                console.log("El elemento no fue encontrado")
            }
        })
        return elem
    }

    getCarts = () => {return this.cart}
    getNextID = () =>{
        const count = this.cart.length
        return (count>0) ? this.cart[count-1].id + 1 : 1
    }
    addCart = (prod) => {
        const count = this.cart.length
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
    
                    this.cart.push(cart_single);
            }
            if(sigue==1){
                const id = this.getNextID();
                    const cart_single = {
                        id,
                        products
                    }
                    this.cart.push(cart_single);
            }
        }   
    }

