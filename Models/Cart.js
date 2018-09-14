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
    this.generateArray = function(){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};