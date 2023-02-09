from django.urls import path
from base.views import size_views as views

urlpatterns=[
    path('', views.getSizes,name="sizes"),
    path('create/', views.createSize,name="size-create"),
    path('update/<str:pk>/',views.updateSize,name="size-update"),
    path('delete/<str:pk>/',views.deleteSize,name="size-delete"), 
    path("<str:pk>/",views.getSizeById,name="size-id"),

]