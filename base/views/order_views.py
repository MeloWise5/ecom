from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

#grabbing our tables we will need to access in this view. 
from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer

from rest_framework import status
from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):

    """
    Only authernicated Logged in Users can use this view.
    # pass in three data sets
    User
    Order Data (shipping, payment, order totals)
    Order Items (products)

    # Create the order
    # Create the shippingAddress
    # create the order Items
        # update the product QTY
    # SAVE THE NEW ORDER
    # pull new order from database serialized
    # return seralized data to frontend
    """
    user = request.user
    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response(
            {'detail': 'No Order Items'}, 
            status=status.HTTP_400_BAD_REQUEST,
        )
    else:
        # all code is in the model.py file
        # (1) Create Order - We pass the order ID as a realtionship to the other creations
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
        )
        # (2) Create Shipping Address - Passing order ID for order
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )
        # (3) Create Order Items - Passing order ID for order
        # loop over all the items in the cart. Add each one and set the order ID then update the qty
        for item in orderItems:
            #grabbing the product data from the product ID
            product = Product.objects.get(_id=item['product'])

            order_Item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item['qty'],
                price=item['price'],
                image=product.image.url,

            )
            # (4) Update Stock - Addjust product QTY Count.
            product.countInStock -= order_Item.qty
            product.save()
    
        # after we save this new order we need to pull the data from the database
        # Seriliazed and return it to the front end. 
        serializer = OrderSerializer(order,many=False)# returning only one order
        # we added special methods to this serializer so it already grabs the shipping and orderItems product data.
        # view the serializer.py file to see how we combined the tables and serialized all the data successfully. 
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user # since its authenticated. django returns the user obj in the request.
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user # since its authenticated. django returns the user obj in the request.
    try:
        order = Order.objects.get(_id=pk)
        # if the user is admin or the creator
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response(
                {'detail':'Not Authorized to view this order'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except:
        return Response({'detail':'Order does not exists'},
                        status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request,pk):
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('order was paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request,pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response('order was delivered')



