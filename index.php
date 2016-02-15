<?php
    $base = $_SERVER['REQUEST_URI'];
    preg_match_all("/\/(.*?)\/(.*?)/", $base, $matches);
    $base = (count($matches[1])!=0) ? "/".$matches[1][0]."/" : "/";
?>
<html ng-app="gameCreator">
<base href="<?php echo $base; ?>">
<head>
    <title>Game Creator</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/game-viewer.css">
    <link rel="stylesheet" href="assets/css/action-bar.css">
    <link rel="stylesheet" href="assets/css/builder.css">
    <link rel="stylesheet" href="assets/css/player.css">
    <script type="application/javascript" src="assets/libs/angular.js"></script>
    <script type="application/javascript" src="assets/libs/angular-route.js"></script>
    <script type="application/javascript" src="app/app.module.js"></script>
    <script type="application/javascript" src="app/app.route.js"></script>
    <script type="application/javascript" src="app/shared/services/gameFactory.js"></script>
    <script type="application/javascript" src="app/shared/services/tilesetFactory.js"></script>
    <script type="application/javascript" src="app/shared/services/mapFactory.js"></script>
    <script type="application/javascript" src="app/shared/services/keyboardFactory.js"></script>
    <script type="application/javascript" src="app/shared/services/characterFactory.js"></script>
    <script type="application/javascript" src="app/components/rpg-builder/rpgBuilderController.js"></script>
    <script type="application/javascript" src="app/components/player/playerController.js"></script>
    <script type="application/javascript" src="app/shared/action-bar/actionBarDirective.js"></script>
    <script type="application/javascript" src="app/shared/game-viewer/gameViewerDirectective.js"></script>
</head>
<body>
    <div id="main-container">
        <div ng-view></div>
    </div>
</body>
</html>