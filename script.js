/* ============================================================================
   FICHE DE CONTRÔLE LCB-FT – VERSION OPTIMISÉE
   Logique JavaScript - Optimisée et Refactorisée
   ============================================================================ */

// ============ CONFIGURATION MÉTIER ============
const CONTROL_DEFINITIONS = {
    ouverture: [
        { id: 'OUV-01', label: 'Vérification identité et adresse du client', severity: 'critique', category: 'KYC' },
        { id: 'OUV-02', label: 'Collecte et archivage des documents KYC', severity: 'critique', category: 'KYC' },
        { id: 'OUV-03', label: 'Évaluation du profil de risque initial', severity: 'majeur', category: 'Risk Assessment' },
        { id: 'OUV-04', label: 'Vérification listes de sanctions (OFAC, UE)', severity: 'critique', category: 'Sanctions' },
        { id: 'OUV-05', label: 'Documentation de la source de fonds', severity: 'majeur', category: 'AML' },
        { id: 'OUV-06', label: 'Consentement client pour traitement données', severity: 'majeur', category: 'Compliance' },
    ],
    transactions: [
        { id: 'TRX-01', label: 'Contrôle montants vs plafonds applicables', severity: 'majeur', category: 'Transaction Monitoring' },
        { id: 'TRX-02', label: 'Détection transactions suspectes (structuring)', severity: 'critique', category: 'AML' },
        { id: 'TRX-03', label: 'Vérification bénéficiaire final (virements)', severity: 'majeur', category: 'KYC' },
        { id: 'TRX-04', label: 'Analyse cohérence avec profil client', severity: 'majeur', category: 'Risk Assessment' },
        { id: 'TRX-05', label: 'Documentation des transactions atypiques', severity: 'majeur', category: 'Compliance' },
        { id: 'TRX-06', label: 'Archivage des preuves de transaction', severity: 'mineur', category: 'Documentation' },
    ],
    monetique: [
        { id: 'MON-01', label: 'KYC renforcé à la souscription carte premium', severity: 'majeur', category: 'KYC' },
        { id: 'MON-02', label: 'Plafonds de retrait proportionnels au profil client', severity: 'majeur', category: 'Transaction Monitoring' },
        { id: 'MON-03', label: 'Alertes automatiques retraits internationaux atypiques', severity: 'critique', category: 'AML' },
        { id: 'MON-04', label: 'Blocage immédiat après 3 tentatives échouées', severity: 'critique', category: 'Fraud Prevention' },
        { id: 'MON-05', label: 'Contrôle origine des fonds (porte-monnaie électronique)', severity: 'majeur', category: 'AML' },
        { id: 'MON-06', label: 'Filtrage commerçants TPE vs listes de sanctions', severity: 'majeur', category: 'Sanctions' },
        { id: 'MON-07', label: 'Analyse comportementale transactions carte (scénarios)', severity: 'majeur', category: 'Risk Assessment' },
    ],
    credits: [
        { id: 'CRD-01', label: 'Vérification KYC approfondie avant octroi crédit', severity: 'critique', category: 'KYC' },
        { id: 'CRD-02', label: 'Analyse capacité de remboursement (scoring)', severity: 'majeur', category: 'Risk Assessment' },
        { id: 'CRD-03', label: 'Documentation source fonds (apport personnel)', severity: 'majeur', category: 'AML' },
        { id: 'CRD-04', label: 'Vérification listes de sanctions emprunteur', severity: 'critique', category: 'Sanctions' },
        { id: 'CRD-05', label: 'Suivi périodique des crédits (comportement)', severity: 'majeur', category: 'Transaction Monitoring' },
    ],
    be: [
        { id: 'BE-01', label: 'Vérification correspondants bancaires (due diligence)', severity: 'critique', category: 'Correspondent Banking' },
        { id: 'BE-02', label: 'Contrôle montants virements internationaux', severity: 'majeur', category: 'Transaction Monitoring' },
        { id: 'BE-03', label: 'Vérification bénéficiaires finaux (SWIFT)', severity: 'majeur', category: 'KYC' },
        { id: 'BE-04', label: 'Filtrage sanctions pays (OFAC, UE, ONU)', severity: 'critique', category: 'Sanctions' },
        { id: 'BE-05', label: 'Documentation change et taux appliqués', severity: 'mineur', category: 'Compliance' },
    ],
    ds: [
        { id: 'DS-01', label: 'Processus de détection des soupçons AML', severity: 'critique', category: 'AML' },
        { id: 'DS-02', label: 'Documentation et archivage déclarations soupçon', severity: 'critique', category: 'Compliance' },
        { id: 'DS-03', label: 'Respect délai de déclaration (24-48h)', severity: 'critique', category: 'Regulatory' },
        { id: 'DS-04', label: 'Confidentialité déclarations (secret bancaire)', severity: 'critique', category: 'Compliance' },
    ],
    gov: [
        { id: 'GOV-01', label: 'Existence fonction conformité indépendante', severity: 'critique', category: 'Governance' },
        { id: 'GOV-02', label: 'Politique LCB-FT formalisée et mise à jour', severity: 'critique', category: 'Governance' },
        { id: 'GOV-03', label: 'Formation du personnel (AML/LCB-FT)', severity: 'majeur', category: 'Training' },
        { id: 'GOV-04', label: 'Audit interne LCB-FT (fréquence)', severity: 'majeur', category: 'Audit' },
        { id: 'GOV-05', label: 'Rapports de conformité au management', severity: 'majeur', category: 'Reporting' },
    ]
};

const PERIMETRE_DESCRIPTIONS = {
    ouverture: 'Vérification des contrôles appliqués lors de l\'ouverture de compte et de la mise à jour du KYC.',
    transactions: 'Suivi des transactions bancaires (versements, retraits, virements, opérations de change).',
    monetique: 'Contrôle des opérations monétiques (cartes bancaires, TPE, portefeuilles électroniques).',
    credits: 'Évaluation des contrôles appliqués aux crédits et financements accordés.',
    be: 'Vérification des opérations bancaires étrangères et des correspondants bancaires.',
    ds: 'Suivi des déclarations de soupçon et des signalements AML.',
    gov: 'Évaluation de la gouvernance et de la fonction conformité LCB-FT.'
};

// ============ ÉTAT DE L'APPLICATION ============
const AppState = {
    controls: [],
    evaluations: {},
    comments: {},
    
    initialize() {
        this.loadFromStorage();
        this.updateLastModified();
    },
    
    loadFromStorage() {
        const stored = localStorage.getItem('lcbft_data');
        if (stored) {
            const data = JSON.parse(stored);
            this.evaluations = data.evaluations || {};
            this.comments = data.comments || {};
        }
    },
    
    saveToStorage() {
        const data = {
            evaluations: this.evaluations,
            comments: this.comments,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('lcbft_data', JSON.stringify(data));
        this.updateLastModified();
    },
    
    updateLastModified() {
        const lastUpdate = document.getElementById('last-update');
        if (lastUpdate) {
            const now = new Date();
            lastUpdate.textContent = now.toLocaleString('fr-FR');
        }
    },
    
    getEvaluation(controlId) {
        return this.evaluations[controlId] || '';
    },
    
    setEvaluation(controlId, value) {
        this.evaluations[controlId] = value;
    },
    
    getComment(controlId) {
        return this.comments[controlId] || '';
    },
    
    setComment(controlId, value) {
        this.comments[controlId] = value;
    }
};

// ============ GESTION DES CONTRÔLES ============
function loadControls() {
    const perimetre = document.getElementById('perimetre').value;
    const controlsList = document.getElementById('controls-list');
    const controlsCard = document.getElementById('controls-card');
    const resultsCard = document.getElementById('results-card');
    const signaturesCard = document.getElementById('signatures-card');
    const emptyState = document.getElementById('controls-empty');
    
    if (!perimetre) {
        controlsList.innerHTML = '';
        emptyState.style.display = 'block';
        resultsCard.style.display = 'none';
        signaturesCard.style.display = 'none';
        return;
    }
    
    AppState.controls = CONTROL_DEFINITIONS[perimetre] || [];
    renderControls();
    
    emptyState.style.display = 'none';
    resultsCard.style.display = 'block';
    signaturesCard.style.display = 'block';
    
    updateStats();
}

function renderControls() {
    const controlsList = document.getElementById('controls-list');
    controlsList.innerHTML = '';
    
    AppState.controls.forEach(control => {
        const controlElement = createControlElement(control);
        controlsList.appendChild(controlElement);
    });
}

function createControlElement(control) {
    const div = document.createElement('div');
    div.className = `control-item ${control.severity}`;
    div.setAttribute('data-control-id', control.id);
    
    const savedEval = AppState.getEvaluation(control.id);
    const savedComment = AppState.getComment(control.id);
    
    div.innerHTML = `
        <div class="ctrl-head">
            <div>
                <span class="ctrl-id">${control.id}</span> – ${control.label}
                <span class="badge ${control.severity}">${formatSeverity(control.severity)}</span>
            </div>
        </div>
        <div class="ctrl-actions">
            <select class="eval" data-control-id="${control.id}" onchange="handleEvalChange(this)">
                <option value="">-- Évaluer --</option>
                <option value="conforme" ${savedEval === 'conforme' ? 'selected' : ''}>✅ Conforme</option>
                <option value="mineur" ${savedEval === 'mineur' ? 'selected' : ''}>⚠️ Écart mineur</option>
                <option value="majeur" ${savedEval === 'majeur' ? 'selected' : ''}>🔶 Écart majeur</option>
                <option value="critique" ${savedEval === 'critique' ? 'selected' : ''}>🔴 Écart critique</option>
                <option value="na" ${savedEval === 'na' ? 'selected' : ''}>➖ N/A</option>
            </select>
            <input type="text" class="comment" data-control-id="${control.id}" 
                   placeholder="Commentaire (optionnel)" 
                   value="${savedComment}"
                   onchange="handleCommentChange(this)">
        </div>
    `;
    
    return div;
}

function formatSeverity(severity) {
    const severityMap = {
        'critique': '🔴 CRITIQUE',
        'majeur': '🔶 MAJEUR',
        'mineur': '⚠️ MINEUR'
    };
    return severityMap[severity] || severity;
}

function handleEvalChange(selectElement) {
    const controlId = selectElement.getAttribute('data-control-id');
    const value = selectElement.value;
    AppState.setEvaluation(controlId, value);
    updateStats();
}

function handleCommentChange(inputElement) {
    const controlId = inputElement.getAttribute('data-control-id');
    const value = inputElement.value;
    AppState.setComment(controlId, value);
}

// ============ MISE À JOUR DES STATISTIQUES ============
function updateStats() {
    const stats = calculateStats();
    updateResultsDisplay(stats);
    updateScoreDisplay(stats);
    updateAnalysisTable(stats);
}

function calculateStats() {
    const stats = {
        conforme: 0,
        mineur: 0,
        majeur: 0,
        critique: 0,
        na: 0,
        total: 0,
        score: 0
    };
    
    AppState.controls.forEach(control => {
        const eval = AppState.getEvaluation(control.id);
        if (eval && eval !== 'na') {
            stats[eval] = (stats[eval] || 0) + 1;
            stats.total++;
        } else if (eval === 'na') {
            stats.na++;
        }
    });
    
    // Calcul du score de conformité
    if (stats.total > 0) {
        const scoreValue = (stats.conforme * 100 + stats.mineur * 50 + stats.majeur * 25 + stats.critique * 0) / stats.total;
        stats.score = Math.round(scoreValue);
    }
    
    return stats;
}

function updateResultsDisplay(stats) {
    setCount('count-conforme', stats.conforme, 'Conforme');
    setCount('count-mineur', stats.mineur, 'Écart Mineur');
    setCount('count-majeur', stats.majeur, 'Écart Majeur');
    setCount('count-critique', stats.critique, 'Écart Critique');
    setCount('count-na', stats.na, 'N/A');
}

function updateScoreDisplay(stats) {
    const scoreElement = document.getElementById('score-value');
    const statusElement = document.getElementById('statut-conformite');
    
    scoreElement.textContent = stats.score;
    
    if (stats.total === 0) {
        statusElement.innerHTML = '<option>-- À évaluer --</option>';
    } else if (stats.critique > 0) {
        statusElement.innerHTML = '<option>🔴 Critique - Action immédiate requise</option>';
    } else if (stats.majeur > 0) {
        statusElement.innerHTML = '<option>🔶 À améliorer - Plan d\'action requis</option>';
    } else if (stats.mineur > 0) {
        statusElement.innerHTML = '<option>⚠️ Acceptable - Amélioration recommandée</option>';
    } else {
        statusElement.innerHTML = '<option>✅ Conforme - Maintenir le niveau</option>';
    }
}

function updateAnalysisTable(stats) {
    const analysisContent = document.getElementById('analysis-content');
    
    let html = '<table><thead><tr><th>Critère</th><th>Nombre</th><th>Pourcentage</th><th>Statut</th></tr></thead><tbody>';
    
    const rows = [
        { label: 'Conforme', value: stats.conforme, status: '✅' },
        { label: 'Écart Mineur', value: stats.mineur, status: '⚠️' },
        { label: 'Écart Majeur', value: stats.majeur, status: '🔶' },
        { label: 'Écart Critique', value: stats.critique, status: '🔴' },
        { label: 'N/A', value: stats.na, status: '➖' }
    ];
    
    rows.forEach(row => {
        const percentage = stats.total > 0 ? Math.round((row.value / stats.total) * 100) : 0;
        html += `<tr>
            <td>${row.label}</td>
            <td>${row.value}</td>
            <td>${percentage}%</td>
            <td>${row.status}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    analysisContent.innerHTML = html;
}

function setCount(id, val, label) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = `${val}<br>${label}`;
    }
}

// ============ GESTION DES SIGNATURES ============
function updatePerimetreDescription() {
    const perimetre = document.getElementById('perimetre').value;
    const descElement = document.getElementById('perimetre-description');
    
    if (perimetre && PERIMETRE_DESCRIPTIONS[perimetre]) {
        descElement.innerHTML = `<strong>Périmètre :</strong> ${PERIMETRE_DESCRIPTIONS[perimetre]}`;
        descElement.style.display = 'block';
    } else {
        descElement.style.display = 'none';
    }
}

// ============ SAUVEGARDE DES DONNÉES ============
function saveData() {
    // Validation des champs obligatoires
    const ref = document.getElementById('ref').value.trim();
    const date = document.getElementById('date').value;
    const ctrl = document.getElementById('ctrl').value.trim();
    const perimetre = document.getElementById('perimetre').value;
    const entites = document.getElementById('entites').value.trim();
    const periode = document.getElementById('periode').value.trim();
    
    if (!ref || !date || !ctrl || !perimetre || !entites || !periode) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Sauvegarde des données
    AppState.saveToStorage();
    
    // Affichage du bouton d'export
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
        exportBtn.style.display = 'inline-block';
    }
    
    showToast('Fiche de contrôle enregistrée avec succès', 'success');
}

// ============ EXPORTATION EN EXCEL ============
function exportToExcel() {
    try {
        const ref = document.getElementById('ref').value;
        const date = document.getElementById('date').value;
        const ctrl = document.getElementById('ctrl').value;
        const perimetre = document.getElementById('perimetre').value;
        const entites = document.getElementById('entites').value;
        const periode = document.getElementById('periode').value;
        
        // Préparation des données
        const data = [
            ['FICHE DE CONTRÔLE LCB-FT'],
            [''],
            ['INFORMATIONS GÉNÉRALES'],
            ['Référence', ref],
            ['Date du contrôle', date],
            ['Contrôleur', ctrl],
            ['Périmètre', perimetre],
            ['Entité(s) / Agence(s)', entites],
            ['Période contrôlée', periode],
            [''],
            ['POINTS DE CONTRÔLE'],
            ['ID', 'Libellé', 'Sévérité', 'Évaluation', 'Commentaire']
        ];
        
        // Ajout des points de contrôle
        AppState.controls.forEach(control => {
            const eval = AppState.getEvaluation(control.id) || 'Non évalué';
            const comment = AppState.getComment(control.id) || '';
            data.push([control.id, control.label, control.severity, eval, comment]);
        });
        
        // Calcul des statistiques
        const stats = calculateStats();
        data.push(['']);
        data.push(['STATISTIQUES']);
        data.push(['Conforme', stats.conforme]);
        data.push(['Écart Mineur', stats.mineur]);
        data.push(['Écart Majeur', stats.majeur]);
        data.push(['Écart Critique', stats.critique]);
        data.push(['N/A', stats.na]);
        data.push(['Score de Conformité', stats.score]);
        
        // Création du fichier CSV
        const csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        
        // Téléchargement
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `LCBFT_${ref}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Fiche exportée en Excel avec succès', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'exportation:', error);
        showToast('Erreur lors de l\'exportation', 'error');
    }
}

// ============ RÉINITIALISATION DU FORMULAIRE ============
function resetForm() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ? Cette action est irréversible.')) {
        document.getElementById('form-general').reset();
        document.getElementById('controls-list').innerHTML = '';
        document.getElementById('controls-empty').style.display = 'block';
        document.getElementById('results-card').style.display = 'none';
        document.getElementById('signatures-card').style.display = 'none';
        
        AppState.evaluations = {};
        AppState.comments = {};
        AppState.controls = [];
        
        localStorage.removeItem('lcbft_data');
        
        showToast('Formulaire réinitialisé', 'warning');
    }
}

// ============ NOTIFICATIONS TOAST ============
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============ INITIALISATION DE L'APPLICATION ============
document.addEventListener('DOMContentLoaded', function() {
    AppState.initialize();
    
    // Restauration des données du formulaire général
    const stored = localStorage.getItem('lcbft_general');
    if (stored) {
        const generalData = JSON.parse(stored);
        document.getElementById('ref').value = generalData.ref || '';
        document.getElementById('date').value = generalData.date || '';
        document.getElementById('ctrl').value = generalData.ctrl || '';
        document.getElementById('perimetre').value = generalData.perimetre || '';
        document.getElementById('entites').value = generalData.entites || '';
        document.getElementById('periode').value = generalData.periode || '';
        
        if (generalData.perimetre) {
            loadControls();
        }
    }
    
    // Sauvegarde automatique des données du formulaire général
    const formInputs = document.querySelectorAll('#form-general input, #form-general select');
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            const generalData = {
                ref: document.getElementById('ref').value,
                date: document.getElementById('date').value,
                ctrl: document.getElementById('ctrl').value,
                perimetre: document.getElementById('perimetre').value,
                entites: document.getElementById('entites').value,
                periode: document.getElementById('periode').value
            };
            localStorage.setItem('lcbft_general', JSON.stringify(generalData));
        });
    });
    
    // Mise à jour de la date actuelle par défaut
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    showToast('Application chargée avec succès', 'success');
});

// ============ GESTION DES ÉVÉNEMENTS GLOBAUX ============
window.addEventListener('beforeunload', function() {
    // Sauvegarde automatique avant fermeture
    const generalData = {
        ref: document.getElementById('ref').value,
        date: document.getElementById('date').value,
        ctrl: document.getElementById('ctrl').value,
        perimetre: document.getElementById('perimetre').value,
        entites: document.getElementById('entites').value,
        periode: document.getElementById('periode').value
    };
    localStorage.setItem('lcbft_general', JSON.stringify(generalData));
});
