from django.contrib import admin
from .models import Account, Transaction

class AccountAdmin(admin.ModelAdmin):
    list_display = ('pk', 'account_number', 'balance', 'iban')
    search_fields = ('account_number', 'iban')

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('pk', 'account', 'amount', 'transaction_type', 'related_account', 'date')
    search_fields = ('account__account_number', 'related_account__account_number', 'transaction_type')
    list_filter = ('transaction_type', 'date')

# Register your models with the custom admin classes
admin.site.register(Account, AccountAdmin)
admin.site.register(Transaction, TransactionAdmin)
