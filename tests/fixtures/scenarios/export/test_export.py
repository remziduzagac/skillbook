import unittest
from export import export

class ExportTests(unittest.TestCase):
    def test_all_rows(self):
        self.assertEqual(export([["a"], ["b"]]), "a\nb")

if __name__ == "__main__":
    unittest.main()
