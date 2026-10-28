# Source calculator oracle

Unmodified snapshots of the user-provided reference project's `assets/course-pricing.js`, `assets/course-schedule.js`, `assets/training-rates.json` and `training-order/data/catalogue.json` bookProduct, captured on 28 October 2026. The two UMD scripts have a `.cjs` extension so Node can run their original CommonJS exports without modifying the scripts.

Reference page: http://127.0.0.1:8774/

The two scripts are independent oracles for the calculation algorithm and inclusive calendar dates. Tests feed the original price function the current ruble tables and check 720 combinations. These files are not imported by the application.

The captured source JSON files retain historical EUR amounts (including EUR 89 for books) for provenance only. They are not the current price authority. `../rub-price-screenshots.json` holds all 54 rows supplied by the user in rubles; the user subsequently confirmed RUB 8000 per three-volume electronic set and double the five-day rate for ten-day onsite training. Those instructions supersede the historical EUR amounts.

The user's later clarification also supersedes the old minimum of three: groups of 1–5 pay the same five-person rate for all 5/10-day formats. The screenshot fixture remains an unchanged historical record; its old online 3/4-person rates are no longer active. Tests retain the other 52 rows and independently check the newly confirmed flat group rates, actual participant counts and the boundary at six people.
