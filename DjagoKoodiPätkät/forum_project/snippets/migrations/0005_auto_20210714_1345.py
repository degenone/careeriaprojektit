# Generated by Django 3.2.4 on 2021-07-14 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('snippets', '0004_auto_20210710_1908'),
    ]

    operations = [
        migrations.AddField(
            model_name='snippetcomment',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='snippetpost',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]
