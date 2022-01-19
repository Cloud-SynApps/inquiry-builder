import { LightningElement,track } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

export default class LwcComponentB extends LightningElement {
   
  arr = new Array();
  
  valueGotFromA = '';

  connectedCallback(){
    registerListener('articleselected', this.displaySelectedArt, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  displaySelectedArt(Name) {
   
    this.valueGotFromA =Name;
  
  this.arr = this.valueGotFromA.split(',');
  console.log(this.arr);

  }
  @track licensing1FieldValue = false;
  @track licensing2FieldValue = false;
  @track licensing3FieldValue = false;
  @track licensing4FieldValue = false;

  @track permitting1FieldValue = false;
  @track permitting2FieldValue = false;
  @track permitting3FieldValue = false;
  @track permitting4FieldValue = false;

  @track healthCare1FieldValue = false;
  @track healthCare2FieldValue = false;
  @track healthCare3FieldValue = false;
  @track healthCare4FieldValue = false;

  @track childWelfare1FieldValue = false;
  @track childWelfare2FieldValue = false;
  @track childWelfare3FieldValue = false;
  @track childWelfare4FieldValue = false;
 


  
  @track isModalOpen = false;
  handleSuccess(event) {
  console.log('reached in js')
   //console.log(event.target.dataset.id)
   this.isModalOpen=true;
  
   
   const selectedOption = event.target.dataset.id;
   console.log('option ='+selectedOption)
   //alert('selectedOption ' + selectedOption);
   //Licensing Part
   if (selectedOption == 'Licensing Article 1'){
     console.log('inside licensing 1')
       this.licensing1FieldValue = true;
   }else{
       this.licensing1FieldValue = false;
   }
 
   if (selectedOption == 'Licensing Article 2'){
    console.log('inside licensing 2')
       this.licensing2FieldValue = true;
   }else{
       this.licensing2FieldValue = false;
   }

    if (selectedOption == 'Licensing Article 3'){
    console.log('inside licensing 3')
       this.licensing3FieldValue = true;
   }else{
       this.licensing3FieldValue = false;
   }

   if (selectedOption == 'Licensing Article 4'){
      console.log('inside licensing 4')
       this.licensing4FieldValue = true;
   }
   else{
       this.licensing4FieldValue = false;
   }
 
//Permitting Part

   if (selectedOption == 'Permitting Article 1'){
    console.log('inside permitting 1')
      this.permitting1FieldValue = true;
  }else{
      this.permitting1FieldValue = false;
  }

  if (selectedOption == 'Permitting Article 2'){
   console.log('inside permitting 2')
      this.permitting2FieldValue = true;
  }else{
      this.permitting2FieldValue = false;
  }
   if (selectedOption == 'Permitting Article 3'){
   console.log('inside permitting 3')
      this.permitting3FieldValue = true;
  }else{
      this.permitting3FieldValue = false;
  }
  if (selectedOption == 'Permitting Article 4'){
      console.log('inside permitting 4')
      this.permitting4FieldValue = true;
  }
  else{
      this.permitting4FieldValue = false;
  }

//Health care Part

  if (selectedOption == 'Health Care Article 1'){
    console.log('inside health 1')
      this.healthCare1FieldValue = true;
  }else{
      this.healthCare1FieldValue = false;
  }

  if (selectedOption == 'Health Care Article 2'){
   console.log('inside health 2')
      this.healthCare2FieldValue = true;
  }else{
      this.healthCare2FieldValue = false;
  }
   if (selectedOption == 'Health Care Article 3'){
   console.log('inside health 3')
      this.healthCare3FieldValue = true;
  }else{
      this.healthCare3FieldValue = false;
  }
  if (selectedOption == 'Health Care Article 4'){
 console.log('inside health 4')
      this.healthCare4FieldValue = true;
  }
  else{
      this.healthCare4FieldValue = false;
  }


  //child welfare part
  if (selectedOption == 'Child Welfare Article 1'){
    console.log('inside welfare 1')
      this.childWelfare1FieldValue = true;
  }else{
      this.childWelfare1FieldValue = false;
  }

  if (selectedOption == 'Child Welfare Article 2'){
   console.log('inside welfare 2')
      this.childWelfare2FieldValue = true;
  }else{
      this.childWelfare2FieldValue = false;
  }
   if (selectedOption == 'Child Welfare Article 3'){
   console.log('inside welfare 3')
      this.childWelfare3FieldValue = true;
  }else{
      this.childWelfare3FieldValue = false;
  }
  if (selectedOption == 'Child Welfare Article 4'){
 console.log('inside welfare 4')
      this.childWelfare4FieldValue = true;
  }
  else{
      this.childWelfare4FieldValue = false;
  }

  }
  

 /* showModal1() {
    this.isModalOpen1=true;

    
  }
  showModal2() {
    this.isModalOpen2 = true;

    
  }
*/



  
 /* closeModal1() {
    this.isModalOpen1 = false;
  }

  closeModal2() {
    this.isModalOpen2= false;
  }*/
  closeModal(){
    this.isModalOpen=false;
  }

  /* 
  can be used instead of the above two methods - showModal() & closeModal()
  just toggles the isModalOpen property - true if false, false if true 
  */
  /*toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }*/

  //compute the CSS classes of the Modal(popup) based on the value of isModalOpen property
  get modalClass() {
    return `slds-modal ${this.isModalOpen ? "slds-fade-in-open" : ""}`;
  }

  //compute the CSS classes of the Modal Backdrop(grey overlay) based on the value of isModalOpen property
  get modalBackdropClass() {
    return `slds-backdrop ${this.isModalOpen ? "slds-backdrop_open" : ""}`;
  }
 
}