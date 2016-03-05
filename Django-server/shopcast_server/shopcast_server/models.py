__author__ = 'Shweta'

from django.db import models

class User(models.Model):

	def __str__(self):
		return self.id
	user_id = models.BigIntegerField(default=0)
	name = models.CharField(max_length=50)
	address = models.CharField(max_length=50)
	payment = models.CharField(max_length=50)

class Cast(models.Model):

	def __str__(self):
		return self.cast_id
	cast_id = models.ForeignKey(User.user_id)
	get_for = models.BigIntegerField(default=0)
	place = models.CharField(max_length=50)
	cast_items = models.BigIntegerField(default=0)
	dropoff = models.BooleanField()
	charge = models.BigIntegerField(default=0)

class Ask(models.Model):

	def __str__(self):
		return self.cast_id
	ask_id = models.ForeignKey(User.user_id)
	get_by = models.BigIntegerField(default=0)
	ask_items = models.BigIntegerField(default=0)
	accepted = models.BooleanField()



