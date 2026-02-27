/**
 * Application de Tableau de Bord de Conformité
 * Gestion des données, filtres et visualisations
 */

// ============================================================================
// DONNÉES MOCKÉES (À REMPLACER PAR DES APPELS API)
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
// CLASSE PRINCIPALE DE L'APPLICATION
// ============================================================================

class ConformityDashboard {
    constructor() {
        this.data = JSON.parse(JSON.stringify(mockData)); // Clone des données
        this.filteredData = this.data;
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
    }

    setupEventListeners() {
        // Bouton Actualiser
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());

        // Bouton Exporter
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());

        // Filtres
        document.getElementById('domainFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('periodFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('riskFilter').addEventListener('change', () => this.applyFilters());
    }

    loadData() {
        // Simuler un délai de chargement
        this.showLoading(true);
        
        setTimeout(() => {
            this.applyFilters();
            this.updateKPIs();
            this.renderCharts();
            this.renderTables();
            this.showLoading(false);
            this.showNotification('Données chargées avec succès', 'success');
        }, 500);
    }

    refreshData() {
        const btn = document.getElementById('refreshBtn');
        const icon = document.getElementById('refreshIcon');
        
        btn.disabled = true;
        icon.style.animation = 'spin 1s linear infinite';
        
        // Simuler un appel API
        setTimeout(() => {
            // Mettre à jour les données avec des variations aléatoires
            this.data.controls.forEach(control => {
                if (control.status === 'Complété') {
                    control.conformity = Math.max(85, control.conformity + (Math.random() - 0.5) * 5);
                }
            });
            
            this.loadData();
            btn.disabled = false;
            icon.style.animation = 'none';
        }, 1500);
    }

    applyFilters() {
        const domain = document.getElementById('domainFilter').value;
        const status = document.getElementById('statusFilter').value;
        const risk = document.getElementById('riskFilter').value;

        this.filteredData = {
            controls: this.data.controls.filter(c => {
                return (!domain || c.domain === domain) &&
                       (!status || c.status === status) &&
                       (!risk || c.risk === risk);
            }),
            anomalies: this.data.anomalies.filter(a => {
                if (!domain) return true;
                return this.data.controls.find(c => c.name === a.control && c.domain === domain);
            }),
            trends: this.data.trends
        };

        this.updateKPIs();
        this.renderCharts();
        this.renderTables();
    }

    updateKPIs() {
        const controls = this.filteredData.controls;
        const completedControls = controls.filter(c => c.status === 'Complété');
        const anomalies = this.filteredData.anomalies;
        const criticalAnomalies = anomalies.filter(a => a.severity === 'Critique');

        // Conformité Globale
        const avgConformity = completedControls.length > 0
            ? (completedControls.reduce((sum, c) => sum + c.conformity, 0) / completedControls.length).toFixed(2)
            : 0;
        document.getElementById('globalConformity').textContent = avgConformity;
        document.getElementById('conformityChange').textContent = avgConformity >= 95 ? '✓ Conforme' : '⚠ Sous objectif';
        document.getElementById('conformityChange').className = avgConformity >= 95 ? 'kpi-change positive' : 'kpi-change negative';

        // Contrôles Complétés
        const completionRate = ((completedControls.length / controls.length) * 100).toFixed(0);
        document.getElementById('completedControls').textContent = completedControls.length;
        document.getElementById('completionRate').textContent = `${completionRate}% complétés`;

        // Anomalies
        document.getElementById('anomaliesCount').textContent = anomalies.length;
        document.getElementById('anomaliesChange').textContent = `${criticalAnomalies.length} critiques`;

        // Contrôles Retardés
        const delayedControls = controls.filter(c => c.status === 'Planifié').length;
        document.getElementById('delayedControls').textContent = delayedControls;
        document.getElementById('delayedChange').textContent = delayedControls > 0 ? '⚠ Action requise' : '✓ À jour';

        // Mise à jour de la jauge
        this.updateGauge(avgConformity);
    }

    updateGauge(value) {
        document.getElementById('gaugeValue').textContent = value + '%';
        
        const canvas = document.getElementById('gaugeChart');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;

        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner le fond de la jauge
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
        ctx.strokeStyle = '#ECF0F1';
        ctx.lineWidth = 15;
        ctx.stroke();

        // Déterminer la couleur selon la valeur
        let color = '#27AE60'; // Vert
        if (value < 85) color = '#E74C3C'; // Rouge
        else if (value < 90) color = '#E67E22'; // Orange
        else if (value < 95) color = '#F39C12'; // Jaune

        // Dessiner la jauge
        const angle = Math.PI + (value / 100) * Math.PI;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, angle, false);
        ctx.strokeStyle = color;
        ctx.lineWidth = 15;
        ctx.stroke();

        // Dessiner le centre
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#2C3E50';
        ctx.fill();
    }

    renderCharts() {
        this.renderDomainConformityChart();
        this.renderTrendChart();
        this.renderAnomaliesChart();
    }

    renderDomainConformityChart() {
        const domains = {};
        
        this.filteredData.controls.forEach(control => {
            if (!domains[control.domain]) {
                domains[control.domain] = [];
            }
            if (control.status === 'Complété') {
                domains[control.domain].push(control.conformity);
            }
        });

        const labels = Object.keys(domains);
        const data = labels.map(domain => {
            const values = domains[domain];
            return values.length > 0 ? (values.reduce((a, b) => a + b) / values.length).toFixed(2) : 0;
        });

        const ctx = document.getElementById('domainConformityChart').getContext('2d');
        
        if (this.charts.domainConformity) {
            this.charts.domainConformity.destroy();
        }

        this.charts.domainConformity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Conformité (%)',
                    data: data,
                    backgroundColor: [
                        'rgba(39, 174, 96, 0.7)',
                        'rgba(230, 126, 34, 0.7)',
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                    ],
                    borderColor: [
                        '#27AE60',
                        '#E67E22',
                        '#3498DB',
                        '#9B59B6',
                    ],
                    borderWidth: 2,
                    borderRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: value => value + '%' }
                    }
                }
            }
        });
    }

    renderTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        if (this.charts.trend) {
            this.charts.trend.destroy();
        }

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.filteredData.trends.map(t => t.month),
                datasets: [{
                    label: 'Conformité Globale',
                    data: this.filteredData.trends.map(t => t.conformity),
                    borderColor: '#1F4E78',
                    backgroundColor: 'rgba(31, 78, 120, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#FFC000',
                    pointBorderColor: '#1F4E78',
                    pointBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 90,
                        max: 100,
                        ticks: { callback: value => value + '%' }
                    }
                }
            }
        });
    }

    renderAnomaliesChart() {
        const severities = {};
        
        this.filteredData.anomalies.forEach(anomaly => {
            severities[anomaly.severity] = (severities[anomaly.severity] || 0) + 1;
        });

        const ctx = document.getElementById('anomaliesChart').getContext('2d');
        
        if (this.charts.anomalies) {
            this.charts.anomalies.destroy();
        }

        this.charts.anomalies = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(severities),
                datasets: [{
                    data: Object.values(severities),
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.7)',
                        'rgba(230, 126, 34, 0.7)',
                        'rgba(241, 196, 15, 0.7)',
                        'rgba(39, 174, 96, 0.7)',
                    ],
                    borderColor: [
                        '#E74C3C',
                        '#E67E22',
                        '#F1C40F',
                        '#27AE60',
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    renderTables() {
        this.renderControlsTable();
        this.renderAnomaliesTable();
    }

    renderControlsTable() {
        const tbody = document.getElementById('controlsTableBody');
        
        if (this.filteredData.controls.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #95A5A6;">Aucun contrôle ne correspond aux filtres</td></tr>';
            return;
        }

        tbody.innerHTML = this.filteredData.controls.map(control => `
            <tr>
                <td><strong>${control.code}</strong></td>
                <td>${control.name}</td>
                <td>${control.domain}</td>
                <td><span class="status-badge status-${control.status.toLowerCase().replace(' ', '-')}">${control.status}</span></td>
                <td><strong>${control.conformity > 0 ? control.conformity.toFixed(1) + '%' : '-'}</strong></td>
                <td>${control.anomalies}</td>
                <td><span class="severity-${control.risk.toLowerCase()}">${control.risk}</span></td>
            </tr>
        `).join('');
    }

    renderAnomaliesTable() {
        const tbody = document.getElementById('anomaliesTableBody');
        
        if (this.filteredData.anomalies.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #95A5A6;">Aucune anomalie détectée</td></tr>';
            return;
        }

        tbody.innerHTML = this.filteredData.anomalies.map(anomaly => `
            <tr>
                <td>${anomaly.date}</td>
                <td>${anomaly.control}</td>
                <td>${anomaly.type}</td>
                <td><span class="severity-${anomaly.severity.toLowerCase()}">${anomaly.severity}</span></td>
                <td>${anomaly.description}</td>
                <td><span class="status-badge status-${anomaly.status.toLowerCase().replace(' ', '-')}">${anomaly.status}</span></td>
            </tr>
        `).join('');
    }

    showLoading(show) {
        const btn = document.getElementById('refreshBtn');
        const icon = document.getElementById('refreshIcon');
        const text = document.getElementById('refreshText');
        
        if (show) {
            btn.disabled = true;
            icon.innerHTML = '<span class="loading"></span>';
            text.textContent = 'Chargement...';
        } else {
            btn.disabled = false;
            icon.textContent = '🔄';
            text.textContent = 'Actualiser';
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    exportData() {
        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conformity_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.showNotification('Données exportées avec succès', 'success');
    }

    generateCSV() {
        let csv = 'Code,Nom,Domaine,Statut,Conformité,Anomalies,Risque\n';
        
        this.filteredData.controls.forEach(control => {
            csv += `${control.code},"${control.name}",${control.domain},${control.status},${control.conformity},${control.anomalies},${control.risk}\n`;
        });

        csv += '\n\nDate,Contrôle,Type,Sévérité,Description,Statut\n';
        
        this.filteredData.anomalies.forEach(anomaly => {
            csv += `${anomaly.date},"${anomaly.control}",${anomaly.type},${anomaly.severity},"${anomaly.description}",${anomaly.status}\n`;
        });

        return csv;
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    new ConformityDashboard();
});
