// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LastMinuteJob is ReentrancyGuard {

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

    struct Job {
        address payable owner;
        uint total;
        string title;
        string description;
        string workingAddress;
        string searchingPosition;
        uint hourInit;                  
        uint hourFinish;                
        uint peopleToHire;
        uint hourlyWage;                
        uint dateFrom;
        uint dateTo;
        bool searching; 
        bool jobFinished;
        mapping (uint => address) hired;
        uint counterHired;
        mapping (address => uint) candidatesUINT;
        mapping(uint => Candidate) candidates;
        uint counterCandidates;
    }

    struct Candidate {
        string name;
        string surname;
        address payable wallet;
        string mobilePhone;
        uint age;
        string CV;
        string coverLetter;
        uint absentHour;
        bool proposalHire;
        bool hired;
    }

    struct Request{
        address owner;
        address destination;
        uint dateFrom;
        uint dateTo;
        uint value;
        uint hourStart;
        uint hourFinish;
        Message [] messages;
        uint8 status; //0 => waiting - 1 => refused - 2=> accepted
        bool isActive;
    }

    struct Message{
        address owner;
        address destination;
        string message;
        uint datetime;
    }

    event ev_RegisterAsCompany(string,address);
    event ev_RegisterAsPerson(string, string, address);
    event ev_CreateJob(address, uint);
    event ev_Hired(uint,address);
    event ev_ClosedSearch(uint);
    event ev_Pay(address, uint);
    event ev_CloseJob(uint);
    event ev_CreateRequest(address, address);
    event ev_SendMessage(address, address);
    event ev_CloseRequest(uint, uint);

    mapping(address => Company) companies;
    mapping(uint => address) companiesAddress;
    uint counterCompanies;
    mapping(address => Person) persons;
    mapping(uint => address) personsAddress;
    uint counterPersons;
    mapping (uint => Job) jobs;
    uint counterJobs;
    mapping(uint => Request) requests;
    uint counterRequests;

    bool internal locked;
    modifier reentrancyGuard() {
     require(!locked);
     locked = true;
      _;
      locked = false;
  }

    modifier onlyCompany(){
        require(companies[msg.sender].registered,"Not Company!");
        _;
    }

    modifier onlyPerson(){
        require(persons[msg.sender].registered);
        _;
    }

    modifier jobOwner(uint _nrJob){
        require(msg.sender== jobs[_nrJob].owner, "You're not the owner");
        _;
    }

    modifier jobSearching(uint _nrJob) {
        require(!jobs[_nrJob].searching, "The job is searching candidates you can't close!");
        _;
    }

    modifier jobNotClose(uint _nrJob) {
        require(!jobs[_nrJob].jobFinished, "The job is already ended");
        _;
    }

    modifier jobExist(uint _nrJob){
        require(0 <= _nrJob && _nrJob < counterJobs, "The job not exist");
        _;
    }

    modifier requestExist(uint _nrRequest){
        require(_nrRequest < counterRequests);
        _;
    }

    function RegisterAsCompany(string memory _name, string memory _description, string memory _address) public{
        require(!companies[msg.sender].registered,"You're already registerd!");

        companies[msg.sender].registered=true;
        companies[msg.sender].name=_name;
        companies[msg.sender].description=_description;
        companies[msg.sender].headquarters=_address;

        companiesAddress[counterCompanies]=msg.sender;

        counterCompanies++;
        emit ev_RegisterAsCompany(_name,msg.sender);
    }

    function CheckIsCompany() public view returns(bool){
        return(companies[msg.sender].registered);
    }

    function GetCompaniesCounter() public view returns (uint){
        return(counterCompanies);
    }

    function RegisterAsPerson(string memory _name,string memory _surname,uint _age,string memory _mobilePhone, string memory _CV, string memory _coverLetter) public{
        require(!persons[msg.sender].registered,"You're already registerd!");
        persons[msg.sender].registered=true;
        persons[msg.sender].name=_name;
        persons[msg.sender].surname=_surname;
        persons[msg.sender].age=_age;
        persons[msg.sender].mobilePhone=_mobilePhone;
        persons[msg.sender].CV=_CV;
        persons[msg.sender].coverLetter=_coverLetter;

        personsAddress[counterPersons]=msg.sender;

        counterPersons++;
        emit ev_RegisterAsPerson(_name,_surname,msg.sender);
    }

    function CheckIsPerson() public view returns(bool){
        return(persons[msg.sender].registered);
    }

    function GetPersonsCounter() public view returns (uint){
        return(counterPersons);
    }

    function CreateJob (string memory _title,
                        string memory _description,
                        string memory _workingAddress,
                        string memory _searchingPosition,
                        uint _hourInit,
                        uint _hourFinish,
                        uint _peopleToHire,
                        uint _dateFrom,
                        uint _dateTo
                        ) public payable onlyCompany{
        require(msg.value>0,"Need sending money for creating a job");
        require(_hourInit>0 && _hourFinish>_hourInit && _dateFrom>0 && _dateTo>_dateFrom && _peopleToHire>0,"The inputs are incorrects");

        uint hoursDaily = (_hourFinish - _hourInit) / 60; 
        uint daysJob = (_dateTo - _dateFrom) / 60 / 60 / 24;
        uint _hourlyWage = msg.value / daysJob / hoursDaily / _peopleToHire;

        Job storage newJob = jobs[counterJobs];
            newJob.owner=payable(msg.sender);
            newJob.total=msg.value;
            newJob.title=_title;
            newJob.description=_description;
            newJob.workingAddress=_workingAddress;
            newJob.searchingPosition=_searchingPosition;
            newJob.hourInit=_hourInit;
            newJob.hourFinish=_hourFinish; 
            newJob.peopleToHire=_peopleToHire;
            newJob.hourlyWage=_hourlyWage;           
            newJob.dateFrom=_dateFrom;
            newJob.dateTo=_dateTo;
            newJob.searching=true;
            newJob.jobFinished=false;      
            newJob.counterHired=0;
            newJob.counterCandidates=0;

        Company storage company = companies[msg.sender];
            company.jobs[company.counterJobs]=counterJobs;
            company.counterJobs++;

        counterJobs++;

        emit ev_CreateJob(msg.sender, msg.value);
    }

    function CheckPersonApplied(uint _nrJob) jobExist(_nrJob) onlyPerson public view returns(bool) {
        Job storage job = jobs[_nrJob];

        if(job.candidates[ job.candidatesUINT[msg.sender] ].wallet==msg.sender)
            return true;
        else
            return false;
    }

    function CheckPersonHired(uint _nrJob) jobExist(_nrJob) onlyPerson public view returns(bool) {
        Job storage job = jobs[_nrJob];
        return (job.candidates[ job.candidatesUINT[msg.sender] ].hired);
    }

    function applyToJob(uint _nrJob) jobExist(_nrJob) onlyPerson public {
        Job storage job = jobs[_nrJob];
        Person storage person = persons[msg.sender];

        require(!CheckPersonApplied(_nrJob),"Already Registered!");

        Candidate storage newCandidate = job.candidates[job.counterCandidates];
            newCandidate.name=person.name;
            newCandidate.surname=person.surname;
            newCandidate.wallet=payable(msg.sender);
            newCandidate.mobilePhone=person.mobilePhone;
            newCandidate.age=person.age;
            newCandidate.CV=person.CV;
            newCandidate.coverLetter=person.coverLetter;
            newCandidate.absentHour=0;
            newCandidate.proposalHire=false;
            newCandidate.hired=false;

        job.candidatesUINT[msg.sender]=job.counterCandidates;
        job.counterCandidates++;
        
        person.appliedJob[person.counterAppliedJob]=_nrJob;
        person.counterAppliedJob++;
    }

    function appliedJobsCounter() public onlyPerson view returns(uint){
        return(persons[msg.sender].counterAppliedJob);
    }

    function showAppliedJob(uint _nrAppliedJob) public view onlyPerson returns(uint){
        require(_nrAppliedJob < persons[msg.sender].counterAppliedJob,"Job don't found");
        return(persons[msg.sender].appliedJob[_nrAppliedJob]);
    }

    function RequestHire(uint _nrCompanyJob, uint _nrCandidate) public{
        Company storage company = companies[msg.sender];
        require(_nrCompanyJob<company.counterJobs,"Job not found");
        Job storage job = jobs[company.jobs[_nrCompanyJob]];
        require(_nrCandidate<job.counterCandidates,"Canditate not found");
        job.candidates[_nrCandidate].proposalHire=true;
    }

    function ShowIfHireQuestion(uint _jobApplied) public view returns(bool){
        Person storage person = persons[msg.sender];
        require(_jobApplied < person.counterAppliedJob, "Job not found");
        Job storage job = jobs[person.appliedJob[person.counterAppliedJob]];
        uint uintCandidate = job.candidatesUINT[msg.sender];
        return( job.candidates[uintCandidate].proposalHire );
    }

    function AcceptJob(uint _nrJob) jobExist(_nrJob) public{
        Job storage job = jobs[_nrJob];
        uint IDCandidate = job.candidatesUINT[msg.sender];
        Candidate storage candidate = job.candidates[IDCandidate];

        require(candidate.wallet==msg.sender,"You're not the candidate");
        require(candidate.proposalHire,"Hire proposal not found");
        job.hired[job.counterHired]=candidate.wallet;
        candidate.hired=true;
        candidate.proposalHire=false;
        job.counterHired++;
        emit ev_Hired(_nrJob, msg.sender);
    }

    //REMOVE
    function ShowIfHired(uint _jobApplied) public view returns(bool){
        Person storage person = persons[msg.sender];
        require(_jobApplied < person.counterAppliedJob,"Job not found");
        Job storage job = jobs[person.appliedJob[person.counterAppliedJob]];
        uint uintCandidate = job.candidatesUINT[msg.sender];
        return( job.candidates[uintCandidate].hired );
    }

    function ShowJobsCounter() public view returns(uint){
        return counterJobs;
    }

    function ShowJobSummary(uint _nrJob) jobExist(_nrJob) public view returns(  address,
                                                        uint,
                                                        string memory,
                                                        string memory,
                                                        string memory,
                                                        string memory,
                                                        uint,            
                                                        uint ,
                                                        uint ,
                                                        bool , 
                                                        uint 
                                                    ){
        Job storage job = jobs[_nrJob];
        return(job.owner, job.total, job.title, job.description, job.workingAddress, job.searchingPosition, job.peopleToHire, job.dateFrom, job.dateTo, job.searching, job.counterCandidates); 
    }

    function ShowHired (uint _nrJob) jobExist(_nrJob) public view returns(uint){
        return(jobs[_nrJob].counterHired);
    }

    function ShowJobCandidatesCounter(uint _nrJob) jobExist(_nrJob) public view returns(uint){
        return(jobs[_nrJob].counterCandidates);
    }

    function ShowJobCandidate(uint _nrJob, uint _nrCandidate) jobExist(_nrJob) jobOwner(_nrJob) public view returns(string memory, string memory, string memory, uint, string memory, string memory, bool, bool) {
        Candidate memory candidate = jobs[_nrJob].candidates[_nrCandidate];
        return(candidate.name, candidate.surname, candidate.mobilePhone, candidate.age, candidate.CV, candidate.coverLetter, candidate.proposalHire, candidate.hired);
    }

    function ShowCompanyJobsCounter() onlyCompany public view returns(uint){
        Company storage company = companies[msg.sender];
        return (company.counterJobs);
    }

    function ShowCompanyJobID(uint _nrJob) jobExist(_nrJob) public view returns(uint) {
        return (companies[msg.sender].jobs[_nrJob]);
    }

    function CloseSearching(uint _nrJob) public jobExist(_nrJob) jobOwner(_nrJob){
        Job storage job = jobs[_nrJob];
        job.searching=false;
        emit ev_ClosedSearch(_nrJob);
    }

    function SetAbsentHours(uint _nrJob, uint _nrCandidate, uint _absentHours) jobExist(_nrJob) jobOwner(_nrJob) public{
        require(_absentHours>0);
        Job storage job = jobs[_nrJob];
        require(_nrCandidate<job.counterCandidates,"Candidate not found");
        require(job.candidates[_nrCandidate].hired,"Candidate isn't hired");
        uint hoursDaily = (job.hourFinish - job.hourInit) / 60; 
        uint daysJob = (job.dateTo - job.dateFrom) / 60 / 60 / 24;
        uint maxHours = hoursDaily * daysJob;
        require(_absentHours<= maxHours, "You can't add more hours than the total!");
        job.candidates[_nrCandidate].absentHour=_absentHours;
    }

    function CloseAndPay(uint _nrJob) public jobExist(_nrJob) jobOwner(_nrJob) jobSearching(_nrJob) jobNotClose(_nrJob) nonReentrant{
        Job storage job = jobs[_nrJob];
        
        job.jobFinished=true;
        uint hoursDaily = (job.hourFinish - job.hourInit) / 60; 
        uint daysJob = (job.dateTo - job.dateFrom) / 60 / 60 / 24;

        for (uint k=0; k < job.counterHired ; k++){
            uint nrCandidate= job.candidatesUINT[job.hired[k]];
            Candidate memory hired = job.candidates[nrCandidate];
            uint payToHired = job.hourlyWage * (hoursDaily * daysJob - hired.absentHour);
            hired.wallet.transfer(payToHired);
            job.total = job.total - payToHired; 
            emit ev_Pay(hired.wallet, payToHired);
        }

        if(job.total>0)
            job.owner.transfer(job.total);

        emit ev_CloseJob(_nrJob);
    }

    function ShowCloseJob(uint _nrJob) public jobExist(_nrJob) view returns(bool){
        return(jobs[_nrJob].jobFinished);
    }

    function CreateRequest(address _destination, uint _dateFrom, uint _dateTo,uint _hourStart,uint _hourFinish, string memory _message) public payable onlyCompany{
        require(msg.value>0,"You must create a request with value");
        require(_hourStart>0 && _hourFinish>_hourStart && _dateFrom>0 && _dateTo>_dateFrom,"The inputs are incorrects");
        
        Request storage newRequest = requests[counterRequests];
            newRequest.owner=msg.sender;
            newRequest.destination=_destination;
            newRequest.dateFrom=_dateFrom;
            newRequest.dateTo=_dateTo;
            newRequest.value=msg.value;
            newRequest.hourStart=_hourStart;
            newRequest.hourFinish=_hourFinish;
            newRequest.status=0;
            newRequest.isActive=true;
            newRequest.messages.push(Message(msg.sender,_destination,_message,block.timestamp));

        Person storage destination = persons[_destination];
        destination.incomingRequests[destination.counterIncomingRequests] = counterRequests;
        destination.counterIncomingRequests++;

        Company storage company = companies[msg.sender];
        company.sendedRequests[company.counterSendedRequests] = counterRequests;
        company.counterSendedRequests++;

        counterRequests++;

        emit ev_CreateRequest(msg.sender, _destination);
    }

    function SendMessage(uint _nRequest, string memory _message) public{
        Request storage request = requests[_nRequest];
        require(request.isActive);
        require(msg.sender==request.destination || msg.sender==request.owner, "You're not the destination or the owner!");
        address _destination;
        if(msg.sender==request.destination)
            _destination=request.owner;
        else
            _destination=request.destination;
        Message memory newMessage = Message(msg.sender,_destination,_message,block.timestamp);
        request.messages.push(newMessage);

        emit ev_SendMessage(msg.sender, _destination);
    }

    function ShowMessages(uint _nRequest) requestExist(_nRequest) public view returns(Message [] memory){
        Request storage request = requests[_nRequest];
        require(msg.sender==request.destination || msg.sender==request.owner, "You're not the destination or the owner!");
        return(request.messages);
    }

    function SetAnswer(uint _nRequest, uint8 _status) requestExist(_nRequest) public{
        Request storage request = requests[_nRequest];
        require(request.isActive,"The request is not active!");
        require(request.destination == msg.sender);
        require(_status>0 && _status <3);
        request.status=_status;
    }

    function CloseRequest(uint _nRequest) requestExist(_nRequest) nonReentrant public {
        Request storage request = requests[_nRequest];
        require(request.isActive);
        require(request.owner == msg.sender);
        if(request.status==2){
            uint hoursDaily = (request.hourFinish - request.hourStart) / 60; 
            uint daysJob = ( request.dateTo - request.dateFrom ) / 60 / 60 / 24;
            uint hourlyWage = request.value / daysJob / hoursDaily;
            
            Job storage newJob = jobs[counterJobs];
            newJob.owner=payable(request.owner);
            newJob.total=request.value;
            newJob.hourInit=request.hourStart;
            newJob.hourFinish=request.hourFinish; 
            newJob.peopleToHire=1;
            newJob.hourlyWage=hourlyWage;           
            newJob.dateFrom=request.dateFrom;
            newJob.dateTo=request.dateTo;
            newJob.searching=true;
            newJob.jobFinished=false;
            newJob.counterHired=0;
            newJob.counterCandidates=0;      

            Company storage company = companies[msg.sender];
                company.jobs[company.counterJobs]=counterJobs;
                company.counterJobs++;

            Person storage person = persons[request.destination];
        
            Candidate storage newCandidate = newJob.candidates[newJob.counterCandidates];
                newCandidate.name=person.name;
                newCandidate.surname=person.surname;
                newCandidate.wallet=payable(request.destination);
                newCandidate.mobilePhone=person.mobilePhone;
                newCandidate.age=person.age;
                newCandidate.CV=person.CV;
                newCandidate.coverLetter=person.coverLetter;
                newCandidate.absentHour=0;

            //auto candidate
            newJob.candidatesUINT[request.destination]=newJob.counterCandidates;
            newJob.candidates[newJob.counterCandidates]=newCandidate;
            newJob.counterCandidates++;

            //auto hire
            newJob.hired[newJob.counterHired]=newCandidate.wallet;
            newCandidate.hired=true;
            newJob.counterHired++;

            person.appliedJob[person.counterAppliedJob]=counterJobs;
            person.counterAppliedJob++;

            newJob.searching=false;
            counterJobs++;

            request.isActive=false;
        }else{
            request.isActive=false;
        }

        emit ev_CloseRequest(_nRequest, request.status);
    }

    function ShowCounterRequestsCompany() public view returns(uint) {
        return(companies[msg.sender].counterSendedRequests);
    }

    function ShowCounterRequestsPerson() public view returns(uint) {
        return(persons[msg.sender].counterIncomingRequests);
    }

    function ShowCounterRequests() public view returns(uint) {
        return(counterRequests);
    }

    function ShowRequest(uint _nrRequest) public view returns(address, address, uint, uint,uint,uint,uint, uint8, bool) {
        require(_nrRequest< counterRequests, "The request doesn't exist");
        Request storage request = requests[_nrRequest];
        require(request.owner == msg.sender || request.destination==msg.sender, "You're not allowed to read the request");
        return(request.owner, request.destination, request.dateFrom, request.dateTo,request.value,request.hourStart,request.hourFinish, request.status, request.isActive);
    }

}