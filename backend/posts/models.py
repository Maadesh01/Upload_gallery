from django.db import models

class Post(models.Model):
    caption = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.caption

class PostImage(models.Model):
    post = models.ForeignKey(Post, related_name='images', on_delete=models.CASCADE)
    image = models.BinaryField()  # Store image as binary in MySQL

    def __str__(self):
        return f"Image for Post {self.post.id}"