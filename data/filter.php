<?php
     header('content-type:application/json;charset=utf-8');
     @$class=$_REQUEST['class'];
     require('init.php');
     $sql="SELECT pname,pid,price,rating,isIndex,discount,img_l,weight FROM t_product WHERE class LIKE '%$class%'";
     $result=mysqli_query($conn,$sql);
     $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
     if($rows!==[]){
         echo json_encode($rows);
     }else{
        echo '{"code":-1,"msg":"没有符合条件的结果"}';
     }

?>