import { LightningElement,api } from 'lwc';
import getCategory from '@salesforce/apex/InquiryBuilderGetRecords.getCategory';

export default class DisplayCategories extends LightningElement {

@api categories;


connectedCallback()
{
    getCategory()
        .then((result) => {
            console.log('Categories',result);

            result.forEach(element => {
                element['url'] = '/s/inquirybuilder?recordId='+element.Id;
            });
            console.log('Categories',result);
            this.categories= result;           
        })
        .catch((error) => {
            this.error = error;
        });
}

}