# Master Prompt — Heladería Fría Tentación

## UI / UX REQUIREMENTS

There MUST NOT be a landing page, welcome page, or home page.

The application must open directly into the ordering flow.

The first screen the user sees is the product selection screen.

The flow should be:

1. Select ice cream size.
2. Select flavors.
3. Select toppings (optional).
4. Select cakes (optional, if enabled).
5. Choose Pickup or Delivery.
6. Complete customer information.
7. Review order summary.
8. Confirm order.
9. Open WhatsApp.
10. Success page.

## DESIGN REFERENCE

The UI should be heavily inspired by the ordering experience of PedidosYa.

Do NOT copy the design.

Instead, replicate the UX principles:

- Mobile-first layout.
- Product cards with clean spacing.
- Sticky bottom order summary.
- Clear primary CTA.
- Fast and intuitive navigation.
- Modern rounded components.
- Large touch targets.
- Floating cart/order summary.
- Smooth transitions between steps.
- Premium visual hierarchy.
- Minimal user effort.
- Very few clicks to complete an order.

The application should feel like a modern food ordering app rather than a traditional website.

## LAYOUT

The entire ordering experience should happen on a single page.

Avoid unnecessary navigation.

Prefer progressive sections instead of multiple pages.

Use collapsible sections or step-based components when appropriate.

The order summary should always be accessible.

On mobile:

- Sticky bottom summary.
- Floating "Continue" button.

On desktop:

- Two-column layout.
- Left: Product selection.
- Right: Sticky order summary.

## USER EXPERIENCE

The user should never wonder what to do next.

Guide the user through the ordering process naturally.

Automatically scroll to the next section after completing the current one when appropriate.

Provide instant validation and immediate visual feedback.

Display selected items clearly.

Show running total at all times.

Optimize for completing an order in under one minute.

Avoid unnecessary dialogs or confirmations.

Every interaction should feel fast, fluid, and polished.

## ORDER FLOW EXPERIENCE

The entire ordering process must happen on a single page.

Do NOT create a traditional website.

Do NOT create a landing page.

Do NOT create a home page.

The application starts immediately in the ordering flow.

The UI should progressively guide the customer through each step.

Each section becomes enabled only after the previous one has been completed.

The flow is:

STEP 1
Select Ice Cream Size

↓

STEP 2
Select Flavors

↓

STEP 3
Select Toppings (Optional)

↓

STEP 4
Select Cakes (Optional)

↓

STEP 5
Choose Pickup or Delivery

↓

STEP 6
Complete Customer Information

↓

STEP 7
Review Order Summary

↓

STEP 8
Confirm Order

↓

STEP 9
Open WhatsApp

↓

STEP 10
Success Screen

## PROGRESSIVE UI

Do not overwhelm the user.

Only display the next step when the current one is complete.

Each completed section should collapse into a compact summary card.

Example:

✓ Size
1 Kg

✓ Flavors
Chocolate
Dulce de Leche
Tramontana
Frutilla

✓ Toppings
Rocklets

The user can reopen any previous step to edit it.

## AUTOMATIC NAVIGATION

When the user completes a step:

- Smoothly scroll to the next section.
- Expand the next step automatically.
- Keep previous steps collapsed.

Animations must be subtle and fast.

## ORDER SUMMARY

The order summary must always remain visible.

Desktop:

Sticky right sidebar.

Mobile:

Sticky bottom summary bar.

The summary must update instantly.

Display:

- Products
- Flavors
- Toppings
- Cakes
- Delivery Type
- Total Price

## PEDIDOSYA-STYLE UX

The experience should feel inspired by PedidosYa.

Not visually identical.

Instead reproduce the UX principles.

Prioritize:

- Speed
- Clarity
- Minimal taps
- Large touch targets
- Rounded cards
- Floating primary action button
- Sticky order summary
- Progressive disclosure
- Immediate visual feedback
- Premium mobile experience

## MICROINTERACTIONS

Every important interaction should provide immediate feedback.

Examples:

- Size selected
- Flavor added
- Topping removed
- Delivery selected

Use subtle animations.

Never block the interface.

## PRIMARY ACTION BUTTON

The bottom CTA should change depending on the current step.

Examples:

- Continue
- Choose Flavors
- Choose Toppings
- Continue to Delivery
- Review Order
- Send via WhatsApp

The user should always know the next action.

## COMPLETION TIME

Optimize the experience so that a returning customer can complete an order in less than 60 seconds.

Reduce unnecessary clicks.

Avoid unnecessary confirmations.

Every screen element must have a clear purpose.

## EDITING

Users must be able to go back and modify previous selections at any time.

Changing the size should automatically validate the flavor limit.

Example:

User changes from 1 Kg (4 flavors)
to 1/4 Kg (2 flavors)

The application should ask the user to remove the extra flavors before continuing.
