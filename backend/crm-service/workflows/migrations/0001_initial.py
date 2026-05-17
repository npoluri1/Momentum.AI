import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Workflow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, default='')),
                ('trigger_type', models.CharField(choices=[('lead_created', 'Lead Created'), ('lead_status_changed', 'Lead Status Changed'), ('deal_created', 'Deal Created'), ('deal_stage_changed', 'Deal Stage Changed'), ('task_created', 'Task Created'), ('task_status_changed', 'Task Status Changed'), ('task_completed', 'Task Completed'), ('scheduled', 'Scheduled'), ('webhook', 'Webhook Received')], max_length=50)),
                ('trigger_config', models.JSONField(blank=True, default=dict)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_workflows', to=settings.AUTH_USER_MODEL)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflows', to='accounts.organization')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='WorkflowExecution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('running', 'Running'), ('completed', 'Completed'), ('failed', 'Failed'), ('cancelled', 'Cancelled')], default='pending', max_length=50)),
                ('trigger_object_type', models.CharField(blank=True, default='', max_length=100)),
                ('trigger_object_id', models.CharField(blank=True, default='', max_length=255)),
                ('context', models.JSONField(blank=True, default=dict)),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('workflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='executions', to='workflows.workflow')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='WorkflowStep',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(default=0)),
                ('action_type', models.CharField(choices=[('send_email', 'Send Email'), ('send_notification', 'Send Notification'), ('update_field', 'Update Field'), ('assign_user', 'Assign User'), ('change_status', 'Change Status'), ('create_task', 'Create Task'), ('webhook', 'Call Webhook'), ('delay', 'Delay')], max_length=50)),
                ('action_config', models.JSONField(default=dict)),
                ('condition', models.JSONField(blank=True, null=True)),
                ('is_optional', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('workflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='workflows.workflow')),
            ],
            options={
                'ordering': ['workflow', 'order'],
            },
        ),
        migrations.CreateModel(
            name='WorkflowLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.CharField(choices=[('info', 'Info'), ('warning', 'Warning'), ('error', 'Error'), ('debug', 'Debug')], default='info', max_length=50)),
                ('message', models.TextField()),
                ('details', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('execution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='workflows.workflowexecution')),
                ('step', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='logs', to='workflows.workflowstep')),
            ],
            options={
                'ordering': ['execution', 'created_at'],
            },
        ),
    ]
