/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommodityService } from './Commodity.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-commodity',
  templateUrl: './Commodity.component.html',
  styleUrls: ['./Commodity.component.css'],
  providers: [CommodityService]
})
export class CommodityComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  commodityId = new FormControl('', Validators.required);
  quantity = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  priceUnit = new FormControl('', Validators.required);
  issueDate = new FormControl('', Validators.required);
  item = new FormControl('', Validators.required);
  issuer = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceCommodity: CommodityService, fb: FormBuilder) {
    this.myForm = fb.group({
      commodityId: this.commodityId,
      quantity: this.quantity,
      price: this.price,
      priceUnit: this.priceUnit,
      issueDate: this.issueDate,
      item: this.item,
      issuer: this.issuer,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCommodity.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.india.farmnet.Commodity',
      'commodityId': this.commodityId.value,
      'quantity': this.quantity.value,
      'price': this.price.value,
      'priceUnit': this.priceUnit.value,
      'issueDate': this.issueDate.value,
      'item': this.item.value,
      'issuer': this.issuer.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'commodityId': null,
      'quantity': null,
      'price': null,
      'priceUnit': null,
      'issueDate': null,
      'item': null,
      'issuer': null,
      'owner': null
    });

    return this.serviceCommodity.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'commodityId': null,
        'quantity': null,
        'price': null,
        'priceUnit': null,
        'issueDate': null,
        'item': null,
        'issuer': null,
        'owner': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.india.farmnet.Commodity',
      'quantity': this.quantity.value,
      'price': this.price.value,
      'priceUnit': this.priceUnit.value,
      'issueDate': this.issueDate.value,
      'item': this.item.value,
      'issuer': this.issuer.value,
      'owner': this.owner.value
    };

    return this.serviceCommodity.updateAsset(form.get('commodityId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceCommodity.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCommodity.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'commodityId': null,
        'quantity': null,
        'price': null,
        'priceUnit': null,
        'issueDate': null,
        'item': null,
        'issuer': null,
        'owner': null
      };

      if (result.commodityId) {
        formObject.commodityId = result.commodityId;
      } else {
        formObject.commodityId = null;
      }

      if (result.quantity) {
        formObject.quantity = result.quantity;
      } else {
        formObject.quantity = null;
      }

      if (result.price) {
        formObject.price = result.price;
      } else {
        formObject.price = null;
      }

      if (result.priceUnit) {
        formObject.priceUnit = result.priceUnit;
      } else {
        formObject.priceUnit = null;
      }

      if (result.issueDate) {
        formObject.issueDate = result.issueDate;
      } else {
        formObject.issueDate = null;
      }

      if (result.item) {
        formObject.item = result.item;
      } else {
        formObject.item = null;
      }

      if (result.issuer) {
        formObject.issuer = result.issuer;
      } else {
        formObject.issuer = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'commodityId': null,
      'quantity': null,
      'price': null,
      'priceUnit': null,
      'issueDate': null,
      'item': null,
      'issuer': null,
      'owner': null
      });
  }

}
