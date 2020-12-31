//index.php

<!DOCTYPE html>

<html lang="ja" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>

<body>

<?php
$myfile = fopen("保存したいディレクトリのパス/hoge.txt", "a")  //fileを上書きモードで開く
?>

<?php fwrite($myfile, $_POST['sendPHP']. "\n"); ?>

<?php
fclose($myfile);
?>