from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User

# signal to update the username to be the email before saving the user
# signals are the push nitification system in django
# they allow certain senders to notify a set of receivers that some action has taken place
def updateUser(sender, instance, **kwargs):
    print('signal triggered')
    user = instance
    if user.email != '':
        user.username = user.email

# this code below has attached a listener to the user model. 
# anytime its updated the receiver function updateUser will be called before saving the user
pre_save.connect(sender=User, receiver=updateUser)