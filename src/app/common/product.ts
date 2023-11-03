export class Product {
    constructor (
        public id:string,
        public sku:string,
        public name:string,
        public description:string,
        public unit_price:number,
        public image_url:string,
        public active:boolean,
        public units_in_stock:number,
        public dateCreated:Date,
        public lastUpdated:Date){


    }
}
