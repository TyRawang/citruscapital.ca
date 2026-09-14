/* Site configuration. Fill in the HubSpot and analytics IDs when ready.
   Nothing else on the site needs to change. */
window.CITRUS = {
  // HubSpot portal (account) ID, e.g. "12345678"
  hubspotPortalId: "",
  // HubSpot form GUIDs, one per form
  hubspotForms: {
    contact: "",       // Contact page: firstname, lastname, email, subject, message
    application: ""    // Signature Advisory application (see README for the field list)
  },
  // Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX". Leave empty to disable.
  gaId: ""
};
