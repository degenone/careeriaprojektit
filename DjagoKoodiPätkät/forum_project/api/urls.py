from django.urls import path, include
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SnippetCommentViewSet, SnippetPostViewSet, UserViewSet, RegisterUserView

router = DefaultRouter()
router.register(r'snippets-posts', SnippetPostViewSet)
router.register(r'snippets-comments', SnippetCommentViewSet)
router.register(r'users', UserViewSet)
router.register(r'register', RegisterUserView, basename='register')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
]
