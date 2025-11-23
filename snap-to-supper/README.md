# Description
Snap-to-Supper is a simple cooking helper: you take or upload a photo of the ingredients you have, clean up the list if needed, and the app suggests recipes that use many of those items. Each recipe shows steps, time, servings, and at-a-glance nutrition per serving. Works on phone or laptop, with automated or manual edits at every step.

# Changelog

## Tues 09/30 - Project setup & UI
* Main plan: photo → ingredients → recipes → nutrition.
* Scaffolded Next.js (TypeScript + Tailwind, app router) in `snap-to-supper`.
* Built IngredientPhotoUploader: choose/take a photo and preview it.
* Added editable ingredient elements: placeholder scan feature, manual add, remove.

## Sun 10/05 - Placeholder recipes page
* Local storage for ingredient list.
* Added routing.
* Basic match score functionality.
* Added Recipe cards.
* Fixed a lot of path issues.

## Thurs 10/16 - Nutrition view + recipe generation
* Added the first version of the nutrition placeholder page.
* Implemented recipe generation using the **school’s GPT-OSS model** (JSON-only recipes).
* Integrated recipe selection → open detail modal → display nutrition placeholder.
* Fixed several JSON parsing bugs from GPT-OSS (invalid arrays, trailing commas).

## Sat 10/25 - Floating nutrition tab & UI fixes
* Converted the nutrition page into a **floating tab** inside the recipe detail window, so the recipe page doesn’t reload on back navigation.
* Improved scroll behavior on mobile (prevented background scrolling when detail modal is open).
* Fixed bug where recipe details sometimes lost state after closing the modal.

## Sun 11/02 - Google Vision integration
* Added Google Vision API to the `/api/scan` route.
* Implemented label extraction → cleaned into ingredient list.
* Added canonicalization step to filter out vague labels (e.g. “vegetable,” “meat”).
* Attempted adding manual “guard rails” to improve accuracy:
  - Limited labels by confidence score
  - Ignored generic abstract labels
  - Forced LLM post-processing to unify names  
  **→ results were still inconsistent and often too vague.**
* Encountered TypeScript issues with Google Vision’s type definitions (`maxResults` error).

## Sun 11/09 - Switched to Clarifai model + faster recipe generation
* Replaced Google Vision with **Clarifai’s food-item-recognizer**, which returned much more specific ingredient names.
* Updated ingredient normalization to match Clarifai output format.
* Replaced the school’s GPT-OSS recipe generator with **OpenAI gpt-4o-mini**, giving:
  - Faster generation  
  - More accurate ingredient usage  
  - More consistent JSON  
* Added better error boundary in `/api/recipes` to handle malformed model responses.
* Fixed UI bug where ingredient edits did not persist before generating recipes.

## Wed 11/19 - Favorites system
* Added **favorite recipe** button in the floating recipe detail modal.
* Implemented localStorage persistence for saved recipes.
* Added top-right navigation button to open the Favorites view before scanning.
* Built a simple saved-recipes page with listing + quick access to details.
* Fixed bug where recipe IDs collided between AI-generated sets.
* Improved overall stability in recipe modal open/close transitions.

# Coming soon / in progress
* Implementing a more attractive and intuitive Mobile UI.