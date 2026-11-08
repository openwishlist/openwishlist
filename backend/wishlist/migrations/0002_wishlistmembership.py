from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("account_auth", "0001_initial"),
        ("wishlist", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="WishlistMembership",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("role", models.CharField(choices=[("owner", "Owner"), ("editor", "Editor"), ("viewer", "Viewer")], default="viewer", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="wishlist_memberships", to="account_auth.customuser")),
                ("wishlist", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="memberships", to="wishlist.wishlist")),
            ],
        ),
        migrations.AddConstraint(
            model_name="wishlistmembership",
            constraint=models.UniqueConstraint(fields=("wishlist", "user"), name="unique_wishlist_membership"),
        ),
    ]
