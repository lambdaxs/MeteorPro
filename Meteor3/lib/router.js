/**
 * Created by xiaos on 16/12/22.
 */
Router.configure({
    //使用layout模板作为所以路由的默认布局
    layoutTemplate:'layout',
    loadingTemplate: 'loading',
    notFoundTemplate:'notFound',
    waitOn() {
        return Meteor.subscribe('posts')
    }
})

//路径=>模板

//首页
Router.route('/',{
    name:'postsList'
})

//具体帖子
Router.route('/posts/:_id',{
    name:'postDetail',
    data(){
        const id = this.params._id
        return PostsCollection.findOne(id)
    }
})

//当数据源为空时
Router.onBeforeAction('dataNotFound',{
    only:'postDetail'
})