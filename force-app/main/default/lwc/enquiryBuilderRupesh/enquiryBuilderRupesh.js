import { LightningElement, track } from 'lwc';
//import { NavigationMixin } from 'lightning/navigation';
export default class LwcRadioGroup extends LightningElement {
    value = 'Licensing';
    selectedvalue = "";
    get options() {
        return [
            { label: 'Licensing', value: 'Licensing' },
            { label: 'Permitting', value: 'Permitting' },
            { label: 'Health Care', value: 'Health Care' },
            { label: 'Child Welfare', value: 'Child Welfare' },
            
        ];
    }
    
   
 
}