'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  username: 'JS',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  username: 'JD',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  username: 'STW',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  username: 'SS',
  movements: [430, 1000, -1300, 700, 50, 90, -420],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Login
let currentAccount;
let selectedAccount;

const login = function () {
  btnLogin.addEventListener('click', function (event) {
    event.preventDefault();

    //Finding account
    currentAccount = accounts.find(
      (acc) => acc.username === inputLoginUsername.value
    );

    // Password check
    if (currentAccount.pin === Number(inputLoginPin.value)) {
      containerApp.style.opacity = '100%';
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
    }

    // Greeting message
    labelWelcome.innerText = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Clearing previous movements container
    containerMovements.innerHTML = '';

    // Calculate and displaying the balance
    labelBalance.innerText = `${currentAccount.movements.reduce(
      (acc, movement) => acc + movement
    )}MDL`;

    // Displaying movements
    currentAccount.movements.forEach((movement) => {
      const movementType = movement > 0 ? 'deposit' : 'withdraw';
      containerMovements.insertAdjacentHTML(
        'afterbegin',
        `<div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${movementType}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${Math.abs(movement)}MDL</div>
        </div>`
      );
    });

    /////////////////////////////////////////////////////////////////////////////////////////////

    const countdown = function () {
      let timer = 300;
      const countdownElement = labelTimer;

      function updateCountdown() {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        countdownElement.textContent = formattedTime;

        timer--;

        if (timer < 0) {
          clearInterval(intervalId);
          countdownElement.textContent = '0:00';
          
          accounts.splice(index, 1);
          containerApp.innerHTML = '';
          labelWelcome.innerText = 'Log in to get started';
        }
      }

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 1000);
    };

    countdown();

    // Displaying stats
    stats(currentAccount.movements);
  });
};

login();

/////////////////////////////////////////////////////////////////////////////////////////////

// Statistics
const stats = function (movements) {
  const deposits = movements
    .filter((money) => money > 0)
    .reduce((container, money) => container + money);

  labelSumIn.innerText = `${deposits}MDL`;

  const withdraw = movements
    .filter((money) => money < 0)
    .reduce((container, money) => container + money);

  labelSumOut.innerText = `${Math.abs(withdraw)}MDL`;

  const interest = movements
    .filter((money) => money > 0)
    .map((money) => (money * 1.2) / 100)
    .reduce((acc, money) => acc + money);
  labelSumInterest.innerText = `${interest.toFixed(2)}MDL`;
};
/////////////////////////////////////////////////////////////////////////////////////////////
// Transfer money
const transferMoney = function () {
  btnTransfer.addEventListener('click', function (event) {
    event.preventDefault();
    // Withdrawing money from current account
    currentAccount.movements.push(
      Number(inputTransferAmount.value - 2 * inputTransferAmount.value)
    );

    // Recalculate balance
    labelBalance.innerText = `${currentAccount.movements.reduce(
      (acc, movement) => acc + movement
    )}MDL`;

    containerMovements.innerHTML = '';

    currentAccount.movements.forEach((movement) => {
      const movementType = movement > 0 ? 'deposit' : 'withdraw';
      containerMovements.insertAdjacentHTML(
        'afterbegin',
        `<div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${movementType}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${Math.abs(movement)}MDL</div>
        </div>`
      );
    });

    // Depositing money to another account
    selectedAccount = accounts.find(
      (acc) => acc.username === inputTransferTo.value
    );

    selectedAccount.movements.push(Number(inputTransferAmount.value));

    inputTransferAmount.value = inputTransferTo.value = '';
  });
};

transferMoney();
/////////////////////////////////////////////////////////////////////////////////////////////

// Request loan
const requestLoan = function () {
  btnLoan.addEventListener('click', function (event) {
    event.preventDefault();

    setTimeout(() => {
      currentAccount.movements.push(Number(inputLoanAmount.value));

      labelBalance.innerText = `${currentAccount.movements.reduce(
        (acc, movement) => acc + movement
      )}MDL`;

      containerMovements.innerHTML = '';

      currentAccount.movements.forEach((movement) => {
        const movementType = movement > 0 ? 'deposit' : 'withdraw';
        containerMovements.insertAdjacentHTML(
          'afterbegin',
          `<div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${movementType}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${Math.abs(movement)}MDL</div>
        </div>`
        );
      });

      inputLoanAmount.value = '';
    }, 1000);
  });
};

requestLoan();

/////////////////////////////////////////////////////////////////////////////////////////////

// Account Timeout
const closeAccount = function () {
  btnClose.addEventListener('click', function (event) {
    event.preventDefault();

    // Deleting the user from database
    if (
      currentAccount.username === inputCloseUsername.value &&
      currentAccount.pin === Number(inputClosePin.value)
    ) {
      const index = accounts.findIndex(
        (acc) => acc.username === currentAccount.username
      );
      accounts.splice(index, 1);
      containerApp.innerHTML = '';
      labelWelcome.innerText = 'Log in to get started';
    }
  });
};

closeAccount();

/////////////////////////////////////////////////////////////////////////////////////////////

const sortMovements = function () {
  btnSort.addEventListener('click', function () {
    currentAccount.movements.sort((a, b) => a - b);
    containerMovements.innerHTML = '';

    currentAccount.movements.forEach((movement) => {
      const movementType = movement > 0 ? 'deposit' : 'withdraw';
      containerMovements.insertAdjacentHTML(
        'afterbegin',
        `<div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${movementType}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${Math.abs(movement)}MDL</div>
        </div>`
      );
    });
  });
};

sortMovements();
