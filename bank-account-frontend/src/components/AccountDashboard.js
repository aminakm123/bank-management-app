import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AccountDashboard.css";

axios.defaults.baseURL = 'http://localhost:8000';

const AccountDashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [targetAccountNumber, setTargetAccountNumber] = useState("");
    const [actionType, setActionType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/")
            .then((response) => {
                console.log(response.data); // Log the response data
                setAccounts(response.data);
            })
            .catch((error) => console.error("Error fetching accounts:", error));
    }, []);

    const handleAction = (action) => {
        setActionType(action);
        setTargetAccountNumber(""); // Clear target account for non-transfer actions

        // Redirect based on action type
        if (action === "deposit") {
            navigate("/deposit");
        } else if (action === "withdraw") {
            navigate("/withdraw");
        } else if (action === "transfer") {
            navigate("/transfer");
        }
    };

    const performAction = () => {
        if (!selectedAccount || !amount || (actionType === "transfer" && !targetAccountNumber)) {
            alert("Please fill in all required fields.");
            return;
        }

        let url = "";
        let data = { amount: parseFloat(amount) };

        if (actionType === "deposit") {
            url = `/${selectedAccount}/deposit/`;
        } else if (actionType === "withdraw") {
            url = `/${selectedAccount}/withdraw/`;
        } else if (actionType === "transfer") {
            url = `/${selectedAccount}/transfer/`;
            data = { ...data, target_account_number: targetAccountNumber };
        }

        axios
            .post(url, data)
            .then((response) => {
                alert(response.data.status);
                setAmount(""); // Clear the amount input field
                setTargetAccountNumber(""); // Clear the target account input field
                setActionType(null); // Reset action type
                setSelectedAccount(""); // Clear selected account
            })
            .catch((error) => console.error(`Error performing ${actionType}:`, error));
    };

    return (
        <div className="dashboard-container">
            <div className="actions">
                <h3>Banking Actions</h3>
                <div className="action-buttons">
                    <button onClick={() => handleAction("deposit")} className="action-button">
                        Deposit
                    </button>
                    <button onClick={() => handleAction("withdraw")} className="action-button">
                        Withdraw
                    </button>
                    <button onClick={() => handleAction("transfer")} className="action-button">
                        Transfer
                    </button>
                </div>

                {actionType && (
                    <div className="form-group">
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="input-field"
                        >
                            <option value="" disabled>Select Account</option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.account_number}>
                                    Account: {account.account_number} - Balance: {account.balance}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            className="input-field"
                        />
                        {actionType === "transfer" && (
                            <input
                                type="text"
                                value={targetAccountNumber}
                                onChange={(e) => setTargetAccountNumber(e.target.value)}
                                placeholder="Target Account Number"
                                className="input-field"
                            />
                        )}
                        <button onClick={performAction} className="action-button">
                            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                        </button>
                    </div>
                )}
            </div>
            <div className="account-links">
                <h3>Bank Accounts - Click To See the Statements</h3>
                <ul>
                    {accounts.map(account => (
                        <li key={account.id}>
                            <a href={`/account/${account.id}/statement/`} target="_blank" rel="noopener noreferrer">
                                Account: {account.account_number}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AccountDashboard;
