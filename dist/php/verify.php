<?php

$lat = $_POST['lat'];
$lng = $_POST['lng'];

require __DIR__ . '/vendor/autoload.php';

$provider = new Stevenmaguire\OAuth2\Client\Provider\Yelp([
    'clientId'          => 'YourYelpFusionClientIdHere',
    'clientSecret'      => 'YourYelpFusionClientSecretHere'
]);

try {

    // Try to get an access token using the client credentials grant.
    $accessToken = $provider->getAccessToken('client_credentials');

} catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {

    // Failed to get the access token
    exit($e->getMessage());

}
// Provide the access token to the yelp-php client
$client = new \Stevenmaguire\Yelp\v3\Client(array(
    'accessToken' => $accessToken,
    'apiHost' => 'api.yelp.com' // Optional, default 'api.yelp.com'
));

$parameters = [
    'term' => 'comic book store',
    'limit' => 50,
    'latitude' => $lat,
    'longitude' => $lng
];

try {

    $results = $client->getBusinessesSearchResults($parameters);

} catch (\Stevenmaguire\Yelp\Exception\HttpException $e) {
    $responseBody = $e->getResponseBody(); // string from Http request
     $results = json_decode($responseBody);
}

// if requested by AJAX request return JSON response
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($results);

    header('Content-Type: application/json');

    echo $encoded;
}
// else just display the message
else {
    echo 'Ooops';
}


?>