from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("account_auth", "0001_initial"),
        ("wishlist", "0002_wishlistmembership"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="wishlists",
            field=models.ManyToManyField(
                blank=True,
                related_name="users",
                through="wishlist.WishlistMembership",
                to="wishlist.wishlist",
            ),
        ),
    ]
