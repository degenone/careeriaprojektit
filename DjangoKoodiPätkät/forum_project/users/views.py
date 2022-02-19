from .forms import ProfileUpdateForm, UserUpdateForm
from users.forms import UserRegisterForm
from django.contrib import messages
from django.shortcuts import redirect, render
from django.contrib.auth.models import User

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Luotu tili {username}')
            return redirect('login')
    else:
        form = UserRegisterForm()
    context = {
        'title': 'Rekisteröinti',
        'form': form
    }
    return render(request, 'users/register.html', context)


def profile(request, username):
    profile = User.objects.get(username=username)
    context = {
        'profile': profile,
        'title': 'Profiili'
    }
    if request.user.id == profile.id:
        if request.method == 'POST':
            u_form = UserUpdateForm(request.POST, instance=profile)
            p_form = ProfileUpdateForm(request.POST, instance=profile.profile)
            if u_form.is_valid() and p_form.is_valid():
                u_form.save()
                p_form.save()
                return redirect('profile', profile.username)
        else:
            u_form = UserUpdateForm(instance=profile)
            p_form = ProfileUpdateForm(instance=profile.profile)
        context['u_form'] = u_form
        context['p_form'] = p_form
    return render(request, 'users/profile.html', context)
