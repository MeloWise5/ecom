from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.contrib.auth.hashers import make_password
from rest_framework import status

from base.models import Product, Review
from base.serializers import ProductSerializer, ReviewSerializer

@api_view(['GET'])
def getProducts(request):
    """
    we are doing some cool stuff with this view. 
    We are filtering out the results based off the keyword we pass as a parameter over the API
    /api/products?keyword=dennis
    we are also Paginating the data in the response
    """
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
       
    # product = Product.objects.all()
    products = Product.objects.filter(name__icontains=query)
    # Paginate
    page = request.query_params.get('page') # from the url
    paginator = Paginator(products, 3) # creates django paginator obj
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    
    page = int(page) # sometimes it returns a string

    serializer = ProductSerializer(products, many=True)
    return Response({'products':serializer.data,'page':page,'pages':paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    # gte means greater than equal to
    # -rating means order by descending returns the 5 rating first then the 4 etc.
    # other wise the _gte would return the 4 ratings first
    # grabbing all products with rating of 4 or 5
    # 
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.brand = data['brand']
    product.category = data['category']
    product.description = data['description']
    #product.rating = data['rating']
    #product.numReviews = data['numReviews']
    product.price = data['price']
    product.countInStock = data['countInStock']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user = user,
        name='Sample',
        price=0,
        brand='Sample',
        countInStock=0,
        category='Sample Category',
        description=''
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('product removed')

@api_view(['PUT'])
def uploadImage(request):
    data = request.data
    image_file = request.FILES['image']
    #print("Pid:", data.get('product_id'),image_file)  # Debug in terminal
    product = Product.objects.get(_id=data.get('product_id'))
    #print("Pid:", data.get('product_id'),image_file,product.name)  # Debug in terminal
    product.image = image_file
    product.save()
    # # this image will be saved in the static folder on the server.
    # do not serialize the data the image gets messed up.
    serializer = ProductSerializer(product, many=False)
    # if we pass in the product.image its the acutal ImageField from django and this is not allowed
    # you must pass the data with product.image.url this comes over as a json-able string
    return Response(product.image.url)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        # view model.py to see review table
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )
        # the product model also needs to have the numReviews field updated
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        # setting the products Rating
        # all the reviews averaged
        total = 0 
        for i in reviews:
            total += i.rating
        product.rating = total / len(reviews)

        product.save()
        return Response('Review Added')

@api_view(['GET'])
def getReviews(request):
    product = Review.objects.all()
    serializer = ReviewSerializer(product, many=True)
    return Response(serializer.data)