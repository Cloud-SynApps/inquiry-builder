import { LightningElement,api,track } from 'lwc';
import getTemplates from '@salesforce/apex/InquiryBuilderController.getTemplate';
export default class DisplayTemplate extends LightningElement {

@api templates;
@track CategoryId;
@api recordId;



connectedCallback()
{
    

    getTemplates({ CategoryId: this.recordId })
        .then((result) => {
            console.log('Templates',result);

            result.forEach(element => {
                element['url'] = '/InquiryBuilder/s/exploration?recordId='+element.Id;
            });
            
            this.templates= result;           
        })
        .catch((error) => {
            this.error = error;
        });

     console.log('recordId',this.recordId);      
}




}