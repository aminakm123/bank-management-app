# bank-management-app

Banking Web Application



Overview

This project is a simple banking web application built using Django REST Framework for the backend and React for the frontend. The application allows users to create accounts, deposit, withdraw, and transfer money between accounts. The project is designed with clean code principles, good software design, and automated testing.

Features

Account Creation: Users can create a new bank account.
Deposit: Users can deposit money into their account.
Withdraw: Users can withdraw money from their account.
Transfer: Users can transfer money between accounts.
Account Statement: Users can view transaction history with filtering and sorting options.


Project Structure

Backend: Django REST Framework

Models: Account, Transaction
Serializers: AccountSerializer, TransactionSerializer, WithdrawalSerializer
Views: AccountListCreate, AccountDetail, DepositMoney, WithdrawMoney, TransferMoney, AccountStatement
URL Endpoints:
POST /api/accounts/ - Create a new account
GET /api/accounts/<int:pk>/ - Retrieve account details
POST /api/accounts/<int:pk>/deposit/ - Deposit money
POST /api/accounts/<int:pk>/withdraw/ - Withdraw money
POST /api/accounts/<int:pk>/transfer/ - Transfer money
GET /api/accounts/<int:pk>/statement/ - Get account statement
Frontend: React

Components: AccountDashboard, AccountCreation
Routes:
/ - Account creation page
/dashboard - Account dashboard with 3 banking options
/deposit - Deposit money page
/withdraw - Withdraw money page
/transfer - Transfer money page


Installation


Backend Setup


Clone the repository:


git clone https://github.com/yourusername/banking-app.git

cd banking-app/backend

Create and activate a virtual environment:


python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

Install dependencies:

pip install -r requirements.txt

Apply migrations:

python manage.py migrate

Run the development server:



python manage.py runserver

Frontend Setup
Navigate to the frontend directory:


cd ../bank-account-frontendfrontend

Install dependencies:

npm install

Run the development server:

npm start

http://localhost:3000
Create an account, then use the dashboard to perform deposits, withdrawals, and transfers.



