"""PiApi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import change_leds, clear_leds, get_telemetry, set_countdown, set_orientation, set_messages

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', change_leds),
    path('api/clear/', clear_leds),
    path('api/telemetry/', get_telemetry),
    path('api/countdown/<int:pk>/', set_countdown),
    path('api/orientation/', set_orientation),
    path('api/messages/', set_messages),
]
