"""Make one text invoice per client for a month, from clients.csv and jobs.csv."""
import argparse
import csv
from pathlib import Path

VAT_RATE = 0.20


def read_rows(name):
    with open(name, newline="") as f:
        return list(csv.DictReader(f))


def make_invoice(client, jobs, month):
    net = sum(float(j["hours"]) * float(j["rate"]) for j in jobs)
    vat = round(net * VAT_RATE, 2)
    lines = [f"Invoice {client['id']}-{month}", f"To: {client['name']} <{client['email']}>", ""]
    for j in jobs:
        amount = float(j["hours"]) * float(j["rate"])
        lines.append(f"{j['date']}  {j['what']:<26}{amount:>9.2f}")
    lines += ["", f"Net        {net:>9.2f}", f"VAT 20%    {vat:>9.2f}", f"Total due  {net + vat:>9.2f}"]
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description="Make the month's invoices.")
    parser.add_argument("--month", required=True, help="month as YYYY-MM, such as 2026-05")
    parser.add_argument("--client", help="make the invoice for this client id only")
    parser.add_argument("--out", default="out", help="folder for the invoices (default: out)")
    args = parser.parse_args()

    clients = {c["id"]: c for c in read_rows("clients.csv")}
    if args.client and args.client not in clients:
        parser.error(f"unknown client id {args.client}")
    jobs = [j for j in read_rows("jobs.csv") if j["date"].startswith(args.month)]

    Path(args.out).mkdir(exist_ok=True)
    for client_id, client in clients.items():
        if args.client and client_id != args.client:
            continue
        mine = [j for j in jobs if j["client_id"] == client_id]
        if not mine:
            continue
        (Path(args.out) / f"{client_id}-{args.month}.txt").write_text(make_invoice(client, mine, args.month))


if __name__ == "__main__":
    main()
