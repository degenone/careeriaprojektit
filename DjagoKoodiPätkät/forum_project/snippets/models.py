from django.db import models
from django.urls import reverse
from django.contrib.auth import get_user_model
from pygments import highlight
from pygments.lexers import get_all_lexers, get_lexer_by_name
from pygments.styles import get_all_styles
from pygments.formatters.html import HtmlFormatter


# https://stackoverflow.com/a/17157906
LEXERS = [lexer for lexer in get_all_lexers() if lexer[1]]
LANGUAGE_CHOICES = sorted([(lexer[1][0], lexer[0]) for lexer in LEXERS])
STYLE_CHOICES = sorted([(style, style) for style in get_all_styles()])
DELETED_MSG = 'Käyttäjä poisti koodipätkän'
DEFAULT_LANG = 'text'
DEFAULT_STYLE = 'friendly'


def get_sentinel_user():
    return get_user_model().objects.get_or_create(username='deleted')[0]


class SnippetPost(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(null=True, blank=True)
    title = models.CharField(max_length=100)
    code = models.TextField()
    linenos = models.BooleanField(default=False)
    language = models.CharField(choices=LANGUAGE_CHOICES, default=DEFAULT_LANG, max_length=100)
    style = models.CharField(choices=STYLE_CHOICES, default=DEFAULT_STYLE, max_length=100)
    owner = models.ForeignKey('auth.User', related_name='posts', on_delete=models.SET(get_sentinel_user))
    highlighted = models.TextField()
    deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created']

    def save(self, *args, **kwargs) -> None:
        lexer = get_lexer_by_name(self.language)
        linenos = 'table' if self.linenos else False
        options = {'title': self.title} if self.title else {}
        formatter = HtmlFormatter(
            style = self.style,
            linenos = linenos,
            full = True,
            **options
        )
        self.highlighted = highlight(self.code, lexer, formatter)
        super(SnippetPost, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('snippet-detail', kwargs={'pk': self.pk})
    
    def get_as_element(self):
        lexer = get_lexer_by_name(self.language)
        linenos = 'table' if self.linenos else False
        formatter = HtmlFormatter(
            style = self.style,
            linenos = linenos,
            full = False,
        )
        return highlight(self.code, lexer, formatter)
    
    def delete(self, using = None, keep_parents = None):
        self.code = DELETED_MSG
        self.language = DEFAULT_LANG
        self.style = DEFAULT_STYLE
        self.linenos = False
        self.deleted = True
        self.save()
    
    @property
    def code_lang(self):
        return next(filter(lambda x: x[0] == self.language, LANGUAGE_CHOICES), (None, 'N/A'))[1]


class SnippetComment(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(null=True, blank=True)
    code = models.TextField()
    linenos = models.BooleanField(default=False)
    language = models.CharField(choices=LANGUAGE_CHOICES, default=DEFAULT_LANG, max_length=100)
    style = models.CharField(choices=STYLE_CHOICES, default=DEFAULT_STYLE, max_length=100)
    owner = models.ForeignKey('auth.User', related_name='snippetcomments', on_delete=models.SET(get_sentinel_user))
    highlighted = models.TextField()
    deleted = models.BooleanField(default=False)
    post = models.ForeignKey(SnippetPost, related_name='comments', on_delete=models.DO_NOTHING)
    parent = models.ForeignKey('self', related_name='replies', null=True, on_delete=models.DO_NOTHING)
    
    class Meta:
        ordering = ['-created']

    def save(self, *args, **kwargs) -> None:
        lexer = get_lexer_by_name(self.language)
        linenos = 'table' if self.linenos else False
        formatter = HtmlFormatter(
            style = self.style,
            linenos = linenos,
            full = True,
        )
        self.highlighted = highlight(self.code, lexer, formatter)
        super(SnippetComment, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('snippet-detail', kwargs={'pk': self.post.pk})

    def get_as_element(self):
        lexer = get_lexer_by_name(self.language)
        linenos = 'table' if self.linenos else False
        formatter = HtmlFormatter(
            style = self.style,
            linenos = linenos,
            full = False,
        )
        return highlight(self.code, lexer, formatter)
    
    def delete(self, using = None, keep_parents = None):
        self.code = DELETED_MSG
        self.language = DEFAULT_LANG
        self.style = DEFAULT_STYLE
        self.linenos = False
        self.deleted = True
        self.save()

    @property
    def code_lang(self):
        return next(filter(lambda x: x[0] == self.language, LANGUAGE_CHOICES), (None, 'N/A'))[1]
