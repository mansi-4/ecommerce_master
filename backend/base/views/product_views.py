from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
import jwt

from base.models import Product,Review,Users
from base.helper.ImageWork import handleuploadfile
# from base.serializers import ProductSerializer

@api_view(["GET"])
def getProducts(request):
    
    query=request.query_params.get("keyword")
    if query == None:
        query=''
    
    products=Product.objects.filter(name__icontains=query).prefetch_related('review_set')
    
    serialized_products=[]
    for p in products:
        serialized_reviews=[]
        reviews=p.review_set.all()
        for r in reviews:
            rt={"review_id":r._id,"name":r.name,"rating":r.rating,"comment":r.comment,"createdAt":r.createdAt,"product":r.product_id,"user":r.user_id}
            serialized_reviews.append(rt)
        st={"product_id":p._id,"name":p.name,"brand":p.brand,"category":p.category,"description":p.description,"image":"static/multimedia/"+str(p.image),"rating":p.rating,"num_reviews":p.numReviews,"price":p.price,"countInStock":p.countInStock,"createdAt":p.createdAt,"reviews":serialized_reviews}
        serialized_products.append(st)        
    return Response(serialized_products)


@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=3).order_by('-rating')[0:5].prefetch_related('review_set')
    serialized_products=[]
    
    for p in products:
        print(p._id)
        serialized_reviews=[]
        reviews=p.review_set.all()
        for r in reviews:
            rt={"review_id":r._id,"name":r.name,"rating":r.rating,"comment":r.comment,"createdAt":r.createdAt,"product":r.product_id,"user":r.user_id}
            serialized_reviews.append(rt)
        st={"product_id":str(p._id),"name":p.name,"brand":p.brand,"category":p.category,"description":p.description,"rating":p.rating,"image":"static/multimedia/"+p.image,"num_reviews":p.numReviews,"price":p.price,"countInStock":p.countInStock,"createdAt":p.createdAt,"reviews":serialized_reviews}
        serialized_products.append(st)        
    return Response(serialized_products)

@api_view(["GET"])
def getProduct(request,pk):
    product=Product.objects.prefetch_related('review_set').get(_id=pk)
    
    serialized_reviews=[]
    reviews=product.review_set.all()
    for r in reviews:
        rt={"review_id":r._id,"name":r.name,"rating":r.rating,"comment":r.comment,"createdAt":r.createdAt,"product":r.product_id,"user":r.user_id}
        serialized_reviews.append(rt)
    st={"product_id":product._id,"name":product.name,"brand":product.brand,"category":product.category,"description":product.description,"rating":product.rating,"image":"static/multimedia/"+str(product.image),"num_reviews":product.numReviews,"price":product.price,"countInStock":product.countInStock,"createdAt":product.createdAt,"reviews":serialized_reviews}
    return Response(st)

@api_view(["POST"])
def createProduct(request):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        if(user.is_superuser):
            try:
                product=Product.objects.create(
                    user=user,
                    name='Sample Name',
                    price=0,
                    brand='sample brand',
                    countInStock=0,
                    category='sample category',
                    description=""
 
                )
                serialized_product={"product_id":product._id,"name":product.name,"brand":product.brand,"category":product.category,"description":product.description,"price":product.price,"countInStock":product.countInStock}
                return Response(serialized_product)
            except:
                return Response("Product Failed to Add")
        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")

@api_view(['PUT'])
def updateProduct(request, pk):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        print(token)
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        data = request.data
        if(user.is_superuser):
            try:
                product = Product.objects.get(_id=pk)
                product.name = data['name']
                product.price = data['price']
                product.brand = data['brand']
                product.countInStock = data['countInStock']
                product.category = data['category']
                product.description = data['description']

                product.save()
                
                return Response("Product Updated Successfully")
            except:    
                return Response("Product Updation Failed")
        else:
	        return Response("You are not an admin")
    


@api_view(["DELETE"])
def deleteProduct(request,pk):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        if(user.is_superuser):
            try:
                product=Product.objects.get(_id=pk)
                product.delete()
                return Response("Product deleted")
            except:
                return Response("Product Deletion Failed")
        else:
            return Response("You are not an Admin")
    else:
        return Response("Authorization Token not provided")

@api_view(['POST'])
def uploadImage(request):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        if(user.is_superuser):
            try:
                data = request.data

                product_id = data['product_id']
                product = Product.objects.get(_id=product_id)
                image=request.FILES.get('image')
                handleuploadfile(image)
                product.image = image.name
                product.save()

                return Response('Image was uploaded')
            except:
                return Response('Image upload Failed')
        else:
            return Response("You are not an Admin")
    else:
        return Response("Authorization Token not provided")


@api_view(['POST'])
def createProductReview(request, pk):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Token")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.filter(id=payload['id']).first()
        
        product = Product.objects.get(_id=pk)
        data = request.data

        # 1 - Review already exists
        alreadyExists = product.review_set.filter(user=user).exists()
        if alreadyExists:
            content = {'detail': 'Product already reviewed'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # 2 - No Rating or 0
        elif data['rating'] == 0:
            content = {'detail': 'Please select a rating'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # 3 - Create review
        else:
            Review.objects.create(
                user=user,
                product=product,
                name=user.name,
                rating=data['rating'],
                comment=data['comment'],
            )

            reviews = product.review_set.all()
            product.numReviews = len(reviews)

            total = 0
            for i in reviews:
                total += i.rating

            product.rating = total / len(reviews)
            product.save()

            return Response('Review Added')
    else:
        return Response("Authorization Token not provided")
