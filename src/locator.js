// Locator class

class Locator {

    constructor( coordinates = {lat: 40.650002, lng: -73.949997} ) {

        this._coordinates = coordinates;

        this._google = null;

        this._map = null;

        this._infowindows = [];

        this._markers = [];

        this.init();

    } // /constructor

    init() {

        let self = this;

        // Map initializing function
        this._initMap = () => {

            let map = new google.maps.Map( document.getElementById( 'map' ), {
                zoom: 12,
                center: this._coordinates
            }); // /map Object

            self.setGoogleInstance( google, map );

        } // /initMap

        window.initMap = this._initMap;

    } // /init

    setGoogleInstance( google, map ) {

        // set google and map instances
        this._google = google, this._map = map;

    } // /setInstance

    getCoordinates( query ) {

        let self = this;

        let lat = null, lng = null; // reset lat and lng

        let _query = query; // location query string

        let geocoder = new self._google.maps.Geocoder();

        this._coordinatesResponse = new Promise( ( resolve, reject) => {

            geocoder.geocode(

                { address : _query,
                region: 'no'

            }, ( results, status ) => {

                if ( status==self._google.maps.GeocoderStatus.OK ) {

                    lat= results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();

                    self.setMap( lat, lng );

                    resolve( { lat: lat, lng: lng } );

                } else {

                    let reason = new Error( `Something went wrong. Error: ${status}` );

                    reject( reason );

                }

            }); // /geocoder.geocode

        }); // /_coordinatesResponse

        return this._coordinatesResponse;

    } // /setCoordinates

    setMap( lat, lng ) {

        this._coordinates = { lat: lat, lng: lng };

        let panPoint = new google.maps.LatLng( lat, lng );

        this._map.panTo( panPoint );

    } // /setMap

    // addMarkers
    addMarkers( stores ) {

        let self = this;

        // reset markers
        if (this._markers.length > 0) {
            for (let marker of this._markers) {
                marker.setMap(null);
            }
        } // /if

        // Loop through location data
        //
        for ( let [index,store] of stores.entries() ) {

            // initialize and format infowindows
            self._infowindows[index] = new self._google.maps.InfoWindow({
                content: `<div class="card">`
                +`<div class="card-body">`
                +`<h4>${store.name}</h4>`
                +`<address>`
                +`${store.location.address1}<br>`
                +`${store.location.city}<br>`
                +`${store.location.zip_code}<br>`
                +`<a href="tel:${store.phone}">${store.display_phone}</a><br>`
                +`</address>`
                +`</div>`
                +`</div>`
            });

            // initialize map markers
            self._markers[index] = new self._google.maps.Marker({

                position: {lat: store.coordinates.latitude, lng: store.coordinates.longitude},
                map: self._map,
                animation: self._google.maps.Animation.DROP,
                title: store.name

            }); // /initialize map markers

            self._markers[index].addListener('click', self.markerClicked.bind( this, index ) );

        } // /for

    } // /addMarkers

    // markerClicked
    markerClicked( index, e ) {

        let self = this;

        self._infowindows[index].open(self._map, self._markers[index]); // open the infowindow

        // set the animation
        self._markers[index].setAnimation( self._google.maps.Animation.BOUNCE );
        // after timeout end animation
        setTimeout( () => { self._markers[index].setAnimation(null); }, 1400);

    }

} // /Locator

export default Locator;