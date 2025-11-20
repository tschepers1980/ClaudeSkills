# Security Assessment Questionnaire

## Overview
Comprehensive security questions mapped to vendor categories. Select relevant sections based on vendor classification.

## Category 1-2: Basic Verification
*No specific security questions required - basic legitimacy check only*

## Category 3: Confidential Data

### Data Security
1. How is our data encrypted at rest? (specify algorithm)
2. How is data encrypted in transit? (minimum TLS version)
3. How are encryption keys managed and rotated?
4. Are backups encrypted? With what method?

### Access Control
5. Is role-based access control (RBAC) implemented?
6. How often are access rights reviewed?
7. Is there an audit trail for all data access?

### Backup & Recovery
8. What is your backup frequency?
9. What are your RTO/RPO targets?
10. How often do you test backup restoration?

## Category 4: Business Critical + Personal Data

### Compliance & Certifications
11. Do you have ISO 27001 certification? (provide certificate)
12. Do you have SOC2 Type II report? (provide report)
13. Are you GDPR/AVG compliant? (provide evidence)
14. Where is data physically stored? (country/datacenter)
15. Do you use sub-processors? (provide list)

### Advanced Security
16. Is Multi-Factor Authentication available?
17. Do you support SSO via SAML/Azure AD?
18. How do you handle critical security patches? (timeframe)
19. Do you perform penetration testing? (frequency)
20. What is your incident response SLA?

### Personnel Security
21. Do employees receive security awareness training? (frequency)
22. How are employee accounts deprovisioned?
23. Do you perform background checks on staff?
24. Is there separation of duties for critical operations?

### Data Management
25. What is your data retention policy?
26. How can we export our data? (formats)
27. How is data deleted upon contract termination?
28. Can you provide data residency guarantees?

## Category 5: Mission Critical

### Organizational Security
29. Do you have a dedicated CISO? (reporting structure)
30. What percentage of budget is allocated to security?
31. Do you have 24/7 Security Operations Center?
32. Is there board-level security oversight?

### Advanced Technical Controls
33. Do you implement network segmentation?
34. Is Zero Trust architecture implemented?
35. Do you use EDR/XDR solutions? (which ones)
36. Is SIEM with active monitoring in place?
37. Do you perform code security reviews? (SAST/DAST)

### Business Continuity
38. Can you provide your BCP documentation?
39. What are your RTO/RPO commitments?
40. How often is disaster recovery tested?
41. Do you have geographically distributed backups?

### Supply Chain Security
42. How do you assess your critical suppliers?
43. Do you maintain a Software Bill of Materials?
44. How do you manage open source vulnerabilities?
45. What is your fourth-party risk approach?

### Advanced Compliance
46. Have you conducted a DPIA for our data?
47. What is your breach notification procedure?
48. What cyber insurance coverage do you maintain?
49. Can you provide financial stability reports?
50. What is your security roadmap for next 12 months?

## Scoring Guide

### Response Quality Indicators

**Strong Answers Include:**
- Specific technical details
- Compliance documentation
- Regular testing/validation
- Proactive measures
- Transparency

**Red Flag Answers:**
- Vague or evasive responses
- "We're working on it"
- No documentation available
- Outdated practices
- Reluctance to share details

## Follow-up Actions

Based on responses:
- **All questions answered satisfactorily**: Proceed with onboarding
- **Minor gaps identified**: Request remediation plan
- **Major gaps found**: Escalate to management
- **Critical issues discovered**: Reject vendor

## Documentation Requirements

Request these documents based on category:

### Category 3
- Security policy/whitepaper
- Backup procedures

### Category 4 (additional)
- ISO/SOC certificates
- DPA template
- Insurance documentation
- Sub-processor list

### Category 5 (additional)
- BCP documentation
- Network diagrams
- DPIA results
- Financial reports
- Exit strategy plan