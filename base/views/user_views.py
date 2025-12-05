from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status

from django.contrib.auth.models import User
from base.serializers import UserSerializer, UserSerializerWithToken

# Create your views here.

# @api_view(['GET'])
# def getProducts(request):
#     return Response(products)

# this my token is to add custom claims to the token
# we are creating it so to show how to add custom claims to the token
# custom claims are additional information that we can add to the token
# like user name, email, etc.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        return token
    def validate(self, attrs):
        data = super().validate(attrs)
        # we are just chaning the data we output for this JWT token. 
        # this loops over all the user attributes and outputs them as an dictionary
        # this makes it easier to grab infromation without having to decode the JWT everytime after login
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v 
        return data
# this my token below is the class you call in teh urls.py to get the token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        # we are creating a new user here
        # this is the django User model
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])# this hashes the passwrod to be secure
        )
        serializer = UserSerializerWithToken(user, many=False)# this is why we create the UserSerializerWithToken so we can get the token right after registering
        return Response(serializer.data)
    except:
        # this is demostrating how to send custom error messages
        # whenever we get a bad request this will be triggered
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    #upate the user 
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    
    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)

# a bit complicated view to get user profile
# we are using the request.user to get the user
# but this api_view is protected so only authenticated users can access it
# that means even if we are logged in to the server. you wont see anything
# unless you provide the token in the header
@api_view(['GET'])
# this is how we protect the view/page so only authenticated users can access it
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)# Many flase and true is for multiple objects
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    user = User.objects.get(id=pk)
    user.delete()
    return Response('User Removed')
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)# Many flase and true is for multiple objects
    return Response(serializer.data)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserById(request, pk):
    user = User.objects.get(id=pk)
    data = request.data
    #upate the user 
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']
    user.save()
    
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


