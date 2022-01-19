import { LightningElement,track } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

export default class LwcComponentB extends LightningElement {

  arr = new Array();
  //1
  valueGotFromA = '';

  connectedCallback(){
    registerListener('carselected', this.diplaySelectedCar, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }
//1
  diplaySelectedCar(carName) {
   //2
    this.valueGotFromA = carName;
  //3
  this.arr = this.valueGotFromA.split(',');
  console.log(this.arr);
  
  }



  //modal
  @track isModalOpen = false;

  //sets the isModalOpen property to true, indicating that the Modal is Open
  showModal() {
    this.isModalOpen = true;
  }

  //sets the isModalOpen property to false, indicating that the Modal is Closed
  closeModal() {
    this.isModalOpen = false;
  }

  /* 
  can be used instead of the above two methods - showModal() & closeModal()
  just toggles the isModalOpen property - true if false, false if true 
  */
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  //compute the CSS classes of the Modal(popup) based on the value of isModalOpen property
  get modalClass() {
    return `slds-modal ${this.isModalOpen ? "slds-fade-in-open" : ""}`;
  }

  //compute the CSS classes of the Modal Backdrop(grey overlay) based on the value of isModalOpen property
  get modalBackdropClass() {
    return `slds-backdrop ${this.isModalOpen ? "slds-backdrop_open" : ""}`;
  }
}