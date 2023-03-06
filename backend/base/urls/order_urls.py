from django.urls import path
from base.views import order_views as views
urlpatterns=[
   path("",views.getOrders,name="all-orders"),
   path("invoice/",views.InvoiceCreation,name="create-invoice"),
   path("add/",views.addOrderItems,name="orders-add"),
   path("myorders/",views.getMyOrders,name="myorders"),
   path("<str:pk>/deliver/",views.updateOrderToDelivered,name="deliver"),
   path("<str:pk>/",views.getOrderById,name="user-order"),
   path("<str:pk>/pay/",views.updateOrderToPaid,name="pay"),
   
]