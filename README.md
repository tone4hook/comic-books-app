# Comic Books App

A web application that features a comic book store locator and weekly new comic listings. The application uses Yelp Fusion API, Google Maps JavaScript API, and Comic Vine API as the data model. Bootstrap 4, Knockout, and jQuery are dependencies, while Webpack and Babel are devDependencies. **Note:** *NPM local servers like http-server and webpack-dev-server will not handle the PHP Yelp Fusion verification without changing the settings in their respective configs. WAMP, MAMP, and XAMPP will be fine.*

## Features

* Comic book store locator
* New comic books listing by week
* Filter store results with text input
* Filter comic book page results by text input

## Getting Started

**Node JS and Composer (Dependency Manager for PHP) are needed to run this project.**
* Clone or download the repo
* Open Terminal (command line) and navigate to the comic-books-app directory
* Run `npm update --save-dev`
* Run `npm update`
* Build command is `npm run build`

### Prerequisites

* Node JS

## Built With

* [Knockout](http://knockoutjs.com/)
* [jQuery](https://www.npmjs.com/package/jquery)
* [Babel](https://babeljs.io/) - JavaScript compiler
* [Webpack](https://webpack.js.org/) - Module bundler
* [Bootstrap 4](http://getbootstrap.com/) - Front-end component library
* [Popper.js](https://www.npmjs.com/package/popper.js) - Bootstrap 4 requires this 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
## Acknowledgments

* (https://comicvine.gamespot.com/api/) - Comic Vine API
* (https://developers.google.com/maps/documentation/javascript/) - Google Maps JavaScript API
* (https://www.yelp.com/developers/documentation/v3) - Yelp Fusion
