from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from base.models import Users
from django.contrib.auth.hashers import make_password, check_password
import jwt, datetime
from django.core.mail import send_mail
from django.conf import settings
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
    
@api_view(["PUT"])
def updateUserPassword(request):
    if 'Authorization' in request.headers:
        token=request.headers['Authorization']
        print(token)
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Link has Expired!')
        except jwt.InvalidSignatureError:
            raise AuthenticationFailed("Invalid Link")
        except:
            raise AuthenticationFailed("Something went wrong")
        user = Users.objects.get(id=payload["id"])
        try:
            data = request.data
            
            if data["password"] != "":
                user.password=make_password(data["password"])
            
            user.save()
            return Response("Password updated Succesfully")
          
        except:
            return Response("Password updation failed")
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
    
    if user.status == 1:
        raise AuthenticationFailed('Account is not Activated')
    
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
    user = Users.objects.filter(email=data["email"]).first()

    if user is None:
        user=Users.objects.create(
            name=data["name"],
            email=data["email"],
            password=make_password(data["password"]),
            status=1
        )
        payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }

        token = jwt.encode(payload, 'secret', algorithm='HS256')  
        
        try:
            send_mail(
                subject='User Activation Link',
                message=f'''
                    Hi, {user.name}  \n
                    your OfflineToOnline account is almost ready.\n 
                    To activate your account please Click the following link.\n
                    http://localhost:3000/user_activation/{token} \n 
                    Please note that this activation link is valid only upto 1 hour. \n
                    After you activate your account, you will be able to login.\n 
                    Thanks & Regards, 
                    OfflineToOnline Team.

                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False
            )
            return Response("Email Verification Sent")
        except:
            return Response("Failed to send Email")
    else:
        return Response("Email ID Already Exists")

@api_view(["POST"])
def verifyUser(request):
    if request.method == "POST":
        data=request.data
        email=data["email"]
        user = Users.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')
        
        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')
        try:
            send_mail(
                subject='Password Reset Link',
                message=f'''
                    Hi, \n 
                    You recently requested to reset the password for your OfflineToOnline account.\n 
                    Click the link below to proceed.\n
                    http://localhost:3000/reset_password/{token} \n 
                    Please note that this password reset link is valid only upto 10 minutes. \n
                    If you did not request a password reset, please ignore this email or reply to let us know.\n 
                    Thanks & Regards, 
                    OfflineToOnline Team.
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False
            )
            return Response("Email verification sent")
        except:
            return Response("Failed to send Email")

@api_view(["PUT"])
def activateUser(request):
    data=request.data
    token=data["token"]
    if not token:
        raise AuthenticationFailed('Account Activation Failed!')
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Link has Expired!')
    except jwt.InvalidSignatureError:
        raise AuthenticationFailed("Invalid Link")
    except:
        raise AuthenticationFailed("Something went wrong")
    user = Users.objects.get(id=payload["id"])
    try:
        user.status=0
        user.save()
        return Response("Account Activated Successfully")
    except:
        return Response("Account Activation Failed")
    

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
    
