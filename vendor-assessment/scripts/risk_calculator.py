#!/usr/bin/env python3
"""
Vendor Risk Calculator
Calculates composite risk scores based on assessment criteria
"""

import json
from typing import Dict, List, Tuple

class VendorRiskCalculator:
    def __init__(self):
        self.weights = {
            'security': {
                'certifications': 30,
                'mfa_sso': 15,
                'encryption': 15,
                'testing': 15,
                'bcp': 15,
                'incidents': -20  # per incident
            },
            'privacy': {
                'gdpr_compliance': 25,
                'eea_location': 20,
                'dpa_available': 15,
                'transparency': 20,
                'rights_management': 20
            },
            'operational': {
                'uptime_sla': 20,
                'support_quality': 15,
                'user_reviews': 25,
                'financial_health': 20,
                'market_position': 20
            }
        }
    
    def calculate_security_score(self, vendor_data: Dict) -> Tuple[int, List[str]]:
        """Calculate security score (0-100)"""
        score = 0
        findings = []
        
        # Certifications
        if vendor_data.get('iso27001') or vendor_data.get('soc2'):
            score += self.weights['security']['certifications']
            findings.append("✓ Security certification present")
        else:
            findings.append("✗ No security certification")
        
        # MFA/SSO
        if vendor_data.get('mfa_available'):
            score += self.weights['security']['mfa_sso']
            findings.append("✓ MFA available")
        else:
            findings.append("✗ MFA not available")
        
        # Encryption
        if vendor_data.get('encryption_at_rest') and vendor_data.get('encryption_in_transit'):
            score += self.weights['security']['encryption']
            findings.append("✓ Full encryption")
        else:
            findings.append("⚠ Partial encryption")
        
        # Security testing
        if vendor_data.get('pentest_frequency'):
            score += self.weights['security']['testing']
            findings.append("✓ Regular security testing")
        
        # Business continuity
        if vendor_data.get('bcp_documented'):
            score += self.weights['security']['bcp']
            findings.append("✓ BCP documented")
        
        # Incidents (negative impact)
        incidents = vendor_data.get('security_incidents', 0)
        if incidents > 0:
            score += self.weights['security']['incidents'] * incidents
            findings.append(f"✗ {incidents} security incidents")
        
        return max(0, min(100, score)), findings
    
    def calculate_privacy_score(self, vendor_data: Dict) -> Tuple[int, List[str]]:
        """Calculate privacy score (0-100)"""
        score = 0
        findings = []
        
        if vendor_data.get('gdpr_compliant'):
            score += self.weights['privacy']['gdpr_compliance']
            findings.append("✓ GDPR compliant")
        else:
            findings.append("✗ GDPR compliance unclear")
        
        if vendor_data.get('data_in_eea'):
            score += self.weights['privacy']['eea_location']
            findings.append("✓ Data in EEA")
        else:
            findings.append("⚠ Data outside EEA")
        
        if vendor_data.get('dpa_available'):
            score += self.weights['privacy']['dpa_available']
            findings.append("✓ DPA available")
        
        if vendor_data.get('privacy_transparency'):
            score += self.weights['privacy']['transparency']
            findings.append("✓ Transparent privacy practices")
        
        if vendor_data.get('user_rights_supported'):
            score += self.weights['privacy']['rights_management']
            findings.append("✓ User rights supported")
        
        return max(0, min(100, score)), findings
    
    def calculate_operational_score(self, vendor_data: Dict) -> Tuple[int, List[str]]:
        """Calculate operational score (0-100)"""
        score = 0
        findings = []
        
        # Uptime SLA
        uptime = vendor_data.get('uptime_sla', 0)
        if uptime >= 99.9:
            score += self.weights['operational']['uptime_sla']
            findings.append(f"✓ High uptime SLA ({uptime}%)")
        elif uptime >= 99:
            score += self.weights['operational']['uptime_sla'] // 2
            findings.append(f"⚠ Moderate uptime SLA ({uptime}%)")
        
        # Support quality
        if vendor_data.get('support_24_7'):
            score += self.weights['operational']['support_quality']
            findings.append("✓ 24/7 support available")
        elif vendor_data.get('support_business_hours'):
            score += self.weights['operational']['support_quality'] // 2
            findings.append("⚠ Business hours support only")
        
        # User reviews
        rating = vendor_data.get('user_rating', 0)
        if rating >= 4.0:
            score += self.weights['operational']['user_reviews']
            findings.append(f"✓ Good user rating ({rating}/5)")
        elif rating >= 3.0:
            score += self.weights['operational']['user_reviews'] // 2
            findings.append(f"⚠ Average user rating ({rating}/5)")
        
        # Financial health
        if vendor_data.get('financially_stable'):
            score += self.weights['operational']['financial_health']
            findings.append("✓ Financially stable")
        else:
            findings.append("⚠ Financial stability uncertain")
        
        # Market position
        if vendor_data.get('established_vendor'):
            score += self.weights['operational']['market_position']
            findings.append("✓ Established market position")
        
        return max(0, min(100, score)), findings
    
    def get_decision(self, category: int, scores: Dict[str, int]) -> Dict:
        """Determine go/no-go decision based on category and scores"""
        avg_score = sum(scores.values()) / len(scores)
        
        thresholds = {
            1: 50, 2: 50, 3: 60, 4: 70, 5: 80
        }
        
        required_score = thresholds.get(category, 60)
        
        if avg_score >= required_score:
            decision = "GO"
            risk_level = "Acceptable"
        elif avg_score >= required_score - 10:
            decision = "CONDITIONAL"
            risk_level = "Medium"
        else:
            decision = "NO-GO"
            risk_level = "High"
        
        return {
            'decision': decision,
            'risk_level': risk_level,
            'average_score': round(avg_score, 1),
            'required_score': required_score,
            'gap': round(avg_score - required_score, 1)
        }
    
    def generate_report(self, vendor_name: str, category: int, vendor_data: Dict) -> str:
        """Generate complete assessment report"""
        security_score, security_findings = self.calculate_security_score(vendor_data)
        privacy_score, privacy_findings = self.calculate_privacy_score(vendor_data)
        operational_score, operational_findings = self.calculate_operational_score(vendor_data)
        
        scores = {
            'security': security_score,
            'privacy': privacy_score,
            'operational': operational_score
        }
        
        decision = self.get_decision(category, scores)
        
        report = f"""
# Vendor Risk Assessment: {vendor_name}

## Summary
- **Category**: {category}
- **Decision**: {decision['decision']}
- **Risk Level**: {decision['risk_level']}
- **Overall Score**: {decision['average_score']}/100 (Required: {decision['required_score']})

## Detailed Scores

### Security: {security_score}/100
{chr(10).join(security_findings)}

### Privacy: {privacy_score}/100  
{chr(10).join(privacy_findings)}

### Operational: {operational_score}/100
{chr(10).join(operational_findings)}

## Recommendations
"""
        if decision['decision'] == "NO-GO":
            report += "- Vendor does not meet minimum requirements\n"
            report += "- Consider alternative vendors\n"
            report += "- If proceeding, implement significant additional controls\n"
        elif decision['decision'] == "CONDITIONAL":
            report += "- Address identified gaps before full deployment\n"
            report += "- Implement compensating controls\n"
            report += "- Schedule follow-up assessment in 6 months\n"
        else:
            report += "- Proceed with standard onboarding\n"
            report += "- Document any residual risks\n"
            report += "- Schedule periodic reviews per policy\n"
        
        return report


def main():
    """Example usage"""
    calculator = VendorRiskCalculator()
    
    # Example vendor data
    vendor_data = {
        'iso27001': True,
        'soc2': False,
        'mfa_available': True,
        'encryption_at_rest': True,
        'encryption_in_transit': True,
        'pentest_frequency': 'annual',
        'bcp_documented': True,
        'security_incidents': 0,
        'gdpr_compliant': True,
        'data_in_eea': True,
        'dpa_available': True,
        'privacy_transparency': True,
        'user_rights_supported': True,
        'uptime_sla': 99.9,
        'support_24_7': False,
        'support_business_hours': True,
        'user_rating': 4.3,
        'financially_stable': True,
        'established_vendor': False
    }
    
    report = calculator.generate_report("Example Vendor", 3, vendor_data)
    print(report)


if __name__ == "__main__":
    main()
