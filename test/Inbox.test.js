import ganache from "ganache-cli";
import Web3 from "web3";
import assert from "assert";
import {abi, evm} from "../compile.js";


const web3 = new Web3(ganache.provider());
let accounts;
let inbox;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: ["Holi"],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("Deploy contract", () => {
    assert.ok(inbox.options.address);
  });

  it("Default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Holi");
  });

  it("Change message", async () => {
    await inbox.methods.setMessage("Adios").send({from: accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message, "Adios");

  });
});
