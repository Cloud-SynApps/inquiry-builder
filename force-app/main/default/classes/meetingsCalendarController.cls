public class meetingsCalendarController {
   public static String dtFormat = 'EEE, d MMM yyyy HH:mm:ss z';
    
    public class resultWrapper{
         @AuraEnabled public String status;
         @AuraEnabled public String message;
         @AuraEnabled public CalendarEntry mt;
        resultWrapper(string message){
            this.status='error';
            this.message=message;
        }
        resultWrapper(CalendarEntry mt){
            this.status='ok';
            this.message='ok';
            this.mt=mt;
        }
    }
    
    
    public class CalendarEntry{
        
        @AuraEnabled public String startdate;
        @AuraEnabled public String enddate;
        @AuraEnabled public String title;
        @AuraEnabled public String id;
        
        public CalendarEntry(string id,string title,string startdate,string enddate){
            this.id=id;
            this.startdate=startdate;
            this.enddate=enddate;
            this.title=title;
        }
        
    }

    private static map<String,String> getObjectMap(String objApi){
        map<String,String> objmap= new map<String,String>();
        if(objApi=='Meeting__c'){
            objmap.put('title', 'Name');
            objmap.put('start', 'Start_Date__c');
            objmap.put('end', 'End_Date__c');
            objmap.put('otherfields', 'owner,owner.id');
        }
        return objmap;
    }

    private static integer getOffsetMinutes(){
        return 0;
    }

    @AuraEnabled
    public static list<CalendarEntry> retrieveMeetings(String objectApi){
        TimeZone tz = UserInfo.getTimeZone();
        
		DateTime dtpre = DateTime.newInstanceGMT(2014, 11, 2, 5, 59, 59);
		Long milliseconds =tz.getOffset(dtpre);
        System.debug('Display name: ' + tz.getDisplayName());

        
        
        Datetime now = Datetime.now();
		Integer offset = getOffsetMinutes();
        
        
        
        
        Long seconds = offset / 1000;
	    Long minutes = seconds / 60;
        
        
        system.debug('==='+minutes);
        list<CalendarEntry> calendarEntries= new list<CalendarEntry>();
        
        map<string,string> objmaping= getObjectMap(objectApi);
        
        string[] fields= new string[]{objmaping.get('title'),objmaping.get('start'),objmaping.get('end')};
        
        String query='Select Id,'+ String.join( fields, ',' )+' from '+objectApi;
        
        list<sObject> meetings =database.query(query);
        for(sObject mt:meetings){
            CalendarEntry entry=generateCalendarEntry(mt,objmaping,offset);
            calendarEntries.add(entry);
        }
        return calendarEntries;
    }
    
    private static string generateQuery(string objectApi,map<string,string> objmaping){
        set<string> uniqfields= new set<string>{objmaping.get('title'),objmaping.get('start'),objmaping.get('end')};
            
        uniqfields.add('Id');
        if(objmaping.containskey('otherfields')&&objmaping.get('otherfields')!=''){
            string[] ofds= objmaping.get('otherfields').split(',');   
            uniqfields.addall(ofds);
        }   
        
        list<string> fields=new list<string>(uniqfields);
        
        String query='Select '+ String.join( fields, ',' )+' from '+objectApi;
        
        
        return query;
    }
    
    
    private static CalendarEntry generateCalendarEntry(sObject mt,map<string,string> objmaping,integer offset){
       
        
        string title=string.valueof(mt.get(objmaping.get('title')));
        datetime start_date=datetime.valueof(mt.get(objmaping.get('start'))).addMinutes(offset);
        datetime end_date=datetime.valueof(mt.get(objmaping.get('end'))).addMinutes(offset);
        
        string startdate=start_date.format(dtFormat);
        string enddate=end_date.format(dtFormat);
        
        system.debug(mt.get('Name')+'---start:'+startdate+'  end :'+enddate);
        return new CalendarEntry(mt.Id,title,startdate,enddate);
    }
    @AuraEnabled 
    public static map<string,string> deleteMeeting(String objectApi,String id){
        String query='Select Id from '+objectApi +' where id=:id';
        try{
            sObject rec = database.query(query);
            delete rec;
            return new map<string,string>{'status'=>'ok'};
        }
        catch(Exception e){
            return new map<string,string>{'status'=>'error','message'=>'has error'};
        }
        
    }
    
    @AuraEnabled
    public static resultWrapper submitMeeting(String objectApi,String title,String starttime, String endtime, String id){
        
      
        map<string,string> objmaping= getObjectMap(objectApi);
             
      
        Datetime start_date= Datetime.valueOf(starttime);
        Datetime end_date= Datetime.valueOf(endtime);
        Integer offset = getOffsetMinutes();
        
      
              
        try{
            sObject meeting = Schema.getGlobalDescribe().get(objectApi).newSObject() ;
           
            
            meeting.put(objmaping.get('title'), title);
            meeting.put(objmaping.get('start'), start_date);
            meeting.put(objmaping.get('end'), end_date);
            
            
            
            if(String.isNotBlank(id)){
                meeting.put('Id', id);
                update meeting;
            }
            else{
                insert meeting;
            }
        
        	CalendarEntry entry=generateCalendarEntry(meeting,objmaping,offset);
            return new resultWrapper(entry);
    }
        catch(Exception e){
            return new resultWrapper('has error');
        }
    }
    
    

    

}