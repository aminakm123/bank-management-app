import React from "react";
import AccountDashboard from "./components/AccountDashboard";
import AccountCreation from "./components/AccountCreation";
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
        <Route path="/deposit/:pk" element={<Deposit />} />
        <Route path="/withdraw/:pk" element={<Withdraw />} />
        <Route path="/transfer/:pk" element={<Transfer />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
