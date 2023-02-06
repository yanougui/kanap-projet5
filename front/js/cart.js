//changement du titre dans l'url
document.title = "Page Panier";

//convertir les données au format JSON qui sont dans le localStorage
let productRegisterDanLocalStorage = JSON.parse(
  localStorage.getItem("produit")
);
const cartItems = document.getElementById("cart__items");

let compositionProduitsPanier = [];
//On déclare nos variables globales pour pouvoir calculer la quantité total d'articles et le prix total du panier
let totalPrice = 0;
let totalQuantity = 0;
let quantityProductPanier = 0;
let priceProductPanier = 0;
let totalProductPricePanier = 0;
let mesProduits = [];
const findProducts = 0;

//On déclare nos variables utilisées dans le fonction supprimer
let idDelete = 0;
let colorDelete = 0;

//On déclare nos variables utilisées pour la validation du panier
const boutonCommander = document.getElementById("order");
let errorFormulaireFirstName = true;
let errorFormulaireLastName = true;
let errorFormulaireAddress = true;
let errorFormulaireCity = true;
let errorFormulaireEmail = true;

/**
 * Fonction pour le calcul de la quantité total d'articles dans le panier,
 * Cette quantité évolue au chargement de la page Panier.html
 */
function quantiteTotalDesProduits() {
  totalQuantity += parseInt(quantityProductPanier);
  console.log("Total quantité panier", totalQuantity);
  document.getElementById("totalQuantity").innerText = totalQuantity;
}

/**
 * Fonction Calcul du montant total du panier, au chargement de la page Panier.html
 * Le prix change en fonction de la quantité du produit séectionné par utilisateur
 */
function prixTotalDesProduits() {
  // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
  totalProductPricePanier = quantityProductPanier * priceProductPanier;
  // Calcul du prix total du panier
  totalPrice += totalProductPricePanier;
  console.log("Total prix panier", totalPrice);
  document.getElementById("totalPrice").innerText = totalPrice;
}
//Une fonction qui appel les deux fonctions totalProductsQuantity() et totalProductsPrice();

function montantEtQuantiteTotalPanier() {
  quantiteTotalDesProduits();
  prixTotalDesProduits();
}

/**
 * Fonction qui recalcul la quantité total d'articles dans le panier,
 * Lors de la modification de la quantité ou de la suppression d'un article, il faut recalculer la quantité
 */
function recalculTotalQuantiteTotal() {
  let nouvelleQuantiteTotal = 0;
  for (const produit of productRegisterDanLocalStorage) {
    //On calcul le nombre de quantité total de produits dans le localStorage
    nouvelleQuantiteTotal += parseInt(produit.quantityProduct);
  }
  console.log("Nouvelle quantité totale panier", nouvelleQuantiteTotal);
  //On affichage la nouvelle quantité totale de produits dans le html
  document.getElementById("totalQuantity").innerText = nouvelleQuantiteTotal;
}

/**
 * Fonction pour recalculer le montant total du panier,
 * Après une modification de la quantité ou de la suppression d'un article,
 * Il faut recalculer le montant total du panier et afficher le nouveau montant
 */
function recalculPrixTotal() {
  let nouveauPrixTotal = 0;
  // On fait une boucle sur le productRegisterInLocalStorage et dans cette boucle,
  for (const item of productRegisterDanLocalStorage) {
    const idProductsLocalStorage = item.idProduct;
    const quantityProductsLocalStorage = item.quantityProduct;
    // on vérifie si l'id correspond
    const findProducts = mesProduits.find(
      (element) => element._id === idProductsLocalStorage
    );
    // et si c'est le cas, on récupère le prix.
    if (findProducts) {
      const newTotalProductPricePanier =
        findProducts.price * quantityProductsLocalStorage;
      nouveauPrixTotal += newTotalProductPricePanier;
      console.log("Nouveau prix total panier", nouveauPrixTotal);
    }
    //On affichage le nouveau prix total du panier dans le html
    document.getElementById("totalPrice").innerText = nouveauPrixTotal;
  }
}

/**
 * Fonction qui permettre de modifier la quantité d'un article du panier
 */
let messageErrorQuantity = false;
function modifierLaQuantite() {
  let changeQuantity = document.querySelectorAll(".itemQuantity");
  changeQuantity.forEach((item) => {
    //On écoute le changement sur l'input "itemQuantity"
    item.addEventListener("change", (event) => {
      event.preventDefault();
      choiceQuantity = Number(item.value);
      let myArticle = item.closest("article");

      // On récupère dans le localStorage l'élément (même id et même couleur) dont on veut modifier la quantité
      let selectMyArticleInLocalStorage = productRegisterDanLocalStorage.find(
        (element) =>
          element.idProduct === myArticle.dataset.id &&
          element.colorProduct === myArticle.dataset.color
      );

      /**
       * Si la quantité est comprise entre 1 et 100 et que c'est un nombre entier
       * on met à jour la quantité dans le localStorage et le DOM
       */
      if (
        choiceQuantity > 0 &&
        choiceQuantity <= 100 &&
        Number.isInteger(choiceQuantity)
      ) {
        parseChoiceQuantity = parseInt(choiceQuantity);
        selectMyArticleInLocalStorage.quantityProduct = parseChoiceQuantity;
        localStorage.setItem(
          "produit",
          JSON.stringify(productRegisterDanLocalStorage)
        );
        // Et, on recalcule la quantité et le prix total du panier
        recalculTotalQuantiteTotal();
        recalculPrixTotal();
        messageErrorQuantity = false;
      }
      // Sinon, on remet dans le DOM la quantité indiquée dans le localStorage et on indique un message d'erreur
      else {
        item.value = selectMyArticleInLocalStorage.quantityProduct;
        messageErrorQuantity = true;
      }
      if (messageErrorQuantity) {
        alert(
          "La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100 et être un nombre entier. Merci de rectifier la quantité choisie."
        );
      }
    });
  });
}

/**
 * Fonction qui permet à l'utilisateur de Supprimer un article du panier
 * On recalcule le prix et la quantité totale des produits à la fin de la suppression du produit
 *
 */
function supprimeProduit() {
  let selectSupprimer = document.querySelectorAll(".deleteItem");
  selectSupprimer.forEach((selectSupprimer) => {
    selectSupprimer.addEventListener("click", (event) => {
      event.preventDefault();
      // On pointe le parent hiérarchique <article> du lien "supprimer"
      let myArticle = selectSupprimer.closest("article");
      console.log(myArticle);
      // on filtre les éléments du localStorage pour ne garder que ceux qui sont différents de l'élément qu'on supprime
      productRegisterDanLocalStorage = productRegisterDanLocalStorage.filter(
        (element) =>
          element.idProduct !== myArticle.dataset.id ||
          element.colorProduct !== myArticle.dataset.color
      );
      // On met à jour le localStorage
      localStorage.setItem(
        "produit",
        JSON.stringify(productRegisterDanLocalStorage)
      );
      //Le message d'alert pour avertir l'uitilisateur qu'il est sur le point de supprimer le produit
      alert(
        "Vous allez supprimer ce produit de votre panier. Valider votre choix en cliquant sur Ok !."
      );
      // On supprime physiquement la balise <article> du produit que l'on supprime depuis son parent, si elle existe
      if (myArticle.parentNode) {
        myArticle.parentNode.removeChild(myArticle);
      }

      /**
       * Si le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide),
       * on affiche "Le panier est vide"

       */
      if (
        productRegisterDanLocalStorage === null ||
        productRegisterDanLocalStorage.length === 0
      ) {
        //message si le panie est vide
        messagePanierVide();
        location.reload();
      } else {
        // Et, on recalcule la quantité et le prix total du panier

        recalculTotalQuantiteTotal();
        recalculPrixTotal();
      }
    });
  });
}

/**
 * Fonction pour afficher du panier "Le panier est vide !"
 */
function messagePanierVide() {
  compositionProduitsPanier = "Le panier est vide !";
  let titreArticle = document.createElement("h2");
  cartItems.appendChild(titreArticle);
  titreArticle.innerText = compositionProduitsPanier;
  // On insère 0 dans le html pour la quantité et le prix du panier
  document.getElementById("totalQuantity").innerText = 0;
  document.getElementById("totalPrice").innerText = 0;
}

/**
 * Contrôle des infos avec Regex et Récupération des données du formulaire
 * Création des expressions régulières pour contrôler les infos entrées par l'utilisateur
 */
let nomPrenomVilleRegExp = new RegExp(
  "^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);
let addressRegex = new RegExp(
  "^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);
let emailRegex = new RegExp(
  "^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$"
);

//Récupération des coordonnées du formulaire client et mise en variable
let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputAddress = document.getElementById("address");
let inputCity = document.getElementById("city");
let inputEmail = document.getElementById("email");
//Déclaration des variables pour vérifier la bonne valeur des champs du formulaire
let checkValueFirstName;
let checkValueLastName;
let checkValueAddress;
let checkValueCity;
let checkValueEmail;

// Ecoute du contenu du champ "prénom", Vérification du prénom et affichage d'un message si celui-ci n'est pas correct
inputFirstName.addEventListener("change", function () {
  let firstNameErrorMsg = inputFirstName.nextElementSibling;
  checkValueFirstName = nomPrenomVilleRegExp.test(inputFirstName.value);
  if (checkValueFirstName) {
    firstNameErrorMsg.innerText = "";
    errorFormulaireFirstName = false;
  } else {
    firstNameErrorMsg.innerText = "Format du prénom incorrect.";
    errorFormulaireFirstName = true;
  }
});

// Ecoute du contenu du champ "nom", Vérification du nom et affichage d'un message si celui-ci n'est pas correct
inputLastName.addEventListener("change", function () {
  let lastNameErrorMsg = inputLastName.nextElementSibling;
  checkValueLastName = nomPrenomVilleRegExp.test(inputLastName.value);
  if (checkValueLastName) {
    lastNameErrorMsg.innerText = "";
    errorFormulaireLastName = false;
  } else {
    lastNameErrorMsg.innerText = "Format du nom incorrect.";
    errorFormulaireLastName = true;
  }
});

// Ecoute du contenu du champ "adresse", Vérification de l'adresse et affichage d'un message si celle-ci n'est pas correcte
inputAddress.addEventListener("change", function () {
  let addressErrorMsg = inputAddress.nextElementSibling;
  checkValueAddress = addressRegex.test(inputAddress.value);
  if (checkValueAddress) {
    addressErrorMsg.innerText = "";
    errorFormulaireAddress = false;
  } else {
    addressErrorMsg.innerText = "Format de l'adresse incorrect.";
    errorFormulaireAddress = true;
  }
});

// Ecoute du contenu du champ "ville", Vérification de la ville et affichage d'un message si celle-ci n'est pas correcte
inputCity.addEventListener("change", function () {
  let cityErrorMsg = inputCity.nextElementSibling;
  checkValueCity = nomPrenomVilleRegExp.test(inputCity.value);
  if (checkValueCity) {
    cityErrorMsg.innerText = "";
    errorFormulaireCity = false;
  } else {
    cityErrorMsg.innerText = "Format de la ville incorrect.";
    errorFormulaireCity = true;
  }
});

// Ecoute du contenu du champ "email", Vérification de l'email et affichage d'un message si celui-ci n'est pas correct
inputEmail.addEventListener("change", function () {
  let emailErrorMsg = inputEmail.nextElementSibling;
  checkValueEmail = emailRegex.test(inputEmail.value);
  if (checkValueEmail) {
    emailErrorMsg.innerText = "";
    errorFormulaireEmail = false;
  } else {
    emailErrorMsg.innerText = "Veuillez renseigner un email correct.";
    errorFormulaireEmail = true;
  }
});

/**
 * la fonction pour la gestion du panier
 * Si le panier est vide on envoie un message à l'utiloisteur lui indiquant,
 * que son panier est vide
 *
 */
function panierVide() {
  if (
    productRegisterDanLocalStorage === null ||
    productRegisterDanLocalStorage.length === 0
  ) {
    messagePanierVide();
    //Si le client clique quand même sur le bouton commander, on lui rappelle que le panier est vide
    boutonCommander.addEventListener("click", (event) => {
      alert("Votre panier est vide !");
      event.preventDefault();
    });
  }
  //Si le panier n'est pas vide alors, on affiche le contenu du localStorage
  else {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => {
        mesProduits = data;
        /**
         * appel des fonctions
         * la fonction traitementData on lui passe en paramettre les données
         * Appel de la fonction Supprimer un produit
         * Appel de le fonction Modifier la quantité d'un produit
         */
        traitementData(data);
        supprimeProduit();
        modifierLaQuantite();
      });
    //apeel de la fonction pour la validation de commande
    commandeValide();
  }
}
panierVide();

/**
 * la fonction commandeValide() permet de valider la commande reçu
 * Elle déclanche un événement lors du clique sur le bouton
 */
function commandeValide() {
  //Ecoute du bouton Commander
  boutonCommander.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    if (
      productRegisterDanLocalStorage === null ||
      productRegisterDanLocalStorage.length === 0
    ) {
      alert("Votre panier est vide !");
    }
    //appel de validation des données on lui passe l'evenement qui été cliqué
    validationData(event);
  });
}

//fonction pour la validation des donnees
function validationData(event) {
  {
    // On vérifie que tous les champs sont bien renseignés, sinon on indique un message à l'utilisateur
    // On vérifie qu'aucun champ n'est vide
    if (
      !inputFirstName.value ||
      !inputLastName.value ||
      !inputAddress.value ||
      !inputCity.value ||
      !inputEmail.value
    ) {
      alert("Vous devez renseigner tous les champs !");
      event.preventDefault();
    }
    // On vérifie que les champs sont correctement remplis suivant les regex mises en place
    else if (
      errorFormulaireFirstName === true ||
      errorFormulaireLastName === true ||
      errorFormulaireAddress === true ||
      errorFormulaireCity === true ||
      errorFormulaireEmail === true
    ) {
      alert(
        "Veuillez vérifier les champs du formulaire et les remplir correctement !"
      );
      event.preventDefault();
    } else {
      //Récupération des id des produits du panier, dans le localStorage
      let idProducts = [];
      for (let item = 0; item < productRegisterDanLocalStorage.length; item++) {
        idProducts.push(productRegisterDanLocalStorage[item].idProduct);
      }

      // On cré un objet dans lequel on met les infos "Contact" et les infos "Produits du panier" (l'id)
      const order = {
        contact: {
          firstName: inputFirstName.value,
          lastName: inputLastName.value,
          address: inputAddress.value,
          city: inputCity.value,
          email: inputEmail.value,
        },
        products: idProducts,
      };

      // On indique la méthode d'envoi des données
      const requete = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      };
      envoieCommande(requete);
    }
  }
}

/**
 *
 * la fonction traitementData permet de créer les éléments html
 */
function traitementData(data) {
  // on récupère la couleur, la quantité et l'id de tous les produits contenus dans le localstorage et on les met dans des variables
  for (let i = 0; i < productRegisterDanLocalStorage.length; i++) {
    let colorProductPanier = productRegisterDanLocalStorage[i].colorProduct;
    let idProductPanier = productRegisterDanLocalStorage[i].idProduct;
    quantityProductPanier = productRegisterDanLocalStorage[i].quantityProduct;

    //on ne récupère que les données des canapés dont _id (de l'api) correspondent à l'id dans le localStorage
    const compositionProduitsPanier = data.find(
      (element) => element._id === idProductPanier
    );

    // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
    priceProductPanier = compositionProduitsPanier.price;

    //Création de la balise article avec comme classe cart__item
    let newArticle = document.createElement("article");
    newArticle.setAttribute("class", "cart__item");
    newArticle.setAttribute("data-id", `${idProductPanier}`);
    newArticle.setAttribute("data-color", `${colorProductPanier}`);
    cartItems.appendChild(newArticle);

    //Création de la div avec pour classe cart__item__img
    let newDivImg = document.createElement("div");
    newDivImg.setAttribute("class", "cart__item__img");
    newArticle.appendChild(newDivImg);

    //Création de la balise image qui contiendra la photo de chaque canapé
    let newImg = document.createElement("img");
    newImg.setAttribute("src", compositionProduitsPanier.imageUrl);
    newImg.setAttribute("alt", compositionProduitsPanier.altTxt);
    newDivImg.appendChild(newImg);

    //Création de la div avec pour classe cart__item__content
    let newDivContent = document.createElement("div");
    newDivContent.setAttribute("class", "cart__item__content");
    newArticle.appendChild(newDivContent);

    //Création de la div avec pour classe cart__item__content__description
    let newDivContentDescription = document.createElement("div");
    newDivContentDescription.setAttribute(
      "class",
      "cart__item__content__description"
    );
    newDivContent.appendChild(newDivContentDescription);

    //Création d'une balise titre h2 qui indique le nom du produit choisi par l'utilisateur
    let newTitle = document.createElement("h2");
    newTitle.innerText = compositionProduitsPanier.name;
    newDivContentDescription.appendChild(newTitle);

    //Création d'une balise p qui indique la couleur choisie par l'utilisateur
    let newDescriptionColor = document.createElement("p");
    newDescriptionColor.innerText = colorProductPanier;
    newDivContentDescription.appendChild(newDescriptionColor);

    //Création d'une balise p qui indique le prix du canapé
    let newPPrice = document.createElement("p");
    newPPrice.innerText = compositionProduitsPanier.price + " €";
    newDivContentDescription.appendChild(newPPrice);

    //Création de la div avec pour classe cart__item__content__settings
    let newDivContentSettings = document.createElement("div");
    newDivContentSettings.setAttribute(
      "class",
      "cart__item__content__settings"
    );
    newDivContent.appendChild(newDivContentSettings);

    // Création de la div avec pour classe cart__item__content__settings__quantity
    let newDivContentSettingsQuantity = document.createElement("div");
    newDivContentSettingsQuantity.setAttribute(
      "class",
      "cart__item__content__settings__quantity"
    );
    newDivContentSettings.appendChild(newDivContentSettingsQuantity);

    //Création d'une balise p qui indique le texte "Qté :"
    let newPQuantite = document.createElement("p");
    newPQuantite.innerText = "Qté :";
    newDivContentSettingsQuantity.appendChild(newPQuantite);

    //Création d'une balise input avec la classe "itemQuantity" qui permet de modifier la quantité
    let newPInput = document.createElement("input");
    newPInput.setAttribute("type", "number");
    newPInput.setAttribute("class", "itemQuantity");
    newPInput.setAttribute("name", "itemQuantity");
    newPInput.setAttribute("min", "1");
    newPInput.setAttribute("max", "100");
    newPInput.setAttribute("value", `${quantityProductPanier}`);
    newDivContentSettingsQuantity.appendChild(newPInput);

    //Création de la div avec pour classe cart__item__content__settings__delete
    let newDivContentSettingsDelete = document.createElement("div");
    newDivContentSettingsDelete.setAttribute(
      "class",
      "cart__item__content__settings__delete"
    );
    newDivContentSettings.appendChild(newDivContentSettingsDelete);

    //Création d'une balise p qui indique le prix du canapé
    let newPDelete = document.createElement("p");
    newPDelete.setAttribute("class", "deleteItem");
    newPDelete.innerText = "Supprimer";
    newDivContentSettingsDelete.appendChild(newPDelete);

    //Appel de la fonction pour calculer la qtité totale de produits & le prix total du panier, au chargement de la page Panier.html
    montantEtQuantiteTotalPanier();
  }
}

/**
 *
 *  la fonction envoie les données reçu dans l'url
 */
function envoieCommande(requete) {
  // on envoie les données Contact et l'id des produits à l'API
  fetch("http://localhost:3000/api/products/order", requete)
    .then((response) => response.json())
    .then((data) => {
      // on redirige vers la page de confirmation de commande en passant l'orderId (numéro de commande) dans l'URL
      document.location.href = `confirmation.html?orderId=${data.orderId}`;
    })
    .catch((err) => {
      console.log("Erreur Fetch product.js", err);
      alert("Un problème a été rencontré lors de l'envoi du formulaire.");
    });
  localStorage.clear();
}
