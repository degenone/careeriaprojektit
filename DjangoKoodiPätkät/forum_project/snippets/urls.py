from django.urls import path
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView
from .views import (
    SnippetPostDeleteView,
    SnippetPostListView,
    SnippetPostCreateView,
    SnippetPostDetailView,
    SnippetPostUpdateView,
    snippet_comment,
)

urlpatterns = [
    path('', SnippetPostListView.as_view(), name='home'),
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('favicon.ico'))),
    path('snippet/new/', SnippetPostCreateView.as_view(), name='snippet-create'),
    path('snippet/comment/', snippet_comment, name='comment-cud'),
    path('snippet/<int:pk>/', SnippetPostDetailView.as_view(), name='snippet-detail'),
    path('snippet/<int:pk>/update/', SnippetPostUpdateView.as_view(), name='snippet-update'),
    path('snippet/<int:pk>/delete/', SnippetPostDeleteView.as_view(), name='snippet-delete'),
]
