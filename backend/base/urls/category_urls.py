from django.urls import path
from base.views import category_views as views

urlpatterns=[
    path('', views.getCategories,name="category"),
    path('create/', views.createCategory,name="category-create"),
    path('update/<str:pk>/',views.updateCategory,name="category-update"),
    path('delete/<str:pk>/',views.deleteCategory,name="category-delete"), 
    path("<str:pk>/",views.getCategoryById,name="category-id"),

]