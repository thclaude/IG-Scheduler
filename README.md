<h1 align="center">Welcome to IESN Scheduler 😎</h1>

### 🏠 [Site](https://iesn.thibaultclaude.be)

## Installation

1. Remplir `credentials-default.json` avec : 
    - votre Bearer (auth sur le portail)
    - votre ID Discord
    - l'url Webhook Discord pour envoyer l'erreur de fetch
2. Renommer `credentials-default.json` en `credentials.json`
3. Lancer ``npm install``

## Lancer

```sh
npm run start
```

## Notes

* Stock en local des blocs + A.A. + code dans le fichier `blocs.json`
    - Possible de parse le site ([lien](https://services.henallux.be/paysage/public/cursus/infocursus/idCursus/6)) mais perte de temps(?) et risque de site off, c'est que une fois par année en toute logique donc créer un cron qui effectue cette tâche à la rentrée
    
## Auteur

👤 **Thibault CLAUDE**

* Github: [@tclaude94](https://github.com/tclaude94)
* Discord : tiiBz#5309

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
