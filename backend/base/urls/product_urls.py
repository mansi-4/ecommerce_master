from django.urls import path
from base.views import product_views as views
urlpatterns=[
    path('', views.getProducts,name="products"),
    path('create/', views.createProduct,name="product-create"),
    path('upload/', views.uploadImage,name="image-upload"),
    path('<str:pk>/reviews/', views.createProductReview,name="create-review"),
    path('top/',views.getTopProducts,name="top-product"),
    path('<str:pk>', views.getProduct,name="product"),
    path('<str:pk>/distinct/', views.getProductByDistinctColor,name="distinct-product-by-color"),
    path('update/<str:pk>/',views.updateProduct,name="product-update"),
    path('delete/<str:pk>/',views.deleteProduct,name="product-delete"), 
    path('<str:pk>/variations/',views.getProductVariations,name="get-variations"),
    path('<str:pk>/variation/',views.getProductVariation,name="get-variation"),
    path('size_by_color/',views.getProductVariationSizeByColor,name="get-size-by-color"),
    path('variation_by_size/',views.getProductVariationBySize,name="get-variation-by-size"),
    path('<str:pk>/create_variation/',views.createProductVariation,name="variation-create"),
    path('update/variation/<str:pk>/',views.updateProductVariation,name="variation-update"),
    path('delete/variation/<str:pk>/',views.deleteProductVariation,name="variation-delete"), 
]