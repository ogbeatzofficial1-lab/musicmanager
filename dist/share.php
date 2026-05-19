<?php
/**
 * OGBEATZ HUB - Secure Share Routing Pipeline
 * Tailored for InfinityFree Deployments
 */

// 1. Capture the cryptographic share token from the URL routing
$shareToken = isset($_GET['share']) ? trim($_GET['share']) : '';
$itemName = isset($_GET['name']) ? htmlspecialchars($_GET['name']) : 'Shared Music';

// Default metadata parameters
$pageTitle = "OGBeatz Hub - " . $itemName;
$pageDesc = "Listen to exclusive tracks and high-fidelity masters shared via the OGBeatz preview portal.";
$coverImage = "https://yourdomain.com/logo.svg"; // Fallback to your main asset logo

// 2. Optional: Fast-fetch metadata using an API call to Supabase Edge or directly parsing fallback url parameters
// If your App.tsx passes cover images via URL parameters, we grab them here to load faster on text previews
if (isset($_GET['coverImage']) && filter_var($_GET['coverImage'], FILTER_VALIDATE_URL)) {
    $coverImage = $_GET['coverImage'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title><?php echo $pageTitle; ?></title>
    <meta name="description" content="<?php echo $pageDesc; ?>">

    <meta property="og:type" content="music.playlist">
    <meta property="og:title" content="<?php echo $pageTitle; ?>">
    <meta property="og:description" content="<?php echo $pageDesc; ?>">
    <meta property="og:image" content="<?php echo $coverImage; ?>">
    <meta property="og:site_name" content="OGBeatz Hub">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo $pageTitle; ?>">
    <meta name="twitter:description" content="<?php echo $pageDesc; ?>">
    <meta name="twitter:image" content="<?php echo $coverImage; ?>">

    <style>
        body {
            background-color: #000000;
            color: #71717a;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
        }
        .loader {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(249, 115, 22, 0.1);
            border-top-color: #f97316;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
        }
        h2 {
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            margin: 0;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>

    <div class="loader"></div>
    <h2>Authenticating Space...</h2>

    <script>
        // 3. Hand over execution immediately to your secure React framework
        // This transfers the complete URL parameters (?share=xxx) so App.tsx can validate tokens
        const currentParams = window.location.search;
        
        // Timeout intercept to make sure redirect flows smoothly
        setTimeout(() => {
            window.location.href = "/" + currentParams;
        }, 300);
    </script>
</body>
</html>
