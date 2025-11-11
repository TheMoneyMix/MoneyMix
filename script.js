// Wait for the DOM to be fully loaded before running script
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("drinkBuilder");
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalEl = document.getElementById("subtotal");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    let cart = [];
    const TAX_RATE = 0.0825; // 8.25% Tax

    // Listen for the form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop the form from refreshing the page

        // 1. GET VALUES FROM FORM
        
        // Get selected flavor
        const flavorEl = document.getElementById("flavor");
        const flavor = flavorEl.options[flavorEl.selectedIndex].text;

        // Get selected size and price
        const sizeEl = document.querySelector('input[name="size"]:checked');
        const size = sizeEl.value;
        let price = parseFloat(sizeEl.dataset.price);

        // Get selected addons
        const addonEls = document.querySelectorAll('input[name="addon"]:checked');
        let addons = [];
        addonEls.forEach((addon) => {
            addons.push(addon.value);
            price += parseFloat(addon.dataset.price); // Add addon price
        });

        // 2. CREATE DRINK OBJECT
        const drink = {
            id: Date.now(), // Unique ID for the item
            flavor: flavor,
            size: size,
            addons: addons,
            price: price
        };

        // 3. ADD TO CART ARRAY
        cart.push(drink);

        // 4. UPDATE THE WEBSITE
        updateCartDisplay();
        updateCartTotals();

        // 5. Reset the form
        form.reset();
        document.querySelector('input[name="size"][checked]').checked = true; // Reset radio
    });

    function updateCartDisplay() {
        // Clear the "cart is empty" message if it's the first item
        if (cart.length === 1) {
            cartItemsContainer.innerHTML = "";
        }

        // Get the last item added (the new drink)
        const newDrink = cart[cart.length - 1];

        // Create the HTML for the new cart item
        const itemEl = document.createElement("div");
        itemEl.classList.add("cart-item");
        itemEl.dataset.id = newDrink.id;

        let addonsHTML = newDrink.addons.length > 0
            ? `<p><strong>Addons:</strong> ${newDrink.addons.join(", ")}</p>`
            : "<p>No Addons</p>";

        itemEl.innerHTML = `
            <h4>${newDrink.flavor}</h4>
            <p>${newDrink.size}</p>
            ${addonsHTML}
            <p class="item-price">$${newDrink.price.toFixed(2)}</p>
            <button class="remove-item" onclick="removeItem(${newDrink.id})">Remove</button>
        `;

        cartItemsContainer.appendChild(itemEl);
    }
    
    function updateCartTotals() {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price;
        });

        let tax = subtotal * TAX_RATE;
        let total = subtotal + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // Make the remove function global so the inline onclick can find it
    window.removeItem = (id) => {
        // Remove from cart array
        cart = cart.filter(item => item.id !== id);

        // Remove from HTML
        const itemToRemove = document.querySelector(`.cart-item[data-id="${id}"]`);
        if (itemToRemove) {
            itemToRemove.remove();
        }

        // Show "empty" message if cart is now empty
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is currently empty.</p>";
        }

        // Update totals
        updateCartTotals();
    };

});