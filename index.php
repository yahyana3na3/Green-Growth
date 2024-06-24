<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$apiKey = 'AIzaSyBr1VxW3I6TiJR3QXs_5NmOmb5GXuKVJco';
$searchEngineId = '14c4a0c32269b41e6';

function getCropImage($cropName) {
    global $apiKey, $searchEngineId; 
    $url = "https://www.googleapis.com/customsearch/v1?q=" . urlencode($cropName) . "+crop&cx=$searchEngineId&key=$apiKey&searchType=image&num=1";
    $response = file_get_contents($url);
    if (!$response) {
        return 'No image found';  // Fallback in case the Google API request fails
    }
    $data = json_decode($response, true);
    return $data['items'][0]['link'] ?? 'No image found';
}

function fetchCropDetailsFromWikipedia($cropName) {
    $url = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=" . urlencode($cropName) . "&exintro=1&explaintext=1";
    $context = stream_context_create(array(
        'http' => array(
            'method' => 'GET',
            'header' => "User-Agent: ExampleBot/0.1"
        )
    ));
    $response = file_get_contents($url, false, $context);
    if ($response === false) {
        return "Details not found due to an error in the request.";
    }
    $data = json_decode($response, true);
    if (isset($data['query']['pages'])) {
        $page = $data['query']['pages'][array_keys($data['query']['pages'])[0]];
        if (isset($page['extract'])) {
            return $page['extract']; // This contains a summary of the Wikipedia page
        } else {
            return "No details available for " . $cropName;
        }
    } else {
        return "No details available for " . $cropName;
    }
}

$N = $_POST['N'] ?? '90';
$P = $_POST['P'] ?? '42';
$K = $_POST['K'] ?? '43';
$temperature = $_POST['temperature'] ?? '20';
$humidity = $_POST['humidity'] ?? '82';
$ph = $_POST['pH'] ?? '6';
$rainfall = $_POST['rainfall'] ?? '202';

$pythonPath = 'C:\\Python311\\python.exe';
$scriptPath = 'C:\\predict_crop.py';

$command = "\"$pythonPath\" \"$scriptPath\" $N $P $K $temperature $humidity $ph $rainfall";

$output = shell_exec($command . ' 2>&1');
$predictedCrop = trim($output);


if ($output === null) {
    echo json_encode(["recommended_crop" => "Execution failed without any output from the command."]);
} elseif (empty($output)) {
    echo json_encode(["recommended_crop" => "The command executed, but did not return any output."]);
} else {
    $imageUrl = getCropImage($predictedCrop); 
	$details = fetchCropDetailsFromWikipedia($predictedCrop); 
    echo json_encode([
        "recommended_crop" => $predictedCrop,
        "image_url" => $imageUrl,
		'details' => $details 	
    ]);
}
?>
