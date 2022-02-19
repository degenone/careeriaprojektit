from django import forms
from .models import SnippetComment, SnippetPost
from django.utils.translation import gettext_lazy as _

class CreatePostForm(forms.ModelForm):
    label_class = 'form-label'

    class Meta:
        model = SnippetPost
        fields = ['title', 'code', 'language', 'style', 'linenos']
        labels = {
            'title': _('Otsikko:'),
            'code': _('Koodi:'),
            'language': _('Ohjelmointikieli:'),
            'style': _('Tyyli:'),
            'linenos': _('Rivinumerointi')
        }
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'code': forms.Textarea(attrs={'class': 'form-control', 'rows': 5, 'style': 'width: 100%;'}),
            'language': forms.Select(attrs={'class': 'form-select'}),
            'style': forms.Select(attrs={'class': 'form-select'}),
            'linenos': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
    

class CreateCommentForm(CreatePostForm):
    class Meta(CreatePostForm.Meta):
        model = SnippetComment
        fields = ['code', 'language', 'style', 'linenos']
        labels = CreatePostForm.Meta.labels
        labels['code'] = _('Koodi/Kommentti:')
