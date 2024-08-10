// Transfer.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Transfer = () => {
    const { pk } = useParams(); // Account ID from URL
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [targetAccountNumber, setTargetAccountNumber] = useState("");
    const [error, setError] = useState("");
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/")
            .then(response => setAccounts(response.data))
            .catch(error => setError("Error fetching accounts"));
    }, []);

    const handleTransfer = () => {
        axios.post(`http://localhost:8000/${pk}/transfer/`, { amount, target_account_number: targetAccountNumber })
            .then(response => {
                alert(response.data.status);
                navigate("/"); // Redirect after successful transfer
            })
            .catch(error => {
                setError(error.response?.data?.error || "An error occurred");
            });
    };

    return (
        <div>
            <h2>Transfer Money</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <input
                type="text"
                value={targetAccountNumber}
                onChange={(e) => setTargetAccountNumber(e.target.value)}
                placeholder="Target Account Number"
            />
            <button onClick={handleTransfer}>Transfer</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Transfer;
