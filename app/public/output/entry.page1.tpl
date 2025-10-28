<!DOCTYPE html>

<html> 
<head>
<meta charset="utf-8">
<title>{{ name }}</title>
<link rel="stylesheet" href="/static/normalize.css">
<link href="/static/logo.png" rel="icon" type="image/x-icon">
</head>
<body style="color: red;">
    <h1>Page1 </h1>
    <input id="env" type="text" value="{{ env }}" style="display: none;">
    <input id="options" type="text" value="{{ options }}" style="display: none;">
    <button id="btn" onClick="getProjectList()">发送请求</button>
</body>
</html>
<style>
</style>
<script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
<script type="text/javascript">
    try {
        // 变向把参数挂载到 window 上 意味着，在 start 启动后，就会把默认属性挂载到 window 上
        window.env = document.getElementById('env').value;
        const options = document.getElementById('options').value;
        window.options = JSON.parse(options);
    } catch (e) {
        console.log(e);
    }

    async function  getProjectList() {
        const res = await axios.get('/api/project/list');
        console.log(res);
    }

</script>