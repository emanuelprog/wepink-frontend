import { FormGroup } from "@angular/forms";

export interface Product {
    id?: number;
    name?: string;
    quantity?: number;
    changeDate?: Date;
    image?: string;
    addQuantity?: number;
    subtractQuantity?: number;
  }

  export class Product implements Product {
    constructor(
      public id?: number,
      public name?: string,
      public quantity?: number,
      public changeDate?: Date,
      public image?: string
    ) { }

    static convertFormToProduct(form: FormGroup): Product {
      return new Product(
          parseInt(form.get('id')?.value || undefined),
          form.get('name')?.value || undefined,
          parseInt(form.get('quantity')?.value || undefined),
          undefined,
          form.get('image')?.value || undefined
      );
  }
  }

