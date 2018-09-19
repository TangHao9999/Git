module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalAmount = oldCart.totalAmount || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, amount: 0, price: 0};
        }
        storedItem.amount++;
        storedItem.price = storedItem.item.price * storedItem.amount;
        this.totalAmount++;
        this.totalPrice += storedItem.item.price; 
    }
    this.reduceByOne = function(id){
        this.items[id].amount--;
        this.items[id].price -= this.items[id].item.price;
        this.totalAmount--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].amount <= 0){
            delete this.items[id];
        }
    }
    this.removeItem = function(id){
        this.totalAmount -= this.items[id].amount;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }
    this.generateArray = function(){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};