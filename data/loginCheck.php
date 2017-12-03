<?php
    header("content-type:application/json;charset=utf-8");
    @$uid=$_REQUEST['uid'];
    session_start();
    if($uid==$_SESSION['uid']){
        $output=['code'=>1,'msg'=>$_SESSION['uname']];
        var_dump($output);
        echo json_encode($output);
    }
?>