# Security Reports System Documentation

## Overview
This document outlines how security reports are generated, stored, and accessed within the STARS Archive system.

## Security Report Storage

### Database Tables
All security reports and logs are stored in the following Supabase tables:

1. **`security_alerts`** - Critical security events and alerts
   - Unauthorized access attempts
   - Suspicious user behavior
   - Failed login attempts
   - Network access violations
   - PDF protection violations

2. **`audit_logs`** - Comprehensive audit trail
   - User actions (login, logout, file access)
   - Administrative actions (thesis approval, user management)
   - System events (backups, maintenance)
   - Data modifications

3. **`failed_login_attempts`** - Login security tracking
   - Failed login attempts by IP address
   - Brute force attack detection
   - Account lockout events

## Accessing Security Reports

### Admin Dashboard - Security Monitor
**Route:** `/security-monitor`  
**Access:** Admin role only

The Security Monitor provides two monitoring modes:

#### 1. Maximum Security Mode
- Real-time threat detection
- Active monitoring of user behavior
- Automated security enforcement
- Comprehensive violation tracking
- System health metrics

#### 2. Standard Monitoring
- Security alerts panel (filterable by severity)
- Active sessions tracking
- System health status
- Anomaly detection tools
- Export capabilities

### Features Available:

1. **Search & Filter**
   - Search by alert type, IP address, user ID
   - Filter by severity level (high, medium, low)

2. **Actions**
   - Resolve security alerts
   - Terminate suspicious sessions
   - Run anomaly detection
   - Export security reports
   - Refresh security data

3. **Statistics Dashboard**
   - Total alerts count
   - High-priority incidents
   - Active sessions
   - System health score

## Security Alert Types

### High Severity
- `unauthorized_network_access` - PDF access from unauthorized network
- `brute_force_attempt` - Multiple failed login attempts
- `location_anomaly` - Access from unusual locations
- `high_risk_action` - Critical system modifications

### Medium Severity
- `excessive_downloads` - Unusual download activity
- `concurrent_sessions` - Multiple active sessions
- `suspicious_session` - Session validation failures
- `rate_limit_exceeded` - API rate limit violations

### Low Severity
- `pdf_viewed` - Normal PDF access logging
- `elevated_file_access` - Admin/Archivist file access
- `network_bypass_used` - Testing mode access

## Automated Security Features

### 1. Audit Logging
All actions are automatically logged using the `log_audit_event()` database function:
```sql
log_audit_event(
  action: text,
  resource_type: text,
  resource_id: uuid,
  details: jsonb,
  ip_address: text,
  user_agent: text,
  severity: text,
  category: text
)
```

### 2. Session Monitoring
- Real-time session tracking
- IP address validation
- Location anomaly detection
- Concurrent session detection
- Automatic session termination for suspicious activity

### 3. PDF Access Protection
- Network-based access control
- Watermarking for all viewed documents
- Screenshot prevention
- Content protection
- Access attempt logging

### 4. Rate Limiting
- API request throttling
- Brute force protection
- Automated blocking for violations

## Report Generation

### Comprehensive Security Reports
Available via the Security Monitor dashboard:

1. **Security Overview Report**
   - All security alerts
   - Failed login attempts
   - Suspicious activities
   - Time-range filtering

2. **Audit Trail Report**
   - Complete user activity log
   - Administrative actions
   - System modifications
   - Exportable format

3. **Threat Assessment Report**
   - Active threats
   - Vulnerability analysis
   - Recommended actions

## Best Practices

### For Administrators:
1. **Daily Monitoring**
   - Check the Security Monitor dashboard daily
   - Review high-severity alerts immediately
   - Monitor active sessions regularly

2. **Weekly Reviews**
   - Export weekly security reports
   - Analyze trends in security events
   - Review and update security policies

3. **Incident Response**
   - Investigate all high-severity alerts within 24 hours
   - Document resolution actions
   - Update security measures based on incidents

### Security Alert Workflow:
1. Alert generated automatically by system
2. Admin notified via Security Monitor
3. Admin reviews alert details
4. Investigation conducted if necessary
5. Alert resolved with notes
6. Incident documented for future reference

## Access Control

### Role-Based Access:
- **Admin**: Full access to all security features and reports
- **Archivist**: View-only access to relevant logs
- **Researcher**: No access to security monitoring

### Protected Routes:
- `/security-monitor` - Admin only
- `/audit-logs` - Admin only
- `/backup-management` - Admin only

## Data Retention

- **Security Alerts**: Retained indefinitely
- **Audit Logs**: Retained for 2 years
- **Failed Login Attempts**: Retained for 90 days
- **Session Tracking**: Active sessions only (auto-cleanup on expiration)

## Integration with Other Systems

### Thesis Access Control
- All thesis access requests logged
- PDF viewing tracked with watermarks
- Unauthorized access attempts blocked and logged
- Network validation for file access

### User Management
- All role changes logged
- Permission modifications tracked
- Account actions recorded

### Backup System
- Backup operations logged
- Restore actions tracked
- Data integrity verification recorded

## Technical Implementation

### Edge Functions
- `security-monitor` - Real-time monitoring
- `anomaly-detector` - Behavioral analysis
- `session-manager` - Session validation
- `network-access-check` - Network authorization

### Database Functions
- `log_audit_event()` - Centralized logging
- `check_failed_login_attempts()` - Login security
- `validate_session_security()` - Session validation
- `detect_user_anomalies()` - Anomaly detection

## Troubleshooting

### Common Issues:

1. **Missing Security Alerts**
   - Check database function execution
   - Verify RLS policies
   - Review edge function logs

2. **Performance Issues**
   - Index optimization on audit_logs
   - Regular cleanup of old records
   - Query optimization for large datasets

3. **Access Denied to Reports**
   - Verify user role is 'admin'
   - Check RLS policies on security tables
   - Confirm authentication status

## Support

For security-related issues or questions:
- Contact: System Administrator
- Emergency: Refer to incident response procedures
- Documentation: This file and related wiki pages
