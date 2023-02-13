from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
import jwt

from base.models import Product,Review,Users,Category,ProductVariations,Color,Size
from base.helper.ImageWork import handleuploadfile
# from base.serializers import ProductSerializer

@api_view(["GET"])
def getProducts(request):
    
    query=request.query_params.get("keyword")
    if query == None:
        query=''
    
    products=Product.objects.filter(name__icontains=query,status=0).prefetch_related('review_set').prefetch_related('productvariations_set').select_related('category').select_related('user')
    
    serialized_products=[]
    for p in products:
        product_images=p.image
        serialized_images=[]
        if product_images!=None:
            split_images_list=product_images.split(",")
            for s in split_images_list:
                serialized_images.append("static/multimedia/"+str(s))
        serialized_reviews=[]
        serialized_product_variations=[]
        reviews=p.review_set.all()
        product_variations=p.productvariations_set.all()
        for r in reviews:
            rt={"review_id":r._id,"name":r.name,"rating":r.rating,"comment":r.comment,"createdAt":r.createdAt,"product":r.product_id,"user":r.user_id}
            serialized_reviews.append(rt)
        for pr in product_variations:
            pv={"product_variation_id":pr.id,"color_id":pr.color.id,"color":pr.color.color,"size_id":pr.size.id,"size":pr.size.size,"price":pr.price,"countInStock":pr.countInStock}
            serialized_product_variations.append(pv)
        st={"product_id":p._id,"name":p.name,"brand":p.brand,"category":p.category.id,"category":p.category.category,"description":p.description,"rating":p.rating,"num_reviews":p.numReviews,"createdAt":p.createdAt,"user_id":p.user.id,"user_name":p.user.name,"images":serialized_images,"variations":serialized_product_variations,"reviews":serialized_reviews}
        serialized_products.append(st)
    return Response(serialized_products)


@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=3,status=0).order_by('-rating')[0:5].prefetch_related('review_set').prefetch_related('productvariations_set').select_related('category').select_related('user')
    serialized_products=[]
    for p in products:
        product_images=p.image
        serialized_images=[]
        if product_images!=None:
            split_images_list=product_images.split(",")
            for s in split_images_list:
                serialized_images.append("static/multimedia/"+str(s))
        serialized_reviews=[]
        serialized_product_variations=[]
        reviews=p.review_set.all()
        product_variations=p.productvariations_set.all()
        for r in reviews:
            rt={"review_id":r._id,"name":r.name,"rating":r.rating,"comment":r.comment,"createdAt":r.createdAt,"product":r.product_id,"user":r.user_id}
            serialized_reviews.append(rt)
        for pp in product_variations:
            pv={"product_variation_id":pp.id,"color_id":pp.color.id,"color":pp.color.color,"size_id":pp.size.id,"size":pp.size.size,"price":pp.price,"countInStock":pp.countInStock}
            serialized_product_variations.append(pv)
        st={"product_id":"","name":p.name,"brand":p.brand,"category":p.category.id,"category":p.category.category,"description":p.description,"rating":p.rating,"num_reviews":p.numReviews,"createdAt":p.createdAt,"user_id":p.user.id,"user_name":p.user.name,"images":serialized_images,"variations":serialized_product_variations,"reviews":serialized_reviews}
        serialized_products.append(st)
    return Response(serialized_products)

@api_view(["GET"])
def getProduct(request,pk):
    try:
        product=Product.objects.prefetch_related('review_set').prefetch_related('productvariations_set').select_related('category').select_related('user').filter(status=0).get(_id=pk)
        product_images=product.image
        serialized_images=[]
        if product_images!=None:
            split_images_list=product_images.split(",")
            for s in split_images_list:
                serialized_images.append("static/multimedia/"+str(s))
        serialized_reviews=[]
        serialized_product_variations=[]
        reviews=product.review_set.all()
        product_variations=product.productvariations_set.all()
        for r in reviews:
            rt={"review_id":r._id,"name":r.name,"rating":r.rating,"comment":r.comment,"createdAt":r.createdAt,"product":r.product_id,"user":r.user_id}
            serialized_reviews.append(rt)
        for p in product_variations:
            pv={"product_variation_id":p.id,"color_id":p.color.id,"color":p.color.color,"size_id":p.size.id,"size":p.size.size,"price":p.price,"countInStock":p.countInStock}
            serialized_product_variations.append(pv)
        serialized_product={"product_id":product._id,"name":product.name,"brand":product.brand,"category":product.category.id,"category":product.category.category,"description":product.description,"rating":product.rating,"num_reviews":product.numReviews,"createdAt":product.createdAt,"user_id":product.user.id,"user_name":product.user.name,"images":serialized_images,"variations":serialized_product_variations,"reviews":serialized_reviews}
        return Response(serialized_product)
    except:
        return Response({})


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
        data=request.data
        if(user.is_superuser):
            # try:
                product=Product.objects.create(
                    user=user,
                    name=data["name"],
                    brand=data["brand"],
                    category=Category(id=data["category_id"]),
                    description=data["description"],
                
 
                ) 
                product_variations=data["product_variations"]
                for p in product_variations:
                    ProductVariations.objects.create(
                        product=Product(_id=product._id),
                        color=Color(id=p["color_id"]),
                        size=Size(id=p["size_id"]),
                        price=p["price"],
                        countInStock=p["countInStock"]
                    )
                product=Product.objects.prefetch_related('review_set').prefetch_related('productvariations_set').select_related('category').select_related('user').filter(status=0).get(_id=product._id)
                product_images=product.image
                serialized_images=[]
                if product_images!=None:
                    split_images_list=product_images.split(",")
                    for s in split_images_list:
                        serialized_images.append("static/multimedia/"+str(s))
                serialized_reviews=[]
                serialized_product_variations=[]
                reviews=product.review_set.all()
                product_variations=product.productvariations_set.all()
                for r in reviews:
                    rt={"review_id":r._id,"name":r.name,"rating":r.rating,"comment":r.comment,"createdAt":r.createdAt,"product":r.product_id,"user":r.user_id}
                    serialized_reviews.append(rt)
                for p in product_variations:
                    pv={"product_variation_id":p.id,"color_id":p.color.id,"color":p.color.color,"size_id":p.size.id,"size":p.size.size,"price":p.price,"countInStock":p.countInStock}
                    serialized_product_variations.append(pv)
                serialized_product={"product_id":product._id,"name":product.name,"brand":product.brand,"category":product.category.id,"category":product.category.category,"description":product.description,"rating":product.rating,"num_reviews":product.numReviews,"createdAt":product.createdAt,"user_id":product.user.id,"user_name":product.user.name,"images":serialized_images,"variations":serialized_product_variations,"reviews":serialized_reviews}
                return Response(serialized_product)
            # except:
            #     return Response("Product Failed to Add")
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
                product.user=Users(id=user.id)
                product.name = data['name']
                product.brand = data['brand']
                product.category = Category(id=data['category_id'])
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
                product.status=1
                product.save()
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
                image=request.FILES.getlist('image')
                image_list=[]
                for i in image:
                    image_list.append(i.name)
                    handleuploadfile(i)
                new_image_string=','.join(image_list)
                product.image = new_image_string
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

@api_view(['POST'])
def createProductVariation(request,pk):
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
                product = Product.objects.get(_id=pk)
                data = request.data
                ProductVariations.objects.create(
                    product=product,
                    color=Color(id=data["color_id"]),
                    size=Size(id=data["size_id"]),
                    price=data["price"],
                    countInStock=data["countInStock"]            
                )
                return Response("Product Variation Inserted")
            except:
                return Response("Product Variation Insertion Failed")
        else:
            return Response("You're not an admin")
    else:
        return Response("Authorization Token not provided")


@api_view(['PUT'])
def updateProductVariation(request,pk):
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
            # try:
                data=request.data
                productVariation=ProductVariations.objects.get(id=pk)
                productVariation.color=Color(id=data["color_id"])
                productVariation.size=Size(id=data["size_id"])
                productVariation.price=data["price"]
                productVariation.countInStock=data["countInStock"]
                productVariation.save()
                return Response("Product Variations Updated")

            # except:
            #     return Response("Product Variations Updation Failed")
        else:
            return Response("You're not an admin")

    else:
        return Response("Authorization Token not provided")


@api_view(['DELETE'])
def deleteProductVariation(request,pk):
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
                data=request.data
                productVariation=ProductVariations(id=pk)
                productVariation.delete()
                return Response("Product Variations Deleted")

            except:
                return Response("Product Variations Updation Failed")
        else:
            return Response("You're not an admin")
    else:
        return Response("Authorization Token not provided")