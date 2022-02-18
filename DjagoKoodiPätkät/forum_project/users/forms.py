from .models import Profile
from django import forms
from django.core.validators import MaxLengthValidator
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.validators import UnicodeUsernameValidator

password_helptext = '<ul class="mb-0"><li>Salasanasi ei voi olla liian samanlainen kuin muut henkilökohtaiset tietosi.</li><li>Salasanassasi on oltava vähintään 8 merkkiä.</li><li>Salasanasi ei voi olla yleisesti käytetty salasana.</li><li>Salasanasi ei voi olla täysin numeerinen.</li></ul>'

username_validator = UnicodeUsernameValidator()

class UserRegisterForm(UserCreationForm):
    error_messages = {
        'password_mismatch': _('Salasanat eivät täsmää.'),
    }
    label_class = 'form-label'
    username = forms.CharField(
        error_messages = {
            'unique': _('Käyttäjänimi on jo käytössä.'),
            'max_length': _('Käyttäjänimi voi olla enintään 150 merkkiä pitkä.')
        },
        help_text = _('Enintään 150 merkkiä. Voi sisältää kirjaimia, numeroita ja merkit: "@", ".", "+", "-" sekä "_".'),
        label = _('Käyttäjänimi:'),
        max_length = 150,
        validators = [username_validator],
        widget = forms.TextInput(
            attrs = {
                'class': 'form-control mb-1',
                'placeholder': 'Käyttäjänimi'
            }
        ),
    )
    password1 = forms.CharField(
        help_text = _(password_helptext),
        label = _('Salasana:'),
        widget = forms.PasswordInput(attrs={'class': 'form-control mb-1', 'placeholder': 'Salasana'})
    )
    password2 = forms.CharField(
        help_text = _('Vahvistusta varten syötä sama salasana kuin aiemmin.'),
        label = _('Salasanan vahvistus:'),
        widget = forms.PasswordInput(attrs={'class': 'form-control mb-1', 'placeholder': 'Salasana uudelleen'})
    )

    class Meta:
        model = User
        fields = ['username', 'password1', 'password1']


class UserUpdateForm(forms.ModelForm):
    label_class = 'form-label'
    username = forms.CharField(
        error_messages = {
            'unique': _('Käyttäjänimi on jo käytössä.'),
            'max_length': _('Käyttäjänimi voi olla enintään 150 merkkiä pitkä.')
        },
        label = _('Käyttäjänimi:'),
        max_length = 150,
        validators = [username_validator],
        widget = forms.TextInput(
            attrs = {
                'class': 'form-control mb-1',
                'placeholder': 'Käyttäjänimi'
            }
        ),
    )

    class Meta:
        model = User
        fields = ['username']


class ProfileUpdateForm(forms.ModelForm):
    bio = forms.CharField(
        label = _('Bio:'),
        validators = [MaxLengthValidator(1000)],
        widget = forms.Textarea( 
            attrs = {
                'class': 'form-control',
                'placeholder': 'Kerro itsestäsi jotain...',
                'rows': 5,
                'style': 'width: 100%;'
            },
        ),
    )
    class Meta:
        model = Profile
        fields = ['bio']


class LoginFormCustom(AuthenticationForm):
    def __init__(self, request, *args, **kwargs) -> None:
        self.error_messages['invalid_login'] = 'Anna oikea käyttäjänimi ja salasana. Huomaa, että molemmat kentät voivat olla merkkikokorippuvaisia.'
        super().__init__(request=request, *args, **kwargs)
