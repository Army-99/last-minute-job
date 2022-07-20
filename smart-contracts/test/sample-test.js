const { expect } = require("chai");
const { ethersm,waffle } = require("hardhat");

describe("LastMinuteJob -- Contract Tests", function () {
  const provider = waffle.provider;
  let company, person, person2;
  let lastMinuteContract;
  let HUBContract, JobContract, RequestContract;
  let Job;

  beforeEach(async () => {
    ([owner, company, person, person2] = await ethers.getSigners());

    /* FIRST SINGLE SMART CONTRACT */
    const LastMinuteJob = await ethers.getContractFactory('LastMinuteJob');
    lastMinuteContract = await LastMinuteJob.deploy();

    //Register company
    await lastMinuteContract.connect(company).RegisterAsCompany("Nome", "Descrizione", "Address");
    expect(await lastMinuteContract.GetCompaniesCounter()).to.equal(1);

    //Register person
    await lastMinuteContract.connect(person).RegisterAsPerson("John","Doe",30,"123456789", "LINK", "Nice to meet you, I'm John Doe");
    expect(await lastMinuteContract.GetPersonsCounter()).to.equal(1);
     /* END FIRST SINGLE SMART CONTRACT */

    const HUB = await ethers.getContractFactory('HUB');
    HUBContract = await HUB.deploy();

    const Job = await ethers.getContractFactory('JobContract');
    JobContract = await Job.deploy(HUBContract.address);

    const Request = await ethers.getContractFactory('RequestContract');
    RequestContract = await Request.deploy(HUBContract.address,JobContract.address);
    
    //console.log("Address Owner: " + owner.address);
    //console.log("Address Company: " + company.address);
    //console.log("Address Person1: " + person.address);
    //console.log("Address Person2: " + person2.address);

    //Setup the job and request contract address in HUB
    HUBContract.SetContractJobAddress(JobContract.address);
    HUBContract.SetContractRequestAddress(RequestContract.address);

    //Setup the request contract address in JOBContract
    JobContract.SetContractRequestAddress(RequestContract.address);

    //Create company
    await HUBContract.connect(company).CreateCompany("Nome", "Descrizione", "Address");
    expect(await HUBContract.GetCompaniesCounter()).to.equal(1);

    //Create worker
    await HUBContract.connect(person).CreateWorker("John", "Doe", 30, "214564062", "LINKTOCV" , "Hi my name is John!");
    expect(await HUBContract.GetWorkersCounter()).to.equal(1);

    //Show worker readable by humans
    //console.log(await HUBContract.ShowWorkerHuman(person.address));
    //Show worker in abi.encode
    //console.log(await HUBContract.ShowWorker(person.address));

  });

  it("Create a job and finish the cycle with full payment to one person", async function () {
  
    //Create a job
    await JobContract.connect(company).CreateJob( company.address, "Titolo", "Descrizione", "Working Address", "Chef", 840, 1320,1, 1656288000, 1656460800, { value: ethers.utils.parseEther("1") });
    //Company Jobs Counter
    expect(await HUBContract.connect(company).ShowCompanyJobsCounter(company.address)).to.equal(1);
    //Test id of the job public
    expect(await HUBContract.connect(company).ShowJobIDCompany(company.address, 0)).to.equal(0);
    //All Jobs Counter
    expect(await JobContract.connect(company).ShowJobsCounter()).to.equal(1);

    //DATAS OF THE JOB Global
    //console.log(await JobContract.connect(company).ShowJobSummary(0));

    //Apply to job from Person and verify in his Person struct is applied correctly
    //Test with the same registration data
    await JobContract.connect(person).ApplyToJob(person.address, 0, "John", "Doe", "214564062", 30, "LINKTOCV", 'Hi my name is John!');
    expect(await HUBContract.connect(person).ShowWorkerAppliedJobsCounter()).to.equal(1);
    expect(await HUBContract.connect(person).ShowJobIDWorker(0)).to.equal(0);

    //Show up all the candidates of the job
    expect(await JobContract.connect(company).ShowJobCandidatesCounter(0)).to.equal(1);
    //Show job candidate
    //console.log(await JobContract.connect(company).ShowJobCandidate(0,0))
    //Assuming the company want make a proposal for hiring
    await JobContract.connect(company).RequestHire(0,0);

    //The candidate want see if has a proposal
    expect(await JobContract.connect(person).ShowIfHireQuestion(0)).to.equal(true);
    await JobContract.connect(person).AcceptJob(person.address, 0);

    //Show if is hired
    expect(await JobContract.connect(person).CheckWorkerHired(0)).to.equal(true);

    let BerforePayCompany = await provider.getBalance(company.address);
    let BerforePayPerson = await provider.getBalance(person.address);

    await JobContract.connect(company).CloseSearching(0);
    
    await JobContract.connect(company).SetAbsentHours(0,0,10);
    
    await JobContract.connect(company).CloseAndPay(0);

    let AfterPayPerson = await provider.getBalance(person.address);
    let AfterPayCompany = await provider.getBalance(company.address);

    console.log("Comapny before: " + BerforePayCompany);
    console.log("Company After: " + AfterPayCompany);

    console.log("Person before " + BerforePayPerson);
    console.log("Person after: " + AfterPayPerson);

    //console.log(await JobContract.connect(person).ShowJobSummary(0));

    expect(await JobContract.connect(company).ShowCloseJob(0)).to.equal(true);
  });

  it("Create request and accept" , async function () {
    //function CreateRequest(address _destination,string memory _title,string memory _description, string memory _workingAddress,uint _hourInit,uint _hourFinish, uint _dateFrom, uint _dateTo, string memory _message) external payable;
    await RequestContract.connect(company).CreateRequest("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC","TITLE", "DESCRIPTION","WORKING ADDRESS",840, 1320, 1656288000, 1656460800, "Hi, join in my private work i'll pay you very well 1 eth for 8 hours for 5 day",{ value: ethers.utils.parseEther("1") });
    //console.log(await RequestContract.connect(company).ShowRequest(0));
    //console.log(await RequestContract.connect(company).ShowRequestStatus(0));
      
    //show incoming request in person
    expect(await HUBContract.connect(person).ShowWorkerCounterRequests()).to.eq(1);
    expect(await HUBContract.connect(company).ShowCompanyCounterRequests()).to.eq(1);

    //console.log(await RequestContract.connect(person).ShowMessages(0));
    
    //ACCEPT THE JOB
    await RequestContract.connect(person).SetAnswer(0,2);

    await RequestContract.connect(company).CloseRequest(0);
    //expect(await HUBContract.connect(company).ShowCompanyJobsCounter(company.address)).to.equal(1);

    //console.log(await RequestContract.connect(company).ShowRequestStatus(0));

    /*
    expect(await HUBContract.connect(person).appliedJobsCounter()).to.equal(1);

    expect(await HUBContract.connect(company).ShowJobsCounter()).to.equal(1);

    //console.log(await lastMinuteContract.connect(company).ShowJobSummary(0));

    let BerforPayCompany = await provider.getBalance(company.address);
    let BerforPayPerson = await provider.getBalance(person.address);

    await RequestContract.connect(company).CloseAndPay(0);

    let AfterPayPerson = await provider.getBalance(person.address);
    let AfterPayCompany = await provider.getBalance(company.address);

    //console.log("Comapny before: " + BerforPayCompany);
    //console.log("Company After: " + AfterPayCompany);
    //console.log("Person before " + BerforPayPerson);
    //console.log("Person after: " + AfterPayPerson);
    */
  });

  /* OLD TESTS 
  it("OLD Create a job and finish the cycle with full payment to one person", async function () {
      //Create a job
      await lastMinuteContract.connect(company).CreateJob("Titolo", "Descrizione", "Working Address", "Chef", 840, 1320,1, 1656288000, 1656460800, { value: ethers.utils.parseEther("1") });
      //Company Jobs Counter
      expect(await lastMinuteContract.connect(company).ShowCompanyJobsCounter()).to.equal(1);
      //Test id of the job public
      expect(await lastMinuteContract.connect(company).ShowCompanyJobID(0)).to.equal(0);
      //All Jobs Counter
      expect(await lastMinuteContract.connect(company).ShowJobsCounter()).to.equal(1);

    //DATAS OF THE JOB Global
    //console.log(await lastMinuteContract.connect(company).ShowJobSummary(0));

    //Apply to job from Person and verify in his Person struct is applied correctly
    await lastMinuteContract.connect(person).applyToJob(0);
    expect(await lastMinuteContract.connect(person).appliedJobsCounter()).to.equal(1);
    expect(await lastMinuteContract.connect(person).showAppliedJob(0)).to.equal(0);

    //Show up all the candidates of the job
    expect(await lastMinuteContract.connect(company).ShowJobCandidatesCounter(0)).to.equal(1);
    //Show job candidate
    //console.log(await lastMinuteContract.connect(company).ShowJobCandidate(0,0))
    //Assuming the company want make a proposal for hiring
      await lastMinuteContract.connect(company).RequestHire(0,0);
      //Show the candidate
      //console.log(await lastMinuteContract.connect(company).ShowJobCandidate(0,0))

      //The candidate want see if has a proposal
      //console.log(await lastMinuteContract.connect(person).ShowIfHireQuestion(0));
      await lastMinuteContract.connect(person).AcceptJob(0);
      //ShowIfHireQuestion
      //console.log(await lastMinuteContract.connect(person).ShowIfHireQuestion(0));
      //Show if is hired
      //console.log(await lastMinuteContract.connect(person).ShowIfHired(0));

      let BerforPayCompany = await provider.getBalance(company.address);
      let BerforPayPerson = await provider.getBalance(person.address);

      expect(await lastMinuteContract.connect(person).ShowIfHired(0)).to.be.eq(true);

      await lastMinuteContract.connect(company).CloseSearching(0);
      
      await lastMinuteContract.connect(company).SetAbsentHours(0,0,10);
      

      await lastMinuteContract.connect(company).CloseAndPay(0);
      let AfterPayPerson = await provider.getBalance(person.address);
      let AfterPayCompany = await provider.getBalance(company.address);

      //console.log("Comapny before: " + BerforPayCompany);
      //console.log("Company After: " + AfterPayCompany);
      //console.log("Person before " + BerforPayPerson);
      //console.log("Person after: " + AfterPayPerson);

      //console.log(await lastMinuteContract.connect(person).ShowJobSummary(0));
  
  });

  it("OLD Create request and accept" , async function () {
    await lastMinuteContract.connect(company).CreateRequest("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", 1656288000, 1656460800,840, 1320, "Hi, join in my private work i'll pay you very well 1 eth for 8 hours for 5 day",{ value: ethers.utils.parseEther("1") });
    //console.log(await lastMinuteContract.connect(company).ShowRequest(0));

    //show incoming request in person
    expect(await lastMinuteContract.connect(person).ShowCounterRequestsPerson()).to.eq(1);
    expect(await lastMinuteContract.connect(company).ShowCounterRequestsCompany()).to.eq(1);

    //console.log(await lastMinuteContract.connect(person).ShowMessages(0));

    //ACCEPT THE JOB
    await lastMinuteContract.connect(person).SetAnswer(0,2);

    await lastMinuteContract.connect(company).CloseRequest(0);
    //console.log(await lastMinuteContract.connect(company).ShowRequest(0));

    expect(await lastMinuteContract.connect(person).appliedJobsCounter()).to.equal(1);

    expect(await lastMinuteContract.connect(company).ShowJobsCounter()).to.equal(1);

    //console.log(await lastMinuteContract.connect(company).ShowJobSummary(0));

    let BerforPayCompany = await provider.getBalance(company.address);
    let BerforPayPerson = await provider.getBalance(person.address);

    await lastMinuteContract.connect(company).CloseAndPay(0);

    let AfterPayPerson = await provider.getBalance(person.address);
    let AfterPayCompany = await provider.getBalance(company.address);

    //console.log("Comapny before: " + BerforPayCompany);
    //console.log("Company After: " + AfterPayCompany);
    //console.log("Person before " + BerforPayPerson);
    //console.log("Person after: " + AfterPayPerson);
  });
  */
});


