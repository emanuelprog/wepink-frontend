import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent {
  form: FormGroup;
  fotoInvalid = false;
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  file: File | undefined;
  conteudo: string | undefined;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private productService: ProductService) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      image: [null, [Validators.required]]
    });
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.fotoInvalid = true;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.fotoInvalid = true;
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.fotoInvalid = true;
        return;
      }
      this.fotoInvalid = false;
      this.form.patchValue({ fotoDestaque: file });

      this.uploadFile();
    } else {
      this.fotoInvalid = true;
    }
  }

  async uploadFile(): Promise<void> {
    const fileInput = this.fileInput?.nativeElement;

    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file) {
        try {
          const bytes = await this.lerArquivo(file) as ArrayBuffer;

          const base64String = this.arrayBufferToBase64(bytes);
          this.form.get('image')?.setValue(base64String);
          this.conteudo = base64String;

        } catch (error) {
          this.onMessage('Não foi possível enviar a imagem!', '', 2000);
        }
      } else {
        this.onMessage('Nenhuma imagem selecionada!', '', 2000);
      }


      this.file = file;
    }
  }

  lerArquivo(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (event) {
        if (event.target) {
          const result = event.target.result;
          if (result instanceof ArrayBuffer) {
            const bytes = new Uint8Array(result);
            resolve(bytes);
          }
        }
      };

      reader.onerror = function (event) {
        if (event.target) {
          reject(event.target.error);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
    const binary = [];
    const bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary.push(String.fromCharCode(bytes[i]));
    }
    return window.btoa(binary.join(''));
  }

  getImageSrc(): string {
    if (this.conteudo) {
        return `data:image/jpeg;base64,${this.conteudo}`;
    }
    return '';
  }

  onSubmit() {
    if (this.form.valid) {
      // this.productService.saveProduct(Product.convertFormToProduct(this.form)).subscribe({
      //   next: (response) => {
      //     this.onMessage(response.body?.msg!, '', 2000);
      //     this.form.reset();
      //     this.router.navigateByUrl("/home");
      //   },
      //   error: (error) => {
      //     this.onMessage(error.error.message, '', 2000);
      //   }
      // });
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.form.reset();
    this.conteudo = undefined;
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
