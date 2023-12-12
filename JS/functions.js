// functions.js
import query from './query.js';
import accounts from './objects.js';

let currentAccount;
let selectedAccount;

const func = {
  // ------------------ Login ------------------

  handleLoginEvent: function (event) {
    event.preventDefault();

    currentAccount = accounts.find(
      (acc) => acc.username === query.inputLoginUsername.value
    );

    const enteredPin = Number(query.inputLoginPin.value);

    if (currentAccount && currentAccount.pin === enteredPin) {
      query.containerApp.style.opacity = '100%';
      query.inputLoginUsername.value = query.inputLoginPin.value = '';
      query.inputLoginPin.blur();

      query.labelWelcome.innerText = `Welcome back ${
        currentAccount.owner.split(' ')[0]
      }`;

      query.labelBalance.innerText = `${currentAccount.movements.reduce(
        (acc, movement) => acc + movement
      )}MDL`;

      func.stats(currentAccount);
      func.countdown();
      func.movement(currentAccount);
      func.sortMovements(currentAccount);
    }
  },

  // ------------------ Countdown ------------------

  countdown: function () {
    let timer = 300;
    const countdownElement = query.labelTimer;

    function updateCountdown() {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;

      const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      countdownElement.textContent = formattedTime;

      timer--;

      if (timer < 0) {
        clearInterval(intervalId);
        countdownElement.textContent = '0:00';

        const index = accounts.findIndex(
          (acc) => acc.username === currentAccount.username
        );
        accounts.splice(index, 1);
        query.containerApp.innerHTML = '';
        query.labelWelcome.innerText = 'Log in to get started';
      }
    }

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
  },

  // ------------------ New Movement ------------------

  movement: function (currentAccount) {
    if (currentAccount && currentAccount.movements) {
      currentAccount.movements.forEach((movement) => {
        const movementType = movement > 0 ? 'deposit' : 'withdraw';
        query.containerMovements.insertAdjacentHTML(
          'afterbegin',
          `<div class="movements__row">
            <div class="movements__type movements__type--${movementType}">${movementType}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${Math.abs(movement)}MDL</div>
          </div>`
        );
      });
    } else {
      console.error('Current account or movements not defined.');
    }
  },

  // ------------------ Sort Movements ------------------

  sortMovements: function (currentAccount) {
    query.btnSort.addEventListener('click', function () {
      if (currentAccount && currentAccount.movements) {
        currentAccount.movements.sort((a, b) => a - b);
        query.containerMovements.innerHTML = '';
        func.movement(currentAccount);
      } else {
        console.error('Current account or movements not defined.');
      }
    });
  },

  // ------------------ Stats ------------------

  stats: function (currentAccount) {
    if (currentAccount && currentAccount.movements) {
      const movements = currentAccount.movements;

      const deposits = movements
        .filter((money) => money > 0)
        .reduce((container, money) => container + money, 0);

      query.labelSumIn.innerText = `${deposits}MDL`;

      const withdraw = movements
        .filter((money) => money < 0)
        .reduce((container, money) => container + money, 0);

      query.labelSumOut.innerText = `${Math.abs(withdraw)}MDL`;

      const interest = movements
        .filter((money) => money > 0)
        .map((money) => (money * 1.2) / 100)
        .reduce((acc, money) => acc + money, 0);

      query.labelSumInterest.innerText = `${interest.toFixed(2)}MDL`;
    } else {
      console.error('Current account or movements not defined.');
    }
  },

  // ------------------ Sign Out ------------------

  closeAccount: function (event) {
    event.preventDefault();

    if (
      currentAccount &&
      currentAccount.username === query.inputCloseUsername.value &&
      currentAccount.pin === Number(query.inputClosePin.value)
    ) {
      const index = accounts.findIndex(
        (acc) => acc.username === currentAccount.username
      );
      accounts.splice(index, 1);
      query.containerApp.innerHTML = '';
      query.labelWelcome.innerText = 'Log in to get started';
    } else {
      console.error('Current account not defined or invalid credentials.');
    }
  },

  // ------------------ Transfer money ------------------

  transferMoney: function () {
    let selectedAccount;

    query.btnTransfer.addEventListener('click', function (event) {
      event.preventDefault();

      if (currentAccount && currentAccount.movements) {
        // Withdrawing money from the current account
        currentAccount.movements.push(
          Number(
            query.inputTransferAmount.value -
              2 * query.inputTransferAmount.value
          )
        );

        // Recalculate balance
        query.labelBalance.innerText = `${currentAccount.movements.reduce(
          (acc, movement) => acc + movement
        )}MDL`;

        query.containerMovements.innerHTML = '';
        func.movement(currentAccount);

        // Depositing money to another account
        selectedAccount = accounts.find(
          (acc) => acc.username === query.inputTransferTo.value
        );

        if (selectedAccount && selectedAccount.movements) {
          selectedAccount.movements.push(
            Number(query.inputTransferAmount.value)
          );

          query.inputTransferAmount.value = query.inputTransferTo.value = '';
        } else {
          console.error('Selected account or movements not defined.');
        }
      } else {
        console.error('Current account or movements not defined.');
      }
    });
  },

  // ------------------ Request loan ------------------

  requestLoan: function () {
    query.btnLoan.addEventListener('click', function (event) {
      event.preventDefault();

      if (currentAccount && currentAccount.movements) {
        setTimeout(() => {
          currentAccount.movements.push(Number(query.inputLoanAmount.value));

          query.labelBalance.innerText = `${currentAccount.movements.reduce(
            (acc, movement) => acc + movement
          )}MDL`;

          query.containerMovements.innerHTML = '';
          func.movement(currentAccount);

          query.inputLoanAmount.value = '';
        }, 1000);
      } else {
        console.error('Current account or movements not defined.');
      }
    });
  },
};

export default func;
