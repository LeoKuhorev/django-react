from django.contrib import admin

from .models import Task


class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'completed', 'date_created')


admin.site.register(Task, TaskAdmin)
