import { Target } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApkValidators } from 'src/app/common/apk-validators';
import { Country } from 'src/app/common/country';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { ApkShopFormService } from 'src/app/services/apk-shop-form.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  totalPrice:number=0;
  totalQuantity:number=0;
  creditCardYears:number[]=[];
  creditCardMonths:number[]=[];
  checkoutFormGroup!: FormGroup;
  countries:Country[]=[];
  shippingAddressState:State[]=[];
  billingAddressState:State[]=[];
  stripe=Stripe(environment.stripePublishableKey);
  paymentInfo:PaymentInfo=new PaymentInfo();
  cardElement:any;
  displayError:any="";
  constructor(private formBuilder:FormBuilder, 
    private apkService:ApkShopFormService, 
    private cartService:CartService,
     private checkoutService:CheckoutService, 
     private router:Router){    
    
  }
  ngOnInit(): void {
    this.setupStripePAymentForm();
    this.cartService.totalPrice.subscribe(data=> this.totalPrice=data);
    this.cartService.totalQuantity.subscribe(data=>this.totalQuantity=data);
 this.checkoutFormGroup=this.formBuilder.group({
  customer:this.formBuilder.group({
    firstName:new FormControl('',[Validators.required,Validators.minLength(2),ApkValidators.notOnlyWhiteSpaces]),
    lastName:new FormControl('',[Validators.required,Validators.minLength(2),ApkValidators.notOnlyWhiteSpaces]),
    email:new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),ApkValidators.notOnlyWhiteSpaces])
  }),
  shippingAddress:this.formBuilder.group({
    country:new FormControl('',[Validators.required]),
    street:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces]),
    city:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces]),
    state:new FormControl('',[Validators.required]),
    zipCode:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces]),
  }),
  billingAddress:this.formBuilder.group({
    country:new FormControl('',[Validators.required]),
    street:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces]),
    city:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces]),
    state:new FormControl('',[Validators.required]),
    zipCode:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces]),
  // }),creditCard:this.formBuilder.group({
  //   cardType:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces]),
  //   nameOnCard:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces,Validators.minLength(2)]),
  //   cardNumber:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces,Validators.pattern('[0-9]{16}')]),
  //   securityCode:new FormControl('',[Validators.required,ApkValidators.notOnlyWhiteSpaces,Validators.pattern('[0-9]{3}')]),
  //   expirationMonth:[''],
  //   expirationYear:['']
   })
 })
//  const startMonth:number=new Date().getMonth()+1;
//  this.apkService.getCreditCardMonths(startMonth).subscribe(data=>{this.creditCardMonths=data;}

//  )
//  this.apkService.getCreditCardYears().subscribe(data=>{this.creditCardYears=data;}

//  )
 this.apkService.getCountries().subscribe(data=>{this.countries=data})
  }
  setupStripePAymentForm() {
    var elements=this.stripe.elements();
    this.cardElement=elements.create('card',{hidePostalCode:true});
    this.cardElement.mount('#card-elements');
    this.cardElement.on('change',(event:any)=>{
      this.displayError=document.getElementById('card-errors');
      
      if(event.complete){
        this.displayError.textContent="";
      }
      else if (event.error){
        this.displayError.textContent=event.error.message;
      }
    })

 
  }
  get firstName(){ return this.checkoutFormGroup.get("customer.firstName")}
  get lastName(){ return this.checkoutFormGroup.get("customer.lastName")}
  get email(){ return this.checkoutFormGroup.get("customer.email")}
  get shippingAddressCountry(){ return this.checkoutFormGroup.get("shippingAddress.country")}
  get shippingAddressStreet(){ return this.checkoutFormGroup.get("shippingAddress.street")}
  get shippingAddressStates(){ return this.checkoutFormGroup.get("shippingAddress.state")}
  get shippingAddressCity(){ return this.checkoutFormGroup.get("shippingAddress.city")}
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get("shippingAddress.zipCode")}
  get billingAddressCountry(){ return this.checkoutFormGroup.get("billingAddress.country")}
  get billingAddressStreet(){ return this.checkoutFormGroup.get("billingAddress.street")}
  get billingAddressStates(){ return this.checkoutFormGroup.get("billingAddress.state")}
  get billingAddressCity(){ return this.checkoutFormGroup.get("billingAddress.city")}
  get billingAddressZipCode(){ return this.checkoutFormGroup.get("billingAddress.zipCode")}
  get cardType(){ return this.checkoutFormGroup.get("creditCard.cardType")}
  get nameOnCard(){ return this.checkoutFormGroup.get("creditCard.nameOnCard")}
  get cardNumber(){ return this.checkoutFormGroup.get("creditCard.cardNumber")}
  get securityCode(){ return this.checkoutFormGroup.get("creditCard.securityCode")}
  copyShippingtoBilling(event:Event){
    if((event.target as HTMLInputElement).checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
      this.billingAddressState=this.shippingAddressState;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressState=[];
    }
  }
  handleMonthsAndYears(){
    const creditCardFormGroup=this.checkoutFormGroup.get('creditCard');
    const currentYear:number=new Date().getFullYear();
    const selectedYear:number=Number(creditCardFormGroup?.value.expirationYear);
    let startMonth:number;
    if(currentYear==selectedYear){
      startMonth=new Date().getMonth()+1;
    }else{
      startMonth=1;
    }
    this.apkService.getCreditCardMonths(startMonth).subscribe(data=>{
      this.creditCardMonths=data;
    })
  }
  OnSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    let order=new Order();
    order.totalPrice=this.totalPrice;
    order.totalQuantity=this.totalQuantity;
    const cartItems=this.cartService.cartItems;
    let orderItems:OrderItem[]=cartItems.map(tempCarItem=> new OrderItem(tempCarItem));
let purchase=new Purchase();
purchase.customer=this.checkoutFormGroup.controls['customer'].value;
purchase.shippingAddress=this.checkoutFormGroup.controls['shippingAddress'].value;
const shippingState:State=JSON.parse(JSON.stringify(purchase.shippingAddress.state));
const shippingCountry:Country=JSON.parse(JSON.stringify(purchase.shippingAddress.country));
purchase.shippingAddress.state=shippingState.name;
purchase.shippingAddress.country=shippingCountry.name;
purchase.billingAddress=this.checkoutFormGroup.controls['billingAddress'].value;
const billingState:State=JSON.parse(JSON.stringify(purchase.billingAddress.state));
const billingCountry:Country=JSON.parse(JSON.stringify(purchase.billingAddress.country));
purchase.billingAddress.state=billingState.name;
purchase.billingAddress.country=billingCountry.name;
purchase.order=order;
purchase.orderItems=orderItems;
this.paymentInfo.amount=this.totalPrice*100;
this.paymentInfo.currency="USD";
this.paymentInfo.receiptEmail=purchase.customer.email;
// this.checkoutService.placeOrder(purchase).subscribe({
//   next:response=>{
//     alert(`Your order has been recived.\nOrder tracking number:${response.orderTrackingNumber}`);
//     this.restCart();
//   },
//   error:err=>{
//     alert(`There was an error:${err.message}`)
//   }
  
  
// })
if(!this.checkoutFormGroup.invalid&& this.displayError.textContent===""){
  this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
    (paymentIntentResponse)=>{
this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,{
  payment_method:{
    card:this.cardElement,
    billing_details:{
      email:purchase.customer.email,
      name:`${purchase.customer.firstName} ${purchase.customer.lastName}`,
      address:{
        line1:purchase.billingAddress.street,
        city:purchase.billingAddress.city,
        state:purchase.billingAddress.state,
        postal_code:purchase.billingAddress.zipCode,
        country:this.billingAddressCountry?.value.code
      }
    }
  }
},{handleActions:false}).then((result:any)=>{
  if(result.error){
    alert(`there was an error:${result.error.message}`);
  }else{
    this.checkoutService.placeOrder(purchase).subscribe({
  next:response=>{
    alert(`Your order has been recived.\nOrder tracking number:${response.orderTrackingNumber}`);
    this.restCart();
  },
  error:err=>{
    alert(`There was an error:${err.message}`)
  }
  
})
    }
  }

  )
})
} else{
  this.checkoutFormGroup.markAllAsTouched();
  return;

}
  }  

  restCart() {
  this.cartService.cartItems=[];
  this.cartService.totalPrice.next(0);
  this.cartService.totalQuantity.next(0);
  this.checkoutFormGroup.reset();
  this.cartService.presistCartItems();
  this.router.navigateByUrl("/products");
  }
  getStates(formGroupName:string){
    const formGroup=this.checkoutFormGroup.get(formGroupName);
    const countryCode=formGroup?.value.country.code;
    const countryName=formGroup?.value.country.name;
    this.apkService.getStates(countryCode).subscribe(data=>{
      if(formGroupName==='shippingAddress'){
        this.shippingAddressState=data;
      }else{
        this.billingAddressState=data;
      }
     // formGroup?.get('state')?.setValue(data[0]);
    })

  }
}
