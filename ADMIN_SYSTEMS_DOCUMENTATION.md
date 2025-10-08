# Administrative Systems Documentation

## Overview
This document provides a comprehensive guide to all administrative, security, and monitoring systems in the STARS Archive platform.

---

## 1. Backup System

### Location
- **Admin Dashboard**: `/backup-management`
- **Backend**: Supabase Edge Function `backup-manager`
- **Database Table**: `backup_records`

### Features
- **Manual Backups**: Create full or incremental backups on-demand
- **Automatic Retention**: Backups are automatically deleted after 30 days
- **Verification**: Verify backup integrity using hash verification
- **Restore**: Restore database from any backup point (admin only)

### Backup Reports Include:
- Date and time of backup
- Backup type (full/incremental/config_only)
- Status (completed/in_progress/failed)
- File size in bytes
- Backup location (S3 path)
- Verification hash
- Retention period

### How to Access
1. Navigate to Admin Dashboard
2. Click "Backup Management" 
3. View recent backups, create new ones, or verify existing backups

---

## 2. Security Monitor

### Location
- **Admin Dashboard**: `/security-monitor`
- **Backend**: Supabase Edge Function `security-monitor`
- **Database Tables**: 
  - `security_alerts` - All security events and alerts
  - `failed_login_attempts` - Login security tracking
  - `session_tracking` - Active user sessions

### Features
- **Real-time Monitoring**: Live security event tracking
- **Alert Management**: View, filter, and resolve security alerts
- **Session Management**: Monitor and terminate suspicious sessions
- **Anomaly Detection**: Automated detection of suspicious patterns

### Security Events Tracked:
- Unauthorized network access attempts
- Failed login attempts and brute force attacks
- PDF access violations
- Suspicious user behavior
- Concurrent sessions from different locations
- Rate limit violations

### Severity Levels:
- **Critical**: Immediate action required (brute force, unauthorized access)
- **High**: Significant security concern (location anomalies, suspicious sessions)
- **Medium**: Moderate concern (excessive downloads, rate limits)
- **Low**: Informational (normal PDF access, elevated access usage)

### How to Access
1. Navigate to Admin Dashboard
2. Click "Security Monitor"
3. Choose between "Maximum Security Mode" or "Standard Monitoring"
4. Filter by severity, search, or run anomaly detection

---

## 3. Audit Logs System

### Location
- **Admin Dashboard**: `/audit-logs`
- **Backend**: Database function `log_audit_event()` and `comprehensive_audit_log()`
- **Database Table**: `audit_logs`

### Features
- **Comprehensive Tracking**: All user and system actions logged
- **Filtering**: By date range, user, action type, severity, category
- **Export**: CSV export functionality
- **Real-time Updates**: Automatic updates via Supabase subscriptions

### Tracked Actions:
- User authentication (login, logout)
- Thesis operations (create, update, delete, approve, reject)
- Access requests (submit, approve, deny)
- System operations (backups, security events)
- Content management (CRUD operations)
- Administrative actions (role changes, user management)

### Log Details Include:
- User ID and email
- Action performed
- Resource type and ID
- Timestamp with IP address
- User agent information
- Severity level (low/medium/high/critical)
- Category (security, academic_data, access_control, etc.)
- Additional metadata (old/new data, risk level)

### How to Access
1. Navigate to Admin Dashboard
2. Click "Audit Logs"
3. Use filters to find specific events
4. Export logs as CSV for external analysis

---

## 4. Content Management Center

### Location
- **Admin Dashboard**: `/content-management`
- **Individual Management Pages**:
  - About Content: `/admin/content/about`
  - Resources: `/admin/content/resources`
  - Team Members: `/admin/content/team`
  - Announcements: `/admin/announcements`

### Features
- **About Page Management**: Edit mission, vision, sections
- **Resources Management**: Create guides, documentation
- **Team Members**: Manage team profiles
- **Announcements**: System-wide notifications
- **User Management**: Role assignments, permissions
- **College Management**: Academic structure management

### CRUD Operations Available:
- ✅ Create new content
- ✅ Read/View all content
- ✅ Update existing content
- ✅ Delete content (with confirmation)
- ✅ Version control (content_versions table)
- ✅ Active/Inactive status toggle

### How to Access
1. Navigate to Admin Dashboard
2. Click "Content Management"
3. Select the specific content type to manage
4. Perform CRUD operations as needed

---

## 5. Analytics Dashboard

### Location
- **Admin Dashboard**: `/analytics-dashboard`
- **Backend**: Multiple hooks and database queries
- **Database**: Multiple tables and views

### Metrics Displayed:
- **Overview Statistics**:
  - Total theses uploaded
  - Total users (by role)
  - System activity metrics
  - Top performing theses

- **User Analytics**:
  - User distribution by role
  - Active users (daily/weekly/monthly)
  - User engagement metrics

- **Content Analytics**:
  - Most viewed theses
  - Download statistics
  - College-wise thesis distribution
  - Upload trends over time

- **Time-Series Data**:
  - Views over time (interactive charts)
  - Uploads over time
  - 30-day trend analysis

### Report Generation
- Comprehensive report generator available
- Custom date range selection
- Export to various formats
- Automated email delivery (planned)

### How to Access
1. Navigate to Admin Dashboard
2. Click "Analytics Dashboard"
3. Use tabs to switch between different analytics views
4. Generate custom reports as needed

---

## 6. Notifications System

### Location
- **Notification Center**: Available in header for all users
- **Backend**: Supabase Edge Function `notification-manager`
- **Database Table**: `notifications`
- **Cleanup Function**: `cleanup_expired_notifications()`

### Features
- **Role-Based Notifications**: Target specific user roles
- **Broadcast Notifications**: Send to all users (admin/archivist only)
- **Automatic Cleanup**: Expired and read notifications auto-deleted
- **Real-time Updates**: Instant notification delivery
- **Read Status Tracking**: Mark individual or all as read

### Notification Types:
- **Info**: General information (blue)
- **Success**: Successful operations (green)
- **Warning**: Important notices (yellow)
- **Error**: Critical alerts (red)

### Notification Categories:
- Thesis approval/rejection notifications
- Access request status updates
- System maintenance announcements
- Security alerts
- Content updates

### Automatic Cleanup:
- Expired notifications are automatically deleted if marked as read
- Cleanup function runs via scheduled task
- Maintains system performance and data hygiene

### How to Access
1. Click the bell icon in the header
2. View all notifications with unread count
3. Mark individual notifications as read
4. Mark all as read with one click
5. Delete unwanted notifications

---

## 7. Security Reports

### Location
- **Admin Dashboard**: `/security-monitor` (Export button)
- **Backend**: Supabase Edge Function `security-report-generator`
- **Database Function**: `generate_security_report()`

### Report Contents:
- **Report Period**: Start and end dates
- **Security Alerts Summary**:
  - Total alerts (resolved/unresolved)
  - Breakdown by severity
  - Alert types and frequencies
  
- **Session Activity**:
  - Total and active sessions
  - Unique users and IPs
  - Average session duration
  
- **Failed Login Attempts**:
  - Total failed attempts
  - Blocked IP addresses
  - Most targeted email accounts

### Export Formats:
- JSON (detailed data structure)
- CSV (spreadsheet-friendly)
- PDF (planned)

### How to Generate
1. Navigate to Security Monitor
2. Click "Export" button
3. Select date range (default: last 30 days)
4. Choose export format
5. Report downloads automatically

---

## Integration & Data Flow

### System Integration Map:
```
┌─────────────────────┐
│   Admin Actions     │
└──────────┬──────────┘
           │
           ├─→ Backup System ─→ backup_records table ─→ Audit Logs
           │
           ├─→ Security Monitor ─→ security_alerts table ─→ Notifications
           │
           ├─→ Content Management ─→ Various tables ─→ Audit Logs + Notifications
           │
           ├─→ User Management ─→ user_roles table ─→ Audit Logs + Notifications
           │
           └─→ All Actions ─→ Audit Logs ─→ Analytics Dashboard
```

### Automatic Triggers:
1. **Security Events** → Automatically log to `security_alerts`
2. **All Admin Actions** → Automatically log to `audit_logs`
3. **Backup Operations** → Log to `backup_records` + `audit_logs`
4. **Access Approvals** → Create notification + log to `audit_logs`
5. **Expired Notifications** → Automatically cleanup if read
6. **Session Anomalies** → Create security alert + notification

---

## Best Practices for Admins

### Daily Tasks:
- [ ] Check Security Monitor for high-severity alerts
- [ ] Review pending access requests
- [ ] Monitor active sessions for anomalies

### Weekly Tasks:
- [ ] Export and review audit logs
- [ ] Generate security reports
- [ ] Create database backup
- [ ] Review analytics for unusual patterns

### Monthly Tasks:
- [ ] Comprehensive security audit
- [ ] Backup verification tests
- [ ] User account cleanup
- [ ] System performance review
- [ ] Update announcements and content

---

## Database Tables Reference

### Primary Tables:
- `backup_records` - Backup operations history
- `security_alerts` - Security events and alerts
- `audit_logs` - Complete action audit trail
- `notifications` - User notifications
- `session_tracking` - Active user sessions
- `failed_login_attempts` - Login security logs
- `rate_limits` - API rate limiting data
- `watermark_records` - PDF watermark tracking
- `thesis_access_requests` - Access request management

### Supporting Tables:
- `system_statistics` - System-wide metrics
- `system_settings` - Configuration settings
- `content_versions` - Content change history
- `ip_reputation` - IP threat intelligence

---

## Troubleshooting

### Common Issues:

1. **Security alerts not appearing**
   - Check RLS policies on `security_alerts` table
   - Verify edge function logs
   - Ensure user has admin role

2. **Audit logs missing actions**
   - Check if `log_audit_event()` is being called
   - Review database function execution logs
   - Verify RLS policies

3. **Notifications not received**
   - Check `notifications` table directly
   - Verify role-based targeting
   - Check if notification is expired

4. **Backup creation fails**
   - Review edge function logs
   - Check database connection
   - Verify admin permissions

---

## Support & Contact

For technical issues or security concerns:
- **System Administrator**: Contact via Admin Dashboard
- **Emergency Security Issues**: Refer to incident response procedures
- **Documentation Updates**: Submit via Content Management Center

---

Last Updated: 2025-01-08
Version: 1.0.0
