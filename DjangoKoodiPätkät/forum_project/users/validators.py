from django.contrib.auth.password_validation import (
    MinimumLengthValidator, CommonPasswordValidator, NumericPasswordValidator
)
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _, ngettext


class MinimumLengthValidatorCustom(MinimumLengthValidator):
    def validate(self, password, user=None):
        if len(password) < self.min_length:
            raise ValidationError(
                ngettext(
                    "Salasanat on liian lyhyt. Sen pitää olla vähintään %(min_length)d merkki.",
                    "Salasanat on liian lyhyt. Sen pitää olla vähintään %(min_length)d merkkiä.",
                    self.min_length
                ),
                code='password_too_short',
                params={'min_length': self.min_length},
            )


class CommonPasswordValidatorCustom(CommonPasswordValidator):
    def validate(self, password, user=None):
        if password.lower().strip() in self.passwords:
            raise ValidationError(
                _("Salasana on liian yleinen."),
                code='password_too_common',
            )


class NumericPasswordValidatorCustom(NumericPasswordValidator):
    def validate(self, password, user=None):
        if password.isdigit():
            raise ValidationError(
                _("Tämä salasana on kokonaan numeerinen."),
                code='password_entirely_numeric',
            )
