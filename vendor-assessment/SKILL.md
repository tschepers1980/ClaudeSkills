---
name: vendor-assessment
description: ISO 27001/NEN 7510 compliant vendor assessment framework for evaluating suppliers. Use when assessing new vendors, performing security audits, categorizing data processors, or conducting periodic supplier reviews. Includes risk scoring, GDPR compliance checks, and structured reporting for categories 1-5 (Public to Mission Critical).
---

# Vendor Assessment Framework

Comprehensive vendor assessment system for ISO 27001/NEN 7510 compliance with automated research and risk scoring.

## Quick Start

When assessing a vendor:
1. Gather basic vendor information
2. Determine data category (1-5)
3. Execute appropriate assessment depth
4. Generate structured report

## Assessment Categories

### Category Determination

Classify vendors based on data sensitivity AND business impact:

| Cat | Data Type | Business Impact | Assessment Frequency |
|-----|-----------|-----------------|---------------------|
| 1 | Public | Minimal - Easy replacement | None |
| 2 | Internal | Low - No survival impact | None |
| 3 | Confidential | Medium - Service disruption | 3 years |
| 4 | Business Critical/PI | High - Service stops | Annual |
| 5 | Mission Critical/Customer PI | Critical - Survival threat | Annual + DPIA |

## Assessment Process

### 1. Initial Classification

```
INPUTS REQUIRED. IF NO INPUTS ARE GIVEN, RESEARCH PROBABLE ANSWERS AND USAGE. AFTERWARDS ASK FOR MORE CONFIRMATION/EXTRA INFORMATION FROM USER.
- Vendor name
- Service description
- Data processing scope
- User count estimate
- Business process dependency
```

### 2. Research Protocol

Execute depth based on category:

**Categories 1-2**: Basic legitimacy check
**Category 3**: Add security/privacy verification (see references/category3.md)
**Category 4**: Add compliance validation (see references/category4.md)  
**Category 5**: Full audit scope (see references/category5.md)

### 3. Risk Scoring

Calculate composite score (0-100):

```
Security Score = Certifications(30) + MFA/SSO(15) + Encryption(15) + 
                 Testing(15) + BCP(15) + Incidents(-20 each)

Privacy Score = GDPR(25) + EEA_Location(20) + DPA(15) + 
                Transparency(20) + Rights_Management(20)

Operational Score = Uptime_SLA(20) + Support(15) + Reviews(25) + 
                    Financial_Health(20) + Market_Position(20)
```

### 4. Decision Matrix

| Category | Required Score | Escalation |
|----------|---------------|------------|
| Cat 1-2 | >50 | Auto-approve |
| Cat 3 | >60 | SO review <60 |
| Cat 4 | >70 | FG review + DPA |
| Cat 5 | >80 | Board + DPIA |

### 5. Document Generation Workflow

After completing the assessment and calculating scores:

**Step 1: Generate Assessment Report**
```bash
cd scripts
node generate_report.js --vendor "[VENDOR_NAME]" --category [1-5] \
  --language [nl|en] \
  --security-score [0-100] --privacy-score [0-100] --operations-score [0-100] \
  --decision "[GO/NO-GO/CONDITIONAL]" \
  --strengths "Strength 1|Strength 2|Strength 3" \
  --concerns "Concern 1|Concern 2|Concern 3" \
  --iso27001 "[✓/✗/Partial]" --iso27001-notes "Notes" \
  --soc2 "[✓/✗/Partial]" --soc2-notes "Notes" \
  --gdpr "[✓/✗/Partial]" --gdpr-notes "Notes" \
  --data-location "[EEA/US/Other]" --location-notes "Notes" \
  --mfa-sso "[✓/✗/Partial]" --mfa-notes "Notes" \
  --output "../outputs/"
```

**Language Options:**
- `--language nl` (default): Dutch report for internal use
- `--language en`: English report for international vendors or sharing

**Step 2: Determine if Follow-up Needed**
If assessment reveals:
- Missing security certifications
- Incomplete GDPR documentation
- Required DPA not signed
- Information gaps requiring vendor response
- Conditional approval with action items

Then generate follow-up email:

**Step 3: Generate Follow-up Email & Attachment**
```bash
cd scripts
node generate_email.js --vendor "[VENDOR_NAME]" \
  --language [nl|en] \
  --action-items "item1,item2,item3" \
  --category [1-5] --contact "[CONTACT_NAME]" \
  --output "../outputs/"
```

**Language Options:**
- `--language nl` (default): Dutch email and attachment for Dutch vendors
- `--language en`: English email and attachment for international vendors

**Important:** Use the appropriate language for your audience:
- **Dutch organizations**: use `--language nl` or omit for default
- **English-speaking organizations**: use `--language en` for documents sent to them
- Internal assessment reports can always remain in Dutch

This creates:
- `email_[vendor].html` - Ready to paste in Outlook/O365 (in selected language)
- `actiepunten_[vendor].docx` - Professional attachment with Ratho branding (in selected language)

**Step 4: Review and Send**
1. Open generated email HTML in browser
2. Copy entire formatted content (Ctrl+A, Ctrl+C)
3. Paste into new Outlook/O365 email
4. Attach generated action items document
5. Review and send

## Online Research Sources

### Priority 1: Official Documentation
- Vendor /trust, /security, /compliance pages
- ISO 27001, SOC2, NEN 7510 registries
- GDPR/privacy documentation
- Published security whitepapers

### Priority 2: User Intelligence
- G2 Crowd security scores
- Reddit (r/sysadmin, r/msp)
- Capterra recent reviews
- LinkedIn vendor updates

### Priority 3: Security Databases
- CVE database for vulnerabilities
- Have I Been Pwned breach history
- Security news searches

## Output Format

After completing the assessment, generate TWO deliverables:

### 1. Assessment Report (Word Document)
- Use `scripts/generate_report.js` to create professional Word document
- Based on Ratho BV template structure with voorblad (cover page)
- Includes executive summary, risk scores, detailed findings (strengths & concerns), compliance status, and recommendations
- Detailed findings section automatically includes:
  - **Sterke Punten** (Strengths): Key positive findings with ✓ indicators
  - **Aandachtspunten** (Concerns): Areas requiring attention with ⚠ indicators
- Professional formatting with Ratho BV house style
- Output location: `/mnt/user-data/outputs/`

### 2. Follow-up Email (when action items identified)
When vendors have missing information or required improvements:
- Generate HTML-formatted email using `scripts/generate_email.js`
- Email includes formatted introduction and action items list
- Attach detailed action items document (Word format)
- Email is ready to copy-paste into Outlook/Office 365 webmail
- Output locations: 
  - Email HTML: `/mnt/user-data/outputs/email_[vendor].html`
  - Attachment: `/mnt/user-data/outputs/actiepu nten_[vendor].docx`

## Red Flags (Immediate Escalation)

- No encryption for Cat 4-5 data
- Breach with PI in last 2 years
- Non-GDPR compliant PI processing
- High-risk country hosting without safeguards
- Missing incident response procedure
- Refusal to provide security documentation
- Active security audit failures
- Financial instability indicators

## Scripts

- `scripts/risk_calculator.py` - Calculate risk scores from assessment data
- `scripts/research_automation.py` - Automate online vendor research
- `scripts/generate_report.js` - Generate professional Word assessment report
- `scripts/generate_email.js` - Generate follow-up email with HTML formatting
- `scripts/generate_action_items.js` - Create action items attachment document

## References

- `references/category3.md` - Category 3 detailed requirements
- `references/category4.md` - Category 4 detailed requirements  
- `references/category5.md` - Category 5 detailed requirements
- `references/gdpr_checklist.md` - GDPR compliance verification
- `references/security_questions.md` - Full security questionnaire

## Assets

- `assets/report_template.md` - Standard assessment report format (legacy)
- `assets/ticket_template.md` - Ticketing system format
- `assets/ratho_template.dotx` - Ratho BV Word template met voorblad
- `assets/email_template.html` - HTML email template for follow-ups
- `assets/action_items_template.md` - Action items document structure