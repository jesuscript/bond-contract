var abi = [
  {"constant":false,"inputs":[{"name":"acc","type":"address"},{"name":"state","type":"uint256"}],"name":"getBalance","outputs":[{"name":"b","type":"uint256"}],"type":"function"},
  {"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"},{"name":"state","type":"uint256"}],"name":"sendBond","outputs":[{"name":"successful","type":"bool"}],"type":"function"},
  {"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"interestPayments","outputs":[{"name":"value","type":"uint256"},{"name":"blockNumber","type":"uint256"}],"type":"function"},
  {"constant":false,"inputs":[{"name":"coupon","type":"uint256"}],"name":"payInterest","outputs":[{"name":"s","type":"bool"}],"type":"function"},
  {"constant":false,"inputs":[],"name":"redeem","outputs":[],"type":"function"},
  {"constant":false,"inputs":[],"name":"payRedemption","outputs":[],"type":"function"},
  {"constant":false,"inputs":[{"name":"state","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"claimInterest","outputs":[],"type":"function"},
  {"inputs":[{"name":"initValue","type":"uint256"},{"name":"coupRate","type":"uint256"}],"type":"constructor"}
];

Template.balance.onRendered(function(){
  $.get("/bond.sol", function(src){
    bondContract = web3.eth.contract(abi);

    bondContract.new(1000, 500, {
      from: web3.eth.accounts[0],
      data: web3.eth.compile.solidity(src).Bond.code,
      gas: "1000000"
    }, function(err, c){
      Bond2 = bondContract.at(c.address);
      
      Session.set("balance", Bond.getBalance.call(web3.eth.accounts[0], 0).toString());
    });
  });
});


Template.balance.helpers({
  value: function(){
    return Session.get("balance");
  }
});
