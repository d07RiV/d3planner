# d3planner
Diablo III Character Planner  
Source for www.d3planner.com

This repository does not include most server-side scripts (related to importing characters and saving/loading information), but other than that everything should work. Also, 3D viewer data is not included to save space.

If you want to try running it locally, set up a webserver (i.e. XAMPP/Apache) and point it to the trunk directory. I added www.d3local.com -> 127.0.0.1 to my hosts file, but it should work if you refer to it as localhost as well. You can also place it in a subdirectory of your webroot - in this case, change the RewriteBase in .htaccess files.
