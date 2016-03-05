from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # Examples:
    # url(r'^$', 'shopcast_server.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', 'shopcast_server.views.home', name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^register/', 'shopcast_server.views.register', name='register'),
    url(r'^cast/', 'shopcast_server.views.cast', name='cast'),

]
