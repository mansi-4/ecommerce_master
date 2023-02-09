from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from base.models import Color ,Users
import jwt


@api_view(["GET"])
def getColors(request):
    colors = Color.objects.filter(status=0)
    color=[]
    for c in colors: 
        st={"id":c.id,"color":c.color}
        color.append(st)
    return Response(color)


@api_view(['GET'])
def getColorById(request,pk):
    try:
        colors = Color.objects.filter(status=0).get(id=pk)
        st={"id":colors.id,"color":colors.color}
        return Response(st)

    except:
        return Response("Color not found")


@api_view(["POST"])
def createColor(request):
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
                color = Color.objects.create(
                    # color = request.data['color']
                    color = 'sample color'

                )
                # color.save()
                serialized_color={"id":color.id,"color":color.color}
                return Response(serialized_color)

                # return Response("Color Created Successfully")
            except:
                return Response("Color Failed to Add")
        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")



@api_view(["PUT"])
def updateColor(request,pk):
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
            # try:
                color = Color.objects.get(id=pk)
                color.color = data['color']

                color.save()
                
                return Response("Color Updated Successfully")
            # except:    
                # return Response("Color Updation Failed")
        else:
	        return Response("You are not an admin")

@api_view(["DELETE"])    
def deleteColor(request,pk):
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
                color=Color.objects.get(id=pk)
                color.status=1
                color.save()
                return Response("Color deleted")
            except:
                return Response("Color Deletion Failed")
        else:
            return Response("You are not an Admin")
    else:
        return Response("Authorization Token not provided")





