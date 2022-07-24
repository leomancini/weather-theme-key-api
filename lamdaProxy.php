<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');

    $LAMDA_URL = '';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $LAMDA_URL.'?'.$_SERVER['QUERY_STRING']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($ch);
    curl_close($ch);

    echo $output;
?>
