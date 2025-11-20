\# Vendor Assessment Skill - Gebruikshandleiding

## Overzicht

Deze skill biedt een uitgebreide vendor assessment framework conform ISO 27001 en NEN 7510 richtlijnen. De skill is aangepast om professionele Word documenten en HTML emails te genereren op basis van Ratho BV templates.

## Nieuwe Functionaliteiten

### Version 1.1 (20-10-2025)
- ✨ **Detailed Findings sectie** toegevoegd aan assessment rapporten
- 📊 Gestructureerde weergave van "Sterke Punten" en "Aandachtspunten"
- 🎨 Visuele indicatoren (✓ voor strengths, ⚠ voor concerns)
- 📋 Enhanced compliance sectie met gedetailleerde notes per vereiste
- 🌍 Volledige tweetalige ondersteuning (Nederlands/Engels)

### 1. **Word Document Generatie**
- Professionele assessment rapporten in Word format
- Gebaseerd op Ratho BV template met voorblad
- Automatische formatting en opmaak
- Direct downloadbaar voor gebruik

### 2. **Follow-up Email Generatie**
- HTML-geformatteerde emails klaar voor Outlook/Office 365
- Copy-paste functionaliteit
- Bijbehorende Word bijlage met actiepunten
- Professionele opmaak volgens Ratho huisstijl

## Workflow

### Stap 1: Vendor Assessment Uitvoeren

Volg het standaard assessment proces:

1. **Verzamel basis informatie**
   - Vendor naam
   - Service beschrijving  
   - Data verwerkingsscope
   - Aantal gebruikers
   - Bedrijfsproces afhankelijkheid

2. **Bepaal categorie (1-5)**
   - Cat 1: Public data, minimale impact
   - Cat 2: Internal data, lage impact
   - Cat 3: Confidential, medium impact
   - Cat 4: Business Critical/PI, hoge impact
   - Cat 5: Mission Critical/Customer PI, kritieke impact

3. **Voer research uit**
   - Online research via `scripts/research_automation.py`
   - Security/privacy verificatie
   - Compliance validatie

4. **Bereken risk scores**
   - Security score (0-100)
   - Privacy score (0-100)
   - Operations score (0-100)
   - Gebruik `scripts/risk_calculator.py`

### Stap 2: Assessment Rapport Genereren

Genereer het Word assessment rapport:

```bash
cd /mnt/skills/user/vendor-assessment/scripts

node generate_report.js \
  --vendor "Wispr Flow" \
  --category 4 \
  --service "AI Voice Transcription" \
  --security-score 65 \
  --privacy-score 70 \
  --operations-score 75 \
  --decision "CONDITIONAL" \
  --iso27001 "✗" \
  --iso27001-notes "Geen certificaat aanwezig" \
  --soc2 "Te verifiëren" \
  --gdpr "✓" \
  --gdpr-notes "Privacy policy aanwezig" \
  --data-location "USA" \
  --location-notes "Data wordt verwerkt in VS, geen adequaatheidsbesluiting" \
  --mfa-sso "✓" \
  --mfa-notes "SSO via Azure AD mogelijk" \
  --rationale "De vendor biedt goede functionaliteit maar heeft enkele compliance gaps die eerst opgelost moeten worden." \
  --conditions "ISO 27001 certificaat vereist,DPA moet getekend worden,EU data residency configureren" \
  --output "/mnt/user-data/outputs/"
```

**Output:** `/mnt/user-data/outputs/vendor_assessment_Wispr_Flow_[datum].docx`

### Stap 3: Follow-up Email Genereren (indien nodig)

Als er action items zijn voor de vendor:

```bash
cd /mnt/skills/user/vendor-assessment/scripts

node generate_email.js \
  --vendor "Wispr Flow" \
  --category 4 \
  --action-items "ISO 27001 certificaat aanleveren of planning delen voor certificering,Data Processing Agreement (DPA) tekenen conform AVG eisen,EU data residency configureren of garanties geven m.b.t. data transfers,Incident response procedures documenteren en delen,Bevestiging van encryption at rest en in transit voor alle verwerkte data" \
  --contact "John Doe" \
  --sender-name "Thomas" \
  --sender-email "thomas@ratho.nl" \
  --client "IVT" \
  --output "/mnt/user-data/outputs/"
```

**Output:**
- `/mnt/user-data/outputs/email_Wispr_Flow.html` - Email HTML
- `/mnt/user-data/outputs/actiepunten_Wispr_Flow.docx` - Word bijlage

### Stap 4: Email Versturen

1. Open `email_[vendor].html` in een browser
2. Selecteer alles (Ctrl+A)
3. Kopieer (Ctrl+C)
4. Plak in nieuwe Outlook/Office 365 email
5. Voeg `actiepunten_[vendor].docx` toe als bijlage
6. Controleer en verstuur

## Parameters

### generate_report.js

| Parameter | Verplicht | Beschrijving | Voorbeeld |
|-----------|-----------|--------------|-----------|
| `--vendor` | ✓ | Vendor naam | "Wispr Flow" |
| `--category` | ✓ | Categorie 1-5 | 4 |
| `--language` | | Taal (nl/en) - standaard: nl | "en" |
| `--service` | | Service beschrijving | "AI Transcription" |
| `--security-score` | | Security score 0-100 | 65 |
| `--privacy-score` | | Privacy score 0-100 | 70 |
| `--operations-score` | | Operations score 0-100 | 75 |
| `--decision` | | GO/NO-GO/CONDITIONAL | "CONDITIONAL" |
| `--iso27001` | | ISO status | "✗" |
| `--iso27001-notes` | | ISO notes | "Geen certificaat" |
| `--soc2` | | SOC2 status | "Te verifiëren" |
| `--soc2-notes` | | SOC2 notes | "" |
| `--gdpr` | | GDPR status | "✓" |
| `--gdpr-notes` | | GDPR notes | "Policy aanwezig" |
| `--data-location` | | Data locatie | "USA" |
| `--location-notes` | | Locatie notes | "Geen EU" |
| `--mfa-sso` | | MFA/SSO status | "✓" |
| `--mfa-notes` | | MFA notes | "Azure AD SSO" |
| `--rationale` | | Beslissing rationale | "..." |
| `--conditions` | | Voorwaarden (comma-separated) | "item1,item2" |
| `--output` | | Output directory | "/mnt/user-data/outputs/" |

**Taalondersteuning:**
- `--language nl` (standaard): Nederlands rapport voor interne use
- `--language en`: Engels rapport voor internationale vendors of om te delen

### generate_email.js

| Parameter | Verplicht | Beschrijving | Voorbeeld |
|-----------|-----------|--------------|-----------|
| `--vendor` | ✓ | Vendor naam | "Wispr Flow" |
| `--action-items` | ✓ | Action items (comma-separated) | "item1,item2,item3" |
| `--language` | | Taal (nl/en) - standaard: nl | "en" |
| `--category` | | Categorie 1-5 | 4 |
| `--contact` | | Contact naam | "John Doe" |
| `--sender-name` | | Afzender naam | "Thomas" |
| `--sender-email` | | Afzender email | "thomas@ratho.nl" |
| `--client` | | Klant naam | "IVT" |
| `--date` | | Datum | "19-10-2025" |
| `--output` | | Output directory | "/mnt/user-data/outputs/" |

**Taalondersteuning:**
- `--language nl` (standaard): Nederlandse email en bijlage voor Nederlandse vendors
- `--language en`: Engelse email en bijlage voor internationale vendors

**Belangrijk:** Gebruik de juiste taal voor je doelgroep:
- **Nederlandse organisaties**: gebruik `--language nl` (of laat weg voor standaard)
- **Engels sprekende organisaties**: gebruik `--language en` voor documenten die naar hen toe gaan
- Het assessment rapport voor intern gebruik kan altijd in het Nederlands blijven

## Voorbeelden

### Voorbeeld 1: Complete Assessment met Follow-up

```bash
# Stap 1: Genereer assessment rapport
cd /mnt/skills/user/vendor-assessment/scripts
node generate_report.js \
  --vendor "CloudBackup Pro" \
  --category 5 \
  --service "Backup & Disaster Recovery" \
  --security-score 85 \
  --privacy-score 90 \
  --operations-score 88 \
  --decision "GO" \
  --iso27001 "✓" \
  --iso27001-notes "Geldig tot 2026" \
  --soc2 "✓" \
  --soc2-notes "Type II rapport beschikbaar" \
  --gdpr "✓" \
  --gdpr-notes "DPA getekend" \
  --data-location "NL" \
  --location-notes "Data center in Amsterdam" \
  --mfa-sso "✓" \
  --mfa-notes "Azure AD + MFA vereist" \
  --rationale "Vendor voldoet aan alle eisen voor categorie 5. Goedkeuring wordt geadviseerd." \
  --output "/mnt/user-data/outputs/"

# Stap 2: Geen follow-up nodig bij GO decision
```

### Voorbeeld 2: Conditional Approval met Action Items

```bash
# Genereer rapport
node generate_report.js \
  --vendor "DataSync Solutions" \
  --category 3 \
  --service "File Synchronization" \
  --security-score 60 \
  --privacy-score 55 \
  --operations-score 70 \
  --decision "CONDITIONAL" \
  --conditions "MFA implementeren,DPA tekenen,EU data residency bevestigen" \
  --output "/mnt/user-data/outputs/"

# Genereer follow-up email
node generate_email.js \
  --vendor "DataSync Solutions" \
  --category 3 \
  --action-items "Multi-Factor Authentication (MFA) implementeren voor alle gebruikers,Data Processing Agreement (DPA) tekenen,EU data residency bevestigen en documenteren" \
  --contact "Sarah Johnson" \
  --output "/mnt/user-data/outputs/"
```

### Voorbeeld 3: Internationale Vendor (Engels)

```bash
# Genereer Engels rapport (optioneel, voor delen met vendor)
node generate_report.js \
  --vendor "CloudBackup Inc" \
  --category 4 \
  --service "Cloud Backup Service" \
  --language "en" \
  --security-score 80 \
  --privacy-score 75 \
  --operations-score 85 \
  --decision "CONDITIONAL" \
  --conditions "Complete ISO 27001 certification,Sign GDPR-compliant DPA" \
  --output "/mnt/user-data/outputs/"

# Genereer Engelse follow-up email en bijlage
node generate_email.js \
  --vendor "CloudBackup Inc" \
  --category 4 \
  --language "en" \
  --action-items "Provide ISO 27001 certificate or certification timeline,Sign Data Processing Agreement in accordance with GDPR,Configure EU data residency option" \
  --contact "CloudBackup Security Team" \
  --output "/mnt/user-data/outputs/"
```

**Let op:** Voor internationale vendors gebruik je `--language en` om documenten te genereren die naar hen toe gaan. Het interne assessment rapport kan in het Nederlands blijven voor jullie eigen administratie.

## Troubleshooting

### Error: "docx module not found"

```bash
npm install -g docx
```

### Error: "Cannot write to output directory"

Zorg dat de output directory bestaat:
```bash
mkdir -p /mnt/user-data/outputs/
```

### Email formatting looks incorrect

- Gebruik een moderne browser (Chrome, Edge, Firefox)
- Zorg dat JavaScript enabled is
- Kopieer de hele body content, niet alleen een deel

### Word document can't be opened

- Check of alle verplichte parameters zijn opgegeven
- Zorg dat vendor naam geen speciale characters bevat
- Controleer de console output voor error messages

## Tips & Best Practices

1. **Altijd eerst de SKILL.md lezen** voor het volledige assessment proces
2. **Bewaar alle gegenereerde documenten** voor audit trail
3. **Gebruik consistente vendor namen** in alle commando's
4. **Test de email opmaak** voordat je verstuurt
5. **Verifieer de scores** met `scripts/risk_calculator.py`
6. **Documenteer action items specifiek** voor duidelijke communicatie
7. **Update de skill templates** indien nodig voor jouw organisatie

## Support

Voor vragen of problemen met de skill:
- Check de SKILL.md voor volledige documentatie
- Bekijk de reference bestanden in `/references/`
- Controleer de script comments voor parameter uitleg

## Changelog

### v2.1 (October 2025)
- ✓ Meertalige ondersteuning toegevoegd (Nederlands/Engels)
- ✓ `--language` parameter voor beide scripts (nl/en)
- ✓ Volledige vertaling van emails en action items documenten
- ✓ Volledige vertaling van assessment rapporten
- ✓ Automatische datum formatting per taal
- ✓ Template systeem voor gemakkelijke taaluitbreiding

### v2.0 (October 2025)
- ✓ Word document generatie toegevoegd
- ✓ HTML email generatie toegevoegd
- ✓ Action items bijlage functionaliteit
- ✓ Ratho BV template integratie
- ✓ Comprehensive README

### v1.0 (Original)
- Initial vendor assessment framework
- Risk scoring calculator
- Research automation
- Markdown reports