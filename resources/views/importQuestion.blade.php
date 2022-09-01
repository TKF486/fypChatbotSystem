<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
</head>
<body>

<div class="container">
  <h2>Bulk Import Question</h2>
  <form action="import" method="post" enctype="multipart/form-data">
  {{csrf_field()}}
    <div class="form-group">
    <label for="file">Select a file to import</label>
    <input type="file" name="file" id="file" class="form-control" required>
    </div>
    
    <!-- <button type="button" class="btn btn-primary">Primary</button> -->
    <a href="../" class="btn btn-info" role="button">Back to Admin Page</a>
    <button type="submit" class="btn btn-default">Submit</button>
  </form>
</div>

</body>
</html>
