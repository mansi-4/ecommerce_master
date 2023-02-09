from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from base.models import Size ,Users
import jwt


@api_view(["GET"])
def getSizes(request):
    sizes = Size.objects.filter(status=0)
    size=[]
    for c in sizes: 
        st={"id":c.id,"size":c.size}
        size.append(st)
    return Response(size)


@api_view(['GET'])
def getSizeById(request,pk):
    try:
        size = Size.objects.filter(status=0).get(id=pk)
        st={"id":size.id,"size":size.size}
        return Response(st)

    except:
        return Response("Size not found")


@api_view(["POST"])
def createSize(request):
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
                size = Size.objects.create(
                    size = 'sample size'
                )

                serialized_size={"id":size.id,"size":size.size}
                return Response(serialized_size)

                return Response("Size Created Successfully")
            except:
                return Response("Size Failed to Add")
        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")



@api_view(["PUT"])
def updateSize(request,pk):
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
                size = Size.objects.get(id=pk)
                size.size = data['size']

                size.save()
                
                return Response("Size Updated Successfully")
            except:    
                return Response("Size Updation Failed")
        else:
	        return Response("You are not an admin")

@api_view(["DELETE"])    
def deleteSize(request,pk):
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
                size=Size.objects.get(id=pk)
                size.status=1
                size.save()
                return Response("Size deleted")
            except:
                return Response("Size Deletion Failed")
        else:
            return Response("You are not an Admin")
    else:
        return Response("Authorization Token not provided")





