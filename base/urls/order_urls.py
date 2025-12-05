from django.urls import path 
from base.views import order_views as views

# beacuse this is the products urls page. we dont need to put product in the urls again
urlpatterns = [
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='my-orders'),
    path('list/', views.getOrders, name='order-list'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/delivered', views.updateOrderToDelivered, name='delivered'),
    path('<str:pk>/pay', views.updateOrderToPaid, name='pay'),
]