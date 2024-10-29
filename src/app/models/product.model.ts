import { FormGroup } from "@angular/forms";
import { Movement } from "./movement.model";

export interface Product {
    id?: number;
    name?: string;
    quantity?: number;
    quantityAudited?: number;
    movement?: Movement;
    codProduct?: number;
    addQuantityAudited?: number;
  }

  export class Product implements Product {
    constructor(
      public id?: number,
      public name?: string,
      public quantity?: number,
      public quantityAudited?: number,
      public movement?: Movement,
      public codProduct?: number,
      public addQuantityAudited?: number
    ) { }
  }

