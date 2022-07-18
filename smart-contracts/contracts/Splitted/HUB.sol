// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface InterfaceHUB {
    function CreateCompany(address sender, string memory _name, string memory _description, string memory _address) external;
    function CreatePerson(address sender, string memory _name,string memory _surname,uint _age,string memory _mobilePhone, string memory _CV, string memory _coverLetter) external;
    function CheckCompany(address sender) external view returns(bool);
    function CheckPerson(address sender) external view returns(bool);
    function GetCompaniesCounter() external view returns (uint);
    function GetPersonsCounter() external view returns (uint);
    function ShowPerson(uint _nrWorker) external view returns(string memory, string memory, uint, string memory, string memory, string memory, address);
    function ShowCompany(uint _nrCompany) external view returns(string memory, string memory, string memory);
    function ShowCompanyJobsCounter(address sender) external view returns(uint);
    function ShowAppliedJobsCounter(address sender) external view returns(uint);
    function ShowCompanyCounterRequests(address sender) external view returns(uint);
    function ShowPersonCounterRequests(address sender) external view returns(uint);
    function ShowJobIDCompany(address sender, uint _nrJobCreated) external view returns(uint);
    function ShowJobAppliedIDPerson(address sender, uint _nrJobApplied) external view returns(uint);
    function ShowRequestIDCompany(address sender, uint _nrCompanyRequest) external view returns(uint);
    function ShowRequestIDPerson(address sender, uint _nrPersonRequest) external view returns(uint);
    function AddCompanyJob(address sender, uint _jobID) external;
    function AddPersonJobApplied (address sender, uint _jobID) external;
    function AddCompanyRequest(address sender, uint _jobID) external;
    function AddPersonRequest(address destination, uint _jobID) external;
}

contract HUB {
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
        mapping(uint => uint) appliedJob;
        uint counterAppliedJob;
        mapping(uint => uint) incomingRequests;
        uint counterIncomingRequests;
    }

    event ev_RegisterAsCompany(string,address);
    event ev_RegisterAsPerson(string, string, address);

    mapping(address => Company) internal companies;
    mapping(uint => address) internal companiesAddress;
    uint internal counterCompanies;

    mapping(address => Person) internal persons;
    mapping(uint => address) internal personsAddress;
    uint internal counterPersons;

    address contractJOB;
    address contractREQUEST;

    //To prevent the possibility that someone in addition to the contract job could add a job, same for request
    //ADD ONLY OWNER
    function SetContractJobAddress(address _contractJOB) {
        contractJOB=_contractJOB;
    }

    function SetContractRequestAddress(address _contractREQUEST) {
        contractREQUEST=_contractREQUEST;
    }

    modifier onlyJobContract() {
        require(msg.sender == contractJOB,"Not contract JOB");
        _;
    }

    modifier onlyRequestContract() {
        require(msg.sender == contractREQUEST,"Not contract REQUEST");
        _;
    }



    modifier onlyCompany(){
        require(companies[msg.sender].registered,"Not Company!");
        _;
    }

    modifier onlyPerson(){
        require(persons[msg.sender].registered);
        _;
    }

    function CreateCompany(address sender, string memory _name, string memory _description, string memory _address) external{
        require(!companies[sender].registered,"You're already registerd!");
        Company storage newCompany = companies[sender];

        newCompany.registered=true;
        newCompany.name=_name;
        newCompany.description=_description;
        newCompany.headquarters=_address;

        companiesAddress[counterCompanies]=sender;
        counterCompanies++;

        emit ev_RegisterAsCompany(_name,sender);
    }

    function CreatePerson(address sender, string memory _name,string memory _surname,uint _age,string memory _mobilePhone, string memory _CV, string memory _coverLetter) external{
        require(!persons[sender].registered,"You're already registerd!");
        Person storage newPerson = persons[sender];
        newPerson.registered=true;
        newPerson.name=_name;
        newPerson.surname=_surname;
        newPerson.age=_age;
        newPerson.mobilePhone=_mobilePhone;
        newPerson.CV=_CV;
        newPerson.coverLetter=_coverLetter;

        personsAddress[counterPersons]=sender;
        counterPersons++;

        emit ev_RegisterAsPerson(_name,_surname,sender);
    }

    function CheckCompany(address sender) external view returns(bool){
        return(companies[sender].registered);
    }

    function CheckPerson(address sender) external view returns(bool){
        return(persons[sender].registered);
    }

    function GetCompaniesCounter() external view returns (uint){
        return(counterCompanies);
    }

    function GetPersonsCounter() external view returns (uint){
        return(counterPersons);
    }

    function ShowPerson(uint _nrWorker) external view returns(string memory, string memory, uint, string memory, string memory, string memory, address) {
        Person storage person = persons[personsAddress[_nrWorker]];
        address wallet = personsAddress[_nrWorker];
        return(person.name, person.surname, person.age, person.mobilePhone, person.CV, person.coverLetter, wallet);
    }

    function ShowCompany(uint _nrCompany) external view returns(string memory, string memory, string memory) {
        Company storage company = companies[personsAddress[_nrWorker]];
        return(company.name,company.description,company.headquarters);
    }

    function ShowCompanyJobsCounter(address sender) external view returns(uint){
        Company storage company = companies[sender];
        return (company.counterJobs);
    }

    function ShowAppliedJobsCounter(address sender) external view returns(uint){
        return(persons[sender].counterAppliedJob);
    }

    function ShowCompanyCounterRequests(address sender) external view returns(uint) {
        return(companies[sender].counterSendedRequests);
    }

    function ShowPersonCounterRequests(address sender) external view returns(uint) {
        return(persons[sender].counterIncomingRequests);
    }

    function ShowJobIDCompany(address sender, uint _nrJobCreated) external view returns(uint) {
        require(_nrJobCreated < companies[sender].counterJobs,"Job not found");
        return (companies[sender].jobs[_nrJobCreated]);
    }

    function ShowJobAppliedIDPerson(address sender, uint _nrJobApplied) external view returns(uint) {
        require(_nrAppliedJob < persons[sender].counterAppliedJob,"Job not found");
        return (persons[sender].appliedJob[_nrJobApplied]);
    }

    function ShowRequestIDCompany(address sender, uint _nrCompanyRequest) external view returns(uint) {
        require(_nrCompanyRequest<companies[sender].counterSendedRequests,"Request not found!");
        return(companies[sender].sendedRequests[_nrCompanyRequest]);
    }

    function ShowRequestIDPerson(address sender, uint _nrPersonRequest) external view returns(uint) {
        require(_nrPersonRequest<persons[sender].counterIncomingRequests,"Request not found!");
        return(persons[sender].incomingRequests[_nrPersonRequest]);
    }

    function AddCompanyJob(address sender, uint _jobID) external onlyJobContract{
        Company storage company = companies[sender];
        company.jobs[company.counterJobs]=counterJobs;
        company.counterJobs++;
    }

    function AddPersonJobApplied (address sender, uint _jobID) external onlyJobContract{
        Person storage person = persons[sender];
        person.appliedJob[person.counterAppliedJob]=_nrJob;
        person.counterAppliedJob++;
    }

    function AddCompanyRequest(address sender, uint _jobID) external onlyRequestContract{
        Company storage company = companies[msg.sender];
        company.sendedRequests[company.counterSendedRequests] = counterRequests;
        company.counterSendedRequests++;
    }

    function AddPersonRequest(address destination, uint _jobID) external onlyRequestContract{
        Person storage destination = persons[_destination];
        destination.incomingRequests[destination.counterIncomingRequests] = counterRequests;
        destination.counterIncomingRequests++;
    }
}