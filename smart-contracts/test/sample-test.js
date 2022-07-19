const { expect } = require("chai");
const { ethersm,waffle } = require("hardhat");

describe("LastMinuteJob -- Contract Tests", function () {
  const provider = waffle.provider;
  let company, person, person2;
  let HUBContract, JobContract, RequestContract ;
  let Job;

  beforeEach(async () => {
    ([owner, company, person, person2] = await ethers.getSigners());
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

    //Create company CreateCompany(string memory _name, string memory _description, string memory _address) external;
    await HUBContract.connect(company).CreateCompany("Nome", "Descrizione", "Address");
    expect(await HUBContract.GetCompaniesCounter()).to.equal(1);

    //Create worker function CreateWorker(bytes32 _name,bytes32 _surname,bytes32 _age,bytes32 _mobilePhone, bytes32 _CV, bytes32 _coverLetter) external;
    await HUBContract.connect(person).CreateWorker(0x4a6f686e00000000000000000000000000000000000000000000000000000000,0x446f650000000000000000000000000000000000000000000000000000000000,0x1e00000000000000000000000000000000000000000000000000000000000000,0x75bcd15000000000000000000000000000000000000000000000000000000000, 0x687474703a2f2f4c494e4b544f43562e69740000000000000000000000000000, 0x4869206d79206e616d65206973204a6f686e0000000000000000000000000000);
    expect(await HUBContract.GetWorkersCounter()).to.equal(1);

  });

  it("Create a job and finish the cycle with full payment to one person", async function () {

  })

  /* OLD TESTS
  it("Create a job and finish the cycle with full payment to one person", async function () {
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

      console.log("Comapny before: " + BerforPayCompany);
      console.log("Company After: " + AfterPayCompany);
      console.log("Person before " + BerforPayPerson);
      console.log("Person after: " + AfterPayPerson);

      //console.log(await lastMinuteContract.connect(person).ShowJobSummary(0));
  
  });

  it("Create request and accept" , async function () {
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

    console.log("Comapny before: " + BerforPayCompany);
    console.log("Company After: " + AfterPayCompany);
    console.log("Person before " + BerforPayPerson);
    console.log("Person after: " + AfterPayPerson);
  });
  */

});


