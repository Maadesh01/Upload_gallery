from django.urls import path
from .views import PostListView, upload_post

urlpatterns = [
    path('posts/', PostListView.as_view(), name='post-list'),
    path('upload/', upload_post, name='upload-post'),
] 