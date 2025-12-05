from django.urls import path 
from base.views import product_views as views

# beacuse this is the products urls page. we dont need to put product in the urls again
urlpatterns = [
    
    path('', views.getProducts, name='products'),
    path('create/', views.createProduct, name='product-create'),
    path('upload/', views.uploadImage, name='product-upload-image'),
    path('reviews/', views.getReviews, name='product-upload-image'),
    # you have to have create above this str:pk line. 
    path('<str:pk>/reviews/', views.createProductReview, name='product-reviews'),
    path('top5/', views.getTopProducts, name='top-products'),
    path('<str:pk>/', views.getProduct, name='product'),
    path('update/<str:pk>/', views.updateProduct, name='product-update'),
    path('delete/<str:pk>/', views.deleteProduct, name='product-delete'),
]