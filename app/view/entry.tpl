<!DOCTYPE html>
<html class="dark"> 
    <head> 
    <meta charset="utf-8">
        <title>{{ name }}</title>
        <link rel="stylesheet" href="/static/normalize.css">
        <link href="/static/logo.png" rel="icon" type="image/x-icon">
    </head>
    <body style="margin: 0;">
        <div id="root"></div>
    </body>
</html>
<style>
</style>
<script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
<script type="text/javascript">
    try {
        // 变向把参数挂载到 window 上 意味着，在 start 启动后，就会把默认属性挂载到 window 上
        window.env = document.getElementById('env').value;
        const options = document.getElementById('options').value;
        window.options = JSON.parse(options);
    } catch (e) {
        console.log(e);
    }
    
</script>