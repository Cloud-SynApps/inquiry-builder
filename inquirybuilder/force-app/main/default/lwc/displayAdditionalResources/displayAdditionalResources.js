import { LightningElement,api } from 'lwc';
import getResources from '@salesforce/apex/DisplayAdditionalResources.displayResources';

export default class DisplayAdditionalResources extends LightningElement {

    resources;
    resourcesUrl;
    resourceName;
    @api elementId;
    connectedCallback()
    {
        getResources()
        .then((result) => {
            this.resources = result;
            console.log('resources', this.resources);
            console.log('resources', JSON.stringify(this.resources));
            console.log('element Id',this.elementId);
            
            
        })
        .catch((error) => {
            this.error = error;
           
        });   
    }

}