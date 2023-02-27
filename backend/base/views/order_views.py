from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress,Users,ProductVariations,Color,Size

from rest_framework.exceptions import AuthenticationFailed
import jwt
from rest_framework import status
from datetime import datetime

@api_view(["GET"])
def getOrders(request):
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
            orders=Order.objects.prefetch_related("orderitem_set").prefetch_related("shippingaddress_set").select_related("user")
            serialized_orders=[]
            if(len(orders)>0):
                for o in orders:
                    serialized_order_item=[]
                    order_items=o.orderitem_set.all()
                    for i in order_items:
                        product_variation=ProductVariations.objects.get(id=i.product_variation_id)
                        oi={"_id":i._id,"name":i.name,"color":i.color,"size":i.size,"qty": i.qty,"price": i.price,"image": "static/multimedia/"+str(i.image),"product_variation_id": i.product_variation_id,"product_id":product_variation.product_id,"order": i.order_id}
                        serialized_order_item.append(oi)
                    shipping_address=o.shippingaddress_set.get(order_id=o._id)
                    sa={"_id": shipping_address._id,"address": shipping_address.address,"city": shipping_address.city,"postalCode": shipping_address.postalCode,"country": shipping_address.country,"shippingPrice": shipping_address.shippingPrice,"order":shipping_address.order_id}
                    serialized_user={"_id": o.user.id,"email": o.user.email,"name": o.user.name,"isAdmin": o.user.is_superuser}
                    st={"_id":o._id,"paymentMethod": o.paymentMethod,"taxPrice": o.taxPrice,"shippingPrice": o.shippingPrice,"totalPrice": o.totalPrice,"isPaid": o.isPaid,"paidAt": o.paidAt,"isDelivered": o.isDelivered,"deliveredAt": o.deliveredAt,"shipping_status":o.shippingStatus,"createdAt": o.createdAt,"orderItems":serialized_order_item,"shippingAddress": sa,"user":serialized_user}
                    serialized_orders.append(st)
                    # print(serialized_orders)
                return Response(serialized_orders)
            else:
                return Response(serialized_orders)
        else:
            return Response("you're not an admin")
    else: 
        return Response("Authorization Token not provided")

@api_view(["GET"])
def getOrderById(request,pk):
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
        order=Order.objects.prefetch_related("orderitem_set").prefetch_related("shippingaddress_set").select_related("user").get(_id=pk)
        serialized_order_item=[]
        order_items=order.orderitem_set.all()
        for i in order_items:
            product_variation=ProductVariations.objects.get(id=i.product_variation_id)
            oi={"_id":i._id,"name":i.name,"color":i.color,"size":i.size,"qty": i.qty,"price": i.price,"image": "static/multimedia/"+str(i.image),"product_variation_id": i.product_variation_id,"product_id":product_variation.product_id,"order": i.order_id}
            serialized_order_item.append(oi)
        shipping_address=order.shippingaddress_set.first()
        sa={"_id": shipping_address._id,"address": shipping_address.address,"city": shipping_address.city,"postalCode": shipping_address.postalCode,"country": shipping_address.country,"shippingPrice": shipping_address.shippingPrice,"order":shipping_address.order_id}
        serialized_user={"_id": order.user.id,"email": order.user.email,"name": order.user.name,"isAdmin": order.user.is_superuser}
        st={"_id":order._id,"paymentMethod": order.paymentMethod,"taxPrice": order.taxPrice,"shippingPrice": order.shippingPrice,"totalPrice": order.totalPrice,"isPaid": order.isPaid,"paidAt": order.paidAt,"isDelivered": order.isDelivered,"deliveredAt": order.deliveredAt,"shipping_status":order.shippingStatus,"createdAt": order.createdAt,"orderItems":serialized_order_item,"shippingAddress": sa,"user":serialized_user}
        return Response(st)
    else: 
        return Response("Authorization Token not provided")

@api_view(["GET"])
def getMyOrders(request):
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
        orders=Order.objects.prefetch_related("orderitem_set").prefetch_related("shippingaddress_set").select_related("user").filter(user_id=user.id)
        serialized_orders=[]
        if(len(orders)>0):
            for o in orders:
                serialized_order_item=[]
                order_items=o.orderitem_set.all() 
                for i in order_items:
                    product_variation=ProductVariations.objects.get(id=i.product_variation_id)
                    oi={"_id":i._id,"name":i.name,"color":i.color,"size":i.size,"qty": i.qty,"price": i.price,"image": "static/multimedia/"+str(i.image),
                    "product_variation_id": i.product_variation_id,"product_id":product_variation.product_id,"order": i.order_id}
                    serialized_order_item.append(oi)
                shipping_address=o.shippingaddress_set.first()
                sa={"_id": shipping_address._id,"address": shipping_address.address,"city": shipping_address.city,
                "postalCode": shipping_address.postalCode,"country": shipping_address.country,
                "shippingPrice": shipping_address.shippingPrice,"order":shipping_address.order_id}
                serialized_user={"_id": o.user.id,"email": o.user.email,"name": o.user.name,"isAdmin": o.user.is_superuser}
                st={"_id":o._id,"paymentMethod": o.paymentMethod,"taxPrice": o.taxPrice,
                "shippingPrice": o.shippingPrice,"totalPrice": o.totalPrice,"isPaid": o.isPaid,"paidAt": o.paidAt,
                "isDelivered": o.isDelivered,"deliveredAt": o.deliveredAt,"shipping_status":o.shippingStatus,"createdAt": o.createdAt,
                "orderItems":serialized_order_item,"shippingAddress": sa,"user":serialized_user}
                serialized_orders.append(st)
            return Response(serialized_orders)
        else:
            return Response(serialized_orders)
    else:
        return Response("Authorization Token not provided")

@api_view(["POST"])
def addOrderItems(request):
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
        # try:
        data = request.data
        orderItems = data['orderItems']

        if orderItems and len(orderItems) == 0:
            return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
        else: 

            # (1) Create order

            order = Order.objects.create(
                user=user,
                paymentMethod=data['paymentMethod'],
                taxPrice=data['taxPrice'],
                shippingPrice=data['shippingPrice'],
                totalPrice=data['totalPrice'],
                shippingStatus="In-Progress"
            )

            # (2) Create shipping address

            shipping = ShippingAddress.objects.create(
                order=order,
                address=data['shippingAddress']['address'],
                city=data['shippingAddress']['city'],
                postalCode=data['shippingAddress']['postalCode'],
                country=data['shippingAddress']['country'],
            )

            # (3) Create order items and set order to orderItem relationship
            for i in orderItems:
                # product = Product.objects.get(_id=i['product'])
                product_variation=ProductVariations.objects.select_related("product").select_related("color").select_related("size").get(id=i["product_variation_id"])

                product_images=product_variation.product.image
                serialized_images=[]
                if product_images!=None:
                    split_images_list=product_images.split(",")
                    for s in split_images_list:
                        serialized_images.append(str(s))
                item = OrderItem.objects.create(
                    product_variation=product_variation,
                    order=order,
                    name=product_variation.product.name,
                    color=i["color"],
                    size=i["size"],
                    qty=i['qty'],
                    price=i['price'],
                    image=serialized_images[0],
                )

                # (4) Update stock

                product_variation.countInStock -= item.qty
                product_variation.save()

            # serializer = OrderSerializer(order, many=False)
            order=Order.objects.prefetch_related("orderitem_set").prefetch_related("shippingaddress_set").select_related("user").get(_id=order._id)
            serialized_order_item=[]
            order_items=order.orderitem_set.all()
            for i in order_items:
                product_variation=ProductVariations.objects.get(id=i.product_variation_id)
                oi={"_id":i._id,"name":i.name,"color":i.color,"size":i.size,"qty": i.qty,"price": i.price,"image": "static/multimedia/"+str(i.image),"product_variation_id": i.product_variation_id,"product_id":product_variation.product_id,"order": i.order_id}
                serialized_order_item.append(oi)
            shipping_address=order.shippingaddress_set.first()
            sa={"_id": shipping_address._id,"address": shipping_address.address,"city": shipping_address.city,"postalCode": shipping_address.postalCode,"country": shipping_address.country,"shippingPrice": shipping_address.shippingPrice,"order":shipping_address.order_id}
            serialized_user={"_id": order.user.id,"email": order.user.email,"name": order.user.name,"isAdmin": order.user.is_superuser}
            st={"_id":order._id,"paymentMethod": order.paymentMethod,"taxPrice": order.taxPrice,"shippingPrice": order.shippingPrice,"totalPrice": order.totalPrice,"isPaid": order.isPaid,"paidAt": order.paidAt,"isDelivered": order.isDelivered,"deliveredAt": order.deliveredAt,"shipping_status":order.shippingStatus,"createdAt": order.createdAt,"orderItems":serialized_order_item,"shippingAddress": sa,"user":serialized_user}
            return Response(st)
        # except:
        #     return Response("Unable to place order")
    else:
        return Response("Authorization Token not provided")

@api_view(['PUT'])
def updateOrderToDelivered(request,pk):
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
                print(data["shipping_status"])
                shipping_status=data["shipping_status"]
                order = Order.objects.get(_id=pk)
                if(shipping_status=="Delivered"):
                    order.isDelivered=True
                    order.deliveredAt=datetime.now()
                    order.shippingStatus=shipping_status
                else:
                    order.shippingStatus=shipping_status
                order.save()
                return Response("Order was Updated")
            except:
                return Response("Order delivery failed")
        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")




@api_view(['PUT'])
def updateOrderToPaid(request,pk):
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
                order = Order.objects.get(_id=pk)
                order.isPaid=True
                order.paidAt=datetime.now()
                order.save()
                return Response("Order was paid")
            except:
                return Response("Order payment failed")
        else:
            return Response("You are not an admin")
    else:
        return Response("Authorization Token not provided")

    