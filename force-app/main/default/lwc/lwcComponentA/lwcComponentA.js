import { LightningElement, wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class LwcComponentA extends LightningElement {
  @wire(CurrentPageReference) pageRef;

  cars = [
    { label: "Licensing", value: "Licensing Article 1,Licensing Article 2 ,Licensing Article 3,Licensing Article 4"},
    { label: "Permitting", value:"Permitting Article 1,Permitting Article 2,Permitting Article 3,Permitting Article 4"},
    { label: "Health Care", value:"Health Care Article 1,Health Care Article 2,Health Care Article 3,Health Care Article 4"},
    {label:"Child Welfare", value: "Child Welfare Article 1,Child Welfare Article 2,Child Welfare Article 3,Child Welfare Article 4"},
  ];
  selectedValue = '';

  sendDataToComponentB(event) {
    fireEvent(this.pageRef ,'carselected', event.target.value);
  }
}