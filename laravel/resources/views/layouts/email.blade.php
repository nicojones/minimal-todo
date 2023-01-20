@inject('functions', '\App\Functions\Functions')

<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Maven+Pro&family=Roboto:wght@300&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Maven Pro', 'Roboto', sans-serif !important; font-size: 16px;">
  <h1><img src="{{ env('APP_URL') }}/logo.png" style="height: 40px;"> MinimalTodo</h1>

  <main>
    @yield('content')
  </main>
</body>
</html>
