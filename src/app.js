import '../styles/app.scss';
import EAC from 'eac.js-lib';
import Web3 from 'web3';
import moment from 'moment';

(async () => {
  await window.ethereum.enable();

  const web3 = new Web3(window.ethereum);

  const defaultAccount = web3.eth.accounts[0];

  const eac = EAC(web3);

  const scheduler = await eac.scheduler();

  async function schedule(
    toAddress,
    callData = '',
    callGas,
    callValue,
    windowSize,
    windowStart,
    gasPrice,
    fee,
    bounty,
    requiredDeposit
  ) {
    const endowment = eac.Util.calcEndowment(callGas, callValue, gasPrice, fee, bounty);

    await scheduler.initSender({
      from: defaultAccount,
      value: endowment
    });

    const receipt = await scheduler.timestampSchedule(
      toAddress,
      callData,
      callGas,
      callValue,
      windowSize,
      windowStart,
      gasPrice,
      fee,
      bounty,
      requiredDeposit,
      true
    );

    return receipt;
  }

  async function sendSalary(atLaterTime = false) {
    const AMOUNT = web3.toWei('0.1', 'ether');
    const RECEIVER = '0xd8c6F58BbF71E0739E4CCfe9f9721a07285bB895';

    if (atLaterTime) {
      const WINDOW_SIZE = 15 * 60; // 15 minutes
      const WINDOW_START = moment()
        .add('30', 'day')
        .unix(); // Time of transaction
      const CALL_GAS = '21000';
      const FUTURE_GAS_PRICE = web3.toWei('10', 'gwei');
      const FEE = 0;
      const BOUNTY = web3.toWei('0.01', 'ether');
      const REQUIRED_DEPOSIT = 0;

      await schedule(
        RECEIVER,
        '',
        CALL_GAS,
        AMOUNT,
        WINDOW_SIZE,
        WINDOW_START,
        FUTURE_GAS_PRICE,
        FEE,
        BOUNTY,
        REQUIRED_DEPOSIT
      );
    } else {
      web3.eth.sendTransaction(
        {
          from: defaultAccount,
          to: RECEIVER,
          value: AMOUNT
        },
        error => {
          alert(error ? 'Error.' : 'Success!');
        }
      );
    }
  }

  document.querySelector('#send-salary').addEventListener('click', () => sendSalary(true));
})();
