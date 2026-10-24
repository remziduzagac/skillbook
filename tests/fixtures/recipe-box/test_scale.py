import unittest

from scale import scale, scale_recipe


class ScaleTest(unittest.TestCase):
    def test_double(self):
        self.assertEqual(scale(200, 4, 8), 400)

    def test_half(self):
        self.assertEqual(scale(300, 6, 3), 150)

    def test_same(self):
        self.assertEqual(scale(50, 2, 2), 50)

    def test_recipe(self):
        scaled = scale_recipe("Serves: 2\n\n- 100 g rice\n", 4)
        self.assertIn("Serves: 4", scaled)
        self.assertIn("- 200 g rice", scaled)


if __name__ == "__main__":
    unittest.main()
