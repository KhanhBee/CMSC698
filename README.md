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

## Coming soon / in progress

* Nutrition placeholder page.
* Sort and filter functions for recipes.
* Actual image recognition and OCR for ingredients.
