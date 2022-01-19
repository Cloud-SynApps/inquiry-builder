public with sharing class TwilioService {
    
    static TwilioSF.TwilioApiClient api;
    
    @AuraEnabled
    public static void sendSMS(String msg){
        setupSMSConnection();
        api.addParam('To','+12042278348');
        api.addParam('From','+17059996988');
        api.addParam('Body',msg);
 		System.debug('Twilio client: ' + api);
        TwilioSF.TwilioApiClientResponse response = api.doPost();
        System.debug('Twilio Respons: ' + response);
    }

    private static void setupSMSConnection(){
        if(api == null){
            api = new TwilioSF.TwilioApiClient('AC05348ee33e40445c58a1e5fc81d478e7','85b1042ff935b99a8e98ce0aa0263b3b');
            api.addUrlPart('Accounts');
            api.addUrlPart('AC05348ee33e40445c58a1e5fc81d478e7');
            api.addUrlPart('Messages.json');
            
        }
    }
}