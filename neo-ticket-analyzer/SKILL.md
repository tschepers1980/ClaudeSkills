---
name: neo-ticket-analyzer
description: "Analyseert ITSM ticket exports (CSV) voor NEO Agent automatiseringsproject. Gebruik bij 2-wekelijkse evaluatie van tickets: identificeert volume patterns, resolutie trends, automatiseringskansen, genereert prioriteitslijst en performance rapporten voor go/no-go beslissingen. Triggers zijn 'analyseer tickets', 'ticket export beoordelen', 'automatisering kandidaten' of wanneer CSV met ticket data wordt geüpload."
---

# NEO Ticket Analyzer

Analyseert ticket exports en identificeert automatiseringskansen voor NEO Agent.

## Workflow

### 1. Data Laden
- CSV inlezen met pandas
- Valideer verplichte velden uit `references/ticket_fields.md`
- Rapporteer missende data

### 2. Volume Analyse
```python
# Groepeer per categorie
volume = df.groupby(['Ticket Type', 'Issue Type', 'Subissue Type']).agg({
    'Ticket Number': 'count',
    'Total Hours Worked': 'sum'
}).rename(columns={'Ticket Number': 'Volume'})
```

Output: Top 10 ticket-types op volume

### 3. Resolutie Pattern Detectie
```python
# Analyseer resolutie teksten
patterns = df.groupby(['Issue Type'])['Resolution'].apply(
    lambda x: extract_common_phrases(x, min_freq=3)
)
```

Identificeer:
- Standaard oplossingen (>70% similarity)
- Escalatie triggers (keywords: 'overgepakt', 'uitbreiding', 'complex')
- SLA compliance (<80% = risico)

### 4. Automatisering Score
Bereken per ticket-type:
```
Score = Volume × Success_Kans × Business_Impact
```

**Success_Kans** (0-1):
- Standaard resolutie: 0.9
- <2 uur afhandeling: 0.8  
- >5 heropens: 0.3
- Escalatie keywords: 0.2

**Business_Impact** (1-3):
- Monitoring alert: 3
- Service request: 2
- Incident: 1

### 5. Output Genereren

#### Analyse Rapport (markdown)
```markdown
# Ticket Analyse [periode]

## Volume Verdeling
[tabel top 10 types]

## Automatisering Kandidaten
[top 10 op score, met reasoning]

## Risico's
[SLA violations, hoge reopen rates]

## Aanbeveling
[go/no-go per type + rationale]
```

#### Test Scenario's
Per top 5 types: 5 real-world voorbeelden met expected outcome

#### Dashboard Data (JSON)
```json
{
  "accuracy": {"predicted": X, "actual": Y},
  "volume_impact": {"automated": X, "manual": Y},
  "sla_compliance": X
}
```

## Escalatie Criteria Detectie

Zoek in resolutie/description:
- "SLA bijna verlopen", "time-out"
- "niet opgelost", "nog steeds issue"
- "klant ontevreden", "negatieve feedback"
- "handmatig overpakken", "engineer nodig"

## References

`references/ticket_fields.md` - Veld definities en verwachte waardes
