import { ɵwithHttpTransferCache } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent  implements OnInit{
  product!: Product;
 
  constructor(private productservice:ProductService,
    private cartService:CartService,
    private route:ActivatedRoute){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handlePructDetails();
    })
  }
  handlePructDetails(){
    const prodId:number=+this.route.snapshot.paramMap.get('id')!;
  this.productservice.getProduct(prodId).subscribe(data=>{
this.product=data;
  })
  }
  addtoCartItem(theProduct: Product){
    console.log(`${theProduct.name}: ${theProduct.unit_price}`)
  const theCartItem= new CartItem(theProduct);
  this.cartService.addToCart(theCartItem); 
  }

}
