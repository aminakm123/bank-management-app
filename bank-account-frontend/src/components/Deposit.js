// Deposit.js
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Deposit = () => {
    const { pk } = useParams(); // Account ID from URL
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    const handleDeposit = () => {
        axios.post(`http://localhost:8000/${pk}/deposit/`, { amount })
            .then(response => {
                alert(response.data.status);
                navigate("/"); // Redirect after successful deposit
            })
            .catch(error => {
                setError(error.response?.data?.error || "An error occurred");
            });
    };

    return (
        <div>
            <h2>Deposit Money</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <button onClick={handleDeposit}>Deposit</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Deposit;
