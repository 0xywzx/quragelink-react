const SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract("SimpleStorage", accounts => {
  it("...should store the value 89.", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    // Set value of 89
    await simpleStorageInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await simpleStorageInstance.get(89);
    
    await console.log(storedData)

    assert.equal(storedData, 1, "The value 89 was not stored.");
  });
});
