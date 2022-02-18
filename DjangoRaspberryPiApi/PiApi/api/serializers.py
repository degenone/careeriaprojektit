from random import choices
from rest_framework import serializers


class LedGridSerializer(serializers.Serializer):
    colors = serializers.ListField(allow_empty=False, min_length=64, max_length=64)

    def validate(self, attrs):
        for color in attrs['colors']:
            if not color.startswith('#') or len(color) != 7 or not color[1:].isalnum():
                raise serializers.ValidationError({'colors': 'Colors must be in hex color format. E.g. "#000000"'})
        return super().validate(attrs)


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()
    speed = serializers.FloatField(min_value=0.01, max_value=1, default=0.1)
    text_color = serializers.CharField(min_length=7, max_length=7, default='#EEEEEE')
    back_color = serializers.CharField(min_length=7, max_length=7, default='#000000')

    def validate(self, attrs):
        if not attrs['text_color'].startswith('#') or len(attrs['text_color']) != 7 or not attrs['text_color'][1:].isalnum():
            raise serializers.ValidationError({'text_color': 'Text color must be in hex color format. E.g. "#000000"'})
        if not attrs['back_color'].startswith('#') or len(attrs['back_color']) != 7 or not attrs['back_color'][1:].isalnum():
            raise serializers.ValidationError({'back_color': 'Background color must be in hex color format. E.g. "#000000"'})
        return super().validate(attrs)


class OrientationSerializer(serializers.Serializer):
    value = serializers.ChoiceField(choices=('0', '90', '180', '270', 'vertical', 'horizontal'))
