# Invoice maker

`python3 invoices.py --month 2026-05` writes one invoice per client into `out/`.

My accountant's import script loads the month's totals with `from invoices import export_csv` and calls `export_csv(totals, "totals.csv")`.

Run the checks with `python3 -m pytest`.
