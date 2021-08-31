@isTest
public class TestDataSetup {

public static User createUser(){
    Profile p = [SELECT Id FROM Profile WHERE Name='Standard User']; 
    User u = new User(Alias = 'standt', Email='standarduser@testorg.com', 
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
        LocaleSidKey='en_US', ProfileId = p.Id, 
        TimeZoneSidKey='America/Los_Angeles', UserName='testconference@testorg.com');
    return u;
}
    public static Session__c createSession(){
    Session__c sc = new Session__c();
    sc.Name='test';
    sc.SessionRoom__c='Room1';
    sc.Description__c='test conference';
    sc.SessionDateTime__c = system.now();
    return sc;
}
    public static SessionSpeakers__c createSessionSpeaker(){
    SessionSpeakers__c spkr= new SessionSpeakers__c();
    return spkr;
}

}