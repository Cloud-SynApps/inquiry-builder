/**
 * @File Name          : CalendarController.cls
 * @Description        :
 * @Author             : ChangeMeIn@UserSettingsUnder.SFDoc
 * @Group              :
 * @Last Modified By   : ChangeMeIn@UserSettingsUnder.SFDoc
 * @Last Modified On   : 6/7/2020, 12:00:41 AM
 * @Modification Log   :
 * Ver       Date            Author      		    Modification
 * 1.0    6/6/2020   ChangeMeIn@UserSettingsUnder.SFDoc     Initial Version
 **/
public with sharing class CalendarController {
  @AuraEnabled
  public static List<Event> getEvents() {
    List<Event> events = new List<Event>();

    return events;
  }
}