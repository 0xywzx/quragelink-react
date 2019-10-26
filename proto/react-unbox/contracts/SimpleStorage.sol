pragma solidity ^0.5.0;

contract SimpleStorage {
  uint storedData;
  mapping (uint256 => uint256) public sample;

  function set(uint256 x) public {
    storedData = x;
    sample[x] = 1;
  }

  function get(uint256 x) public view returns (uint256) {
    return sample[x];
  }
}
