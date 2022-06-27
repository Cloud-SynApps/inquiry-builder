import { LightningElement,api,track } from 'lwc';
import getWebResource from '@salesforce/apex/DisplayAdditionalResources.displayResources';

export default class DisplayAdditionalResources extends LightningElement {

    resources;
    resourcesUrl;
    resourceName;
    _elementId;
    @track link;
    @track link1;
    
    
    
   @api get elementId()
   {
       console.log('-get-',this._elementId);
        return this._elementId;
   }

   set elementId(value)
   {
    this._elementId = value;
    console.log('set-->',value);
    getWebResource({ elementId: this._elementId })
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