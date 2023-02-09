from django.urls import path
from base.views import color_views as views

urlpatterns=[
    path('', views.getColors,name="colors"),
    path('create/', views.createColor,name="color-create"),
    path('update/<str:pk>/',views.updateColor,name="color-update"),
    path('delete/<str:pk>/',views.deleteColor,name="color-delete"), 
    path("<str:pk>/",views.getColorById,name="color-id"),

]