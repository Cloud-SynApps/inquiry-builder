import { LightningElement,api } from 'lwc';
import getVisitedResources from '@salesforce/apex/InquiryBuilderController.getVisitedResources';
export default class DisplayVisitedResources extends LightningElement {
 
    _inquiryId ;
 resources;   
    
    
   @api get inquiryId()
   {
       console.log('-get-',this._inquiryId);
        return this._inquiryId;
   }

   set inquiryId(value)
   {
    this._inquiryId = value;
    console.log('set-->',value);
    getVisitedResources({ InquiryId: this._inquiryId })
        .then((result) => {
            console.log('-set - promise-',result);
            this.resources = result;
            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
            this.resources = undefined;
        });
    
       
       
   }
}