pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {

  function testItStoresAValue() public {
    SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

    simpleStorage.set(89);

    uint expected = 1;

    Assert.equal(simpleStorage.get(89), expected, "It should store the value 89.");
  }

}
