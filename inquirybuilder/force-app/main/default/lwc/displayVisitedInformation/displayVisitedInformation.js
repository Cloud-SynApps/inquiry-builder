import { LightningElement,api } from 'lwc';
import getVisitedInformation from '@salesforce/apex/InquiryBuilderController.getVisitedInformation';

export default class DisplayVisitedInformation extends LightningElement {


_inquiryId ;
 information;   
    
    
   @api get inquiryId()
   {
       console.log('-get-',this._inquiryId);
        return this._inquiryId;
   }

   set inquiryId(value)
   {
    this._inquiryId = value;
    console.log('set-->',value);
    getVisitedInformation({ InquiryId: this._inquiryId })
        .then((result) => {
            console.log('-set - promise-',result);
            this.information = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.information = undefined;
        });
    
       
       
   }

}