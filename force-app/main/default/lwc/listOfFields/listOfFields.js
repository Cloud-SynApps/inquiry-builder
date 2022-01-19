import { LightningElement, track, wire } from 'lwc';
import getfields from "@salesforce/apex/FieldList.getfields";

export default class ListOfFields extends LightningElement {
    @track data = [];
    wiredActivities;
    get Options(){
        return this.data;
    }

    @wire(getfields, {
        objectname:'Account'
    })
    wiredclass(value){
        this.wiredActivities=values;
        const{data,error} =value;
        if(data){
            let datas = JSON.parse(JSON.stringify(data));
            let lstOption=[];
            for(var i=0;i<datas.length;i++){
                lstOption.push({value:datas[i].QualifiedApiName,label:datas[i].DeveloperName});
            }
            this.data=lstOption;
        } else if(error){
            console.log(error);
        }
    }
    handleChange(event){
        alert(event.detail.value);
    }
}