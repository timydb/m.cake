<?php
    header("content-type:application/json;charset=utf-8");
    session_start();
    session_unset();
    session_destroy();
    $output=['code'=>1,'msg'=>'logout success'];
    echo json_encode($output);
?>