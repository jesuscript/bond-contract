contract Bond{
	address owner;
	uint total;
	uint couponAmount;
	uint currentInterestPeriod;
	bool redeemed;

	mapping(address =>mapping(uint=>uint))  balances;

	interestPayment[] public interestPayments;
	struct interestPayment{
		uint value;
		uint blockNumber;
	}
	
  function Bond(uint initValue, uint coupRate){
    balances[msg.sender][0] = initValue;
    total = initValue;
    couponAmount = (total/10000) * coupRate * 10**15;
  }

  function sendBond(address recipient, uint amount, uint state) returns (bool successful){
    if (balances[msg.sender][state] < amount) return false;
    balances[msg.sender][state] -= amount;
    balances[recipient][state] += amount;
    return true;
  }

  function payInterest(uint coupon) returns (bool s){
    if (msg.value != couponAmount) {
			msg.sender.send(msg.value);
		}
    if (currentInterestPeriod != coupon) return false;
    if (msg.sender != owner) return false;
    uint now = block.number;
    uint value = msg.value;
    interestPayments[coupon].value = value/total;
    currentInterestPeriod++;
    return true;
  }

  function claimInterest(uint state, uint amount){
    if (balances[msg.sender][state] < amount) return;
    if (state >= currentInterestPeriod) return;
    balances[msg.sender][state] -= amount;
    balances[msg.sender][state+1] += amount;
    msg.sender.send(interestPayments[state].value);
  }

  function redeem(){
    if (balances[msg.sender][currentInterestPeriod] == 0 && redeemed != true) return;
    msg.sender.send(balances[msg.sender][currentInterestPeriod]*10**15);
    balances[msg.sender][currentInterestPeriod] = 0;
  }

  function payRedemption(){
    if ((msg.value*10**15) != total) {msg.sender.send(msg.value);}
    redeemed = true;
  }

	function getBalance(address acc, uint state) returns (uint b){
		return balances[acc][state];
	}
}
