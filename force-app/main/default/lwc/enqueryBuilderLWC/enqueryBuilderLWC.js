import { LightningElement, track } from 'lwc';
 
export default class LwcRadioGroup extends LightningElement {


    
    value = 'Licensing';
 
    get options() {
        return [
            { label: 'Licensing', value: 'Licensing' },
            { label: 'Permitting', value: 'Permitting' },
            { label: 'Health Care', value: 'Health Care' },
            { label: 'Child Welfare', value: 'Child Welfare' },
            
        ];
    }
 
    @track licensingFieldValue = true;
    @track permittingFieldValue = false;
    @track healthCareFieldValue = false;
    @track childWelfareFieldValue = false;
   
 
    handleRadioChange(event) {
        const selectedOption = event.detail.value;
        //alert('selectedOption ' + selectedOption);
        if (selectedOption == 'Licensing'){
            this.licensingFieldValue = true;
        }else{
            this.licensingFieldValue = false;
        }
      
        
        if (selectedOption == 'Permitting'){
            this.permittingFieldValue = true;
        }else{
            this.permittingFieldValue = false;
        }
        
 
        if (selectedOption == 'Health Care'){
            this.healthCareFieldValue = true;
        }else{
            this.healthCareFieldValue = false;
        }
        
 
      if (selectedOption == 'Child Welfare'){
            this.childWelfareFieldValue = true;
        }
        else{
            this.childWelfareFieldValue = false;
        }
      
    }
    //modal
    @track isModalOpen = false;

    //sets the isModalOpen property to true, indicating that the Modal is Open
    showModal() {
        if(permittingFieldValue==true)
        {
      this.isModalOpen = true;
        }
        else(healthCareFieldValue==true)
        {
      this.isModalOpen = true;
        }
        
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