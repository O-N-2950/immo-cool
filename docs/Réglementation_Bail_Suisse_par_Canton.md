# RÃ©glementation cantonale suisse des baux immobiliers â€” Guide complet pour plateforme automatisÃ©e

## 1. Cadre juridique fÃ©dÃ©ral (socle commun)

Le droit du bail en Suisse repose principalement sur le **Code des obligations (CO), art. 253 Ã  274g**, complÃ©tÃ© par l'**Ordonnance sur le bail Ã  loyer et le bail Ã  ferme d'habitations et de locaux commerciaux (OBLF)**. Ce cadre fÃ©dÃ©ral s'applique uniformÃ©ment Ã  tous les cantons, mais chaque canton dispose de **prÃ©rogatives rÃ©glementaires** spÃ©cifiques qui viennent complÃ©ter ou renforcer ce socle.[^1][^2]

Les principales dispositions fÃ©dÃ©rales impÃ©ratives sont :
- DÃ©lai de rÃ©siliation minimum de 3 mois pour les logements (art. 266c CO)[^3][^4]
- DÃ©lai de rÃ©siliation minimum de 6 mois pour les locaux commerciaux[^3]
- DÃ©lai de rÃ©siliation minimum de 2 semaines (min. 1 mois) pour garages, places de parc, chambres meublÃ©es[^3]
- Protection contre les loyers abusifs (art. 269-270e CO)[^5]
- Protection contre les congÃ©s abusifs (art. 271-273c CO)[^6]
- Formule officielle obligatoire pour la rÃ©siliation par le bailleur (art. 266l CO)[^7]
- Formule officielle de hausse de loyer (art. 269d CO)[^5]

***

## 2. Formulaires officiels obligatoires par canton

### 2.1 Formulaire de fixation du loyer initial (art. 270 al. 2 CO)

L'obligation d'utiliser un formulaire officiel pour communiquer le loyer initial au nouveau locataire **dÃ©pend des cantons ayant dÃ©clarÃ© une pÃ©nurie de logements**. Voici la liste complÃ¨te des cantons concernÃ©s :[^8][^9]

| Canton | Obligation formulaire loyer initial | PÃ©rimÃ¨tre |
|--------|-------------------------------------|-----------|
| **BÃ¢le-Ville (BS)** | âœ… Obligatoire | Tout le canton |
| **Berne (BE)** | âœ… Obligatoire depuis le 1er dÃ©cembre 2025 | Tout le canton[^10] |
| **Fribourg (FR)** | âœ… Obligatoire | Tout le canton[^9] |
| **GenÃ¨ve (GE)** | âœ… Obligatoire | Tout le canton[^11][^12] |
| **Lucerne (LU)** | âœ… Obligatoire | Tout le canton[^9] |
| **NeuchÃ¢tel (NE)** | âœ… Obligatoire (partiel) | Certains districts[^9][^13] |
| **Vaud (VD)** | âœ… Obligatoire (partiel) | 9 districts sur 10 en pÃ©nurie (seul Aigle Ã©pargnÃ© en 2026)[^14] |
| **Zoug (ZG)** | âœ… Obligatoire | Tout le canton[^9] |
| **Zurich (ZH)** | âœ… Obligatoire | Tout le canton[^9] |
| Tous les autres cantons | âŒ Pas obligatoire | â€” |

**ConsÃ©quence pour la plateforme** : Si le formulaire manque, le loyer peut Ãªtre **contestÃ© et fixÃ© judiciairement**, mÃªme des annÃ©es plus tard. La plateforme doit donc impÃ©rativement gÃ©nÃ©rer ce formulaire automatiquement dans les cantons concernÃ©s.[^15]

### 2.2 Modification OBLF du 1er octobre 2025

Depuis le **1er octobre 2025**, l'art. 19 al. 3 OBLF impose que la formule officielle de loyer initial mentionne obligatoirement :[^16][^17]
- Le **taux hypothÃ©caire de rÃ©fÃ©rence** dÃ©terminant pour l'ancien loyer
- L'**indice suisse des prix Ã  la consommation (ISPC)** dÃ©terminant pour l'ancien loyer
- La date d'entrÃ©e en vigueur du prÃ©cÃ©dent loyer et du nouveau loyer
- Le montant annuel des charges
- La signature du bailleur[^11]

**En cas d'erreur ou d'omission**, le loyer initial peut Ãªtre considÃ©rÃ© comme **nul**. C'est un point critique pour l'automatisation.[^17]

### 2.3 Formulaire de rÃ©siliation par le bailleur (art. 266l al. 2 CO)

La rÃ©siliation par le bailleur **doit toujours** utiliser une **formule officielle agrÃ©Ã©e par le canton**, dans **tous les cantons** sans exception. Ce formulaire doit :[^6][^7]
- Indiquer les voies de droit du locataire (contestation du congÃ©, demande de prolongation)
- ÃŠtre notifiÃ© **sÃ©parÃ©ment** au conjoint/partenaire en cas de logement familial (art. 266n CO)[^18][^7]
- Indiquer les motifs de la rÃ©siliation sur demande (art. 271 al. 2 CO)[^6]

**Important** : La rÃ©siliation par le **locataire** n'a pas besoin de formule officielle, une lettre recommandÃ©e suffit.[^7]

### 2.4 Formulaire de hausse de loyer (art. 269d CO)

Dans **tous les cantons**, toute augmentation de loyer doit Ãªtre notifiÃ©e au moyen d'une **formule agrÃ©Ã©e par le canton**, avec indication des motifs. Les hausses non notifiÃ©es par formulaire sont **nulles de plein droit**.[^19][^5]

***

## 3. Dates de rÃ©siliation officielles par canton

Les dates de rÃ©siliation varient considÃ©rablement d'un canton Ã  l'autre. Si le bail ne stipule pas de dates, ce sont les **usages locaux cantonaux** qui s'appliquent :[^4][^3]

| Canton | Dates de rÃ©siliation officielles |
|--------|----------------------------------|
| **Argovie (AG)** | 1er mars, 30 juin, 30 septembre |
| **Appenzell Rh.-Int. (AI)** | Chaque fin de mois (sauf 31 dÃ©cembre) |
| **Appenzell Rh.-Ext. (AR)** | Chaque fin de mois (sauf 31 dÃ©cembre) |
| **BÃ¢le-Campagne (BL)** | Chaque fin de mois (sauf 31 dÃ©cembre) |
| **BÃ¢le-Ville (BS)** | Chaque fin de mois (sauf 31 dÃ©cembre) |
| **Berne (BE)** | 30 avril, 31 octobre |
| **Fribourg (FR)** | 31 mars, 30 juin, 30 septembre, 31 dÃ©cembre |
| **GenÃ¨ve (GE)** | Pas de dates locales de rÃ©siliation |
| **Glaris (GL)** | Chaque fin de mois |
| **Grisons (GR)** | 31 mars, 30 septembre |
| **Jura (JU)** | 31 mars, 30 juin, 30 septembre, 31 dÃ©cembre |
| **Lucerne (LU)** | Pas de dates locales de rÃ©siliation |
| **NeuchÃ¢tel (NE)** | 31 mars, 30 juin, 30 septembre |
| **Nidwald (NW)** | 31 mars, 30 juin, 30 septembre |
| **Obwald (OW)** | 31 mars, 30 juin, 30 septembre |
| **Schaffhouse (SH)** | Chaque fin de mois (sauf 31 dÃ©cembre) |
| **Schwyz (SZ)** | Chaque fin de mois (sauf 31 dÃ©cembre) |
| **Soleure (SO)** | 31 mars, 30 septembre |
| **Saint-Gall (SG)** | Chaque fin de mois (sauf 31 dÃ©cembre) |
| **Tessin (TI)** | 29 mars, 29 septembre |
| **Thurgovie (TG)** | 31 mars, 30 juin, 30 septembre |
| **Uri (UR)** | Chaque fin de mois (sauf 31 dÃ©cembre) |
| **Vaud (VD)** | 1er janvier, 1er avril, 1er juillet, 1er octobre |
| **Valais (VS)** | Pas de dates locales de rÃ©siliation |
| **Zoug (ZG)** | 31 mars, 30 juin, 30 septembre |
| **Zurich (ZH)** | 31 mars, 30 septembre |

[^3]

**Pour la plateforme** : Le moteur de rÃ¨gles doit intÃ©grer ces dates pour calculer automatiquement les Ã©chÃ©ances de rÃ©siliation valides. Si le bail stipule des dates propres, elles prÃ©valent sur les usages cantonaux.[^3]

***

## 4. Sous-location (art. 262 CO)

### 4.1 RÃ¨gles fÃ©dÃ©rales en vigueur

Le locataire peut sous-louer tout ou partie du bien louÃ© avec le **consentement du bailleur** (art. 262 al. 1 CO). Le bailleur ne peut refuser que dans trois cas :[^20][^21]
1. Le locataire refuse d'indiquer les conditions de la sous-location
2. Les conditions de sous-location sont **abusives** (loyer excessif)
3. La sous-location prÃ©sente des **inconvÃ©nients majeurs** pour le bailleur[^21]

En Suisse romande, l'accord de sous-location doit Ãªtre **Ã©crit**. Le locataire doit mentionner l'identitÃ© du sous-locataire, la durÃ©e prÃ©vue, le loyer de sous-location et l'usage prÃ©vu des locaux.[^21]

### 4.2 Votation du 24 novembre 2024 â€” Modifications rejetÃ©es

Le peuple suisse a **rejetÃ©** le 24 novembre 2024 les deux modifications du droit du bail :[^22][^23]
- **Sous-location** : rejetÃ©e par **51,6%** des votants[^23]
- **RÃ©siliation pour besoin propre** : rejetÃ©e par **53,8%** des votants[^23]

Les modifications prÃ©voyaient notamment la limitation de la sous-location Ã  2 ans maximum et le renforcement des conditions de rÃ©siliation pour besoin propre. **Ces modifications ne sont donc PAS en vigueur.** Le droit actuel reste inchangÃ©.[^24][^25]

### 4.3 Implications pour la plateforme

La plateforme doit :
- GÃ©nÃ©rer un **formulaire de demande de sous-location** au bailleur
- PrÃ©voir la notification du loyer de sous-location, de l'identitÃ© du sous-locataire et de la durÃ©e
- Calculer si le loyer de sous-location est proportionnÃ© (pas de bÃ©nÃ©fice excessif)
- GÃ©rer la **rÃ©siliation spÃ©cifique** en cas de sous-location non autorisÃ©e (prÃ©avis 30 jours aprÃ¨s mise en demeure, art. 257f CO)

***

## 5. Garantie de loyer (cautionnement)

### 5.1 RÃ¨gles fÃ©dÃ©rales (art. 257e CO)

| Aspect | RÃ¨gle |
|--------|-------|
| **Montant maximum** | 3 mois de loyer brut (loyer + charges) pour les habitations[^26][^2] |
| **Locaux commerciaux** | Pas de limite lÃ©gale[^2] |
| **DÃ©pÃ´t** | Compte bancaire bloquÃ© au nom du locataire obligatoirement[^26] |
| **DÃ©lai de dÃ©pÃ´t** | Avant l'entrÃ©e dans les lieux (sauf convention contraire) |
| **LibÃ©ration** | DÃ¨s la fin du bail si aucune crÃ©ance ouverte, sinon accord des deux parties ou dÃ©cision judiciaire[^26] |

### 5.2 SpÃ©cificitÃ© cantonale â€” Canton de Vaud

Le canton de Vaud a sa propre **Loi sur les garanties en matiÃ¨re de baux Ã  loyer (LABLF, RSF 222.3.1)** qui prÃ©voit que pour les baux d'habitation, seul le **cautionnement simple** est admissible (sur demande expresse du locataire), et non le cautionnement solidaire.[^27]

### 5.3 Alternatives â€” Caution de loyer par assurance

Les assurances de garantie de loyer (SwissCaution, SmartCaution, etc.) sont des alternatives lÃ©gales au dÃ©pÃ´t bancaire. Le locataire paie une prime annuelle et l'assurance se porte garante.[^26]

***

## 6. Taux hypothÃ©caire de rÃ©fÃ©rence et fixation du loyer

### 6.1 MÃ©canisme

Le taux d'intÃ©rÃªt hypothÃ©caire de rÃ©fÃ©rence, publiÃ© trimestriellement par l'Office fÃ©dÃ©ral du logement (OFL), sert de base au calcul des loyers dans toute la Suisse. Au **1er septembre 2025**, le taux est de **1,25%** (contre 1,50% prÃ©cÃ©demment).[^28][^29]

Chaque baisse de 0,25% du taux de rÃ©fÃ©rence donne droit en principe Ã  une **rÃ©duction de loyer d'environ 2,91%**, pour autant que le loyer actuel soit basÃ© sur le taux prÃ©cÃ©dent.[^28]

### 6.2 Loyer abusif (art. 269 CO)

Un loyer est considÃ©rÃ© comme abusif lorsqu'il permet au bailleur d'obtenir un **rendement excessif** ou lorsqu'il rÃ©sulte d'un **prix d'achat manifestement exagÃ©rÃ©**. Le rendement admissible des fonds propres correspond au taux hypothÃ©caire de rÃ©fÃ©rence + 0,5%.[^29][^30][^5]

### 6.3 Immeubles anciens vs rÃ©cents

Un immeuble est qualifiÃ© d'**ancien** lorsque sa construction ou sa derniÃ¨re acquisition date de **30 ans ou plus**. Pour les immeubles anciens, la mÃ©thode de calcul du rendement net est souvent impraticable, et les loyers comparatifs du quartier servent de rÃ©fÃ©rence.[^31][^32]

**Pour la plateforme** : IntÃ©grer un calculateur de loyer admissible basÃ© sur le taux de rÃ©fÃ©rence, le type d'immeuble et les charges.

***

## 7. Contestation du loyer

### 7.1 Loyer initial (art. 270 CO)

Le locataire peut contester le loyer initial dans les **30 jours** suivant la rÃ©ception de la chose louÃ©e s'il estime le loyer abusif. Dans les cantons avec formulaire obligatoire, l'absence de formulaire permet une contestation **sans dÃ©lai**.[^15][^5]

### 7.2 Hausse de loyer (art. 270b CO)

Le locataire peut contester une hausse de loyer dans les **30 jours** suivant l'avis de majoration.[^19][^5]

### 7.3 AutoritÃ©s de conciliation

Chaque canton doit disposer d'au moins une **autoritÃ© paritaire de conciliation** (art. 274a CO), composÃ©e de reprÃ©sentants des locataires et des bailleurs. La procÃ©dure est en principe **gratuite**.[^33][^34][^35]

| Canton | Organisation |
|--------|-------------|
| **Vaud** | Commissions prÃ©fectorales de conciliation (par district)[^36] |
| **Fribourg** | 3 commissions (Sarine, Singine-Lac, Districts du Sud) + Tribunal des baux[^34] |
| **GenÃ¨ve** | Tribunal des baux et loyers |
| **NeuchÃ¢tel** | AutoritÃ©s rÃ©gionales[^13] |
| Autres cantons | AutoritÃ©s cantonales, rÃ©gionales ou communales selon organisation cantonale[^33] |

***

## 8. Lois cantonales spÃ©cifiques

### 8.1 GenÃ¨ve â€” LDTR (Loi sur les dÃ©molitions, transformations et rÃ©novations)

La LDTR genevoise est l'une des lÃ©gislations les plus restrictives de Suisse :[^37]
- **Plafonnement des loyers** aprÃ¨s rÃ©novation : maximum **3'528 CHF par piÃ¨ce par an** (la cuisine compte comme une piÃ¨ce)[^38]
- Toute rÃ©novation, transformation ou changement d'affectation nÃ©cessite une **autorisation de construire**[^37]
- Des sanctions administratives allant jusqu'Ã  **150'000 CHF** sont prÃ©vues en cas de non-respect[^37]
- Logements subventionnÃ©s (HBM, HLM, HM) avec contrÃ´le Ã©tatique des loyers[^39]

### 8.2 Vaud â€” LPPPL et RULV

Le canton de Vaud dispose de deux instruments clÃ©s :[^1]

**LPPPL (Loi sur la prÃ©servation et la promotion du parc locatif)** :
- S'applique aux districts en pÃ©nurie de logement (taux de vacance < 1,5% sur 3 ans)[^37]
- En 2026, 9 districts sur 10 sont concernÃ©s (seul Aigle est Ã©pargnÃ©)[^14]
- Impose le formulaire officiel de bail et permet aux communes un droit de prÃ©emption[^14]

**RULV (RÃ¨gles et usages locatifs du canton de Vaud)** :
- Force obligatoire prolongÃ©e jusqu'au **30 juin 2026**[^1]
- Imposent notamment l'**Ã©tat des lieux d'entrÃ©e obligatoire** (art. 1 RULV)[^40][^41]
- Les frais d'Ã©tablissement du bail sont Ã  la **charge du bailleur** (art. 8 lit. a RULV)[^42]
- RÃ¨gles dÃ©taillÃ©es pour la restitution du logement (art. 37 RULV)[^43]

### 8.3 Contrat-cadre romand (CCR)

Le CCR a perdu sa **force obligatoire gÃ©nÃ©rale le 30 juin 2020**. Pour les baux conclus aprÃ¨s cette date, il n'est applicable que s'il est **expressÃ©ment intÃ©grÃ©** dans le contrat par rÃ©fÃ©rence. Il couvrait historiquement les cantons de Fribourg, GenÃ¨ve, Jura, NeuchÃ¢tel, Vaud et les districts francophones du Valais.[^44][^45][^46]

**Pour la plateforme** : Le systÃ¨me doit proposer optionnellement l'intÃ©gration du CCR par clause contractuelle, surtout pour les cantons romands.

***

## 9. Protection du logement familial (art. 169 CC / 266m-266n CO)

Un Ã©poux ne peut, **sans le consentement exprÃ¨s** de son conjoint :[^47][^18]
- RÃ©silier le bail du logement familial
- AliÃ©ner la maison ou l'appartement familial
- Restreindre les droits dont dÃ©pend le logement de la famille

La rÃ©siliation par le **bailleur** doit Ãªtre **notifiÃ©e sÃ©parÃ©ment** au locataire ET Ã  son conjoint/partenaire enregistrÃ© (art. 266n CO). Ã€ dÃ©faut, la rÃ©siliation est **nulle**.[^7]

**Pour la plateforme** : Tout formulaire de rÃ©siliation doit comporter un champ pour vÃ©rifier si le logement est un logement familial et, le cas Ã©chÃ©ant, gÃ©nÃ©rer une double notification.

***

## 10. Ã‰tat des lieux

### 10.1 Ã‰tat des lieux d'entrÃ©e

L'Ã©tat des lieux d'entrÃ©e **n'est pas prÃ©vu** par le CO fÃ©dÃ©ral. C'est le **Contrat-cadre romand** (art. 3 CCR) et les **RULV** (art. 1) qui l'ont rendu **obligatoire** dans les cantons romands :[^41][^40]
- Ã‰tabli avant la prise de domicile
- SignÃ© en deux exemplaires
- Doit mentionner tous les accessoires (mobilier, etc.)
- Si le locataire est absent, le bailleur l'Ã©tablit seul et le communique au locataire[^40]

### 10.2 Ã‰tat des lieux de sortie

PrÃ©vu par l'**art. 267a CO** : le bailleur doit informer le locataire en sa prÃ©sence des dÃ©fauts constatÃ©s. Dans le canton de Vaud, l'art. 37 RULV impose des obligations dÃ©taillÃ©es de restitution.[^41][^43]

***

## 11. Frais accessoires et charges

Les frais accessoires sont rÃ©gis par les art. 257a-257b CO et les art. 4-8 OBLF :[^48]

- Le locataire ne paie les frais accessoires **que si le bail le stipule expressÃ©ment**[^49]
- Les postes de coÃ»ts doivent Ãªtre **dÃ©signÃ©s avec prÃ©cision** dans le bail[^49]
- Exception : la mention Â« frais de chauffage et d'eau chaude Â» suffit (art. 5-6 OBLF)[^49]
- Le bailleur doit Ã©tablir un **dÃ©compte annuel** en cas d'acomptes provisionnels (art. 4 al. 1 OBLF)[^48]
- Le dÃ©compte doit Ãªtre Ã©tabli dans les 6 mois suivant la pÃ©riode, prescrit aprÃ¨s **5 ans**[^49]

Quatre modes de facturation possibles : loyer tout compris, paiement direct Ã  des tiers, forfait, acomptes provisionnels.[^48]

***

## 12. Frais de rÃ©gie et frais interdits

La jurisprudence et les usages cantonaux limitent les frais facturables au locataire :[^50][^51]

| Frais | Facturable au locataire ? |
|-------|---------------------------|
| Frais d'Ã©tablissement du bail | âŒ Non (surtout VD, art. 8 RULV)[^42] |
| Frais de dossier / conclusion | âŒ Non (dÃ©jÃ  couverts par le loyer)[^50] |
| Frais de demande de baisse de loyer | âŒ Non |
| Frais de sous-location | âŒ Non |
| Frais de restitution anticipÃ©e | âŒ Non[^51] |
| Frais de rappel (max recommandÃ©) | âš ï¸ Max 10 CHF par rappel (recommandation ASLOCA)[^51] |

***

## 13. Signature Ã©lectronique des baux

### 13.1 Cadre lÃ©gal suisse

En droit suisse, la plupart des contrats, **y compris les baux Ã  loyer**, peuvent Ãªtre valablement conclus **sans forme particuliÃ¨re** â€” verbalement, par e-mail ou mÃªme par comportement convergent.[^52]

La loi fÃ©dÃ©rale sur la signature Ã©lectronique (SCSE) reconnaÃ®t trois niveaux :[^53][^52]

| Niveau | Ã‰quivalence | Usage bail |
|--------|-------------|------------|
| **Simple** (clic, scan) | Valeur probante rÃ©duite | DÃ©conseillÃ© |
| **AvancÃ©e** (certificat nominatif) | Fiable juridiquement | âœ… RecommandÃ© pour les baux[^54] |
| **QualifiÃ©e** (certificat reconnu + dispositif sÃ©curisÃ©) | Ã‰quivalente Ã  la signature manuscrite (art. 14 al. 2bis CO)[^52][^53] | âœ… Optimal |

**Attention** : Pour les **formulaires officiels** (rÃ©siliation par le bailleur, hausse de loyer, loyer initial), certaines communes n'acceptent pas encore les baux numÃ©riques pour l'inscription au contrÃ´le des habitants. La plateforme doit donc prÃ©voir une option d'impression.[^54]

### 13.2 Pratiques du marchÃ©

Des acteurs comme **Flatfox + Skribble** (pour Verit Immobilier) et **Wincasa** proposent dÃ©jÃ  des processus de bail entiÃ¨rement numÃ©riques avec signature Ã©lectronique avancÃ©e.[^55][^54]

***

## 14. Protection des donnÃ©es (nLPD)

### 14.1 Obligations pour la plateforme

Depuis l'entrÃ©e en vigueur de la nouvelle LPD (1er septembre 2023), les obligations suivantes s'appliquent :[^56][^57]

- **Transparence** : Informer les locataires (potentiels) de la collecte et du traitement de leurs donnÃ©es
- **ProportionnalitÃ©** : Ne collecter que les donnÃ©es nÃ©cessaires (nom, revenus, extrait du registre des poursuites, etc.)
- **SÃ©curitÃ©** : ProtÃ©ger les donnÃ©es contre les accÃ¨s non autorisÃ©s
- **Droit d'accÃ¨s** : Les personnes concernÃ©es ont un droit d'accÃ¨s Ã  leurs donnÃ©es
- **Sous-traitance** : Si la plateforme traite des donnÃ©es pour le compte de bailleurs, un contrat de sous-traitance (art. 9 nLPD) est nÃ©cessaire[^56]

### 14.2 DonnÃ©es sensibles dans le contexte du bail

Les donnÃ©es suivantes sont particuliÃ¨rement sensibles :[^56]
- Extraits du registre des poursuites
- Attestations de revenus
- Situation familiale
- NationalitÃ© / statut de sÃ©jour

La collecte de ces donnÃ©es doit Ãªtre **proportionnÃ©e** et leur conservation **limitÃ©e dans le temps**. Les donnÃ©es de candidats non retenus doivent Ãªtre **effacÃ©es** une fois le processus terminÃ©.[^58]

***

## 15. Discrimination et sÃ©lection des locataires

Le bailleur privÃ© dispose en principe d'une **libertÃ© de choix** de ses locataires, car le CO ne prÃ©voit pas d'obligation de contracter. Toutefois :[^59][^60]
- L'art. 261bis CP (norme pÃ©nale contre le racisme) interdit les discriminations fondÃ©es sur l'ethnie, la race ou la religion dans les annonces publiques[^60]
- MÃªme en cas de condamnation, le tribunal ne peut pas contraindre le bailleur Ã  louer[^60]
- Pour la sous-location, la nationalitÃ©, l'origine, l'Ã¢ge, le sexe ou la religion du sous-locataire ne sont pas des Â« inconvÃ©nients majeurs Â» au sens de l'art. 262 CO[^59]

**Pour la plateforme** : L'algorithme de mise en relation ne doit pas intÃ©grer de critÃ¨res discriminatoires. Les critÃ¨res objectifs admissibles sont : solvabilitÃ©, taille du mÃ©nage par rapport au logement, usage prÃ©vu (habitation/commercial).

***

## 16. Annonce au contrÃ´le des habitants

Les propriÃ©taires et gÃ©rants d'immeubles ont l'**obligation d'annoncer** au contrÃ´le des habitants chaque entrÃ©e et sortie de locataire. Le locataire lui-mÃªme doit s'annoncer dans les **8 jours** suivant son arrivÃ©e dans la commune.[^61][^62][^63]

La norme **eCH-0112** dÃ©finit l'interface pour l'accomplissement Ã©lectronique de cette obligation :[^63]
- Annonce obligatoire lors de la conclusion, modification (ajout/suppression de locataire) et fin d'un bail
- Annonce distincte pour chaque locataire concernÃ©
- PossibilitÃ© d'annonce Ã©lectronique selon les capacitÃ©s de la commune[^63]

**Pour la plateforme** : IntÃ©grer un module d'annonce automatique au contrÃ´le des habitants, en tenant compte des particularitÃ©s cantonales.

***

## 17. Prolongation du bail (art. 272 ss CO)

| Aspect | Habitation | Commercial |
|--------|-----------|------------|
| **DurÃ©e max. de prolongation** | 4 ans | 6 ans |
| **Nombre de prolongations** | 1 ou 2 | 1 ou 2 |
| **DÃ©lai de saisine** (durÃ©e indÃ©terminÃ©e) | 30 jours aprÃ¨s rÃ©ception du congÃ© | 30 jours |
| **DÃ©lai de saisine** (durÃ©e dÃ©terminÃ©e) | 60 jours avant expiration | 60 jours |

[^64][^65]

La prolongation est accordÃ©e si la fin du bail entraÃ®ne des **consÃ©quences pÃ©nibles** pour le locataire que les intÃ©rÃªts du bailleur ne justifient pas.[^64]

***

## 18. Logements protÃ©gÃ©s et subventionnÃ©s (spÃ©cificitÃ©s cantonales)

### GenÃ¨ve (LGL)

GenÃ¨ve dispose d'un systÃ¨me de logements subventionnÃ©s avec trois catÃ©gories :[^39]
- **HBM** (habitations bon marchÃ©) : revenus trÃ¨s modestes
- **HLM** (habitations Ã  loyer modÃ©rÃ©) : revenus modestes
- **HM** (habitations mixtes) : revenus intermÃ©diaires

L'accÃ¨s est soumis Ã  des conditions strictes (rÃ©sidence Ã  GenÃ¨ve 4 ans minimum sur 8, domicile fiscal cantonal, plafond de revenu). L'Ã‰tat contrÃ´le les loyers pendant la durÃ©e de l'aide.[^66][^37]

**Pour la plateforme** : Ces logements ont des rÃ¨gles spÃ©cifiques de fixation du loyer et de sÃ©lection des locataires. PrÃ©voir un module sÃ©parÃ© ou les exclure du pÃ©rimÃ¨tre initial.

***

## 19. RÃ©sumÃ© des formulaires Ã  gÃ©nÃ©rer automatiquement par canton

| Formulaire | Cantons concernÃ©s | Base lÃ©gale |
|------------|-------------------|-------------|
| **Formule de loyer initial** | BS, BE, FR, GE, LU, NE (partiel), VD (partiel), ZG, ZH | Art. 270 al. 2 CO |
| **Formule de rÃ©siliation (bailleur)** | TOUS les cantons | Art. 266l al. 2 CO |
| **Formule de hausse de loyer** | TOUS les cantons | Art. 269d CO |
| **Formule de baisse de loyer** | TOUS les cantons | Art. 270a CO |
| **Demande de sous-location** | TOUS les cantons | Art. 262 CO |
| **Ã‰tat des lieux d'entrÃ©e** | Cantons romands (CCR/RULV) | CCR art. 3 / RULV art. 1 |
| **Ã‰tat des lieux de sortie** | TOUS les cantons | Art. 267a CO |
| **Annonce au contrÃ´le des habitants** | TOUS les cantons (format variable) | Lois cantonales / eCH-0112 |
| **Notification sÃ©parÃ©e conjoint** | TOUS (logement familial) | Art. 266n CO |

***

## 20. Points critiques pour la plateforme automatisÃ©e

### Architecture de rÃ¨gles par canton

La plateforme devra maintenir une **base de donnÃ©es de rÃ¨gles cantonales** mise Ã  jour rÃ©guliÃ¨rement, couvrant :

1. **Formulaires obligatoires** : Quels formulaires sont requis, dans quelle version cantonale
2. **Dates de rÃ©siliation** : Calcul automatique des prochaines Ã©chÃ©ances valides
3. **Zones de pÃ©nurie** : Liste mise Ã  jour annuellement des districts/communes concernÃ©s (impacte l'obligation de formulaire)
4. **Taux de rÃ©fÃ©rence** : Publication trimestrielle OFL, impact automatique sur les calculs de loyer
5. **Lois cantonales spÃ©cifiques** : LDTR (GE), LPPPL/RULV (VD), etc.
6. **Logement familial** : Double notification obligatoire
7. **Signature Ã©lectronique** : SEQ minimum pour les actes exigeant la forme Ã©crite, SEA pour les contrats simples
8. **Protection des donnÃ©es** : ConformitÃ© nLPD, durÃ©e de conservation, droit d'accÃ¨s

### Risques juridiques principaux

- **NullitÃ© du loyer** si le formulaire de loyer initial est absent ou incomplet dans les cantons concernÃ©s[^17]
- **NullitÃ© de la rÃ©siliation** si la formule officielle cantonale n'est pas utilisÃ©e par le bailleur[^7]
- **NullitÃ© de la hausse** si elle n'est pas notifiÃ©e par formulaire officiel avec motifs[^5]
- **ResponsabilitÃ© en matiÃ¨re de donnÃ©es** : non-conformitÃ© nLPD
- **DiffÃ©rences entre baux papier et Ã©lectroniques** : certaines communes n'acceptent pas encore le format numÃ©rique pour l'inscription au contrÃ´le des habitants[^54]

### Veille juridique nÃ©cessaire

La plateforme doit intÃ©grer une veille sur :
- Les **dÃ©clarations cantonales de pÃ©nurie** (mises Ã  jour annuelles)
- Les **modifications de l'OBLF** et du CO
- Les **nouvelles formules cantonales** (comme la mise Ã  jour genevoise d'octobre 2025)[^17]
- Le **taux hypothÃ©caire de rÃ©fÃ©rence** (trimestriel)
- Les **votations fÃ©dÃ©rales et cantonales** impactant le droit du bail

---

## References

1. [Droit du bail dans le canton de Vaud](https://www.vd.ch/territoire-et-construction/logement/droit-du-bail) - Le droit du bail relÃ¨ve du droit fÃ©dÃ©ral. C'est le Code des obligations qui en dÃ©termine le contenu ...

2. [Bail pour locaux commerciaux: Principes juridiques - WEKA](https://www.weka.ch/themes/droit/bail-et-loyer/bail-commercial/article/bail-pour-locaux-commerciaux-principes-juridiques/) - Le contrat ayant pour objet un local commercial, en droit suisse, reste trÃ¨s proche des rÃ¨gles du ba...

3. [RÃ©siliation d'un bail: dates et dÃ©lais officiels de rÃ©siliation](https://flatfox.ch/c/fr/magazine/guide/resiliation/dates-et-delais-de-resiliation-officiels/) - En Suisse, le dÃ©lai de prÃ©avis minimum lÃ©gal pour les appartements en location est de trois mois. Le...

4. [Contrat de bail: comment rÃ©silier correctement](https://www.zurich.ch/fr/services/savoir/habitat-et-construction/contrat-bail-resiliation) - En Suisse, le dÃ©lai de prÃ©avis lÃ©gal pour un appartement est de trois mois. La rÃ©siliation est alors...

5. [Diminution et augmentation de loyer](https://www.consultationjuridiqueduvalentin.ch/post/diminution-et-augmentation-de-loyer) - Si le locataire estime que l'augmentation du loyer est abusive au sens des art. 269 et 269a CO, il p...

6. [Canton de Berne](https://www.zsg.justice.be.ch/content/dam/zsg_justice/dokumente/fr/zivilrecht/formule-resiliation-bail-be-online.pdf) - Voies de droit : Dans un dÃ©lai de 30 jours la prÃ©sente rÃ©siliation peut Ãªtre contestÃ©e comme Ã©tant a...

7. [[DOC] RÃ©siliation](https://www.myright.ch/fr/documents/479) - Les baux d'habitations et de locaux commerciaux doivent Ãªtre rÃ©siliÃ©s par Ã©crit (art. 266l CO). De p...

8. [quer le loyer initial (art. 270, al. 2, CO)](https://www.bwo.admin.ch/dam/fr/sd-web/lp4WEVqxdXWN/2025-12-01_F_Verzeichnis%20Formularpflicht%20Anfangsmietzins_Kantonale%20Gesetze%20und%20Leerwohnungsziffer_F.pdf) - Les dispositions en vigueur dans les diffÃ©rents cantons concernant l'obligation de re- courir Ã  une ...

9. [Droit du bail : modification des formules officielles du loyer ...](https://habitatdurable.ch/project/droit-du-bail-modification-des-formules-officielles-du-loyer-initial/) - Pour les cantons dans lesquels la formule officielle pour la notification du loyer initial est oblig...

10. [FAQ Formule destinÃ©e Ã  communiquer le loyer initial des ...](https://www.mieterverband.ch/mv-be/francais/formule-loyer-initial/) - Formule destinÃ©e Ã  communiquer le loyer initial des logements. Depuis le 1er dÃ©cembre 2025, les prop...

11. [Nouvelles formules officielles obligatoires pour les baux Ã  ...](https://immoscope-ge.ch/juridique/nouvelles-formules-officielles-obligatoires-pour-les-baux-a-loyer-dhabitation/) - Depuis le 1er octobre, toute conclusion d'un bail d'habitation Ã  GenÃ¨ve doit comporter une nouvelle ...

12. [Nouvelles formules officielles obligatoires pour les baux Ã  loyer d ...](https://www.cgionline.ch/nouvelles-formules-officielles-obligatoires-pour-les-baux-a-loyer-dhabitation/) - Ã€ partir du 1er octobre 2025, toute conclusion d'un bail d'habitation Ã  GenÃ¨ve devra comporter une n...

13. [Formules officielles - RÃ©publique et canton de NeuchÃ¢tel](https://www.ne.ch/autorites/DFS/SBAT/aide-au-logement/Pages/Formules-officielles.aspx) - La notification de loyer lors de la conclusion d'un nouveau bail; La notification de rÃ©siliation de ...

14. [PÃ©nurie de logements vacants dans presque tout le canton ...](https://www.immobilier.ch/fr/actualite-magazines/penurie-de-logements-vacants-dans-presque-tout-le-canton-de-vaud-27237) - Sur dix districts, neuf se trouvent dÃ©sormais en situation de pÃ©nurie, avec un taux moyen cantonal d...

15. [Le Contrat de Bail en Suisse : Guide Juridique 2026](https://www.ma-caution.ch/contrat-de-bail) - Obligatoire en Romandie : Le Formulaire Officielâ€‹â€‹ Dans les cantons souffrant de pÃ©nurie de logement...

16. [Le Conseil fÃ©dÃ©ral modifie l'OBLF pour accroÃ®tre la transparence des ...](https://www.bwo.admin.ch/fr/nsb?id=104590) - Ces cantons doivent adapter leur formule de communication du loyer initial d'ici au 1er octobre 2025...

17. [NouveautÃ©s en droit du bail dÃ¨s le 1er octobre 2025 - Borel Barbey](https://www.borel-barbey.ch/nouveautes-en-droit-du-bail-des-le-1er-octobre-2025/) - DÃ¨s le 1er octobre 2025, l'Ordonnance sur le bail Ã  loyer et le bail Ã  ferme d'habitations et de loc...

18. [La protection du conjoint dans le logement de famille](https://www.consultationjuridiqueduvalentin.ch/post/la-protection-du-conjoint-dans-le-logement-de-famille) - Ces dispositions offrent une protection spÃ©ciale pour le conjoint ou le partenaire enregistrÃ© non ti...

19. [[PDF] FORMULE POUR LA NOTIFICATION DE HAUSSE DE LOYER ou ...](https://www.fr.ch/document/451781) - 1 Si le locataire estime qu'une majoration de loyer est abusive au sens des art. 269 et 269a, il peu...

20. [En tant que sous-locataire d'un local commercial, quels sont mes ...](https://www.geneve.ch/themes/culture/bibliotheques/interroge/reponses/en-tant-que-locataire-un-local-commercial-mes-droits-en-cas-de-contrat-non-conforme-et-de-loyer-de-location-abusifs) - Le locataire peut sous-louer tout ou partie du bien avec le consentement du bailleur (art. 262 du Co...

21. [Sous location Suisse : comment procÃ©der - WEB Caution](https://www.webcaution.ch/sous-location-suisse-comment-proceder/) - L'article 262 du Code des obligations stipule ainsi que Â« le locataire peut sous-louer tout ou parti...

22. [Votation populaire du 24 novembre 2024 - GenÃ¨ve](https://www.ge.ch/votations/20241124/federal/suisse/) - Liste des objets fÃ©dÃ©raux avec leurs rÃ©sultats pour tous les cantons.

23. [Votation du 24 novembre: tous les rÃ©sultats en bref - 20 minutes](https://www.20min.ch/fr/story/votation-du-24-novembre-vers-un-non-aux-autoroutes-oui-aux-soins-division-sur-le-bail-103226263) - Les Suisses ont votÃ© ce dimanche. Retrouvez ici les rÃ©sultats sur les autoroutes, le bail et le fina...

24. [Votation populaire du 24 novembre 2024](https://www.ch.ch/fr/votation-populaire-du-24-novembre-2024/) - Le 24.11.2024 le peuple suisse s'exprime su 4 objets: AmÃ©nagement des routes nationales, Sous-locati...

25. [Sous location - 24 novembre 2024 - Archive - Votations](https://www.easyvote.ch/fr/votations/archive/24-novembre-fr-2024/sous-location) - Les locataires peuvent sous-louer des appartements, des locaux commerciaux ou des piÃ¨ces individuell...

26. [Garantie de loyer: DÃ©pÃ´t et restitution selon la loi suisse](https://www.mobiliere.ch/guide/caution-de-loyer) - 257e du code des obligations (CO). S'agissant de baux d'habitation, la garantie ne peut pas dÃ©passer...

27. [LOI 221.307 sur les garanties en matiÃ¨re de baux Ã  loyer ( ...](https://www.lexfind.ch/tolv/200371/fr) - Ce dernier peut, en tout temps, substituer au cautionnement une garantie de mÃªme montant en espÃ¨ces ...

28. [Le taux hypothÃ©caire de rÃ©fÃ©rence reste Ã  1,25](https://www.wohnen-schweiz.ch/fr/actualites/secteur/taux-dinteret-de-reference) - Il constitue dans toute la Suisse la base de la fixation des loyers. Le taux d'intÃ©rÃªt de rÃ©fÃ©rence ...

29. [Baisse de loyer basÃ©e sur le taux de rÃ©fÃ©rence](https://www.mobiliere.ch/guide/baisse-de-loyer-taux-hypothecaire) - Le taux d'intÃ©rÃªt hypothÃ©caire de rÃ©fÃ©rence correspond au taux d'intÃ©rÃªt moyen de l'ensemble des crÃ©...

30. [DFR - BGer 4A_465/2015](https://www.servat.unibe.ch/dfr/bger/2016/160301_4A_465-2015.html) - 4.2. En vertu de l'art. 269 CO, le loyer est abusif lorsqu'il permet au bailleur d'obtenir un rendem...

31. [Bail Ã  loyer â€“ Droit des obligations et des contrats](https://droitpourlapratique.ch/subtheme/bail-a-loyer) - Un immeuble est ancien lorsque sa construction ou sa derniÃ¨re acquisition est de 30 ans au moins au ...

32. [Comment fixer le loyer d'un vieil immeuble?](https://www.asloca.ch/actualites/vos-droits-comment-fixer-le-loyer-dun-vieil-immeuble) - Le Tribunal fÃ©dÃ©ral vient de trancher la question de savoir Ã  quel moment un immeuble est considÃ©rÃ© ...

33. [[PDF] AutoritÃ©s et procÃ©dure en matiÃ¨re de bail Ã  loyer](https://bail.ch/files/subjects/Rapp94.pdf) - une autoritÃ© paritaire de conciliation (art. 274a al. 1 et 2), Ã  prÃ©voir une ... 1 CO, les cantons d...

34. [Pouvoir judiciaire - Commissions de conciliation en matiÃ¨re de bail ...](https://www.fr.ch/etat-et-droit/justice/pouvoir-judiciaire-commissions-de-conciliation-en-matiere-de-bail-et-tribunal-des-baux) - Les commissions de conciliation en matiÃ¨re de bail CCB permettent notamment de lutter contre les abu...

35. [L'autoritÃ© de conciliation au service des locataires et des ...](https://www.newhome.ch/blog/fr/louer/droit-locatif/lautorite-de-conciliation-au-service-des-locataires-et-des-bailleurs/) - La procÃ©dure est en principe toujours gratuite. L'autoritÃ© n'alloue pas de dÃ©pens aux parties et n'i...

36. [Commissions prÃ©fectorales de conciliation | Ã‰tat de Vaud](https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/prestations-des-prefectures/commissions-prefectorales-de-conciliation) - Les commissions de conciliation sont les autoritÃ©s de premiÃ¨re instance qui doivent Ãªtre saisies obl...

37. [quel impact sur les loyers dans les cantons de GenÃ¨ve et Vaud](https://www.mll-news.com/renovations-energetiques-quel-impact-sur-les-loyers-dans-les-cantons-de-geneve-et-vaud/?lang=fr) - En Suisse, les locataires bÃ©nÃ©ficient d'une lÃ©gislation protectrice en matiÃ¨re d'augmentation de loy...

38. [GenÃ¨ve: le plafonnement des loyers aprÃ¨s des rÃ©novations](https://fr.comparis.ch/immobilien/mietrecht/mietdeckel-renovation-genf) - En cas de rÃ©novation complÃ¨te, les loyers sont limitÃ©s Ã  un maximum de 3'528 francs par piÃ¨ce et par...

39. [Logements subventionnÃ©s - ge.ch](https://www.ge.ch/dossier/politique-du-logement-geneve/loger-ensemble-population/logements-subventionnes) - Les logements subventionnÃ©s sont des appartements pour lesquels l'Etat de GenÃ¨ve accorde, de faÃ§on d...

40. [[PDF] Les rÃ¨gles et usages locatifs du canton de Vaud (RULV) face au ...](https://bail.ch/files/subjects/2020-21eseminaire-dietschymartenet-lesreglesetusageslocatifsducantondevaudrulv.pdf) - A notre avis, le bail ne pourrait pas dÃ©roger Ã  l'obligation d'Ã©tablir un Ã©tat des lieux d'entrÃ©e, c...

41. [Bail habitation Suisse - RÃ©siliation, Prolongation, RÃ©paration, Etat ...](https://www.questiondedroit.ch/bail-habitation-suisse/) - Le bail d'habitation en Suisse. RÃ©duction de loyer, rÃ©siliation, droit de prolongation, rÃ©parations,...

42. [Ma rÃ©gie me demande 150.- pour la conclusion de mon bail, est-ce ...](https://www.geneve.ch/themes/culture/bibliotheques/interroge/reponses/ma-regie-me-demande-150-la-conclusion-de-mon-bail-est-ce-legal) - Les frais y relatifs peuvent donc s'Ã©lever Ã  CHF 500 .â€“ au moins. Le montant facturÃ© aux locataires ...

43. [Quelles sont les obligations Ã  respecter avant un Ã©tat des lieux de ...](https://regieduboux.ch/quelles-sont-les-obligations-a-respecter-avant-un-etat-des-lieux-de-sortie/) - Toujours selon l'article 37 des RULV, le locataire doit Ã©galement veiller Ã  changer ou Ã  nettoyer, s...

44. [Contrat-cadre romand et rÃ¨gles et usages locatifs ...](https://bail.ch/bail/page/faq/12) - Le CCR et les RULV contiennent des rÃ¨gles portant notamment sur le paiement du loyer, les sÃ»retÃ©s, l...

45. [DÃ©finition: Contrat cadre romand - CCR - RealAdvisor](https://realadvisor.ch/fr/glossaire-immobilier/contrat-cadre-romand-ccr) - Le Contrat Cadre Romand, initialement conÃ§u pour Ã©quilibrer les droits et les obligations des baille...

46. [Des nouvelles du contrat-cadre romand - Immoscope](https://immoscope-ge.ch/juridique/des-nouvelles-du-contrat-cadre-romand/) - La force obligatoire a pour effet que les dispositions du CCR s'appliquent Ã  tout bail d'habitation ...

47. [Le gage immobilier sur le logement de famille (art. 169 CC)](https://lawinside.ch/361/) - 169 al. 1 CC Â« [u]n Ã©poux ne peut, sans le consentement exprÃ¨s de son conjoint, ni rÃ©silier le bail,...

48. [Les frais accessoires et les dÃ©comptes dans le contrat de bail](https://www.e-periodica.ch/cntmng?pid=hab-001%3A2021%3A93%3A%3A178) - accessoires4. de bail ne prÃ©voit que des frais de chauffage et d'eau chaude, le bailleur ne peut pas...

49. [Frais accessoires: ce qu'il faut savoir | Aide-mÃ©moire](https://www.myright.ch/fr/conseils-juridiques/logement/frais-accessoires) - Le locataire ne doit payer les frais accessoires que si le bail le stipule expressÃ©ment. Lorsque rie...

50. [Tous ces frais sont-ils vraiment Ã  la charge des locataires? - ASLOCA](https://www.asloca.ch/actualites/tous-ces-frais-sont-ils-vraiment-a-la-charge-des-locataires) - Le bailleur est autorisÃ© Ã  rÃ©percuter Ã  travers le loyer les honoraires de gÃ©rance que lui facture s...

51. [Quels frais la rÃ©gie peut-elle facturer au locataire? - ASLOCA GenÃ¨ve](https://geneve.asloca.ch/actualit%C3%A9s/quels-frais-regie-peut-elle-facturer-locataire) - Par ailleurs, tous les frais qui sont dÃ©jÃ  couverts par le paiement du loyer ne peuvent Ãªtre facturÃ©...

52. [Signature Ã©lectronique: quelle validitÃ© en droit suisse?](https://www.tdg.ch/signature-electronique-quelle-validite-en-droit-suisse-127522212708) - En Suisse, signatures manuscrites et Ã©lectroniques ont valeur juridique selon le contexte. Seule la ...

53. [Signature Ã©lectronique](https://www.bj.admin.ch/bj/fr/home/wirtschaft/gesetzgebung/archiv/e-signatur.html) - Le Conseil fÃ©dÃ©ral fixe l'entrÃ©e en vigueur de la loi sur la signature Ã©lectronique et de l'ordonnan...

54. [Bail numÃ©rique](https://www.wincasa.ch/fr-ch/etc-fr/bail-numerique) - Ces signatures Ã©lectroniques sont valables en cas de conclusion de baux pour lesquels la loi ne pres...

55. [Le bail Ã  loyer avec signature Ã©lectronique devient une ...](http://www.ictjournal.ch/news/2020-11-26/le-bail-a-loyer-avec-signature-electronique-devient-une-realite-en-suisse) - Le processus mis en place permet de signer numÃ©riquement le contrat de location de maniÃ¨re juridique...

56. [[PDF] La protection des donnÃ©es en matiÃ¨re de bail](https://bail.ch/files/subjects/2008-15eseminaire-probst-laprotectiondesdonneesenmatieredebail.pdf) - Pour le bailleur qui est une personne physique, il faut donc se demander s'il Ã©chappe au champ d'app...

57. [[PDF] Protection des donnÃ©es et baux Ã  loyer - libra](https://libra.unine.ch/bitstreams/2a81fa4c-a14e-4f61-b62d-a9528c149f6a/download) - Les personnes bailleresses, de mÃªme que les gÃ©rances (ou rÃ©gies) immobiliÃ¨res, traitent de maniÃ¨re r...

58. [Protection des donnÃ©es - regimo-geneve.ch](https://regimo-geneve.ch/protection-des-donnees) - Une fois le processus de location terminÃ©, les donnÃ©es personnelles des locataires potentiels sont e...

59. [La protection des locataires contre les discriminations](https://bail.ch/files/subjects/2018-20eseminaire-bieri-laprotectiondeslocatairescontrelesdiscriminations.pdf) - Un bailleur peut prÃ©voir que le logement ne peut Ãªtre occupÃ© que par une famille avec enfants21, ou ...

60. [Puis-je louer mon logement uniquement Ã  des Suisses](https://www.lex4you.ch/fr/themes-du-mois/puis-je-louer-mon-logement-uniquement-a-des-suisses) - La bailleresse peut refuser arbitrairement un locataire. Une bailleresse privÃ©e peut Ã©tablir ses pro...

61. [ContrÃ´le des habitants](https://www.chavornay.ch/aemter/20800) - Lors de votre arrivÃ©e dans la commune, vous Ãªtes tenu de vous annoncer dans les 8 jours. L'annonce p...

62. [Annoncer l'entrÃ©e ou la sortie d'un locataire](https://www.lausanne.ch/prestations/controle-des-habitants/annoncer-entree-ou-sortie-locataire.html) - Les logeurs, propriÃ©taires et gÃ©rants d'immeubles ont l'obligation d'annoncer au contrÃ´le des habita...

63. [eCH-0112 Norme concernant les donnÃ©es Obligation d' ...](https://www.ech.ch/sites/default/files/dosvers/hauptdokument/STAN_f_DEF_2019-06-07_eCH-0112_V2.0_Norme%20concernant%20les%20donn%C3%A9es%20%20Obligation%20d%E2%80%99annonce%20domiciliaire%20par%20un%20tiers.pdf) - â€¢ Les donnÃ©es devant Ãªtre annoncÃ©es auprÃ¨s de l'office du ContrÃ´le des habitants lors ... [OBLIGATOI...

64. [La prolongation du contrat de bail (art. 272 ss CO) - Etude Ferraz](https://etudeferraz.ch/2020/07/21/la-prolongation-du-contrat-de-bail-art-272-ss-co/) - La prolongation peut durer au maximum quatre ans pour les baux d'habitations et au maximum six ans p...

65. [Bail de durÃ©e dÃ©terminÃ©e - Bail.ch](https://bail.ch/bail/page/faq/10) - Y a-t-il une durÃ©e maximale de prolongation ? Oui. Pour les baux d'habitation, la durÃ©e maximale de ...

66. [S'inscrire pour un logement subventionnÃ© HLM ou HBM - ge.ch](https://www.ge.ch/logement-subventionne/inscrire-logement-subventionne-hlm-hbm) - Avoir son domicile fiscal dans le canton de GenÃ¨ve ;; ÃŠtre ... Le revenu dÃ©terminant LGL (Loi gÃ©nÃ©ra...

