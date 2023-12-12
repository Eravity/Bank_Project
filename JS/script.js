// script.js
import query from './query.js';
import func from './functions.js';

// Main app
let currentAccount;

query.btnLogin.addEventListener('click', func.handleLoginEvent);
query.containerMovements.innerHTML = '';

func.movement(currentAccount);
func.transferMoney();
func.requestLoan();
func.closeAccount();