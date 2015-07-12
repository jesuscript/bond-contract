Template.balance.helpers({
  value: function(){
    return Bond.getBalance.call(web3.eth.accounts[0], 0).toString();
  }
});
