import { LightningElement,track } from 'lwc';

export default class EnquiryBuilderRupeshSec extends LightningElement {
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
    
 

}