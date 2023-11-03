import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwIfEmpty } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{
 products:Product[]=[];
 currentCategoryId:number=1;
 searchMode: boolean = false;
 thePageNo:number=1;
 thePageSize:number=5;
 theTotalElements:number=0;
  previousCatgeroyId!: number;
  thepreviousKeyword:string="";
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProduct();
    })
    
    //throw new Error('Method not implemented.');
  }
  constructor (private productService:ProductService,private cartService:CartService, private route:ActivatedRoute){}
listProduct(){
  this.searchMode=this.route.snapshot.paramMap.has('keyword');
  if(this.searchMode){
this.handleSearchProducts();
  }else{
    this.handleListProduct();
  }
 
}
handleSearchProducts(){
  const theKeyword:string=this.route.snapshot.paramMap.get('keyword')!;
  if(this.thepreviousKeyword !== theKeyword){
    this.thePageNo=1;
  }
  this.thepreviousKeyword=theKeyword;
  this.productService.searchProductsPaginate(this.thePageNo -1,
    this.thePageSize,theKeyword).subscribe( data=>{
      this.products=data._embedded.products;
      this.thePageNo=data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;
  })
}
handleListProduct(){
  const hasCategoryId:boolean=this.route.snapshot.paramMap.has('id')
  if(hasCategoryId){
    this.currentCategoryId=+this.route.snapshot.paramMap.get('id')!;
  }
  if (this.previousCatgeroyId !== this.currentCategoryId){
    this.thePageNo=1;
  }
  this.previousCatgeroyId=this.currentCategoryId;
  this.productService.getProductListPaginate(this.thePageNo -1,
    this.thePageSize,
    this.currentCategoryId).subscribe(
    data=>{
      this.products=data._embedded.products;
      this.thePageNo=data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;

    }
  )

}
updatePageSize(pageSize:String){
  this.thePageSize=+pageSize;
  this.thePageNo=1;
  this.listProduct();

}
addtoCartItem(theProduct: Product){
  console.log(`${theProduct.name}: ${theProduct.unit_price}`)
const theCartItem= new CartItem(theProduct);
this.cartService.addToCart(theCartItem); 
}
}
