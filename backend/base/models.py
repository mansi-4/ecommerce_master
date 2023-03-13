from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Users(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    is_superuser=models.BooleanField(default=False)
    status= models.IntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'tblusers'

class Color(models.Model):
    color = models.CharField(max_length=200, null=True, blank=True)
    status= models.IntegerField(default=0)

    def __str__(self):
        return self.color

    class Meta:
        db_table = 'tblColor'

class Size(models.Model):
    size = models.CharField(max_length=200, null=True, blank=True)
    status= models.IntegerField(default=0)

    def __str__(self):
        return self.size

    class Meta:
        db_table = 'tblSize'

class Category(models.Model):
    category = models.CharField(max_length=200, null=True, blank=True)
    status= models.IntegerField(default=0)

    def __str__(self):
        return self.category

    class Meta:
        db_table = 'tblCategory'



class Product(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.CharField(max_length=250, null=True, blank=True)
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    status= models.IntegerField(default=0)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'tblproducts'

class ProductVariations(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,null=True)
    color=models.ForeignKey(Color,on_delete=models.CASCADE,null=True)
    size=models.ForeignKey(Size,on_delete=models.CASCADE,null=True)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    status= models.IntegerField(default=0)

    def __str__(self):
        return self.countInStock
    
    class Meta:
        db_table = 'tblproduct_variations'

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)
    status= models.IntegerField(default=0)


    def __str__(self): 
        return str(self.rating)
    
    class Meta:
        db_table = 'tblreview'


class Order(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    shippingStatus=models.CharField(max_length=200,null=True,blank=True)
    deliveredAt = models.DateTimeField(
        auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)
    status= models.IntegerField(default=0)


    def __str__(self):
        return str(self.createdAt)
    
    class Meta:
        db_table = 'tblorder'


class OrderItem(models.Model):
    product_variation = models.ForeignKey(ProductVariations, on_delete=models.CASCADE, null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    color = models.CharField(max_length=200, null=True, blank=True)
    size = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)
    status= models.IntegerField(default=0)


    def __str__(self):
        return str(self.name)
    
    class Meta:
        db_table = 'tblorder_item'


class ShippingAddress(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)
    status= models.IntegerField(default=0)


    def __str__(self):
        return str(self.address)
    
    class Meta:
        db_table = 'tblshipping_address'













