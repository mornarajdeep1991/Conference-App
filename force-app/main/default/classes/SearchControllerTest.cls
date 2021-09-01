@isTest
private class SearchControllerTest {
    static testmethod void method1(){
        List<String> fieldsList = new List<String>{'Name','Phone','Rating'};
        SearchController.search('Account',fieldsList,'test');
        
    }
}