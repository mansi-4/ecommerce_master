from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from base.models import Category ,Users
import jwt


@api_view(["GET"])
def getCategories(request):
    categories = Category.objects.filter(status=0)
    category=[]
    for c in categories: 
        st={"id":c.id,"category":c.category}
        category.append(st)
    return Response(category)


@api_view(['GET'])
def getCategoryById(request,pk):
    try:
        category = Category.objects.filter(status=0).get(id=pk)
        st={"id":category.id,"category":category.category}
        return Response(st)

    except:
        return Response("Category not found")


@api_view(["POST"])
def createCategory(request):
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
                category = Category.objects.create(
                    category = 'sample category'
                )

                serialized_category={"id":category.id,"category":category.category}
                return Response(serialized_category)

            except:
                return Response("category Failed to Add")
        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")



@api_view(["PUT"])
def updateCategory(request,pk):
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
                category = Category.objects.get(id=pk)
                category.category = data['category']

                category.save()
                
                return Response("category Updated Successfully")
            except:    
                return Response("category Updation Failed")
        else:
	        return Response("You are not an admin")

@api_view(["DELETE"])    
def deleteCategory(request,pk):
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
                category=Category.objects.get(id=pk)
                category.status=1
                category.save()
                return Response("category deleted")
            except:
                return Response("category Deletion Failed")
        else:
            return Response("You are not an Admin")
    else:
        return Response("Authorization Token not provided")





