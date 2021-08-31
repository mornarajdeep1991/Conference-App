@isTest
private class SessionControllerTest {
    @testSetup static void setup() {
       User u = TestDataSetup.createUser();   
        insert u;
        Session__c sc = TestDataSetup.createSession();
        sc.Speaker__c=u.Id;
        insert sc;
        SessionSpeakers__c spkr =  TestDataSetup.createSessionSpeaker();
        spkr.User__c = u.Id;
        spkr.Session__c=sc.Id;
        insert spkr;
    }
    static testmethod void sessionMethod1(){
       List<String> spkrLst = new List<String>();
        List<List<String>> spkrsLst = new List<List<String>>();
        Id uid = [select id from user LIMIT 1].Id;
        Id sid = [select id from Session__c LIMIT 1].Id;
        spkrLst.add(uid);
        spkrsLst.add(spkrLst);
        Test.startTest();
        SessionController.getSessions('test');
        SessionController.getSessions('');
        SessionController.getSession(sid);
        SessionController.addSpeakers(sid,spkrsLst);
        Test.stopTest();
    }
}