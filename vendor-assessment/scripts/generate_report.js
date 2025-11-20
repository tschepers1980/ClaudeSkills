#!/usr/bin/env node

/**
 * Vendor Assessment Report Generator
 * Generates professional Word documents based on Ratho BV template
 * 
 * Usage: node generate_report.js --vendor "VendorName" --category 4 --security-score 75 ...
 */

const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType } = require('docx');

// Parse command line arguments
function parseArgs() {
    const args = {};
    const argList = process.argv.slice(2);
    
    for (let i = 0; i < argList.length; i += 2) {
        const key = argList[i].replace('--', '').replace(/-/g, '_');
        args[key] = argList[i + 1];
    }
    
    return args;
}

// Category descriptions per taal
const CATEGORY_DESCRIPTIONS = {
    nl: {
        '1': 'Public - Minimale bedrijfsimpact',
        '2': 'Internal - Lage bedrijfsimpact',
        '3': 'Confidential - Medium bedrijfsimpact',
        '4': 'Business Critical/PI - Hoge bedrijfsimpact',
        '5': 'Mission Critical/Customer PI - Kritieke bedrijfsimpact'
    },
    en: {
        '1': 'Public - Minimal business impact',
        '2': 'Internal - Low business impact',
        '3': 'Confidential - Medium business impact',
        '4': 'Business Critical/PI - High business impact',
        '5': 'Mission Critical/Customer PI - Critical business impact'
    }
};

// Report templates per taal
const REPORT_TEMPLATES = {
    nl: {
        coverTitle: "Vendor Assessment",
        versionStatus: "Versie: 1.0 / Status: Ter goedkeuring",
        date: "Datum:",
        author: "Opsteller: Ratho BV",
        client: "Opdrachtgever:",
        execSummary: "1. Executive Summary",
        vendor: "Vendor:",
        service: "Service:",
        category: "Categorie:",
        assessmentDate: "Assessment Datum:",
        decision: "Beslissing:",
        riskAssessment: "2. Risk Assessment",
        securityEval: "Security Evaluation",
        domain: "Domein",
        score: "Score",
        status: "Status",
        security: "Security",
        privacy: "Privacy",
        operations: "Operations",
        overall: "Overall",
        detailedFindings: "2.1 Gedetailleerde Bevindingen",
        strengths: "Sterke Punten",
        concerns: "Aandachtspunten",
        compliance: "3. Compliance Status",
        requirement: "Requirement",
        notes: "Notes",
        recommendations: "4. Aanbevelingen",
        decisionLabel: "Beslissing:",
        conditions: "Voorwaarden:",
        defaultRationale: "Op basis van de uitgevoerde beoordeling wordt geadviseerd om verder te gaan met deze vendor onder de voorwaarden zoals hieronder vermeld.",
        tbd: "Te bepalen"
    },
    en: {
        coverTitle: "Vendor Assessment",
        versionStatus: "Version: 1.0 / Status: For approval",
        date: "Date:",
        author: "Prepared by: Ratho BV",
        client: "Client:",
        execSummary: "1. Executive Summary",
        vendor: "Vendor:",
        service: "Service:",
        category: "Category:",
        assessmentDate: "Assessment Date:",
        decision: "Decision:",
        riskAssessment: "2. Risk Assessment",
        securityEval: "Security Evaluation",
        domain: "Domain",
        score: "Score",
        status: "Status",
        security: "Security",
        privacy: "Privacy",
        operations: "Operations",
        overall: "Overall",
        detailedFindings: "2.1 Detailed Findings",
        strengths: "Strengths",
        concerns: "Points of Attention",
        compliance: "3. Compliance Status",
        requirement: "Requirement",
        notes: "Notes",
        recommendations: "4. Recommendations",
        decisionLabel: "Decision:",
        conditions: "Conditions:",
        defaultRationale: "Based on the conducted assessment, we recommend proceeding with this vendor under the conditions outlined below.",
        tbd: "To be determined"
    }
};

// Generate cover page
function createCoverPage(vendorName, date, lang = 'nl') {
    const template = REPORT_TEMPLATES[lang];
    
    return [
        new Paragraph({
            text: template.coverTitle,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 3000, after: 400 }
        }),
        new Paragraph({
            text: vendorName,
            alignment: AlignmentType.CENTER,
            spacing: { after: 2000 },
            children: [
                new TextRun({
                    text: vendorName,
                    size: 32,
                    bold: true,
                    color: "2E5090"
                })
            ]
        }),
        new Paragraph({ text: "", spacing: { after: 2000 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: template.versionStatus,
                    size: 20
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: `${template.date} ${date}`,
                    size: 20
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: template.author,
                    size: 20
                })
            ]
        })
    ];
}

// Create executive summary section
function createExecutiveSummary(data, lang = 'nl') {
    const template = REPORT_TEMPLATES[lang];
    const categoryDescs = CATEGORY_DESCRIPTIONS[lang];
    
    const overallScore = Math.round((parseInt(data.security_score) + 
                                    parseInt(data.privacy_score) + 
                                    parseInt(data.operations_score)) / 3);
    
    const statusIcon = data.decision === 'GO' ? '✓' : 
                      data.decision === 'NO-GO' ? '✗' : '⚠';
    
    const sections = [
        new Paragraph({
            text: template.execSummary,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 240 }
        }),
        new Paragraph({
            spacing: { after: 120 },
            children: [
                new TextRun({ text: `${template.vendor} `, bold: true }),
                new TextRun({ text: data.vendor })
            ]
        }),
        new Paragraph({
            spacing: { after: 120 },
            children: [
                new TextRun({ text: `${template.service} `, bold: true }),
                new TextRun({ text: data.service || template.tbd })
            ]
        }),
        new Paragraph({
            spacing: { after: 120 },
            children: [
                new TextRun({ text: `${template.category} `, bold: true }),
                new TextRun({ text: `${data.category} - ${categoryDescs[data.category]}` })
            ]
        }),
        new Paragraph({
            spacing: { after: 120 },
            children: [
                new TextRun({ text: `${template.assessmentDate} `, bold: true }),
                new TextRun({ text: data.date })
            ]
        }),
        new Paragraph({
            spacing: { after: 120 },
            children: [
                new TextRun({ text: `${template.decision} `, bold: true }),
                new TextRun({ 
                    text: `${statusIcon} ${data.decision}`,
                    bold: true,
                    color: data.decision === 'GO' ? "00AA00" : 
                           data.decision === 'NO-GO' ? "AA0000" : "FF8800"
                })
            ]
        }),
        new Paragraph({
            spacing: { after: 120 },
            children: [
                new TextRun({ text: (lang === 'nl' ? 'Overall Score: ' : 'Overall Score: '), bold: true }),
                new TextRun({ 
                    text: `${overallScore}/100`,
                    bold: true,
                    color: overallScore >= 70 ? "00AA00" : overallScore >= 60 ? "FF8800" : "AA0000"
                })
            ]
        })
    ];
    
    // Add summary rationale if provided
    if (data.summary) {
        sections.push(
            new Paragraph({ text: "", spacing: { after: 120 } }),
            new Paragraph({
                text: data.summary,
                spacing: { after: 240 }
            })
        );
    }
    
    return sections;
}

// Create risk assessment table
function createRiskTable(data, lang = 'nl') {
    const template = REPORT_TEMPLATES[lang];
    
    const createStatusCell = (score) => {
        const status = score >= 70 ? '✓' : score >= 50 ? '⚠' : '✗';
        const color = score >= 70 ? "00AA00" : score >= 50 ? "FF8800" : "AA0000";
        
        return new TableCell({
            children: [new Paragraph({
                children: [new TextRun({ text: status, bold: true, color: color })]
            })],
            width: { size: 15, type: WidthType.PERCENTAGE }
        });
    };
    
    const overallScore = Math.round((parseInt(data.security_score) + 
                                    parseInt(data.privacy_score) + 
                                    parseInt(data.operations_score)) / 3);
    
    return [
        new Paragraph({
            text: template.riskAssessment,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 240 }
        }),
        new Paragraph({
            text: template.securityEval,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 200 }
        }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ text: template.domain, bold: true })] 
                            })],
                            shading: { fill: "E7E6E6" }
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ text: template.score, bold: true })] 
                            })],
                            shading: { fill: "E7E6E6" }
                        }),
                        new TableCell({
                            children: [new Paragraph({ 
                                children: [new TextRun({ text: template.status, bold: true })] 
                            })],
                            shading: { fill: "E7E6E6" }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(template.security)] }),
                        new TableCell({ children: [new Paragraph(`${data.security_score}/100`)] }),
                        createStatusCell(parseInt(data.security_score))
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(template.privacy)] }),
                        new TableCell({ children: [new Paragraph(`${data.privacy_score}/100`)] }),
                        createStatusCell(parseInt(data.privacy_score))
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(template.operations)] }),
                        new TableCell({ children: [new Paragraph(`${data.operations_score}/100`)] }),
                        createStatusCell(parseInt(data.operations_score))
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ 
                            children: [new Paragraph({ 
                                children: [new TextRun({ text: template.overall, bold: true })] 
                            })]
                        }),
                        new TableCell({ 
                            children: [new Paragraph({ 
                                children: [new TextRun({ text: `${overallScore}/100`, bold: true })] 
                            })]
                        }),
                        createStatusCell(overallScore)
                    ]
                })
            ]
        })
    ];
}

// Create detailed findings section
function createDetailedFindings(data, lang = 'nl') {
    const sections = [];
    
    // Security findings
    if (data.security_findings) {
        sections.push(
            new Paragraph({
                text: (lang === 'nl' ? 'Security Bevindingen' : 'Security Findings'),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 }
            })
        );
        
        const findings = data.security_findings.split('|');
        findings.forEach(finding => {
            const trimmed = finding.trim();
            if (trimmed) {
                sections.push(
                    new Paragraph({
                        text: trimmed,
                        spacing: { after: 80 }
                    })
                );
            }
        });
    }
    
    // Privacy findings
    if (data.privacy_findings) {
        sections.push(
            new Paragraph({
                text: (lang === 'nl' ? 'Privacy Bevindingen' : 'Privacy Findings'),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 }
            })
        );
        
        const findings = data.privacy_findings.split('|');
        findings.forEach(finding => {
            const trimmed = finding.trim();
            if (trimmed) {
                sections.push(
                    new Paragraph({
                        text: trimmed,
                        spacing: { after: 80 }
                    })
                );
            }
        });
    }
    
    // Operational findings
    if (data.operational_findings) {
        sections.push(
            new Paragraph({
                text: (lang === 'nl' ? 'Operationele Bevindingen' : 'Operational Findings'),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 }
            })
        );
        
        const findings = data.operational_findings.split('|');
        findings.forEach(finding => {
            const trimmed = finding.trim();
            if (trimmed) {
                sections.push(
                    new Paragraph({
                        text: trimmed,
                        spacing: { after: 80 }
                    })
                );
            }
        });
    }
    
    return sections;
}

// Create key findings section
function createKeyFindings(data, lang = 'nl') {
    if (!data.strengths && !data.concerns) {
        return [];
    }
    
    const sections = [
        new Paragraph({
            text: (lang === 'nl' ? '3. Belangrijkste Bevindingen' : '3. Key Findings'),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 240 }
        })
    ];
    
    // Strengths
    if (data.strengths) {
        sections.push(
            new Paragraph({
                text: (lang === 'nl' ? 'Sterke Punten' : 'Strengths'),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 160 }
            })
        );
        
        const strengths = data.strengths.split('|');
        strengths.forEach(strength => {
            const trimmed = strength.trim();
            if (trimmed) {
                sections.push(
                    new Paragraph({
                        text: `• ${trimmed}`,
                        spacing: { after: 80 }
                    })
                );
            }
        });
    }
    
    // Concerns
    if (data.concerns) {
        sections.push(
            new Paragraph({
                text: (lang === 'nl' ? 'Aandachtspunten' : 'Areas of Concern'),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 160 }
            })
        );
        
        const concerns = data.concerns.split('|');
        concerns.forEach(concern => {
            const trimmed = concern.trim();
            if (trimmed) {
                sections.push(
                    new Paragraph({
                        text: `• ${trimmed}`,
                        spacing: { after: 80 }
                    })
                );
            }
        });
    }
    
    return sections;
}

// Create detailed findings section with strengths and concerns
function createDetailedFindings(data, lang = 'nl') {
    const template = REPORT_TEMPLATES[lang];
    
    const sections = [
        new Paragraph({
            text: template.detailedFindings,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 240 }
        })
    ];
    
    // Strengths section
    if (data.strengths) {
        sections.push(
            new Paragraph({
                text: template.strengths,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200, after: 120 }
            })
        );
        
        const strengths = data.strengths.split('|');
        strengths.forEach(strength => {
            const trimmed = strength.trim();
            if (trimmed) {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: '✓ ', color: "00AA00", bold: true }),
                            new TextRun({ text: trimmed })
                        ],
                        spacing: { after: 80 }
                    })
                );
            }
        });
    }
    
    // Concerns section
    if (data.concerns) {
        sections.push(
            new Paragraph({
                text: template.concerns,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200, after: 120 }
            })
        );
        
        const concerns = data.concerns.split('|');
        concerns.forEach(concern => {
            const trimmed = concern.trim();
            if (trimmed) {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: '⚠ ', color: "FF8800", bold: true }),
                            new TextRun({ text: trimmed })
                        ],
                        spacing: { after: 80 }
                    })
                );
            }
        });
    }
    
    return sections;
}

// Create compliance section
function createComplianceSection(data, lang = 'nl') {
    const template = REPORT_TEMPLATES[lang];
    
    return [
        new Paragraph({
            text: template.compliance,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 240 }
        }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ 
                            children: [new Paragraph({ children: [new TextRun({ text: template.requirement, bold: true })] })],
                            shading: { fill: "E7E6E6" }
                        }),
                        new TableCell({ 
                            children: [new Paragraph({ children: [new TextRun({ text: template.status, bold: true })] })],
                            shading: { fill: "E7E6E6" }
                        }),
                        new TableCell({ 
                            children: [new Paragraph({ children: [new TextRun({ text: template.notes, bold: true })] })],
                            shading: { fill: "E7E6E6" }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("ISO 27001")] }),
                        new TableCell({ children: [new Paragraph(data.iso27001 || (lang === 'nl' ? "Te verifiëren" : "To be verified"))] }),
                        new TableCell({ children: [new Paragraph(data.iso27001_notes || "-")] })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("SOC2 Type II")] }),
                        new TableCell({ children: [new Paragraph(data.soc2 || (lang === 'nl' ? "Te verifiëren" : "To be verified"))] }),
                        new TableCell({ children: [new Paragraph(data.soc2_notes || "-")] })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("GDPR/AVG")] }),
                        new TableCell({ children: [new Paragraph(data.gdpr || (lang === 'nl' ? "Te verifiëren" : "To be verified"))] }),
                        new TableCell({ children: [new Paragraph(data.gdpr_notes || "-")] })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("Data Location")] }),
                        new TableCell({ children: [new Paragraph(data.data_location || (lang === 'nl' ? "Te verifiëren" : "To be verified"))] }),
                        new TableCell({ children: [new Paragraph(data.location_notes || "-")] })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("MFA/SSO")] }),
                        new TableCell({ children: [new Paragraph(data.mfa_sso || (lang === 'nl' ? "Te verifiëren" : "To be verified"))] }),
                        new TableCell({ children: [new Paragraph(data.mfa_notes || "-")] })
                    ]
                })
            ]
        })
    ];
}

// Create recommendations section
function createRecommendations(data, lang = 'nl') {
    const template = REPORT_TEMPLATES[lang];
    
    const sections = [
        new Paragraph({
            text: template.recommendations,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 240 }
        }),
        new Paragraph({
            text: `${template.decisionLabel} ${data.decision}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
        }),
        new Paragraph({
            text: data.rationale || template.defaultRationale,
            spacing: { after: 240 }
        })
    ];
    
    if (data.conditions) {
        sections.push(
            new Paragraph({
                text: template.conditions,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200, after: 120 }
            })
        );
        
        const conditions = data.conditions.split(',');
        conditions.forEach(condition => {
            sections.push(
                new Paragraph({
                    text: `• ${condition.trim()}`,
                    spacing: { after: 60 }
                })
            );
        });
    }
    
    return sections;
}

// Main function
async function generateReport() {
    const args = parseArgs();
    
    // Validate required arguments
    if (!args.vendor || !args.category) {
        console.error('Error: --vendor and --category are required');
        console.error('Usage: node generate_report.js --vendor "VendorName" --category 4 [--language nl|en]');
        process.exit(1);
    }
    
    // Set defaults
    const language = args.language || 'nl';
    const data = {
        vendor: args.vendor,
        category: args.category,
        service: args.service || (language === 'nl' ? 'Te bepalen' : 'To be determined'),
        date: args.date || new Date().toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US'),
        decision: args.decision || 'CONDITIONAL',
        security_score: args.security_score || '0',
        privacy_score: args.privacy_score || '0',
        operations_score: args.operations_score || '0',
        iso27001: args.iso27001,
        soc2: args.soc2,
        gdpr: args.gdpr,
        data_location: args.data_location,
        mfa_sso: args.mfa_sso,
        rationale: args.rationale,
        conditions: args.conditions,
        iso27001_notes: args.iso27001_notes,
        soc2_notes: args.soc2_notes,
        gdpr_notes: args.gdpr_notes,
        location_notes: args.location_notes,
        mfa_notes: args.mfa_notes,
        strengths: args.strengths,
        concerns: args.concerns,
        language: language
    };
    
    // Create document
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1440, // 1 inch
                        right: 1440,
                        bottom: 1440,
                        left: 1440
                    }
                }
            },
            children: [
                ...createCoverPage(data.vendor, data.date, language),
                ...createExecutiveSummary(data, language),
                ...createRiskTable(data, language),
                ...createDetailedFindings(data, language),
                ...createComplianceSection(data, language),
                ...createRecommendations(data, language)
            ]
        }]
    });
    
    // Generate filename
    const filename = `vendor_assessment_${data.vendor.replace(/\s+/g, '_')}_${data.date.replace(/\//g, '-')}.docx`;
    const outputPath = args.output || '/mnt/user-data/outputs/';
    const fullPath = `${outputPath}${filename}`;
    
    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    
    // Write document
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(fullPath, buffer);
    
    const overallScore = Math.round((parseInt(data.security_score) + parseInt(data.privacy_score) + parseInt(data.operations_score)) / 3);
    
    console.log(`✓ Report generated: ${fullPath}`);
    console.log(`  Vendor: ${data.vendor}`);
    console.log(`  Category: ${data.category}`);
    console.log(`  Decision: ${data.decision}`);
    console.log(`  Overall Score: ${overallScore}/100`);
    console.log(`  Language: ${language.toUpperCase()}`);
}

// Run if called directly
if (require.main === module) {
    generateReport().catch(err => {
        console.error('Error generating report:', err);
        process.exit(1);
    });
}

module.exports = { generateReport };