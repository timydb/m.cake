var app=angular.module('myApp',['ionic']);
app.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider',function($stateProvider,$urlRouterProvider,$ionicConfigProvider){
    $stateProvider.state('main',{
        url:'/main',
        templateUrl:'tpl/main.html',
        controller:'mainCtrl'
    }).state('product',{
        url:'/product',
        templateUrl:'tpl/product.html',
        controller:'proCtrl'
    }).state('single',{
        url:'/single/:pid',
        templateUrl:'tpl/single.html',
        controller:'singleCtrl'
    }).state('cart',{
        url:'/cart',
        templateUrl:'tpl/cart.html',
        controller:'cartCtrl'
    }).state('register',{
        url:'/register',
        templateUrl:'tpl/register.html',
        controller:'logRegCtrl'
    }).state('order',{
        url:'/order/:cartDetail/:total',
        templateUrl:'tpl/order.html',
        controller:'orderCtrl'
    }).state('myorder',{
        url:'/myorder',
        templateUrl:'tpl/myorder.html',
        controller:'myorderCtrl'
    });
    $urlRouterProvider.otherwise('/main');
    $ionicConfigProvider.tabs.position('bottom');
}]);
app.service('$customHttp',['$http','$ionicLoading',function($http,$ionicLoading){
    this.get=function(url,succFunc){
        $ionicLoading.show({
            template:'正在加载...'
        });
        $http.get(url).success(function(data){
            $ionicLoading.hide();
            succFunc(data);
        });
    }
}]);
app.controller('rootCtrl',['$scope','$customHttp','$ionicPopup','$state',function($scope,$customHttp,$ionicPopup,$state){
    $scope.jump=function(state,param){
        if((state=="cart"||state=="myorder")&&(sessionStorage['isLogin']!=1)){
            $state.go('register');
        }else{
            $state.go(state,param);
        }
    };
    $scope.edit={right:"",left:""};
    $scope.cart={sum:parseInt(sessionStorage['cart'])};
    if(!sessionStorage['isLogin']){
        $scope.quit={quit:false};
    }else{
        $scope.quit={quit:true};
    }
    $scope.logout=function(){
        var confirm=$ionicPopup.confirm({
            title:"确定退出？",
            cancelText:"取消",
            cancelType:"button-outline button-orange",
            okText:"确定",
            okType:"button-orange"
        });
        confirm.then(function(res){
            if(res){
                $customHttp.get('data/logout.php',function(data){
                    if(data.code==1){
                        sessionStorage.removeItem('uname');
                        sessionStorage.removeItem('cart');
                        sessionStorage.removeItem('isLogin');
                        $scope.quit.quit=false;
                        $scope.cart.sum=0;
                        $scope.jump('register');
                    }
                })
            }

        });

    }

}]);
app.controller('mainCtrl',['$scope','$customHttp',function($scope,$customHttp){
    $customHttp.get('data/index.php',function(data){
        $scope.data=data;

    })
}]);
app.controller('proCtrl',['$scope','$customHttp','$ionicSideMenuDelegate',function($scope,$customHttp,$ionicSideMenuDelegate){
    $scope.data=[];
    $scope.hasMore=true;
    $scope.load=function(){
        $customHttp.get('data/productlist.php?start='+$scope.data.length,function(data){
            $scope.data=$scope.data.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if(data.length<8){
                $scope.hasMore=false;
            }
        })
    };
    $scope.open=function(){
        $ionicSideMenuDelegate.toggleRight();
    };
    $scope.list=['戚风蛋糕','海绵蛋糕','慕斯','芝士','提拉米苏'];
    $scope.search=function(index){
        $customHttp.get('data/filter.php?class='+$scope.list[index],function(data){
            if(!data.code){
                $scope.data=data;
                $scope.hasMore=false;
                $scope.open();
            }
        })
    }
    $scope.load();
}]);
app.controller('singleCtrl',['$scope','$customHttp','$stateParams','$ionicSlideBoxDelegate','$ionicPopup','$httpParamSerializerJQLike',function($scope,$customHttp,$stateParams,$ionicSlideBoxDelegate,$ionicPopup,$httpParamSerializerJQLike){
    var pid=$stateParams.pid;
    $customHttp.get('data/single.php?pid='+pid,function(data){
        $scope.imgs=data.images;
        $scope.data=data.msg[0];
        $scope.weight=data.msg[0].weight.split(",");
        $ionicSlideBoxDelegate.update();
        $ionicSlideBoxDelegate.loop(true);
        $scope.msg.pid=$scope.data.pid;
    });
   $scope.go=function(index){
       $ionicSlideBoxDelegate.slide(index);
   };
   $scope.msg={count:1};
   $scope.add=function(){
       if(sessionStorage['isLogin']!=1){
           $scope.jump('register');
       }else if($scope.msg.weight){
            var myPopup = $ionicPopup.show({
                template: '<div class="count"><button class="button button-outline button-dark button-small" ng-click="calc(-1)">-</button><input type="text" ng-model="msg.count" value=msg.count><button class="button button-outline button-dark button-small" ng-click="calc(1)">+</button></div>',
                title: '请选择购买数量',
                scope: $scope,
                buttons: [
                    {
                        text: '取消' ,
                        type:'button-orange button-outline'
                    },
                    {
                        text: '<b>确定</b>',
                        type: 'button-orange',
                        onTap: function(){
                            return $scope.msg.count;
                        }
                    }
                ]
            });
            $scope.calc=function(x){
                if(!($scope.msg.count==1&&x==-1)){
                    $scope.msg.count+=x;
                }
            };
            myPopup.then(function(res){
                if(res){
                    var msg=$httpParamSerializerJQLike($scope.msg);
                    $customHttp.get('data/cart_add.php?'+msg,function(data){
                        $scope.cart.sum+=parseInt(res);
                        sessionStorage['cart']=$scope.cart.sum;
                    })
                }

            });
        }else{
            var myAlert=$ionicPopup.alert({
                title: '请选择产品规格',
                okText:'我知道了',
                okType:'button-orange'
            })
        }


   }
}]);
app.controller('logRegCtrl',['$scope','$customHttp','$httpParamSerializerJQLike','$http',function($scope,$customHttp,$httpParamSerializerJQLike,$http){
    $scope.isLogin=true;
    $scope.toLog=function(){
        $scope.isLogin=false;
    };
    $scope.login={};
    $scope.goLogin=function(){
        var data=$httpParamSerializerJQLike($scope.login);
        $customHttp.get('data/login.php?'+data,function(data){
            if(!data.msg){
                sessionStorage['isLogin']=data[1];
                sessionStorage['uname']=data[0].uname;
                $scope.quit.quit=true;
                $customHttp.get('data/cart_select.php',function(data){
                    $scope.cart.sum=parseInt(data.slice(-1));
                    sessionStorage['cart']=$scope.cart.sum;
                    $scope.jump('product');
                });
            }else{
                $scope.err=data.msg;
            }
        });

    };
    $scope.user={};
    $scope.sub=function(){
        var data=$httpParamSerializerJQLike($scope.user);
        $http({
            url:'data/register.php',
            data:data,
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            method:'post'
        }).success(function(data){
            $scope.isLogin=true;
            $scope.user={};
            $scope.err='注册成功！请登录'
        });
    };
    $scope.check=function(x){
        var data=$scope.user[x];
        $http.get('data/check.php?'+x+'='+data).success(function(data){
            if(data.length!==0){
                switch(x){
                    case 'user_name':
                        $scope.msg1='该用户名已存在！';
                        break;
                    case 'phone':
                        $scope.msg2='该手机号已注册！';
                        break;
                    case 'email':
                        $scope.msg3='该邮箱已注册！';
                        break;
                }
            }else{
                switch(x){
                    case 'user_name':
                        $scope.msg1='';
                        break;
                    case 'phone':
                        $scope.msg2='';
                        break;
                    case 'email':
                        $scope.msg3='';
                        break;
                }
            }
        })
    }
}]);
app.controller('cartCtrl',['$scope','$customHttp','$ionicPopup',function($scope,$customHttp,$ionicPopup){
    $customHttp.get('data/cart_select.php',function(data){
        $scope.data=data.slice(0,-1);
        $scope.cart.sum=data[data.length-1];
        sessionStorage['cart']=data[data.length-1];
    });
    $scope.edit.right="编辑";
    $scope.canEdit=true;
    $scope.toggleEdit=function(){
        $scope.canEdit=!$scope.canEdit;
        if($scope.canEdit){
            $scope.edit.right="编辑";
        }else{
            $scope.edit.right="完成";
        }
    };
    $scope.del=function(index){
        var myConfirm=$ionicPopup.confirm({
            title:"确定删除？",
            okText:"确定",
            okType:"button-orange",
            cancelText:"取消",
            cancelType:"button-outline button-orange"
        });
        myConfirm.then(function(res){
            if(res){
                $customHttp.get('data/cart_add.php?pid='+$scope.data[index].pid+"&weight="+$scope.data[index].weight+"&count=-3",function (data) {
                    if(data.code==2){
                        $scope.cart.sum = $scope.cart.sum - $scope.data[index].count;
                        sessionStorage['cart']=$scope.cart.sum;
                        $scope.data.splice(index, 1);
                    }
                });
            }
        });
    };
    $scope.add=function(index,count,pid,weight){
        var data="count="+count+"&pid="+pid+"&weight="+weight;
        $customHttp.get('data/cart_add.php?'+data,function(data){
            if(data.code==2){
                if(count==-1){
                    $scope.data[index].count++;
                    $scope.cart.sum++;
                    sessionStorage['cart']=$scope.cart.sum;
                }else{
                    $scope.data[index].count--;
                    $scope.cart.sum--;
                    sessionStorage['cart']=$scope.cart.sum;
                }

            }

        });
    };
    $scope.total={};
    $scope.totalprice=0;
    $scope.isChange=function(){
        $scope.totalprice=0;
        $scope.cartDetail=[];
        angular.forEach($scope.total,function(v,k){
            if(v==true){
                $scope.totalprice+=parseInt($scope.data[k].price*$scope.data[k].count);
                $scope.cartDetail.push($scope.data[k]);
            }
        });
    };
    $scope.toOrder=function(){
        if($scope.cartDetail&&$scope.cartDetail.length!=0){
            var result=angular.toJson($scope.cartDetail);
            $scope.jump('order',{cartDetail:result,total:$scope.totalprice});
        }else{
            var alert=$ionicPopup.alert({
                title:"请选择商品",
                okText:"我知道了",
                okType:"button-orange"
            });
        }
    }
}]);
app.controller('orderCtrl', ['$scope','$stateParams','$httpParamSerializerJQLike','$customHttp','$ionicPopup',function ($scope,$stateParams,$httpParamSerializerJQLike,$customHttp,$ionicPopup){
            var totalCount = 0;
            angular.forEach(
                angular.fromJson($stateParams.cartDetail),
                function (value, key) {
                    totalCount += parseInt(value.count);
                }
            );
            $scope.order = {
                cartDetail: $stateParams.cartDetail,
                totalprice: $stateParams.total
            };

            $scope.submitOrder = function () {
                var result = $httpParamSerializerJQLike($scope.order);
                $customHttp.get(
                    'data/order_add.php?' + result,
                    function (data) {
                        if (data[0].msg = 'succ') {
                            $scope.cart.sum -= totalCount;
                            sessionStorage['cart']=$scope.cart.sum;
                            var dialog=$ionicPopup.show({
                                title: '下单成功，订单编号为'+data[0].oid,
                                scope: $scope,
                                buttons: [
                                    {
                                        text: '回首页',
                                        type:'button-orange button-outline'
                                    },
                                    {
                                        text: '<b>查看订单</b>',
                                        type: 'button-orange',
                                        onTap:function(){
                                            return data[0].oid
                                        }
                                    }
                                ]
                            });
                            dialog.then(function(res){
                                if(res){
                                    $scope.jump('myorder');
                                }else{
                                    $scope.jump('main');
                                }
                            });

                        }
                        else {
                            $scope.result = "下单失败！";
                        }
                    }
                )
            }
        }
    ]);
app.controller('myorderCtrl',['$scope','$customHttp',function($scope,$customHttp){
    $customHttp.get('data/order_getbyuserid.php',function(data){
        $scope.orderList=data.data;
    })
}]);

