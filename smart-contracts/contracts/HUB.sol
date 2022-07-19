// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

interface InterfaceHUB {
    function SetContractJobAddress(address _contractJOB) external;
    function SetContractRequestAddress(address _contractREQUEST) external;
    function CreateCompany(string memory _name, string memory _description, string memory _address) external;
    function CreateWorker(string memory _name,string memory _surname,uint _age,string memory _mobilePhone, string memory _CV, string memory _coverLetter) external;
    function CheckCompany(address sender) external view returns(bool);
    function CheckWorker(address sender) external view returns(bool);
    function GetCompaniesCounter() external view returns (uint);
    function GetWorkersCounter() external view returns (uint);
    function ShowWorker(address _address) external view returns(bytes memory);
    function ShowWorkerID(uint _nrWorker) external view returns(address);
    function ShowCompany(uint _nrCompany) external view returns(string memory, string memory, string memory);
    function ShowCompanyJobsCounter(address sender) external view returns(uint);
    function ShowWorkerAppliedJobsCounter(address sender) external view returns(uint);
    function ShowCompanyCounterRequests(address sender) external view returns(uint); 
    function ShowWorkerCounterRequests(address sender) external view returns(uint);
    function ShowJobIDCompany(address sender, uint _nrJobCreated) external view returns(uint);
    function ShowJobIDWorker(address sender, uint _nrJobApplied) external view returns(uint);
    function ShowRequestIDCompany(address sender, uint _nrCompanyRequest) external view returns(uint);
    function ShowRequestIDWorker(address sender, uint _nrPersonRequest) external view returns(uint);
    function AddCompanyJob(address sender, uint _jobID) external;
    function AddWorkerJobApplied (address sender, uint _jobID) external;
    function AddCompanyRequest(address sender, uint _jobID) external;
    function AddWorkerRequest(address _destination, uint _jobID) external;
}

contract HUB is Ownable{
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

    struct Worker{
        bool registered;
        bytes name;
        bytes surname;
        bytes age;
        bytes mobilePhone;
        bytes CV;
        bytes coverLetter;
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

    mapping(address => Worker) internal workers;
    mapping(uint => address) internal workersAddress;
    uint internal counterworkers;

    address internal contractJOB;
    address internal contractREQUEST;

    //To prevent the possibility that someone in addition to the contract job could add a job, same for request
    modifier onlyJobContract() {
        require(msg.sender == contractJOB,"Not contract JOB");
        _;
    }

    modifier onlyRequestContract() {
        require(msg.sender == contractREQUEST,"Not contract REQUEST");
        _;
    }

    function SetContractJobAddress(address _contractJOB) external onlyOwner{
        contractJOB=_contractJOB;
    }

    function SetContractRequestAddress(address _contractREQUEST) external onlyOwner{
        contractREQUEST=_contractREQUEST;
    }

    function CreateCompany(string memory _name, string memory _description, string memory _address) external{
        require(!companies[msg.sender].registered,"You're already registerd!");
        Company storage newCompany = companies[msg.sender];

        newCompany.registered=true;
        newCompany.name=_name;
        newCompany.description=_description;
        newCompany.headquarters=_address;

        companiesAddress[counterCompanies]=msg.sender;
        counterCompanies++;

        emit ev_RegisterAsCompany(_name,msg.sender);
    }

    function CreateWorker(string memory _name,string memory _surname,uint _age,string memory _mobilePhone, string memory _CV, string memory _coverLetter) external{
        require(!workers[msg.sender].registered,"You're already registerd!");
        //Converted in Bytes32 to pass parameters to CloseRequest in RequestContract
        bytes memory name = abi.encode(_name);
        bytes memory surname = abi.encode(_surname);
        bytes memory age = abi.encode(_age);
        bytes memory mobilePhone = abi.encode(_mobilePhone);
        bytes memory CV = abi.encode(_CV);
        bytes memory coverLetter = abi.encode(_coverLetter);

        Worker storage newPerson = workers[msg.sender];
        newPerson.registered=true;
        newPerson.name=name;
        newPerson.surname=surname;
        newPerson.age=age;
        newPerson.mobilePhone=mobilePhone;
        newPerson.CV=CV;
        newPerson.coverLetter=coverLetter;

        workersAddress[counterworkers]=msg.sender;
        counterworkers++;

        emit ev_RegisterAsPerson(_name,_surname,msg.sender);
    }

    function CheckCompany(address sender) external view returns(bool){
        return(companies[sender].registered);
    }

    function CheckWorker(address sender) external view returns(bool){

        return(workers[sender].registered);
    }

    function GetCompaniesCounter() external view returns (uint){
        return(counterCompanies);
    }

    function GetWorkersCounter() external view returns (uint){
        return(counterworkers);
    }

    function ShowWorker(address _address) external view returns(bytes memory) {
        Worker storage person = workers[_address];
        return (abi.encode(person.name, person.surname, person.age, person.mobilePhone, person.CV, person.coverLetter));
    }

    function ShowWorkerID(uint _nrWorker) external view returns(address) {
        return(workersAddress[_nrWorker]);
    }

    function ShowCompany(uint _nrCompany) external view returns(string memory, string memory, string memory) {
        Company storage company = companies[ companiesAddress[_nrCompany] ];
        return(company.name,company.description,company.headquarters);
    }

    function ShowCompanyJobsCounter(address sender) external view returns(uint){
        Company storage company = companies[sender];
        return (company.counterJobs);
    }

    function ShowWorkerAppliedJobsCounter(address sender) external view returns(uint){
        return(workers[sender].counterAppliedJob);
    }

    function ShowCompanyCounterRequests(address sender) external view returns(uint) {
        return(companies[sender].counterSendedRequests);
    }

    function ShowWorkerCounterRequests(address sender) external view returns(uint) {
        return(workers[sender].counterIncomingRequests);
    }

    function ShowJobIDCompany(address sender, uint _nrJobCreated) external view returns(uint) {
        require(_nrJobCreated < companies[sender].counterJobs,"Job not found");
        return (companies[sender].jobs[_nrJobCreated]);
    }

    function ShowJobIDWorker(address sender, uint _nrJobApplied) external view returns(uint) {
        require( _nrJobApplied < workers[sender].counterAppliedJob ,"Job not found");
        return (workers[sender].appliedJob[_nrJobApplied]);
    }

    function ShowRequestIDCompany(address sender, uint _nrCompanyRequest) external view returns(uint) {
        require(_nrCompanyRequest<companies[sender].counterSendedRequests,"Request not found!");
        return(companies[sender].sendedRequests[_nrCompanyRequest]);
    }

    function ShowRequestIDWorker(address sender, uint _nrPersonRequest) external view returns(uint) {
        require(_nrPersonRequest<workers[sender].counterIncomingRequests,"Request not found!");
        return(workers[sender].incomingRequests[_nrPersonRequest]);
    }

    function AddCompanyJob(address sender, uint _jobID) external onlyJobContract{
        Company storage company = companies[sender];
        company.jobs[company.counterJobs]=_jobID;
        company.counterJobs++;
    }

    function AddWorkerJobApplied (address sender, uint _jobID) external onlyJobContract{
        Worker storage person = workers[sender];
        person.appliedJob[person.counterAppliedJob]=_jobID;
        person.counterAppliedJob++;
    }

    function AddCompanyRequest(address sender, uint _jobID) external onlyRequestContract{
        Company storage company = companies[sender];
        company.sendedRequests[company.counterSendedRequests] = _jobID;
        company.counterSendedRequests++;
    }

    function AddWorkerRequest(address _destination, uint _jobID) external onlyRequestContract{
        Worker storage destination = workers[_destination];
        destination.incomingRequests[destination.counterIncomingRequests] = _jobID;
        destination.counterIncomingRequests++;
    }
}

