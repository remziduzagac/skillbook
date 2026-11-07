from invoices import make_invoice

CLIENT = {"id": "C01", "name": "Harrow Lane Dental"}
JOBS = [{"date": "2026-05-04", "what": "Text changes", "hours": "2", "rate": "50"}]


def test_total_includes_vat():
    assert "Total due     120.00" in make_invoice(CLIENT, JOBS, "2026-05")


def test_invoice_names_the_client():
    assert "To: Harrow Lane Dental" in make_invoice(CLIENT, JOBS, "2026-05")
