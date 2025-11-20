# Ticket Field Definitions

## Verplichte Velden (uit CSV export)

| Veld | Type | Beschrijving |
|------|------|--------------|
| Ticket Number | String | Unieke ticket ID |
| Title | String | Korte samenvatting |
| Organization | String | Klant organisatie |
| Queue | String | Servicedesk queue |
| Priority | Int | 1-4 (1=Critical, 4=Low) |
| Ticket Type | Enum | Service Request, Incident, Change Request |
| Issue Type | String | Hoofdcategorie probleem |
| Subissue Type | String | Subcategorie probleem |
| Ticket Category | String | Extra classificatie |
| Description | Text | Volledige probleem beschrijving |
| Resolution | Text | Oplossing/uitvoering (target voor analyse) |
| Created | DateTime | Aanmaak timestamp |
| Resolved Time | DateTime | Afsluit timestamp (null = open) |
| Total Hours Worked | Float | Bestede tijd in uren |

## Optionele Velden (gewenst voor analyse)

| Veld | Type | Doel |
|------|------|------|
| Reopen Count | Int | Aantal keer heropend |
| Customer Satisfaction | Int | 1-5 score |
| Engineer | String | Afhandelend engineer |

## Waarde Ranges

### Ticket Type
- Service Request: ~40% volume
- Incident: ~15% volume  
- Change Request: ~5% volume
- Monitoring Alert: ~40% volume (vaak als Service Request geclassificeerd)

### Issue Type (voorbeelden)
- Disk Space
- Backup Failure
- Network Connectivity
- Password Reset
- Software Installation

### Priority
- 1 (Critical): <1 uur SLA
- 2 (High): <4 uur SLA
- 3 (Medium): <24 uur SLA
- 4 (Low): <5 dagen SLA

## Analyse Doelen

**Primair**: Identificeer ticket-types met:
- Volume >20/maand
- Standaard resolutie patterns (>70% similarity)
- Afhandeltijd <2 uur
- Lage reopen rate (<10%)

**Secundair**: Detecteer escalatie patterns:
- SLA violations (>80% tijd verstreken)
- Hoge reopen rates (>20%)
- Keywords: "overgepakt", "complex", "uitbreiding", "engineer nodig"
