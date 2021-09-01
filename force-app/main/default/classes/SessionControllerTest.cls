@isTest
private class SessionControllerTest {
    @testSetup static void setup() {
       User u = TestDataSetup.createUser();   
        insert u;
        Session__c sc = TestDataSetup.createSession();
        insert sc;
        SessionSpeakers__c spkr =  TestDataSetup.createSessionSpeaker();
        spkr.User__c = u.Id;
        spkr.Session__c=sc.Id;
        insert spkr;
    }
    static testmethod void sessionMethod1(){
       List<String> spkrLst = new List<String>();
        Id uid = [select id from user LIMIT 1].Id;
        Id sid = [select id from Session__c LIMIT 1].Id;
        spkrLst.add(uid);
        Test.startTest();
        SessionController.getSessions('test');
        SessionController.getSessions('');
        SessionController.getSession(sid);
        SessionController.getallSessions();
        SessionController.addSpeakers(sid,spkrLst);
        Test.stopTest();
    }
}