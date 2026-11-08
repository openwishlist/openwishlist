from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True
    dependencies = [("auth", "0012_alter_user_first_name_max_length")]
    operations = [
        migrations.CreateModel(
            name="Wishlist",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("uuid", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("name", models.CharField(max_length=120)),
                ("description", models.TextField(blank=True)),
                ("oidc_managed", models.BooleanField(default=False)),
                ("oidc_group", models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ("name",)},
        ),
        migrations.CreateModel(
            name="WishlistItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("uuid", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("title", models.CharField(max_length=200)),
                ("url", models.URLField(blank=True)),
                ("notes", models.TextField(blank=True)),
                ("image_url", models.URLField(blank=True)),
                ("price", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("priority", models.PositiveSmallIntegerField(choices=[(1, "Low"), (2, "Medium"), (3, "High")], default=2)),
                ("status", models.CharField(choices=[("wanted", "Wanted"), ("acquired", "Acquired"), ("archived", "Archived")], default="wanted", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("wishlist", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="wishlist.wishlist")),
            ],
            options={"ordering": ("-priority", "-created_at")},
        ),
    ]
