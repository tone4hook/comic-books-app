<?php

// API key placeholders that must be filled in by users.
// You can find it on
// https://www.yelp.com/developers/v3/manage_app

define("YELP_KEY", "YourYelpApiKeyHere");

// Complain if credentials haven't been filled out.
assert("YELP_KEY", "Please supply your API key.");

$GLOBALS["API_KEY"] = YELP_KEY; // set GLOBAL API_KEY

// API constants, you shouldn't have to change these.
$API_HOST = "https://api.yelp.com";
$SEARCH_PATH = "/v3/businesses/search";

// Defaults for our simple query.
$DEFAULT_TERM = "comic book store";
$DEFAULT_LATITUDE = 40.650002;
$DEFAULT_LONGITUDE = -73.949997;
$SEARCH_LIMIT = 10;

/**
 * Makes a request to the Yelp API and returns the response
 *
 * @param    $host    The domain host of the API
 * @param    $path    The path of the API after the domain.
 * @param    $url_params    Array of query-string parameters.
 * @return   The JSON response from the request
 */
 function request($host, $path, $url_params = array()) {
    // Send Yelp API Call
    try {
        $curl = curl_init();
        // the following line is for development ONLY
        // Some localhosts complain about SSL verify
        // delete the line below before production
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,false); // delete before production
        if (FALSE === $curl)
            throw new Exception('Failed to initialize');

        $url = $host . $path . "?" . http_build_query($url_params);
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,  // Capture response.
            CURLOPT_ENCODING => "",  // Accept gzip/deflate/whatever.
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "authorization: Bearer " . $GLOBALS['API_KEY'],
                "cache-control: no-cache",
            ),
        ));

        $response = curl_exec($curl);

        if (FALSE === $response)
            throw new Exception(curl_error($curl), curl_errno($curl));
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if (200 != $http_status)
            throw new Exception($response, $http_status);

        curl_close($curl);
    } catch(Exception $e) {
        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);
    }

    return $response;
}

/**
 * Query the Search API by a search term and location
 *
 * @param    $term        The search term passed to the API
 * @param    $latitude    The latitude of the business to query
 * @param    $longitude    The longitude of the business to query
 * @return   The JSON response from the request
 */
function search($term, $latitude, $longitude) {
    $url_params = array();

    $url_params['term'] = $term;
    $url_params['limit'] = $GLOBALS['SEARCH_LIMIT'];
	$url_params['latitude'] = $latitude;
	$url_params['longitude'] = $longitude;

    return request($GLOBALS['API_HOST'], $GLOBALS['SEARCH_PATH'], $url_params);
}

/**
 * Queries the API by the input values from the user
 *
 * @param    $term        The search term to query
 * @param    $latitude    The latitude of the business to query
 * @param    $longitude    The longitude of the business to query
 */
function query_api($term, $latitude, $longitude) {
	$response = search($term, $latitude, $longitude);
	$results = json_decode($response);
	header("Content-type: application/json");
	$encoded = json_encode($results);
	echo $encoded;
}


/**
 * User input is handled here
 */
$lat = $_POST['lat'];
$lng = $_POST['lng'];

$term = $GLOBALS['DEFAULT_TERM'];
$latitude = $lat ?: $GLOBALS['DEFAULT_LATITUDE'];
$longitude = $lng ?: $GLOBALS['DEFAULT_LONGITUDE'];

query_api($term, $latitude, $longitude);

?>