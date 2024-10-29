import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewProductComponent } from './new-product/new-product.component';
import { MovementComponent } from './movement/movement.component';
import { SeeMovementComponent } from './see-movement/see-movement.component';

const routes: Routes = [
  { path: '', redirectTo: '/movement', pathMatch: 'full' },
  { path: 'movement', component: MovementComponent },
  { path: 'see-movement', component: SeeMovementComponent },
  { path: '**', redirectTo: 'movement' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
