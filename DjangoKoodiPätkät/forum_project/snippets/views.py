from django.shortcuts import redirect
from django.utils import timezone
from .forms import CreateCommentForm, CreatePostForm
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import SnippetComment, SnippetPost
from django.contrib.auth.decorators import login_required

# Create your views here.
class SnippetPostListView(ListView):
    model = SnippetPost
    paginate_by = 5

    def get_queryset(self):
        return SnippetPost.objects.filter(deleted=False)


class SnippetPostDetailView(DetailView):
    model = SnippetPost

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = CreateCommentForm()
        return context


class SnippetPostCreateView(LoginRequiredMixin, CreateView):
    model = SnippetPost
    form_class = CreatePostForm
    
    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)
    

class SnippetPostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = SnippetPost
    form_class = CreatePostForm

    def form_valid(self, form):
        form.instance.edited = timezone.now()
        return super().form_valid(form)
    
    def test_func(self):
        snippet = self.get_object()
        return self.request.user == snippet.owner and not snippet.deleted


class SnippetPostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = SnippetPost
    success_url = '/'

    def test_func(self):
        snippet = self.get_object()
        return self.request.user == snippet.owner


# https://forum.djangoproject.com/t/automatically-get-user-id-to-assignate-to-form-when-submitting/5333
@login_required
def snippet_comment(request):
    if request.method != 'POST':
        return redirect('home')
    
    pk = request.POST.get('post-id', None)
    comment_id = request.POST.get('comment-id', None)
    method = request.POST.get('_method', False)
    if not method:
        form = CreateCommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.owner = request.user
            comment.post = SnippetPost.objects.get(pk=pk)
            if comment_id not in (None, '0'):
                parent = SnippetComment.objects.get(pk=comment_id)
                comment.parent = parent
            comment.save()
    elif method == 'put':
        if comment_id in (None, '0'):
            return redirect('snippet-detail', pk)
        comment = SnippetComment.objects.get(pk=comment_id)
        if comment.owner != request.user or comment.deleted:
            return redirect('snippet-detail', pk)
        form = CreateCommentForm(request.POST, instance=comment)
        if form.is_valid():
            updated_comment = form.save(commit=False)
            updated_comment.edited = timezone.now()
            updated_comment.save()
    elif method == 'delete':
        if comment_id in (None, '0'):
            return redirect('snippet-detail', pk)
        comment = SnippetComment.objects.get(pk=comment_id)
        if comment.owner != request.user:
            return redirect('snippet-detail', pk)
        comment.delete()
    return redirect('snippet-detail', pk)
