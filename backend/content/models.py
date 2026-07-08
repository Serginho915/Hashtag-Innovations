from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublishStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


class ContentKind(models.TextChoices):
    ARTICLE = "article", "Article"
    EVENT = "event", "Event"
    EXPERT = "expert", "Expert"
    LEARN_MATERIAL = "learn_material", "Learn material"
    PROJECT = "project", "Project"


class Category(TimeStampedModel):
    name = models.CharField(max_length=120)
    name_en = models.CharField(max_length=120, blank=True)
    name_bg = models.CharField(max_length=120, blank=True)
    slug = models.SlugField(max_length=140, unique=True)
    kind = models.CharField(
        max_length=32,
        choices=ContentKind.choices,
        blank=True,
        help_text="Leave empty if the category can be reused across content types.",
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        return self.name_en or self.name


class Organization(TimeStampedModel):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)
    logo = models.ImageField(upload_to="organizations/logos/", blank=True)
    website_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Expert(TimeStampedModel):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)
    role = models.CharField(max_length=180, blank=True)
    company_name = models.CharField(max_length=180, blank=True)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        related_name="experts",
        blank=True,
        null=True,
    )
    photo = models.ImageField(upload_to="experts/photos/", blank=True)
    quote = models.TextField(blank=True)
    bio = models.TextField(blank=True)
    expertise = models.JSONField(default=list, blank=True)
    industries = models.JSONField(default=list, blank=True)
    languages = models.JSONField(default=list, blank=True)
    experience = models.JSONField(
        default=list,
        blank=True,
        help_text="List of experience entries, kept inside the expert model.",
    )
    translations = models.JSONField(default=dict, blank=True)
    analytics = models.JSONField(default=dict, blank=True)
    is_available_for_consultation = models.BooleanField(default=False)
    service_consultation = models.BooleanField(default=False)
    service_consultation_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )
    service_mentorship = models.BooleanField(default=False)
    service_mentorship_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )
    service_project_analysis = models.BooleanField(default=False)
    service_project_analysis_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class ExpertSession(TimeStampedModel):
    expert = models.ForeignKey(
        Expert,
        on_delete=models.CASCADE,
        related_name="sessions",
    )
    title = models.CharField(max_length=180)
    subtitle = models.CharField(max_length=220, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["expert__name", "title"]

    def __str__(self) -> str:
        return f"{self.expert}: {self.title}"


class Article(TimeStampedModel):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True)
    author = models.ForeignKey(
        Expert,
        on_delete=models.SET_NULL,
        related_name="articles",
        blank=True,
        null=True,
    )
    author_name = models.CharField(max_length=160, blank=True)
    image = models.ImageField(upload_to="articles/images/", blank=True)
    excerpt = models.TextField(blank=True)
    lead = models.TextField(blank=True)
    body = models.JSONField(
        default=list,
        blank=True,
        help_text="Structured article content sections.",
    )
    translations = models.JSONField(default=dict, blank=True)
    published_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(
        max_length=16,
        choices=PublishStatus.choices,
        default=PublishStatus.DRAFT,
    )
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self) -> str:
        return self.title


class Event(TimeStampedModel):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="events",
        blank=True,
        null=True,
    )
    tags = models.JSONField(default=list, blank=True)
    expert = models.ForeignKey(
        Expert,
        on_delete=models.SET_NULL,
        related_name="events",
        blank=True,
        null=True,
    )
    organizers = models.ManyToManyField(
        Organization,
        related_name="organized_events",
        blank=True,
    )
    partners = models.ManyToManyField(
        Organization,
        related_name="partner_events",
        blank=True,
    )
    short_description = models.TextField(blank=True)
    detail_description = models.TextField(blank=True)
    translations = models.JSONField(default=dict, blank=True)
    starts_at = models.DateTimeField()
    location = models.CharField(max_length=220, blank=True)
    price = models.CharField(max_length=80, blank=True)
    image = models.ImageField(upload_to="events/images/", blank=True)
    status = models.CharField(
        max_length=16,
        choices=PublishStatus.choices,
        default=PublishStatus.DRAFT,
    )

    class Meta:
        ordering = ["starts_at"]

    def __str__(self) -> str:
        return self.title


class LearnMaterial(TimeStampedModel):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="learn_materials",
        blank=True,
        null=True,
    )
    tags = models.JSONField(default=list, blank=True)
    author = models.ForeignKey(
        Expert,
        on_delete=models.SET_NULL,
        related_name="learn_materials",
        blank=True,
        null=True,
    )
    excerpt = models.TextField(blank=True)
    translations = models.JSONField(default=dict, blank=True)
    cover_image = models.ImageField(upload_to="learn_materials/covers/", blank=True)
    pdf_file = models.FileField(upload_to="learn_materials/pdfs/", blank=True)
    preview_pdf_file = models.FileField(
        upload_to="learn_materials/previews/",
        blank=True,
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    badge = models.CharField(max_length=80, blank=True)
    is_trending = models.BooleanField(default=False)
    status = models.CharField(
        max_length=16,
        choices=PublishStatus.choices,
        default=PublishStatus.DRAFT,
    )
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self) -> str:
        return self.title


class Project(TimeStampedModel):
    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="projects",
        blank=True,
        null=True,
    )
    tags = models.JSONField(default=list, blank=True)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        related_name="projects",
        blank=True,
        null=True,
    )
    excerpt = models.TextField(blank=True)
    lead = models.TextField(blank=True)
    body = models.JSONField(
        default=list,
        blank=True,
        help_text="Structured project content sections.",
    )
    translations = models.JSONField(default=dict, blank=True)
    code = models.CharField(max_length=80, blank=True)
    published_at = models.DateTimeField(blank=True, null=True)
    image = models.ImageField(upload_to="projects/images/", blank=True)
    status = models.CharField(
        max_length=16,
        choices=PublishStatus.choices,
        default=PublishStatus.DRAFT,
    )
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self) -> str:
        return self.title
