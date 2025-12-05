from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Order, OrderItem, ShippingAddress, Review



class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Order
        fields = '__all__'
    # by adding this we do not need to pull both serializer in the view.py file. 
    # we do all the computing is done here and make it easier to return the data we need
    # we can make any variable and do some calculation or adjustment of the data here in these
    # def methods. then when we call this on the front end they will have all this data 
    # in this attribute.
    # this is different than attaching relationships which is done in the product serializer below.
    def get_orderItems(self,obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemsSerializer(items, many=True)
        return serializer.data
    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(obj.shippingaddress,many=False).data
        except:
            address = False
        return address
    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user,many=False)
        return serializer.data

class OrderItemsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class ShippingAddressSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ShippingAddress
        fields = '__all__'   

class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id','_id', 'username', 'email', 'name', 'isAdmin']
    # this is a way to make custom fields in serializer
    # the other way would be in teh databse. but this is easier
    def get__id(self, obj):
        return obj.id
    def get_isAdmin(self, obj):
        return obj.is_staff
    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name

class UserSerializerWithToken(UserSerializer):

    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id','_id', 'username', 'email', 'name', 'isAdmin', 'token']
    # when we login we want to return the token along with the user data
    # this is why we extended the UserSerializer
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # the reviews field does not exists in the data base so we create it here so its always dynamic
    reviews = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_reviews(self, obj):
        # now we can pull all the review data straight from the product
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data