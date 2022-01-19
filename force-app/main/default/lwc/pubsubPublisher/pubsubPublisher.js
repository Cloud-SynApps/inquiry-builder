import { LightningElement,track } from 'lwc';
import pubsub from 'c/pubsub' ; 
export default class PubsubPublisher extends LightningElement {
    get options() {
        return [
        { label: 'Licensing', value: 'Licensing' },
        { label: 'Permitting', value: 'Permitting' },
        { label: 'Health Care', value: 'Health Care' },
        { label: 'Child Welfare', value: 'Child Welfare' },
        
        ];
        }
        
@track licensingFieldValue = false;
@track permittingFieldValue = false;
@track healthCareFieldValue = false;
@track childWelfareFieldValue = false;

        handleRadioChange(event){
       // window.console.log('Event Firing..... ');
       const selectedOption = event.detail.value;

       /* let message = {
            "message" : 'Hello PubSub'
        }*/
        if(selectedOption == 'Licensing'){
            this.licensingFieldValue=true;
            let arr= ["Licensing Article 1","Licensing Article 2","Licensing Article 3"];
            pubsub.fire('simplevt', arr );

        }
        else{
            this.licensingFieldValue=false;
        }

       // pubsub.fire('simplevt', message );
      //  window.console.log('Event Fired ');
    }
}