import { Component, OnInit } from '@angular/core';
import { SuppliersService } from '../../services/suppliers.service';


@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {

  /**
   * Private attributes of AddSupplierComponent
   * they can only be changed using the public methods of this class
   */
  private isLoadingSubmit: boolean;
  private errorSubmit: boolean;
  private errorMsgSubmit: string;
  private successSubmit: boolean;
  private successMsg: string;
  private supplier;

  /**
   * Initializing private attributes
   */
  constructor(private suppliersService: SuppliersService) {
    this.isLoadingSubmit = false;
    this.errorSubmit = false;
    this.errorMsgSubmit = '';
    this.successSubmit = false;
    this.successMsg = 'Supplier has been registered successfully'
    this.supplier = {
      name: '',
      cnpj: '',
      address: '',
      tel: ''
    }
  }


  ngOnInit() {
    /** Do nothing */
  }

  /**
   * This function will be triggered when the user clicks in the Cancel button
   * It will reset the previous typing of the user to the Form initial state.
   */
  clearForm() {
    this.supplier = {
      name: '',
      cnpj: '',
      address: '',
      tel: ''
    }
  }

  /**
   * This function will be triggered when the user clicks in the Save button.
   * It sets the isLoadingSubmit attribute to true to indicate to the user that the
   * request is being processed in the server side.
   * When it finishes in the Server side, it shows a success message - If the request
   * was completed with a 200 status or an error message for other status.
   */
  submitSupplier() {
    this.errorSubmit = false;
    this.successSubmit = false;
    this.isLoadingSubmit = true;
    this.suppliersService.create(this.supplier.name, this.supplier.cnpj, this.supplier.address, this.supplier.tel)
      .subscribe(
        result => {
          this.isLoadingSubmit = false;
          this.successSubmit = true;
        },
        err => {
          this.errorMsgSubmit = `Fail to register the supplier. Reason: ${err.error.message ? err.error.message : 'Internal Server Error'}`; // Error Message from the Server. Here you can add your own messages based in the http status codes, or use the message from the Back-end. To investigate more use console.log(err) and open your browser console.
          this.isLoadingSubmit = false;
          this.errorSubmit = true
        }
      )
  }

}
