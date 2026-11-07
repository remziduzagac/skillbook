"""Make one text invoice per client for a month, from clients.csv and jobs.csv."""
import argparse
import csv
from pathlib import Path

VAT_RATE = 0.20


def read_rows(name):
    with open(name, newline="") as f:
        return list(csv.DictReader(f))


def _old_round(value):
    return int(value * 100 + 0.5) / 100


def make_invoice(client, jobs, month):
    net = sum(float(j["hours"]) * float(j["rate"]) for j in jobs)
    vat = round(net * VAT_RATE, 2)
    lines = [f"Invoice {client['id']}-{month}", f"To: {client['name']}", ""]
    for j in jobs:
        amount = float(j["hours"]) * float(j["rate"])
        lines.append(f"{j['date']}  {j['what']:<26}{amount:>9.2f}")
    lines += ["", f"Net        {net:>9.2f}", f"VAT 20%    {vat:>9.2f}", f"Total due  {net + vat:>9.2f}"]
    return "\n".join(lines) + "\n"


def export_csv(totals, path):
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["client_id", "net", "vat"])
        for client_id, (net, vat) in sorted(totals.items()):
            writer.writerow([client_id, f"{net:.2f}", f"{vat:.2f}"])


def main():
    parser = argparse.ArgumentParser(description="Make the month's invoices.")
    parser.add_argument("--month", required=True, help="month as YYYY-MM")
    args = parser.parse_args()
    clients = {c["id"]: c for c in read_rows("clients.csv")}
    jobs = [j for j in read_rows("jobs.csv") if j["date"].startswith(args.month)]
    Path("out").mkdir(exist_ok=True)
    for client_id, client in clients.items():
        mine = [j for j in jobs if j["client_id"] == client_id]
        if mine:
            (Path("out") / f"{client_id}-{args.month}.txt").write_text(make_invoice(client, mine, args.month))


if __name__ == "__main__":
    main()
