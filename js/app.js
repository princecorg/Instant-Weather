document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments
  const codePostalInput = document.getElementById('code-postal')
  const communeSelect = document.getElementById('communeSelect')
  const validationButton = document.getElementById('validationButton')

  codePostalInput.addEventListener('input', () => {
    const codePostal = codePostalInput.value

    // Cacher la liste déroulante et le bouton de validation
    communeSelect.style.display = 'none'
    validationButton.style.display = 'none'

    // Vérification du code postal : 5 chiffres
    if (/^\d{5}$/.test(codePostal)) {
      // Requête API en utilisant le code postal saisi
      fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)

          if (data && data.length === 1) {
            // Afficher la commune retournée et le bouton de validation
            const commune = data[0]
            communeSelect.style.display = 'block'
            communeSelect.innerHTML = `<option value="${commune.code}">${commune.nom}</option>`
            validationButton.style.display = 'block'
          } else if (data && data.length > 1) {
            // Afficher la liste déroulante et ajouter les options
            validationButton.style.display = 'block'
            communeSelect.style.display = 'block'
            communeSelect.innerHTML = ''
            data.forEach(commune => {
              const option = document.createElement('option')
              option.value = commune.code
              option.textContent = commune.nom
              communeSelect.appendChild(option)
            })
          }
        })
        .catch(error => {
          console.error('Erreur lors de la requête API:', error)
        })
    } else {
      //console.log('format invalide')
    }
  })

  // Ajout de l'écouteur d'événement "click" sur le bouton de validation
  validationButton.addEventListener('click', () => {
    const selectedCommune = communeSelect.value

    if (selectedCommune != null) {
      console.log('valeur ', selectedCommune)

      // Effectuer ici votre requête API en utilisant la commune sélectionnée
      fetch(
        `https://api.meteo-concept.com/api/forecast/daily/0?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${selectedCommune}`
      )
        .then(response => response.json())
        .then(data => {
          console.log('Détails de la commune sélectionnée:', data)
          createCard(data)
        })
        .catch(error => {
          console.error('Erreur lors de la requête API:', error)
        })
    }
  })
})
