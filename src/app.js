import '../styles/app.scss';
import Web3 from 'web3';

(async () => {
  await window.ethereum.enable();

  const web3 = new Web3(window.ethereum);

  const defaultAccount = web3.eth.accounts[0];

  async function sendSalary(atLaterTime = false) {
    const AMOUNT = web3.toWei('0.1', 'ether');
    const RECEIVER = '0xd8c6F58BbF71E0739E4CCfe9f9721a07285bB895';

    if (atLaterTime) {
      // ...
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

  document.querySelector('#send-salary').addEventListener('click', () => sendSalary(false));
})();
