from decimal import Decimal, InvalidOperation
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Account, Transaction
from .serializers import AccountSerializer, TransactionSerializer, WithdrawalSerializer
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

    def post(self, request, pk):
        account = self.get_object()
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

        Transaction.objects.create(
            account=account,
            amount=amount,
            transaction_type='deposit'
        )

        return Response({'status': 'Deposit successful'}, status=status.HTTP_200_OK)

class WithdrawMoney(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = WithdrawalSerializer

    def post(self, request, pk):
        account = self.get_object()
        amount_str = request.data.get('amount', 0)

        try:
            # Convert the amount to a float or decimal for comparison and calculation
            amount = Decimal(amount_str)
        except ValueError:
            return Response({'error': 'Invalid amount. Please enter a valid number.'}, status=status.HTTP_400_BAD_REQUEST)


        if amount <= 0:
            return Response({'error': 'Withdrawal amount must be positive.'}, status=status.HTTP_400_BAD_REQUEST)

        if account.balance < amount:
            return Response({'error': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)

        account.balance -= amount
        account.save()

        Transaction.objects.create(
            account=account,
            amount=-amount,
            transaction_type='withdrawal'
        )

        return Response({'status': 'Withdrawal successful'}, status=status.HTTP_200_OK)


class TransferMoney(generics.GenericAPIView):
    queryset = Account.objects.all()
    serializer_class = TransactionSerializer

    def post(self, request, pk):
        source_account = self.get_object()
        amount_str = request.data.get('amount', '0')  # Default to '0' if amount is missing
        
        # Instantiate and validate the serializer with incoming request data
        transfer_serializer = self.serializer_class(data=request.data)
        
        # Check if the serializer data is valid
        if not transfer_serializer.is_valid():
            return Response(transfer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Extract the account (which is the target account in this context) from validated data
        target_account = transfer_serializer.validated_data.get('account')
        amount_str = transfer_serializer.validated_data.get('amount')

        # Rest of your logic to perform the transfer
        try:
            amount = Decimal(amount_str)
        except InvalidOperation:
            return Response({'error': 'Invalid amount. Please enter a valid number.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({'error': 'Transfer amount must be positive.'}, status=status.HTTP_400_BAD_REQUEST)

        if source_account.balance < amount:
            return Response({'error': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)

        if not target_account:
            return Response({'error': 'Target account is required'}, status=status.HTTP_400_BAD_REQUEST)

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
    serializer_class = TransactionSerializer

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
