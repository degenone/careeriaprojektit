from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comment, Post, Snippet
from django.utils import timezone


# @receiver(post_save, sender=Snippet)
# def create_post(sender, instance, created, **kwargs):
#     if created:
#         Post.objects.create(snippet=instance)


# @receiver(post_save, sender=Snippet)
# def save_post(sender, instance, **kwargs):
#     instance.post.edited = timezone.now()
#     instance.post.save()

@receiver(post_save, sender=Comment)
def create_comment(sender, instance, created, **kwargs):
    if created:
        Snippet.objects.create(instance)


@receiver(post_save, sender=Comment)
def save_comment(sender, instance, **kwargs):
    # instance.post.edited = timezone.now()
    instance.snippet.save()

@receiver(post_save, sender=Post)
def create_post(sender, instance, created, **kwargs):
    print('in post')
    if created:
        print('post created')
        Post.objects.create(instance)


@receiver(post_save, sender=Post)
def save_post(sender, instance, **kwargs):
    # instance.post.edited = timezone.now()
    instance.snippet.save()