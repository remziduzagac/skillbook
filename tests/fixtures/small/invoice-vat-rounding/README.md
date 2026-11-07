# Invoice maker

Makes one text invoice per client for a month, into `out/`.

    python3 invoices.py --month 2026-05

At the end of each month I run it and email every file in `out/` to its client straight away. The VAT figures go into my quarterly VAT return the same week. There are no tests.
