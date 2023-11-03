import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Product } from '../common/product';
import { Observable, map } from 'rxjs';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
 
  private baseUrl=environment.apkshopApiUrl+'/products'
  
  private categoryUrl=environment.apkshopApiUrl+'/product-category'
  constructor(private httpClient:HttpClient) { }
  searchProducts(theKeyword: string):Observable<Product[]> {
    const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
      return this.getProducts(searchUrl);
    }
    searchProductsPaginate(thePageNo:number,
      thePageSize:number,theKeyword: string):Observable<GetResposeProduct> {
      const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`+`&page=${thePageNo}&size=${thePageSize}`;
      return this.httpClient.get<GetResposeProduct>(searchUrl);
      }
    getProductListPaginate(thePageNo:number,
      thePageSize:number,
      theCategoryId:number):Observable<GetResposeProduct>{
      const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`+`&page=${thePageNo}&size=${thePageSize}`;
      return this.httpClient.get<GetResposeProduct>(searchUrl);
    }
  getProductList(theCategoryId:number):Observable<Product[]>{
    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl)
  }
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResposeProduct>(searchUrl).pipe(map(response => response._embedded.products));
  }
  getProduct(prodId: number):Observable<Product>  {
    const prodUrl=`${this.baseUrl}/${prodId}`;
    return this.httpClient.get<Product>(prodUrl);
   
  }


  getProductCategories():Observable<ProductCategory[]> {
return this.httpClient.get<GetResposeProductCategory>(this.categoryUrl).pipe(map(response =>response._embedded.productCategory))  }
}

interface GetResposeProduct{
  _embedded:{
    products:Product[];
  }
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}
interface GetResposeProductCategory{
  _embedded:{
    productCategory:ProductCategory[];
  }
}