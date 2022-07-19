// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./HUB.sol";

interface InterfaceJOB{
    function CreateJob (address payable _owner, string memory _title,string memory _description,string memory _workingAddress,string memory _searchingPosition,uint _hourInit,uint _hourFinish,uint _peopleToHire,uint _dateFrom,uint _dateTo) external payable;
    function CheckPersonApplied(uint _nrJob) external view returns(bool);
    function CheckPersonHired(uint _nrJob) external view returns(bool); 
    function ApplyToJob(address worker, uint _nrJob, string memory _name, string memory _surname, string memory _mobilePhone, uint _age, string memory _CV, string memory _coverLetter) external; 
    function RequestHire(uint _nrJob, uint _nrCandidate) external;
    function ShowIfHireQuestion(uint _nrJob) external view returns(bool);
    function AcceptJob(address worker,uint _nrJob) external;
    function ShowJobsCounter() external view returns(uint);
    function ShowJobSummary(uint _nrJob) external view returns( address,uint,string memory,string memory,string memory,string memory,uint, uint ,uint ,bool , uint );
    function ShowHired (uint _nrJob) external view returns(uint);
    function ShowJobCandidatesCounter(uint _nrJob) external view returns(uint);
    function ShowJobCandidate(uint _nrJob, uint _nrCandidate) external view returns(string memory, string memory, string memory, uint, string memory, string memory, bool, bool);
    function ShowAbsentHoursCandidate(uint _nrJob, uint _nrCandidate) external view returns(uint);
    function CloseSearching(uint _nrJob) external;
    function SetAbsentHours(uint _nrJob, uint _nrCandidate, uint _absentHours) external;
    function CloseAndPay(uint _nrJob) external;
    function ShowCloseJob(uint _nrJob) external view returns(bool);
}

contract JobContract is ReentrancyGuard {

    constructor (address _interfaceHUB) {
        interfaceHUB=_interfaceHUB;
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

    event ev_CreateJob(address, uint);
    event ev_Hired(uint,address);
    event ev_ClosedSearch(uint);
    event ev_Pay(address, uint);
    event ev_CloseJob(uint);

    mapping (uint => Job) internal jobs;
    uint internal counterJobs;
    address internal interfaceHUB;
    address internal requestContract;
    bool internal locked;

    //ADD ONLY OWNER
    function SetContractRequestAddress(address _requestContract) external{
        requestContract=_requestContract;
    }

    modifier reentrancyGuard() {
        require(!locked);
        locked = true;
        _;
        locked = false;
    }

    modifier onlyCompany(){
        InterfaceHUB hub = InterfaceHUB(interfaceHUB);
        require(hub.CheckCompany(msg.sender),"Not a company");
        _;
    }

    modifier onlyWorker(){
        InterfaceHUB hub = InterfaceHUB(interfaceHUB);
        require(hub.CheckWorker(msg.sender),"Not a worker");
        _;
    }

    modifier onlyJobOwner(uint _nrJob){
        require(msg.sender== jobs[_nrJob].owner, "Not owner of the job");
        _;
    }

    modifier onlyJobSearching(uint _nrJob) {
        require(!jobs[_nrJob].searching, "The job is searching candidates you can't close!");
        _;
    }

    modifier onlyJobNotClose(uint _nrJob) {
        require(!jobs[_nrJob].jobFinished, "The job is already ended");
        _;
    }

    modifier onlyJobExist(uint _nrJob){
        require(0 <= _nrJob && _nrJob < counterJobs, "The job not exist");
        _;
    }

    function CreateJob (address payable _owner, string memory _title,string memory _description,string memory _workingAddress,string memory _searchingPosition,uint _hourInit,uint _hourFinish,uint _peopleToHire,uint _dateFrom,uint _dateTo) external payable onlyCompany{
        require(msg.value>0,"Value of message is null");
        require(_hourInit>0 && _hourFinish>_hourInit && _dateFrom>0 && _dateTo>_dateFrom && _peopleToHire>0,"Error on inputs");

        uint hoursDaily = (_hourFinish - _hourInit) / 60; 
        uint daysJob = (_dateTo - _dateFrom) / 60 / 60 / 24;
        uint _hourlyWage = msg.value / daysJob / hoursDaily / _peopleToHire;

        Job storage newJob = jobs[counterJobs];
            newJob.owner=_owner;
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

        InterfaceHUB hub = InterfaceHUB(interfaceHUB);
        hub.AddCompanyJob(msg.sender, counterJobs);

        counterJobs++;

        emit ev_CreateJob(msg.sender, msg.value);
    }

    function CheckWorkerApplied(uint _nrJob) onlyJobExist(_nrJob) onlyWorker public view returns(bool) {
        Job storage job = jobs[_nrJob];
        return(job.candidates[ job.candidatesUINT[msg.sender] ].wallet==msg.sender);
    }

    function CheckWorkerHired(uint _nrJob) onlyJobExist(_nrJob) onlyWorker external view returns(bool) {
        Job storage job = jobs[_nrJob];
        return (job.candidates[ job.candidatesUINT[msg.sender] ].hired);
    }

    function ApplyToJob(address worker, uint _nrJob, string memory _name, string memory _surname, string memory _mobilePhone, uint _age, string memory _CV, string memory _coverLetter) onlyJobExist(_nrJob) onlyWorker external {
        Job storage job = jobs[_nrJob];
        require(!CheckWorkerApplied(_nrJob),"Already Registered!");
        require(worker == msg.sender || msg.sender == requestContract,"You're not allowed");

        Candidate storage newCandidate = job.candidates[job.counterCandidates];
            newCandidate.name=_name;
            newCandidate.surname=_surname;
            newCandidate.wallet=payable(worker);
            newCandidate.mobilePhone=_mobilePhone;
            newCandidate.age=_age;
            newCandidate.CV=_CV;
            newCandidate.coverLetter=_coverLetter;
            newCandidate.absentHour=0;
            newCandidate.proposalHire=false;
            newCandidate.hired=false;

        job.candidatesUINT[worker]=job.counterCandidates;
        job.counterCandidates++;
        
        InterfaceHUB hub = InterfaceHUB(interfaceHUB);
        hub.AddWorkerJobApplied(worker, _nrJob);
    }

    function RequestHire(uint _nrJob, uint _nrCandidate) onlyJobExist(_nrJob) external{
        Job storage job = jobs[_nrJob];
        require(job.owner == msg.sender || msg.sender == requestContract,"You're not allowed");
        require(_nrCandidate<job.counterCandidates,"Canditate not found");
        job.candidates[_nrCandidate].proposalHire=true;
    }

    function ShowIfHireQuestion(uint _nrJob) onlyJobExist(_nrJob) onlyWorker external view returns(bool){
        Job storage job = jobs[_nrJob];
        uint uintCandidate = job.candidatesUINT[msg.sender];
        return( job.candidates[uintCandidate].proposalHire );
    }

    function AcceptJob(address worker, uint _nrJob) onlyJobExist(_nrJob) external{
        require(worker == msg.sender || msg.sender == requestContract,"You're not allowed");
        Job storage job = jobs[_nrJob];
        uint IDCandidate = job.candidatesUINT[worker];
        Candidate storage candidate = job.candidates[IDCandidate];

        require(candidate.wallet==worker,"You're not the candidate");
        require(candidate.proposalHire,"Hire proposal not found");
        
        job.hired[job.counterHired]=candidate.wallet;
        candidate.hired=true;
        candidate.proposalHire=false;
        job.counterHired++;
        emit ev_Hired(_nrJob, worker);
    }

    function ShowJobsCounter() external view returns(uint){
        return counterJobs;
    }

    function ShowJobSummary(uint _nrJob) onlyJobExist(_nrJob) external view returns( address,uint,string memory,string memory,string memory,string memory,uint, uint ,uint ,bool , uint ){
        Job storage job = jobs[_nrJob];
        return(job.owner, job.total, job.title, job.description, job.workingAddress, job.searchingPosition, job.peopleToHire, job.dateFrom, job.dateTo, job.searching, job.counterCandidates); 
    }

    function ShowHired (uint _nrJob) onlyJobExist(_nrJob) external view returns(uint){
        return(jobs[_nrJob].counterHired);
    }

    function ShowJobCandidatesCounter(uint _nrJob) onlyJobExist(_nrJob) external view returns(uint){
        return(jobs[_nrJob].counterCandidates);
    }

    function ShowJobCandidate(uint _nrJob, uint _nrCandidate) onlyJobExist(_nrJob) onlyJobOwner(_nrJob) external view returns(string memory, string memory, string memory, uint, string memory, string memory, bool, bool) {
        Candidate memory candidate = jobs[_nrJob].candidates[_nrCandidate];
        return(candidate.name, candidate.surname, candidate.mobilePhone, candidate.age, candidate.CV, candidate.coverLetter, candidate.proposalHire, candidate.hired);
    }

    function ShowAbsentHoursCandidate(uint _nrJob, uint _nrCandidate) onlyJobExist(_nrJob) external view returns(uint){
        Job storage job = jobs[_nrJob];
        return( job.candidates[_nrCandidate].absentHour);
    }

    function CloseSearching(uint _nrJob) external onlyJobExist(_nrJob) {
        Job storage job = jobs[_nrJob];
        require(job.owner == msg.sender || msg.sender == requestContract,"You're not allowed");
        job.searching=false;
        emit ev_ClosedSearch(_nrJob);
    }

    function SetAbsentHours(uint _nrJob, uint _nrCandidate, uint _absentHours) onlyJobExist(_nrJob) onlyJobOwner(_nrJob) external{
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

    function CloseAndPay(uint _nrJob) external onlyJobExist(_nrJob) onlyJobOwner(_nrJob) onlyJobSearching(_nrJob) onlyJobNotClose(_nrJob) nonReentrant{
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

    function ShowCloseJob(uint _nrJob) external onlyJobExist(_nrJob) view returns(bool){
        return(jobs[_nrJob].jobFinished);
    }
}