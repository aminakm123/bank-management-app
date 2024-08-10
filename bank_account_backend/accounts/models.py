from django.db import models
from django.utils.translation import gettext_lazy as _
import re

TRANSACTION_TYPES = [
    ('deposit', 'Deposit'),
    ('withdrawal', 'Withdrawal'),
    ('transfer', 'Transfer'),
]

class Account(models.Model):
    account_number = models.CharField(max_length=20, unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    iban = models.CharField(max_length=34, unique=True)

    def __str__(self):
        return f"Account {self.account_number} with balance {self.balance}"

    def is_valid_iban(self):
        # IBAN validation regex pattern
        iban_pattern = r'^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$'
        return re.match(iban_pattern, self.iban) is not None

class Transaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    related_account = models.ForeignKey(Account, null=True, blank=True, on_delete=models.SET_NULL, related_name='related_transactions',verbose_name=_("Source Account"))

    def __str__(self):
        return f"{self.transaction_type.capitalize()} of {self.amount} on {self.date}"
