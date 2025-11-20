# Vendor Assessment Report Template

## Executive Summary

**Vendor:** [VENDOR_NAME]  
**Service:** [SERVICE_TYPE]  
**Category:** [1-5] - [CATEGORY_DESCRIPTION]  
**Assessment Date:** [DATE]  
**Assessor:** [NAME]  
**Decision:** [GO/NO-GO/CONDITIONAL]

## 1. Business Context

### Problem Statement
[What problem does this vendor solve?]

### Proposed Solution
[How does the vendor's service address the need?]

### Business Impact
[What happens if this vendor is unavailable?]

## 2. Risk Assessment

### Data Classification
- **Data Types Processed:** [List types]
- **Data Sensitivity Level:** [Public/Internal/Confidential/Critical]
- **Personal Data Processing:** [Yes/No - Details]
- **Customer Data Exposure:** [Yes/No - Details]

### Security Evaluation

| Domain | Score | Status |
|--------|-------|---------|
| Security | [X]/100 | [✓/⚠/✗] |
| Privacy | [X]/100 | [✓/⚠/✗] |
| Operations | [X]/100 | [✓/⚠/✗] |
| **Overall** | **[X]/100** | **[PASS/FAIL]** |

### Key Findings

#### Strengths
- [Positive finding 1]
- [Positive finding 2]

#### Concerns
- [Risk/gap 1]
- [Risk/gap 2]

## 3. Compliance Status

| Requirement | Status | Evidence | Notes |
|------------|---------|----------|-------|
| ISO 27001 | [✓/✗/N/A] | [Certificate/None] | [Expiry/Notes] |
| SOC2 Type II | [✓/✗/N/A] | [Report date] | [Scope] |
| GDPR/AVG | [✓/✗] | [DPA/Policy] | [Details] |
| Data Location | [EEA/Other] | [Country] | [Safeguards] |
| MFA/SSO | [✓/✗] | [Method] | [Azure AD?] |

## 4. Risk Mitigation

### Identified Risks

| Risk | Likelihood | Impact | Mitigation Strategy | Owner |
|------|------------|--------|-------------------|--------|
| [Risk 1] | [H/M/L] | [H/M/L] | [Strategy] | [Person] |
| [Risk 2] | [H/M/L] | [H/M/L] | [Strategy] | [Person] |

### Required Actions

#### Before Trial/PoC
- [ ] Obtain signed DPA (Category 4-5)
- [ ] Configure EU data residency
- [ ] Set up test environment
- [ ] Send security questionnaire

#### Before Production
- [ ] Complete security assessment
- [ ] Document in vendor registry
- [ ] Configure MFA/SSO
- [ ] Establish backup procedures
- [ ] Define exit strategy

#### Ongoing
- [ ] Annual review (Category 4-5)
- [ ] Certificate renewal monitoring
- [ ] Incident notification procedures
- [ ] Performance monitoring

## 5. Financial Considerations

| Item | Cost | Frequency | Notes |
|------|------|-----------|-------|
| Licensing | [Amount] | [Monthly/Annual] | [Per user/flat] |
| Implementation | [Amount] | [One-time] | [Details] |
| Training | [Amount] | [As needed] | [Scope] |
| **Total Year 1** | **[Amount]** | - | [TCO] |

## 6. Recommendation

### Decision: [GO/NO-GO/CONDITIONAL]

### Rationale
[Explain the reasoning behind the decision]

### Conditions (if applicable)
1. [Condition 1]
2. [Condition 2]

### Alternative Options
- [Alternative vendor 1]: [Brief comparison]
- [Alternative vendor 2]: [Brief comparison]

## 7. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Requestor | [Name] | | |
| IT Manager | [Name] | | |
| Security Officer | [Name] | | |
| Privacy Officer | [Name] | | |
| CFO/Director | [Name] | | |

## Appendices

### A. Research Sources
- [Website/URL] - [Date accessed]
- [Review platform] - [Score/Rating]
- [Security database] - [Findings]

### B. Documents Received
- [ ] Security certification
- [ ] DPA/Privacy documentation
- [ ] Insurance documentation
- [ ] Technical specifications

### C. Communication Log
| Date | Contact | Topic | Outcome |
|------|---------|-------|---------|
| [Date] | [Name] | [Topic] | [Result] |

---
*This assessment is valid for 12 months from the assessment date or until significant changes in service or risk profile occur.*