"""Print one client's invoice for a month, from clients.csv and jobs.csv."""
import csv
import sys

VAT_RATE = 0.20


def make_invoice(client_id, month):
    with open("clients.csv", newline="") as f:
        client = next(c for c in csv.DictReader(f) if c["id"] == client_id)
    net = 0.0
    out = [f"Invoice {client_id}-{month}", f"To: {client['name']}", ""]
    with open("jobs.csv", newline="") as f:
        for row in csv.DictReader(f):
            if row["client_id"] == client_id and row["date"].startswith(month):
                amount = float(row["hours"]) * float(row["rate"])
                net += amount
                out.append(f"{row['date']}  {row['what']:<26}{amount:>9.2f}")
    vat = round(net * VAT_RATE, 2)
    out += ["", f"Net        {net:>9.2f}", f"VAT 20%    {vat:>9.2f}", f"Total due  {net + vat:>9.2f}"]
    return "\n".join(out)


if __name__ == "__main__":
    print(make_invoice(sys.argv[1], sys.argv[2]))
