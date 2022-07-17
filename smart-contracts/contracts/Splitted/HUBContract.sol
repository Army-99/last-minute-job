// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

interface InterfaceHUBContract {
    function CheckIsCompany() external view returns(bool);
    function CheckIsPerson() external view returns(bool);
    function AddJob(uint _publicJobID) external;
    function GetCompany(address _address) external view returns (bool, string memory, string memory, string memory);
    function GetPerson (address _address) external view returns (bool, string memory, string memory, uint, string memory, string memory, string memory, string memory);
}


contract HUBContract {

    struct Company{
        bool registered;
        string name;
        string description;
        string headquarters;
        mapping (uint => uint) jobs;
        uint counterJobs;
        mapping(uint => uint) sendedRequests;
        uint counterSendedRequests;
    }

    struct Person{
        bool registered;
        string name;
        string surname;
        uint age;
        string mobilePhone;
        string CV;
        string coverLetter;
        string searchingPosition;
        mapping(uint => uint) appliedJob;
        uint counterAppliedJob;
        mapping(uint => uint) incomingRequests;
        uint counterIncomingRequests;
    }

    event ev_CreateCompany(string,address);
    event ev_CreatePerson(string, string, address);

    mapping(address => Company) internal companies;
    mapping(uint => address) internal companiesAddress;
    uint internal counterCompanies;

    mapping(address => Person) internal persons;
    mapping(uint => address) internal personsAddress;
    uint internal counterPersons;

    modifier onlyCompany(){
        require(companies[msg.sender].registered,"Not Company!");
        _;
    }

    modifier onlyPerson(){
        require(persons[msg.sender].registered);
        _;
    }

    function CreateCompany(string memory _name, string memory _description, string memory _address) external{
        require(!companies[msg.sender].registered,"You're already registerd!");

        companies[msg.sender].registered=true;
        companies[msg.sender].name=_name;
        companies[msg.sender].description=_description;
        companies[msg.sender].headquarters=_address;

        companiesAddress[counterCompanies]=msg.sender;

        counterCompanies++;
        emit ev_CreateCompany(_name,msg.sender);
    }

    function CreatePerson(string memory _name,string memory _surname,uint _age,string memory _mobilePhone, string memory _CV, string memory _coverLetter, string memory _searchingPosition) external{
        require(!persons[msg.sender].registered,"You're already registerd!");
        Person storage newPerson = persons[msg.sender];
        newPerson.registered=true;
        newPerson.name=_name;
        newPerson.surname=_surname;
        newPerson.age=_age;
        newPerson.mobilePhone=_mobilePhone;
        newPerson.CV=_CV;
        newPerson.coverLetter=_coverLetter;
        newPerson.searchingPosition=_searchingPosition;

        personsAddress[counterPersons]=msg.sender;

        counterPersons++;
        emit ev_CreatePerson(_name,_surname,msg.sender);
    }

    function CheckIsCompany() external view returns(bool){
        return(companies[msg.sender].registered);
    }

    function CheckIsPerson() external view returns(bool){
        return(persons[msg.sender].registered);
    }

    function GetCompaniesCounter() external view returns (uint){
        return(counterCompanies);
    }

    function GetPersonsCounter() external view returns (uint){
        return(counterPersons);
    }

    function AddJob(uint _publicJobID) external onlyCompany{
        Company storage company = companies[msg.sender];
        company.jobs[company.counterJobs]=_publicJobID;
        company.counterJobs++;
    }

    function AddRequest(uint _publicRequestID) external onlyCompany{

    }

    function GetCompany (address _address) external view returns (bool, string memory, string memory, string memory){
        Company storage company = companies[_address];
        return( company.registered,  company.name,  company.description, company.headquarters ) ;
    }

    function GetPerson (address _address) external view returns ( string memory, string memory, uint, string memory, string memory, string memory, string memory ){
        Person storage person = persons[_address];
        return( person.name, person.surname, person.age, person.mobilePhone, person.CV, person.coverLetter, person.searchingPosition);
    }
    
}