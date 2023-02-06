// Sélection de l'emplacement dans lequel on va afficher nos produits, sur la page d'accueil. Ici dans la section avec l'id "items".
const sectionItems = document.querySelector("#items");
/**
 * La fonction affichageProduits() permet d'envoyer une requête HTTP de type GET à l'URL
 * http://localhost:3000/api/products.
 * Si la réponse est résolue. Elle est retournée en format textuel JSON et renvoie
 * une nouvelle promesse grâce à la méthode JSON. La 2nde promesse permet d'extraire la réponse et de traiter
 */

function afficherProduits() {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
      //appel de la function listeProducts()
      listProducts(data);
    })
    .catch((err) => {
      alert(
        `Une erreur s'est produite et ne permet pas d'afficher les produits de notre catalogue. Veuillez nous en excuser !`
      );
      console.log("Erreur Fetch script.js", err);
    });
}
afficherProduits();

//la function listProducts() recois en paramettre l'ensemble de la liste des produits
function listProducts(data) {
  //appel de la fonction traitement de données
  traitementProduits(data);
}

/**
 * la function traitementProduits() recois en paramettre la liste des données
 * la boucle for of permet de parcourir la liste des prdouits à l'intérieur de cette boucle,
 * on crée des éléments HTML avec leurs attributs pour ceux qui en ont. faire les liens parents/enfants des élements crée.
 *
 *
 */
function traitementProduits(data) {
  for (const listProducts of data) {
    console.log(listProducts);
    // on cré les éléments html manquants de la page index.html et on y insère les données de l'api
    let lienArticle = document.createElement("a");
    lienArticle.setAttribute("href", `./product.html?id=${listProducts._id}`);
    sectionItems.appendChild(lienArticle);

    let article = document.createElement("article");
    lienArticle.appendChild(article);

    let imageArticle = document.createElement("img");
    imageArticle.setAttribute("src", listProducts.imageUrl);
    imageArticle.setAttribute("alt", listProducts.altTxt);
    article.appendChild(imageArticle);

    let titreArticle = document.createElement("h3");
    titreArticle.setAttribute("class", "productName");
    titreArticle.innerText = listProducts.name;
    article.appendChild(titreArticle);

    let descriptionArticle = document.createElement("p");
    descriptionArticle.setAttribute("class", "productDescription");
    descriptionArticle.innerText = listProducts.description;
    article.appendChild(descriptionArticle);
  }
}
