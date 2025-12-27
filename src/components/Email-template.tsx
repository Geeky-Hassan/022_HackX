export const WaitingListEmail = (username: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
          
    <title>Welcome to Our Waiting List!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            background-color: #7386FD;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .button {
            background-color: transparent;
            border: 1px solid #7386FD;
            color: #7386FD;
            padding: 10px 20px;
            text-decoration: none;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #7386FD;
        }
        .socialIcons {
            display: flex;
            justify-content: center; /* Center the icons */
            gap: 15px; /* Space between icons */
            margin: 20px 0px; /* Margin around the icon container */
        }
        .icon {
            font-size: 15px; /* Icon size */
            padding: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Our Waiting List!</h1>
        </div>
        <div class="content">
            <p>Yahoo <strong>${username}</strong>! You have joined our waiting list.</p>
            <p>We're excited to have you on board. For more details, please visit our website.</p>
            <a href="https://mypath.one" target="_blank" rel="noopener noreferrer" class="button">Visit Our Website</a>
            <p>Stay Tuned!</p>
            <p>And Join our socials for updates:</p>
            
            <!-- Social Icons Section -->
            <div class="socialIcons">
                <a href="https://www.facebook.com/profile.php?id=61566506248800" class="icon" target="_blank" rel="noopener noreferrer">
                  
                <img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-512.png" width="25px" height="25px" alt="Facebook" />
                   </a>
                   <a href="https://www.instagram.com/mypath_ai" target="_blank" class="icon" rel="noopener noreferrer">
                   <img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-512.png" width="25px" height="25px" alt="Instagram" />
                   
                   </a>
                   <a href="https://www.linkedin.com/company/mypathai"  class="icon" target="_blank" rel="noopener noreferrer">
                   
                   <img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Linkedin_unofficial_colored_svg-512.png" width="25px" height="25px" alt="LinkedIn" />
                   </a>
                   <a href="https://www.youtube.com/@mypathai" target="_blank" class="icon" rel="noopener noreferrer">
                   <img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube_colored_svg-512.png" width="25px" height="25px" alt="YouTube" />
                    
                </a>
            </div>

        </div>
        <div class="footer">
            <p>© 2024 MyPath AI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
