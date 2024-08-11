import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AccountCreation.css"; // Ensure this CSS file is correctly loaded and applied

const Transfer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sourceAccountNumber: "",
        targetAccountNumber: "",
        amount: "",
        transactionType: "transfer", // Default transaction type
    });
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/")
            .then(response => setAccounts(response.data)) // Assuming response.data is the list of accounts
            .catch(error => {
                setError("There was an error fetching the accounts!");
                console.error(error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTransfer = () => {
        axios.post("http://127.0.0.1:8000/transfer/", {
            source_account_number: formData.sourceAccountNumber,
            target_account_number: formData.targetAccountNumber,
            amount: formData.amount,
            transaction_type: formData.transactionType,
        })
            .then(response => {
                alert(response.data.status);
                navigate("/dashboard"); // Redirect after successful transfer
            })
            .catch(error => {
                setError(error.response?.data?.error || "An error occurred");
            });
    };

    return (
        <div className="account-creation-container">
            <h2>Transfer Money</h2>
            <div className="form-group">
                <select
                    name="sourceAccountNumber"
                    value={formData.sourceAccountNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                >
                    <option value="">Select Source Account</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.account_number}>
                            {account.account_number}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <select
                    name="targetAccountNumber"
                    value={formData.targetAccountNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                >
                    <option value="">Select Target Account</option>
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
            <button type="button" onClick={handleTransfer} className="action-button">
                Submit
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Transfer;
