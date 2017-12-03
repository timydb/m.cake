<?php
    header("content-type:application/json;charset=utf-8");
    @$uname=$_REQUEST['uname'];
    @$password=$_REQUEST['password'];
    require('init.php');
    $sql="SELECT * FROM t_user WHERE uname='$uname' AND pwd='$password'";
    $result=mysqli_query($conn,$sql);
    $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $err=['code'=>-1,'msg'=>'用户名或密码错误'];
    if($rows){
        session_start();
        $_SESSION['uname']=$uname;
        $_SESSION['uid']=$rows[0]['uid'];
        $_SESSION['isLogin']=1;
        $rows[]=$_SESSION['isLogin'];
        echo json_encode($rows);
    }else{
        echo json_encode($err);
    }
?>