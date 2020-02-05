import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { AddSupplierComponent } from './component/add-supplier/add-supplier.component';
import { ListSupplierComponent } from './component/list-supplier/list-supplier.component';
import { routing } from './routes/app.routing';
import { NavbarComponent } from './component/navbar/navbar.component';
import { EditSupplierComponent } from './component/edit-supplier/edit-supplier.component';

@NgModule({
  declarations: [

    /** Here are all components created by angular-cli */
    AppComponent,
    HomeComponent,
    AddSupplierComponent,
    ListSupplierComponent,
    NavbarComponent,
    EditSupplierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, /** In Angular, the best practice is to load and configure the router in a separate, top-level module that is dedicated to routing and imported by the root AppModule.  */
    routing /** const created in app.routing.ts */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
