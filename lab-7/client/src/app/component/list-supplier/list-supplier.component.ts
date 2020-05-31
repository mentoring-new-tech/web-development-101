import { Component, OnInit } from '@angular/core';
import { SuppliersService } from '../../services/suppliers.service';

@Component({
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  styleUrls: ['./list-supplier.component.css']
})
export class ListSupplierComponent implements OnInit {

  /**
   * Private attributes of ListSupplierComponent
   * they can only be changed using the public methods of this class
   */
  private isLoadingList: boolean;
  private errorList: boolean;
  private errorListMsg: string;
  private errorDelete: boolean;
  private errorDeleteMsg: string;
  private suppliersList;

  /**
   * Initializing private attributes
   */
  constructor(private suppliersService: SuppliersService) {
    this.isLoadingList = true; // As it takes a couple of seconds to get all suppliers, we add a loading message to indicate to the user that something is being processed
    this.errorList = false;
    this.errorListMsg = '';
    this.errorDelete = false;
    this.errorDeleteMsg = '';
    this.suppliersList = [];
  }

  /**
   * This function is the first one to be called. A Refresh page or a redirect link will trigger this method
   * Considering it, we should call the getAll() suppliers method here.
   */
  ngOnInit() {
    this.suppliersService.getAll() // The Observer object returns a result and error, so we use the subscribe to handle both cases
      .subscribe(
        result => {
          this.suppliersList = result.data;
          this.isLoadingList = false; // This attribute will only be false if the http request completes
        },
        err => {
          this.errorListMsg = err.error.message? err.error.message: 'Internal Server Error'; // Error Message from the Server. Here you can add your own messages based in the http status codes, or use the message from the Back-end. To investigate more use console.log(err) and open your browser console.
          this.errorList = true; // As an error happened you should set this attribute to true;
          this.isLoadingList = false; // This attribute will only be false if the http request completes
        }
      )
  }

  /**
   * This function will be triggered when the user clicks in the Delete button
   * It confirms if the user really want to do it. If yes it calls the delete()
   * method of the suppliers service.
   */
  deleteSupplier(index: number) {
    const confirm = window.confirm('Do you want to confirm?'); // window.confirm returns true if the user clicks in the OK button, otherwise it returns false
    if (confirm) {
      document.getElementById(`delete-loading-${index}`).hidden = false; // It only shows the Loading button, as it still is processing
      document.getElementById(`delete-${index}`).hidden = true;
      document.getElementById(`edit-${index}`).hidden = true;

      this.suppliersService.delete(this.suppliersList[index].doc._id) // The Observer object returns a result and error, so we use the subscribe to handle both cases
        .subscribe(
          result => {
            /** We're going to use the splice to remove the index from the suppliersList */
            this.suppliersList.splice(index, 1);
          },
          err => {
            this.errorDeleteMsg = `Fail to delete the supplier. Reason: ${err.error.message? err.error.message: 'Internal Server Error'}`; // Error Message from the Server. Here you can add your own messages based in the http status codes, or use the message from the Back-end. To investigate more use console.log(err) and open your browser console.
            this.errorDelete = true; // As an error happened you should set this attribute to true;
          })
    }
  }
}
