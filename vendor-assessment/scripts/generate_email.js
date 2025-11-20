#!/usr/bin/env node

/**
 * Vendor Follow-up Email Generator
 * Generates HTML-formatted emails ready for Outlook/Office 365
 * 
 * Usage: node generate_email.js --vendor "VendorName" --action-items "item1,item2,item3"
 */

const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, WidthType, BorderStyle } = require('docx');

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

// Email templates per taal
const EMAIL_TEMPLATES = {
    nl: {
        greeting: (contact) => `Beste ${contact || 'contactpersoon'},`,
        intro: (vendor, category) => `In het kader van onze vendor assessment voor ${vendor} hebben wij een beoordeling uitgevoerd conform de ISO 27001 en NEN 7510 richtlijnen. Deze leverancier is gecategoriseerd als <strong>Categorie ${category}</strong> vanwege de aard van de gegevensverwerking en de bedrijfskritische impact.`,
        followup: `Naar aanleiding van deze beoordeling zijn er een aantal punten die wij graag met jullie willen afstemmen voordat we kunnen overgaan tot goedkeuring:`,
        actionItemsHeader: `<strong>Actiepunten:</strong>`,
        requests: `Deze punten zijn nader uitgewerkt in de bijgevoegde rapportage. Wij verzoeken jullie vriendelijk om:`,
        requestItems: [
            'De gevraagde informatie/documentatie aan te leveren',
            'Indien van toepassing, de benodigde verbeteringen door te voeren',
            'Een planning te delen voor de implementatie van eventuele wijzigingen'
        ],
        closing: `Zodra we de gevraagde informatie hebben ontvangen en de punten zijn afgestemd, kunnen we de assessment afronden en overgaan tot definitieve goedkeuring.`,
        questions: `Voor vragen of overleg kunt u uiteraard contact met ons opnemen.`,
        signoff: `Met vriendelijke groet,`
    },
    en: {
        greeting: (contact) => `Dear ${contact || 'Sir/Madam'},`,
        intro: (vendor, category) => `As part of our vendor assessment for ${vendor}, we have conducted an evaluation in accordance with ISO 27001 and NEN 7510 guidelines. This vendor has been classified as <strong>Category ${category}</strong> due to the nature of data processing and business-critical impact.`,
        followup: `Following this assessment, there are several points we would like to address with you before we can proceed to approval:`,
        actionItemsHeader: `<strong>Action Items:</strong>`,
        requests: `These points are detailed in the attached report. We kindly request you to:`,
        requestItems: [
            'Provide the requested information/documentation',
            'Implement the necessary improvements where applicable',
            'Share a timeline for the implementation of any required changes'
        ],
        closing: `Once we have received the requested information and the points have been addressed, we can finalize the assessment and proceed to final approval.`,
        questions: `Please feel free to contact us if you have any questions or would like to discuss further.`,
        signoff: `Kind regards,`
    }
};

// Generate HTML email
function generateEmailHTML(data) {
    const actionItems = data.action_items.split(',').map(item => item.trim());
    const lang = data.language || 'nl';
    const template = EMAIL_TEMPLATES[lang];
    
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            color: #000000;
            line-height: 1.5;
        }
        .signature {
            margin-top: 20px;
            font-family: 'Calibri', 'Arial', sans-serif;
        }
        .action-item {
            margin-left: 20px;
            margin-bottom: 8px;
        }
        strong {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <p>${template.greeting(data.contact)}</p>
    
    <p>${template.intro(data.vendor, data.category)}</p>
    
    <p>${template.followup}</p>
    
    <p>${template.actionItemsHeader}</p>
`;

    actionItems.forEach((item, index) => {
        html += `    <div class="action-item">${index + 1}. ${item}</div>\n`;
    });

    html += `    
    <p>${template.requests}</p>
    <ul>
`;

    template.requestItems.forEach(item => {
        html += `        <li>${item}</li>\n`;
    });

    html += `    </ul>
    
    <p>${template.closing}</p>
    
    <p>${template.questions}</p>
    
    <div class="signature">
        <p>${template.signoff}</p>
        <p><strong>Ratho BV</strong><br>
        ${data.sender_name || 'Thomas'}<br>
        IT Account Manager<br>
        <br>
        E: ${data.sender_email || 'info@ratho.nl'}<br>
        T: +31 (0)40 123 4567</p>
    </div>
</body>
</html>`;

    return html;
}

// Document templates per taal
const DOC_TEMPLATES = {
    nl: {
        title: "Vendor Assessment",
        subtitle: "Actiepunten Overzicht",
        version: "Versie: 1.0 / Status: Ter opvolging",
        date: "Datum:",
        author: "Opsteller: Ratho BV",
        client: "Opdrachtgever:",
        introTitle: "1. Inleiding",
        introText: (vendor, category) => `Dit document bevat een overzicht van actiepunten die naar voren zijn gekomen tijdens de vendor assessment van ${vendor}. Deze leverancier is gecategoriseerd als Categorie ${category} op basis van de aard van de gegevensverwerking en de impact op de bedrijfsvoering.`,
        introText2: "De onderstaande punten dienen te worden opgepakt voordat tot definitieve goedkeuring kan worden overgegaan. Dit is conform onze ISO 27001 en NEN 7510 procedures voor vendor management.",
        actionItemsTitle: "2. Actiepunten",
        statusLabel: "Status:",
        statusValue: "Te verifiëren",
        actionLabel: "Actie:",
        actionValue: "Graag de benodigde informatie/documentatie aanleveren of de nodige verbeteringen doorvoeren.",
        deadlineLabel: "Deadline:",
        deadlineValue: "Te bepalen in overleg",
        nextStepsTitle: "3. Vervolgstappen",
        nextStepsIntro: "Na ontvangst van de gevraagde informatie zullen wij:",
        nextSteps: [
            "De aangeleverde documentatie beoordelen",
            "Indien nodig aanvullende vragen stellen",
            "De assessment afronden en een definitief advies uitbrengen",
            "Bij goedkeuring de leverancier registreren in ons vendor management systeem"
        ],
        closing: "Voor vragen over dit document of de actiepunten kunt u contact opnemen met Ratho BV."
    },
    en: {
        title: "Vendor Assessment",
        subtitle: "Action Items Overview",
        version: "Version: 1.0 / Status: Pending follow-up",
        date: "Date:",
        author: "Prepared by: Ratho BV",
        client: "Client:",
        introTitle: "1. Introduction",
        introText: (vendor, category) => `This document contains an overview of action items that have emerged during the vendor assessment of ${vendor}. This vendor has been classified as Category ${category} based on the nature of data processing and business impact.`,
        introText2: "The points listed below must be addressed before final approval can be granted. This is in accordance with our ISO 27001 and NEN 7510 vendor management procedures.",
        actionItemsTitle: "2. Action Items",
        statusLabel: "Status:",
        statusValue: "To be verified",
        actionLabel: "Action:",
        actionValue: "Please provide the required information/documentation or implement the necessary improvements.",
        deadlineLabel: "Deadline:",
        deadlineValue: "To be determined in consultation",
        nextStepsTitle: "3. Next Steps",
        nextStepsIntro: "Upon receipt of the requested information, we will:",
        nextSteps: [
            "Review the provided documentation",
            "Ask additional questions if necessary",
            "Finalize the assessment and provide a definitive recommendation",
            "Upon approval, register the vendor in our vendor management system"
        ],
        closing: "For questions about this document or the action items, please contact Ratho BV."
    }
};

// Generate action items Word document
async function generateActionItemsDoc(data) {
    const actionItems = data.action_items.split(',').map(item => item.trim());
    const lang = data.language || 'nl';
    const template = DOC_TEMPLATES[lang];
    
    // Build all children first
    const children = [
        // Cover page elements
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 2000, after: 200 },
            children: [
                new TextRun({
                    text: template.title,
                    size: 36,
                    bold: true,
                    color: "2E5090"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
                new TextRun({
                    text: template.subtitle,
                    size: 28,
                    bold: true
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1500 },
            children: [
                new TextRun({
                    text: data.vendor,
                    size: 32,
                    bold: true,
                    color: "2E5090"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: template.version,
                    size: 20
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
                new TextRun({
                    text: `${template.date} ${data.date || new Date().toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US')}`,
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
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 2000 },
            children: [
                new TextRun({
                    text: `${template.client} ${data.client || 'IVT'}`,
                    size: 20
                })
            ]
        }),
        
        // Content
        new Paragraph({
            text: template.introTitle,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 240 }
        }),
        new Paragraph({
            text: template.introText(data.vendor, data.category),
            spacing: { after: 240 }
        }),
        new Paragraph({
            text: template.introText2,
            spacing: { after: 400 }
        }),
        
        // Action items header
        new Paragraph({
            text: template.actionItemsTitle,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 240 }
        })
    ];
    
    // Add action items
    actionItems.forEach((item, index) => {
        children.push(
            new Paragraph({
                text: `2.${index + 1} ${item}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 240, after: 120 }
            }),
            new Paragraph({
                spacing: { after: 80 },
                children: [
                    new TextRun({ text: `${template.statusLabel} `, bold: true }),
                    new TextRun({ text: template.statusValue, color: "FF8800" })
                ]
            }),
            new Paragraph({
                spacing: { after: 80 },
                children: [
                    new TextRun({ text: `${template.actionLabel} `, bold: true }),
                    new TextRun({ text: template.actionValue })
                ]
            }),
            new Paragraph({
                spacing: { after: 240 },
                children: [
                    new TextRun({ text: `${template.deadlineLabel} `, bold: true }),
                    new TextRun({ text: template.deadlineValue })
                ]
            })
        );
    });
    
    // Add conclusion
    children.push(
        new Paragraph({
            text: template.nextStepsTitle,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 240 }
        }),
        new Paragraph({
            text: template.nextStepsIntro,
            spacing: { after: 120 }
        })
    );
    
    template.nextSteps.forEach((step, index) => {
        children.push(
            new Paragraph({
                text: `${index + 1}. ${step}`,
                spacing: { after: 60 }
            })
        );
    });
    
    children.push(
        new Paragraph({
            text: template.closing,
            spacing: { before: 240, after: 200 }
        })
    );
    
    // Create document with all children
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1440,
                        right: 1440,
                        bottom: 1440,
                        left: 1440
                    }
                }
            },
            children: children
        }]
    });
    
    return doc;
}

// Main function
async function generateEmail() {
    const args = parseArgs();
    
    // Validate required arguments
    if (!args.vendor || !args.action_items) {
        console.error('Error: --vendor and --action-items are required');
        console.error('Usage: node generate_email.js --vendor "VendorName" --action-items "item1,item2,item3" [--language nl|en]');
        process.exit(1);
    }
    
    // Set defaults
    const language = args.language || 'nl';
    const data = {
        vendor: args.vendor,
        category: args.category || '4',
        action_items: args.action_items,
        contact: args.contact || (language === 'nl' ? 'contactpersoon' : 'Sir/Madam'),
        sender_name: args.sender_name || 'Thomas',
        sender_email: args.sender_email || 'info@ratho.nl',
        client: args.client || 'IVT',
        date: args.date || new Date().toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US'),
        language: language
    };
    
    const outputPath = args.output || '/mnt/user-data/outputs/';
    
    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }
    
    // Generate email HTML
    const emailHTML = generateEmailHTML(data);
    const emailFilename = `email_${data.vendor.replace(/\s+/g, '_')}.html`;
    const emailPath = `${outputPath}${emailFilename}`;
    fs.writeFileSync(emailPath, emailHTML);
    
    console.log(`✓ Email HTML generated: ${emailPath}`);
    
    // Generate action items document
    const doc = await generateActionItemsDoc(data);
    const docFilename = `actiepunten_${data.vendor.replace(/\s+/g, '_')}.docx`;
    const docPath = `${outputPath}${docFilename}`;
    
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(docPath, buffer);
    
    console.log(`✓ Action items document generated: ${docPath}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Open ${emailFilename} in a browser`);
    console.log(`  2. Select all (Ctrl+A) and copy (Ctrl+C)`);
    console.log(`  3. Paste into new Outlook/Office 365 email`);
    console.log(`  4. Attach ${docFilename}`);
    console.log(`  5. Review and send`);
}

// Run if called directly
if (require.main === module) {
    generateEmail().catch(err => {
        console.error('Error generating email:', err);
        process.exit(1);
    });
}

module.exports = { generateEmail, generateEmailHTML, generateActionItemsDoc };
