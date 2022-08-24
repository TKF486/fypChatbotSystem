
<form action="import" method="post" enctype="multipart/form-data">
{{csrf_field()}}
<div>
<label for="file">Select a file to import</label>
<input type="file" name="file" id="file" class="form-control">
</div>

<button>
    Upload
</button>

</form>
