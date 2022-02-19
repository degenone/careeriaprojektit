from django.contrib import admin
from .models import SnippetComment, SnippetPost

# Register your models here.
admin.site.register(SnippetPost)
admin.site.register(SnippetComment)
