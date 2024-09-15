document.addEventListener('DOMContentLoaded', function() {
    let price = document.getElementById('price');
    let tax = document.getElementById('tax');
    let ads = document.getElementById('ads');
    let disc = document.getElementById('disc');
    let total = document.getElementById('total');
    let btn = document.getElementById('btn');
    let category = document.getElementById('category');
    let title = document.getElementById('title');
    let count = document.getElementById('count');
    let currentIndex = null; // Pour savoir quel produit est en cours de mise à jour

    //-------------------------- Fonction pour calculer le total -----------------------------
    function getTotal() {
        let priceValue = parseFloat(price.value) || 0;
        let taxValue = parseFloat(tax.value) || 0;
        let adsValue = parseFloat(ads.value) || 0;
        let discValue = parseFloat(disc.value) || 0;

        let result = (priceValue + taxValue + adsValue) - discValue;

        total.innerText = result.toFixed(2);
        total.style.background = result < 0 ? 'red' : 'green';
    }

    // ------------------------- Initialiser dataprod à partir de localStorage -------------------------
    let dataprod = JSON.parse(localStorage.getItem('product')) || [];

    // ********************** Fonction pour ajouter ou mettre à jour un produit *************************
    function addOrUpdateProduct() {
        let newprod = {
            title: title.value,
            price: price.value,
            ads: ads.value,
            tax: tax.value,
            disc: disc.value,
            category: category.value,
            total: total.innerText,
        };

        if (currentIndex !== null) {
            // Mise à jour du produit existant
            dataprod[currentIndex] = newprod;
            currentIndex = null;
        } else {
            // Ajout d'un nouveau produit
            dataprod.push(newprod);
        }

        // Stocker le tableau mis à jour dans localStorage
        localStorage.setItem('product', JSON.stringify(dataprod));
        showdata();
    }

    // ------------------ Fonction pour vider les champs -----------------------
    function cleardata() {
        title.value = '';
        price.value = '';
        ads.value = '';
        tax.value = '';
        disc.value = '';
        category.value = '';
        total.innerText = '';
        count.value = '';
    }

    // ----------------------------- Afficher les données -------------------------------------
    function showdata() {
        let table = '';
        for (let i = 0; i < dataprod.length; i++) {
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataprod[i].title}</td>
                <td>${dataprod[i].price}</td>
                <td>${dataprod[i].ads}</td>
                <td>${dataprod[i].tax}</td>
                <td>${dataprod[i].disc}</td>
                <td>${dataprod[i].category}</td>
                <td>${dataprod[i].total}</td>
                <td><button class="update" data-index="${i}">Update</button></td>
                <td><button class="delete" data-index="${i}">Delete</button></td>
            </tr>
            `;
        }

        document.getElementById('tbody').innerHTML = table;

        // Ajouter les gestionnaires d'événements aux boutons
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function() {
                let index = this.getAttribute('data-index');
                Deldata(index);
            });
        });

        document.querySelectorAll('.update').forEach(button => {
            button.addEventListener('click', function() {
                let j = this.getAttribute('data-index');
                editProduct(j);
            });
        });
    }

    // -=-=-=-=-=-=-==-- Supprimer un produit -=-=-==-=-=-=-==--== 
    function Deldata(index) {
        dataprod.splice(index, 1);
        localStorage.setItem('product', JSON.stringify(dataprod));
        showdata();
    }

    // ------------------------- Fonction pour éditer un produit -------------------------
    function editProduct(i) {
        let prod = dataprod[i];
        title.value = prod.title;
        price.value = prod.price;
        ads.value = prod.ads;
        tax.value = prod.tax;
        disc.value = prod.disc;
        category.value = prod.category;
        total.innerText = prod.total;
        currentIndex = i; // Corriger ici
    }

    // Ajouter les événements des boutons
    btn.addEventListener('click', function() {
        getTotal();  // Assurez-vous que le total est calculé avant d'ajouter ou de mettre à jour le produit
        addOrUpdateProduct();
        cleardata();
    });

    // Initialiser la table
    showdata();

    // Ajouter des écouteurs d'événements pour recalculer le total en temps réel
    price.addEventListener('input', getTotal);
    tax.addEventListener('input', getTotal);
    ads.addEventListener('input', getTotal);
    disc.addEventListener('input', getTotal);
});
