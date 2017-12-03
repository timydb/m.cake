<?php
    header("content-type:application/json;charset=utf-8");
    @$user_name=$_REQUEST['user_name'];
    @$phone=$_REQUEST['phone'];
    @$email=$_REQUEST['email'];
    require('init.php');
    if($user_name!==null){
        $sql="SELECT uname FROM t_user WHERE uname='$user_name'";
    }
    if($phone!==null){
        $sql="SELECT phone FROM t_user WHERE phone='$phone'";
    }
    if($email!==null){
        $sql="SELECT email FROM t_user WHERE email='$email'";
    }
    $result=mysqli_query($conn,$sql);
    $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
    echo json_encode($rows);
?>