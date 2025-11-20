# Category 3: Confidential Data Vendors

## Required Verifications

### Security Requirements
- **Encryption at Rest**: Verify AES-256 or equivalent
- **Encryption in Transit**: TLS 1.2 minimum  
- **Backup Procedures**: Daily backups with encryption
- **Access Control**: Role-based access control (RBAC)

### Assessment Questions

1. **Data Protection**
   - How is confidential data encrypted at rest?
   - What encryption protocols are used for data in transit?
   - How are encryption keys managed?

2. **Backup & Recovery**
   - What is the backup frequency?
   - Are backups encrypted?
   - What is the RTO/RPO?
   - How often are restore tests performed?

3. **Access Management**
   - Is access based on need-to-know principle?
   - How are access rights reviewed?
   - Is there an audit trail for data access?

### Documentation Required
- Security policy or whitepaper
- Backup and recovery procedures
- Incident response plan (basic)

### Mitigation Strategies
- Request quarterly security reports
- Implement additional client-side encryption
- Maintain local backups of critical data
- Set up access monitoring alerts

### Review Frequency
Every 3 years or upon:
- Major service changes
- Security incidents
- Compliance requirement changes