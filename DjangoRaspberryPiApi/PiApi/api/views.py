from .serializers import LedGridSerializer, MessageSerializer, OrientationSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from sense_hat import SenseHat
from django.utils import timezone
from time import sleep

sense = SenseHat()
sense.set_imu_config(True, False, False)
ID_NOTFOUND_MSG = 'Please create a file called "identifier.txt" at the root of the project ' \
                  'with an identifier for the device. The identifier should be max 10 characters long.'

@csrf_exempt
def change_leds(request):
    if request.method == 'GET':
        colors = []
        for pixel in sense.get_pixels():
            color = '#'
            for c in pixel:
                h = hex(c)[2:]
                if len(h) < 2:
                    h = '0' + h
                color += h
            colors.append(color.upper())
        data = {'colors': colors}
        serializer = LedGridSerializer(data=data)
        if serializer.is_valid():
            return JsonResponse(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'message': '[error] - failed to get colors'}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = LedGridSerializer(data=data)
        if not serializer.is_valid():
            return JsonResponse(
                {'message': '[error] - ' + ' | '.join(serializer.errors)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        colors = []
        for h in serializer.validated_data.get('colors'):
            colors.append(list(int(h[i: i+2], 16) for i in (1, 3, 5)))
        sense.set_pixels(colors)
        return JsonResponse({'message': 'OK'}, status=status.HTTP_200_OK)
    return JsonResponse(
        {'message': '[error] - method not allowed'},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@csrf_exempt
def clear_leds(request):
    if request.method == 'GET':
        sense.clear()
        return JsonResponse({'message': 'OK'}, status=status.HTTP_200_OK)
    return JsonResponse(
        {'message': '[error] - method not allowed'},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@csrf_exempt
def get_telemetry(request):
    if request.method == 'GET':
        data = {
            'humidity': sense.get_humidity(),
            'temperature': sense.get_temperature(),
            'pressure': sense.get_pressure(),
            'north': sense.get_compass()
        }
        return JsonResponse(data=data, status=status.HTTP_200_OK)
    return JsonResponse(
        {'message': '[error] - method not allowed'},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@csrf_exempt
def set_countdown(request, pk):
    if request.method == 'GET':
        for i in reversed(range(0, int(pk) + 1)):
            sense.show_letter(str(i))
            sleep(1)
        sense.clear()
        return JsonResponse({'message': 'OK'}, status=status.HTTP_200_OK)
    return JsonResponse(
        {'message': '[error] - method not allowed'},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@csrf_exempt
def set_messages(request):
    if request.method == 'GET':
        str_time = f'{timezone.now():%H.%m}'
        sense.show_message(str_time)
        return JsonResponse({'message': 'OK'}, status=status.HTTP_200_OK)
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            text_hex = serializer.validated_data.get('text_color')
            text_color = list(int(text_hex[i: i+2], 16) for i in (1, 3, 5))
            back_hex = serializer.validated_data.get('back_color')
            back_color = list(int(back_hex[i: i+2], 16) for i in (1, 3, 5))
            sense.show_message(
                serializer.validated_data.get('message'),
                serializer.validated_data.get('speed'),
                text_color,
                back_color
            )
            return JsonResponse({'message': 'OK'}, status=status.HTTP_200_OK)
        return JsonResponse(
                {'message': '[error] - ' + ' | '.join(serializer.errors)},
                status=status.HTTP_400_BAD_REQUEST
            )
    return JsonResponse(
        {'message': '[error] - method not allowed'},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@csrf_exempt
def set_orientation(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = OrientationSerializer(data=data)
        if serializer.is_valid():
            if serializer.value.isnum():
                sense.set_rotation(int(serializer.value))
            elif serializer.value == 'horizontal':
                sense.flip_h()
            else:
                sense.flip_v()
            return JsonResponse({'message': 'OK'}, status=status.HTTP_200_OK)
        return JsonResponse(
                {'message': '[error] - ' + ' | '.join(serializer.errors)},
                status=status.HTTP_400_BAD_REQUEST
            )
    return JsonResponse(
        {'message': '[error] - method not allowed'},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )
