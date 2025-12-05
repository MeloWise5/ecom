from django.urls import path 
from base.views import user_views as views

# this is the user urls page. we dont need to put user in the urls again
urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain'),
    path('register/', views.registerUser, name='register'),
    path('', views.getUsers, name='users'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('<str:pk>/', views.getUserById, name='user-profile-by-id'),
    path('delete/<str:pk>/', views.deleteUser, name='user-profile-delete'),
    path('update/<str:pk>/', views.updateUserById, name='user-profile-update-by-id'),
]