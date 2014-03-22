<?php
// Cloud9 IDE - Workaround to download single files or directories
// WARNING: exclude this page before deploying to production

// choose 'dir' for directory and 'file' for single file download
$file = 'chrome.zip';

  $dlfile = $file;
  header('Content-Type: application/octet-stream');
  header('Content-Disposition: attachment;filename='.basename($dlfile));


if (file_exists($dlfile)) {
  header('Content-Length: ' . filesize($dlfile));
  ob_clean();
  flush();
  readfile($dlfile);
}
