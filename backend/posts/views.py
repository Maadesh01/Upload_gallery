from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Post
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import generics
from .serializers import PostSerializer
from .models import Post, PostImage

from .models import Post, PostImage

@login_required
def upload_post(request):
    if request.method == 'POST':
        caption = request.POST.get('caption')
        images = request.FILES.getlist('images')
        if caption and images:
            post = Post.objects.create(caption=caption)
            for img in images:
                image_data = img.read()
                PostImage.objects.create(post=post, image=image_data)
            return render(request, 'upload.html', {'message': 'Post uploaded successfully!'})
        else:
            return render(request, 'upload.html', {'message': 'Error: Please provide caption and at least one image.'})
    return render(request, 'upload.html')

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer