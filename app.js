/**
 * ============================================================
 * GESTIONNAIRE ÉTUDIANTS — app.js
 * Auteur  : Groupe jQuery — Examen Final
 * Librairie : jQuery 3.7.1
 * ============================================================
 *
 * Structure des données (LocalStorage) :
 *  clé : "etudiants"
 
 * ============================================================
 */

$(document).ready(function () {

  /* ──────────────────────────────────────────────────────────
     0. CONSTANTES & ÉTAT
  ────────────────────────────────────────────────────────── */
  const LS_KEY = "etudiants";     // Clé LocalStorage
  let indexAModifier = null;      // Index de l'étudiant en cours de modification

  /* ──────────────────────────────────────────────────────────
     1. UTILITAIRES LocalStorage
  ────────────────────────────────────────────────────────── */

  /**
   * Récupère le tableau d'étudiants depuis LocalStorage.
   * @returns {Array} tableau d'objets étudiants
   */
  function lireEtudiants() {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Sauvegarde le tableau d'étudiants dans LocalStorage.
   * @param {Array} tableau - tableau d'objets étudiants
   */
  function sauvegarderEtudiants(tableau) {
    localStorage.setItem(LS_KEY, JSON.stringify(tableau));
  }

  /* ──────────────────────────────────────────────────────────
     2. UTILITAIRES DIVERS
  ────────────────────────────────────────────────────────── */

  /**
   * Retourne la date du jour au format JJ/MM/AAAA.
   * @returns {string}
   */
  function dateAujourdhui() {
    const d = new Date();
    const j  = String(d.getDate()).padStart(2, "0");
    const m  = String(d.getMonth() + 1).padStart(2, "0");
    const a  = d.getFullYear();
    return `${j}/${m}/${a}`;
  }

  /**
   * Détermine la classe CSS de couleur selon la note.
   * Rouge  < 10
   * Orange entre 10 et 14
   * Vert   >= 15
   * @param {number} note
   * @returns {string} nom de la classe CSS
   */
  function classeNote(note) {
    if (note < 10)  return "note-rouge";
    if (note < 15)  return "note-orange";
    return "note-vert";
  }

  /**
   * Affiche un toast (notification temporaire).
   * @param {string} message - texte à afficher
   * @param {string} type    - "success" | "error" | "info"
   */
  function afficherToast(message, type = "info") {
    const $toast = $("#toast");
    $toast
      .removeClass("toast-success toast-error toast-info")
      .addClass(`toast-${type}`)
      .text(message)
      .fadeIn(250);

    // Disparaît automatiquement après 2,8 secondes
    setTimeout(() => $toast.fadeOut(300), 2800);
  }

  /**
   * Affiche ou masque le message de liste vide.
   * @param {boolean} estVide
   */
  function gererListeVide(estVide) {
    if (estVide) {
      $("#liste-vide").show();
      $(".table-wrapper table thead").hide();
    } else {
      $("#liste-vide").hide();
      $(".table-wrapper table thead").show();
    }
  }

  /* ──────────────────────────────────────────────────────────
     3. STATISTIQUES RAPIDES
  ────────────────────────────────────────────────────────── */


  function mettreAJourStats() {
    const etudiants = lireEtudiants();
    const total  = etudiants.length;
    const verts  = etudiants.filter(e => e.note >= 15).length;
    const oranges = etudiants.filter(e => e.note >= 10 && e.note < 15).length;
    const rouges = etudiants.filter(e => e.note < 10).length;

    if (total === 0) {
      $("#stats").empty();
      return;
    }

    const html = `
      <span class="stat-chip chip-total"> TOTAL : ${total}</span>
      <span class="stat-chip chip-vert"> note ≥ 15 : ${verts}</span>
      <span class="stat-chip chip-orange"> note entre 10-14 : ${oranges}</span>
      <span class="stat-chip chip-rouge"> note &lt; 10 : ${rouges}</span>
    `;
    $("#stats").html(html);
  }

  /* ──────────────────────────────────────────────────────────
     4. AFFICHAGE DE LA LISTE
  ────────────────────────────────────────────────────────── */

  /**
   * Reconstruit entièrement le tableau #liste-etudiants
   * à partir des données LocalStorage.
   */
  function afficherListe() {
    const etudiants = lireEtudiants();
    const $tbody = $("#liste-etudiants");
    $tbody.empty();

    // Liste vide ?
    gererListeVide(etudiants.length === 0);
    mettreAJourStats();

    if (etudiants.length === 0) return;

    // Génération d'une ligne par étudiant
    $.each(etudiants, function (index, etudiant) {
      const classe = classeNote(etudiant.note);

      const $tr = $("<tr>")
        .addClass(classe)
        .attr("data-index", index);   // attribut utile pour la suppression / modif

      $tr.append(
        $("<td>").text(etudiant.nom),
        $("<td>").text(etudiant.note),
        $("<td>").text(etudiant.date),
        $("<td>").addClass("td-actions").html(`
          <button class="btn-modifier" data-index="${index}">Modifier</button>
          <button class="btn-supprimer" data-index="${index}">Supprimer</button>
        `)
      );

      $tbody.append($tr);
    });
  }

  /* ──────────────────────────────────────────────────────────
     5. VALIDATION DU FORMULAIRE
  ────────────────────────────────────────────────────────── */

  /**
   * Vérifie que les champs nom et note sont valides.
   * Affiche le message d'erreur si besoin.
   * @returns {boolean} true si tout est valide
   */
  function validerFormulaire() {
    const nom  = $("#nom").val().trim();
    const note = $("#note").val().trim();
    const $err = $("#erreur");

    // Champ nom vide
    if (nom === "") {
      afficherErreur($err, "Veuillez entrer le nom de l'étudiant.");
      $("#nom").focus();
      return false;
    }

    // Champ note vide
    if (note === "") {
      afficherErreur($err, "Veuillez entrer une note.");
      $("#note").focus();
      return false;
    }

    const noteNum = parseFloat(note);

    // Note non numérique
    if (isNaN(noteNum)) {
      afficherErreur($err, "La note doit être un nombre.");
      $("#note").focus();
      return false;
    }

    // Note hors plage
    if (noteNum < 0 || noteNum > 20) {
      afficherErreur($err, "⚠️ La note doit être comprise entre 0 et 20.");
      $("#note").focus();
      return false;
    }

    // Tout est correct : masquer l'erreur
    $err.hide().text("");
    return true;
  }

  /**
   * Affiche un message dans le paragraphe d'erreur.
   * @param {jQuery} $el  - élément DOM du message
   * @param {string} msg  - message à afficher
   */
  function afficherErreur($el, msg) {
    $el.text(msg).stop(true).hide().fadeIn(200);
  }

  /* ──────────────────────────────────────────────────────────
     6. AJOUT D'UN ÉTUDIANT
  ────────────────────────────────────────────────────────── */

  $("#btn-ajouter").on("click", function () {

    // Validation
    if (!validerFormulaire()) return;

    const nom   = $("#nom").val().trim();
    const note  = parseFloat($("#note").val().trim());
    const date  = dateAujourdhui();

    // Création de l'objet étudiant
    const nouvelEtudiant = {
      id   : Date.now(),   // identifiant unique basé sur le timestamp
      nom  : nom,
      note : note,
      date : date
    };

    // Lecture + ajout + sauvegarde
    const etudiants = lireEtudiants();
    etudiants.push(nouvelEtudiant);
    sauvegarderEtudiants(etudiants);

    // Rafraîchissement de l'affichage
    afficherListe();

    // Réinitialisation du formulaire
    viderChamps();

    afficherToast(`✅ ${nom} a été ajouté(e) !`, "success");
  });

  /* ──────────────────────────────────────────────────────────
     7. VIDER LES CHAMPS
  ────────────────────────────────────────────────────────── */

  /**
   * Vide les champs du formulaire et masque l'erreur.
   */
  function viderChamps() {
    $("#nom").val("").focus();
    $("#note").val("");
    $("#erreur").hide().text("");
  }

  $("#btn-vider").on("click", function () {
    viderChamps();
  });

  /* ──────────────────────────────────────────────────────────
     8. SUPPRESSION D'UN ÉTUDIANT
  ────────────────────────────────────────────────────────── */

  // Délégation sur le tbody (les boutons sont créés dynamiquement)
  $("#liste-etudiants").on("click", ".btn-supprimer", function () {
    const index = parseInt($(this).attr("data-index"));
    const etudiants = lireEtudiants();

    const nomSupprime = etudiants[index].nom;

    // Suppression dans le tableau
    etudiants.splice(index, 1);
    sauvegarderEtudiants(etudiants);

    // Rafraîchissement
    afficherListe();
    afficherToast(`${nomSupprime} a été supprimé(e).`, "error");
  });

  /* ──────────────────────────────────────────────────────────
     9. MODIFICATION DE LA NOTE (via modal)
  ────────────────────────────────────────────────────────── */

  // Ouverture de la modal
  $("#liste-etudiants").on("click", ".btn-modifier", function () {
    indexAModifier = parseInt($(this).attr("data-index"));
    const etudiants = lireEtudiants();
    const etudiant  = etudiants[indexAModifier];

    // Pré-remplissage de la modal
    $("#modal-nom-etudiant").text(`Étudiant : ${etudiant.nom}`);
    $("#modal-note").val(etudiant.note);
    $("#modal-erreur").hide().text("");

    // Affichage de la modal
    $("#modal-overlay").fadeIn(200);
    $("#modal-note").focus();
  });

  // Confirmation de la modification
  $("#modal-confirmer").on("click", function () {
    const nouvelleNote = parseFloat($("#modal-note").val().trim());
    const $errModal    = $("#modal-erreur");

    // Validation de la nouvelle note
    if (isNaN(nouvelleNote) || nouvelleNote < 0 || nouvelleNote > 20) {
      afficherErreur($errModal, "Note invalide : entrez un nombre entre 0 et 20.");
      return;
    }

    // Mise à jour dans le tableau
    const etudiants = lireEtudiants();
    const ancienneNote = etudiants[indexAModifier].note;
    etudiants[indexAModifier].note = nouvelleNote;
    sauvegarderEtudiants(etudiants);

    // Fermeture de la modal + rafraîchissement
    fermerModal();
    afficherListe();
    afficherToast(
      `✏️ Note modifiée : ${ancienneNote} → ${nouvelleNote}`,
      "info"
    );
  });

  // Annulation
  $("#modal-annuler").on("click", fermerModal);

  // Fermeture en cliquant sur l'overlay (fond)
  $("#modal-overlay").on("click", function (e) {
    if ($(e.target).is("#modal-overlay")) fermerModal();
  });

  // Fermeture avec la touche Echap
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") fermerModal();
  });

  /**
   * Ferme et réinitialise la modal.
   */
  function fermerModal() {
    $("#modal-overlay").fadeOut(200);
    indexAModifier = null;
    $("#modal-note").val("");
    $("#modal-erreur").hide().text("");
  }

  /* ──────────────────────────────────────────────────────────
     10. TOUT EFFACER
  ────────────────────────────────────────────────────────── */

  $("#btn-effacer-tout").on("click", function () {
    const etudiants = lireEtudiants();

    if (etudiants.length === 0) {
      afficherToast(" La liste est déjà vide.", "info");
      return;
    }

    // Confirmation avant suppression totale
    if (!confirm("⚠️ Êtes-vous sûr(e) de vouloir supprimer tous les étudiants ?")) return;

    localStorage.removeItem(LS_KEY);
    afficherListe();
    afficherToast("Toute la liste a été effacée.", "error");
  });

  /* ──────────────────────────────────────────────────────────
     11. SOUMISSION VIA TOUCHE ENTRÉE
  ────────────────────────────────────────────────────────── */

  // Permet d'ajouter un étudiant en appuyant sur Entrée dans les champs
  $("#nom, #note").on("keypress", function (e) {
    if (e.key === "Enter") $("#btn-ajouter").trigger("click");
  });

  // Confirmation dans la modal avec Entrée
  $("#modal-note").on("keypress", function (e) {
    if (e.key === "Enter") $("#modal-confirmer").trigger("click");
  });

  /* ──────────────────────────────────────────────────────────
     12. INITIALISATION AU CHARGEMENT DE LA PAGE
  ────────────────────────────────────────────────────────── */

  // Affiche la liste (restaurée depuis LocalStorage si disponible)
  afficherListe();

}); // fin $(document).ready