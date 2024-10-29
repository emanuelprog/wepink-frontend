import { FormGroup } from "@angular/forms";
import { Product } from "./product.model";

export interface Movement {
    id?: number;
    date?: Date;
    products?: Product[];
    status?: string;
  }

  export class Movement implements Movement {
    constructor(
      public id?: number,
      public date?: Date,
      public products?: Product[]
    ) { }
  }

