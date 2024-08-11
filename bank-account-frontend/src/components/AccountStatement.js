import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AccountStatement.css";

const AccountStatement = () => {
    const { id } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/${id}/statement/`)
            .then(response => {
                console.log("API Response:", response.data); // Log the entire response object
                setTransactions(response.data.results || []);
                setLoading(false);
            })
            .catch(error => {
                setError("There was an error fetching the account statement.");
                console.error("Error fetching account statement:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="statement-container">
            <h2>Account Statement</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {transactions.length === 0 && !error && <p>No transactions found.</p>}
            {transactions.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Related Account Balance</th> {/* Updated column header */}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{transaction.date}</td>
                                <td>{transaction.transaction_type}</td>
                                <td>{transaction.amount}</td>
                                <td>
                                    {transaction.related_account_balance ? (
                                        transaction.related_account_balance
                                    ) : (
                                        "N/A"
                                    )}
                                </td> {/* Display related account balance */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AccountStatement;
