from rest_framework import serializers
from .models import Account, Transaction

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'account_number', 'balance', 'iban']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'account', 'date', 'amount', 'transaction_type', 'related_account']

class WithdrawalSerializer(serializers.ModelSerializer):
    # Do not include related_account for withdrawals
    class Meta:
        model = Transaction
        fields = ['id', 'related_account', 'date', 'amount', 'transaction_type']

class StatementSerializer(serializers.ModelSerializer):
    related_account_balance = serializers.DecimalField(
        source='related_account.balance',
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Transaction
        fields = ['id', 'date', 'amount', 'transaction_type', 'related_account_balance']
