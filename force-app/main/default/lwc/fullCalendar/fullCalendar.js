import { track, api, LightningElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";

import { NavigationMixin } from "lightning/navigation";
import resourceCal from "@salesforce/resourceUrl/fullcalendar";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getEvents from "@salesforce/apex/CalendarController.getEvents";

export default class fullCalendar extends NavigationMixin(LightningElement) {
  @api UITheme;
  @track isLightning = true;

  scriptInitialized = false;
  @track calendar;
  @track calendarEl;
  @track draggable;
  @track containerEl;
  @track SC = {};
  isModalOpen = false;
  @track currentEvent;
  @track events;

  connectedCallback2() {
    var dateStart = new Date("2020-06-01T09:00:00");
    var dateEnd = new Date("2020-06-01T09:30:00");

    var dateStart1 = new Date("2020-06-01T09:30:00");
    var dateEnd1 = new Date("2020-06-01T10:00:00");

    var dateStart2 = new Date("2020-06-01T10:00:00");
    var dateEnd2 = new Date("2020-06-01T10:30:00");

    this.events = [
      {
        id: "1",
        title: "slot full",
        start: dateStart,
        end: dateEnd,
        allDay: false,
        editable: false,
        borderColor: "red",
        backgroundColor: "WhiteSmoke",
        textColor: "black"
      },
      {
        id: "2",
        title: "slot avaiable",
        start: dateStart1,
        end: dateEnd1,
        allDay: false,
        editable: false,
        borderColor: "blue",
        backgroundColor: "Aquamarine",
        textColor: "black"
      },
      {
        id: "3",
        title: "slot avaiable",
        start: dateStart2,
        end: dateEnd2,
        allDay: false,
        editable: false,
        borderColor: "blue",
        backgroundColor: "Aquamarine",
        textColor: "black"
      }
    ];
  }

  handleEventAddClick(event) {
    var dateStr = prompt("Enter a date in YYYY-MM-DD format");
    //var dateStr = "2020-05-01";
    var date = new Date(dateStr + "T00:00:00");

    if (!isNaN(date.valueOf())) {
      this.calendar.addEvent({
        title: "dynamic event",
        start: date,
        allDay: true
      });
    } else {
      alert("Invalid date.");
    }
  }

  handlePopulateSlots(event) {
    //console.log("=====handlePopulateSlots======");
    var dateStart = new Date("2020-06-08T09:00:00");
    var dateEnd = new Date("2020-06-08T09:30:00");

    var dateStart1 = new Date("2020-06-08T09:30:00");
    var dateEnd1 = new Date("2020-06-08T10:00:00");

    var dateStart2 = new Date("2020-06-08T10:00:00");
    var dateEnd2 = new Date("2020-06-08T10:30:00");

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

  //renderedCallback() {
  connectedCallback() {
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
        loadScript(this, resourceCal + "/interaction/main.js")
      ]).then(() => {
        // Third step: calls your calendar builder once the plugins have been also loaded

        this.initialiseFullCalendar();
      });
    });
  }

  initialiseFullCalendar() {
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
        right: "timeGridWeek,timeGridDay"
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
      minTime: "08:00:00",
      maxTime: "16:00:00" //,
      // events: self.retrieveEvents
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

  handleEventClick(info) {
    console.log("===handleEventClick===");
    console.log(info);
    if (info.event.title === "slot avaiable") {
      this.currentEvent = info.event;
      this.openModal();
    } else {
      this.currentEvent = null;
    }
  }
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  handleSubmitBooking() {
    console.log("==== handleSubmitBooking=====");
    this.currentEvent.setProp("backgroundColor", "WhiteSmoke");
    this.currentEvent.setProp("title", "slot full");
    this.currentEvent.setProp("borderColor", "red");

    this.calendar.refetchEvents();
    this.showSuccessToast();
    this.isModalOpen = false;
  }

  showSuccessToast() {
    const evt = new ShowToastEvent({
      title: "Booking successful",
      message: "Booking successful",
      variant: "success",
      mode: "dismissable"
    });
    this.dispatchEvent(evt);
  }

  retrieveEvents() {
    console.log("====== retrieveEvents=====");

    getEvents().then(result => {
      console.group(result);
    });
  }
}