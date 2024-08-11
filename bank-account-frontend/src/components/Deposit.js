import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AccountCreation.css"; // Assuming the same CSS is used for consistency

const Deposit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        accountNumber: "",
        amount: "",
        transactionType: "deposit", // Default transaction type
    });
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/")
            .then(response => {
                setAccounts(response.data); // assuming response.data is the list of accounts
            })
            .catch(error => {
                setError("There was an error fetching the accounts!");
                console.error(error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDeposit = () => {
        axios.post("http://127.0.0.1:8000/deposit/", {
            account_number: formData.accountNumber,
            amount: formData.amount,
            transaction_type: formData.transactionType,
        })
            .then(response => {
                alert(response.data.status);
                navigate("/dashboard"); // Redirect after successful deposit
            })
            .catch(error => {
                setError(error.response?.data?.error || "An error occurred");
            });
    };

    return (
        <div className="account-creation-container">
            <h2>Deposit Money</h2>
            <div className="form-group">
                <select
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.account_number}>
                            {account.account_number}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    className="input-field"
                    required
                />
            </div>
            <div className="form-group">
                <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="transfer">Transfer</option>
                </select>
            </div>
            <button type="button" onClick={handleDeposit} className="action-button">
                Submit
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Deposit;
