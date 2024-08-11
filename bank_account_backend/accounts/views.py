from decimal import Decimal, InvalidOperation
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Account, Transaction
from .serializers import AccountSerializer, StatementSerializer, TransactionSerializer, WithdrawalSerializer
from django.db import transaction as db_transaction
from django.core.paginator import Paginator
from datetime import datetime


class AccountListCreate(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class AccountDetail(generics.RetrieveAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class DepositMoney(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = TransactionSerializer

    def post(self, request):
        account_number = request.data.get('account_number')

        try:
            # Retrieve the account based on the account number
            account = Account.objects.get(account_number=account_number)
        except Account.DoesNotExist:
            return Response({'error': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)

        amount_str = request.data.get('amount', 0)

        try:
            # Convert the amount to a float or decimal for comparison and calculation
            amount = Decimal(amount_str)
        except ValueError:
            return Response({'error': 'Invalid amount. Please enter a valid number.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({'error': 'Deposit amount must be positive.'}, status=status.HTTP_400_BAD_REQUEST)

        account.balance += amount
        account.save()

        # Create a transaction record for the deposit
        Transaction.objects.create(
            account=account,
            amount=amount,
            transaction_type='deposit'
        )

        return Response({'status': 'Deposit successful'}, status=status.HTTP_200_OK)
    
class WithdrawMoney(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = WithdrawalSerializer

    def post(self, request):
        account_number = request.data.get('account_number')

        try:
            # Retrieve the account based on the account number
            account = Account.objects.get(account_number=account_number)
        except Account.DoesNotExist:
            return Response({'error': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)

        amount_str = request.data.get('amount', 0)

        try:
            # Convert the amount to a float or decimal for comparison and calculation
            amount = Decimal(amount_str)
        except InvalidOperation:
            return Response({'error': 'Invalid amount. Please enter a valid number.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({'error': 'Withdrawal amount must be positive.'}, status=status.HTTP_400_BAD_REQUEST)

        if account.balance < amount:
            return Response({'error': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)

        account.balance -= amount
        account.save()

        # Create a transaction record for the withdrawal
        Transaction.objects.create(
            account=account,
            amount=-amount,
            transaction_type='withdrawal'
        )

        return Response({'status': 'Withdrawal successful'}, status=status.HTTP_200_OK)


class TransferMoney(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = TransactionSerializer

    def post(self, request):
        source_account_number = request.data.get('source_account_number')
        target_account_number = request.data.get('target_account_number')
        amount_str = request.data.get('amount', '0')  # Default to '0' if amount is missing

        try:
            # Retrieve the source and target accounts based on their account numbers
            source_account = Account.objects.get(account_number=source_account_number)
            target_account = Account.objects.get(account_number=target_account_number)
        except Account.DoesNotExist:
            return Response({'error': 'One or both accounts not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Convert the amount to a float or decimal for comparison and calculation
            amount = Decimal(amount_str)
        except InvalidOperation:
            return Response({'error': 'Invalid amount. Please enter a valid number.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({'error': 'Transfer amount must be positive.'}, status=status.HTTP_400_BAD_REQUEST)

        if source_account.balance < amount:
            return Response({'error': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)

        with db_transaction.atomic():
            source_account.balance -= amount
            target_account.balance += amount
            source_account.save()
            target_account.save()

            # Create transaction records for both the source and target accounts
            Transaction.objects.create(
                account=source_account,
                amount=-amount,
                transaction_type='transfer',
                related_account=target_account
            )

            Transaction.objects.create(
                account=target_account,
                amount=amount,
                transaction_type='transfer',
                related_account=source_account
            )

        return Response({'status': 'Transfer successful'}, status=status.HTTP_200_OK)

class AccountStatement(generics.ListAPIView):
    serializer_class = StatementSerializer

    def get_queryset(self):
        account = Account.objects.get(pk=self.kwargs['pk'])
        transactions = account.transactions.all().order_by('-date')
        
        # Apply filters and sorting if needed
        transaction_type = self.request.query_params.get('transaction_type', 'all')
        sort_order = self.request.query_params.get('sort', 'desc')
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        if transaction_type != 'all':
            transactions = transactions.filter(transaction_type=transaction_type)

        if start_date:
            transactions = transactions.filter(date__gte=datetime.strptime(start_date, '%Y-%m-%d'))

        if end_date:
            transactions = transactions.filter(date__lte=datetime.strptime(end_date, '%Y-%m-%d'))

        if sort_order == 'asc':
            transactions = transactions.order_by('date')

        return transactions

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Pagination
        page_number = request.query_params.get('page', 1)
        items_per_page = request.query_params.get('items_per_page', 10)
        paginator = Paginator(queryset, items_per_page)

        page_obj = paginator.get_page(page_number)

        serializer = self.get_serializer(page_obj, many=True)
        return Response({
            'results': serializer.data,
            'total_pages': paginator.num_pages,
            'current_page': page_obj.number,
            'total_items': paginator.count,
        })
