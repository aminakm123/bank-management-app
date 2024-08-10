import React, { useState } from "react";
import axios from "axios";
import "./AccountCreation.css";
import { useNavigate } from "react-router-dom"; 


const AccountCreation = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [iban, setIban] = useState("");
    const [balance, setBalance] = useState("");

    const navigate = useNavigate();  

    const handleCreateAccount = () => {
        axios
            .post("http://127.0.0.1:8000/", {
                account_number: accountNumber,
                iban: iban,
                balance: parseFloat(balance),
            })
            .then((response) => {
                alert("Account created successfully!");
                setAccountNumber("");
                setIban("");
                setBalance("");
                navigate("/dashboard");
            })
            .catch((error) => console.error("Error creating account:", error));
    };

    return (
        <div className="account-creation-container">
            <h2>Create a New Account</h2>
            <div className="form-group">
                <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Account Number"
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="IBAN"
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="Initial Balance"
                    className="input-field"
                />
            </div>
            <button onClick={handleCreateAccount} className="action-button">
                Create Account
            </button>
        </div>
    );
};

export default AccountCreation;
