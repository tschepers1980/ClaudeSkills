# Category 4: Business Critical & Personal Data Vendors

## Mandatory Requirements

### Compliance & Certifications
- **ISO 27001** or **SOC2 Type II** (strongly preferred)
- **GDPR/AVG Compliance** (mandatory for PI processing)
- **Data Processing Agreement** (mandatory)
- **Data location within EEA** or adequate safeguards (SCCs)

### Security Requirements

#### Access Control
- Multi-Factor Authentication (MFA) capability
- Single Sign-On (SSO) via Azure AD/SAML preferred
- Need-to-know access principle enforced
- Regular access reviews (quarterly minimum)

#### Data Protection
- Encryption at rest: AES-256 minimum
- Encryption in transit: TLS 1.2+
- Key management procedures documented
- Data segregation between clients

#### Vulnerability Management
- Critical patches within 30 days
- Regular vulnerability scanning
- Annual penetration testing
- Security incident response plan

### Assessment Questions

1. **Certifications & Audits**
   - Current ISO 27001/SOC2/ISAE certificate? (request copy)
   - Last audit date and findings?
   - Planned certification renewals?

2. **Data Processing**
   - Where is data physically stored? (country/region)
   - Sub-processors used? (request list)
   - Data retention and deletion procedures?
   - How is data portability ensured?

3. **Security Operations**
   - Security awareness training frequency?
   - Incident response time SLA?
   - Last security incident and resolution?
   - Business continuity plan available?

4. **Access Management**
   - MFA enforcement policy?
   - SSO integration capabilities?
   - How are ex-employee accounts handled?
   - Audit logging capabilities?

### Documentation Required
- Valid security certification
- Signed Data Processing Agreement
- Security whitepaper/documentation
- Sub-processor list
- Insurance coverage details
- Incident response procedure

### Additional Controls
- Include in data flow matrix
- Annual review mandatory
- Supplier declaration if system access
- Consider backup vendor option

### Red Flags
- No security certification
- Data outside EEA without safeguards
- No DPA willingness
- Recent data breaches
- No incident response plan