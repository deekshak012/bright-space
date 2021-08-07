const BrightSpace = artifacts.require("BrightSpace");//json file

module.exports = function(deployer) {
  deployer.deploy(BrightSpace);
};
