import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems:CartItem[]=[];
  totalPrice:Subject<number>=new BehaviorSubject<number>(0);
  totalQuantity:Subject<number>=new BehaviorSubject<number>(0);
  storage:Storage=localStorage;
  constructor() { 
    let data=JSON.parse(this.storage.getItem("cartItems")!);
    if(data!=null){
      this.cartItems=data;
      this.computeTotal();
    }
  }
  addToCart(theCartItem:CartItem){
    let alreadyExists:boolean=false;
    let existingCartItem!:CartItem;
    if(this.cartItems.length>0){
      // for(let tempCartItems of this.cartItems){
      //   if(tempCartItems.id=== theCartItem.id){
      //     existingCartItem=tempCartItems;
      //     break;
      //   }
      // }
      existingCartItem=this.cartItems.find(tempCartItem=>tempCartItem.id===theCartItem.id)!;
      alreadyExists=(existingCartItem!=undefined);

    }
    if(alreadyExists){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem);
    }
    this.computeTotal();
  }
  presistCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems))
  }
  computeTotal() {
let totalPriceVale:number=0;
let totalQuantityVale:number=0;
 for(let currentCartItem of this.cartItems){
  totalPriceVale+=currentCartItem.quantity* currentCartItem.unit_price;
  totalQuantityVale+=currentCartItem.quantity;
 }
this.totalPrice.next(totalPriceVale);
this.totalQuantity.next(totalQuantityVale);
this.presistCartItems();
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity==0){
      this.remove(theCartItem);
    }else{
      this.computeTotal();
    }
  }
  remove(theCartItem: CartItem) {
   const itemIndex=this.cartItems.findIndex(tempCartItem=>tempCartItem.id===theCartItem.id)
   if(itemIndex>-1){
    this.cartItems.splice(itemIndex,1);
    this.computeTotal();
   }
  }
}
