# Stock tracking: design

For the Bramble & Co. online shop: about 40 orders a week and 120 products. A freelancer will build it. The owner packs the orders.

## Goal

Customers never buy something that is out of stock, and the owner knows what to reorder.

## Parts

- Checkout: takes the order and the payment.
- Stock: holds a count for each product. It lowers the count when an order is paid.
- Reorder list: lists the products with 5 or fewer left, every Monday morning.
- Packing list: shows the paid orders to pack.

## Behaviour

- A customer pays. Stock lowers the count, and the order appears on the packing list.
- When a count reaches 0, Checkout shows the product as sold out.
- Every Monday the Reorder list is emailed to the owner.

## Decisions

- Stock counts change only when an order is packed, not when it is paid, so a count always matches the shelf. Reason: the owner counts the shelf every Sunday and wants the same numbers.
- The reorder level is 5 for every product. Reason: it is simple to explain.
