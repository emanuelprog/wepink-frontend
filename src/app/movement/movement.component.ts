import { Component, OnInit } from '@angular/core';
import { MovementService } from '../services/movement.service';
import { ResponseDTO } from '../models/response.model';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Movement } from '../models/movement.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.scss'
})
export class MovementComponent implements OnInit {

  movements: Movement[] = [];
  filteredMovements: Movement[] = [];

  constructor(public movementService: MovementService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    this.findMovements();
  }

  findMovements() {
    this.movementService.getAllMovements().subscribe({
      next: (response: HttpResponse<ResponseDTO>) => {
        this.movements = (response.body?.data || []).map((movement: { products: any[]; status: string; }) => {

          const allQuantitiesMatch = Array.isArray(movement.products) &&
                                     movement.products.every(product => product.quantity === product.quantityAudited);

          movement.status = allQuantitiesMatch && movement.products?.length > 0 ? 'SUCESSO' : 'PENDENTE';

          return movement;
        }).sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);

        this.filteredMovements = this.movements;
        console.log(this.filteredMovements);

      },
      error: (error) => {
        this.onMessage(error.error.message, '', 2000);
      }
    });
  }

  addMovement() {
    this.movementService.saveMovement(new Movement()).subscribe({
      next: (response: HttpResponse<ResponseDTO>) => {
        this.onMessage(response.body?.msg!, '', 2000);
        this.findMovements();
      },
      error: (error) => {
        this.onMessage(error.error.message, '', 2000);
      }
    });
  }

  seeMovement(movement: Movement) {
    this.movementService.setMovement(movement);
    this.router.navigateByUrl('/see-movement');
  }

  filter(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.filteredMovements = this.movements.filter(movement =>
      !status || movement.status === status
    );
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
