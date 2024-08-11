from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('', views.AccountListCreate.as_view(), name='account-list-create'),
    path('<int:pk>/', views.AccountDetail.as_view(), name='account-detail'),
    path('deposit/', views.DepositMoney.as_view(), name='deposit-money'),
    path('withdraw/', views.WithdrawMoney.as_view(), name='withdraw-money'),
    path('transfer/', views.TransferMoney.as_view(), name='transfer-money'),
    path('<int:pk>/statement/', views.AccountStatement.as_view(), name='account-statement'),
]
