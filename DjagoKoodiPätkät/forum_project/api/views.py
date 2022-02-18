from django.contrib.auth.models import User
from rest_framework import permissions, renderers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from snippets.models import SnippetPost, SnippetComment
from .permissions import IsOwnerOrReadOnly
from .serializers import SnippetCommentSerializer, SnippetPostSerializer, UserSerializer

# Create your views here.
class SnippetPostViewSet(viewsets.ModelViewSet):
    queryset = SnippetPost.objects.all()
    serializer_class = SnippetPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def highlight(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    def perform_update(self, serializer):
        snippet = self.get_object()
        if snippet.deleted:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().perform_update(serializer)


class SnippetCommentViewSet(SnippetPostViewSet):
    queryset = SnippetComment.objects.all()
    serializer_class = SnippetCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def highlight(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    def perform_update(self, serializer):
        snippet = self.get_object()
        if snippet.deleted:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().perform_update(serializer)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegisterUserView(viewsets.GenericViewSet, CreateAPIView):
    model = User
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    