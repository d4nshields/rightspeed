<html><body>
<?php
// Cloud9 IDE - Workaround to download single files or directories
// WARNING: exclude this page before deploying to production

// choose 'dir' for directory and 'file' for single file download
$file_or_dir = 'file';
$file = 'dist/chrome.crx';
$dir = 'dist';

if ($file_or_dir == 'dir') {
  $dlfile = "__c9all.zip";
  exec('zip '.$dlfile.' '.$dir.'/*');
  header("Content-Type: archive/zip");
  header("Content-Disposition: attachment; filename=__c9all.zip");
} else {
  $dlfile = $file;
  header('Content-Type: application/octet-stream');
  header('Content-Disposition: attachment;filename='.basename($dlfile));
}

if (file_exists($dlfile)) {
  header('Content-Length: ' . filesize($dlfile));
  ob_clean();
  flush();
  readfile($dlfile);
  if ($file_or_dir == 'dir') unlink($dlfile);
  exit;
}

?>
</body></html>
