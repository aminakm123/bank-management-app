import React from "react";
import AccountDashboard from "./components/AccountDashboard";
import AccountCreation from "./components/AccountCreation";
import AccountStatement from "./components/AccountStatement";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import Transfer from "./components/Transfer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



function App() {
  return (
    <Router>
    <div className="App">
      <h1>Bank Account Dashboard</h1>
      <Routes>
        <Route path="/" element={<AccountCreation />} />
        <Route path="/dashboard" element={<AccountDashboard />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/account/:id/statement/" element={<AccountStatement />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
