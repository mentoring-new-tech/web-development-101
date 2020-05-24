import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../component/home/home.component'
import { ListSupplierComponent } from '../component/list-supplier/list-supplier.component'
import { AddSupplierComponent } from '../component/add-supplier/add-supplier.component';
import { EditSupplierComponent } from '../component/edit-supplier/edit-supplier.component';

const APP_ROUTES: Routes =  [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent }, /** route for HomeComponent */
    { path: 'add-supplier', component: AddSupplierComponent }, /** route for AddSupplierComponent */
    { path: 'list-supplier', component: ListSupplierComponent }, /** route for ListSupplierComponent */
    { path: 'edit-supplier/:id', component: EditSupplierComponent } /** route for EditSupplierComponent */
 
];
export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
