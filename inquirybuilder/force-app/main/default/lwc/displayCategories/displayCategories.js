import { LightningElement,api,track,wire } from 'lwc';
import getCategory from '@salesforce/apex/InquiryBuilderController.getCategory';


export default class DisplayCategories extends LightningElement {

@api categories;
@track category;
@api recordId;




connectedCallback()
{
    getCategory()
        .then((result) => {
            console.log('Categories',result);

            result.forEach(element => {
               //element['url'] = '/InquiryBuilder/s/category-detail';
               element['url'] = '/InquiryBuilder/s/csa-inquiry-category/'+element.Id;
               
            });
            
            this.categories= result;           
        })
        
        .catch((error) => {
            this.error = error;
        });
}

handleclick(event)
{
    
    this.category = event.currentTarget.dataset.value
    console.log('Category',this.category);
    this.recordId = this.category;
    
}

}