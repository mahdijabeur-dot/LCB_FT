/**
 * Serveur Express Simple pour le Tableau de Bord de Conformité
 * Sert les fichiers statiques et fournit une API pour les données
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Changed from 3000

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============================================================================
// DONNÉES MOCKÉES (À REMPLACER PAR UNE VRAIE BASE DE DONNÉES)
// ============================================================================

const mockData = {
    controls: [
        { id: 1, code: '01_01_01', name: 'Gestion SWIFT', domain: 'Bancaire Étranger', status: 'Complété', conformity: 98.5, anomalies: 1, risk: 'Critique' },
        { id: 2, code: '01_01_04', name: 'Transferts Émis', domain: 'Bancaire Étranger', status: 'Complété', conformity: 95.0, anomalies: 2, risk: 'Critique' },
        { id: 3, code: '01_01_05', name: 'Transferts Reçus', domain: 'Bancaire Étranger', status: 'En cours', conformity: 0, anomalies: 0, risk: 'Critique' },
        { id: 4, code: '02_01_01', name: 'Crédits Documentaires', domain: 'Financement', status: 'Complété', conformity: 92.0, anomalies: 3, risk: 'Élevé' },
        { id: 5, code: '02_01_02', name: 'Crédits Garantis', domain: 'Financement', status: 'Complété', conformity: 96.0, anomalies: 1, risk: 'Élevé' },
        { id: 6, code: '03_01_01', name: 'Gestion Trésorerie', domain: 'Trésorerie', status: 'Complété', conformity: 98.0, anomalies: 0, risk: 'Critique' },
        { id: 7, code: '04_01_01', name: 'Conformité AML', domain: 'Conformité AML', status: 'Planifié', conformity: 0, anomalies: 0, risk: 'Critique' },
        { id: 8, code: '04_01_02', name: 'KYC Clients', domain: 'Conformité AML', status: 'Complété', conformity: 94.5, anomalies: 2, risk: 'Élevé' },
    ],
    anomalies: [
        { id: 1, date: '2026-02-05', control: 'Transferts Émis', type: 'Erreur Montant', severity: 'Moyen', description: 'Discordance montant détectée', status: 'Résolu' },
        { id: 2, date: '2026-02-04', control: 'Transferts Émis', type: 'Erreur Bénéficiaire', severity: 'Critique', description: 'Bénéficiaire incorrect', status: 'En cours' },
        { id: 3, date: '2026-02-03', control: 'Crédits Documentaires', type: 'Documentation', severity: 'Moyen', description: 'Document manquant', status: 'Résolu' },
        { id: 4, date: '2026-02-02', control: 'Crédits Documentaires', type: 'Délai', severity: 'Élevé', description: 'Dépassement délai', status: 'En cours' },
        { id: 5, date: '2026-02-01', control: 'KYC Clients', type: 'Vérification', severity: 'Moyen', description: 'Vérification incomplète', status: 'Résolu' },
    ],
    trends: [
        { month: 'Décembre', conformity: 94.5 },
        { month: 'Janvier', conformity: 95.2 },
        { month: 'Février', conformity: 96.75 },
    ]
};

// ============================================================================
// ROUTES API
// ============================================================================

/**
 * GET /api/conformity
 * Retourne les données de conformité complètes
 */
app.get('/api/conformity', (req, res) => {
    try {
        const domain = req.query.domain;
        const status = req.query.status;
        const risk = req.query.risk;

        let filteredControls = mockData.controls;

        if (domain) {
            filteredControls = filteredControls.filter(c => c.domain === domain);
        }
        if (status) {
            filteredControls = filteredControls.filter(c => c.status === status);
        }
        if (risk) {
            filteredControls = filteredControls.filter(c => c.risk === risk);
        }

        // Calculer les KPI
        const completedControls = filteredControls.filter(c => c.status === 'Complété');
        const avgConformity = completedControls.length > 0
            ? (completedControls.reduce((sum, c) => sum + c.conformity, 0) / completedControls.length).toFixed(2)
            : 0;

        const kpis = {
            globalConformity: avgConformity,
            completedControls: completedControls.length,
            totalControls: filteredControls.length,
            completionRate: ((completedControls.length / filteredControls.length) * 100).toFixed(0),
            anomaliesCount: mockData.anomalies.length,
            criticalAnomalies: mockData.anomalies.filter(a => a.severity === 'Critique').length,
            delayedControls: filteredControls.filter(c => c.status === 'Planifié').length,
        };

        res.json({
            success: true,
            data: {
                kpis,
                controls: filteredControls,
                anomalies: mockData.anomalies,
                trends: mockData.trends
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/controls
 * Retourne la liste des contrôles
 */
app.get('/api/controls', (req, res) => {
    try {
        const domain = req.query.domain;
        const status = req.query.status;
        const risk = req.query.risk;

        let filtered = mockData.controls;

        if (domain) filtered = filtered.filter(c => c.domain === domain);
        if (status) filtered = filtered.filter(c => c.status === status);
        if (risk) filtered = filtered.filter(c => c.risk === risk);

        res.json({ success: true, data: filtered });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/anomalies
 * Retourne la liste des anomalies
 */
app.get('/api/anomalies', (req, res) => {
    try {
        const severity = req.query.severity;
        const status = req.query.status;

        let filtered = mockData.anomalies;

        if (severity) filtered = filtered.filter(a => a.severity === severity);
        if (status) filtered = filtered.filter(a => a.status === status);

        res.json({ success: true, data: filtered });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/trends
 * Retourne les tendances de conformité
 */
app.get('/api/trends', (req, res) => {
    try {
        res.json({ success: true, data: mockData.trends });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/kpis
 * Retourne les KPI calculés
 */
app.get('/api/kpis', (req, res) => {
    try {
        const completedControls = mockData.controls.filter(c => c.status === 'Complété');
        const avgConformity = completedControls.length > 0
            ? (completedControls.reduce((sum, c) => sum + c.conformity, 0) / completedControls.length).toFixed(2)
            : 0;

        const kpis = {
            globalConformity: avgConformity,
            completedControls: completedControls.length,
            totalControls: mockData.controls.length,
            completionRate: ((completedControls.length / mockData.controls.length) * 100).toFixed(0),
            anomaliesCount: mockData.anomalies.length,
            criticalAnomalies: mockData.anomalies.filter(a => a.severity === 'Critique').length,
            delayedControls: mockData.controls.filter(c => c.status === 'Planifié').length,
        };

        res.json({ success: true, data: kpis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/controls/:id/update
 * Met à jour un contrôle
 */
app.post('/api/controls/:id/update', (req, res) => {
    try {
        const { id } = req.params;
        const { status, conformity, anomalies } = req.body;

        const control = mockData.controls.find(c => c.id === parseInt(id));
        if (!control) {
            return res.status(404).json({ success: false, error: 'Contrôle non trouvé' });
        }

        if (status) control.status = status;
        if (conformity !== undefined) control.conformity = conformity;
        if (anomalies !== undefined) control.anomalies = anomalies;

        res.json({ success: true, data: control });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/anomalies
 * Crée une nouvelle anomalie
 */
app.post('/api/anomalies', (req, res) => {
    try {
        const { date, control, type, severity, description, status } = req.body;

        const newAnomaly = {
            id: mockData.anomalies.length + 1,
            date,
            control,
            type,
            severity,
            description,
            status
        };

        mockData.anomalies.push(newAnomaly);
        res.status(201).json({ success: true, data: newAnomaly });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/export
 * Exporte les données en CSV
 */
app.get('/api/export', (req, res) => {
    try {
        let csv = 'Code,Nom,Domaine,Statut,Conformité,Anomalies,Risque\n';
        
        mockData.controls.forEach(control => {
            csv += `${control.code},"${control.name}",${control.domain},${control.status},${control.conformity},${control.anomalies},${control.risk}\n`;
        });

        csv += '\n\nDate,Contrôle,Type,Sévérité,Description,Statut\n';
        
        mockData.anomalies.forEach(anomaly => {
            csv += `${anomaly.date},"${anomaly.control}",${anomaly.type},${anomaly.severity},"${anomaly.description}",${anomaly.status}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="conformity_report_${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================================================
// ROUTES STATIQUES
// ============================================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================================
// GESTION DES ERREURS
// ============================================================================

app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Erreur serveur interne' });
});

// ============================================================================
// DÉMARRAGE DU SERVEUR
// ============================================================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║   Tableau de Bord de Conformité - Serveur Démarré         ║
╚════════════════════════════════════════════════════════════╝

🌐 URL: http://localhost:${PORT}
📊 API: http://localhost:${PORT}/api/conformity
📁 Fichiers: ${__dirname}

Appuyez sur Ctrl+C pour arrêter le serveur
    `);
});
