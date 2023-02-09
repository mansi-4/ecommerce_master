from django.urls import path
from base.views import user_views as views

  
urlpatterns = [
   path("",views.getUsers,name="all-Users"),
   path("register",views.registerUser,name="add-User"),
   path("login",views.loginUser,name="login-User"), 
   path('profile_update/', views.updateUserProfile,name="user-profile-update"),
   path("profile",views.userProfile,name="User-profile"),
   path("update/<str:pk>/",views.updateUser,name="update-User"),
   path("delete/<str:pk>/",views.deleteUser,name="delete-User"),
   path("<str:pk>",views.getUserById,name="User-by-id"),
   
]