from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from snippets.models import SnippetPost, SnippetComment

class SnippetPostSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    highlight = serializers.HyperlinkedIdentityField(view_name='snippetpost-highlight', format='html')
    comments = serializers.HyperlinkedIdentityField(many=True, view_name='snippetcomment-detail', format='html', read_only=True)

    class Meta:
        model = SnippetPost
        fields = ['url', 'id', 'highlight', 'owner', 'title', 'code', 'linenos', 'language', 'style', 'comments']


class SnippetCommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    highlight = serializers.HyperlinkedIdentityField(view_name='snippetcomment-highlight', format='html')

    class Meta:
        model = SnippetComment
        fields = ['url', 'id', 'highlight', 'owner', 'code', 'linenos', 'language', 'style', 'post', 'parent']

    def validate(self, attrs):
        if attrs['parent'] == None:
            return super().validate(attrs)
        parent = SnippetComment.objects.get(pk=attrs['parent'].id)
        if parent.deleted:
            raise serializers.ValidationError({'parent': 'Kommentta ei voi jättää poistettuun kommenttiin.'})
        if attrs['post'] != parent.post:
            raise serializers.ValidationError({'parent': 'Kommentit ovat oltava samassa postissa.'})
        return super().validate(attrs)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.CharField(
        max_length = 100,
        required = True,
        validators = [
            UniqueValidator(
                queryset = User.objects.all(),
                message = {'username': 'Käyttäjänimi on jo käytössä.'}
            )
        ]
    )
    password = serializers.CharField(
        write_only = True,
        required = True,
        validators = [validate_password],
        style = {'input_type': 'password'}
    )
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    posts = serializers.HyperlinkedIdentityField(many=True, view_name='snippetpost-detail', read_only=True)
    snippetcomments = serializers.HyperlinkedIdentityField(many=True, view_name='snippetcomment-detail', read_only=True)
    
    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'password', 'password2', 'posts', 'snippetcomments']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password']
        )
        return user
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Salasanat eivät täsmänneet.'})
        return attrs
