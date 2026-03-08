// ============================================================
//  app.js — Logique principale du contrôle permanent LCB-FT
// ============================================================

// Objet de contrôle
        let controleLCBFT = {
            id: null,
            reference: '',
            dateControle: '',
            controleur: '',
            perimetre: [],
            entite: '',
            periodeControle: '',
            pointsControle: [],
            resultats: {
                conformes: 0,
                ecartsMineurs: 0,
                ecartsMajeurs: 0,
                ecartsCritiques: 0,
                na: 0
            }
        };

        // Variables pour les graphiques
        let chartResultats = null;
        let chartCriticite = null;

        // Initialisation au chargement de la page
        document.addEventListener('DOMContentLoaded', function() {
            // Définir la date du jour par défaut
            document.getElementById('dateControle').valueAsDate = new Date();
            
            // Initialiser les graphiques
            initialiserGraphiques();
            
            // Charger les contrôles sauvegardés
            chargerControlesSauvegardes();
        });

        // Afficher les points de contrôle selon les périmètres sélectionnés
        function afficherPointsControle() {
            const container = document.getElementById('pointsControleContainer');
            const alertePerimetre = document.getElementById('alertePerimetre');
            const perimetreSelect = document.getElementById('perimetre');
            const perimetresSelectionnes = Array.from(perimetreSelect.selectedOptions).map(option => option.value);
            
            // Si aucun périmètre n'est sélectionné
            if (perimetresSelectionnes.length === 0) {
                container.innerHTML = '';
                alertePerimetre.style.display = 'block';
                controleLCBFT.perimetre = [];
                controleLCBFT.pointsControle = [];
                mettreAJourStatistiques();
                mettreAJourGraphiques();
                return;
            }
            
            alertePerimetre.style.display = 'none';
            container.innerHTML = '';
            
            // Mettre à jour le périmètre du contrôle
            controleLCBFT.perimetre = perimetresSelectionnes;
            
            // Construire la liste des points de contrôle
            let tousLesPoints = [];
            perimetresSelectionnes.forEach(perimetre => {
                if (pointsControleParPerimetre[perimetre]) {
                    tousLesPoints = tousLesPoints.concat(
                        pointsControleParPerimetre[perimetre].map(p => ({
                            ...p,
                            perimetre: perimetre
                        }))
                    );
                }
            });
            
            // Restaurer les statuts existants si on modifie un contrôle
            tousLesPoints.forEach(point => {
                const pointExistant = controleLCBFT.pointsControle.find(p => p.code === point.code);
                if (pointExistant) {
                    point.statut = pointExistant.statut;
                }
            });
            
            controleLCBFT.pointsControle = tousLesPoints;
            
            // Afficher par périmètre
            perimetresSelectionnes.forEach(perimetre => {
                const pointsDuPerimetre = tousLesPoints.filter(p => p.perimetre === perimetre);
                
                if (pointsDuPerimetre.length > 0) {
                    const perimetreDiv = document.createElement('div');
                    perimetreDiv.className = 'perimetre-section';
                    perimetreDiv.innerHTML = `<h3>📍 ${perimetre} (${pointsDuPerimetre.length} points)</h3>`;
                    
                    pointsDuPerimetre.forEach(point => {
                        const index = tousLesPoints.findIndex(p => p.code === point.code);
                        const pointDiv = document.createElement('div');
                        pointDiv.className = 'point-controle';
                        pointDiv.innerHTML = `
                            <h4>${point.code} - ${point.titre}</h4>
                            <p>${point.description}</p>
                            <div class="statut-buttons">
                                <button class="conforme ${point.statut === 'Conforme' ? 'active' : ''}" 
                                        onclick="changerStatut(${index}, 'Conforme')">
                                    ✅ Conforme
                                </button>
                                <button class="ecart-mineur ${point.statut === 'Écart Mineur' ? 'active' : ''}" 
                                        onclick="changerStatut(${index}, 'Écart Mineur')">
                                    ⚠️ Mineur
                                </button>
                                <button class="ecart-majeur ${point.statut === 'Écart Majeur' ? 'active' : ''}" 
                                        onclick="changerStatut(${index}, 'Écart Majeur')">
                                    🔶 Majeur
                                </button>
                                <button class="ecart-critique ${point.statut === 'Écart Critique' ? 'active' : ''}" 
                                        onclick="changerStatut(${index}, 'Écart Critique')">
                                    🚨 Critique
                                </button>
                                <button class="na ${point.statut === 'N/A' ? 'active' : ''}" 
                                        onclick="changerStatut(${index}, 'N/A')">
                                    ➖ N/A
                                </button>
                            </div>
                        `;
                        perimetreDiv.appendChild(pointDiv);
                    });
                    
                    container.appendChild(perimetreDiv);
                }
            });
            
            // Mettre à jour les statistiques
            mettreAJourStatistiques();
            mettreAJourGraphiques();
        }

        // Changer le statut d'un point de contrôle
        function changerStatut(index, statut) {
            controleLCBFT.pointsControle[index].statut = statut;
            afficherPointsControle();
        }

        // Mettre à jour les statistiques
        function mettreAJourStatistiques() {
            const stats = {
                conformes: 0,
                ecartsMineurs: 0,
                ecartsMajeurs: 0,
                ecartsCritiques: 0,
                na: 0,
                total: 0
            };
            
            controleLCBFT.pointsControle.forEach(point => {
                if (point.statut) {
                    stats.total++;
                    switch(point.statut) {
                        case 'Conforme':
                            stats.conformes++;
                            break;
                        case 'Écart Mineur':
                            stats.ecartsMineurs++;
                            break;
                        case 'Écart Majeur':
                            stats.ecartsMajeurs++;
                            break;
                        case 'Écart Critique':
                            stats.ecartsCritiques++;
                            break;
                        case 'N/A':
                            stats.na++;
                            break;
                    }
                }
            });
            
            controleLCBFT.resultats = stats;
            
            // Mettre à jour l'affichage
            document.getElementById('totalPoints').textContent = stats.total;
            document.getElementById('pointsConformes').textContent = stats.conformes;
            document.getElementById('pointsMineurs').textContent = stats.ecartsMineurs;
            document.getElementById('pointsMajeurs').textContent = stats.ecartsMajeurs;
            document.getElementById('pointsCritiques').textContent = stats.ecartsCritiques;
        }

        // Initialiser les graphiques
        function initialiserGraphiques() {
            const ctxResultats = document.getElementById('chartResultats').getContext('2d');
            chartResultats = new Chart(ctxResultats, {
                type: 'doughnut',
                data: {
                    labels: ['Conformes', 'Écarts Mineurs', 'Écarts Majeurs', 'Écarts Critiques', 'N/A'],
                    datasets: [{
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444', '#6b7280']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Répartition des Résultats'
                        }
                    }
                }
            });
            
            const ctxCriticite = document.getElementById('chartCriticite').getContext('2d');
            chartCriticite = new Chart(ctxCriticite, {
                type: 'bar',
                data: {
                    labels: ['Conformes', 'Mineurs', 'Majeurs', 'Critiques', 'N/A'],
                    datasets: [{
                        label: 'Nombre de points',
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(249, 115, 22, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(107, 114, 128, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            },
                            title: {
                                display: true,
                                text: 'Nombre de points'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Répartition par Niveau de Criticité'
                        }
                    }
                }
            });
        }

        // Mettre à jour les graphiques
        function mettreAJourGraphiques() {
            if (chartResultats && chartCriticite) {
                chartResultats.data.datasets[0].data = [
                    controleLCBFT.resultats.conformes,
                    controleLCBFT.resultats.ecartsMineurs,
                    controleLCBFT.resultats.ecartsMajeurs,
                    controleLCBFT.resultats.ecartsCritiques,
                    controleLCBFT.resultats.na
                ];
                chartResultats.update();
                
                chartCriticite.data.datasets[0].data = [
                    controleLCBFT.resultats.conformes,
                    controleLCBFT.resultats.ecartsMineurs,
                    controleLCBFT.resultats.ecartsMajeurs,
                    controleLCBFT.resultats.ecartsCritiques,
                    controleLCBFT.resultats.na
                ];
                chartCriticite.update();
            }
        }

        // Valider le formulaire
        function validerFormulaire() {
            let isValid = true;
            const champsRequis = ['reference', 'dateControle', 'controleur', 'entite', 'periodeControle'];
            
            // Réinitialiser les erreurs
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            // Vérifier les champs requis
            champsRequis.forEach(champ => {
                const input = document.getElementById(champ);
                if (!input.value.trim()) {
                    input.closest('.form-group').classList.add('error');
                    isValid = false;
                }
            });
            
            // Vérifier le périmètre
            const perimetre = document.getElementById('perimetre');
            const selectedOptions = Array.from(perimetre.selectedOptions);
            if (selectedOptions.length === 0) {
                perimetre.closest('.form-group').classList.add('error');
                isValid = false;
            }
            
            if (!isValid) {
                alert('❌ Veuillez remplir tous les champs obligatoires marqués d\'un astérisque (*)');
            }
            
            return isValid;
        }

        // Sauvegarder le contrôle
        function sauvegarderControle() {
            if (!validerFormulaire()) {
                return;
            }
            
            // Récupérer les données du formulaire
            controleLCBFT.reference = document.getElementById('reference').value;
            controleLCBFT.dateControle = document.getElementById('dateControle').value;
            controleLCBFT.controleur = document.getElementById('controleur').value;
            controleLCBFT.entite = document.getElementById('entite').value;
            controleLCBFT.periodeControle = document.getElementById('periodeControle').value;
            
            // Générer un ID unique si nouveau contrôle
            if (!controleLCBFT.id) {
                controleLCBFT.id = Date.now();
            }
            
            // Récupérer les sauvegardes existantes
            let sauvegardes = JSON.parse(localStorage.getItem('controlesLCBFT')) || [];
            
            // Vérifier si c'est une mise à jour ou un nouveau contrôle
            const index = sauvegardes.findIndex(c => c.id === controleLCBFT.id);
            if (index !== -1) {
                sauvegardes[index] = { ...controleLCBFT };
                alert('✅ Contrôle mis à jour avec succès !');
            } else {
                sauvegardes.push({ ...controleLCBFT });
                alert('✅ Contrôle sauvegardé avec succès !');
            }
            
            // Sauvegarder dans le localStorage
            localStorage.setItem('controlesLCBFT', JSON.stringify(sauvegardes));
            
            // Actualiser l'affichage
            chargerControlesSauvegardes();
        }

        // Réinitialiser le formulaire
        function reinitialiserFormulaire() {
            if (confirm('⚠️ Voulez-vous vraiment réinitialiser le formulaire ? Toutes les données non sauvegardées seront perdues.')) {
                // Réinitialiser l'objet de contrôle
                controleLCBFT = {
                    id: null,
                    reference: '',
                    dateControle: '',
                    controleur: '',
                    perimetre: [],
                    entite: '',
                    periodeControle: '',
                    pointsControle: [],
                    resultats: {
                        conformes: 0,
                        ecartsMineurs: 0,
                        ecartsMajeurs: 0,
                        ecartsCritiques: 0,
                        na: 0
                    }
                };
                
                // Réinitialiser les champs du formulaire
                document.getElementById('reference').value = '';
                document.getElementById('dateControle').valueAsDate = new Date();
                document.getElementById('controleur').value = '';
                document.getElementById('perimetre').selectedIndex = -1;
                document.getElementById('entite').value = '';
                document.getElementById('periodeControle').value = '';
                
                // Réinitialiser les erreurs
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error');
                });
                
                // Réafficher les points de contrôle
                afficherPointsControle();
                
                alert('✅ Formulaire réinitialisé avec succès !');
            }
        }

        // Charger les contrôles sauvegardés
        function chargerControlesSauvegardes() {
            const sauvegardes = JSON.parse(localStorage.getItem('controlesLCBFT')) || [];
            if (sauvegardes.length > 0) {
                document.getElementById('sectionControlesSauvegardes').style.display = 'block';
                afficherControlesSauvegardes();
            }
        }

        // Afficher les contrôles sauvegardés
        function afficherControlesSauvegardes() {
            const tbody = document.querySelector('#tableauControlesSauvegardes tbody');
            tbody.innerHTML = '';
            
            const sauvegardes = JSON.parse(localStorage.getItem('controlesLCBFT')) || [];
            
            if (sauvegardes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucun contrôle sauvegardé</td></tr>';
                return;
            }
            
            // Appliquer les filtres
            const filtre = document.getElementById('filtreControles').value;
            const recherche = document.getElementById('rechercheControles').value.toLowerCase();
            
            const controlesFiltres = sauvegardes.filter(controle => {
                // Filtrer par conformité
                if (filtre !== 'all') {
                    const total = controle.pointsControle.filter(p => p.statut && p.statut !== 'N/A').length;
                    const pourcentage = total > 0 ? 
                        Math.round((controle.resultats.conformes / total) * 100) : 0;
                        
                    if (filtre === 'conforme' && pourcentage < 95) return false;
                    if (filtre === 'mineur' && (pourcentage < 85 || pourcentage >= 95)) return false;
                    if (filtre === 'majeur' && (pourcentage < 75 || pourcentage >= 85)) return false;
                    if (filtre === 'critique' && pourcentage >= 75) return false;
                }
                
                // Filtrer par recherche
                if (recherche && !controle.reference.toLowerCase().includes(recherche)) {
                    return false;
                }
                
                return true;
            });
            
            // Afficher les résultats
            if (controlesFiltres.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucun résultat trouvé</td></tr>';
                return;
            }
            
            controlesFiltres.forEach(controle => {
                const total = controle.pointsControle.filter(p => p.statut && p.statut !== 'N/A').length;
                const pourcentage = total > 0 ? 
                    Math.round((controle.resultats.conformes / total) * 100) : 0;
                
                let statutClass = 'status-conforme';
                let statutText = 'Conforme';
                
                if (pourcentage < 95 && pourcentage >= 85) {
                    statutClass = 'status-mineur';
                    statutText = 'À améliorer';
                } else if (pourcentage < 85 && pourcentage >= 75) {
                    statutClass = 'status-majeur';
                    statutText = 'À traiter';
                } else if (pourcentage < 75) {
                    statutClass = 'status-critique';
                    statutText = 'Urgent';
                }
                
                const perimetresStr = Array.isArray(controle.perimetre) ? controle.perimetre.join(', ') : controle.perimetre;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${controle.reference}</strong></td>
                    <td>${formaterDate(controle.dateControle)}</td>
                    <td>${controle.controleur}</td>
                    <td>${perimetresStr}</td>
                    <td><span class="status-badge ${statutClass}">${statutText} (${pourcentage}%)</span></td>
                    <td class="no-print">
                        <button class="btn btn-modifier" onclick="modifierControle(${controle.id})">📝 Modifier</button>
                        <button class="btn btn-supprimer" onclick="supprimerControle(${controle.id})">🗑️ Supprimer</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Modifier un contrôle sauvegardé
        function modifierControle(id) {
            const sauvegardes = JSON.parse(localStorage.getItem('controlesLCBFT')) || [];
            const controle = sauvegardes.find(c => c.id === id);
            
            if (controle) {
                // Mettre à jour le contrôle courant
                controleLCBFT = JSON.parse(JSON.stringify(controle));
                
                // Mettre à jour l'interface
                document.getElementById('reference').value = controle.reference;
                document.getElementById('dateControle').value = controle.dateControle;
                document.getElementById('controleur').value = controle.controleur;
                
                // Sélectionner les périmètres
                const perimetreSelect = document.getElementById('perimetre');
                Array.from(perimetreSelect.options).forEach(option => {
                    option.selected = controle.perimetre.includes(option.value);
                });
                
                document.getElementById('entite').value = controle.entite;
                document.getElementById('periodeControle').value = controle.periodeControle;
                
                // Réafficher les points de contrôle avec les statuts
                afficherPointsControle();
                
                // Faire défiler vers le haut
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                alert('✅ Contrôle chargé avec succès ! Vous pouvez maintenant le modifier.');
            }
        }

        // Supprimer un contrôle sauvegardé
        function supprimerControle(id) {
            if (confirm('⚠️ Voulez-vous vraiment supprimer ce contrôle ? Cette action est irréversible.')) {
                const sauvegardes = JSON.parse(localStorage.getItem('controlesLCBFT')) || [];
                const nouvellesSauvegardes = sauvegardes.filter(controle => controle.id !== id);
                localStorage.setItem('controlesLCBFT', JSON.stringify(nouvellesSauvegardes));
                
                afficherControlesSauvegardes();
                
                // Masquer la section si plus de contrôles
                if (nouvellesSauvegardes.length === 0) {
                    document.getElementById('sectionControlesSauvegardes').style.display = 'none';
                }
                
                alert('✅ Contrôle supprimé avec succès !');
            }
        }

        // Afficher les contrôles sauvegardés dans un modal
        function afficherControlesSauvegardesModal() {
            const section = document.getElementById('sectionControlesSauvegardes');
            if (section.style.display === 'none') {
                section.style.display = 'block';
                section.scrollIntoView({ behavior: 'smooth' });
            } else {
                section.style.display = 'none';
            }
        }

        // Formater une date
        function formaterDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR');
        }

        // Générer un PDF
        function genererPDF() {
            if (!validerFormulaire()) {
                return;
            }
            
            alert('📄 Génération du PDF en cours...');
            window.print();
        }