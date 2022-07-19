// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./HUB.sol";
import "./JobContract.sol";

contract RequestContract is ReentrancyGuard {

    constructor (address _interfaceHUB, address _interfaceJOB) {
        interfaceHUB=_interfaceHUB;
        interfaceJOB=_interfaceJOB;
    }

    struct Request{
        address payable owner;
        address destination;
        string title;
        string description;
        string workingAddress;
        string searchingPosition;
        uint hourInit;
        uint hourFinish;
        uint dateFrom;
        uint dateTo;
        uint value;
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

    address internal interfaceHUB;
    address internal interfaceJOB;

    bool internal locked;
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

    modifier requestExist(uint _nrRequest){
        require(_nrRequest < counterRequests);
        _;
    }

    function CreateRequest(address _destination,string memory _title,string memory _description, string memory _workingAddress,uint _hourInit,uint _hourFinish, uint _dateFrom, uint _dateTo, string memory _message) external payable onlyCompany{
        require(msg.value>0,"You must create a request with value");
        require(_hourInit>0 && _hourFinish>_hourInit && _dateFrom>0 && _dateTo>_dateFrom,"The inputs are incorrects");
        
        Request storage newRequest = requests[counterRequests];
            newRequest.owner=payable(msg.sender);
            newRequest.destination=_destination;
            newRequest.title=_title;
            newRequest.description=_description;
            newRequest.workingAddress=_workingAddress;
            newRequest.dateFrom=_dateFrom;
            newRequest.dateTo=_dateTo;
            newRequest.value=msg.value;
            newRequest.hourInit=_hourInit;
            newRequest.hourFinish=_hourFinish;
            newRequest.status=0;
            newRequest.isActive=true;
            newRequest.messages.push(Message(msg.sender,_destination,_message,block.timestamp));

        InterfaceHUB hub = InterfaceHUB(interfaceHUB);

        hub.AddWorkerRequest(_destination, counterRequests);
        hub.AddCompanyRequest(msg.sender, counterRequests);

        counterRequests++;

        emit ev_CreateRequest(msg.sender, _destination);
    }

    function SendMessage(uint _nrRequest, string memory _message) external{
        Request storage request = requests[_nrRequest];
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

    function ShowMessages(uint _nrRequest) requestExist(_nrRequest) external view returns(Message [] memory){
        Request storage request = requests[_nrRequest];
        require(msg.sender==request.destination || msg.sender==request.owner, "You're not the destination or the owner!");
        return(request.messages);
    }

    function SetAnswer(uint _nrRequest, uint8 _status) requestExist(_nrRequest) external{
        Request storage request = requests[_nrRequest];
        require(request.isActive,"The request is not active!");
        require(request.destination == msg.sender);
        require(_status>0 && _status <3);
        request.status=_status;
    }

    function CloseRequest(uint _nrRequest) requestExist(_nrRequest) nonReentrant external {
        address payable owner = requests[_nrRequest].owner;
        require(requests[_nrRequest].isActive);
        require(owner == msg.sender);

        uint status = requests[_nrRequest].status; 
        address dest = requests[_nrRequest].destination;
        
        
        if(status==2){//The worker accepted the request
            InterfaceJOB job = InterfaceJOB(interfaceJOB);
            InterfaceHUB hub = InterfaceHUB(interfaceHUB);
            
            CreateTheJob(_nrRequest, msg.sender);
            //job.CreateJob{value:val}(payable(msg.sender),tit,desc,wAdd,sPos,hInit,hFinish,1,dFrom,dTo);
            //FETCH THE NEW JOB
            uint nrJob = hub.ShowJobIDCompany(msg.sender, hub.ShowCompanyJobsCounter(msg.sender)-1);
            //AUTO APPLY Worker TO JOB 

            bytes memory data = hub.ShowWorker( dest );
            (string memory name,string memory surname,uint age,string memory mobilePhone,string memory CV,string memory coverLetter) = abi.decode(data, (string, string, uint, string, string, string));
             
            job.ApplyToJob(dest, nrJob, name, surname, mobilePhone, age, CV, coverLetter);

            //AUTO REQUEST HIRE THE Worker IN 0 POSITION (IS THE FIRST AND LAST CANDIDATE)
            job.RequestHire(hub.ShowCompanyJobsCounter(msg.sender)-1, 0);
            //Worker AUTO ACCEPT THE JOB
            job.AcceptJob(dest, nrJob);
            //CLOSE SEARCH
            job.CloseSearching(nrJob);
            
            DeactivateRequest(_nrRequest);
        }else{
            DeactivateRequest(_nrRequest);
            owner.transfer(requests[_nrRequest].value);
        }

        emit ev_CloseRequest(_nrRequest, status);
    }

    function CreateTheJob(uint _nrRequest, address _address) internal {
        Request memory r = requests[_nrRequest];
        InterfaceJOB job = InterfaceJOB(interfaceJOB);
        job.CreateJob{value:r.value}(payable(_address),r.title,r.description,r.workingAddress,r.searchingPosition,r.hourInit,r.hourFinish,1,r.dateFrom,r.dateTo);
    }

    function ShowCounterRequests() external view returns(uint) {
        return(counterRequests);
    }

    function ShowRequest(uint _nrRequest) requestExist(_nrRequest) external view returns(address, address, uint, uint,uint,uint,uint, uint8, bool) {
        Request storage request = requests[_nrRequest];
        require(request.owner == msg.sender || request.destination==msg.sender, "You're not allowed to read the request");
        return(request.owner, request.destination, request.dateFrom, request.dateTo,request.value,request.hourInit,request.hourFinish, request.status, request.isActive);
    }

    function DeactivateRequest(uint _nrRequest) requestExist(_nrRequest) internal {
        Request storage request = requests[_nrRequest];
        require(request.owner == msg.sender);
        request.isActive=false;
    }
}