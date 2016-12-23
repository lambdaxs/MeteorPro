var require = meteorInstall({"lib":{"collections":{"posts.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// lib/collections/posts.js                                                                  //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
/**                                                                                          // 1
 * Created by xiaos on 16/12/22.                                                             //
 */                                                                                          //
PostsCollection = new Mongo.Collection('posts');                                             // 4
///////////////////////////////////////////////////////////////////////////////////////////////

}},"router.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// lib/router.js                                                                             //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
/**                                                                                          // 1
 * Created by xiaos on 16/12/22.                                                             //
 */                                                                                          //
Router.configure({                                                                           // 4
    //使用layout模板作为所以路由的默认布局                                                                  // 5
    layoutTemplate: 'layout',                                                                // 6
    loadingTemplate: 'loading',                                                              // 7
    notFoundTemplate: 'notFound',                                                            // 8
    waitOn: function () {                                                                    // 9
        function waitOn() {                                                                  // 4
            return Meteor.subscribe('posts');                                                // 10
        }                                                                                    // 11
                                                                                             //
        return waitOn;                                                                       // 4
    }()                                                                                      // 4
});                                                                                          // 4
                                                                                             //
//路径=>模板                                                                                     // 14
                                                                                             //
//首页                                                                                         // 16
Router.route('/', {                                                                          // 17
    name: 'postsList'                                                                        // 18
});                                                                                          // 17
                                                                                             //
//具体帖子                                                                                       // 21
Router.route('/posts/:_id', {                                                                // 22
    name: 'postDetail',                                                                      // 23
    data: function () {                                                                      // 24
        function data() {                                                                    // 22
            var id = this.params._id;                                                        // 25
            return PostsCollection.findOne(id);                                              // 26
        }                                                                                    // 27
                                                                                             //
        return data;                                                                         // 22
    }()                                                                                      // 22
});                                                                                          // 22
                                                                                             //
//当数据源为空时                                                                                    // 30
Router.onBeforeAction('dataNotFound', {                                                      // 31
    only: 'postDetail'                                                                       // 32
});                                                                                          // 31
///////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"publish.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// server/publish.js                                                                         //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
/**                                                                                          // 1
 * Created by xiaos on 16/12/22.                                                             //
 */                                                                                          //
                                                                                             //
Meteor.publish('posts', function () {                                                        // 5
    return PostsCollection.find();                                                           // 5
});                                                                                          // 5
                                                                                             //
Meteor.publish("userData", function () {                                                     // 7
    return Meteor.users.find({ _id: this.userId }, { fields: { 'other': 1, 'things': 1 } });
});                                                                                          // 10
                                                                                             //
Meteor.publish("allUserData", function () {                                                  // 12
    return Meteor.users.find({}, { fields: { 'nested.things': 1 } });                        // 13
});                                                                                          // 14
///////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":["meteor/meteor",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// server/main.js                                                                            //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});                  // 1
                                                                                             //
Meteor.startup(function () {                                                                 // 3
                                                                                             //
    if (PostsCollection.find().count() === 0) {                                              // 5
        PostsCollection.insert({                                                             // 6
            title: '今天特价干烧水煮鱼',                                                              // 7
            url: 'http://www.baidu.com'                                                      // 8
        });                                                                                  // 6
        PostsCollection.insert({                                                             // 10
            title: '垃圾和合谷',                                                                  // 11
            url: 'http://www.baidu.com'                                                      // 12
        });                                                                                  // 10
        PostsCollection.insert({                                                             // 14
            title: '大展身手的Meteor',                                                            // 15
            url: 'http://www.baidu.ocm'                                                      // 16
        });                                                                                  // 14
    }                                                                                        // 18
});                                                                                          // 19
///////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./lib/collections/posts.js");
require("./lib/router.js");
require("./server/publish.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
