import { Component, OnInit } from '@angular/core';
import { MovementService } from '../services/movement.service';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { ResponseDTO } from '../models/response.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-see-movement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './see-movement.component.html',
  styleUrl: './see-movement.component.scss'
})
export class SeeMovementComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private movementService: MovementService, private productService: ProductService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    if (!this.movementService.movement?.id) {
      this.router.navigateByUrl('/movement');
    } else {
      this.findProducts();
    }
  }

  findProducts() {
    this.productService.getProductsByMovementId(this.movementService.movement?.id!).subscribe({
      next: (response: HttpResponse<ResponseDTO>) => {
        this.products = (response.body?.data || []).sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
        this.filteredProducts = this.products;
      },
      error: (error) => {
        this.onMessage(error.error.message, '', 2000);
      }
    });
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.readXmlFile(file);
    }
  }

  readXmlFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const xmlContent = reader.result as string;
      this.parseXml(xmlContent);
    };
    reader.readAsText(file);
  }

  parseXml(xmlContent: string) {

    const productsList: Product[] = [];

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

    const products = xmlDoc.getElementsByTagName('det');

    for (let i = 0; i < products.length; i++) {
      const productNode = products[i].getElementsByTagName('prod')[0];
      if (productNode) {
        const name = productNode.getElementsByTagName('xProd')[0]?.textContent || '';
        const quantity = parseFloat(productNode.getElementsByTagName('qCom')[0]?.textContent || '0') || 0;
        const codProduct = parseInt(productNode.getElementsByTagName('cProd')[0]?.textContent || '0') || 0;

        const product = new Product(
          undefined,
          name,
          quantity,
          undefined,
          this.movementService.movement,
          codProduct
        );

        productsList.push(product);
        console.log(productsList);

      }
    }
    this.addProducts(productsList);
  }

  addProducts(productList: Product[]) {
    if (productList) {
      this.productService.saveProducts(productList).subscribe({
        next: (response: HttpResponse<ResponseDTO>) => {
          this.onMessage(response.body?.msg!, '', 2000);
          this.findProducts();
        },
        error: (error) => {
          this.onMessage(error.error.message, '', 2000);
        }
      });
    } else {
      this.onMessage('Nenhum produto encontrado!', '', 2000);
    }
  }

  quantityAuditedEdit(product: Product) {
    if (product.id && product.addQuantityAudited !== undefined && product.addQuantityAudited > 0) {
      this.productService.addQuantityAudited(product.id, product.addQuantityAudited).subscribe({
        next: (response: HttpResponse<ResponseDTO>) => {
          this.onMessage(response.body?.msg!, '', 2000);
          product.addQuantityAudited = undefined;
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

  filter(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchText = input.value;

    this.filteredProducts = this.products.filter(product =>
      product.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
