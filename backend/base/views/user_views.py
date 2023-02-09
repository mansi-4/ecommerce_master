from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from base.models import Users
from django.contrib.auth.hashers import make_password, check_password
import jwt, datetime
# Create your views here.
@api_view(['GET'])
def getUsers(request):
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
            users = Users.objects.all()
            new_users=[]
            for u in users: 
                st={"user_id":u.id,"name":u.name,"email":u.email,"password":u.password,"isAdmin":u.is_superuser}
                new_users.append(st)
            return Response(new_users)  
        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")

@api_view(['GET'])
def getUserById(request,pk):
    try:
        user = Users.objects.get(id=pk)
        st={"user_id":user.id,"name":user.name,"email":user.email,"password":user.password,"isAdmin":user.is_superuser}
        return Response(st)

    except:
        return Response("User not found")

@api_view(['GET'])
def userProfile(request):
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
        st={"user_id":user.id,"name":user.name,"email":user.email,"password":user.password,"isAdmin":user.is_superuser}
        return Response(st)
    else:
        return Response("Authorization Token not provided")

@api_view(["PUT"])
def updateUserProfile(request):
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
        user = Users.objects.get(id=payload["id"])
        try:
            data = request.data
            print(data)
            user.name=data["name"]
            user.email=data["email"]

            if data["password"] != "":
                user.password=make_password(data["password"])
            
            user.save()
            st={"_id":user.id,"name":user.name,"email":user.email,"token":token,"isAdmin":user.is_superuser}
            return Response(st)
        except:
            return Response("Profile updation failed")
    else:
        return Response("Authorization Token not provided")

@api_view(['POST'])
def loginUser(request):
    data=request.data
    email=data["email"]
    password=data["password"]
    
    user = Users.objects.filter(email=email).first()

    if user is None:
        raise AuthenticationFailed('User not found!')

    if not check_password(password, user.password):
        raise AuthenticationFailed('Incorrect password!')

    payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

    token = jwt.encode(payload, 'secret', algorithm='HS256')  
    response = Response()

    # response.set_cookie(key='jwt', value=token, httponly=True)
    response.data = {
        '_id':user.id,
        'email':user.email,
        'name':user.name,
        'isAdmin':user.is_superuser,
        'token': token
    }
    return response

@api_view(['POST'])
def registerUser(request):
    data=request.data
    user=Users.objects.create(
        name=data["name"],
        email=data["email"],
        password=make_password(data["password"])
    )
    payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

    token = jwt.encode(payload, 'secret', algorithm='HS256')  
    response = Response()

    # response.set_cookie(key='jwt', value=token, httponly=True)
    response.data = {
        '_id':user.id,
        'email':user.email,
        'name':user.name,
        'isAdmin':user.is_superuser,
        'token': token
    }
    return response



@api_view(['PUT'])
def updateUser(request,pk):
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
        user = Users.objects.get(id=payload["id"])
        if(user.is_superuser):
            try:
                user=Users.objects.get(id=pk)

                data = request.data
                
                user.name=data["name"]
                user.email=data["email"]
                # user.password=make_password(data["password"])
                user.is_superuser=data["isAdmin"]
         
                user.save()

                return Response("User updated successfully")
            except:
                return Response("User updation failed")
        else:
            return Response("You are not an Admin")

    else:
        return Response("Authorization Token not provided")

@api_view(['DELETE'])
def deleteUser(request,pk):
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
                user = Users.objects.get(id=pk)
                user.delete()
                return Response("User Deleted Successfully")
            except:
                return Response("User Deletion Failed")

        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")
    
