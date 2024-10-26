import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { HttpResponse } from '@angular/common/http';
import { ResponseDTO } from '../models/response.model';
import { Product } from '../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar
    ){
  }

  ngOnInit() {
    this.findProducts();
  }

  findProducts() {
    this.productService.getAllProducts().subscribe({
      next: (response: HttpResponse<ResponseDTO>) => {
        this.products = (response.body?.data || []).sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
        this.filteredProducts = this.products;
      },
      error: (error) => {
        this.onMessage(error.error.message, '', 2000);
      }
    });
  }

  filter(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchText = input.value;

    this.filteredProducts = this.products.filter(product =>
      product.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  getImageSrc(product: Product): string {
    if (product.image) {
        return `data:image/jpeg;base64,${product.image}`;
    }
    return '';
  }

  increaseStock(product: Product) {
    if (product.id && product.addQuantity !== undefined && product.addQuantity > 0) {
      this.productService.plusQuantityProduct(product.id, product.addQuantity).subscribe({
        next: (response: HttpResponse<ResponseDTO>) => {
          this.onMessage(response.body?.msg!, '', 2000);
          product.addQuantity = undefined;
          this.findProducts();
        },
        error: (error) => {
          this.onMessage(error.error.message, '', 2000);
        }
      });
    } else {
      this.onMessage('Insira uma quantidade válida para adicionar', '', 2000);
    }
  }

  decreaseStock(product: Product) {
    if (product.id && product.subtractQuantity !== undefined && product.subtractQuantity > 0) {
      this.productService.minusQuantityProduct(product.id, product.subtractQuantity).subscribe({
        next: (response: HttpResponse<ResponseDTO>) => {
          this.onMessage(response.body?.msg!, '', 2000);
          product.subtractQuantity = undefined;
          this.findProducts();
        },
        error: (error) => {
          this.onMessage(error.error.message, '', 2000);
        }
      });
    } else {
      this.onMessage('Insira uma quantidade válida para diminuir', '', 2000);
    }
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
