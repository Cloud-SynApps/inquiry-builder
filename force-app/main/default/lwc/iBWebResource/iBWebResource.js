import { LightningElement,wire } from 'lwc';
import iBWebResource from '@salesforce/apex/IBWebResourceController.iBWebResource';

const sections = [
    {
        label: 'Additional External Resources',
        items: [
            {
                label: 'Limitation Periods',
                type: 'URL',
                name: 'default_periods',
                icon: 'utility:new_window',
            },
            
            {
                label: 'CRT Decisions',
                type: 'URL',
                name: 'default_decisions',
                icon: 'utility:new_window',
            },
        ],
    },

    
];

export default class IBWebResource extends LightningElement {

    @wire(iBWebResource)
    sections;

    //initiallySelected = 'default_recent';
    resourceList = sections;
}