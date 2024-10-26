import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewProductComponent } from './new-product/new-product.component';
import { StockComponent } from './stock/stock.component';

const routes: Routes = [
  { path: '', redirectTo: '/stock', pathMatch: 'full' },
  { path: 'stock', component: StockComponent },
  { path: 'new-product', component: NewProductComponent },
  { path: '**', redirectTo: 'stock' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
