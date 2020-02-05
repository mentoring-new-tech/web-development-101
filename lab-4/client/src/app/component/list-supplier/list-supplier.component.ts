import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  styleUrls: ['./list-supplier.component.css']
})
export class ListSupplierComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  alertDelete(){

    let confirm = window.confirm('Do you want to confirm?');
   
  }
}
