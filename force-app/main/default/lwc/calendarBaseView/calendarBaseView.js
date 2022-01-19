import { track, api, LightningElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import retriveMeetings from '@salesforce/apex/meetingsCalendarController.retrieveMeetings';
import submitMeeting from '@salesforce/apex/meetingsCalendarController.submitMeeting';
import deleteMeeting from '@salesforce/apex/meetingsCalendarController.deleteMeeting';
import { NavigationMixin } from "lightning/navigation";
import resourceCal from "@salesforce/resourceUrl/fullcalendar";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import TIME_ZONE from '@salesforce/i18n/timeZone';

export default class fullCalendar extends NavigationMixin(LightningElement) {
  //Public
  @api UITheme;
  timeZone = TIME_ZONE;
  @track objectApi='Meeting__c';
  

  @track isLightning = true;

  scriptInitialized = false;
  @track calendar;
  @track calendarEl;
  @track draggable;
  @track containerEl;
  @track SC = {};
  isModalOpen = false;
  isLoading = false;
  @track currentEvent;
  @track selectedEvt =[];
  @track events;
  evtrecords;
  minTime= "08:00:00";
  maxTime= "16:00:00";
  minTimePicker=this.minTime+'.000Z'; 
  maxTimePicker=this.maxTime+'.000Z';

  
  

  get meetingStatus() {
    if(this.selectedEvt.status&&this.selectedEvt.status==='new'){
        return 'Book this slot';
    }
    if(this.selectedEvt.status&&this.selectedEvt.status==='update'){
        return 'Update Meeting';
    }
    return '';
  }

  get isdeletable(){
      return this.selectedEvt.status&&this.selectedEvt.status==='update';
  }

setTimeLimitByUserTimezone(){
  let offset=this.getTimeZoneOffset(new Date(strDate),this.timeZone);

}

handleCreateMeetingClick(){
    let temp = {
        type: 'standard__objectPage',
        attributes: {
            objectApiName: this.objectApi,
            actionName: 'new'                
        },
        state : {
            nooverride: '1'
        }
    };
    this[NavigationMixin.Navigate](temp);
}
handleDeleteMeetingClick(){
    this.isLoading=true;
    let recId =this.selectedEvt.id;
    window.clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => {
        deleteMeeting({
            objectApi:this.objectApi,
            id:recId
        })
        .then(result => {
          
            if(result&&result.status==='ok'){
                this.deleteCalendarEntry();
                this.showSuccessToast('Success','Meeting deleted.');
            }
            else{
                alert(result.message);
            }
            
            this.isModalOpen = false;
            this.isLoading=false;
           
        })
        .catch(error =>{
            alert(result.status);
            this.error=error;
           
            this.isModalOpen = false;
            this.isLoading=false;
        })

        

    })


}
deleteCalendarEntry(){
    this.currentEvent.remove();
}
  handleEventAddClick(event) {
    this.selectedEvt=[];
    this.selectedEvt.status='new';
    this.currentEvent=null;
    this.isModalOpen=true;
  }

  checkInputValidate(inputname){

    let returnvalue; 
    let inputCmp = this.template.querySelector(inputname); 

    let value = inputCmp.value; 
   
    if (inputCmp.value === "") {
       
        inputCmp.setCustomValidity("Field is Required!");
        inputCmp.reportValidity(); 
        returnvalue = false;
    } else {
      
        inputCmp.setCustomValidity(""); 
        returnvalue = true;
    }
    

    return returnvalue;
  }
  validateMeeting() {
    
    var fdsvalidates= this.checkInputValidate(".inputTitle")&&this.checkInputValidate(".inputStart")&&this.checkInputValidate(".inputEnd")&&this.checkInputValidate(".inputDate");
    
    if(fdsvalidates){
       return this.validateDates();
    }
    
    return false; 

  }
  validateDates(){
    let dateStart = new Date(this.selectedEvt.day+' '+this.selectedEvt.starttime.substring(0,8));
    let dateEnd = new Date(this.selectedEvt.day+' '+this.selectedEvt.endtime.substring(0,8));
    if(dateEnd<=dateStart){
        
        let inputCmp = this.template.querySelector(".inputEnd"); 
        inputCmp.setCustomValidity("Start time must be before End time");
        inputCmp.reportValidity(); 
       
        return false;

    }
    return true;
  }

  handlePopulateSlots(event) {
    var dateStart = new Date("2020-06-01T09:00:00");
    var dateEnd = new Date("2020-06-01T09:30:00");

    var dateStart1 = new Date("2020-06-01T09:30:00");
    var dateEnd1 = new Date("2020-06-01T10:00:00");

    var dateStart2 = new Date("2020-06-01T10:00:00");
    var dateEnd2 = new Date("2020-06-01T10:30:00");

    this.calendar.addEvent({
      id: "1",
      title: "slot full",
      start: dateStart,
      end: dateEnd,
      allDay: false,
      editable: false,
      borderColor: "red",
      backgroundColor: "WhiteSmoke",
      textColor: "black"
    });

    this.calendar.addEvent({
      id: "2",
      title: "slot avaiable",
      start: dateStart1,
      end: dateEnd1,
      allDay: false,
      editable: false,
      borderColor: "blue",
      backgroundColor: "Aquamarine",
      textColor: "black"
    });
    this.calendar.addEvent({
      id: "3",
      title: "slot avaiable",
      start: dateStart2,
      end: dateEnd2,
      allDay: false,
      editable: false,
      borderColor: "blue",
      backgroundColor: "Aquamarine",
      textColor: "black"
    });

    //this.calendar.addEventSource(this.events);
  }

  
  connectedCallback() {
    
    this.initLoadFullCalendarScript();



  }

  loadObjectEvents(){
    window.clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => {
        retriveMeetings({
            objectApi:this.objectApi
        })
        .then(result => {
          
            console.log('my records:'+JSON.stringify(result));
            this.evtrecords = result;
            this.error = undefined;
            var evts = this.tranformToFullCalendarFormat(result);
            this.initialiseFullCalendarData(evts);
          
        })
        .catch(error =>{
           
            this.error=error;
            this.evtrecords = undefined;
            this.isLoading=false;
        })

        

    })
  }

  convertDateWithOffset(strDate){
    
    
    let offset=this.getTimeZoneOffset(new Date(strDate),this.timeZone);
    //console.log('=====offset in mins:'+offset/60/1000);
    return new Date(new Date(strDate).getTime() + offset);

  }
  getTimeZoneOffset2(){
    
    //var now = moment();
    //console.log('=========getTimeZoneOffset2');
    //var localOffset = now.utcOffset();
    //now.tz(this.timeZone); // your time zone, not necessarily the server's
    //var centralOffset = now.utcOffset();
    //return  localOffset - centralOffset;
  }

  getTimeZoneOffset(date,tz){
   
    var invdate = new Date(date.toLocaleString('en-US', {
      timeZone: tz
    }));
  

    return invdate.getTime()-date.getTime();
  
    



    //let iso = date.toLocaleString('en-CA', { tz, hour12: false }).replace(', ', 'T');
  
    //iso += '.' + date.getMilliseconds().toString().padStart(3, '0');
  
    //const lie = new Date(iso + 'Z');
  
    //return -(lie - date) / 60 / 1000;
  }

  tranformToFullCalendarFormat (result){
    var eventArr = [];
   // let offset=this.getTimeZoneOffset();


    let minutes=-180;

    for(var i = 0;i < result.length;i++){
      let st =new Date(result[i].startdate);
      let ed =new Date(result[i].enddate);
        eventArr.push({
            title: result[i].title,
            id:result[i].id,
            start: this.convertDateWithOffset(result[i].startdate),
            end: this.convertDateWithOffset(result[i].enddate),
            allDay: false
        });

    }
    
    return eventArr;
  }


  initLoadFullCalendarScript() {

    if (this.scriptInitialized) {
        return;
      }
      this.scriptInitialized = true;
      if (this.UITheme) {
        if (this.UITheme !== "Theme4t" || this.UITheme !== "Theme4d") {
          this.isLightning = false;
        }
      }
  
      Promise.all([
        loadStyle(this, resourceCal + "/core/main.css"),
        loadStyle(this, resourceCal + "/daygrid/main.css"),
        loadStyle(this, resourceCal + "/timegrid/main.css"),
        loadScript(this, resourceCal + "/core/main.js")
      ]).then(() => {
        Promise.all([
          loadScript(this, resourceCal + "/daygrid/main.js"),
          loadScript(this, resourceCal + "/timegrid/main.js"),
          loadScript(this, resourceCal + "/interaction/main.js"),
          loadScript(this, resourceCal + "/moment/main.js"),
          loadScript(this, resourceCal + "/moment-timezone/main.js")
        ]).then(() => {
          // Third step: calls your calendar builder once the plugins have been also loaded
  
          this.loadObjectEvents();
        });
      });
  }



  initialiseFullCalendarData(evts) {
    console.log('======initialiseFullCalendarData');
    var self = this;
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var Draggable = FullCalendarInteraction.Draggable;

    this.containerEl = this.template.querySelector("div.external-events");

    this.calendarEl = this.template.querySelector("div.fullcalendar");

    this.calendar = new FullCalendar.Calendar(this.calendarEl, {
      plugins: ["interaction", "dayGrid", "timeGrid"],
      header: {
        left: "prev,next,today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      defaultView: "timeGridWeek",
      editable: true,
      droppable: true,
      selectable: true,
      allDaySlot: false,
      eventStartEditable: false,
      eventDurationEditable: false,
      eventClick: function(info) {
        // eslint-disable-next-line no-console
        console.log("eventClick : ", info);
        self.handleEventClick(info);
      },
      select: function(selectionInfo ){
        
        self.handleSelection(selectionInfo);
       
      },
      drop: function(info) {
        console.log(info.dateStr);
        // // is the "remove after drop" checkbox checked?
        // if (checkbox.checked) {
        //     // if so, remove the element from the "Draggable Events" list
        info.draggedEl.parentNode.removeChild(info.draggedEl);
        // }
      },
      businessHours: [
        // specify an array instead
        {
          daysOfWeek: [1, 2, 3, 4], // Monday, Tuesday, Wednesday
          startTime: "08:30:00", // 8am
          endTime: "16:00:00" // 4pm
        },
        {
          daysOfWeek: [5], // Thursday, Friday
          startTime: "09:00", // 10am
          endTime: "12:00" // 4pm
        },
        {
          daysOfWeek: [6], // Thursday, Friday
          startTime: "12:00", // 10am
          endTime: "16:00" // 4pm
        }
      ],
      //startTime: "09:00", // a start time (10am in this example)
      //endTime: "18:00", // an end time (6pm in this example)
      minTime: this.minTime,
      maxTime: this.maxTime,
      events: evts
    });

    this.draggable = new FullCalendarInteraction.Draggable(this.containerEl, {
      itemSelector: ".fc-event",
      eventData: function(eventEl) {
        return {
          title: eventEl.innerText
        };
      }
    });

    this.calendar.render();
  }

  formatSelectedMeeting(mt){
    this.selectedEvt.id=mt.id;
    this.selectedEvt.title=mt.title;
    this.selectedEvt.status='update';
    
   
    this.selectedEvt.day = this.formatDateValue(mt.start);
 
    
    this.selectedEvt.starttime=this.formatDateTimeValue(mt.start);
   // ("0" + mt.start.getHours()).slice(-2) + ":" + ("0" + mt.start.getMinutes()).slice(-2) + ":" + ("0" + mt.start.getSeconds()).slice(-2)+'.000Z';

    this.selectedEvt.endtime=this.formatDateTimeValue(mt.end);

    //("0" + mt.end.getHours()).slice(-2) + ":" + ("0" + mt.end.getMinutes()).slice(-2) + ":" + ("0" + mt.end.getSeconds()).slice(-2)+'.000Z';

    console.log('strday:'+this.selectedEvt.day);
    console.log('start:'+this.selectedEvt.starttime);
    console.log('end:'+this.selectedEvt.endtime);

  }

  formatDateValue(dt){
    return dt.getFullYear() + "-" +  ("0"+(dt.getMonth()+1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2);
  }
  formatDateTimeValue(dt){
    return ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2) + ":" + ("0" + dt.getSeconds()).slice(-2)+'.000';
  }
  handleSelection(selectionInfo){
      if(this.checkSameDayBooking(selectionInfo.start,selectionInfo.end)){
        this.selectedEvt=[];
   
        this.selectedEvt.status='new';
        this.selectedEvt.day = this.formatDateValue(selectionInfo.start);
        this.selectedEvt.starttime=this.formatDateTimeValue(selectionInfo.start);
        this.selectedEvt.endtime=this.formatDateTimeValue(selectionInfo.end);
        console.log(this.formatDateTimeValue(selectionInfo.end));
        this.openModal();

      }
      else{
          alert('Must be same day booking');
      }
    
  }


  handleEventClick(info) {
    console.log('info.start'+info.event.start);
      this.formatSelectedMeeting(info.event);
      this.currentEvent = info.event;
      this.openModal();
   
  }
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  createCalendarEntry(mt) {

    console.log('========='+mt.startdate);
    console.log('====new====='+new Date(mt.startdate));
    this.calendar.addEvent({
        title: mt.title,
        id:mt.id,
        start: this.convertDateWithOffset(mt.startdate),
        end: this.convertDateWithOffset(mt.enddate),
        allDay: false
      });


  }

  updateCalendarEntry(mt) {
   
  
    this.currentEvent.setProp("title", mt.title);
    this.currentEvent.setDates( this.convertDateWithOffset(mt.startdate), this.convertDateWithOffset(mt.enddate) );
   
    //this.calendar.refetchEvents();
   
  }

  handleFormInputChange(event){
    
    this.selectedEvt[event.target.name] = event.target.value;
     
  }

  handleSubmitBooking(){
    var validation =this.validateMeeting();

    if(validation){
        this.submitBooking();
    }
  }


  submitBooking() {
    

    this.isLoading=true;
    var start_time=this.selectedEvt.day+' '+this.selectedEvt.starttime.substring(0,8);
    var end_time=this.selectedEvt.day+' '+this.selectedEvt.endtime.substring(0,8);

    window.clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => {
        submitMeeting({
            objectApi:this.objectApi,
            title:this.selectedEvt.title,
            starttime:start_time,
            endtime:end_time,
            id:this.selectedEvt.id
        })
        .then(result => {
            //alert('ok'+result.mt.startdate);
           
        //this.currentEvent.setProp("title", this.result.mt.title);
       
        //this.calendar.refetchEvents();

        let message;
        if(this.selectedEvt.status==='update'){
            this.updateCalendarEntry(result.mt);
            message ='Meeting updated successfully';
        }
        if(this.selectedEvt.status==='new'){
            this.createCalendarEntry(result.mt);
            message ='Meeting booked successfully';
        }
        this.showSuccessToast('Success',message);
        this.isModalOpen = false;
        this.isLoading=false;
           
        })
        .catch(error =>{
           alert('has error');
            this.error=error;
            this.isModalOpen = false;
            this.isLoading=false;
        })

        

    })

    
  }
  checkSameDayBooking(dt1,dt2){
    return dt1.getFullYear() === dt2.getFullYear() &&dt1.getMonth() === dt2.getMonth() && dt1.getDate() === dt2.getDate();
  }
  showSuccessToast(title, message) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: "success",
      mode: "dismissable"
    });
    this.dispatchEvent(evt);
  }
}