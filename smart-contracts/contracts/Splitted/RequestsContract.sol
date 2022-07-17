// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RequestsContract {
    struct Request{
        address payable owner;
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

    event ev_CreateRequest(address, address);
    event ev_SendMessage(address, address);
    event ev_CloseRequest(uint, uint);

    mapping(uint => Request) requests;
    uint counterRequests;

    modifier requestExist(uint _nrRequest){
        require(_nrRequest < counterRequests);
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

    bool internal locked;
    modifier reentrancyGuard() {
     require(!locked);
     locked = true;
      _;
      locked = false;
    }

     function CreateRequest(address _destination, uint _dateFrom, uint _dateTo,uint _hourStart,uint _hourFinish, string memory _message) public payable onlyCompany{
        require(msg.value>0,"You must create a request with value");
        require(_hourStart>0 && _hourFinish>_hourStart && _dateFrom>0 && _dateTo>_dateFrom,"The inputs are incorrects");
        
        Request storage newRequest = requests[counterRequests];
            newRequest.owner=payable(msg.sender);
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
            request.owner.transfer(request.value);
        }

        emit ev_CloseRequest(_nRequest, request.status);
    }

    /* NEW SHOW PERSON FOR FETCH THE WORKER*/
    function ShowPerson(uint _nrWorker) public view returns(string memory, string memory, uint, string memory, string memory, string memory, address) {
        Person storage person = persons[personsAddress[_nrWorker]];
        address wallet = personsAddress[_nrWorker];
        return(person.name, person.surname, person.age, person.mobilePhone, person.CV, person.coverLetter, wallet);
    }

    function ShowCounterRequestsCompany() public view returns(uint) {
        return(companies[msg.sender].counterSendedRequests);
    }

    /*NEW*/
    function ShowIDRequestCompany(uint _nrCompanyRequest) public view returns(uint) {
        require(_nrCompanyRequest<companies[msg.sender].counterSendedRequests,"The sended request  doesn't exist");
        return(companies[msg.sender].sendedRequests[_nrCompanyRequest]);
    }

    function ShowCounterRequestsPerson() public view returns(uint) {
        return(persons[msg.sender].counterIncomingRequests);
    }

    /*NEW*/
    function ShowIDRequestPerson(uint _nrPersonRequest) public view returns(uint) {
        require(_nrPersonRequest<persons[msg.sender].counterIncomingRequests,"The incoming request doesn't exist");
        return(persons[msg.sender].incomingRequests[_nrPersonRequest]);
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