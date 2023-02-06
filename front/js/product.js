// Récupération de la chaîne de requête dans l'URL du navigateur et Extraction de l'ID de l'URL
const productId = new URLSearchParams(window.location.search).get("id");

//console.log(productId);

/**
 * Si on a bien récupéré un id on récupère les données de l'API correspondant à cet id
 * La methode fetch permet d'envoyer une requête  HTTP
 * en prenant comme paramètre dans l'URL l'id du produit cliqué sur la page index.HTML.
 * Si la réponse est résolue. Elle est retournée en format textuel JSON et renvoie
 * une nouvelle promesse grâce à la méthode JSON. La 2nde promesse traite les données reçues
 */

if (productId !== null) {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => response.json())
    .then((produitSelectionne) => {
      console.log(produitSelectionne);
      //appel de la fonction filtrerproduits
      filtrerProduits(produitSelectionne);
      //appel de la fonction ajouterProduiDansPanier
      ajouterProduiDansPanier(produitSelectionne);
      // Récupération des données sélectionnées par l'utilisateur pour ajouter au panier
    })
    //la gestion des erreurs concernant les différents des produits incorrecte
    .catch((err) => {
      console.log(
        "Erreur Fetch product.js : l'id du produit est incorrect.",
        err
      );
      alert(`Le produit sélectionné n'a pas été trouvé !`);
      window.location.href = "index.html";
    });
} else {
  console.log("L'id du produit n'a pas été indiqué dans l'url.");
  alert(`Le produit sélectionné n'a pas été trouvé !`);
  window.location.href = "index.html";
}

/**
 *
 *  La fonction ajouterProduitDansPanier permet de gerer les différents ajouts des produits
 * dans le panier. Elle déclanche un écouteur d'évement lorsque l'utilisateur clique sur le bouton
 * ajouter dans le panier
 */

function ajouterProduiDansPanier(produitSelectionne) {
  const ajoutProduitDansPanier = document.getElementById("addToCart");
  // Ecoute du bouton Panier pour envoyer les choix de l'utilisateur
  ajoutProduitDansPanier.addEventListener("click", (event) => {
    event.preventDefault();
    //appel de la fonction du choix de la couleur
    choixCouleur();
    /**
     * Récupération des données (id, couleur et quantité) après les choix faits par l'utilisateur
     * une condition pour contriante l'utilisateur de bien sélectionner une couleur
     * que la quantité indiquée par l'utilisateur soit comprise entre 1 et 100
     * et que la quantité entrée par l'utilisateur soit un nombre entier
     */
    if (
      choixDeLaCouleur !== "" &&
      choixQuantity > 0 &&
      choixQuantity <= 100 &&
      parseInt(choixQuantity)
    ) {
      let optionsProduct = {
        idProduct: produitSelectionne._id,
        colorProduct: choixDeLaCouleur,
        quantityProduct: choixQuantity,
      };
      console.log(optionsProduct);
      // importer les produits dans Le LocalStorage
      let messageLocalStorageUpdating = false;

      //Fonction ajouter dans le localStorage un produit sélectionné par l'utilisatueur, avec ses options (id, couleur, quantité)
      const ajouterProduitDansLeLocalStorage = () => {
        // Si le produit et la couleur choisis existent déjà dans le localStorage alors on incrémente uniquement la quantité
        let resultat = produitEnregistreDansLocalStorage.find((produit) => {
          return (
            produit.idProduct === optionsProduct.idProduct &&
            produit.colorProduct === optionsProduct.colorProduct
          );
        });
        if (resultat) {
          const nouvelleQuantite =
            parseInt(resultat.quantityProduct) +
            parseInt(optionsProduct.quantityProduct);
          if (nouvelleQuantite <= 100) {
            // On met la variable message sur false pour pouvoir afficher un message plus approprié
            messageLocalStorageUpdating = false;
            resultat.quantityProduct =
              parseInt(resultat.quantityProduct) +
              parseInt(optionsProduct.quantityProduct);
            alert(
              `La quantité du produit ${produitSelectionne.name} de couleur ${choixDeLaCouleur} a bien été mise à jour.`
            );
          } else {
            // le messageLocalStorageUpdating est à false pour pouvoir afficher un message plus approprié
            messageLocalStorageUpdating = false;
            alert(
              "La quantité d'un article (même référence et même couleur) ne peut pas dépasser 100. Merci de rectifier la quantité choisie."
            );
          }
        }
        // Si le produit et la couleur choisis n'existent pas encore dans le localStorage alors on ajoute le produit et les options choisies
        else {
          //snon le messageLocalStorageUpdating  est à true
          messageLocalStorageUpdating = true;
          // on ajoute les options du produit choisi dans les produitEnregistreDansLocalStorage
          produitEnregistreDansLocalStorage.push(optionsProduct);
        }

        // on connvertir en format JSON et envoi des infos dans la clé "produit" du localStorage
        localStorage.setItem(
          "produit",
          JSON.stringify(produitEnregistreDansLocalStorage)
        );
      };

      //controler si à la fin le localStorage est vide ou non
      let produitEnregistreDansLocalStorage = JSON.parse(
        localStorage.getItem("produit")
      );

      // si le localStorage contient déjà une clé "produit"
      if (produitEnregistreDansLocalStorage) {
        ajouterProduitDansLeLocalStorage();
        console.log(produitEnregistreDansLocalStorage);
      }
      // sinon le localStorage est vide
      else {
        produitEnregistreDansLocalStorage = [];
        ajouterProduitDansLeLocalStorage();
        console.log(produitEnregistreDansLocalStorage);
        // On met la variable message sur false pour pouvoir afficher un message plus approprié
        messageLocalStorageUpdating = false;
        alert(
          `Félicitations !! Vous venez d'ajouter votre premier produit dans le panier ! `
        );
      }
      // si le messageLocalStorageUpdating est vrai alors on affiche ce message :
      if (messageLocalStorageUpdating) {
        alert(
          `Le produit ${produitSelectionne.name} de couleur ${choixDeLaCouleur} a bien été ajouté au panier.`
        );
      }
    }
    // si la couleur n'est pas sélectionnée ou la quantité non comprise entre 1 et 100 alors on affiche un message d'alerte
    else {
      alert(
        `La couleur n'est pas sélectionnée et/ou la quantité n'est pas comprise entre 1 et 100 ou n'est pas un nombre entier. Veuillez vérifier !`
      );
    }
  });
}

/**
 * La fonction filtrerProduits() permet de mettre d'ajouter le produit selectionné
 * On créer les elements html du produit
 *
 */
function filtrerProduits(produitSelectionne) {
  // Ajout du nom du produit dans la balise title du navigateur
  document.title = produitSelectionne.name;
  // Création d'une balise img manquante
  const imageArticle = document.createElement("img");
  // Récupération des données de l'API et destination des éléments
  imageArticle.src = produitSelectionne.imageUrl;
  imageArticle.alt = produitSelectionne.altTxt;
  document.getElementsByClassName("item__img")[0].appendChild(imageArticle);
  document.getElementById("title").innerText = produitSelectionne.name;
  document.getElementById("price").innerText = produitSelectionne.price + " ";
  document.getElementById("description").innerText =
    produitSelectionne.description;
  //appel de la fonction ajouterCouleur()
  ajouterCouleur(produitSelectionne);
}

/**
 *
 * La fonction ajouterCouleur permet d'ajouter la couleur du produit selectionné
 * on utilise une boucle forEach pour parcourir les différentes couleur
 *
 */
function ajouterCouleur(produitSelectionne) {
  produitSelectionne.colors.forEach(function (color) {
    const optionCouleur = document.createElement("option");
    const couleurSelectionnee = document.getElementById("colors");
    // Récupération les options de couleur
    optionCouleur.value = color;
    optionCouleur.innerText = color;
    // Ajout de l'option à la couleur sélectionnée
    couleurSelectionnee.appendChild(optionCouleur);
  });
}

/**
 * Cette fonction permet de gerer le choix de la couleur de l'utilisateur
 *
 */
function choixCouleur() {
  // Sélection de l'id pour le choix de la couleur et inserer le choix de l'utilisateur.
  const colorId = document.getElementById("colors");
  choixDeLaCouleur = colorId.value;
  //le choix de la quantité du produit par l'utilisateur
  const quantity = document.getElementById("quantity");
  choixQuantity = Number(quantity.value);
  console.log(choixQuantity);
}
