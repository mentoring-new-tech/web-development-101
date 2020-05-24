import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; /** Module to access other routes */
import { ActivatedRoute } from '@angular/router'; /** Module used to extract the route params */

import { SuppliersService } from '../../services/suppliers.service';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css']
})
export class EditSupplierComponent implements OnInit {

  /**
   * Private attributes of AddSupplierComponent
   * they can only be changed using the public methods of this class
   */
  private isLoading: boolean;
  private successSubmit: boolean;
  private successMsg: string;
  private error: boolean;
  private errorMsg: string;
  private supplier;

  constructor(private route: ActivatedRoute, private router: Router, private suppliersService: SuppliersService) {
    this.isLoading = true;
    this.successSubmit = false;
    this.successMsg = 'Supplier has been updated successfully';
    this.error = false;
    this.errorMsg = '';
    this.supplier = {
      id: '',
      name: '',
      cnpj: '',
      address: '',
      tel: ''
    }
    this.route.params.forEach(e => {
      this.supplier.id = e.id;
    });
  }

  /**
 * This function is the first one to be called. A Refresh page or a redirect link will trigger this method
 * Considering it, we should call the getOne() suppliers method here to get the supplier by the id provided
 * in the route
 */
  ngOnInit() {
    this.suppliersService.getOne(this.supplier.id)
      .subscribe(
        result => {
          this.supplier.name = result.data.name;
          this.supplier.cnpj = result.data.cnpj;
          this.supplier.address = result.data.address;
          this.supplier.tel = result.data.tel;
          this.isLoading = false;
        },
        err => {
          this.errorMsg = `Fail to get the supplier. Reason: ${err.error.message ? err.error.message : 'Internal Server Error'}`; // Error Message from the Server. Here you can add your own messages based in the http status codes, or use the message from the Back-end. To investigate more use console.log(err) and open your browser console.
          this.isLoading = false;
          this.error = true;
        }
      )
  }

  /**
   * This function will be triggered when the user clicks in the Cancel button
   * It will redirect the user to the Suppliers List route.
   */
  goBack() {
    this.router.navigateByUrl('/list-supplier');
  }

  /**
 * This function will be triggered when the user clicks in the Edit button.
 * It sets the isLoading attribute to true to indicate to the user that the
 * request is being processed in the server side.
 * When it finishes in the Server side, it shows a success message - If the request
 * was completed with a 200 status or an error message for other status.
 */
  updateSupplier() {
    this.error = false;
    this.successSubmit = false;
    this.isLoading = true;
    this.suppliersService.update(this.supplier.id, this.supplier.name, this.supplier.cnpj, this.supplier.address, this.supplier.tel)
      .subscribe(
        result => {
          this.isLoading = false;
          this.successSubmit = true;
        },
        err => {
          this.errorMsg = `Fail to update the supplier. Reason: ${err.error.message ? err.error.message : 'Internal Server Error'}`; // Error Message from the Server. Here you can add your own messages based in the http status codes, or use the message from the Back-end. To investigate more use console.log(err) and open your browser console.
          this.isLoading = false;
          this.error = true
        }
      )
  }

}
