// ApiCall class

class ApiCall {

    constructor( url ) {

        this._url = url;

        this._postUrl = 'dist/php/verify.php';

    } // /constructor

    getResponse() {

        // ajax call for API
        return $.ajax({
            url: this._url,
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            jsonpCallback: "jsonCallback"
        }); // /$.ajax

    } // /getResponse

    post( coordinates ) {

        self = this;

        this._coordinates = coordinates;

        // POST values in the background the the script URL
        return $.ajax({

            type: 'POST',
            url: self._postUrl,
            data: self._coordinates

        });

    } // /post


}

export default ApiCall;