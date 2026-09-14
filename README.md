# citruscapital.ca

Static site for Citrus Capital, hosted on GitHub Pages. Plain HTML, CSS and JavaScript with no build step.

## Layout

```
index.html                         Home
about-us/  team/  contact-us/  privacy/
accounting-bookkeeping/  advisory/  business-coaching/
signature-advisory/  signature-advisory-application/
404.html                           Custom not-found page
financial-support/ services/ draft/ capital/ hello-world/
                                   Redirect stubs for retired WordPress URLs
assets/css/site.css                All styles
assets/js/config.js                HubSpot and analytics IDs (edit this)
assets/js/nav.js                   Menu, hero video, cookie notice, GA4 loader
assets/js/forms.js                 Form submission to HubSpot
assets/img/  assets/video/         Optimised media
sitemap.xml  robots.txt  .nojekyll
```

Every page carries the same header and footer between the `<!-- HEADER -->` and `<!-- FOOTER -->` comment markers. To change the menu or footer, edit one page and copy the block to the others.

Links inside pages are relative (`../contact-us/`) so the site works at `https://<user>.github.io/citruscapital.ca/` for staging as well as at the custom domain. Canonical URLs, Open Graph tags and the sitemap use the production domain.

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## HubSpot forms

Open `assets/js/config.js` and fill in the portal ID and the two form GUIDs. Until they are set, both forms fall back to opening the visitor's email app with the message pre-filled, so nothing is lost.

Create two forms in HubSpot (Marketing → Forms → Create form → Embedded form). Field internal names must match exactly. Fields marked *custom* are new contact properties HubSpot will create when you add them to the form.

**Contact form** (`hubspotForms.contact`)

| Field | Internal name | Type |
|---|---|---|
| First name | `firstname` | Single-line text |
| Last name | `lastname` | Single-line text |
| Email | `email` | Email |
| Subject | `subject` | Single-line text (custom) |
| Message | `message` | Multi-line text |

**Signature Advisory application** (`hubspotForms.application`)

| Field | Internal name | Type |
|---|---|---|
| First name | `firstname` | Single-line text |
| Last name | `lastname` | Single-line text |
| Email | `email` | Email |
| Phone | `phone` | Phone |
| Business name | `company` | Single-line text |
| Industry | `business_industry` | Single-line text (custom; the default `industry` property is a fixed dropdown) |
| Years in business | `years_in_business` | Single-line text (custom) |
| Annual revenue | `annual_revenue_range` | Dropdown (custom): Under $500K, $500K – $1M, $1M – $5M, $5M – $10M, Over $10M, Prefer not to say |
| Primary challenge | `primary_challenge` | Multi-line text (custom) |
| 12-month goals | `goals_12_months` | Multi-line text (custom) |
| Six-month engagement | `open_to_six_month_engagement` | Dropdown (custom): Yes, No, I need more information first |
| How did you hear | `how_did_you_hear` | Dropdown (custom): Referral, LinkedIn, Website search, Social media, Other |
| Additional notes | `additional_notes` | Multi-line text (custom) |

Submissions post to `https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`. Set up email notifications on each form in HubSpot (Options → Send submission email notifications to).

Spam protection: a hidden honeypot field and a minimum fill time of 2.5 seconds. HubSpot applies its own filtering as well.

## Analytics

Set `gaId` in `assets/js/config.js` to a GA4 measurement ID. The tag loads only when an ID is present, and the cookie notice appears only then.

## Hero video

`assets/video/hero.webm` is the original 4 MB file from the WordPress site. It is loaded only on screens 768 px and wider, after the page has finished loading, and never for visitors who prefer reduced motion or have data saver on. Phones get the poster image. Re-encoding it to under 1 MB is worth doing when ffmpeg is available:

```
ffmpeg -i hero.webm -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 600k -an -t 20 hero-small.webm
```

## Deploying

1. Push to `main`. In the repository settings, under Pages, set Source to "Deploy from a branch", branch `main`, folder `/ (root)`.
2. Staging URL: `https://<user>.github.io/citruscapital.ca/`.
3. Go live: add a file named `CNAME` containing `citruscapital.ca`, then at the DNS provider set:
   - `A` records for `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` record for `www` → `<user>.github.io`
   - Leave MX records untouched (email is unaffected).
4. In GitHub Pages settings enter the custom domain, wait for the certificate, then tick "Enforce HTTPS".
5. Submit `https://citruscapital.ca/sitemap.xml` in Google Search Console.
