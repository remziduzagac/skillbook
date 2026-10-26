def export(rows):
    return "\n".join(",".join(row) for row in rows[:-1])
